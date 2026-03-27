import { test, expect } from '@playwright/test';

test('day detail page shows Pranzo and Cena cards', async ({ page }) => {
  await page.goto('/day/1');
  await expect(page.getByText('Pranzo')).toBeVisible();
  await expect(page.getByText('Cena')).toBeVisible();
});

test('day detail page shows ingredient quantities', async ({ page }) => {
  await page.goto('/day/1');
  // olive oil and broth are fixed on every meal
  await expect(page.getByText('5g').first()).toBeVisible();
  await expect(page.getByText('150ml').first()).toBeVisible();
});

test('back link returns to calendar', async ({ page }) => {
  await page.goto('/day/1');
  await page.getByRole('link', { name: '← Calendario' }).click();
  await expect(page).toHaveURL('/');
});

test('invalid day shows error page', async ({ page }) => {
  await page.goto('/day/99');
  await expect(page.getByText('Something went wrong')).toBeVisible();
});

test('page title includes day number', async ({ page }) => {
  await page.goto('/day/5');
  await expect(page).toHaveTitle(/Giorno 5/);
});
