const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const SESSION_PAGES = [
  'psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html',
  'psicanalise/sessoes/modulo-0-orientacao/s01-introducao.html',
  'psicanalise/sessoes/modulo-1-fundacoes/s02-pre-historia.html',
  'psicanalise/sessoes/modulo-1-fundacoes/s03-o-inconsciente.html',
];

const RESOURCE_PAGES = [
  'psicanalise/recursos/glossario.html',
  'psicanalise/recursos/autores.html',
  'psicanalise/recursos/linha-do-tempo.html',
  'psicanalise/recursos/mapa-conceitual.html',
  'psicanalise/recursos/referencias.html',
];

const ALL_PAGES = [...SESSION_PAGES, ...RESOURCE_PAGES, 'psicanalise/index.html', 'index.html'];

for (const pagePath of ALL_PAGES) {
  test(`WCAG AA: ${pagePath}`, async ({ page }) => {
    await page.goto(`file://${ROOT}/${pagePath}`);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}

for (const pagePath of SESSION_PAGES) {
  test(`skip-link present: ${pagePath}`, async ({ page }) => {
    await page.goto(`file://${ROOT}/${pagePath}`);
    const skipLink = page.locator('a.skip-link');
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute('href', '#main-content');
  });

  test(`main has id=main-content: ${pagePath}`, async ({ page }) => {
    await page.goto(`file://${ROOT}/${pagePath}`);
    await expect(page.locator('main#main-content')).toBeAttached();
  });

  test(`breadcrumb present: ${pagePath}`, async ({ page }) => {
    await page.goto(`file://${ROOT}/${pagePath}`);
    await expect(page.locator('nav.breadcrumb')).toBeAttached();
  });

  test(`quiz-options have role=radiogroup: ${pagePath}`, async ({ page }) => {
    await page.goto(`file://${ROOT}/${pagePath}`);
    const groups = page.locator('.quiz-options[role="radiogroup"]');
    const count = await groups.count();
    expect(count).toBeGreaterThan(0);
  });

  test(`heading hierarchy valid: ${pagePath}`, async ({ page }) => {
    await page.goto(`file://${ROOT}/${pagePath}`);
    const h1Count = await page.locator('h1').count();
    expect(h1Count).toBe(1);
    // h3 should not appear without preceding h2
    const h3s = await page.locator('h3').count();
    const h2s = await page.locator('h2').count();
    if (h3s > 0) expect(h2s).toBeGreaterThan(0);
  });
}
