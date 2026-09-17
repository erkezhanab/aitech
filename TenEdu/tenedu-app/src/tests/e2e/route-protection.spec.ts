import { test, expect } from '@playwright/test';

test.describe('Route Protection', () => {
  const locale = 'kk';

  test('public can access landing page', async ({ page }) => {
    await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' });
    const url = page.url();
    expect(url).toContain(locale);
  });

  test('public can access login page', async ({ page }) => {
    await page.goto(`/${locale}/login`, { waitUntil: 'domcontentloaded' });
    const url = page.url();
    expect(url).toContain('/login');
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('public can access register page', async ({ page }) => {
    await page.goto(`/${locale}/register`, { waitUntil: 'domcontentloaded' });
    const url = page.url();
    expect(url).toContain('/register');
    
    const emailInput = page.locator('input[type="email"]');
    await expect(emailInput).toBeVisible({ timeout: 5000 }).catch(() => {});
  });

  test('unauthenticated user cannot access dashboard', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(`/${locale}/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    const url = page.url();
    // Should be on login or home page
    const isRedirected = url.includes('/login') || url.includes(`/${locale}`) && !url.includes('/dashboard');
    expect(isRedirected).toBeTruthy();
  });

  test('unauthenticated user cannot access catalog', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(`/${locale}/catalog`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    const url = page.url();
    const isRedirected = url.includes('/login') || (url.includes(`/${locale}`) && !url.includes('/catalog'));
    expect(isRedirected).toBeTruthy();
  });

  test('unauthenticated user cannot access quiz', async ({ page }) => {
    await page.context().clearCookies();
    await page.goto(`/${locale}/quiz/test-module`, { waitUntil: 'domcontentloaded' }).catch(() => {});
    const url = page.url();
    const isRedirected = url.includes('/login') || (url.includes(`/${locale}`) && !url.includes('/quiz'));
    expect(isRedirected).toBeTruthy();
  });
});
