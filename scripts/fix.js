const fs = require('fs');
let c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');
c = c.replace(/\\`/g, '`');
c = c.replace(/\\\${/g, '${');
fs.writeFileSync('scripts/generate-68-tools.mjs', c);
console.log('Fixed escape chars');
