import { test, expect } from '@playwright/test';
import { login, TEST_USER } from './helpers/auth';

test.describe('Settings', () => {
  test.skip(!process.env.E2E_AUTHENTICATED, 'Requires authenticated user');

  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USER);
  });

  test('navigates settings tabs', async ({ page }) => {
    await page.goto('/settings/profile');
    await expect(page.getByRole('heading', { name: 'الإعدادات' })).toBeVisible();
    await page.getByRole('link', { name: 'الأمان' }).click();
    await expect(page).toHaveURL(/settings\/security/);
  });

  test('theme switch persists', async ({ page }) => {
    await page.goto('/settings/appearance');
    await page.getByRole('button', { name: 'فاتح' }).click();
    await page.reload();
    const html = page.locator('html');
    await expect(html).not.toHaveClass(/dark/);
  });
});
