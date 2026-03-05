const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
    page.on('pageerror', error => console.error('BROWSER ERROR:', error));

    console.log("Navigating to http://localhost:5173 ...");
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });

    console.log("Navigating to http://localhost:5174 ...");
    await page.goto('http://localhost:5174', { waitUntil: 'networkidle0' }).catch(e => console.log(e.message));

    await browser.close();
})();
