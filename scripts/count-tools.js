const fs = require('fs');
const c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');

const regex = /id:\s*['"](.*?)['"]/g;
let match;
let count = 0;
while ((match = regex.exec(c)) !== null) {
  count++;
}
console.log("Total tools:", count);
