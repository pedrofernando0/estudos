# Estudos — Biblioteca Pessoal de Aprendizado

Hub multi-assunto em HTML/CSS interativo. Cada assunto é uma subpasta com seu próprio dashboard, sessões e recursos.

## Assuntos Ativos

| Assunto | Pasta | Sessões | Status |
|---------|-------|---------|--------|
| 🧠 Psicanálise & Viver Bem | `psicanalise/` | 36 sessões (6 módulos) | Em progresso — 3/36 criadas |

## Estrutura

```
~/Estudos/
├── index.html              # Portal hub — seletor de assuntos
├── templates/              # CSS e HTML templates (compartilhados entre assuntos)
│   ├── style.css           # Design system (cores, tipografia, componentes)
│   ├── sessao-template.html# Template base para sessões HTML (com fixes de a11y)
│   └── sessao.js           # Script compartilhado (quiz, tooltips, navegação)
├── scripts/                # Scripts utilitários (TTS, etc.)
├── qa/                     # Suite de testes Playwright + axe-core
│   ├── package.json
│   ├── playwright.config.js
│   ├── tests/              # accessibility, navigation, quiz, dark-mode, responsive
│   └── fixtures/           # mock-tracking.js
└── psicanalise/            # Assunto: Psicanálise & Viver Bem
    ├── index.html          # Dashboard do assunto
    ├── .claude/CLAUDE.md   # Instruções para agentes
    ├── .claude/qa-checklist.md   # Checklist Wave D
    ├── .claude/session-scaffold.md # Brief de todas as sessões S03–S35
    ├── sessoes/            # Sessões HTML
    ├── recursos/           # Glossário, timeline, mapa, autores, refs
    └── progresso/          # tracking.json + tracking.js
```

## Skills Disponíveis

Use via `Skill` tool no Claude Code:

| Skill | Escopo | Quando usar |
|-------|--------|------------|
| `estudo-psicanalise` | Psicanálise | Orquestrador: geração de sessões com ciclo 5-Wave |
| `sessao-html` | Global | Geração de HTML interativo com o design system |
| `curadoria-psicanalise` | Psicanálise | Pesquisa acadêmica com fontes verificadas |

## Templates Compartilhados

`templates/style.css` e `templates/sessao-template.html` são usados por todos os assuntos. O design system define: paleta de cores (cream+charcoal+deep-blue), tipografia (Cormorant Garamond+Newsreader+Manrope), componentes (quiz, tooltips, timeline-mini, callouts, viver-bem), dark mode automático, responsividade (3 breakpoints), WCAG AA.

### Componentes: Uso Esperado por Sessão

| Componente | Classe CSS | Obrigatório | Notas |
|-----------|-----------|-------------|-------|
| Skip link | `.skip-link` + `#main-content` | ✅ Sim | Primeiro elemento do body |
| Breadcrumb | `.breadcrumb` | ✅ Sim | Início do `<main>` |
| Reading bar | `.reading-progress` | ✅ Sim | aria-hidden=true |
| Session header | `.session-header` + `.session-meta` | ✅ Sim | |
| Pré-leitura | `.pre-leitura` | ✅ Sim | |
| Timeline mini | `.timeline-mini` | ✅ Sim | aria-hidden=true |
| Viver Bem? | `.viver-bem` | ✅ Sim | |
| Quiz | `.quiz` + `.quiz-options[role="radiogroup"]` | ✅ Sim | Ver convenções ARIA |
| Reflexão | `.reflexao` | ✅ Sim | |
| Para ir além | `.para-ir-alem` | ✅ Sim | Incluir links para recursos |
| Callout | `.callout` | ✅ Recomendado | Para citações destacadas |
| Tooltip | `.conceito[aria-label]` | Quando relevante | Ver convenção ARIA |

## Convenções ARIA (Crítico — não alterar)

### Tooltips
```html
<!-- CORRETO: aria-label com texto completo da definição -->
<span class="conceito" aria-label="TERMO: DEFINIÇÃO COMPLETA.">TERMO
  <span class="tooltip-content" role="tooltip">DEFINIÇÃO COMPLETA.</span>
</span>
```
**Nunca usar `aria-describedby` apontando para filho — AT não lê `display:none`.**

### Quiz
```html
<!-- CORRETO: role=radiogroup no container -->
<div class="quiz-options" role="radiogroup" aria-label="Opções de resposta">
  <div class="quiz-option" data-opt="0" tabindex="0" role="radio" aria-checked="false">...</div>
</div>
```
`aria-checked` é atualizado automaticamente pelo `sessao.js` ao clicar.

## QA — Como Rodar

```bash
cd qa
npm install
npm test           # Todos os testes, 3 browsers
npm run test:ci    # Apenas Chromium (mais rápido, para Wave D)
npm run test:a11y  # Apenas acessibilidade
```

**Integração com produção:** Após gerar cada nova sessão (Wave C), rodar `npm run test:ci` antes de publicar (Wave E). Um teste de acessibilidade falhando bloqueia a publicação.

## Convenções

- Idioma: PT-BR
- Citações: APA 7th + Standard Edition para Freud
- Design: usar `var(--color-*)` e `var(--font-*)` — nunca hardcodar cores ou fontes
- Acessibilidade: WCAG AA — contraste ≥4.5:1, roles ARIA, keyboard nav
- Sessões: `sessoes/modulo-X/sXX-slug-em-portugues.html`
