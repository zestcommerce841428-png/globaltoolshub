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
  "accessibility.html", "disclaimer.html", "cookies.html", "security.html"
]; // blog.html will be updated by blog script

async function updateTool(toolName) {
  const p = path.join(root, "legacy/online-tools", toolName, "index.html");
  let html;
  try {
     html = await fs.readFile(p, "utf-8");
  } catch(e) {
     return;
  }

  const header = `
  <header class="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80" role="banner">
    <div class="shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
      <a href="../../index.html" class="flex min-w-0 items-center gap-3" aria-label="GlobalToolsHub home">
        <img src="../../assets/logo.svg" alt="GlobalToolsHub logo" class="h-10 w-10 shrink-0 rounded-lg" width="40" height="40" loading="eager">
        <span class="truncate text-lg font-bold tracking-normal">GlobalToolsHub</span>
      </a>
      <nav class="hidden items-center gap-4 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300" aria-label="Main navigation">
        <a href="../../index.html">Tools</a>
        <a href="../../about.html">About</a>
        <a href="../../blog.html">Blog</a>
        <a href="../../contact.html">Contact</a>
        <a href="../../privacy.html">Compliance</a>
      </nav>
      <div class="flex flex-wrap items-center gap-2">
        <select id="themeSelect" class="control w-28 sm:w-32" aria-label="Theme"></select>
        <select id="languageSelect" class="control w-24 sm:w-28" aria-label="Language"></select>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="border-t border-slate-200 py-6 text-center text-sm text-slate-500 sm:py-8 dark:border-slate-800" role="contentinfo">
    <div class="shell">
      <div class="mb-3 flex flex-wrap justify-center gap-3 sm:gap-4">
        <a href="../../about.html">About</a>
        <a href="../../blog.html">Blog</a>
        <a href="../../contact.html">Contact</a>
        <a href="../../privacy.html">Privacy</a>
        <a href="../../terms.html">Terms</a>
        <a href="../../accessibility.html">Accessibility</a>
        <a href="../../disclaimer.html">Disclaimer</a>
      </div>
      <p>Copyright 2026 GlobalToolsHub. Built from local-first browser tools.</p>
    </div>
  </footer>`;

  html = html.replace(/<a href="\.\.\/\.\.\/" class="back">← Back to GlobalToolsHub<\/a>/, '');
  
  if (!html.includes('<header')) {
    html = html.replace('<body>', `<body data-bg="clean">\n${header}\n<main class="page-main shell py-8">`);
  }
  if (!html.includes('<footer')) {
    html = html.replace('</body>', `</main>\n${footer}\n<script src="../../assets/app.js" defer></script>\n</body>`);
  }
  
  if (!html.includes('styles.css')) {
    html = html.replace('</head>', `<link rel="stylesheet" href="../../assets/styles.css">\n<link rel="stylesheet" href="../../assets/site.css">\n</head>`);
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

  const header = `
  <header class="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80" role="banner">
    <div class="shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
      <a href="index.html" class="flex min-w-0 items-center gap-3" aria-label="GlobalToolsHub home">
        <img src="assets/logo.svg" alt="GlobalToolsHub logo" class="h-10 w-10 shrink-0 rounded-lg" width="40" height="40" loading="eager">
        <span class="truncate text-lg font-bold tracking-normal">GlobalToolsHub</span>
      </a>
      <nav class="hidden items-center gap-4 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300" aria-label="Main navigation">
        <a href="index.html">Tools</a>
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="contact.html">Contact</a>
        <a href="privacy.html">Compliance</a>
      </nav>
      <div class="flex flex-wrap items-center gap-2">
        <select id="themeSelect" class="control w-28 sm:w-32" aria-label="Theme"></select>
        <select id="languageSelect" class="control w-24 sm:w-28" aria-label="Language"></select>
      </div>
    </div>
  </header>`;

  const footer = `
  <footer class="border-t border-slate-200 py-6 text-center text-sm text-slate-500 sm:py-8 dark:border-slate-800" role="contentinfo">
    <div class="shell">
      <div class="mb-3 flex flex-wrap justify-center gap-3 sm:gap-4">
        <a href="about.html">About</a>
        <a href="blog.html">Blog</a>
        <a href="contact.html">Contact</a>
        <a href="privacy.html">Privacy</a>
        <a href="terms.html">Terms</a>
        <a href="accessibility.html">Accessibility</a>
        <a href="disclaimer.html">Disclaimer</a>
      </div>
      <p>Copyright 2026 GlobalToolsHub. Built from local-first browser tools.</p>
    </div>
  </footer>`;

  if (html.includes('<header')) {
    html = html.replace(/<header[\s\S]*?<\/header>/, header);
  } else {
    html = html.replace(/<body[^>]*>/, `$& \n${header}`);
  }

  if (html.includes('<footer')) {
    html = html.replace(/<footer[\s\S]*?<\/footer>/, footer);
  } else {
    html = html.replace('</body>', `${footer}\n</body>`);
  }
  
  await fs.writeFile(p, html);
  console.log(`Updated static page ${fileName}`);
}

async function main() {
  for (const t of targetTools) await updateTool(t);
  for (const s of staticPages) await updateStaticPage(s);
}
main();
