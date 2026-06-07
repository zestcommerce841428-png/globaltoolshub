const fs = require('fs');

function checkFileSyntax(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const match = content.match(/<script>([\s\S]*?)<\/script>/);
  if (match) {
    try {
      new Function(match[1]);
      console.log(filePath, 'Inline Script Syntax OK');
    } catch (e) {
      console.error(filePath, 'Inline Script Syntax Error:', e.message);
      console.log(match[1].substring(0, 500));
    }
  } else {
    console.log(filePath, 'No inline script found');
  }
}

try {
  new Function(fs.readFileSync('assets/components.js', 'utf8'));
  console.log('components.js Syntax OK');
} catch(e) {
  console.log('components.js Syntax Error:', e.message);
}

checkFileSyntax('blog.html');
