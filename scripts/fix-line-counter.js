const fs = require('fs');
let c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');

c = c.replace(/`Total Lines: \$\{lines\.length\}\\nNon-Empty: \$\{lines\.filter\(l=>l\.trim\(\)\)\.length\}`/g, "'Total Lines: ' + lines.length + '\\nNon-Empty: ' + lines.filter(l=>l.trim()).length");

fs.writeFileSync('scripts/generate-68-tools.mjs', c);
