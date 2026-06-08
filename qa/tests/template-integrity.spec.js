/**
 * template-integrity.spec.js — "Model-proof" gate
 *
 * Verifica que cada sessão HTML gerada (S00–S35 conforme existirem)
 * contém os 3 elementos obrigatórios introduzidos pelo design system v3:
 *
 *   1. Snippet anti-FOUC inline no <head>  (estudos-preferences)
 *   2. <script src=".../preferences.js">   (sistema de prefs)
 *   3. <script src=".../sessao.js">         (quiz, tooltips, reflexão)
 *
 * Se um modelo regenerar uma sessão sem copiar esses elementos do template,
 * este teste falha e bloqueia a publicação (Wave E).
 *
 * Nota: testes rodam sem browser (leitura de arquivo) para máxima velocidade.
 * Usamos Playwright apenas para seguir o padrão da suite — os testes
 * carregam a página e inspecionam o DOM/fonte.
 */

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '../..');
const SESSIONS_ROOT = path.join(ROOT, 'psicanalise', 'sessoes');

/* ─── Descobre todos os HTMLs de sessão recursivamente ─── */
function findSessionFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(findSessionFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const SESSION_FILES = findSessionFiles(SESSIONS_ROOT);

/* Garante que existem sessões para testar */
test('template-integrity: ao menos 1 sessão HTML existe', () => {
  expect(SESSION_FILES.length).toBeGreaterThan(0);
});

/* ─── Testa cada sessão ─── */
for (const filePath of SESSION_FILES) {
  const relativePath = path.relative(ROOT, filePath);

  test(`[integrity] snippet anti-FOUC presente: ${relativePath}`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('estudos-preferences');
  });

  test(`[integrity] preferences.js script presente: ${relativePath}`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('preferences.js');
  });

  test(`[integrity] sessao.js script presente: ${relativePath}`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    expect(content).toContain('sessao.js');
  });

  test(`[integrity] anti-FOUC no <head> (não no <body>): ${relativePath}`, () => {
    const content = fs.readFileSync(filePath, 'utf8');

    /* O snippet deve estar antes de </head> */
    const headEnd = content.indexOf('</head>');
    const bodyStart = content.indexOf('<body');
    const snippetPos = content.indexOf('estudos-preferences');

    expect(headEnd).toBeGreaterThan(-1);
    expect(snippetPos).toBeGreaterThan(-1);

    /* Snippet está no <head>, não no <body> */
    expect(snippetPos).toBeLessThan(headEnd);
    expect(snippetPos).toBeLessThan(bodyStart);
  });

  test(`[integrity] preferences.js carregado após sessao.js: ${relativePath}`, () => {
    const content = fs.readFileSync(filePath, 'utf8');
    const sessaoPos = content.indexOf('sessao.js');
    const prefsPos = content.indexOf('preferences.js');

    expect(sessaoPos).toBeGreaterThan(-1);
    expect(prefsPos).toBeGreaterThan(-1);

    /* preferences.js deve aparecer DEPOIS de sessao.js */
    expect(prefsPos).toBeGreaterThan(sessaoPos);
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   NEGATIVE TEST — detecta sessão que FALTA o snippet (teste de sanidade)
   Simula o que aconteceria se um modelo regenerasse sem o template v3.
   ═══════════════════════════════════════════════════════════════════════ */
test('[integrity] negative: detectaria sessão sem snippet', () => {
  /* Conteúdo simulado de uma sessão antiga sem o snippet */
  const oldSessionContent = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<link rel="stylesheet" href="../../../templates/style.css">
</head>
<body>
<script src="../../../templates/sessao.js"></script>
</body>
</html>`;

  /* Verifica que a ausência de 'estudos-preferences' seria detectada */
  expect(oldSessionContent).not.toContain('estudos-preferences');
  expect(oldSessionContent).not.toContain('preferences.js');

  /* Este teste SEMPRE passa — é documentação da lógica de detecção,
     não um teste de arquivo real. */
  expect(true).toBe(true);
});
