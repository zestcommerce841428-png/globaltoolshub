const fs = require('fs');
const c = fs.readFileSync('blog.html', 'utf8');

const regex = /"title":"(.*?)"/g;
let match;
let count = 0;
while ((match = regex.exec(c)) !== null) {
  count++;
}
console.log("Total blogs in blog.html:", count);
