import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const legacyRoot = path.join(root, "legacy");
const outDir = path.join(root, "assets");

const sources = [
  { dir: "nakul-tools", name: "Nakul Tools" },
  { dir: "online-tools", name: "Online Tools" },
  { dir: "toolverse", name: "ToolVerse" },
  { dir: "usemagictools", name: "UseMagicTools" },
];

const replacements = [
  [/Magic Toolbox/gi, "GlobalToolsHub"],
  [/UseMagicTools/gi, "GlobalToolsHub"],
  [/usemagictools/gi, "globaltoolshub"],
  [/ToolVerse/gi, "GlobalToolsHub"],
  [/NakulTools/gi, "GlobalToolsHub"],
  [/Nakul Tools/gi, "GlobalToolsHub"],
  [/Online Tools/g, "GlobalToolsHub"],
  [/online-tools/g, "global-tools"],
  [/GlobalToolsHub/g, "GlobalToolsHub"],
  [/globaltoolshub/g, "globaltoolshub"],
  [/global-tools/g, "global-tools"],
  [/https:\/\/www\.GlobalToolsHub\.com\//g, "/"],
  [/https:\/\/www\.GlobalToolsHub\.com/g, ""],
  [/www\.GlobalToolsHub\.com/g, ""],
  [/www\.usemagictools\.com/gi, ""],
  [/https:\/\/emn178\.github\.io\/legacy\/(?:legacy\/)*online-tools\//gi, "/legacy/online-tools/"],
  [/https:\/\/emn178\.github\.io\/online-tools\//gi, "/legacy/online-tools/"],
  [/emn178\.github\.io\/online-tools/gi, "legacy/online-tools"],
];

const categoryRules = [
  ["PDF", /pdf|document|word/i],
  ["Image", /image|photo|color|palette|qr|barcode|favicon|watermark|png|ocr|background|ico/i],
  ["Developer", /json|xml|yaml|regex|api|websocket|sqlite|code|syntax|cron|timestamp|uuid|url|base|hex|hash|sha|md5|crc|blake|ripemd|keccak|encrypt|decrypt|rsa|aes|des|ecdsa|crypto|formatter|validator|minifier/i],
  ["Text", /text|word|case|lorem|diff|markdown|chinese/i],
  ["Finance", /currency|gst|loan|emi|invoice/i],
  ["Utility", /calculator|clock|time|unit|password|keyboard|pomodoro|metronome|refresh|whois|ip|file|audio|video|screen/i],
];

const skipDirs = new Set([".git", "node_modules"]);
const textExtensions = new Set([
  ".html",
  ".css",
  ".js",
  ".json",
  ".xml",
  ".txt",
  ".md",
  ".webmanifest",
]);

const staticPageNames = new Set([
  "404.html",
  "about.html",
  "contact.html",
  "privacy.html",
  "privacy-policy.html",
  "term-conditions.html",
  "terms.html",
]);

const staticPageDirs = [
  "category/",
  "docs/",
  ".claude/",
];

function isStaticNonToolPage(relative, sourceDir) {
  const normalized = relative.replaceAll("\\", "/").toLowerCase();
  if (sourceDir !== "toolverse" && normalized === "index.html") return true;
  if (staticPageNames.has(path.basename(normalized))) return true;
  return staticPageDirs.some((dir) => normalized.startsWith(dir));
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function removeBalancedBlock(content, marker) {
  const markerIndex = content.indexOf(marker);
  if (markerIndex === -1) return content;
  const ifIndex = content.lastIndexOf("if", markerIndex);
  const openIndex = content.indexOf("{", ifIndex);
  if (ifIndex === -1 || openIndex === -1) return content;

  let depth = 0;
  for (let index = openIndex; index < content.length; index += 1) {
    if (content[index] === "{") depth += 1;
    if (content[index] === "}") depth -= 1;
    if (depth === 0) {
      return `${content.slice(0, ifIndex)}${content.slice(index + 1)}`;
    }
  }

  return content;
}

function stripAnalytics(content) {
  let updated = content
    .replace(/<!--\s*Google Analytics\s*-->\s*/gi, "")
    .replace(/<script\b[^>]*\bsrc=["'][^"']*googletagmanager\.com\/gtag\/js[^"']*["'][^>]*>\s*<\/script>\s*/gi, "")
    .replace(/<script\b[^>]*\bsrc=["'][^"']*google-analytics\.com\/analytics\.js[^"']*["'][^>]*>\s*<\/script>\s*/gi, "");

  updated = updated.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, body) => {
    if (!/(googletagmanager|google-analytics|dataLayer|gtag\(|G-[A-Z0-9]{6,})/i.test(body)) {
      return match;
    }

    let cleaned = body
      .replace(/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]\s*;?/g, "")
      .replace(/function\s+gtag\s*\(\)\s*\{\s*dataLayer\.push\(arguments\);\s*\}\s*/g, "")
      .replace(/gtag\('js',\s*new Date\(\)\);\s*/g, "")
      .replace(/gtag\('config',\s*'G-[A-Z0-9]+'\);\s*/g, "")
      .replace(/gtag\('event',\s*'[^']+'\);\s*/g, "")
      .replace(/gtag\("event",\s*"[^"]+"\);\s*/g, "")
      .replace(/var\s+gaUrl\s*=\s*['"][^'"]*googletagmanager\.com\/gtag\/js[^'"]*['"];\s*/g, "")
      .replace(/script\.src\s*=\s*gaUrl;\s*/g, "");

    cleaned = removeBalancedBlock(cleaned, "googletagmanager.com/gtag/js").replace(/\n{3,}/g, "\n\n").trim();
    return cleaned ? `<script${attrs}>${cleaned}</script>` : "";
  });

  return updated;
}

function stripAnalyticsCalls(content) {
  return content
    .replace(/\s*onclick=(["'])gtag\(\s*["']event["']\s*,\s*["'][^"']+["']\s*\);?\1/gi, "")
    .replace(/gtag\(\s*["']event["']\s*,\s*["'][^"']+["']\s*\);?/g, "")
    .replace(/gtag\(\s*["']config["']\s*,\s*["']G-[A-Z0-9]+["']\s*\);?/g, "")
    .replace(/gtag\(\s*["']js["']\s*,\s*new Date\(\)\s*\);?/g, "")
    .replace(/window\.dataLayer\s*=\s*window\.dataLayer\s*\|\|\s*\[\]\s*;?/g, "")
    .replace(/function\s+gtag\s*\(\)\s*\{\s*dataLayer\.push\(arguments\);\s*\}\s*/g, "");
}

function extractTitle(content, fallback) {
  const headingMatch = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const titleMatch = content.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return decodeEntities(stripTags(headingMatch?.[1] || titleMatch?.[1] || fallback))
    .replace(/\s*\|\s*GlobalToolsHub.*$/i, "")
    .replace(/\s*-\s*GlobalToolsHub.*$/i, "")
    .trim() || fallback;
}

function extractDescription(content, title) {
  const descriptionMatch = content.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  return decodeEntities(descriptionMatch?.[1] || `Use ${title} online at GlobalToolsHub. Fast, responsive, privacy-friendly browser tool from the unified tools collection.`);
}

function upsertHeadTag(content, pattern, tag) {
  if (pattern.test(content)) return content.replace(pattern, tag);
  return content.replace(/<head([^>]*)>/i, `<head$1>\n    ${tag}`);
}

function upsertDynamicSeo(content, file, sourceRoot) {
  if (!/\.html$/i.test(file) || !/<head[\s>]/i.test(content)) return content;
  const relative = path.relative(sourceRoot, file).replaceAll(path.sep, "/");
  const sourceSlug = path.basename(sourceRoot);
  const title = extractTitle(content, prettyName(file));
  const description = extractDescription(content, title);
  const canonical = `/legacy/${sourceSlug}/${relative}`;
  const keywords = tagsFor(`${title} ${description} ${relative}`).slice(0, 10).join(", ");
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: title,
    url: canonical,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Web Browser",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "GlobalToolsHub" },
    description,
  }).replace(/</g, "\\u003c");

  let updated = content;
  updated = upsertHeadTag(updated, /<title[^>]*>[\s\S]*?<\/title>/i, `<title>${escapeAttribute(title)} - GlobalToolsHub</title>`);
  updated = upsertHeadTag(updated, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${escapeAttribute(description)}">`);
  updated = upsertHeadTag(updated, /<meta\s+name=["']keywords["'][^>]*>/i, `<meta name="keywords" content="${escapeAttribute(keywords)}">`);
  updated = upsertHeadTag(updated, /<meta\s+name=["']author["'][^>]*>/i, `<meta name="author" content="GlobalToolsHub">`);
  updated = upsertHeadTag(updated, /<meta\s+name=["']robots["'][^>]*>/i, `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`);
  updated = upsertHeadTag(updated, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${canonical}">`);
  updated = upsertHeadTag(updated, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${escapeAttribute(`${title} - GlobalToolsHub`)}">`);
  updated = upsertHeadTag(updated, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${escapeAttribute(description)}">`);
  updated = upsertHeadTag(updated, /<meta\s+property=["']og:site_name["'][^>]*>/i, `<meta property="og:site_name" content="GlobalToolsHub">`);
  updated = upsertHeadTag(updated, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${canonical}">`);
  updated = upsertHeadTag(updated, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${escapeAttribute(`${title} - GlobalToolsHub`)}">`);
  updated = upsertHeadTag(updated, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${escapeAttribute(description)}">`);

  const seoScript = `<script type="application/ld+json" data-globaltoolshub-seo>${jsonLd}</script>`;
  if (/<script\b[^>]*data-globaltoolshub-seo[^>]*>[\s\S]*?<\/script>/i.test(updated)) {
    updated = updated.replace(/<script\b[^>]*data-globaltoolshub-seo[^>]*>[\s\S]*?<\/script>/i, seoScript);
  } else {
    updated = updated.replace(/<\/head>/i, `    ${seoScript}\n</head>`);
  }

  let runtimePath = path
    .relative(path.dirname(file), path.join(root, "assets", "seo-runtime.js"))
    .replaceAll(path.sep, "/");
    
  if (file.includes(path.join("legacy", "online-tools"))) {
    runtimePath = "../../assets/seo-runtime.js";
  }

  const seoRuntimeScript = `<script src="${runtimePath}" defer></script>`;
  if (/<script\b[^>]*src=["'][^"']*seo-runtime\.js["'][^>]*>[\s\S]*?<\/script>/i.test(updated)) {
    updated = updated.replace(/<script\b[^>]*src=["'][^"']*seo-runtime\.js["'][^>]*>[\s\S]*?<\/script>/i, seoRuntimeScript);
  } else {
    updated = updated.replace(/<\/head>/i, `    ${seoRuntimeScript}\n</head>`);
  }

  return updated;
}

function prettyName(filePath) {
  const base = path.basename(filePath, ".html");
  const parent = path.basename(path.dirname(filePath));
  const raw = base.toLowerCase() === "index" ? parent : base;
  return raw
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bPdf\b/g, "PDF")
    .replace(/\bJson\b/g, "JSON")
    .replace(/\bXml\b/g, "XML")
    .replace(/\bUrl\b/g, "URL")
    .replace(/\bQr\b/g, "QR")
    .replace(/\bUuid\b/g, "UUID")
    .replace(/\bApi\b/g, "API");
}

function decodeEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function categoryFor(text) {
  const match = categoryRules.find(([, rule]) => rule.test(text));
  return match ? match[0] : "Utility";
}

function tagsFor(text) {
  return Array.from(
    new Set(
      text
        .toLowerCase()
        .replace(/[^a-z0-9+ ]/g, " ")
        .split(/\s+/)
        .filter((word) => word.length > 2 && word.length < 18)
        .slice(0, 12),
    ),
  );
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walk(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function rebrandFile(file, sourceRoot) {
  if (!textExtensions.has(path.extname(file).toLowerCase())) return;
  let content = await fs.readFile(file, "utf8");
  const original = content;

  for (const [pattern, replacement] of replacements) {
    content = content.replace(pattern, replacement);
  }

  if (file.includes(path.join("legacy", "online-tools"))) {
    const relToTools = path.relative(path.join(root, "legacy", "online-tools"), file).replaceAll(path.sep, "/");
    const depth = relToTools.split("/").length - 1;
    const baseHref = depth === 0 ? "./" : "../".repeat(depth);
    content = content.replace(/<base href="[^"]*">/i, `<base href="${baseHref}">`);
    content = content.replace(/\/global-tools\//g, "/legacy/online-tools/");
  }

  content = stripAnalytics(content);
  content = stripAnalyticsCalls(content);
  content = upsertDynamicSeo(content, file, sourceRoot);

  if (content !== original) {
    await fs.writeFile(file, content);
  }
}

async function main() {
  await fs.mkdir(outDir, { recursive: true });
  const tools = [];

  for (const source of sources) {
    const sourceRoot = path.join(legacyRoot, source.dir);
    const files = await walk(sourceRoot);

    for (const file of files) {
      await rebrandFile(file, sourceRoot);
      if (path.extname(file).toLowerCase() !== ".html") continue;
      const relative = path.relative(sourceRoot, file).replaceAll(path.sep, "/");
      if (isStaticNonToolPage(relative, source.dir)) continue;

      const html = await fs.readFile(file, "utf8");
      const fallback = prettyName(file);
      const title = extractTitle(html, fallback);
      const description = extractDescription(html, title);
      const haystack = `${title} ${description} ${relative}`;

      tools.push({
        id: `${source.dir}-${relative}`.replace(/[^a-z0-9]+/gi, "-").replace(/^-|-$/g, "").toLowerCase(),
        title,
        description,
        category: categoryFor(haystack),
        source: source.name,
        url: `legacy/${source.dir}/${relative}`,
        tags: tagsFor(haystack),
      });
    }
  }

  const unique = new Map();
  for (const tool of tools) {
    const key = `${tool.title.toLowerCase()}|${tool.url}`;
    unique.set(key, tool);
  }

  const sorted = Array.from(unique.values()).sort((a, b) => a.title.localeCompare(b.title));
  await fs.writeFile(path.join(outDir, "tools.json"), `${JSON.stringify(sorted, null, 2)}\n`);

  const now = new Date().toISOString().slice(0, 10);
  const urls = ["./", ...sorted.map((tool) => tool.url)];
  await fs.writeFile(
    path.join(root, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((url) => `  <url><loc>/${url}</loc><lastmod>${now}</lastmod><changefreq>weekly</changefreq><priority>${url === "./" ? "1.0" : "0.7"}</priority></url>`)
      .join("\n")}\n</urlset>\n`,
  );

  await fs.writeFile(
    path.join(root, "robots.txt"),
    "User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n",
  );

  console.log(`Generated ${sorted.length} tools.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
