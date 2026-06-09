
const puppeteer = require('puppeteer');
const url = 'http://127.0.0.1:8004/legacy/online-tools/qr-code/index.html';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  const messages = [];
  page.on('console', msg => messages.push('console:' + msg.type() + ':' + msg.text()));
  page.on('pageerror', err => messages.push('pageerror:' + (err.message || String(err))));
  page.on('requestfailed', req => {
    const f = req.failure();
    messages.push('REQUEST_FAILED:' + req.url() + '|' + (f ? f.errorText : 'failed') + '|' + req.resourceType());
  });
  page.on('response', res => { if (res.status() >= 400) messages.push('RESPONSE_FAILED:' + res.status() + '|' + res.url() + '|' + res.request().resourceType()); });
  console.log('URL=' + url);
  await page.goto(url, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
  console.log('messages:' + JSON.stringify(messages));
})();
