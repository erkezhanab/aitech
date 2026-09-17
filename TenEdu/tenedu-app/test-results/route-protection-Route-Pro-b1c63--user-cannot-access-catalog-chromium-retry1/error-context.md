# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: route-protection.spec.ts >> Route Protection >> unauthenticated user cannot access catalog
- Location: src/tests/e2e/route-protection.spec.ts:39:7

# Error details

```
Error: expect(received).toBeTruthy()

Received: false
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Route Protection', () => {
  4  |   const locale = 'kk';
  5  | 
  6  |   test('public can access landing page', async ({ page }) => {
  7  |     await page.goto(`/${locale}`, { waitUntil: 'domcontentloaded' });
  8  |     const url = page.url();
  9  |     expect(url).toContain(locale);
  10 |   });
  11 | 
  12 |   test('public can access login page', async ({ page }) => {
  13 |     await page.goto(`/${locale}/login`, { waitUntil: 'domcontentloaded' });
  14 |     const url = page.url();
  15 |     expect(url).toContain('/login');
  16 |     
  17 |     const emailInput = page.locator('input[type="email"]');
  18 |     await expect(emailInput).toBeVisible({ timeout: 5000 }).catch(() => {});
  19 |   });
  20 | 
  21 |   test('public can access register page', async ({ page }) => {
  22 |     await page.goto(`/${locale}/register`, { waitUntil: 'domcontentloaded' });
  23 |     const url = page.url();
  24 |     expect(url).toContain('/register');
  25 |     
  26 |     const emailInput = page.locator('input[type="email"]');
  27 |     await expect(emailInput).toBeVisible({ timeout: 5000 }).catch(() => {});
  28 |   });
  29 | 
  30 |   test('unauthenticated user cannot access dashboard', async ({ page }) => {
  31 |     await page.context().clearCookies();
  32 |     await page.goto(`/${locale}/dashboard`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  33 |     const url = page.url();
  34 |     // Should be on login or home page
  35 |     const isRedirected = url.includes('/login') || url.includes(`/${locale}`) && !url.includes('/dashboard');
  36 |     expect(isRedirected).toBeTruthy();
  37 |   });
  38 | 
  39 |   test('unauthenticated user cannot access catalog', async ({ page }) => {
  40 |     await page.context().clearCookies();
  41 |     await page.goto(`/${locale}/catalog`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  42 |     const url = page.url();
  43 |     const isRedirected = url.includes('/login') || (url.includes(`/${locale}`) && !url.includes('/catalog'));
> 44 |     expect(isRedirected).toBeTruthy();
     |                          ^ Error: expect(received).toBeTruthy()
  45 |   });
  46 | 
  47 |   test('unauthenticated user cannot access quiz', async ({ page }) => {
  48 |     await page.context().clearCookies();
  49 |     await page.goto(`/${locale}/quiz/test-module`, { waitUntil: 'domcontentloaded' }).catch(() => {});
  50 |     const url = page.url();
  51 |     const isRedirected = url.includes('/login') || (url.includes(`/${locale}`) && !url.includes('/quiz'));
  52 |     expect(isRedirected).toBeTruthy();
  53 |   });
  54 | });
  55 | 
```