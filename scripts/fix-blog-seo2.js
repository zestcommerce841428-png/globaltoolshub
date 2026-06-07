const fs = require('fs');
// Let's just restore from a clean state and do it properly.
// Wait, I didn't backup. Let's just fix the broken syntax.
let c = fs.readFileSync('scripts/generate-blogs.mjs', 'utf8');

c = c.replace(/      const grid = document\.getElementById\("blogGrid"\);\n      if \(!grid\.hasAttribute\("data-init"\)\) \{\n        grid\.setAttribute\("data-init", "1"\);\n        if \(!document\.getElementById\("searchInput"\)\.value && currentCategory === "all" && currentPage === 1\) \{\n          renderPagination\(\);\n          return;\n        \}\n      \}\n      if \(paginated\.length === 0\) \{/g, 
  "'      const grid = document.getElementById(\\\"blogGrid\\\");',\n" +
  "'      if (!grid.hasAttribute(\\\"data-init\\\")) {',\n" +
  "'        grid.setAttribute(\\\"data-init\\\", \\\"1\\\");',\n" +
  "'        if (!document.getElementById(\\\"searchInput\\\").value && currentCategory === \\\"all\\\" && currentPage === 1) {',\n" +
  "'          renderPagination();',\n" +
  "'          return;',\n" +
  "'        }',\n" +
  "'      }',\n" +
  "'      if (paginated.length === 0) {'"
);

fs.writeFileSync('scripts/generate-blogs.mjs', c);
console.log('Fixed syntax');
