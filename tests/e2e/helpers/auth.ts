import { type Page, expect } from '@playwright/test';

export const TEST_USER = {
  fullName: 'E2E User',
  email: `e2e_${Date.now()}@nados.test`,
  username: `e2e_${Math.random().toString(36).slice(2, 8)}`,
  password: 'Passw0rd!Strong',
};

export async function registerUser(page: Page, user = TEST_USER) {
  await page.goto('/register');
  await page.getByLabel('الاسم الكامل').fill(user.fullName);
  await page.getByLabel('البريد الإلكتروني').fill(user.email);
  await page.getByLabel('اسم المستخدم').fill(user.username);
  await page.getByLabel('كلمة المرور').fill(user.password);
  await page.getByRole('button', { name: /إنشاء الحساب/ }).click();
  await expect(page).toHaveURL(/verify-email/, { timeout: 15_000 });
}

export async function login(page: Page, user = TEST_USER) {
  await page.goto('/login');
  await page.getByLabel('البريد الإلكتروني').fill(user.email);
  await page.getByLabel('كلمة المرور').fill(user.password);
  await page.getByRole('button', { name: /تسجيل الدخول/ }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 15_000 });
}
