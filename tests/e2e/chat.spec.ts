import { test, expect } from '@playwright/test';
import { login, TEST_USER } from './helpers/auth';

test.describe('Chat', () => {
  test.skip(!process.env.E2E_AUTHENTICATED, 'Requires pre-created authenticated user');

  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USER);
  });

  test('creates a new conversation', async ({ page }) => {
    await page.goto('/chat/new');
    await expect(page.getByText(/مرحبًا، كيف أساعدك اليوم/)).toBeVisible();

    const composer = page.getByPlaceholder(/اكتب رسالتك/);
    await composer.fill('مرحبًا');
    await composer.press('Enter');

    await expect(page).toHaveURL(/chat\/[0-9a-f-]{36}/, { timeout: 20_000 });
  });

  test('navigates between pages', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByRole('heading', { name: 'لوحة التحكم' })).toBeVisible();

    await page.getByRole('link', { name: 'البحث' }).click();
    await expect(page).toHaveURL(/search/);

    await page.getByRole('link', { name: 'المكتبة' }).click();
    await expect(page).toHaveURL(/library/);
  });
});
