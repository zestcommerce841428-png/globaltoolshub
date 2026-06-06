const languages = [
  ["en", "English"], ["hi", "Hindi"], ["es", "Spanish"], ["fr", "French"], ["ar", "Arabic"], ["bn", "Bengali"],
  ["de", "German"], ["id", "Indonesian"], ["it", "Italian"], ["ja", "Japanese"], ["ko", "Korean"], ["pt", "Portuguese"],
  ["ru", "Russian"], ["tr", "Turkish"], ["ur", "Urdu"], ["vi", "Vietnamese"], ["zh", "Chinese"],
];

const countries = [
  ["global", "Global"], ["AF", "Afghanistan"], ["AL", "Albania"], ["DZ", "Algeria"], ["AR", "Argentina"], ["AU", "Australia"],
  ["AT", "Austria"], ["BD", "Bangladesh"], ["BE", "Belgium"], ["BR", "Brazil"], ["CA", "Canada"], ["CN", "China"],
  ["CO", "Colombia"], ["DK", "Denmark"], ["EG", "Egypt"], ["FI", "Finland"], ["FR", "France"], ["DE", "Germany"],
  ["GH", "Ghana"], ["GR", "Greece"], ["HK", "Hong Kong"], ["IN", "India"], ["ID", "Indonesia"], ["IE", "Ireland"],
  ["IL", "Israel"], ["IT", "Italy"], ["JP", "Japan"], ["KE", "Kenya"], ["KR", "South Korea"], ["MY", "Malaysia"],
  ["MX", "Mexico"], ["NP", "Nepal"], ["NL", "Netherlands"], ["NZ", "New Zealand"], ["NG", "Nigeria"], ["NO", "Norway"],
  ["PK", "Pakistan"], ["PH", "Philippines"], ["PL", "Poland"], ["PT", "Portugal"], ["RU", "Russia"], ["SA", "Saudi Arabia"],
  ["SG", "Singapore"], ["ZA", "South Africa"], ["ES", "Spain"], ["LK", "Sri Lanka"], ["SE", "Sweden"], ["CH", "Switzerland"],
  ["TH", "Thailand"], ["TR", "Turkey"], ["AE", "United Arab Emirates"], ["GB", "United Kingdom"], ["US", "United States"],
  ["VN", "Vietnam"],
];

const themes = [
  ["light", "Light"], ["dark", "Dark"], ["ocean", "Ocean"], ["forest", "Forest"], ["rose", "Rose"], ["amber", "Amber"],
  ["indigo", "Indigo"], ["mono", "Mono"], ["midnight", "Midnight"], ["mint", "Mint"], ["violet", "Violet"], ["sky", "Sky"],
  ["lime", "Lime"], ["coral", "Coral"], ["steel", "Steel"], ["gold", "Gold"], ["crimson", "Crimson"],
];

const translations = {
  en: ["A unified, searchable hub for developer, image, PDF, text, crypto, finance, and utility tools.", "Search tools, formats, tasks, or sources", "All categories", "All sources", "Open tool", "tools", "No tools match your filters."],
  hi: ["Developer, image, PDF, text, crypto, finance aur utility tools ke liye unified searchable hub.", "Tools, formats, tasks, ya sources search karein", "All categories", "All sources", "Tool kholein", "tools", "Aapke filters se koi tool match nahi hua."],
  es: ["Un centro unificado y buscable para herramientas de desarrollo, imagen, PDF, texto, cripto y utilidad.", "Buscar herramientas, formatos, tareas o fuentes", "Todas las categorias", "Todas las fuentes", "Abrir herramienta", "herramientas", "Ninguna herramienta coincide con los filtros."],
  fr: ["Un hub unifie et consultable pour les outils developpeur, image, PDF, texte, crypto et utilitaires.", "Rechercher des outils, formats, taches ou sources", "Toutes les categories", "Toutes les sources", "Ouvrir l'outil", "outils", "Aucun outil ne correspond aux filtres."],
  ar: ["مركز موحد وقابل للبحث لأدوات المطورين والصور وPDF والنص والعملات والمهام اليومية.", "ابحث عن الادوات او الصيغ او المصادر", "كل الفئات", "كل المصادر", "افتح الاداة", "اداة", "لا توجد ادوات مطابقة."],
  default: ["A unified, searchable hub for developer, image, PDF, text, crypto, finance, and utility tools.", "Search tools, formats, tasks, or sources", "All categories", "All sources", "Open tool", "tools", "No tools match your filters."],
};

const state = {
  tools: [],
  query: "",
  category: "All",
  source: "All",
  view: localStorage.getItem("gth:view") || "grid",
  page: 1,
  perPage: 24,
  language: localStorage.getItem("gth:language") || "en",
  country: localStorage.getItem("gth:country") || "global",
  theme: localStorage.getItem("gth:theme") || "light",
};

const elements = {
  grid: document.querySelector("#toolsGrid"),
  count: document.querySelector("#resultCount"),
  query: document.querySelector("#searchInput"),
  category: document.querySelector("#categoryFilter"),
  source: document.querySelector("#sourceFilter"),
  pagination: document.querySelector("#pagination"),
  pageSize: document.querySelector("#pageSize"),
  gridView: document.querySelector("#gridView"),
  listView: document.querySelector("#listView"),
  theme: document.querySelector("#themeSelect"),
  bgSelect: document.querySelector("#bgSelect"),
  language: document.querySelector("#languageSelect"),
  country: document.querySelector("#countrySelect"),
  countryNotice: document.querySelector("#countryNotice"),
  subtitle: document.querySelector("#subtitle"),
  statTools: document.querySelector("#statTools"),
  statCategories: document.querySelector("#statCategories"),
  statSources: document.querySelector("#statSources"),
  year: document.querySelector("#currentYear"),
};

function text() {
  const [subtitle, search, allCategories, allSources, open, results, noResults] = translations[state.language] || translations.default;
  return { subtitle, search, allCategories, allSources, open, results, noResults };
}

function fillSelect(select, values, selected) {
  select.innerHTML = values.map(([value, label]) => `<option value="${value}" ${value === selected ? "selected" : ""}>${label}</option>`).join("");
}

function uniqueValues(key) {
  return ["All", ...Array.from(new Set(state.tools.map((tool) => tool[key]))).sort()];
}

function applyPreferences() {
  document.documentElement.dataset.theme = state.theme;
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" || state.language === "ur" ? "rtl" : "ltr";
  document.body.dataset.bg = localStorage.getItem("gth:bg") || "clean";
  elements.bgSelect.value = document.body.dataset.bg;
  elements.gridView.setAttribute("aria-pressed", String(state.view === "grid"));
  elements.listView.setAttribute("aria-pressed", String(state.view === "list"));
  elements.year.textContent = new Date().getFullYear();
}

function populateSelectors() {
  fillSelect(elements.theme, themes, state.theme);
  fillSelect(elements.language, languages, state.language);
  fillSelect(elements.country, countries, state.country);
}

function localize() {
  const t = text();
  const countryName = countries.find(([code]) => code === state.country)?.[1] || "Global";
  elements.subtitle.textContent = t.subtitle;
  elements.query.placeholder = t.search;
  if (elements.category.options[0]) elements.category.options[0].textContent = t.allCategories;
  if (elements.source.options[0]) elements.source.options[0].textContent = t.allSources;
  elements.countryNotice.lastChild.textContent = state.country === "global" ? " Global tool catalog" : ` Optimized for ${countryName}`;
}

function populateFilters() {
  elements.category.innerHTML = "";
  elements.source.innerHTML = "";
  for (const value of uniqueValues("category")) {
    elements.category.add(new Option(value === "All" ? text().allCategories : value, value));
  }
  for (const value of uniqueValues("source")) {
    elements.source.add(new Option(value === "All" ? text().allSources : value, value));
  }
}

function filteredTools() {
  const terms = state.query.toLowerCase().trim().split(/\s+/).filter(Boolean);
  return state.tools.filter((tool) => {
    if (state.category !== "All" && tool.category !== state.category) return false;
    if (state.source !== "All" && tool.source !== state.source) return false;
    if (!terms.length) return true;
    const haystack = `${tool.title} ${tool.description} ${tool.category} ${tool.source} ${tool.tags.join(" ")}`.toLowerCase();
    return terms.every((term) => haystack.includes(term));
  });
}

function renderTools() {
  const t = text();
  const tools = filteredTools();
  const pageCount = Math.max(1, Math.ceil(tools.length / state.perPage));
  state.page = Math.min(state.page, pageCount);
  const start = (state.page - 1) * state.perPage;
  const visible = tools.slice(start, start + state.perPage);

  elements.count.textContent = `${tools.length} ${t.results}`;
  elements.statTools.textContent = state.tools.length;
  elements.statCategories.textContent = new Set(state.tools.map((tool) => tool.category)).size;
  elements.statSources.textContent = new Set(state.tools.map((tool) => tool.source)).size;
  elements.grid.className = state.view === "grid" ? "grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid gap-3";
  elements.grid.innerHTML = visible.length ? visible.map((tool) => toolCard(tool, t)).join("") : `<div class="surface rounded-lg p-8 text-center text-sm text-slate-500">${t.noResults}</div>`;
  renderPagination(pageCount);
}

function toolCard(tool, t) {
  const tags = tool.tags.slice(0, 4).map((tag) => `<span class="pill">${escapeHtml(tag)}</span>`).join("");
  const listClasses = state.view === "list" ? "md:flex-row md:items-center md:justify-between" : "";
  return `
    <article class="tool-card ${listClasses}">
      <div class="min-w-0">
        <div class="mb-3 flex flex-wrap items-center gap-2">
          <span class="pill">${escapeHtml(tool.category)}</span>
          <span class="pill">${escapeHtml(tool.source)}</span>
        </div>
        <h2 class="text-base font-semibold tracking-normal">${escapeHtml(tool.title)}</h2>
        <p class="mt-2 line-clamp-3 text-sm leading-6 text-slate-500 dark:text-slate-400">${escapeHtml(tool.description)}</p>
        <div class="mt-4 flex flex-wrap gap-2">${tags}</div>
      </div>
      <a class="button-primary mt-5 inline-flex h-10 items-center justify-center rounded-md px-4 text-sm font-semibold md:mt-0" href="${tool.url}">${t.open}</a>
    </article>`;
}

function renderPagination(pageCount) {
  const buttons = [pageButton("Prev", state.page - 1, state.page === 1)];
  for (let page = Math.max(1, state.page - 2); page <= Math.min(pageCount, state.page + 2); page += 1) {
    buttons.push(pageButton(page, page, false, page === state.page));
  }
  buttons.push(pageButton("Next", state.page + 1, state.page === pageCount));
  elements.pagination.innerHTML = buttons.join("");
}

function pageButton(label, page, disabled, active = false) {
  return `<button class="h-10 rounded-md border px-3 text-sm ${active ? "button-primary" : "surface"}" data-page="${page}" ${disabled ? "disabled" : ""}>${label}</button>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
}

function bindEvents() {
  elements.query.addEventListener("input", (event) => { state.query = event.target.value; state.page = 1; renderTools(); });
  elements.category.addEventListener("change", (event) => { state.category = event.target.value; state.page = 1; renderTools(); });
  elements.source.addEventListener("change", (event) => { state.source = event.target.value; state.page = 1; renderTools(); });
  elements.pageSize.addEventListener("change", (event) => { state.perPage = Number(event.target.value); state.page = 1; renderTools(); });
  elements.pagination.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-page]");
    if (!button || button.disabled) return;
    state.page = Number(button.dataset.page);
    renderTools();
    document.querySelector("#catalog").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  elements.gridView.addEventListener("click", () => setView("grid"));
  elements.listView.addEventListener("click", () => setView("list"));
  elements.theme.addEventListener("change", (event) => {
    state.theme = event.target.value;
    document.documentElement.dataset.theme = state.theme;
    localStorage.setItem("gth:theme", state.theme);
  });
  elements.bgSelect.addEventListener("change", (event) => {
    document.body.dataset.bg = event.target.value;
    localStorage.setItem("gth:bg", event.target.value);
  });
  elements.language.addEventListener("change", (event) => {
    state.language = event.target.value;
    localStorage.setItem("gth:language", state.language);
    applyPreferences();
    populateFilters();
    localize();
    renderTools();
    if (typeof triggerGoogleTranslate === "function") {
      triggerGoogleTranslate(state.language);
    }
  });
  elements.country.addEventListener("change", (event) => {
    state.country = event.target.value;
    localStorage.setItem("gth:country", state.country);
    localize();
  });
}

function setView(view) {
  state.view = view;
  localStorage.setItem("gth:view", view);
  elements.gridView.setAttribute("aria-pressed", String(view === "grid"));
  elements.listView.setAttribute("aria-pressed", String(view === "list"));
  renderTools();
}

async function init() {
  populateSelectors();
  applyPreferences();
  bindEvents();
  initGoogleTranslate();
  const response = await fetch("assets/tools.json", { cache: "no-store" });
  state.tools = await response.json();
  populateFilters();
  localize();
  renderTools();
}

function initGoogleTranslate() {
  const div = document.createElement('div');
  div.id = 'google_translate_element';
  div.style.display = 'none';
  document.body.appendChild(div);

  window.googleTranslateElementInit = function() {
    new window.google.translate.TranslateElement({
      pageLanguage: 'en',
      autoDisplay: false
    }, 'google_translate_element');
    
    // Automatically apply saved language on load if it's not English
    setTimeout(() => {
      if (state.language !== 'en') {
        triggerGoogleTranslate(state.language);
      }
    }, 500);
  };

  const script = document.createElement('script');
  script.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
  document.head.appendChild(script);
  
  // Hide Google Translate banner
  const style = document.createElement('style');
  style.textContent = `
    .goog-te-banner-frame { display: none !important; }
    body { top: 0 !important; }
    .skiptranslate { display: none !important; }
  `;
  document.head.appendChild(style);
}

function triggerGoogleTranslate(lang) {
  const select = document.querySelector('.goog-te-combo');
  if (!select) {
    // If widget hasn't loaded yet, try again in a bit
    setTimeout(() => triggerGoogleTranslate(lang), 500);
    return;
  }
  
  // Handle language mappings (e.g., Chinese)
  const targetLang = lang === 'zh' ? 'zh-CN' : lang;
  
  if (lang === 'en') {
    // To restore original English, we simulate a click on the "Show original" button in the iframe if possible
    // Alternatively, we set the select back to English
    select.value = 'en';
    select.dispatchEvent(new Event('change'));
    
    // Sometimes Google Translate requires clearing the cookie to truly revert
    const iframe = document.querySelector('iframe.goog-te-banner-frame');
    if (iframe) {
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document;
        const restoreBtn = innerDoc.querySelector('button[id*="restore"]');
        if (restoreBtn) restoreBtn.click();
    }
  } else {
    select.value = targetLang;
    select.dispatchEvent(new Event('change'));
  }
}

init().catch((error) => {
  elements.grid.innerHTML = `<div class="surface rounded-lg p-8 text-sm text-red-600">Unable to load tool catalog: ${escapeHtml(error.message)}</div>`;
});

// ─── Dynamic GTAG for homepage ───
(function() {
  if (document.querySelector('script[src*="googletagmanager.com/gtag/js"]')) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function(){ window.dataLayer.push(arguments); };
  var gtagScript = document.createElement('script');
  gtagScript.async = true;
  gtagScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-HRN5TZ61NL';
  gtagScript.onload = function() {
    window.gtag('js', new Date());
    window.gtag('config', 'G-HRN5TZ61NL', {
      page_path: window.location.pathname,
      page_title: document.title,
      page_location: window.location.href
    });
  };
  var first = document.getElementsByTagName('script')[0];
  if (first && first.parentNode) first.parentNode.insertBefore(gtagScript, first);
  else document.head.appendChild(gtagScript);
})();

// ─── Custom 49-Feature Accessibility Widget ───
(function() {
  if (window.__GTH_A11Y_LOADED) return;
  var s = document.createElement('script');
  s.src = 'assets/accessibility-widget.js';
  s.defer = true;
  document.head.appendChild(s);
})();
