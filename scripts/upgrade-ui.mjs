import fs from 'fs/promises';
import path from 'path';

const root = process.cwd();

const targetTools = [
  "jwt-decoder", "json-diff", "css-gradient", "meta-tag-generator",
  "box-shadow", "markdown-preview", "base64-encoder-decoder",
  "url-encoder-decoder", "lorem-ipsum-generator", "uuid-generator",
  "html-minifier", "css-minifier", "js-minifier", "color-converter",
  "qr-code-generator"
];

const staticPages = [
  "about.html", "contact.html", "privacy.html", "terms.html",
  "accessibility.html", "disclaimer.html", "cookies.html", "security.html", "index.html"
]; // index.html is also a static page to upgrade now

async function updateTool(toolName) {
  const p = path.join(root, "legacy/online-tools", toolName, "index.html");
  let html;
  try {
     html = await fs.readFile(p, "utf-8");
  } catch(e) {
     return;
  }

  // Remove old hardcoded headers/footers if they exist
  html = html.replace(/<header[\s\S]*?<\/header>/, '<global-header></global-header>');
  html = html.replace(/<footer[\s\S]*?<\/footer>/, '<global-footer></global-footer>');

  html = html.replace(/<a href="\.\.\/\.\.\/" class="back">← Back to GlobalToolsHub<\/a>/, '');
  
  if (!html.includes('<global-header')) {
    html = html.replace('<body>', `<body data-bg="clean">\n<global-header></global-header>\n<main class="page-main shell py-8">`);
  }
  if (!html.includes('<global-footer')) {
    html = html.replace('</body>', `</main>\n<global-footer></global-footer>\n</body>`);
  }
  
  if (!html.includes('assets/components.js')) {
    html = html.replace('</head>', `<script src="../../assets/components.js?v=2" defer></script>\n</head>`);
  }
  
  await fs.writeFile(p, html);
  console.log(`Updated tool ${toolName}`);
}

async function updateStaticPage(fileName) {
  const p = path.join(root, fileName);
  let html;
  try {
     html = await fs.readFile(p, "utf-8");
  } catch(e) {
     console.log(`Skipping ${fileName} - not found`);
     return;
  }

  if (html.includes('<header')) {
    html = html.replace(/<header[\s\S]*?<\/header>/, '<global-header></global-header>');
  } else if (!html.includes('<global-header')) {
    html = html.replace(/<body[^>]*>/, `$& \n<global-header></global-header>`);
  }

  if (html.includes('<footer')) {
    html = html.replace(/<footer[\s\S]*?<\/footer>/, '<global-footer></global-footer>');
  } else if (!html.includes('<global-footer')) {
    html = html.replace('</body>', `<global-footer></global-footer>\n</body>`);
  }
  
  if (!html.includes('assets/components.js')) {
    html = html.replace('</head>', `<script src="assets/components.js?v=2" defer></script>\n</head>`);
  }
  
  await fs.writeFile(p, html);
  console.log(`Updated static page ${fileName}`);
}

async function main() {
  for (const t of targetTools) await updateTool(t);
  for (const s of staticPages) await updateStaticPage(s);
}
main();
