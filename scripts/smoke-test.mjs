#!/usr/bin/env node
import puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs/promises';
import http from 'node:http';
import { URL } from 'node:url';

const root = process.cwd();
const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.txt': 'text/plain; charset=utf-8',
};
let fallbackServer = null;
let fallbackPort = null;

async function startStaticServer() {
  if (fallbackServer) return;
  fallbackServer = http.createServer(async (req, res) => {
    try {
      const reqUrl = new URL(req.url, 'http://127.0.0.1');
      let relPath = decodeURIComponent(reqUrl.pathname);
      if (relPath.endsWith('/')) relPath += 'index.html';
      if (relPath.startsWith('/')) relPath = relPath.slice(1);
      const fullPath = path.join(root, relPath);
      if (!fullPath.startsWith(root)) {
        res.statusCode = 403;
        res.end('Forbidden');
        return;
      }
      const data = await fs.readFile(fullPath);
      const ext = path.extname(fullPath).toLowerCase();
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      res.end(data);
    } catch (err) {
      res.statusCode = err.code === 'ENOENT' ? 404 : 500;
      res.end(err.message || 'Error');
    }
  });
  await new Promise((resolve, reject) => {
    fallbackServer.listen(0, '127.0.0.1');
    fallbackServer.on('listening', () => {
      fallbackPort = fallbackServer.address().port;
      resolve();
    });
    fallbackServer.on('error', reject);
  });
}

async function closeStaticServer() {
  if (!fallbackServer) return;
  await new Promise((resolve) => fallbackServer.close(resolve));
}

// Candidate pages to test (relative to site root)
async function discoverCandidates() {
  const out = [];
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        await walk(full);
        continue;
      }
      if (entry.isFile() && full.endsWith('.html')) {
        out.push(path.relative(root, full).replace(/\\/g, '/'));
      }
    }
  }
  try {
    await walk(root);
  } catch (e) {
    console.error('Error discovering HTML pages:', e);
  }
  return out.sort();
}

async function fileUrl(relative) {
  const p = path.join(root, relative);
  try {
    await fs.access(p);
  } catch {
    return null;
  }

  // prefer local http server if available
  const httpUrl = `http://localhost:4173/${relative}`;
  try {
    await new Promise((resolve, reject) => {
      const req = http.request(httpUrl, { method: 'HEAD', timeout: 2000 }, (res) => {
        res.destroy();
        resolve();
      });
      req.on('error', reject);
      req.on('timeout', () => { req.destroy(); reject(new Error('timeout')); });
      req.end();
    });
    return httpUrl;
  } catch (_) {
    await startStaticServer();
    return `http://127.0.0.1:${fallbackPort}/${relative}`;
  }
}

async function isRedirectPage(relative) {
  const p = path.join(root, relative);
  try {
    const html = await fs.readFile(p, 'utf8');
    const normalized = html.toLowerCase();
    return normalized.includes('http-equiv="refresh"') || normalized.includes('http-equiv=refresh');
  } catch {
    return false;
  }
}

async function run() {
  console.log('Launching headless browser...');
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.setDefaultNavigationTimeout(30000);

  const results = [];

  const candidates = await discoverCandidates();
  for (const rel of candidates) {
    if (await isRedirectPage(rel)) {
      console.log(`Skipping redirect page: ${rel}`);
      results.push({ page: rel, redirect: true });
      continue;
    }

    const url = await fileUrl(rel);
    if (!url) {
      console.log(`Skipping (not found): ${rel}`);
      continue;
    }

    const record = { page: rel, consoleErrors: [], pageErrors: [], networkFailures: [] };

    page.on('console', (msg) => {
      if (msg.type() === 'error') record.consoleErrors.push(msg.text());
    });
    page.on('pageerror', (err) => record.pageErrors.push(err.message || String(err)));

    // network failures / 4xx/5xx
    page.on('requestfailed', (req) => {
      record.networkFailures.push({ url: req.url(), errorText: req.failure() ? req.failure().errorText : 'failed' , method: req.method(), resourceType: req.resourceType() });
    });
    page.on('response', (res) => {
      const status = res.status();
      if (status >= 400) {
        record.networkFailures.push({ url: res.url(), status, resourceType: res.request().resourceType(), method: res.request().method() });
      }
    });

    console.log(`Loading ${rel} ...`);
    try {
      await page.goto(url, { waitUntil: 'load' });
      // small delay to allow deferred scripts to run
      await new Promise((r) => setTimeout(r, 500));
    } catch (e) {
      record.pageErrors.push(`Navigation failed: ${e.message}`);
    }

    results.push(record);
    // remove listeners to avoid duplicate accumulation
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
    page.removeAllListeners('requestfailed');
    page.removeAllListeners('response');
  }

  await browser.close();
  await closeStaticServer();

  let failures = 0;
  console.log('\nSmoke test results:');
  for (const r of results) {
    if (r.redirect) {
      console.log(`\nPage: ${r.page}`);
      console.log('  Skipped redirect-only page.');
      continue;
    }

    const has = (r.consoleErrors.length + r.pageErrors.length + (r.networkFailures ? r.networkFailures.length : 0)) > 0;
    console.log(`\nPage: ${r.page}`);
    console.log(`  Console errors: ${r.consoleErrors.length}`);
    r.consoleErrors.slice(0, 10).forEach((c) => console.log(`    - ${c}`));
    console.log(`  Page errors: ${r.pageErrors.length}`);
    r.pageErrors.slice(0, 10).forEach((p) => console.log(`    - ${p}`));
    console.log(`  Network failures: ${r.networkFailures ? r.networkFailures.length : 0}`);
    (r.networkFailures || []).slice(0, 20).forEach((n) => {
      if (n.status) console.log(`    - ${n.method} ${n.url} -> ${n.status} (${n.resourceType})`);
      else console.log(`    - ${n.method} ${n.url} -> ${n.errorText} (${n.resourceType})`);
    });
    if (has) failures += 1;
  }

  if (failures > 0) {
    console.log(`\nSMOKE TEST FAILED: ${failures} page(s) reported errors.`);
    process.exit(2);
  }

  console.log('\nSMOKE TEST PASSED: No console/page errors detected on tested pages.');
  process.exit(0);
}

run().catch((e) => { console.error(e); process.exit(1); });
