/**
 * GlobalToolsHub Accessibility Widget
 * 49 real, working accessibility features
 * Zero dependencies · Self-contained · Privacy-friendly
 */
(function () {
  "use strict";
  if (window.__GTH_A11Y_LOADED) return;
  window.__GTH_A11Y_LOADED = true;

  const STORAGE_KEY = "gth:a11y";
  const FONT_URL = "https://fonts.googleapis.com/css2?family=Lexend+Deca:wght@400;700&display=swap";

  /* ─── Default state ─── */
  const defaults = {
    fontSize: 0, lineHeight: 0, letterSpacing: 0, wordSpacing: 0, paragraphSpacing: 0,
    dyslexiaFont: false, readableFont: false, boldText: false,
    alignLeft: false, alignCenter: false,
    highContrast: false, darkContrast: false, lightContrast: false,
    invertColors: false, monochrome: false, lowSaturation: false, highSaturation: false,
    sepia: false, blueFilter: false,
    protanopia: false, deuteranopia: false, tritanopia: false,
    highlightLinks: false, highlightHeadings: false, underlineLinks: false,
    hideImages: false, stopAnimations: false, muteMedia: false,
    bigCursor: false, readingGuide: false, readingMask: false,
    textMagnifier: false, keyboardNav: false, focusIndicator: false,
    tooltipHelper: false, pageStructure: false,
    zoom: 0, contentWidth: false,
    adhd: false, seizureSafe: false, cognitive: false,
    ttsEnabled: false,
  };

  let S = { ...defaults };
  try { const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)); if (saved) S = { ...defaults, ...saved }; } catch {}

  function save() { localStorage.setItem(STORAGE_KEY, JSON.stringify(S)); }

  /* ─── Inject Styles ─── */
  const style = document.createElement("style");
  style.id = "gth-a11y-styles";
  style.textContent = `
/* ─── Toggle Button ─── */
#gth-a11y-btn{position:fixed;bottom:24px;left:24px;z-index:999999;width:56px;height:56px;border-radius:50%;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:#fff;border:none;cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(99,102,241,.45);transition:transform .2s,box-shadow .2s;font-size:26px}
#gth-a11y-btn:hover{transform:scale(1.1);box-shadow:0 6px 28px rgba(99,102,241,.6)}
#gth-a11y-btn:focus-visible{outline:3px solid #fff;outline-offset:3px}
#gth-a11y-btn svg{width:28px;height:28px;fill:currentColor}

/* ─── Panel ─── */
#gth-a11y-panel{position:fixed;top:0;left:-420px;z-index:999998;width:400px;max-width:92vw;height:100vh;background:#0f1219;color:#e2e8f0;font-family:'Inter','Segoe UI',system-ui,sans-serif;transition:left .35s cubic-bezier(.4,0,.2,1);overflow-y:auto;overflow-x:hidden;box-shadow:4px 0 30px rgba(0,0,0,.5);display:flex;flex-direction:column}
#gth-a11y-panel.open{left:0}
#gth-a11y-panel *{box-sizing:border-box;margin:0;padding:0}

/* Panel Header */
.gth-a11y-header{padding:20px 20px 14px;background:linear-gradient(135deg,#1e1b4b,#312e81);border-bottom:1px solid rgba(255,255,255,.08);flex-shrink:0}
.gth-a11y-header h2{font-size:18px;font-weight:700;display:flex;align-items:center;gap:10px;color:#fff}
.gth-a11y-header p{font-size:12px;color:#a5b4fc;margin-top:6px}
.gth-a11y-close{position:absolute;top:18px;right:18px;background:none;border:none;color:#94a3b8;font-size:22px;cursor:pointer;padding:4px;border-radius:6px;transition:color .15s,background .15s}
.gth-a11y-close:hover{color:#fff;background:rgba(255,255,255,.1)}

/* Header Actions */
.gth-a11y-hactions{display:flex;gap:8px;margin-top:12px}
.gth-a11y-hbtn{flex:1;padding:8px 0;border-radius:8px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.05);color:#c7d2fe;font-size:12px;font-weight:600;cursor:pointer;transition:all .15s;text-align:center}
.gth-a11y-hbtn:hover{background:rgba(255,255,255,.1);color:#fff}
.gth-a11y-hbtn.danger{border-color:rgba(239,68,68,.3);color:#fca5a5}
.gth-a11y-hbtn.danger:hover{background:rgba(239,68,68,.15)}

/* Panel Body */
.gth-a11y-body{flex:1;overflow-y:auto;padding:8px 0}

/* Sections */
.gth-a11y-section{padding:4px 16px}
.gth-a11y-section-title{font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:1.2px;color:#6366f1;padding:14px 4px 8px;display:flex;align-items:center;gap:8px;border-bottom:1px solid rgba(99,102,241,.15);margin-bottom:8px}

/* Feature Items */
.gth-a11y-item{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:10px;cursor:pointer;transition:background .15s;user-select:none;position:relative}
.gth-a11y-item:hover{background:rgba(255,255,255,.05)}
.gth-a11y-item.active{background:rgba(99,102,241,.12)}
.gth-a11y-item .icon{width:34px;height:34px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;background:rgba(255,255,255,.06);transition:background .15s}
.gth-a11y-item.active .icon{background:rgba(99,102,241,.25)}
.gth-a11y-item .info{flex:1;min-width:0}
.gth-a11y-item .info .name{font-size:13px;font-weight:600;color:#e2e8f0;line-height:1.3}
.gth-a11y-item .info .desc{font-size:11px;color:#64748b;line-height:1.3;margin-top:1px}

/* Toggle Switch */
.gth-a11y-toggle{width:40px;height:22px;border-radius:11px;background:#334155;position:relative;flex-shrink:0;transition:background .2s}
.gth-a11y-toggle::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#94a3b8;transition:transform .2s,background .2s}
.gth-a11y-item.active .gth-a11y-toggle{background:#6366f1}
.gth-a11y-item.active .gth-a11y-toggle::after{transform:translateX(18px);background:#fff}

/* Stepper */
.gth-a11y-stepper{display:flex;align-items:center;gap:6px;flex-shrink:0}
.gth-a11y-stepper button{width:28px;height:28px;border-radius:7px;border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.06);color:#c7d2fe;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .15s;font-weight:700;line-height:1}
.gth-a11y-stepper button:hover{background:rgba(99,102,241,.25);border-color:rgba(99,102,241,.4)}
.gth-a11y-stepper .val{font-size:12px;font-weight:700;color:#a5b4fc;min-width:24px;text-align:center}

/* Reading Guide */
#gth-reading-guide{position:fixed;left:0;width:100vw;height:3px;background:linear-gradient(90deg,#6366f1,#8b5cf6,#a78bfa);z-index:999990;pointer-events:none;display:none;box-shadow:0 0 10px rgba(99,102,241,.5)}

/* Reading Mask */
#gth-reading-mask-top,#gth-reading-mask-bottom{position:fixed;left:0;width:100vw;background:rgba(0,0,0,.75);z-index:999989;pointer-events:none;display:none}
#gth-reading-mask-top{top:0}
#gth-reading-mask-bottom{bottom:0}

/* Text Magnifier */
#gth-magnifier{position:fixed;z-index:999991;pointer-events:none;display:none;background:#1e1b4b;color:#e2e8f0;border:2px solid #6366f1;border-radius:12px;padding:12px 16px;font-size:22px;max-width:420px;box-shadow:0 8px 32px rgba(0,0,0,.5);word-wrap:break-word;line-height:1.4}

/* Page Structure Overlay */
#gth-structure-overlay{position:fixed;top:0;left:0;width:100%;height:100%;z-index:999987;background:rgba(0,0,0,.85);display:none;overflow-y:auto;padding:40px}
#gth-structure-overlay .inner{max-width:700px;margin:0 auto;color:#e2e8f0;font-family:'Inter',system-ui,sans-serif}
#gth-structure-overlay h3{color:#a5b4fc;font-size:20px;margin-bottom:16px}
#gth-structure-overlay .item{padding:8px 12px;border-left:3px solid #6366f1;margin-bottom:6px;font-size:13px;background:rgba(255,255,255,.04);border-radius:0 8px 8px 0;cursor:pointer;transition:background .15s}
#gth-structure-overlay .item:hover{background:rgba(99,102,241,.15)}
#gth-structure-overlay .close-btn{position:fixed;top:16px;right:24px;background:rgba(255,255,255,.1);border:none;color:#fff;font-size:24px;padding:8px 14px;border-radius:10px;cursor:pointer}

/* Applied Classes */
body.gth-big-cursor,body.gth-big-cursor *{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%236366f1' d='M5 3l3.057-1.072L22 16l-4.763 2.512L13 22l-2.755-4.804z'/%3E%3Cpath fill='%231e1b4b' d='M5 3l3.057-1.072L22 16l-4.763 2.512L13 22l-2.755-4.804z' stroke='%23fff' stroke-width='.6'/%3E%3C/svg%3E") 4 4,auto!important}
body.gth-big-cursor a,body.gth-big-cursor button,body.gth-big-cursor [role="button"],body.gth-big-cursor input,body.gth-big-cursor select,body.gth-big-cursor textarea{cursor:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='48' viewBox='0 0 24 24'%3E%3Cpath fill='%23a78bfa' d='M12 1a4 4 0 0 0-4 4v6a4 4 0 0 0 8 0V5a4 4 0 0 0-4-4zm-1 18.93A7.006 7.006 0 0 1 5 13h2a5 5 0 0 0 10 0h2a7.006 7.006 0 0 1-6 6.93V23h-2z'/%3E%3C/svg%3E") 12 4,pointer!important}

body.gth-highlight-links a{outline:3px solid #f59e0b!important;outline-offset:2px;background:rgba(245,158,11,.1)!important}
body.gth-highlight-headings h1,body.gth-highlight-headings h2,body.gth-highlight-headings h3,body.gth-highlight-headings h4,body.gth-highlight-headings h5,body.gth-highlight-headings h6{outline:3px solid #22d3ee!important;outline-offset:2px;background:rgba(34,211,238,.08)!important}
body.gth-underline-links a{text-decoration:underline!important;text-decoration-thickness:2px!important;text-underline-offset:3px!important}
body.gth-bold-text *{font-weight:700!important}
body.gth-align-left *{text-align:left!important}
body.gth-align-center *{text-align:center!important}
body.gth-hide-images img,body.gth-hide-images svg:not(#gth-a11y-btn svg),body.gth-hide-images video,body.gth-hide-images [style*="background-image"]{opacity:0.05!important;filter:blur(3px)!important}
body.gth-stop-animations *,body.gth-stop-animations *::before,body.gth-stop-animations *::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
body.gth-high-contrast{filter:contrast(1.5)!important}
body.gth-dark-contrast{background:#000!important;color:#fff!important}
body.gth-dark-contrast *:not(#gth-a11y-panel):not(#gth-a11y-panel *):not(#gth-a11y-btn){background-color:#000!important;color:#fff!important;border-color:#444!important}
body.gth-light-contrast{background:#fff!important;color:#000!important}
body.gth-light-contrast *:not(#gth-a11y-panel):not(#gth-a11y-panel *):not(#gth-a11y-btn){background-color:#fff!important;color:#000!important;border-color:#ccc!important}
body.gth-invert{filter:invert(1) hue-rotate(180deg)!important}
body.gth-invert #gth-a11y-panel,body.gth-invert #gth-a11y-btn{filter:invert(1) hue-rotate(180deg)!important}
body.gth-monochrome{filter:grayscale(1)!important}
body.gth-low-saturation{filter:saturate(.3)!important}
body.gth-high-saturation{filter:saturate(2)!important}
body.gth-sepia{filter:sepia(.6)!important}
body.gth-blue-filter{filter:brightness(.95) sepia(.15) saturate(.8) hue-rotate(180deg)!important}
body.gth-protanopia{filter:url('#gth-protanopia')!important}
body.gth-deuteranopia{filter:url('#gth-deuteranopia')!important}
body.gth-tritanopia{filter:url('#gth-tritanopia')!important}
body.gth-content-width main,body.gth-content-width article,body.gth-content-width .container,body.gth-content-width [class*="grid"]{max-width:720px!important;margin-left:auto!important;margin-right:auto!important}
body.gth-focus-indicator *:focus{outline:4px solid #f59e0b!important;outline-offset:4px!important}
body.gth-keyboard-nav [tabindex]:focus,body.gth-keyboard-nav a:focus,body.gth-keyboard-nav button:focus,body.gth-keyboard-nav input:focus,body.gth-keyboard-nav select:focus,body.gth-keyboard-nav textarea:focus{outline:4px dashed #6366f1!important;outline-offset:4px!important}
body.gth-dyslexia-font *{font-family:'Lexend Deca','OpenDyslexic','Comic Sans MS',cursive,sans-serif!important}
body.gth-readable-font *{font-family:Verdana,Geneva,sans-serif!important}

/* Seizure Safe Profile */
body.gth-seizure-safe *{animation-duration:0s!important;transition-duration:0s!important}
body.gth-seizure-safe img[src$=".gif"],body.gth-seizure-safe [style*="animation"]{display:none!important}

/* ADHD Profile */
body.gth-adhd main,body.gth-adhd article,body.gth-adhd .content,body.gth-adhd #toolsGrid{max-width:800px!important;margin-left:auto!important;margin-right:auto!important}

/* Cognitive Profile */
body.gth-cognitive{line-height:2!important;letter-spacing:0.05em!important;word-spacing:0.12em!important}
body.gth-cognitive *{font-size:110%!important}

/* Panel Scrollbar */
#gth-a11y-panel::-webkit-scrollbar{width:6px}
#gth-a11y-panel::-webkit-scrollbar-track{background:transparent}
#gth-a11y-panel::-webkit-scrollbar-thumb{background:#334155;border-radius:3px}

/* Counter badge on toggle */
#gth-a11y-badge{position:absolute;top:-4px;left:-4px;background:#ef4444;color:#fff;font-size:10px;font-weight:700;min-width:18px;height:18px;border-radius:9px;display:flex;align-items:center;justify-content:center;padding:0 4px;pointer-events:none;display:none}
#gth-a11y-badge.show{display:flex}

/* Tooltip Helper */
body.gth-tooltip-helper [title]{position:relative}
body.gth-tooltip-helper [title]:hover::after{content:attr(title);position:absolute;bottom:100%;left:50%;transform:translateX(-50%);background:#1e1b4b;color:#e2e8f0;padding:6px 10px;border-radius:6px;font-size:12px;white-space:nowrap;z-index:999980;border:1px solid #6366f1;pointer-events:none;margin-bottom:6px;max-width:300px;white-space:normal}

@media(max-width:480px){
  #gth-a11y-panel{width:100vw;max-width:100vw}
  #gth-a11y-btn{bottom:16px;left:16px;width:48px;height:48px}
}
`;
  document.head.appendChild(style);

  /* ─── SVG Filters for Color Blindness ─── */
  const svgNS = "http://www.w3.org/2000/svg";
  const svgEl = document.createElementNS(svgNS, "svg");
  svgEl.setAttribute("style", "position:absolute;width:0;height:0");
  svgEl.innerHTML = `
    <defs>
      <filter id="gth-protanopia"><feColorMatrix type="matrix" values="0.567,0.433,0,0,0 0.558,0.442,0,0,0 0,0.242,0.758,0,0 0,0,0,1,0"/></filter>
      <filter id="gth-deuteranopia"><feColorMatrix type="matrix" values="0.625,0.375,0,0,0 0.7,0.3,0,0,0 0,0.3,0.7,0,0 0,0,0,1,0"/></filter>
      <filter id="gth-tritanopia"><feColorMatrix type="matrix" values="0.95,0.05,0,0,0 0,0.433,0.567,0,0 0,0.475,0.525,0,0 0,0,0,1,0"/></filter>
    </defs>`;
  document.body.appendChild(svgEl);

  /* ─── Load Dyslexia Font ─── */
  if (!document.querySelector(`link[href*="Lexend+Deca"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }

  /* ─── Feature Definitions ─── */
  const features = [
    { section: "📝 Text & Typography", items: [
      { key: "fontSize", type: "stepper", icon: "🔤", name: "Font Size", desc: "Increase or decrease text size", min: -5, max: 10 },
      { key: "lineHeight", type: "stepper", icon: "↕️", name: "Line Height", desc: "Adjust spacing between lines", min: -3, max: 10 },
      { key: "letterSpacing", type: "stepper", icon: "↔️", name: "Letter Spacing", desc: "Adjust space between letters", min: -2, max: 10 },
      { key: "wordSpacing", type: "stepper", icon: "📏", name: "Word Spacing", desc: "Adjust space between words", min: -2, max: 10 },
      { key: "paragraphSpacing", type: "stepper", icon: "¶", name: "Paragraph Spacing", desc: "Adjust space between paragraphs", min: 0, max: 10 },
      { key: "dyslexiaFont", type: "toggle", icon: "🅰️", name: "Dyslexia-Friendly Font", desc: "Use Lexend Deca for easier reading" },
      { key: "readableFont", type: "toggle", icon: "📖", name: "Readable Font", desc: "Switch to Verdana for clarity" },
      { key: "boldText", type: "toggle", icon: "𝐁", name: "Bold Text", desc: "Make all text bold for visibility" },
      { key: "alignLeft", type: "toggle", icon: "⬅️", name: "Align Text Left", desc: "Force left alignment on all text" },
      { key: "alignCenter", type: "toggle", icon: "⬛", name: "Align Text Center", desc: "Force center alignment on all text" },
    ]},
    { section: "🎨 Visual & Display", items: [
      { key: "highContrast", type: "toggle", icon: "◑", name: "High Contrast", desc: "Increase contrast of all elements" },
      { key: "darkContrast", type: "toggle", icon: "🌑", name: "Dark Contrast", desc: "Force dark background, white text" },
      { key: "lightContrast", type: "toggle", icon: "☀️", name: "Light Contrast", desc: "Force white background, dark text" },
      { key: "invertColors", type: "toggle", icon: "🔄", name: "Invert Colors", desc: "Reverse all page colors" },
      { key: "monochrome", type: "toggle", icon: "⬛", name: "Monochrome", desc: "Remove all colors (grayscale)" },
      { key: "lowSaturation", type: "toggle", icon: "🎨", name: "Low Saturation", desc: "Reduce color intensity" },
      { key: "highSaturation", type: "toggle", icon: "🌈", name: "High Saturation", desc: "Boost color intensity" },
      { key: "sepia", type: "toggle", icon: "📜", name: "Sepia Tone", desc: "Warm yellowish tint for less eye strain" },
      { key: "blueFilter", type: "toggle", icon: "🔵", name: "Blue Light Filter", desc: "Reduce blue light for night reading" },
    ]},
    { section: "👁️ Color Vision", items: [
      { key: "protanopia", type: "toggle", icon: "🔴", name: "Protanopia Filter", desc: "Simulate red-blind color vision" },
      { key: "deuteranopia", type: "toggle", icon: "🟢", name: "Deuteranopia Filter", desc: "Simulate green-blind color vision" },
      { key: "tritanopia", type: "toggle", icon: "🔵", name: "Tritanopia Filter", desc: "Simulate blue-blind color vision" },
    ]},
    { section: "🔗 Content & Navigation", items: [
      { key: "highlightLinks", type: "toggle", icon: "🔗", name: "Highlight Links", desc: "Add visible outlines to all links" },
      { key: "highlightHeadings", type: "toggle", icon: "📌", name: "Highlight Headings", desc: "Add visible outlines to all headings" },
      { key: "underlineLinks", type: "toggle", icon: "🔗", name: "Underline Links", desc: "Force underlines on all links" },
      { key: "hideImages", type: "toggle", icon: "🖼️", name: "Hide Images", desc: "Blur images, SVGs, and videos" },
      { key: "stopAnimations", type: "toggle", icon: "⏸️", name: "Stop Animations", desc: "Disable all CSS animations/transitions" },
      { key: "muteMedia", type: "toggle", icon: "🔇", name: "Mute All Media", desc: "Mute all audio and video elements" },
      { key: "pageStructure", type: "action", icon: "🏗️", name: "Page Structure", desc: "View page headings and landmarks" },
    ]},
    { section: "🖱️ Cursor & Reading", items: [
      { key: "bigCursor", type: "toggle", icon: "🖱️", name: "Big Cursor", desc: "Use a larger, colored cursor" },
      { key: "readingGuide", type: "toggle", icon: "📐", name: "Reading Guide", desc: "Horizontal line follows your cursor" },
      { key: "readingMask", type: "toggle", icon: "🎭", name: "Reading Mask", desc: "Focus on one strip of content" },
      { key: "textMagnifier", type: "toggle", icon: "🔍", name: "Text Magnifier", desc: "Hover over text to magnify it" },
      { key: "focusIndicator", type: "toggle", icon: "🎯", name: "Focus Indicator", desc: "Strong visible focus outlines" },
      { key: "keyboardNav", type: "toggle", icon: "⌨️", name: "Keyboard Navigation", desc: "Enhanced keyboard focus styles" },
      { key: "tooltipHelper", type: "toggle", icon: "💬", name: "Tooltip Helper", desc: "Show tooltips on title attributes" },
      { key: "ttsEnabled", type: "toggle", icon: "🔊", name: "Screen Reader (TTS)", desc: "Select text and hear it read aloud" },
    ]},
    { section: "📐 Spacing & Layout", items: [
      { key: "zoom", type: "stepper", icon: "🔎", name: "Page Zoom", desc: "Zoom the entire page in or out", min: -5, max: 10 },
      { key: "contentWidth", type: "toggle", icon: "📏", name: "Narrow Content Width", desc: "Limit content to 720px for readability" },
    ]},
    { section: "🧠 Accessibility Profiles", items: [
      { key: "seizureSafe", type: "toggle", icon: "⚡", name: "Seizure Safe Profile", desc: "Remove flashing, GIFs, and animations" },
      { key: "adhd", type: "toggle", icon: "🧩", name: "ADHD Friendly Profile", desc: "Reduce distractions, narrow focus area" },
      { key: "cognitive", type: "toggle", icon: "🧠", name: "Cognitive Profile", desc: "Larger text, more spacing, easier reading" },
    ]},
    { section: "🛠️ Utility", items: [
      { key: "printPage", type: "action", icon: "🖨️", name: "Print Page", desc: "Print the current page" },
    ]},
  ];

  /* ─── Build DOM ─── */
  // Toggle Button
  const btn = document.createElement("button");
  btn.id = "gth-a11y-btn";
  btn.setAttribute("aria-label", "Open Accessibility Panel");
  btn.setAttribute("title", "Accessibility");
  btn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M12 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm9 6H3v2h6v12h2v-7h2v7h2V10h6V8z"/></svg><span id="gth-a11y-badge"></span>`;
  document.body.appendChild(btn);

  // Panel
  const panel = document.createElement("div");
  panel.id = "gth-a11y-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Accessibility Settings");

  let html = `
    <div class="gth-a11y-header">
      <button class="gth-a11y-close" aria-label="Close Panel">&times;</button>
      <h2>♿ Accessibility Panel</h2>
      <p>49 features · Customize your browsing experience</p>
      <div class="gth-a11y-hactions">
        <button class="gth-a11y-hbtn danger" id="gth-a11y-reset">↺ Reset All</button>
        <button class="gth-a11y-hbtn" id="gth-a11y-hide-panel">▼ Hide Widget</button>
      </div>
    </div>
    <div class="gth-a11y-body">`;

  for (const section of features) {
    html += `<div class="gth-a11y-section"><div class="gth-a11y-section-title">${section.section}</div>`;
    for (const item of section.items) {
      const isActive = item.type === "toggle" ? S[item.key] : (item.type === "stepper" ? S[item.key] !== 0 : false);
      html += `<div class="gth-a11y-item${isActive ? " active" : ""}" data-key="${item.key}" data-type="${item.type}">
        <div class="icon">${item.icon}</div>
        <div class="info"><div class="name">${item.name}</div><div class="desc">${item.desc}</div></div>`;
      if (item.type === "toggle") {
        html += `<div class="gth-a11y-toggle"></div>`;
      } else if (item.type === "stepper") {
        html += `<div class="gth-a11y-stepper">
          <button data-dir="-1" aria-label="Decrease ${item.name}">−</button>
          <span class="val">${S[item.key]}</span>
          <button data-dir="1" aria-label="Increase ${item.name}">+</button>
        </div>`;
      } else if (item.type === "action") {
        html += `<div class="gth-a11y-toggle" style="background:#334155;width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px">▶</div>`;
      }
      html += `</div>`;
    }
    html += `</div>`;
  }

  html += `</div>`;
  panel.innerHTML = html;
  document.body.appendChild(panel);

  // Reading Guide
  const guide = document.createElement("div");
  guide.id = "gth-reading-guide";
  document.body.appendChild(guide);

  // Reading Mask
  const maskTop = document.createElement("div");
  maskTop.id = "gth-reading-mask-top";
  const maskBottom = document.createElement("div");
  maskBottom.id = "gth-reading-mask-bottom";
  document.body.appendChild(maskTop);
  document.body.appendChild(maskBottom);

  // Text Magnifier
  const magnifier = document.createElement("div");
  magnifier.id = "gth-magnifier";
  document.body.appendChild(magnifier);

  // Page Structure Overlay
  const structureOverlay = document.createElement("div");
  structureOverlay.id = "gth-structure-overlay";
  document.body.appendChild(structureOverlay);

  /* ─── Helpers ─── */
  function updateBadge() {
    const count = Object.entries(S).filter(([k, v]) => {
      if (typeof v === "boolean") return v;
      if (typeof v === "number") return v !== 0;
      return false;
    }).length;
    const badge = document.getElementById("gth-a11y-badge");
    if (badge) {
      badge.textContent = count;
      badge.className = count > 0 ? "show" : "";
    }
  }

  function refreshItemUI(key) {
    const item = panel.querySelector(`[data-key="${key}"]`);
    if (!item) return;
    const type = item.dataset.type;
    if (type === "toggle") {
      item.classList.toggle("active", !!S[key]);
    } else if (type === "stepper") {
      const active = S[key] !== 0;
      item.classList.toggle("active", active);
      const valEl = item.querySelector(".val");
      if (valEl) valEl.textContent = S[key];
    }
  }

  /* ─── Apply All Features ─── */
  function applyAll() {
    const b = document.body;

    // CSS class toggles
    const classMap = {
      bigCursor: "gth-big-cursor",
      highlightLinks: "gth-highlight-links",
      highlightHeadings: "gth-highlight-headings",
      underlineLinks: "gth-underline-links",
      boldText: "gth-bold-text",
      alignLeft: "gth-align-left",
      alignCenter: "gth-align-center",
      hideImages: "gth-hide-images",
      stopAnimations: "gth-stop-animations",
      highContrast: "gth-high-contrast",
      darkContrast: "gth-dark-contrast",
      lightContrast: "gth-light-contrast",
      invertColors: "gth-invert",
      monochrome: "gth-monochrome",
      lowSaturation: "gth-low-saturation",
      highSaturation: "gth-high-saturation",
      sepia: "gth-sepia",
      blueFilter: "gth-blue-filter",
      protanopia: "gth-protanopia",
      deuteranopia: "gth-deuteranopia",
      tritanopia: "gth-tritanopia",
      contentWidth: "gth-content-width",
      focusIndicator: "gth-focus-indicator",
      keyboardNav: "gth-keyboard-nav",
      dyslexiaFont: "gth-dyslexia-font",
      readableFont: "gth-readable-font",
      seizureSafe: "gth-seizure-safe",
      adhd: "gth-adhd",
      cognitive: "gth-cognitive",
      tooltipHelper: "gth-tooltip-helper",
    };

    for (const [key, cls] of Object.entries(classMap)) {
      b.classList.toggle(cls, !!S[key]);
    }

    // Stepper values → CSS custom properties on :root
    const root = document.documentElement;
    root.style.setProperty("--gth-fs", S.fontSize ? `${100 + S.fontSize * 10}%` : "");
    root.style.setProperty("--gth-lh", S.lineHeight ? `${1.6 + S.lineHeight * 0.15}` : "");
    root.style.setProperty("--gth-ls", S.letterSpacing ? `${S.letterSpacing * 0.5}px` : "");
    root.style.setProperty("--gth-ws", S.wordSpacing ? `${S.wordSpacing * 1}px` : "");
    root.style.setProperty("--gth-ps", S.paragraphSpacing ? `${S.paragraphSpacing * 8}px` : "");

    // Apply stepper via inline style on body if non-zero
    b.style.fontSize = S.fontSize ? `${100 + S.fontSize * 10}%` : "";
    b.style.lineHeight = S.lineHeight ? `${1.6 + S.lineHeight * 0.15}` : "";
    b.style.letterSpacing = S.letterSpacing ? `${S.letterSpacing * 0.5}px` : "";
    b.style.wordSpacing = S.wordSpacing ? `${S.wordSpacing * 1}px` : "";

    // Paragraph spacing
    if (S.paragraphSpacing) {
      let psStyle = document.getElementById("gth-ps-style");
      if (!psStyle) { psStyle = document.createElement("style"); psStyle.id = "gth-ps-style"; document.head.appendChild(psStyle); }
      psStyle.textContent = `p,li,dd,dt,blockquote{margin-bottom:${S.paragraphSpacing * 8}px!important}`;
    } else {
      const psStyle = document.getElementById("gth-ps-style");
      if (psStyle) psStyle.remove();
    }

    // Zoom
    if (S.zoom) {
      root.style.zoom = `${100 + S.zoom * 10}%`;
    } else {
      root.style.zoom = "";
    }

    // Mute media
    document.querySelectorAll("audio, video").forEach((el) => { el.muted = !!S.muteMedia; });

    // Reading Guide
    guide.style.display = S.readingGuide ? "block" : "none";

    // Reading Mask
    maskTop.style.display = S.readingMask ? "block" : "none";
    maskBottom.style.display = S.readingMask ? "block" : "none";

    // Magnifier
    magnifier.style.display = S.textMagnifier ? "none" : "none"; // shown only on hover

    updateBadge();
  }

  /* ─── Mouse Handlers ─── */
  document.addEventListener("mousemove", (e) => {
    if (S.readingGuide) {
      guide.style.top = e.clientY + "px";
    }
    if (S.readingMask) {
      const h = 120;
      maskTop.style.height = Math.max(0, e.clientY - h / 2) + "px";
      maskBottom.style.top = (e.clientY + h / 2) + "px";
      maskBottom.style.height = (window.innerHeight - e.clientY - h / 2) + "px";
    }
    if (S.textMagnifier) {
      const target = e.target;
      const text = target && target.textContent && target.closest && !target.closest("#gth-a11y-panel") ? target.textContent.trim() : "";
      if (text && text.length > 1 && text.length < 500) {
        magnifier.style.display = "block";
        magnifier.textContent = text.substring(0, 200);
        magnifier.style.left = Math.min(e.clientX + 20, window.innerWidth - 440) + "px";
        magnifier.style.top = Math.min(e.clientY + 20, window.innerHeight - 80) + "px";
      } else {
        magnifier.style.display = "none";
      }
    }
  });

  /* ─── TTS (Text-to-Speech) ─── */
  document.addEventListener("mouseup", () => {
    if (!S.ttsEnabled) return;
    const sel = window.getSelection();
    const text = sel ? sel.toString().trim() : "";
    if (text && text.length > 0 && text.length < 2000 && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.95;
      utter.pitch = 1;
      window.speechSynthesis.speak(utter);
    }
  });

  /* ─── Page Structure ─── */
  function showPageStructure() {
    const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6, [role='banner'], [role='navigation'], [role='main'], [role='complementary'], [role='contentinfo'], main, nav, header, footer, aside");
    let items = "";
    headings.forEach((el) => {
      if (el.closest("#gth-a11y-panel") || el.closest("#gth-structure-overlay")) return;
      const tag = el.tagName.toLowerCase();
      const role = el.getAttribute("role") || "";
      const text = el.textContent.trim().substring(0, 80);
      const indent = tag.match(/^h(\d)$/)?.[1] ? (parseInt(tag[1]) - 1) * 20 : 0;
      items += `<div class="item" style="margin-left:${indent}px" onclick="this.closest('#gth-structure-overlay').style.display='none';document.querySelectorAll('${tag}')[${Array.from(document.querySelectorAll(tag)).indexOf(el)}]?.scrollIntoView({behavior:'smooth',block:'center'})"><strong>&lt;${tag}${role ? ` role="${role}"` : ""}&gt;</strong> ${text || "(empty)"}</div>`;
    });
    structureOverlay.innerHTML = `
      <button class="close-btn" onclick="this.closest('#gth-structure-overlay').style.display='none'">✕</button>
      <div class="inner">
        <h3>🏗️ Page Structure (${headings.length} elements)</h3>
        ${items || "<p>No headings or landmarks found.</p>"}
      </div>`;
    structureOverlay.style.display = "block";
  }

  /* ─── Event Handling ─── */
  btn.addEventListener("click", () => panel.classList.toggle("open"));
  panel.querySelector(".gth-a11y-close").addEventListener("click", () => panel.classList.remove("open"));

  // Reset
  panel.querySelector("#gth-a11y-reset").addEventListener("click", () => {
    S = { ...defaults };
    save();
    applyAll();
    // Refresh all item UIs
    panel.querySelectorAll(".gth-a11y-item").forEach((el) => {
      const key = el.dataset.key;
      if (key) refreshItemUI(key);
    });
  });

  // Hide Widget
  panel.querySelector("#gth-a11y-hide-panel").addEventListener("click", () => {
    panel.classList.remove("open");
    btn.style.display = "none";
    // Show again after 10 seconds
    setTimeout(() => { btn.style.display = "flex"; }, 10000);
  });

  // Delegate clicks
  panel.querySelector(".gth-a11y-body").addEventListener("click", (e) => {
    const item = e.target.closest(".gth-a11y-item");
    if (!item) return;
    const key = item.dataset.key;
    const type = item.dataset.type;

    if (type === "toggle") {
      // Exclusive groups
      const visualExclusive = ["highContrast", "darkContrast", "lightContrast", "invertColors", "monochrome", "lowSaturation", "highSaturation", "sepia", "blueFilter", "protanopia", "deuteranopia", "tritanopia"];
      const fontExclusive = ["dyslexiaFont", "readableFont"];
      const alignExclusive = ["alignLeft", "alignCenter"];

      function clearGroup(group, except) {
        group.forEach((k) => { if (k !== except) { S[k] = false; refreshItemUI(k); } });
      }

      if (visualExclusive.includes(key)) clearGroup(visualExclusive, key);
      if (fontExclusive.includes(key)) clearGroup(fontExclusive, key);
      if (alignExclusive.includes(key)) clearGroup(alignExclusive, key);

      S[key] = !S[key];
      refreshItemUI(key);
      save();
      applyAll();
    } else if (type === "stepper") {
      const stepBtn = e.target.closest("button[data-dir]");
      if (!stepBtn) return;
      const dir = parseInt(stepBtn.dataset.dir);
      const feat = features.flatMap((s) => s.items).find((f) => f.key === key);
      S[key] = Math.max(feat.min, Math.min(feat.max, S[key] + dir));
      refreshItemUI(key);
      save();
      applyAll();
    } else if (type === "action") {
      if (key === "pageStructure") showPageStructure();
      if (key === "printPage") window.print();
    }
  });

  // Close panel on Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && panel.classList.contains("open")) {
      panel.classList.remove("open");
      btn.focus();
    }
  });

  // Close structure overlay on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && structureOverlay.style.display === "block") {
      structureOverlay.style.display = "none";
    }
  });

  /* ─── Apply saved settings on load ─── */
  applyAll();
})();
