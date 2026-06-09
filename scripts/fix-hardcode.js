const fs = require('fs');
let c = fs.readFileSync('scripts/generate-blogs.mjs', 'utf8');

c = c.replace(/const count = 305;/g, "const count = topics.reduce((acc, t) => acc + t.items.length, 0);");

fs.writeFileSync('scripts/generate-blogs.mjs', c);
