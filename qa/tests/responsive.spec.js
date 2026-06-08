const { test, expect } = require('@playwright/test');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 900 },
];

const SESSION_PAGES = [
  'psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html',
  'psicanalise/sessoes/modulo-0-orientacao/s01-introducao.html',
  'psicanalise/sessoes/modulo-1-fundacoes/s02-pre-historia.html',
  'psicanalise/sessoes/modulo-1-fundacoes/s03-o-inconsciente.html',
];

const RESOURCE_PAGES = [
  'psicanalise/recursos/glossario.html',
  'psicanalise/recursos/linha-do-tempo.html',
  'psicanalise/recursos/mapa-conceitual.html',
];

for (const vp of VIEWPORTS) {
  for (const pagePath of SESSION_PAGES) {
    test(`[${vp.name}] no horizontal overflow: ${pagePath}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`file://${ROOT}/${pagePath}`);
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(vp.width + 2); // 2px tolerance
    });

    test(`[${vp.name}] quiz options visible and tappable: ${pagePath}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`file://${ROOT}/${pagePath}`);
      const options = page.locator('.quiz-option');
      const count = await options.count();
      expect(count).toBeGreaterThan(0);
      for (let i = 0; i < count; i++) {
        const box = await options.nth(i).boundingBox();
        expect(box).not.toBeNull();
        expect(box.height).toBeGreaterThanOrEqual(44); // WCAG 2.5.5 touch target
      }
    });
  }

  for (const pagePath of RESOURCE_PAGES) {
    test(`[${vp.name}] resource renders without JS error: ${pagePath}`, async ({ page }) => {
      const errors = [];
      page.on('pageerror', err => errors.push(err.message));
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`file://${ROOT}/${pagePath}`);
      // Allow page to settle
      await page.waitForTimeout(500);
      expect(errors).toHaveLength(0);
    });
  }
}

test('[mobile] tooltip does not overflow viewport when triggered near top', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`file://${ROOT}/psicanalise/sessoes/modulo-0-orientacao/s01-introducao.html`);
  const firstConceito = page.locator('.conceito').first();
  await firstConceito.hover();
  const tooltip = firstConceito.locator('.tooltip-content');
  // Check if tooltip is visible (might be above or below, but should be in viewport)
  const tooltipBox = await tooltip.boundingBox();
  if (tooltipBox) {
    expect(tooltipBox.y).toBeGreaterThanOrEqual(0);
    expect(tooltipBox.y + tooltipBox.height).toBeLessThanOrEqual(812);
  }
});

test('[mobile] glossary search input is accessible', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`file://${ROOT}/psicanalise/recursos/glossario.html`);
  const searchInput = page.locator('input[type="search"], input[type="text"]').first();
  if (await searchInput.count() > 0) {
    await expect(searchInput).toBeVisible();
    const box = await searchInput.boundingBox();
    expect(box.height).toBeGreaterThanOrEqual(32);
  }
});
