(function() {
  const scripts = document.getElementsByTagName('script');
  let basePath = '';
  for (let s of scripts) {
    const srcStr = s.getAttribute('src');
    if (srcStr && srcStr.includes('assets/components.js')) {
      basePath = srcStr.replace('assets/components.js', '');
      break;
    }
  }

  class GlobalHeader extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <header class="border-b border-slate-200/80 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80" role="banner">
        <div class="shell flex min-h-16 flex-wrap items-center justify-between gap-3 py-3">
          <a href="${basePath}index.html" class="flex min-w-0 items-center gap-3" aria-label="GlobalToolsHub home">
            <img src="${basePath}assets/logo.svg" alt="GlobalToolsHub logo" class="h-10 w-10 shrink-0 rounded-lg" width="40" height="40" loading="eager">
            <span class="truncate text-lg font-bold tracking-normal">GlobalToolsHub</span>
          </a>
          <nav class="hidden items-center gap-4 text-sm font-semibold text-slate-600 md:flex dark:text-slate-300" aria-label="Main navigation">
            <a href="${basePath}index.html">Tools</a>
            <a href="${basePath}about.html">About</a>
            <a href="${basePath}blog.html">Blog</a>
            <a href="${basePath}contact.html">Contact</a>
            <a href="${basePath}privacy.html">Compliance</a>
          </nav>
          <div class="flex flex-wrap items-center gap-2">
            <select id="themeSelect" class="control w-28 sm:w-32" aria-label="Theme"></select>
            <select id="languageSelect" class="control w-24 sm:w-28" aria-label="Language"></select>
          </div>
        </div>
      </header>
      `;
    }
  }
  customElements.define('global-header', GlobalHeader);

  class GlobalFooter extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
      <footer class="border-t border-slate-200 py-6 text-center text-sm text-slate-500 sm:py-8 dark:border-slate-800" role="contentinfo">
        <div class="shell">
          <div class="mb-3 flex flex-wrap justify-center gap-3 sm:gap-4">
            <a href="${basePath}about.html">About</a>
            <a href="${basePath}blog.html">Blog</a>
            <a href="${basePath}contact.html">Contact</a>
            <a href="${basePath}privacy.html">Privacy</a>
            <a href="${basePath}terms.html">Terms</a>
            <a href="${basePath}accessibility.html">Accessibility</a>
            <a href="${basePath}disclaimer.html">Disclaimer</a>
          </div>
          <p>Copyright 2026 GlobalToolsHub. Built from local-first browser tools.</p>
        </div>
      </footer>
      `;
    }
  }
  customElements.define('global-footer', GlobalFooter);
})();
