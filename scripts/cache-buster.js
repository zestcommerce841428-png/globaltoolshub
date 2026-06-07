const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.html') || fullPath.endsWith('.mjs')) {
      let c = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      if (c.includes('assets/styles.css"')) { c = c.replace(/assets\/styles\.css"/g, 'assets/styles.css?v=2"'); changed = true; }
      if (c.includes('assets/site.css"')) { c = c.replace(/assets\/site\.css"/g, 'assets/site.css?v=2"'); changed = true; }
      if (c.includes('assets/components.js"')) { c = c.replace(/assets\/components\.js"/g, 'assets/components.js?v=2"'); changed = true; }
      if (c.includes('assets/app.js"')) { c = c.replace(/assets\/app\.js"/g, 'assets/app.js?v=2"'); changed = true; }
      if (changed) {
        fs.writeFileSync(fullPath, c);
      }
    }
  }
}

processDir(process.cwd());
console.log('Cache busting applied.');
