const { test, expect } = require('@playwright/test');
const { MOCK_TRACKING_SCRIPT } = require('../fixtures/mock-tracking');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const S00 = `file://${ROOT}/psicanalise/sessoes/modulo-0-orientacao/s00-boas-vindas.html`;

test.beforeEach(async ({ page }) => {
  await page.addInitScript(MOCK_TRACKING_SCRIPT);
});

test('clicking correct option adds .correct class', async ({ page }) => {
  await page.goto(S00);
  const question = page.locator('.quiz-question').first();
  const correctIdx = await question.getAttribute('data-correct');
  const option = question.locator(`.quiz-option[data-opt="${correctIdx}"]`);
  await option.click();
  await expect(option).toHaveClass(/correct/);
});

test('clicking incorrect option adds .incorrect class', async ({ page }) => {
  await page.goto(S00);
  const question = page.locator('.quiz-question').first();
  const correctIdx = await question.getAttribute('data-correct');
  const wrongIdx = correctIdx === '0' ? '1' : '0';
  const wrongOption = question.locator(`.quiz-option[data-opt="${wrongIdx}"]`);
  await wrongOption.click();
  await expect(wrongOption).toHaveClass(/incorrect/);
});

test('feedback div shows after answering', async ({ page }) => {
  await page.goto(S00);
  const question = page.locator('.quiz-question').first();
  const option = question.locator('.quiz-option').first();
  await option.click();
  const feedback = question.locator('.quiz-feedback');
  await expect(feedback).toHaveClass(/show/);
  await expect(feedback).not.toBeEmpty();
});

test('aria-checked updates after option click', async ({ page }) => {
  await page.goto(S00);
  const question = page.locator('.quiz-question').first();
  const option = question.locator('.quiz-option').first();
  await option.click();
  const ariaChecked = await option.getAttribute('aria-checked');
  expect(ariaChecked).toBe('true');
});

test('other options get aria-checked=false after selection', async ({ page }) => {
  await page.goto(S00);
  const question = page.locator('.quiz-question').first();
  await question.locator('.quiz-option').first().click();
  const others = question.locator('.quiz-option:not(:first-child)');
  const count = await others.count();
  for (let i = 0; i < count; i++) {
    const val = await others.nth(i).getAttribute('aria-checked');
    expect(val).toBe('false');
  }
});

test('options are disabled after answering (pointerEvents none)', async ({ page }) => {
  await page.goto(S00);
  const question = page.locator('.quiz-question').first();
  await question.locator('.quiz-option').first().click();
  const style = await question.locator('.quiz-option').first().evaluate(el => el.style.pointerEvents);
  expect(style).toBe('none');
});

test('Enter key triggers quiz selection', async ({ page }) => {
  await page.goto(S00);
  const question = page.locator('.quiz-question').first();
  const option = question.locator('.quiz-option').first();
  await option.focus();
  await page.keyboard.press('Enter');
  await expect(question.locator('.quiz-feedback')).toHaveClass(/show/);
});

test('empty reflection does not trigger save', async ({ page }) => {
  await page.goto(S00);
  await page.click('.reflexao button');
  const saved = await page.evaluate(() => window.__reflectionSaved);
  expect(saved).toBeUndefined();
});

test('filled reflection triggers EstudosTracking.saveReflection', async ({ page }) => {
  await page.goto(S00);
  await page.fill('.reflexao textarea', 'Minha reflexão de teste.');
  await page.click('.reflexao button');
  const saved = await page.evaluate(() => window.__reflectionSaved);
  expect(saved).toBeDefined();
  expect(saved.id).toBe('S00');
  expect(saved.text).toContain('Minha reflexão de teste.');
});
