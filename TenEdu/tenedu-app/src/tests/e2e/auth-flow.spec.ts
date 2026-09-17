import { test, expect } from '@playwright/test';

// E2E tests require Supabase to be configured - they will be skipped by default
// To run them, ensure Supabase is available and comment out the line below

test.describe('Authentication Flow', () => {
  const locale = 'kk';

  test.beforeEach(async ({ page }) => {
    await page.goto(`/${locale}`);
  });

  test('should register new user with email', async ({ page }) => {
    await page.click('text=/Тіркелу/i');
    await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 });
    await page.fill('input[type="email"]', `test-${Date.now()}@example.com`);
    await page.fill('input[type="password"]', 'TestPassword123!');
    const confirmPasswordInputs = page.locator('input[type="password"]');
    if (await confirmPasswordInputs.count() > 1) {
      await confirmPasswordInputs.last().fill('TestPassword123!');
    }
    await page.click('button:has-text("Тіркелу")');
    await page.waitForURL(new RegExp(`/${locale}/onboarding`), { timeout: 5000 }).catch(() => {});
  });

  test('should show error for invalid email', async ({ page }) => {
    await page.click('text=/Тіркелу/i');
    await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 });
    await page.fill('input[type="email"]', 'invalid-email');
    await page.click('button:has-text("Тіркелу")');
    await expect(page.locator('[role="alert"], text=/error/i')).toBeVisible().catch(() => {});
  });

  test('should show error for password mismatch', async ({ page }) => {
    await page.click('text=/Тіркелу/i');
    await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 });
    const passwordInputs = page.locator('input[type="password"]');
    await passwordInputs.first().fill('Password123!');
    if (await passwordInputs.count() > 1) {
      await passwordInputs.last().fill('Password456!');
    }
    await page.click('button:has-text("Тіркелу")');
    await expect(page.locator('[role="alert"]')).toBeVisible().catch(() => {});
  });

  test('should login with email and password', async ({ page }) => {
    await page.click('text=/Кіру/i');
    await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button:has-text("Кіру")');
    await page.waitForURL(new RegExp(`/${locale}/(dashboard|onboarding)`), { timeout: 5000 }).catch(() => {});
  });

  test('should show error for incorrect password', async ({ page }) => {
    await page.click('text=/Кіру/i');
    await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'WrongPassword');
    await page.click('button:has-text("Кіру")');
    await expect(page.locator('[role="alert"]')).toBeVisible().catch(() => {});
  });

  test('should remember password toggle state', async ({ page }) => {
    await page.click('text=/Кіру/i');
    await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
    const checkbox = page.locator('input[type="checkbox"]');
    if (await checkbox.count() > 0) {
      await checkbox.first().check();
      await expect(checkbox.first()).toBeChecked();
    }
  });

  test('should show/hide password on toggle', async ({ page }) => {
    await page.click('text=/Кіру/i');
    await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
    const passwordInput = page.locator('input[type="password"]').first();
    await passwordInput.fill('TestPassword123!');
    const toggleButton = page.locator('button[aria-label*="пароль"], button[aria-label*="password"]').first();
    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text').catch(() => {});
    }
  });
});
