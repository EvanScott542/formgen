import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('/');

  // Expect the app toolbar title to contain a substring.
  expect(await page.locator('.app-title').innerText()).toContain('Formgen Playground');
});
