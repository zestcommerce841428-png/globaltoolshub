
const puppeteer = require('puppeteer');
const url = 'http://127.0.0.1:8001/legacy/online-tools/qr-code/index.html';
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => { if (msg.type() === 'error') console.log('CONSOLE_ERROR:' + msg.text()); });
  page.on('pageerror', err => console.log('PAGE_ERROR:' + (err.message || String(err))));
  page.on('requestfailed', req => {
    const f = req.failure();
    console.log('REQUEST_FAILED:' + req.url() + '|' + (f ? f.errorText : 'failed') + '|' + req.resourceType());
  });
  page.on('response', res => { if (res.status() >= 400) console.log('RESPONSE_FAILED:' + res.status() + '|' + res.url() + '|' + res.request().resourceType()); });
  console.log('URL=' + url);
  await page.goto(url, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 1000));
  await browser.close();
})();
