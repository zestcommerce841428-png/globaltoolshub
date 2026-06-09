const fs = require('fs');
const html = fs.readFileSync('blog.html', 'utf8');

const regex = /<script>\s*const posts =[\s\S]*?<\/script>/i;
const match = html.match(regex);
if (match) {
  let js = match[0].replace(/<\/?script>/g, '');
  fs.writeFileSync('temp.js', js);
  console.log("Wrote temp.js");
} else {
  console.log("No inline JS block found in blog.html");
}
