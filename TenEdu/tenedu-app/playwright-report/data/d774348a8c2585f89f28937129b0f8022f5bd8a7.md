# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: full-learning-flow.spec.ts >> Full Learning Flow >> complete happy path: register → onboard → lesson → test → certificate
- Location: src/tests/e2e/full-learning-flow.spec.ts:10:7

# Error details

```
Error: page.goto: too many HTTP redirects
Call log:
  - navigating to "http://localhost:3000/kk", waiting until "load"

```

# Test source

```ts
  1  | import { test } from '@playwright/test';
  2  | 
  3  | // E2E tests require Supabase to be configured - they will be skipped by default
  4  | 
  5  | test.describe('Full Learning Flow', () => {
  6  |   const locale = 'kk';
  7  |   const email = `user-${Date.now()}@test.com`;
  8  |   const password = 'TestPassword123!';
  9  | 
  10 |   test('complete happy path: register → onboard → lesson → test → certificate', async ({ page }) => {
  11 |     // Navigate to register
> 12 |     await page.goto(`/${locale}`);
     |                ^ Error: page.goto: too many HTTP redirects
  13 |     await page.click('text=/Тіркелу/i');
  14 |     await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 }).catch(() => {});
  15 | 
  16 |     // Fill registration form
  17 |     const emailInputs = page.locator('input[type="email"]');
  18 |     if (await emailInputs.count() > 0) {
  19 |       await emailInputs.first().fill(email);
  20 |     }
  21 | 
  22 |     const passwordInputs = page.locator('input[type="password"]');
  23 |     if (await passwordInputs.count() > 0) {
  24 |       await passwordInputs.first().fill(password);
  25 |       if (await passwordInputs.count() > 1) {
  26 |         await passwordInputs.last().fill(password);
  27 |       }
  28 |     }
  29 | 
  30 |     // Submit registration
  31 |     const registerButton = page.locator('button:has-text("Тіркелу")').first();
  32 |     if (await registerButton.count() > 0) {
  33 |       await registerButton.click();
  34 |     }
  35 | 
  36 |     // Wait for onboarding or dashboard
  37 |     await page.waitForURL(new RegExp(`/${locale}/(onboarding|dashboard)`), { timeout: 5000 }).catch(() => {});
  38 | 
  39 |     console.log('✓ Registration flow completed');
  40 |   });
  41 | });
  42 | 
```