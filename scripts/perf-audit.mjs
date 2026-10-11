import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const ROUTES = ['/', '/faq', '/login'];

const browser = await chromium.launch();
const page = await browser.newPage();

for (const route of ROUTES) {
  const start = Date.now();
  await page.goto(`${BASE}${route}`, { waitUntil: 'load' });
  const ttfb = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    return nav ? nav.responseStart - nav.requestStart : 0;
  });
  const paint = await page.evaluate(() => {
    const entries = performance.getEntriesByType('paint');
    const fp = entries.find((e) => e.name === 'first-contentful-paint');
    return fp?.startTime ?? 0;
  });
  const elapsed = Date.now() - start;
  console.log(`✓ ${route}: TTFB ${ttfb.toFixed(0)}ms | FCP ${paint.toFixed(0)}ms | total ${elapsed}ms`);
}

await browser.close();
