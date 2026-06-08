const { test, expect } = require('@playwright/test');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const base = `file://${ROOT}`;

test('S00 next link goes to S01', async ({ page }) => {
  await page.goto(`${base}/psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html`);
  const next = page.locator('.session-nav a[rel="next"]');
  await expect(next).toBeAttached();
  const href = await next.getAttribute('href');
  expect(href).toContain('s01-introducao.html');
});

test('S01 prev link goes to S00', async ({ page }) => {
  await page.goto(`${base}/psicanalise/sessoes/modulo-0-orientacao/s01-introducao.html`);
  const prev = page.locator('.session-nav a[rel="prev"]');
  await expect(prev).toBeAttached();
  const href = await prev.getAttribute('href');
  expect(href).toContain('s00-boas-vindas.html');
});

test('S01 next link goes to S02', async ({ page }) => {
  await page.goto(`${base}/psicanalise/sessoes/modulo-0-orientacao/s01-introducao.html`);
  const next = page.locator('.session-nav a[rel="next"]');
  await expect(next).toBeAttached();
  const href = await next.getAttribute('href');
  expect(href).toContain('s02-pre-historia.html');
});

test('ArrowRight key navigates to next session', async ({ page }) => {
  await page.goto(`${base}/psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html`);
  await page.keyboard.press('ArrowRight');
  await expect(page).toHaveURL(/s01-introducao/);
});

test('ArrowLeft key navigates to prev session', async ({ page }) => {
  await page.goto(`${base}/psicanalise/sessoes/modulo-0-orientacao/s01-introducao.html`);
  await page.keyboard.press('ArrowLeft');
  await expect(page).toHaveURL(/s00-boas-vindas/);
});

test('breadcrumb dashboard link is correct', async ({ page }) => {
  await page.goto(`${base}/psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html`);
  const breadcrumbLink = page.locator('nav.breadcrumb a').first();
  await expect(breadcrumbLink).toBeAttached();
  const href = await breadcrumbLink.getAttribute('href');
  expect(href).toContain('index.html');
});

test('resources have back-to-dashboard link', async ({ page }) => {
  await page.goto(`${base}/psicanalise/recursos/glossario.html`);
  const backLink = page.locator('a[href*="index.html"]').first();
  await expect(backLink).toBeAttached();
});

test('skip link is focusable', async ({ page }) => {
  await page.goto(`${base}/psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html`);
  await page.keyboard.press('Tab');
  const focused = await page.evaluate(() => document.activeElement.className);
  expect(focused).toContain('skip-link');
});
