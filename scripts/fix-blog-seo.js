const fs = require('fs');
let c = fs.readFileSync('scripts/generate-blogs.mjs', 'utf8');

const replacementGrid = `    '<div id="blogGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">',
    ...posts.slice(0, 12).map(p => '<article class="surface p-5 rounded-xl border border-slate-200 hover:border-indigo-400 transition-colors flex flex-col h-full dark:border-slate-800"><div class="text-xs font-bold text-indigo-500 uppercase tracking-wider mb-2">' + p.category + '</div><h2 class="text-xl font-bold mb-3 line-clamp-2"><a href="' + p.slug + '.html" class="hover:text-indigo-600">' + p.title + '</a></h2><p class="text-slate-600 dark:text-slate-400 mb-4 line-clamp-3 text-sm flex-grow">' + p.description + '</p><div class="mt-auto flex items-center justify-between text-sm text-slate-500"><span>' + p.date + '</span><a href="' + p.slug + '.html" class="font-semibold text-indigo-600 hover:text-indigo-800">Read more →</a></div></article>'),
    '    </div>',
    '    <div id="seo-links" style="display:none;">',
    ...posts.map(p => '      <a href="' + p.slug + '.html">' + p.title + '</a>'),
    '    </div>',`;

c = c.replace(/'    <div id="blogGrid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10"><\/div>',/, replacementGrid);

const replacementJS = `      const grid = document.getElementById("blogGrid");
      if (!grid.hasAttribute("data-init")) {
        grid.setAttribute("data-init", "1");
        if (!document.getElementById("searchInput").value && currentCategory === "all" && currentPage === 1) {
          renderPagination();
          return;
        }
      }
      if (paginated.length === 0) {`;

c = c.replace(/      if \(paginated\.length === 0\) \{/, replacementJS);

fs.writeFileSync('scripts/generate-blogs.mjs', c);
console.log('Blog SEO fixed');
