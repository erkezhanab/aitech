# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: auth-flow.spec.ts >> Authentication Flow >> should login with email and password
- Location: src/tests/e2e/auth-flow.spec.ts:46:7

# Error details

```
Error: page.goto: NS_ERROR_REDIRECT_LOOP
Call log:
  - navigating to "http://localhost:3000/kk", waiting until "load"

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - heading [level=1] [ref=e5]
  - paragraph
  - paragraph
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | // E2E tests require Supabase to be configured - they will be skipped by default
  4  | // To run them, ensure Supabase is available and comment out the line below
  5  | 
  6  | test.describe('Authentication Flow', () => {
  7  |   const locale = 'kk';
  8  | 
  9  |   test.beforeEach(async ({ page }) => {
> 10 |     await page.goto(`/${locale}`);
     |                ^ Error: page.goto: NS_ERROR_REDIRECT_LOOP
  11 |   });
  12 | 
  13 |   test('should register new user with email', async ({ page }) => {
  14 |     await page.click('text=/Тіркелу/i');
  15 |     await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 });
  16 |     await page.fill('input[type="email"]', `test-${Date.now()}@example.com`);
  17 |     await page.fill('input[type="password"]', 'TestPassword123!');
  18 |     const confirmPasswordInputs = page.locator('input[type="password"]');
  19 |     if (await confirmPasswordInputs.count() > 1) {
  20 |       await confirmPasswordInputs.last().fill('TestPassword123!');
  21 |     }
  22 |     await page.click('button:has-text("Тіркелу")');
  23 |     await page.waitForURL(new RegExp(`/${locale}/onboarding`), { timeout: 5000 }).catch(() => {});
  24 |   });
  25 | 
  26 |   test('should show error for invalid email', async ({ page }) => {
  27 |     await page.click('text=/Тіркелу/i');
  28 |     await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 });
  29 |     await page.fill('input[type="email"]', 'invalid-email');
  30 |     await page.click('button:has-text("Тіркелу")');
  31 |     await expect(page.locator('[role="alert"], text=/error/i')).toBeVisible().catch(() => {});
  32 |   });
  33 | 
  34 |   test('should show error for password mismatch', async ({ page }) => {
  35 |     await page.click('text=/Тіркелу/i');
  36 |     await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 });
  37 |     const passwordInputs = page.locator('input[type="password"]');
  38 |     await passwordInputs.first().fill('Password123!');
  39 |     if (await passwordInputs.count() > 1) {
  40 |       await passwordInputs.last().fill('Password456!');
  41 |     }
  42 |     await page.click('button:has-text("Тіркелу")');
  43 |     await expect(page.locator('[role="alert"]')).toBeVisible().catch(() => {});
  44 |   });
  45 | 
  46 |   test('should login with email and password', async ({ page }) => {
  47 |     await page.click('text=/Кіру/i');
  48 |     await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
  49 |     await page.fill('input[type="email"]', 'test@example.com');
  50 |     await page.fill('input[type="password"]', 'Password123!');
  51 |     await page.click('button:has-text("Кіру")');
  52 |     await page.waitForURL(new RegExp(`/${locale}/(dashboard|onboarding)`), { timeout: 5000 }).catch(() => {});
  53 |   });
  54 | 
  55 |   test('should show error for incorrect password', async ({ page }) => {
  56 |     await page.click('text=/Кіру/i');
  57 |     await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
  58 |     await page.fill('input[type="email"]', 'test@example.com');
  59 |     await page.fill('input[type="password"]', 'WrongPassword');
  60 |     await page.click('button:has-text("Кіру")');
  61 |     await expect(page.locator('[role="alert"]')).toBeVisible().catch(() => {});
  62 |   });
  63 | 
  64 |   test('should remember password toggle state', async ({ page }) => {
  65 |     await page.click('text=/Кіру/i');
  66 |     await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
  67 |     const checkbox = page.locator('input[type="checkbox"]');
  68 |     if (await checkbox.count() > 0) {
  69 |       await checkbox.first().check();
  70 |       await expect(checkbox.first()).toBeChecked();
  71 |     }
  72 |   });
  73 | 
  74 |   test('should show/hide password on toggle', async ({ page }) => {
  75 |     await page.click('text=/Кіру/i');
  76 |     await page.waitForURL(new RegExp(`/${locale}/login`), { timeout: 5000 });
  77 |     const passwordInput = page.locator('input[type="password"]').first();
  78 |     await passwordInput.fill('TestPassword123!');
  79 |     const toggleButton = page.locator('button[aria-label*="пароль"], button[aria-label*="password"]').first();
  80 |     if (await toggleButton.count() > 0) {
  81 |       await toggleButton.click();
  82 |       await expect(passwordInput).toHaveAttribute('type', 'text').catch(() => {});
  83 |     }
  84 |   });
  85 | });
  86 | 
```