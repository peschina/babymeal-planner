import { test, expect } from '@playwright/test';

test('home page shows 30 day cells', async ({ page }) => {
  await page.goto('/');
  const cells = page.locator('a[aria-label^="Day "]');
  await expect(cells).toHaveCount(30);
});

test('clicking a day cell navigates to day detail', async ({ page }) => {
  await page.goto('/');
  await page.locator('a[aria-label="Day 3"]').click();
  await expect(page).toHaveURL(/\/day\/3$/);
});

test('day 1 cell is highlighted as today', async ({ page }) => {
  await page.goto('/');
  const todayCell = page.locator('a.today');
  await expect(todayCell).toHaveCount(1);
  await expect(todayCell).toHaveAttribute('href', '/day/1');
});

test('mobile viewport: all 30 cells visible without horizontal scroll', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto('/');
  const cells = page.locator('a[aria-label^="Day "]');
  await expect(cells).toHaveCount(30);

  // Verify no horizontal overflow
  const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
  const clientWidth = await page.evaluate(() => document.body.clientWidth);
  expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for rounding
});
