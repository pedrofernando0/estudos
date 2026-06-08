const { test, expect } = require('@playwright/test');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

const SESSION_PAGES = [
  'psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html',
  'psicanalise/sessoes/modulo-0-orientacao/s01-introducao.html',
  'psicanalise/sessoes/modulo-1-fundacoes/s02-pre-historia.html',
];

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

function relativeLuminance([r, g, b]) {
  const linearize = c => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}

function contrastRatio(l1, l2) {
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

for (const pagePath of SESSION_PAGES) {
  test(`dark mode renders: ${pagePath}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`file://${ROOT}/${pagePath}`);
    // Body background should be dark (not the light cream color)
    const bgColor = await page.evaluate(() =>
      window.getComputedStyle(document.body).backgroundColor
    );
    // Should not be the light background rgb(251,248,240)
    expect(bgColor).not.toBe('rgb(251, 248, 240)');
  });

  test(`dark mode: body text contrast >= 4.5:1: ${pagePath}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`file://${ROOT}/${pagePath}`);
    const { bg, text } = await page.evaluate(() => {
      const body = document.body;
      const p = document.querySelector('main p') || body;
      return {
        bg: window.getComputedStyle(body).backgroundColor,
        text: window.getComputedStyle(p).color,
      };
    });
    const parseRgb = str => str.match(/\d+/g).map(Number);
    const bgL = relativeLuminance(parseRgb(bg));
    const textL = relativeLuminance(parseRgb(text));
    const ratio = contrastRatio(bgL, textL);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test(`dark mode quiz feedback contrast >= 4.5:1: ${pagePath}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`file://${ROOT}/${pagePath}`);
    // Trigger a correct answer to show feedback
    const question = page.locator('.quiz-question').first();
    const correctIdx = await question.getAttribute('data-correct');
    await question.locator(`.quiz-option[data-opt="${correctIdx}"]`).click();
    const feedback = question.locator('.quiz-feedback');
    await expect(feedback).toHaveClass(/show/);
    const { bg, text } = await feedback.evaluate(el => ({
      bg: window.getComputedStyle(el).backgroundColor,
      text: window.getComputedStyle(el).color,
    }));
    const parseRgb = str => str.match(/\d+/g).map(Number);
    const bgL = relativeLuminance(parseRgb(bg));
    const textL = relativeLuminance(parseRgb(text));
    const ratio = contrastRatio(bgL, textL);
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  test(`dark mode screenshot: ${pagePath}`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'dark' });
    await page.goto(`file://${ROOT}/${pagePath}`);
    const slug = pagePath.replace(/\//g, '_').replace('.html', '');
    await page.screenshot({
      path: `playwright-report/dark-${slug}.png`,
      fullPage: false,
    });
  });
}
