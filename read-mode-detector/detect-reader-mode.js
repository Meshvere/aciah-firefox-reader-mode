import {firefox} from 'playwright';

// Installer Playwright : npx playwright install

// Usage : node detect-reader-mode.js URL

const targetUrl = process.argv[2];

if (!targetUrl) {
    console.error("❌ Utilisation : node detect-reader-mode.js <url>");
    process.exit(1);
}

(async () => {
    // Lancer Firefox en mode headless
    const browser = await firefox.launch({
        headless: false, firefoxUserPrefs: {
            "reader.parse-on-load.enabled": true,
            "reader.parse-on-load.force-enabled": true
        }
    });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Forcer le mode lecture via l'URL spéciale
    const readerUrl = `about:reader?url=${targetUrl}`;
    await page.goto(readerUrl, {waitUntil: 'domcontentloaded'});

    // Extraire le contenu principal
    const content = await page.evaluate(() => {
        const readerMsg = document.getElementsByClassName('reader-message');

        let msgs = [];

        for (const msg of readerMsg) {
            msgs.push(msg.innerHTML);
        }

        return msgs
    });

    // await browser.close();

    const hasReaderMode = !content.includes('Failed to load article from page');

    console.log(hasReaderMode);

    return hasReaderMode;
})();
