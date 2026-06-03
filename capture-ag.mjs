import { chromium } from './node_modules/playwright/index.mjs';
const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('https://antigravity.google/', { waitUntil: 'networkidle', timeout: 30000 });
await page.waitForTimeout(4000);
const positions = [0, 900, 1800, 2700, 3600, 4500, 5400, 6300];
for (let i = 0; i < positions.length; i++) {
  await page.evaluate(y => window.scrollTo(0, y), positions[i]);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `/tmp/ag-full-${i+1}.png`, clip: { x: 0, y: 0, width: 1440, height: 900 } });
}
await browser.close();
console.log('Done');
