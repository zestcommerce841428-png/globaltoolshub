#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const parent = path.resolve(root, '..');

const known = [
  { name: 'NakulTools-main', prefer: 'nakul-tools' },
  { name: 'online-tools-master', prefer: 'online-tools' },
  { name: 'ToolVerse-main', prefer: 'toolverse' },
  { name: 'usemagictools.github.io-main', prefer: 'usemagictools' },
  { name: 'usemagictools', prefer: 'usemagictools' },
];

const argv = process.argv.slice(2);
const doCopy = argv.includes('--copy');
const dry = argv.includes('--dry') || !doCopy;

function join(...p) { return path.join(...p); }

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

async function findCandidates() {
  const entries = await fs.readdir(parent, { withFileTypes: true });
  const folders = entries.filter(e => e.isDirectory()).map(e => e.name);
  const candidates = [];
  for (const k of known) {
    const match = folders.find(f => f.toLowerCase().startsWith(k.name.toLowerCase()));
    if (match) {
      candidates.push({ folder: path.join(parent, match), targetName: k.prefer });
    }
  }
  return candidates;
}

async function scanFolder(source, targetName) {
  const dest = join(root, 'legacy', targetName);
  const hasDest = await exists(dest);
  const summary = { source, dest, exists: hasDest, files: 0 };
  async function walk(dir) {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) await walk(p);
      else summary.files += 1;
    }
  }
  try { await walk(source); } catch (e) { /* ignore */ }
  return summary;
}

async function main() {
  console.log(dry ? 'DRY RUN — no changes will be made' : 'Performing copy (live)');
  const candidates = await findCandidates();
  if (!candidates.length) {
    console.log('No known sibling tool folders found in parent directory:', parent);
    process.exit(0);
  }

  const reports = [];
  for (const c of candidates) {
    const r = await scanFolder(c.folder, c.targetName);
    reports.push(r);
  }

  console.log('\nFound candidates:');
  for (const r of reports) {
    console.log(`- source: ${r.source}`);
    console.log(`  target: ${r.dest}`);
    console.log(`  files (recursive): ${r.files}`);
    console.log(`  target exists: ${r.exists}`);
  }

  if (dry) {
    console.log('\nDry run complete. To perform actual copy, re-run:');
    console.log('  node scripts/sync-external.mjs --copy');
    process.exit(0);
  }

  // perform copy into legacy/<targetName>
  for (const c of candidates) {
    const dest = join(root, 'legacy', c.targetName);
    console.log(`Copying ${c.folder} → ${dest}`);
    await fs.mkdir(dest, { recursive: true });
    // simple recursive copy
    async function copyDir(src, dst) {
      const entries = await fs.readdir(src, { withFileTypes: true });
      for (const e of entries) {
        const s = path.join(src, e.name);
        const d = path.join(dst, e.name);
        if (e.isDirectory()) {
          await fs.mkdir(d, { recursive: true });
          await copyDir(s, d);
        } else {
          await fs.copyFile(s, d);
        }
      }
    }
    await copyDir(c.folder, dest);
    console.log('Done.');
  }
}

main().catch((e) => { console.error(e); process.exit(1); });
