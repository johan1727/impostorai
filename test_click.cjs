const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error));

    console.log("Navigating to http://localhost:5174 ...");
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' });

    console.log("Waiting for menuStartBtn...");
    await page.waitForSelector('#menuStartBtn', { timeout: 2000 });

    console.log("Clicking menuStartBtn...");
    await page.click('#menuStartBtn');

    // Wait a moment to capture any async or delayed errors
    await new Promise(r => setTimeout(r, 1000));

    console.log("Checking if categories are visible...");
    const isHidden = await page.$eval('#categorySection', el => el.classList.contains('hidden'));
    console.log("categorySection is hidden?", isHidden);

    await browser.close();
})();
