const fs = require('fs');
let c = fs.readFileSync('scripts/generate-68-tools.mjs', 'utf8');

c = c.replace(/\$\{t\.html\}/, `\${t.html
  .replace(/class="control/g, 'class="w-full px-4 py-3 rounded-xl border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all dark:bg-slate-900 dark:border-slate-700 shadow-inner')
  .replace(/class="btn btn-primary/g, 'class="inline-flex justify-center items-center py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95')
}`);

c = c.replace(/<div class="page-card">/, '<div class="page-card surface rounded-2xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl bg-white dark:bg-slate-900">');

fs.writeFileSync('scripts/generate-68-tools.mjs', c);
console.log('Premium classes injected');
