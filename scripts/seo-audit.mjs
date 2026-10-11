import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const ROUTES = ['/', '/about', '/services', '/contact', '/faq', '/privacy', '/terms'];

const browser = await chromium.launch();
const page = await browser.newPage();

let issues = 0;
for (const route of ROUTES) {
  await page.goto(`${BASE}${route}`, { waitUntil: 'domcontentloaded' });

  const title = await page.title();
  if (!title || title.length < 10 || title.length > 70) {
    console.error(`✗ ${route}: title length ${title.length}`);
    issues++;
  }

  const desc = await page.locator('meta[name="description"]').getAttribute('content');
  if (!desc || desc.length < 50 || desc.length > 170) {
    console.error(`✗ ${route}: description length ${desc?.length ?? 0}`);
    issues++;
  }

  const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
  if (!canonical) {
    console.error(`✗ ${route}: missing canonical`);
    issues++;
  }

  const ogTitle = await page.locator('meta[property="og:title"]').getAttribute('content');
  if (!ogTitle) {
    console.error(`✗ ${route}: missing og:title`);
    issues++;
  }

  console.log(`✓ ${route} | title: ${title.length} | desc: ${desc?.length ?? 0}`);
}

await browser.close();
process.exit(issues > 0 ? 1 : 0);
