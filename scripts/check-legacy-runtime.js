const fs = require('fs');
const path = require('path');
const root = process.cwd();
const errors = [];

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile() || !full.endsWith('.html')) continue;
    const rel = path.relative(root, full).replace(/\\/g, '/');
    if (!rel.startsWith('legacy/')) continue;
    const content = fs.readFileSync(full, 'utf8');
    const m = content.match(/<script src="([^"]*seo-runtime\.js)" defer><\/script>/);
    if (!m) return;
    const actual = m[1];
    const expected = path.relative(path.dirname(full), path.join(root, 'assets', 'seo-runtime.js')).replace(/\\/g, '/');
    if (actual !== expected) errors.push({ file: rel, actual, expected });
  }
}

walk(root);
if (errors.length) {
  console.log('MISMATCHES', errors.length);
  errors.slice(0, 50).forEach(e => console.log(`${e.file} -> actual='${e.actual}' expected='${e.expected}'`));
  process.exit(1);
}
console.log('OK');
