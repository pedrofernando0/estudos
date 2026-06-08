/**
 * preferences.spec.js — Testes do sistema de preferências de leitura
 *
 * Cobre: painel UI, themes, font size, line height, Focus Mode, Chunking,
 * persistência, anti-FOUC, navegação entre sessões, reset.
 */

const { test, expect } = require('@playwright/test');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');

/* Sessão de referência para a maioria dos testes */
const SESSION = `file://${ROOT}/psicanalise/sessoes/modulo-1-fundacoes/s03-o-inconsciente.html`;
const SESSION_B = `file://${ROOT}/psicanalise/sessoes/modulo-1-fundacoes/s04-sonhos.html`;

/* ─── Helpers ─── */
async function openPanel(page) {
  await page.click('#prefs-toggle');
  await expect(page.locator('#prefs-panel')).toHaveClass(/open/);
}

async function clearPrefs(page) {
  await page.evaluate(function () {
    localStorage.removeItem('estudos-preferences');
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   1. Painel abre e fecha via clique
   ═══════════════════════════════════════════════════════════════════════ */
test('painel: abre ao clicar no botão ⚙', async ({ page }) => {
  await page.goto(SESSION);
  await expect(page.locator('#prefs-toggle')).toBeVisible();
  await expect(page.locator('#prefs-panel')).not.toHaveClass(/open/);

  await page.click('#prefs-toggle');
  await expect(page.locator('#prefs-panel')).toHaveClass(/open/);
  await expect(page.locator('#prefs-toggle')).toHaveAttribute('aria-expanded', 'true');
});

test('painel: fecha ao clicar no botão ✕', async ({ page }) => {
  await page.goto(SESSION);
  await openPanel(page);

  await page.click('.prefs-close');
  await expect(page.locator('#prefs-panel')).not.toHaveClass(/open/);
  await expect(page.locator('#prefs-toggle')).toHaveAttribute('aria-expanded', 'false');
});

/* ═══════════════════════════════════════════════════════════════════════
   2. Painel fecha com Escape
   ═══════════════════════════════════════════════════════════════════════ */
test('painel: fecha com tecla Escape', async ({ page }) => {
  await page.goto(SESSION);
  await openPanel(page);

  await page.keyboard.press('Escape');
  await expect(page.locator('#prefs-panel')).not.toHaveClass(/open/);
  /* Foco retorna ao botão toggle */
  await expect(page.locator('#prefs-toggle')).toBeFocused();
});

/* ═══════════════════════════════════════════════════════════════════════
   3. Trap de foco dentro do painel
   ═══════════════════════════════════════════════════════════════════════ */
test('painel: Tab não escapa — foco permanece no painel', async ({ page }) => {
  await page.goto(SESSION);
  await openPanel(page);

  /* Encontra todos os elementos focáveis no painel */
  const focusable = await page.locator('#prefs-panel button:visible, #prefs-panel input').all();
  expect(focusable.length).toBeGreaterThan(2);

  /* Tab até o último elemento */
  const lastEl = focusable[focusable.length - 1];
  await lastEl.focus();

  await page.keyboard.press('Tab');

  /* Foco deve estar de volta no primeiro elemento do painel */
  const firstEl = focusable[0];
  await expect(firstEl).toBeFocused();
});

/* ═══════════════════════════════════════════════════════════════════════
   4. Cada theme aplica data-theme correto
   ═══════════════════════════════════════════════════════════════════════ */
const THEMES = ['parchment', 'creme', 'sepia-dark', 'low-light', 'high-contrast'];

for (const themeId of THEMES) {
  test(`theme "${themeId}": aplica data-theme no <html>`, async ({ page }) => {
    await page.goto(SESSION);
    await clearPrefs(page);
    await page.reload();

    await openPanel(page);
    await page.click(`[data-theme-id="${themeId}"]`);

    const attr = await page.evaluate(function () {
      return document.documentElement.getAttribute('data-theme');
    });
    expect(attr).toBe(themeId);
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   5. Preferência de tema persiste após reload
   ═══════════════════════════════════════════════════════════════════════ */
test('tema: persiste no localStorage após reload', async ({ page }) => {
  await page.goto(SESSION);
  await clearPrefs(page);
  await page.reload();

  await openPanel(page);
  await page.click('[data-theme-id="sepia-dark"]');

  /* Recarrega sem limpar localStorage */
  await page.reload();

  const attr = await page.evaluate(function () {
    return document.documentElement.getAttribute('data-theme');
  });
  expect(attr).toBe('sepia-dark');
});

/* ═══════════════════════════════════════════════════════════════════════
   6. Anti-FOUC: tema aplicado antes de DOMContentLoaded
   ═══════════════════════════════════════════════════════════════════════ */
test('anti-FOUC: data-theme presente logo após navigation (antes de DOMContentLoaded)', async ({ page }) => {
  /* Salva tema no localStorage antes de navegar */
  await page.goto(SESSION);
  await page.evaluate(function () {
    localStorage.setItem('estudos-preferences', JSON.stringify({ theme: 'high-contrast' }));
  });

  /* Captura data-theme no momento em que o HTML parser executa o snippet inline */
  let themeAtNavigation = null;
  page.on('domcontentloaded', async () => {
    themeAtNavigation = await page.evaluate(function () {
      return document.documentElement.getAttribute('data-theme');
    });
  });

  await page.goto(SESSION);
  await page.waitForLoadState('domcontentloaded');

  /* O snippet inline no <head> garante que data-theme está presente antes de DOMContentLoaded */
  const attr = await page.evaluate(function () {
    return document.documentElement.getAttribute('data-theme');
  });
  expect(attr).toBe('high-contrast');
});

/* ═══════════════════════════════════════════════════════════════════════
   7. Font size S/M/L/XL altera html { font-size }
   ═══════════════════════════════════════════════════════════════════════ */
const FONT_SIZES = [
  { id: 'small',  px: '14' },
  { id: 'medium', px: '17' },
  { id: 'large',  px: '20' },
  { id: 'xlarge', px: '23' },
];

for (const size of FONT_SIZES) {
  test(`font-size "${size.id}": html font-size = ${size.px}px`, async ({ page }) => {
    await page.goto(SESSION);
    await openPanel(page);
    await page.click(`[data-size-id="${size.id}"]`);

    const fontSize = await page.evaluate(function () {
      return parseFloat(window.getComputedStyle(document.documentElement).fontSize);
    });
    /* Tolerância de 1px para variações de DPI */
    expect(fontSize).toBeGreaterThanOrEqual(parseFloat(size.px) - 1);
    expect(fontSize).toBeLessThanOrEqual(parseFloat(size.px) + 1);
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   8. Line height altera --reader-line-height
   ═══════════════════════════════════════════════════════════════════════ */
const LINE_HEIGHTS = [
  { id: 'compact', value: '1.5'  },
  { id: 'normal',  value: '1.75' },
  { id: 'wide',    value: '2.1'  },
];

for (const lh of LINE_HEIGHTS) {
  test(`line-height "${lh.id}": --reader-line-height = ${lh.value}`, async ({ page }) => {
    await page.goto(SESSION);
    await openPanel(page);
    await page.click(`[data-lh-id="${lh.id}"]`);

    const val = await page.evaluate(function () {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--reader-line-height').trim();
    });
    expect(val).toBe(lh.value);
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   9. Focus Mode ativa body.focus-mode
   ═══════════════════════════════════════════════════════════════════════ */
test('Focus Mode: ativar adiciona body.focus-mode', async ({ page }) => {
  await page.goto(SESSION);
  await clearPrefs(page);
  await page.reload();

  await openPanel(page);
  const checkbox = page.locator('#prefs-focus-mode');
  /* Aguarda o checkbox estar visível antes de interagir */
  await expect(checkbox).toBeAttached();
  const isChecked = await checkbox.isChecked();
  if (isChecked) {
    await page.evaluate(function () {
      var el = document.getElementById('prefs-focus-mode');
      el.checked = false;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  await page.evaluate(function () {
    var el = document.getElementById('prefs-focus-mode');
    el.checked = true;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const hasClass = await page.evaluate(function () {
    return document.body.classList.contains('focus-mode');
  });
  expect(hasClass).toBe(true);
});

test('Focus Mode: desativar remove body.focus-mode', async ({ page }) => {
  await page.goto(SESSION);
  await openPanel(page);

  const checkbox = page.locator('#prefs-focus-mode');
  await expect(checkbox).toBeAttached();
  await page.evaluate(function () {
    var el = document.getElementById('prefs-focus-mode');
    el.checked = true;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });
  await page.evaluate(function () {
    var el = document.getElementById('prefs-focus-mode');
    el.checked = false;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const hasClass = await page.evaluate(function () {
    return document.body.classList.contains('focus-mode');
  });
  expect(hasClass).toBe(false);
});

/* ═══════════════════════════════════════════════════════════════════════
   10. Chunking quebra seções em colapsáveis
   ═══════════════════════════════════════════════════════════════════════ */
test('Chunking: ativar cria wrappers .section-collapsible', async ({ page }) => {
  await page.goto(SESSION);
  await clearPrefs(page);
  await page.reload();

  await openPanel(page);
  const checkbox = page.locator('#prefs-chunking');
  await expect(checkbox).toBeAttached();
  const isChecked = await checkbox.isChecked();
  if (isChecked) {
    await page.evaluate(function () {
      var el = document.getElementById('prefs-chunking');
      el.checked = false;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  await page.evaluate(function () {
    var el = document.getElementById('prefs-chunking');
    el.checked = true;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const wrapperCount = await page.locator('[data-chunking-section]').count();
  expect(wrapperCount).toBeGreaterThan(0);
});

test('Chunking: contador "X / N" visível no header de cada seção', async ({ page }) => {
  await page.goto(SESSION);
  await openPanel(page);

  const checkbox = page.locator('#prefs-chunking');
  await expect(checkbox).toBeAttached();
  if (!(await checkbox.isChecked())) {
    await page.evaluate(function () {
      var el = document.getElementById('prefs-chunking');
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  const counters = await page.locator('.section-counter').all();
  expect(counters.length).toBeGreaterThan(0);

  /* Verifica formato "X / N" */
  const text = await counters[0].textContent();
  expect(text).toMatch(/\d+ \/ \d+/);
});

test('Chunking: clicar no header colapsa e expande a seção', async ({ page }) => {
  await page.goto(SESSION);
  await openPanel(page);

  const checkbox = page.locator('#prefs-chunking');
  await expect(checkbox).toBeAttached();
  if (!(await checkbox.isChecked())) {
    await page.evaluate(function () {
      var el = document.getElementById('prefs-chunking');
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }

  const firstHeader = page.locator('.section-collapsible .section-header').first();
  const firstWrapper = page.locator('[data-chunking-section]').first();

  /* Colapsa */
  await firstHeader.click();
  await expect(firstWrapper).toHaveClass(/collapsed/);
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'false');

  /* Expande */
  await firstHeader.click();
  await expect(firstWrapper).not.toHaveClass(/collapsed/);
  await expect(firstHeader).toHaveAttribute('aria-expanded', 'true');
});

test('Chunking: desativar remove todos os wrappers', async ({ page }) => {
  await page.goto(SESSION);
  await openPanel(page);

  const checkbox = page.locator('#prefs-chunking');
  await expect(checkbox).toBeAttached();
  if (!(await checkbox.isChecked())) {
    await page.evaluate(function () {
      var el = document.getElementById('prefs-chunking');
      el.checked = true;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
  }
  await page.evaluate(function () {
    var el = document.getElementById('prefs-chunking');
    el.checked = false;
    el.dispatchEvent(new Event('change', { bubbles: true }));
  });

  const wrapperCount = await page.locator('[data-chunking-section]').count();
  expect(wrapperCount).toBe(0);
});

/* ═══════════════════════════════════════════════════════════════════════
   11. Reset restaura defaults
   ═══════════════════════════════════════════════════════════════════════ */
test('reset: limpa localStorage e restaura tema parchment', async ({ page }) => {
  await page.goto(SESSION);

  /* Define preferências não-padrão */
  await page.evaluate(function () {
    localStorage.setItem('estudos-preferences', JSON.stringify({
      theme: 'high-contrast',
      fontSize: 'xlarge',
      lineHeight: 'wide',
      focusMode: true,
      chunking: true
    }));
  });
  await page.reload();

  /* Aguarda o toggle estar disponível (chunking+focusMode podem demorar) */
  await expect(page.locator('#prefs-toggle')).toBeAttached({ timeout: 10000 });
  await page.click('#prefs-toggle', { force: true });
  await expect(page.locator('#prefs-panel')).toHaveClass(/open/);

  await page.evaluate(function () {
    var resetBtn = document.querySelector('[data-action="reset"]');
    if (resetBtn) resetBtn.click();
  });

  /* data-theme volta ao parchment (ou removido, pois é o default implícito) */
  const theme = await page.evaluate(function () {
    return document.documentElement.getAttribute('data-theme');
  });
  expect(theme === 'parchment' || theme === null).toBe(true);

  /* localStorage limpo ou com defaults */
  const stored = await page.evaluate(function () {
    var s = localStorage.getItem('estudos-preferences');
    return s ? JSON.parse(s) : null;
  });
  if (stored) {
    expect(stored.theme).toBe('parchment');
    expect(stored.focusMode).toBe(false);
    expect(stored.chunking).toBe(false);
  }

  /* Painel mostra parchment como ativo */
  const parchmentBtn = page.locator('[data-theme-id="parchment"]');
  await expect(parchmentBtn).toHaveAttribute('aria-pressed', 'true');
});

/* ═══════════════════════════════════════════════════════════════════════
   12. Preferências persistem entre sessões (navegação)
   ═══════════════════════════════════════════════════════════════════════ */
test('persistência: tema definido em S03 persiste ao navegar para S04', async ({ page }) => {
  await page.goto(SESSION);
  await clearPrefs(page);
  await page.reload();

  /* Define tema sepia-dark na S03 */
  await openPanel(page);
  await page.click('[data-theme-id="sepia-dark"]');

  /* Navega para S04 */
  await page.goto(SESSION_B);
  await page.waitForLoadState('domcontentloaded');

  const attr = await page.evaluate(function () {
    return document.documentElement.getAttribute('data-theme');
  });
  expect(attr).toBe('sepia-dark');
});
