# Estudos de Psicanálise & Viver Bem na Contemporaneidade

Ambiente de aprendizado autodirigido em HTML/CSS interativo. 36 sessões em 6 módulos: da fundação freudiana à psicanálise contemporânea, integradas com reflexões sobre como viver bem no caos informacional.

## Estado Atual (atualizar a cada sessão criada)

| Módulo | Título | Sessões | Status |
|--------|--------|---------|--------|
| 0 | Orientação | S00–S01 | ✅ Completo (2/2) |
| 1 | Fundações: O Inconsciente Freudiano | S02–S09 | ⏳ Iniciado (2/8) |
| 2 | Dissidências e Expansões | S10–S15 | ❌ Não iniciado |
| 3 | Escola Inglesa e Relações Objetais | S16–S20 | ❌ Não iniciado |
| 4 | Lacan e o Estruturalismo | S21–S26 | ❌ Não iniciado |
| 5 | Contemporaneidade | S27–S32 | ❌ Não iniciado |
| 6 | Síntese e Encerramento | S33–S35 | ❌ Não iniciado |

**Próxima sessão a criar:** S05 (Módulo 1 · Fundações)  
**Brief completo:** `.claude/session-scaffold.md`  
**Fonte canônica de nomenclatura:** `session-scaffold.md` — `tracking.js` e `skills/estudo-psicanalise/references/curriculo.md` foram alinhados a ele em 2026-06-07.

## Skills Disponíveis

Este projeto tem 6 skills (3 custom + 3 de referência). Use a tool `Skill` para invocá-las pelo nome exato:

| Skill | Quando usar |
|-------|------------|
| `estudo-psicanalise` | Gerar, criar ou continuar sessões de estudo. Orquestrador principal. |
| `sessao-html` | Criar ou editar páginas HTML de sessão usando o design system. |
| `curadoria-psicanalise` | Pesquisar autores, conceitos, obras psicanalíticas com rigor acadêmico. |
| `framework-education` | Auditoria pedagógica: Bloom, UbD, spiral curriculum, assessment. |
| `adversarial` | QA metodológica: gap analysis, contradições, failure modes. |
| `framework-engineering` | Infraestrutura do repo: DRY, SOLID, tooling, CI/CD. |

**Fluxo principal**: `estudo-psicanalise` → delega pesquisa para `curadoria-psicanalise` → delega HTML para `sessao-html`.

> Para orientações detalhadas de uso das skills de referência no contexto Estudos, ver `.claude/CLAUDE.md` na raiz.

## Ciclo de Produção (5 Waves)

Toda sessão segue: **Wave A** (Pesquisa Exaustiva) → **Wave B** (Estruturação Pedagógica) → **Wave C** (Geração HTML) → **Wave D** (QA & Verificação) → **Wave E** (Publicação). Nenhuma Wave pode ser pulada.

### Wave D — QA Obrigatório

Antes de publicar qualquer sessão nova, executar no terminal:

```bash
cd ../qa
npm run test:ci
```

Se algum teste falhar, corrigir antes de publicar. Ver checklist completo em `.claude/qa-checklist.md`.

## Padrões Obrigatórios em Novas Sessões

### Estrutura HTML (em ordem)
1. `<a class="skip-link" href="#main-content">` — PRIMEIRO elemento do body
2. `<div class="reading-progress">` — após skip link
3. `<header class="session-header">` — badges + h1
4. `<main id="main-content">` — id obrigatório
5. `<nav class="breadcrumb">` — PRIMEIRO elemento dentro de main
6. `.pre-leitura` → `.corpo` → `.timeline-mini` → `.viver-bem` → `.quiz` → `.reflexao` → `.para-ir-alem`
7. `<footer class="session-nav">` — fora do main

### Breadcrumb (copiar e adaptar)
```html
<nav class="breadcrumb" aria-label="Localização no curso">
  <a href="../../index.html">Psicanálise</a>
  <span aria-hidden="true"> › </span>
  <span>Módulo X · Nome do Módulo</span>
</nav>
```

### Tooltip ACESSÍVEL (aria-label, nunca aria-describedby)
```html
<span class="conceito" aria-label="TERMO: definição completa aqui.">TERMO
  <span class="tooltip-content" role="tooltip">definição completa aqui.</span>
</span>
```

### Quiz (radiogroup obrigatório)
```html
<div class="quiz-options" role="radiogroup" aria-label="Opções de resposta">
  <div class="quiz-option" data-opt="0" tabindex="0" role="radio" aria-checked="false">A) ...</div>
</div>
```

### Timeline mini (aria-hidden)
```html
<div class="timeline-mini" aria-hidden="true">
  ...
</div>
```

### Para ir além (links para recursos)
Incluir sempre um item de recurso interno:
```html
<li>
  <span class="ref-type">Recurso</span>
  Consulte o <a href="../../recursos/glossario.html">Glossário</a> e os 
  <a href="../../recursos/autores.html">perfis de autores</a> desta sessão.
</li>
```

## Diretórios-Chave

| Caminho | Conteúdo |
|---------|----------|
| `../templates/sessao-template.html` | Template base com todos os fixes de a11y |
| `../templates/style.css` | Design system (CSS custom properties) |
| `../templates/sessao.js` | Script compartilhado (quiz, tooltips, nav) |
| `sessoes/modulo-X/` | Sessões HTML |
| `recursos/` | Glossário, timeline, mapa, autores, referências |
| `progresso/tracking.js` | API de progresso (localStorage) |
| `../qa/` | Suite de testes Playwright |
| `.claude/session-scaffold.md` | Brief pedagógico S03–S35 |
| `.claude/qa-checklist.md` | Checklist Wave D |

## Convenções

- Idioma: **Português (Brasil)** em todo conteúdo textual
- Sessões: `sessoes/modulo-X/sXX-slug-em-portugues.html` (XX = 00–35)
- Citações: APA 7th + Standard Edition para Freud
- Design: usar classes e variáveis do `../templates/style.css` — nunca hardcodar cores ou fontes
- Acessibilidade: WCAG AA (ver padrões acima)
