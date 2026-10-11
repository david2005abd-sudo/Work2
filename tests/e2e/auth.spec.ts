import { test, expect } from '@playwright/test';
import { registerUser, login, TEST_USER } from './helpers/auth';

test.describe('Auth flows', () => {
  test('register → verify-email page', async ({ page }) => {
    await registerUser(page);
    await expect(page.getByRole('heading', { name: /تحقق من بريدك/ })).toBeVisible();
  });

  test('login page is accessible from home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'تسجيل الدخول' }).click();
    await expect(page).toHaveURL(/login/);
  });

  test('protected route redirects anonymous user', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/login/);
    expect(page.url()).toContain('next=');
  });

  test('admin route redirects anonymous user to login', async ({ page }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/login/);
  });

  test('login with invalid credentials shows error', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('البريد الإلكتروني').fill('nobody@example.com');
    await page.getByLabel('كلمة المرور').fill('WrongPass1!');
    await page.getByRole('button', { name: /تسجيل الدخول/ }).click();
    await expect(page.getByText(/فشل تسجيل الدخول|تأكد/)).toBeVisible({ timeout: 10_000 });
  });
});
