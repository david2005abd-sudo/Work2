import { test, expect } from '@playwright/test';

test.describe('Public pages', () => {
  const pages: Array<{ path: string; heading: RegExp }> = [
    { path: '/', heading: /محادثات ذكية/ },
    { path: '/about', heading: /من نحن/ },
    { path: '/services', heading: /الخدمات/ },
    { path: '/contact', heading: /تواصل معنا/ },
    { path: '/faq', heading: /الأسئلة الشائعة/ },
    { path: '/privacy', heading: /سياسة الخصوصية/ },
    { path: '/terms', heading: /شروط الاستخدام/ },
  ];

  for (const { path, heading } of pages) {
    test(`renders ${path}`, async ({ page }) => {
      await page.goto(path);
      await expect(page.getByRole('heading', { level: 1 })).toContainText(heading);
    });
  }

  test('404 page shows', async ({ page }) => {
    const res = await page.goto('/nonexistent-page-xyz');
    expect(res?.status()).toBe(404);
    await expect(page.getByText('الصفحة غير موجودة')).toBeVisible();
  });

  test('theme toggle switches to light', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await page.getByRole('button', { name: /الوضع الفاتح/ }).click();
    await expect(html).not.toHaveClass(/dark/);
  });
});
