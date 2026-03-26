import { test, expect } from '@playwright/test';

test('home page renders BabyMeal Planner heading', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/BabyMeal Planner/);
  await expect(page.getByRole('heading', { name: 'BabyMeal Planner' })).toBeVisible();
});
