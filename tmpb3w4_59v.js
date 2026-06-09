
const puppeteer = require('puppeteer');
const { pathToFileURL } = require('url');
const url = 'http://127.0.0.1:8002/legacy/online-tools/qr-code/index.html';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const messages = [];
  page.on('console', msg => messages.push('console:' + msg.type() + ':' + msg.text()));
  page.on('pageerror', err => messages.push('pageerror:' + (err.message || String(err))));
  await page.goto(url, { waitUntil: 'load' });
  const scriptText = await page.evaluate(() => {
    const scripts = Array.from(document.querySelectorAll('script'));
    return scripts.map(s => ({src: s.src, text: s.innerText.slice(0, 300)})).slice(-3);
  });
  const fetchQueryObj = await page.evaluate(() => {
    try { return window.fetchQuery ? window.fetchQuery() : null; } catch (e) { return 'ERR:'+e.message; }
  });
  await new Promise(r => setTimeout(r, 500));
  await browser.close();
  console.log('messages:' + JSON.stringify(messages));
  console.log('scriptText:' + JSON.stringify(scriptText, null, 2));
  console.log('fetchQuery:' + JSON.stringify(fetchQueryObj));
})();
