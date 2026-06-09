const fs = require('fs');

let c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');

function injectJS(id, code) {
  const regex = new RegExp(`id:\\s*["']${id}["'][\\s\\S]*?js:\\s*\`[\\s\\S]*?\``);
  c = c.replace(regex, match => match.replace(/js:\s*`[\s\S]*?`$/, 'js: `\\n' + code + '\\n    `'));
}

injectJS('binary-to-text', "function process() { try { document.getElementById('output').value = document.getElementById('input').value.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join(''); } catch(e) { document.getElementById('output').value = 'Invalid Binary'; } }");
injectJS('text-to-binary', "function process() { document.getElementById('output').value = Array.from(document.getElementById('input').value).map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' '); }");
injectJS('hex-to-text', "function process() { try { const hex = document.getElementById('input').value.replace(/\\s/g, ''); let str = ''; for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16)); document.getElementById('output').value = str; } catch(e) { document.getElementById('output').value = 'Invalid Hex'; } }");
injectJS('text-to-hex', "function process() { document.getElementById('output').value = Array.from(document.getElementById('input').value).map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' '); }");
injectJS('ascii-to-text', "function process() { try { document.getElementById('output').value = document.getElementById('input').value.split(' ').map(b => String.fromCharCode(parseInt(b, 10))).join(''); } catch(e) { document.getElementById('output').value = 'Invalid ASCII'; } }");
injectJS('text-to-ascii', "function process() { document.getElementById('output').value = Array.from(document.getElementById('input').value).map(c => c.charCodeAt(0).toString(10)).join(' '); }");
injectJS('rot13-encoder', "function process() { document.getElementById('output').value = document.getElementById('input').value.replace(/[a-zA-Z]/g, function(c){return String.fromCharCode((c<='Z'?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);}); }");
injectJS('decimal-to-binary', "function process() { const n = parseInt(document.getElementById('input').value, 10); document.getElementById('output').value = isNaN(n) ? 'Invalid' : n.toString(2); }");
injectJS('decimal-to-hex', "function process() { const n = parseInt(document.getElementById('input').value, 10); document.getElementById('output').value = isNaN(n) ? 'Invalid' : n.toString(16).toUpperCase(); }");
injectJS('percentage-calculator', "function process() { const input = document.getElementById('input').value; const m = input.match(/(\\d+)\\s*%\\s*of\\s*(\\d+)/i); if(m) { document.getElementById('output').value = (parseFloat(m[1]) / 100) * parseFloat(m[2]); } else { document.getElementById('output').value = 'Format: 20% of 100'; } }");
injectJS('line-counter', "function process() { const lines = document.getElementById('input').value.split('\\n'); document.getElementById('output').value = `Total Lines: ${lines.length}\\nNon-Empty: ${lines.filter(l=>l.trim()).length}`; }");

fs.writeFileSync('scripts/generate-68-tools.mjs', c);
