/**
 * Basic accessibility audit script.
 * Checks that pages render without common violations.
 * Usage: `node scripts/a11y-audit.mjs http://localhost:3000`
 * For a full axe-core scan, add @axe-core/playwright in CI.
 */
import { chromium } from 'playwright';

const BASE = process.argv[2] ?? 'http://localhost:3000';
const ROUTES = ['/', '/about', '/services', '/contact', '/faq', '/login', '/register'];

const browser = await chromium.launch();
const page = await browser.newPage();

let violations = 0;
for (const route of ROUTES) {
  const res = await page.goto(`${BASE}${route}`, { waitUntil: 'networkidle' });
  const status = res?.status() ?? 0;
  if (status >= 400) {
    console.error(`✗ ${route} returned ${status}`);
    violations++;
    continue;
  }
  const h1Count = await page.locator('h1').count();
  if (h1Count === 0) {
    console.error(`✗ ${route}: no <h1> found`);
    violations++;
  } else if (h1Count > 1) {
    console.warn(`⚠ ${route}: multiple <h1> (${h1Count})`);
  }
  const lang = await page.locator('html').getAttribute('lang');
  if (lang !== 'ar') {
    console.error(`✗ ${route}: html[lang] is "${lang}", expected "ar"`);
    violations++;
  }
  console.log(`✓ ${route}`);
}

await browser.close();
process.exit(violations > 0 ? 1 : 0);
