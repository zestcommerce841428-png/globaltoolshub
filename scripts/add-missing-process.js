const fs = require('fs');
const path = require('path');

console.log('\n🔧 ADDING MISSING process() FUNCTIONS\n');
console.log('='.repeat(70));

const advancedToolsDir = path.join(__dirname, '../legacy/advanced-tools');

// Tools that need process() functions added
const toolsToFix = {
  'image-to-base64': `
function process() {
  const input = document.getElementById('imageInput');
  const output = document.getElementById('output');
  const file = input.files[0];
  if (!file) { alert('Please select an image'); return; }
  const reader = new FileReader();
  reader.onload = (e) => { output.value = e.target.result; };
  reader.readAsDataURL(file);
}`,
  
  'json-formatter': `
function process() {
  formatJSON();
}`,
  
  'json-to-csv': `
function process() {
  const input = document.getElementById('input').value;
  if (!input) { alert('Please enter JSON'); return; }
  try {
    const data = JSON.parse(input);
    const array = Array.isArray(data) ? data : [data];
    const keys = Object.keys(array[0]);
    let csv = keys.join(',') + '\\n';
    array.forEach(obj => {
      csv += keys.map(k => JSON.stringify(obj[k] || '')).join(',') + '\\n';
    });
    document.getElementById('output').value = csv;
  } catch(e) {
    alert('Invalid JSON: ' + e.message);
  }
}`,
  
  'password-generator': `
function process() {
  generatePassword();
}`,
  
  'sha256-hash': `
async function process() {
  const input = document.getElementById('input').value;
  if (!input) { alert('Please enter text'); return; }
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById('output').value = hashHex;
}`,
  
  'sha512-hash': `
async function process() {
  const input = document.getElementById('input').value;
  if (!input) { alert('Please enter text'); return; }
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hash = await crypto.subtle.digest('SHA-512', data);
  const hashArray = Array.from(new Uint8Array(hash));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  document.getElementById('output').value = hashHex;
}`,
  
  'text-case-converter': `
function process() {
  convertCase();
}`
};

let fixed = 0;

Object.keys(toolsToFix).forEach(toolName => {
  const indexPath = path.join(advancedToolsDir, toolName, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.log(`❌ ${toolName} - File not found`);
    return;
  }

  try {
    let content = fs.readFileSync(indexPath, 'utf8');
    
    // Check if process() already exists
    if (content.includes('function process()')) {
      console.log(`✓  ${toolName} - Already has process() function`);
      return;
    }

    // Add process() function before closing </script> tag
    const processFunc = toolsToFix[toolName];
    content = content.replace(/<\/script>/, processFunc + '\n    </script>');

    // Also fix buttons to call process()
    content = content.replace(/onclick="[^"]*"/g, (match) => {
      if (!match.includes('process()') && !match.includes('copy') && !match.includes('clear') && !match.includes('download')) {
        return 'onclick="process()"';
      }
      return match;
    });

    fs.writeFileSync(indexPath, content, 'utf8');
    console.log(`✅ ${toolName} - Added process() function`);
    fixed++;

  } catch (error) {
    console.log(`❌ ${toolName} - Error: ${error.message}`);
  }
});

console.log('\n' + '='.repeat(70));
console.log(`\n📊 Added process() to ${fixed} tools\n`);
