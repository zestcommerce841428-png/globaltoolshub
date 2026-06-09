const fs = require('fs');
let c = fs.readFileSync('blog.html', 'utf8');
let m = c.match(/<script>([\s\S]*?)<\/script>/);
if (m) fs.writeFileSync('debug-blog.js', m[1].trim());
