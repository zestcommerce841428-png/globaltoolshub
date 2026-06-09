External tools runtime report

Scanned for browser-only globals (`window`, `document`) across local tool folders.

Summary:
- Many static tool pages use browser-only APIs and DOM access; these are expected for client-only pages.
- Top folders with occurrences:
  - ToolVerse-main: many DOM interactions in `ToolVerse-main/index.html` (modals, grid, event listeners).
  - usemagictools.github.io-main: multiple pages with inline scripts using `document` and `window` (analytics, UI interactions).
  - NakulTools-main: many pages manipulating DOM (forms, calculators, barcode, BMI, etc.).
  - online-tools-master: browser redirects and DOM listeners in pages.

Examples (non-exhaustive):
- ToolVerse-main/ToolVerse-main/index.html — DOM-heavy UI components.
- usemagictools.github.io-main/usemagictools.github.io-main/*.html — many inline scripts and `window.dataLayer` GTAG calls.
- NakulTools-main/NakulTools-main/*.html — various calculator and tool pages.

Recommendations / next steps:
1. These files are browser-only; Node-based syntax checks will flag them incorrectly. Exclude them from Node linting or run a DOM shim when checking.
2. If you want to verify runtime safety for production, we can:
   - Add a lightweight `scripts/check-browser-pages.js` that scans for obvious runtime errors (e.g., syntax issues) but skips DOM validation.
   - Or, create a headless-browser check (Puppeteer) to load pages and catch runtime exceptions.
3. If you'd like, I can start fixing high-priority issues (e.g., analytics misuse, missing `defer`, unsafe global writes) — tell me which folder to prioritize.

Produced: reports/external-tools-runtime-report.md

Generated on: 2026-06-07
