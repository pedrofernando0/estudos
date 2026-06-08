# QA Checklist — Wave D

Execute antes de publicar qualquer sessão nova. Marque cada item antes de avançar para Wave E.

## Automatizado (obrigatório)

```bash
cd ../qa && npm run test:ci
```

Testes que devem passar (verde):
- [ ] `accessibility.spec.js` — WCAG AA, skip link, breadcrumb, radiogroup, heading hierarchy
- [ ] `navigation.spec.js` — links prev/next, ArrowKey nav, skip link focusável
- [ ] `quiz.spec.js` — classes correct/incorrect, aria-checked atualizado, feedback visível, reflexão salva

## Manual — Nova Sessão

### Estrutura HTML
- [ ] `<a class="skip-link" href="#main-content">` é o primeiro elemento do body
- [ ] `<main id="main-content">` existe
- [ ] `<nav class="breadcrumb">` está no início do main, com o módulo correto
- [ ] `<div class="timeline-mini" aria-hidden="true">` tem data correta da sessão
- [ ] `.para-ir-alem` inclui pelo menos um link para recursos internos (glossário, autores, timeline)

### ARIA
- [ ] Todos os `.conceito` usam `aria-label="TERMO: definição"` (não `aria-describedby`)
- [ ] Todos os `.quiz-options` têm `role="radiogroup" aria-label="Opções de resposta"`
- [ ] Todos os `.quiz-option` têm `role="radio" aria-checked="false"` (sessao.js atualiza dinamicamente)

### Conteúdo
- [ ] SESSION_ID está correto (ex: `'S03'`)
- [ ] SESSION_CORRECT_MESSAGES tem o mesmo número de itens que as questões do quiz
- [ ] Citações seguem APA 7th + Standard Edition para Freud
- [ ] Viver Bem? conecta o conteúdo à vida contemporânea
- [ ] Links prev/next apontam para os arquivos corretos
- [ ] Se for a última sessão do módulo, o link next pode ser `<span></span>` temporariamente

### Design
- [ ] Nenhuma cor ou fonte hardcoded (usar var(--color-*) e var(--font-*))
- [ ] Badges do header corretos: módulo, nível Bloom, duração
- [ ] Título e número de sessão corretos

### Dark Mode (manual)
- [ ] Abrir no DevTools → Rendering → prefers-color-scheme: dark
- [ ] Texto legível, sem áreas de baixo contraste aparente
- [ ] Quiz correto/incorreto visível

### Mobile (manual ou `npm run test:responsive`)
- [ ] Viewport 375px: sem scroll horizontal
- [ ] Touch targets dos quiz-options ≥ 44px de altura

## Automatizado — Recursos (quando editados)

```bash
cd ../qa && npx playwright test tests/responsive.spec.js --project=chromium
```

- [ ] Glossário: busca e nav alfabética funcionam em 375px
- [ ] Timeline: scroll horizontal funciona sem layout quebrado
- [ ] Mapa conceitual: árvore não transborda em mobile
