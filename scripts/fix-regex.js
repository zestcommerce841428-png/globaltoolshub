const fs = require('fs');
let c = fs.readFileSync('scripts/generate-blogs.mjs', 'utf8');

c = c.replace(/const titleMatch = [^\n]+;/g, "const titleMatch = html.match(/<h[12][^>]*>\\s*<a[^>]*>(.*?)<\\/a>\\s*<\\/h[12]>/i) || html.match(/<h1[^>]*>(.*?)<\\/h1>/i) || html.match(/<title>(.*?)<\\/title>/i);");

c = c.replace(/const descMatch = [^\n]+;/g, 'const descMatch = html.match(/<p>([\\s\\S]*?)<\\/p>/i) || html.match(/<meta name="description" content="(.*?)">/i);');

fs.writeFileSync('scripts/generate-blogs.mjs', c);
