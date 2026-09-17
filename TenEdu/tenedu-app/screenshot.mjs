import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage();

const screenshots = [
  { name: 'landing', path: 'http://localhost:3000/' },
  { name: 'catalog', path: 'http://localhost:3000/catalog' },
];

for (const shot of screenshots) {
  try {
    await page.goto(shot.path, { waitUntil: 'domcontentloaded', timeout: 5000 }).catch(() => {});
    await page.screenshot({ path: `/tmp/design-${shot.name}.png`, fullPage: false });
    console.log(`✓ ${shot.name}`);
  } catch (e) {
    console.log(`! ${shot.name}: ${e.message}`);
  }
}

await browser.close();
