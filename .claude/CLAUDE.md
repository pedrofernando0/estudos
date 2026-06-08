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
| `framework-education` | Global | Auditoria pedagógica (Bloom, UbD, assessment) |
| `adversarial` | Global | QA metodológica: gap analysis, contradições, failure modes |
| `framework-engineering` | Global | Excelência de engenharia: DRY, SOLID, tooling |

**Skills são symlinks em `skills/` → `~/.agents/skills/`.**

### Skills de Referência — Uso no Contexto Estudos

As 3 skills abaixo são catálogos genéricos compartilhados com outros projetos. Esta seção documenta como usá-las especificamente no contexto Estudos.

#### `framework-education` — Auditoria Pedagógica

**Triggers no Estudos:**
- Auditar qualidade pedagógica de uma sessão antes de publicar (Wave D complementar)
- Verificar progressão de níveis Bloom ao longo de um módulo
- Avaliar se o scaffolding (ZPD) está calibrado para o estágio do currículo
- Validar alinhamento entre objetivos de aprendizagem, conteúdo e assessment (UbD)

**Exemplo de prompt:**
> "Usando framework-education, audite a sessão S03 — O Inconsciente: Estrutura e Provas. Verifique: (1) nível Bloom declarado vs real, (2) scaffolding adequado para Módulo 1, (3) alinhamento objectives→evidence→activities (UbD), (4) qualidade do formative assessment (quiz)."

**Limitações:** Framework-education é um catálogo de ~3000 linhas cobrindo todas as teorias pedagógicas. No contexto Estudos, focar apenas em Bloom revisada, UbD, spiral curriculum (Bruner) e ZPD (Vygotsky). Ignorar seções sobre edtech, educação infantil, ou psicometria avançada (IRT, Rasch) — não se aplicam.

#### `adversarial` — QA Metodológica

**Triggers no Estudos:**
- Revisar um plano de sessão antes da Wave C (gap analysis)
- Detectar contradições entre conteúdo da sessão e fontes da Wave A
- Fazer pre-mortem: "O que faria esta sessão falhar para um estudante real?"
- Auditar precisão conceitual: checar definições de termos psicanalíticos contra fontes canônicas
- Stress-test de afirmações históricas (ex: "Freud foi o primeiro a..." — verificar)

**Exemplo de prompt:**
> "Usando adversarial, faça gap analysis da sessão S02 — O Inconsciente. Verifique: (1) há conceitos mencionados sem definição?, (2) alguma afirmação contradiz a Standard Edition?, (3) o que um estudante com zero conhecimento prévio não entenderia?, (4) a seção 'Viver Bem?' força conexão artificial ou é orgânica?"

**Limitações:** Adversarial é genérico — cobre qualquer domínio. No contexto Estudos, sempre combiná-lo com a referência às fontes da Wave A para que as verificações sejam evidence-based, não especulativas.

#### `framework-engineering` — Infraestrutura do Repo

**Triggers no Estudos:**
- Avaliar qualidade de engenharia do repositório (CI, testes, tooling)
- Decidir sobre adoção de novas ferramentas ou padrões
- Auditar DRY/SOLID no código vanilla JS (`sessao.js`, `tracking.js`)
- Revisar configuração de CI/CD (GitHub Actions workflows)

**Exemplo de prompt:**
> "Usando framework-engineering, audite a infraestrutura de testes do Estudos. Verifique: (1) cobertura dos testes unitários (tracking.js — 39 testes, sessao.js — 0 testes), (2) qualidade da suite Playwright (5 specs), (3) tooling de validação (html-validate, stylelint, lychee), (4) gaps de engenharia e recomendações."

**Limitações:** Framework-engineering cobre patterns para projetos de software (APIs, databases, containers). No contexto Estudos (HTML/CSS vanilla), focar apenas em: testing, CI/CD, code quality, tooling. Ignorar seções sobre backend, databases, containers, e Cloud — não se aplicam.

## Templates Compartilhados

`templates/style.css` e `templates/sessao-template.html` são usados por todos os assuntos. O design system "Warm Academic Editorial" (v2) define: paleta de cores (parchment #fbf8f0 + sepia-charcoal #1f1a14 + terracota #8b5e3c), tipografia self-hosted (Cormorant Garamond + Newsreader + Manrope), componentes (quiz, tooltips, timeline-mini, callouts, viver-bem, breadcrumb, skip-link), dark mode automático (marrom-noite + creme + cobre), responsividade (3 breakpoints), WCAG AA com roles ARIA explícitos.

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
