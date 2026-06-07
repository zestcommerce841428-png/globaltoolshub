import fs from 'fs/promises';
import path from 'path';

const root = process.cwd();
const outDir = root;

const topics = [
  { cat: "JSON", name: "JSON Formatting", items: ["JSON Validator", "JSON Formatter", "JSON Minifier"] },
  { cat: "Crypto", name: "Base64 Encoding", items: ["Base64 Encode", "Base64 Decode", "Base64 Image"] },
  { cat: "Developer", name: "Regex Testing", items: ["Regex Match", "Regex Replace", "Regex Extract"] },
  { cat: "Image", name: "Image Optimization", items: ["Image Compress", "Image Resize", "Image Format"] },
  { cat: "PDF", name: "PDF Management", items: ["Merge PDF", "Split PDF", "Compress PDF"] },
  { cat: "Design", name: "CSS Generation", items: ["CSS Gradient", "Box Shadow", "Border Radius"] },
  { cat: "Developer", name: "HTML/CSS Minification", items: ["HTML Minify", "CSS Minify", "JS Minify"] },
  { cat: "Text", name: "Markdown Editing", items: ["Markdown Preview", "Markdown to HTML", "HTML to Markdown"] },
  { cat: "Security", name: "JWT Decoding", items: ["JWT Header", "JWT Payload", "JWT Signature"] },
  { cat: "Utility", name: "QR Code Creation", items: ["URL to QR", "Text to QR", "Contact to QR"] },
  { cat: "Design", name: "Color Conversion", items: ["HEX to RGB", "RGB to HSL", "Color Palette"] },
  { cat: "Utility", name: "UUID Generation", items: ["UUID v4", "Bulk UUID", "GUID Format"] },
  { cat: "Crypto", name: "Hashing", items: ["MD5 Hash", "SHA-256 Hash", "SHA-512 Hash"] },
  { cat: "Developer", name: "URL Encoding", items: ["URL Encode", "URL Decode", "Query String Parse"] },
  { cat: "Text", name: "String Manipulation", items: ["Uppercase", "Lowercase", "Title Case", "Reverse String"] }
];

const adjectives = ["Ultimate", "Complete", "Definitive", "Practical", "Essential", "Advanced", "Comprehensive", "Quick", "Smart", "Modern"];
const nouns = ["Guide", "Tutorial", "Workflow", "Handbook", "Cheatsheet", "Overview", "Masterclass", "Introduction", "Strategies", "Tips"];

function generatePost(index) {
  const topic = topics[index % topics.length];
  const adj = adjectives[(index * 7) % adjectives.length];
  const noun = nouns[(index * 3) % nouns.length];
  
  const title = `The ${adj} ${noun} to ${topic.name} in 2026`;
  const slug = `blog-${topic.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index + 1}`;
  
  const description = `Learn everything you need to know about ${topic.name}. Discover how to use ${topic.items.join(', ')} effectively with our free online tools.`;
  const keywords = `${topic.name}, ${topic.items.join(', ')}, online tools, free ${topic.cat} tools, developer utilities`;
  
  const content = `
    <article class="prose prose-slate dark:prose-invert max-w-none">
      <header class="mb-8 text-center">
        <h1 class="text-3xl font-black sm:text-4xl lg:text-5xl">${title}</h1>
        <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">Category: <span class="font-semibold text-indigo-500">${topic.cat}</span> | Read time: 4 min</p>
      </header>
      
      <p class="lead text-xl text-slate-700 dark:text-slate-300">
        In the fast-paced world of web development and digital productivity, mastering <strong>${topic.name}</strong> is crucial. ${description}
      </p>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Why ${topic.name} Matters</h2>
      <p class="mb-4">
        Whether you're a seasoned developer or a casual user, dealing with ${topic.name.toLowerCase()} is a daily reality. The right tools can save you hours of frustration. This guide will walk you through the core concepts and introduce you to the best practices.
      </p>
      
      <h3 class="text-xl font-bold mt-6 mb-3">Key Tools for ${topic.name}</h3>
      <ul class="list-disc pl-6 mb-6 space-y-2">
        ${topic.items.map(item => `<li><strong>${item}:</strong> An essential utility for ensuring your workflows remain robust and error-free.</li>`).join('\n')}
      </ul>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Best Practices for 2026</h2>
      <p class="mb-4">
        When working with ${topic.cat.toLowerCase()} utilities, always prioritize local-first, browser-based tools. Not only does this ensure maximum privacy (as your data never leaves your device), but it also guarantees lightning-fast performance since there's no server round-trip.
      </p>
      
      <div class="bg-indigo-50 dark:bg-indigo-900/20 border-l-4 border-indigo-500 p-4 my-8 rounded-r-lg">
        <h4 class="font-bold text-indigo-800 dark:text-indigo-300 mb-2">Pro Tip</h4>
        <p class="text-indigo-700 dark:text-indigo-400 text-sm m-0">
          Bookmark our suite of ${topic.name} tools to keep them just one click away. They work completely offline once loaded!
        </p>
      </div>
      
      <h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>
      <p>
        Mastering ${topic.name} doesn't have to be complicated. By understanding the fundamentals and keeping the right tools at your disposal, you can streamline your daily tasks and boost your productivity significantly. Explore our <a href="index.html" class="text-indigo-600 hover:underline">catalog of free tools</a> to get started.
      </p>
    </article>
  `;

  return { title, slug, description, keywords, content, category: topic.cat, date: new Date(Date.now() - index * 86400000).toISOString().split('T')[0] };
}

const header = `<global-header></global-header>`;
const footer = `<global-footer></global-footer>`;

async function main() {
  const posts = [];
  const count = 145; // 140+ blogs
  
  console.log('Generating 145 blog posts...');
  
  for (let i = 0; i < count; i++) {
    const post = generatePost(i);
    posts.push({ title: post.title, slug: post.slug, description: post.description, category: post.category, date: post.date });
    
    const pageHtml = [
      '<!doctype html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="utf-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1">',
      '  <title>' + post.title + ' - GlobalToolsHub Blog</title>',
      '  <meta name="description" content="' + post.description + '">',
      '  <meta name="keywords" content="' + post.keywords + '">',
      '  <link rel="stylesheet" href="assets/styles.css">',
      '  <link rel="stylesheet" href="assets/site.css">',
      '  <script src="assets/components.js" defer></script>',
      '  <script src="assets/seo-runtime.js" defer></script>',
      '  <style>',
      '    .prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 2rem; margin-bottom: 1rem; }',
      '    .prose h3 { font-size: 1.25rem; font-weight: 600; margin-top: 1.5rem; margin-bottom: 0.75rem; }',
      '    .prose p { margin-bottom: 1.25rem; line-height: 1.7; }',
      '    .prose ul { list-style-type: disc; padding-left: 1.5rem; margin-bottom: 1.25rem; }',
      '    .prose li { margin-bottom: 0.5rem; }',
      '    .prose a { color: #4f46e5; text-decoration: underline; }',
      '  </style>',
      '</head>',
      '<body data-bg="clean">',
      header,
      '  <main class="shell py-10 max-w-4xl mx-auto">',
      '    <a href="blog.html" class="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-6 font-medium">← Back to Blog</a>',
      '    <div class="surface rounded-xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800">',
      post.content,
      '    </div>',
      '  </main>',
      footer,
      '  <script src="assets/app.js" defer></script>',
      '</body>',
      '</html>'
    ].join('\n');
    
    await fs.writeFile(path.join(outDir, post.slug + '.html'), pageHtml);
  }
  
  console.log('Generated individual blog HTML pages.');
  
  const indexHtml = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '  <meta charset="utf-8">',
    '  <meta name="viewport" content="width=device-width, initial-scale=1">',
    '  <title>Blog - GlobalToolsHub</title>',
    '  <meta name="description" content="Read our 140+ real SEO-based blogs about online tools, developer utilities, and productivity.">',
    '  <link rel="stylesheet" href="assets/styles.css">',
    '  <link rel="stylesheet" href="assets/site.css">',
    '  <script src="assets/components.js" defer></script>',
    '  <script src="assets/seo-runtime.js" defer></script>',
    '  <script>',
    '    const posts = ' + JSON.stringify(posts) + ';',
    '    let currentPage = 1;',
    '    const postsPerPage = 12;',
    '    let filteredPosts = [...posts];',
    '    function renderPosts() {',
    '      const start = (currentPage - 1) * postsPerPage;',
    '      const end = start + postsPerPage;',
    '      const paginated = filteredPosts.slice(start, end);',
    '      const grid = document.getElementById("blogGrid");',
    '      if (paginated.length === 0) {',
    '        grid.innerHTML = \'<p class="col-span-full text-center py-10 text-slate-500">No posts found matching your search.</p>\';',
    '      } else {',
    '        grid.innerHTML = paginated.map(p => \'<article class="surface p-5 rounded-xl border border-slate-200 hover:border-indigo-400 transition-colors flex flex-col h-full dark:border-slate-800"><div class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">\' + p.category + \'</div><h2 class="text-xl font-bold mb-3 line-clamp-2"><a href="\' + p.slug + \'.html" class="hover:text-indigo-600">\' + p.title + \'</a></h2><p class="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 text-sm flex-grow">\' + p.description + \'</p><div class="mt-auto flex items-center justify-between text-sm text-slate-500"><span>\' + p.date + \'</span><a href="\' + p.slug + \'.html" class="font-semibold text-indigo-600 hover:text-indigo-800">Read more →</a></div></article>\').join("");',
    '      }',
    '      renderPagination();',
    '    }',
    '    function renderPagination() {',
    '      const totalPages = Math.ceil(filteredPosts.length / postsPerPage);',
    '      const nav = document.getElementById("pagination");',
    '      if (totalPages <= 1) {',
    '        nav.innerHTML = "";',
    '        return;',
    '      }',
    '      let html = "";',
    '      if (currentPage > 1) {',
    '        html += \'<button onclick="changePage(\' + (currentPage - 1) + \')" class="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Previous</button>\';',
    '      }',
    '      html += \'<span class="px-4 py-2">Page \' + currentPage + \' of \' + totalPages + \'</span>\';',
    '      if (currentPage < totalPages) {',
    '        html += \'<button onclick="changePage(\' + (currentPage + 1) + \')" class="px-4 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800">Next</button>\';',
    '      }',
    '      nav.innerHTML = html;',
    '    }',
    '    function changePage(p) {',
    '      currentPage = p;',
    '      window.scrollTo({ top: 0, behavior: "smooth" });',
    '      renderPosts();',
    '    }',
    '    function filterPosts() {',
    '      const search = document.getElementById("searchInput").value.toLowerCase();',
    '      filteredPosts = posts.filter(p => p.title.toLowerCase().includes(search) || p.description.toLowerCase().includes(search) || p.category.toLowerCase().includes(search));',
    '      currentPage = 1;',
    '      document.getElementById("postCount").textContent = filteredPosts.length + " posts found";',
    '      renderPosts();',
    '    }',
    '    document.addEventListener("DOMContentLoaded", () => {',
    '      document.getElementById("searchInput").addEventListener("input", filterPosts);',
    '      document.getElementById("postCount").textContent = posts.length + " posts total";',
    '      renderPosts();',
    '    });',
    '  </script>',
    '</head>',
    '<body data-bg="clean">',
    header,
    '  <main class="shell py-10">',
    '    <div class="text-center mb-10">',
    '      <h1 class="text-4xl font-black mb-4">The GlobalToolsHub Blog</h1>',
    '      <p class="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Guides, tutorials, and workflows for maximizing productivity with our 287+ browser-based tools.</p>',
    '    </div>',
    '    <div class="max-w-xl mx-auto mb-10">',
    '      <div class="relative">',
    '        <input type="search" id="searchInput" class="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all dark:bg-slate-900 dark:border-slate-700" placeholder="Search blog posts by title, category, or keyword...">',
    '        <p id="postCount" class="text-sm text-slate-500 mt-2 text-center"></p>',
    '      </div>',
    '    </div>',
    '    <div id="blogGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"></div>',
    '    <nav id="pagination" class="flex justify-center items-center gap-4 font-medium text-sm"></nav>',
    '  </main>',
    footer,
    '  <script src="assets/app.js" defer></script>',
    '</body>',
    '</html>'
  ].join('\n');

  await fs.writeFile(path.join(outDir, 'blog.html'), indexHtml);
  console.log('Generated interactive blog.html.');
}

main();
