import { test, expect } from '@playwright/test';

test.describe('Admin protection', () => {
  test('anonymous cannot access admin', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/login/);
  });

  test('anonymous cannot access admin users', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/login/);
  });
});
