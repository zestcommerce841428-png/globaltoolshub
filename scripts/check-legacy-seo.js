const fs = require('fs');
const path = require('path');
const root = process.cwd();
const legacyRoot = path.join(root, 'legacy');

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : full;
  });
}

const htmlFiles = walk(legacyRoot).filter((file) => file.endsWith('.html'));
const problems = [];
for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (!/<link\s+rel=['\"]canonical['\"]/i.test(content)) problems.push(`${path.relative(root, file)}: missing canonical`);
  if (!/<meta\s+property=['\"]og:url['\"]/i.test(content)) problems.push(`${path.relative(root, file)}: missing og:url`);
  if (!/<script\s+type=['\"]application\/ld\+json['\"]\s+data-globaltoolshub-seo/i.test(content)) problems.push(`${path.relative(root, file)}: missing data-globaltoolshub-seo`);
}
if (problems.length) {
  console.log('PROBLEMS', problems.length);
  console.log(problems.slice(0, 100).join('\n'));
  process.exit(1);
}
console.log('SEO OK');
