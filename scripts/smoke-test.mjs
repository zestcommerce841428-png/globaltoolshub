#!/usr/bin/env node
import puppeteer from 'puppeteer';
import path from 'node:path';
import fs from 'node:fs/promises';
import http from 'node:http';

const root = process.cwd();

// Candidate pages to test (relative to site root)
async function discoverCandidates() {
  const out = ['index.html', 'legacy/index.html'];
  try {
    const entries = await fs.readdir(path.join(root, 'legacy'), { withFileTypes: true });
    for (const e of entries) {
      if (e.isDirectory()) {
        const p = path.join('legacy', e.name, 'index.html');
        try { await fs.access(path.join(root, p)); out.push(p); } catch (err) { /* skip missing */ }
      }
    }
  } catch (e) { /* ignore */ }
  return out;
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
    return `file://${p.replaceAll('\\', '/')}`;
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

  let failures = 0;
  console.log('\nSmoke test results:');
  for (const r of results) {
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
