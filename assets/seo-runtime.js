
// ═══════════════════════════════════════════════════
// GlobalToolsHub — SEO Runtime
// Dynamically injects: GTAG, SEO meta, JSON-LD, Accessibility Widget
// Loaded on every tool page via <script src="...seo-runtime.js" defer>
// ═══════════════════════════════════════════════════

// ─── 1. Google Analytics (GTAG) — Dynamic Injection ───
(function() {
  // Avoid loading analytics during local `file:` tests or on localhost to keep smoke tests clean
  try {
    if (location && (location.protocol === 'file:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
      return;
    }
  } catch (e) { /* defensive */ }

  // Skip if gtag script already loaded
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;

  // Define dataLayer + gtag function FIRST
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };

  // Create the external gtag.js script tag
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-HRN5TZ61NL';

  // Only fire config AFTER the script has fully loaded
  gtagScript.onload = function() {
    window.gtag('js', new Date());
    window.gtag('config', 'G-HRN5TZ61NL', {
      page_path: window.location.pathname,
      page_title: document.title,
      page_location: window.location.href
    });
  };

  // Insert as first script so it loads early
  var firstScript = document.getElementsByTagName('script')[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(gtagScript, firstScript);
  } else {
    document.head.appendChild(gtagScript);
  }
})();

// ─── 2. Dynamic SEO — Canonical, OG, Hreflang, JSON-LD ───
(function () {
  var currentUrl = window.location.href.split("#")[0];
  var origin = window.location.origin;

  function setOrCreate(selector, createTag, attrs) {
    var element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement(createTag);
      document.head.appendChild(element);
    }
    Object.entries(attrs).forEach(function(pair) { element.setAttribute(pair[0], pair[1]); });
  }

  // Dynamic canonical URL
  setOrCreate('link[rel="canonical"]', "link", { rel: "canonical", href: currentUrl });

  // Dynamic Open Graph URL
  setOrCreate('meta[property="og:url"]', "meta", { property: "og:url", content: currentUrl });

  // Dynamic OG site name
  setOrCreate('meta[property="og:site_name"]', "meta", { property: "og:site_name", content: "GlobalToolsHub" });

  // Dynamic OG type
  setOrCreate('meta[property="og:type"]', "meta", { property: "og:type", content: "website" });

  // If there's a <title> tag, sync it to OG and twitter metas
  var pageTitle = document.title || "GlobalToolsHub";
  setOrCreate('meta[property="og:title"]', "meta", { property: "og:title", content: pageTitle });
  setOrCreate('meta[name="twitter:title"]', "meta", { name: "twitter:title", content: pageTitle });
  setOrCreate('meta[name="twitter:card"]', "meta", { name: "twitter:card", content: "summary" });

  // If there's a meta description, sync to OG and twitter
  var descEl = document.querySelector('meta[name="description"]');
  if (descEl) {
    var desc = descEl.getAttribute("content") || "";
    setOrCreate('meta[property="og:description"]', "meta", { property: "og:description", content: desc });
    setOrCreate('meta[name="twitter:description"]', "meta", { name: "twitter:description", content: desc });
  }

  // Hreflang alternate links → set to current URL
  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(function(link) {
    link.setAttribute("href", currentUrl);
  });

  // Provide a safe favicon link to avoid requests for /favicon.ico when not present
  try {
    var iconHref = (location && location.protocol === 'file:') ? 'assets/logo.svg' : (location.origin || '') + '/assets/logo.svg';
    setOrCreate('link[rel="icon"]', 'link', { rel: 'icon', href: iconHref, type: 'image/svg+xml' });
  } catch (e) { /* ignore */ }

  // Rewrite JSON-LD schema urls to match the live page URL
  document.querySelectorAll('script[type="application/ld+json"]').forEach(function(script) {
    try {
      var data = JSON.parse(script.textContent);
      var rewrite = function(value) {
        if (!value || typeof value !== "object") return value;
        if (Array.isArray(value)) return value.map(rewrite);
        for (var key of Object.keys(value)) {
          if ((key === "url" || key === "item" || key === "@id") && typeof value[key] === "string") {
            value[key] = currentUrl;
          } else {
            value[key] = rewrite(value[key]);
          }
        }
        return value;
      };
      script.textContent = JSON.stringify(rewrite(data));
    } catch (e) {
      /* Keep invalid third-party JSON-LD untouched. */
    }
  });
})();

// ─── 3. Accessibility Widget — Custom 49-feature panel ───
(function() {
  if (window.__GTH_A11Y_LOADED) return;
  var widgetScript = document.createElement('script');
  widgetScript.id = 'gth-accessibility-widget-loader';

  // Robustly resolve the base path for the runtime assets:
  // 1) prefer an explicit `data-basepath` on the seo-runtime script
  // 2) use `document.currentScript` when available
  // 3) find the last script whose src contains `seo-runtime`
  // 4) fallback to site-root `/assets/` (absolute)
  var basePath = '';
  try {
    var scriptEl = document.currentScript || (function() {
      var scripts = document.getElementsByTagName('script');
      for (var i = scripts.length - 1; i >= 0; i--) {
        var s = scripts[i];
        if (s.src && s.src.indexOf('seo-runtime') !== -1) return s;
      }
      return null;
    })();

    if (scriptEl) {
      // allow opt-in override
      basePath = scriptEl.getAttribute('data-basepath') || '';
      if (!basePath && scriptEl.src) {
        try {
          var resolved = new URL(scriptEl.src, location.href);
          basePath = resolved.href.substring(0, resolved.href.lastIndexOf('/') + 1);
        } catch (e) {
          // ignore and fallthrough to fallback
        }
      }
    }
  } catch (e) {
    /* defensive: keep going to fallback */
  }

  if (!basePath) {
    // final safe fallback: absolute /assets/ on current origin
    try {
      basePath = (location.origin || (location.protocol + '//' + location.host)) + '/assets/';
    } catch (e) {
      basePath = '/assets/';
    }
  }

  widgetScript.src = basePath + 'accessibility-widget.js';
  widgetScript.defer = true;
  document.head.appendChild(widgetScript);
})();
