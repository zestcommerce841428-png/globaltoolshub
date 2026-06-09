const fs = require('fs');
const c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');

const tools = [...c.matchAll(/id:\s*['"](.*?)['"][\s\S]*?js:\s*`([\s\S]*?)`/g)];

for (const t of tools) {
  if (t[2].includes("document.getElementById('output').value = document.getElementById('input').value;")) {
    console.log(t[1]);
  }
}
