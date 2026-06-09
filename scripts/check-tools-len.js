const fs = require('fs');
const c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');

const tools = [...c.matchAll(/id:\s*['"](.*?)['"][\s\S]*?js:\s*`([\s\S]*?)`/g)];

for (const t of tools) {
  console.log(t[1], t[2].length);
  if (t[2].length < 100) {
    console.log("SHORT JS: ", t[2]);
  }
}
