const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    page.on('console', msg => {
        if (msg.type() === 'error') console.error(`PAGE ERROR: ${msg.text()}`);
    });

    console.log("Navigating to http://localhost:5173/");
    await page.goto('http://localhost:5173/');
    await new Promise(r => setTimeout(r, 2000));

    const menuStartBtn = await page.$('#menuStartBtn');
    console.log("Found #menuStartBtn?", !!menuStartBtn);

    if (menuStartBtn) {
        console.log("Clicking menuStartBtn...");
        await menuStartBtn.click();
        await new Promise(r => setTimeout(r, 1000));

        const isCategoriesVisible = await page.evaluate(() => {
            return !document.getElementById('categorySection').classList.contains('hidden');
        });
        console.log("Category section visible?", isCategoriesVisible);

        const hasEmojis = await page.evaluate(() => {
            const grid = document.getElementById('categoryGrid');
            if (!grid) return false;
            return grid.innerHTML.includes('🍔') && grid.innerHTML.includes('💻');
        });
        console.log("Emojis present in grid?", hasEmojis);
    }

    console.log("Test OK");
    await browser.close();
})();
