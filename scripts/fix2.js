const fs = require('fs');
let c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');

c = c.replace(/innerHTML = \`([^\`]+)\`/g, (m, p1) => {
  return 'innerHTML = "' + p1.replace(/\$\{([^}]+)\}/g, '" + $1 + "') + '"';
});
c = c.replace(/value = \`([^\`]+)\`/g, (m, p1) => {
  return 'value = "' + p1.replace(/\$\{([^}]+)\}/g, '" + $1 + "') + '"';
});

fs.writeFileSync('scripts/generate-68-tools.mjs', c);
console.log('Fixed backticks in innerHTML/value assignments');
