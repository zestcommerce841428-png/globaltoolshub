GlobalToolsHub — Audit Summary and Next Steps

Status (2026-06-07):
- Core build: ✅ `npm run build` completed successfully (generated tools, pages, Tailwind CSS).
- `assets/seo-runtime.js`: ✅ Hardened basePath resolution (prefers `data-basepath`, uses `document.currentScript`, resolves absolute URLs, falls back to `/assets/`).
- Legacy pages: ✅ `scripts/check-legacy-seo.js` and `scripts/check-legacy-runtime.js` report OK for examined pages.
- External tool folders: Detected and already synced under `legacy/` (dry-run report produced by `scripts/sync-external.mjs`).
- Syntax scanning: Browser-only pages contain expected `window` / `document` usage — these are normal and should be excluded from Node-only lint checks or validated via a headless browser.

Files modified:
- `assets/seo-runtime.js` — improved basePath resolution (safe, non-breaking changes).
- `scripts/sync-external.mjs` — added a safe dry-run sync tool (copy only with `--copy`).
- `scripts/seo-runtime.js` was not added; only `assets/seo-runtime.js` changed.

What I verified:
- Ran `node scripts/check-legacy-seo.js` → "SEO OK".
- Ran `node scripts/check-legacy-runtime.js` → "OK".
- Ran `node scripts/sync-external.mjs --dry` → listed sibling tool folders and confirmed `legacy/` targets already exist.
- Ran full `npm run build` → success.

Recommendations / safest next steps (pick one):
1) Run a headless-browser smoke test (Puppeteer) across a small set of key pages to catch runtime exceptions (recommended before any production deploy). This requires adding `puppeteer` as a dev dependency and will run pages in a real browser environment.
2) Implement a lightweight `scripts/check-browser-pages.js` that lints HTML/JS files for syntax only (no DOM execution) and excludes known browser-only pages from Node checks.
3) Start fixing critical runtime issues in a prioritized folder (I suggest `usemagictools` or `ToolVerse`). I will only modify files under `legacy/` and will keep backups; I will not push to GitHub or change production hosting settings.

If you'd like me to proceed, tell me which option you prefer and the folder to prioritize (if applicable). If you want the full Puppeteer run, I can: (a) add it to `devDependencies` and run it locally, or (b) create the script and you can run `npm install` + `npm run smoke` locally.

Report files created:
- `reports/external-tools-runtime-report.md` (scan details)
- `reports/summary-and-next-steps.md` (this file)

