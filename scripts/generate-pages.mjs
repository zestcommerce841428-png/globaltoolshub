import { promises as fs } from "node:fs";

const year = new Date().getFullYear();

const nav = `
  <nav class="page-nav" aria-label="Site navigation">
    <a href="index.html">Tools</a>
    <a href="about.html">About</a>
    <a href="blog.html">Blog</a>
    <a href="contact.html">Contact</a>
    <a href="privacy.html">Privacy</a>
    <a href="terms.html">Terms</a>
  </nav>`;

const shell = ({ title, description, body }) => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${title} - GlobalToolsHub</title>
    <meta name="description" content="${description}">
    <meta name="robots" content="index, follow">
    <meta name="author" content="GlobalToolsHub">
    <link rel="icon" href="assets/logo.svg" type="image/svg+xml">
    <link rel="stylesheet" href="assets/styles.css">
    <link rel="stylesheet" href="assets/site.css">
    <script src="assets/analytics.js" defer></script>
  </head>
  <body data-bg="clean">
    <main class="page-main">
      ${nav}
      ${body}
    </main>
    <footer class="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
      <p>Copyright ${year} GlobalToolsHub. Built for fast browser-based tools.</p>
    </footer>
  </body>
</html>
`;

const pages = [
  {
    file: "about.html",
    title: "About",
    description: "About GlobalToolsHub, a unified browser tools hub.",
    body: `<h1>About GlobalToolsHub</h1><p>GlobalToolsHub brings practical browser-based tools into one searchable catalog. The project keeps tools fast, responsive, and easy to launch without forcing users through accounts or unnecessary pages.</p><div class="page-grid"><section class="page-card"><h2>What We Build</h2><p>Developer utilities, PDF helpers, image tools, text tools, calculators, crypto utilities, and daily productivity tools.</p></section><section class="page-card"><h2>How It Works</h2><p>Most tools run locally in your browser. The homepage indexes the merged tools and helps you find the right utility quickly.</p></section><section class="page-card"><h2>Our Standard</h2><p>Fast loading, clear navigation, privacy-aware defaults, responsive layouts, and simple maintenance.</p></section></div>`,
  },
  {
    file: "contact.html",
    title: "Contact",
    description: "Contact GlobalToolsHub for feedback, bug reports, and tool suggestions.",
    body: `<h1>Contact</h1><p>Use this page for bug reports, tool suggestions, accessibility feedback, and partnership questions.</p><div class="page-card"><h2>Email</h2><p>Replace this placeholder with your public contact email before launch: contact@globaltoolshub.example</p><h2>What To Include</h2><ul><li>The tool name or page URL.</li><li>What happened and what you expected.</li><li>Your browser and device if the issue is visual or interactive.</li></ul></div>`,
  },
  {
    file: "privacy.html",
    title: "Privacy Policy",
    description: "Privacy policy for GlobalToolsHub.",
    body: `<h1>Privacy Policy</h1><p>GlobalToolsHub is designed around browser-first tools. Many tools process input locally in your browser and do not require account creation.</p><h2>Analytics</h2><p>The site includes one optional global Google Analytics tag controlled from assets/analytics.js. It is disabled until your measurement ID is added.</p><h2>Local Storage</h2><p>Preferences such as theme, language, country, and view mode may be stored in your browser.</p><h2>Files And Inputs</h2><p>Tools that process files should be reviewed individually before production launch, but the intended design is local browser processing wherever possible.</p>`,
  },
  {
    file: "terms.html",
    title: "Terms",
    description: "Terms of use for GlobalToolsHub.",
    body: `<h1>Terms</h1><p>GlobalToolsHub is provided as a utility catalog. Use tools responsibly and verify important outputs before relying on them.</p><h2>No Warranty</h2><p>Tools are provided as-is. Results may depend on browser behavior, file formats, and user input.</p><h2>Acceptable Use</h2><p>Do not use the tools for unlawful, abusive, or harmful activities.</p>`,
  },
  {
    file: "accessibility.html",
    title: "Accessibility",
    description: "Accessibility statement for GlobalToolsHub.",
    body: `<h1>Accessibility</h1><p>GlobalToolsHub aims to provide responsive pages, readable contrast, keyboard-friendly controls, and semantic navigation.</p><h2>Feedback</h2><p>If any tool or page is difficult to use with assistive technology, report it through the contact page with the page URL and browser details.</p>`,
  },
  {
    file: "disclaimer.html",
    title: "Disclaimer",
    description: "Disclaimer for GlobalToolsHub tools and content.",
    body: `<h1>Disclaimer</h1><p>GlobalToolsHub provides general-purpose utilities. It does not provide legal, medical, financial, or security advice.</p><h2>Verify Outputs</h2><p>Always review generated, converted, encrypted, or calculated results before using them in important work.</p>`,
  },
  {
    file: "cookies.html",
    title: "Cookie Notice",
    description: "Cookie and storage notice for GlobalToolsHub.",
    body: `<h1>Cookie Notice</h1><p>GlobalToolsHub may use browser storage for user preferences. If you enable analytics by adding a Google Analytics measurement ID, Google may set analytics cookies according to its own policies.</p>`,
  },
  {
    file: "security.html",
    title: "Security",
    description: "Security notes for GlobalToolsHub.",
    body: `<h1>Security</h1><p>Use sensitive tools carefully. For cryptography, passwords, signatures, and private files, confirm that the tool works fully in your browser before production use.</p><h2>Responsible Disclosure</h2><p>Send security issues through the contact page with a clear reproduction path.</p>`,
  },
];

const posts = [
  ["best-online-tools-workflow", "How To Build A Better Online Tools Workflow", "Create a simple workflow by grouping tools by intent: inspect, convert, validate, compress, and export."],
  ["json-tools-guide", "A Practical Guide To JSON Tools", "JSON formatters, validators, viewers, and minifiers help developers debug data faster."],
  ["pdf-tools-browser", "When Browser PDF Tools Make Sense", "PDF merge, split, compress, image export, and protection tools are most useful when they are quick and local-first."],
  ["image-optimization-basics", "Image Optimization Basics", "Compress, resize, convert, watermark, and inspect images before publishing them online."],
  ["password-generator-tips", "Password Generator Tips", "Strong passwords should be long, unique, random, and stored in a trusted password manager."],
  ["regex-testing-workflow", "A Safer Regex Testing Workflow", "Test regular expressions with sample cases, edge cases, and clear replacement previews."],
  ["base64-url-encoding", "Base64 And URL Encoding Explained", "Encoding tools help move data safely through URLs, forms, APIs, and config files."],
  ["hashing-checksums", "Hashing And Checksums For Everyday Work", "Hashes help verify file integrity, compare content, and create stable identifiers."],
  ["color-tools-design", "Color Tools For Better UI Decisions", "Contrast checkers, palette generators, and converters improve visual quality and accessibility."],
  ["unit-converters", "Why Unit Converters Still Matter", "Fast unit conversion prevents mistakes in engineering, design, finance, and daily tasks."],
  ["privacy-first-tools", "Privacy-First Browser Tools", "Local browser processing can reduce unnecessary uploads and make simple utilities safer."],
  ["developer-toolkit", "A Compact Developer Toolkit", "A useful toolkit covers formatting, validation, encoding, cryptography, and API testing."],
  ["seo-for-tool-sites", "SEO Foundations For Tool Sites", "Tool pages need precise titles, descriptions, structured data, internal links, and fast loading."],
  ["responsive-tools", "Responsive Design For Utility Pages", "A tool page should work on phones, tablets, and desktops without hiding critical controls."],
  ["static-site-performance", "Static Site Performance Checklist", "Prebuilt assets, local dependencies, lean scripts, and image discipline keep sites fast."],
];

pages.push({
  file: "blog.html",
  title: "Blog",
  description: "GlobalToolsHub blog posts about online tools, productivity, SEO, and browser utilities.",
  body: `<h1>Blog</h1><p>Guides for using browser tools more effectively.</p><div class="page-grid">${posts.map(([slug, title, description]) => `<article class="page-card"><h2><a href="blog-${slug}.html">${title}</a></h2><p>${description}</p></article>`).join("")}</div>`,
});

for (const [slug, title, description] of posts) {
  pages.push({
    file: `blog-${slug}.html`,
    title,
    description,
    body: `<article><h1>${title}</h1><p>${description}</p><h2>Why It Matters</h2><p>Good utility workflows save time because they reduce context switching. A focused browser tool can solve a task quickly without installing heavy software.</p><h2>Recommended Workflow</h2><ul><li>Start with the clearest input you can provide.</li><li>Preview the output before downloading or copying it.</li><li>Keep sensitive information local whenever possible.</li><li>Use GlobalToolsHub search to find related tools.</li></ul><h2>Next Step</h2><p>Return to the tools catalog and search for the format, task, or category you need.</p></article>`,
  });
}

await Promise.all(pages.map((page) => fs.writeFile(page.file, shell(page))));
console.log(`Generated ${pages.length} content pages.`);
