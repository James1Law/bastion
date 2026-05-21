import { test, expect } from '@playwright/test';

test('landing page loads with hero and primary CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Bastion/);
  await expect(page.getByRole('heading', { level: 1 })).toContainText(/security-first IDE/i);
  await expect(page.getByRole('link', { name: /join the waitlist/i })).toBeVisible();
});
