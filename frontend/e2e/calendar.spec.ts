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

test('calendar renders 7 weekday header labels', async ({ page }) => {
  await page.goto('/');
  const headers = page.locator('.weekday-label');
  await expect(headers).toHaveCount(7);
  await expect(headers.first()).toHaveText('Lun');
  await expect(headers.last()).toHaveText('Dom');
});

test('calendar shows at least one month label', async ({ page }) => {
  await page.goto('/');
  const monthLabels = page.locator('.month-label');
  await expect(monthLabels).not.toHaveCount(0);
});

test('filler cells (before plan start) are not clickable links', async ({ page }) => {
  await page.goto('/');
  // Inactive cells are .day-cell.inactive divs, not anchors
  const inactiveCells = page.locator('.day-cell.inactive');
  // When start is Monday there are 0 filler cells; when mid-week there are some.
  // Regardless, none of them should be links
  const count = await inactiveCells.count();
  for (let i = 0; i < count; i++) {
    await expect(inactiveCells.nth(i)).not.toHaveAttribute('href');
  }
});

test('calendar title is visible and non-empty', async ({ page }) => {
  await page.goto('/');
  const title = page.locator('.calendar-title');
  await expect(title).toBeVisible();
  const text = await title.textContent();
  expect(text?.trim().length).toBeGreaterThan(0);
});
