const fs = require('fs');
let c = fs.readFileSync('scripts/generate-blogs.mjs', 'utf8');
c = c.replace(/\\\\'/g, "\\'");
fs.writeFileSync('scripts/generate-blogs.mjs', c);
console.log('Fixed escape chars');
