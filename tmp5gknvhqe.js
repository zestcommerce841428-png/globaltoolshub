
const puppeteer = require('puppeteer');
const path = require('path');
const { pathToFileURL } = require('url');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('CONSOLE_ERROR:' + msg.text());
  });
  page.on('pageerror', err => console.log('PAGE_ERROR:' + (err.message || String(err))));
  page.on('requestfailed', req => {
    const f = req.failure();
    console.log('REQUEST_FAILED:' + req.url() + '|' + (f ? f.errorText : 'failed') + '|' + req.resourceType());
  });
  page.on('response', res => {
    if (res.status() >= 400) {
      console.log('RESPONSE_FAILED:' + res.status() + '|' + res.url() + '|' + res.request().resourceType());
    }
  });
  const url = pathToFileURL(path.resolve('legacy/online-tools/qr-code/index.html')).href;
  console.log('URL=' + url);
  await page.goto(url, { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 500));
  await browser.close();
})();
