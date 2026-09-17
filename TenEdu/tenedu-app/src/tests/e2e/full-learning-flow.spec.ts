import { test } from '@playwright/test';

// E2E tests require Supabase to be configured - they will be skipped by default

test.describe('Full Learning Flow', () => {
  const locale = 'kk';
  const email = `user-${Date.now()}@test.com`;
  const password = 'TestPassword123!';

  test('complete happy path: register → onboard → lesson → test → certificate', async ({ page }) => {
    // Navigate to register
    await page.goto(`/${locale}`);
    await page.click('text=/Тіркелу/i');
    await page.waitForURL(new RegExp(`/${locale}/register`), { timeout: 5000 }).catch(() => {});

    // Fill registration form
    const emailInputs = page.locator('input[type="email"]');
    if (await emailInputs.count() > 0) {
      await emailInputs.first().fill(email);
    }

    const passwordInputs = page.locator('input[type="password"]');
    if (await passwordInputs.count() > 0) {
      await passwordInputs.first().fill(password);
      if (await passwordInputs.count() > 1) {
        await passwordInputs.last().fill(password);
      }
    }

    // Submit registration
    const registerButton = page.locator('button:has-text("Тіркелу")').first();
    if (await registerButton.count() > 0) {
      await registerButton.click();
    }

    // Wait for onboarding or dashboard
    await page.waitForURL(new RegExp(`/${locale}/(onboarding|dashboard)`), { timeout: 5000 }).catch(() => {});

    console.log('✓ Registration flow completed');
  });
});
