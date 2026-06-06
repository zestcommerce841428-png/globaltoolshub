(function () {
  const currentUrl = window.location.href.split("#")[0];
  const origin = window.location.origin;

  function setOrCreate(selector, createTag, attrs) {
    let element = document.head.querySelector(selector);
    if (!element) {
      element = document.createElement(createTag);
      document.head.appendChild(element);
    }
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
  }

  setOrCreate('link[rel="canonical"]', "link", { rel: "canonical", href: currentUrl });
  setOrCreate('meta[property="og:url"]', "meta", { property: "og:url", content: currentUrl });

  document.querySelectorAll('link[rel="alternate"][hreflang]').forEach((link) => {
    link.setAttribute("href", currentUrl);
  });

  document.querySelectorAll('script[type="application/ld+json"]').forEach((script) => {
    try {
      const data = JSON.parse(script.textContent);
      const rewrite = (value) => {
        if (!value || typeof value !== "object") return value;
        if (Array.isArray(value)) return value.map(rewrite);
        for (const key of Object.keys(value)) {
          if ((key === "url" || key === "item" || key === "@id") && typeof value[key] === "string") {
            value[key] = value[key].startsWith("/") ? `${origin}${value[key]}` : currentUrl;
          } else {
            value[key] = rewrite(value[key]);
          }
        }
        return value;
      };
      script.textContent = JSON.stringify(rewrite(data));
    } catch {
      /* Keep invalid third-party JSON-LD untouched. */
    }
  });
})();
