# AI-CONTEXT — Estudos

Contexto técnico para agentes de IA. Atualizado a cada sessão significativa.

## Session: 2026-06-07 (Auditoria de Skills & Renomeação gemini.md → PROJECT.md)

### Changes
- [SKILLS] 4 symlinks irrelevantes removidos de `skills/`: hexagonal-architecture, code-review, tdd-skill, frontend-design. Diretórios fonte em `~/.agents/skills/` preservados.
- [SKILLS] 6 skills mantidas: estudo-psicanalise, sessao-html, curadoria-psicanalise, framework-education, adversarial, framework-engineering
- [DOCS] `gemini.md` renomeado para `PROJECT.md` via `git mv` — nome agnóstico de fornecedor. Header interno e todas as referências cruzadas atualizadas.
- [SKILLS] 3 skills custom auditadas e refinadas: estudo-psicanalise (QA workflow + path fix), sessao-html (tipografia corrigida para v2, ARIA conventions, QA workflow, path fix), curadoria-psicanalise (sem alterações necessárias)
- [DOCS] `.claude/CLAUDE.md` atualizado: skills table de 10→6, nova seção "Skills de Referência — Uso no Contexto Estudos" com triggers e exemplos para framework-education, adversarial, framework-engineering
- [DOCS] `psicanalise/.claude/CLAUDE.md`, `README.md`, `AI-CONTEXT.md` atualizados com skills 10→6 e referências corrigidas
- [DOCS] `AUDITORIA-SKILLS.md` criado com relatório de auditoria das 3 skills custom
- [CONFIG] `.zed/settings.json` verificado — sem paths quebrados (no-op)

### State
- 6 skills ativas em `skills/` — 3 custom (estudo-psicanalise, sessao-html, curadoria-psicanalise) + 3 referência (framework-education, adversarial, framework-engineering)
- `PROJECT.md` é a visão geral canônica do projeto (ex-gemini.md)
- `AUDITORIA-SKILLS.md` documenta as correções aplicadas às skills custom

## Session: 2026-06-07 (Auditoria, Skills, CI, Testes & Evolução)

### Decisions
- [EDITOR] Zed como editor recomendado — config compartilhada em `.zed/settings.json` com format_on_save + prettier
- [SKILLS] 10 skills paradigmáticas no projeto — raiz `skills/` é fonte canônica; `psicanalise/skills/` removido (duplicação)
- [CI] GitHub Actions para validação HTML/CSS/links + QA — sem deploy (site estático)
- [TEST] Vitest + jsdom para unit tests; localStorage mockado via setup file (Node 22 requer `--localstorage-file`)
- [AUDIT] Adversarial audit estabelecido como prática — `AUDITORIA-ADVERSARIAL.md` com 6 dimensões, 11 findings
- [ARCH] Deferido: JSON Schema para sessões (separar domínio da apresentação) — requer discussão de formato
- [ARCH] Deferido: tracking.js namespace para multi-assunto — requer migração de ES5→ES modules

### Discoveries
- [ADVERSARIAL] `.claude/CLAUDE.md:48` descrevia design system errado (v1 "cream+charcoal+deep-blue") quando código usa v2 ("parchment+terracota") — docs desatualizados são o bug mais comum em codebases AI-assisted
- [ADVERSARIAL] `psicanalise/skills/` duplicava symlinks da raiz — ambiguidade de autoridade entre contexto raiz e assunto (H2)
- [TEST] tracking.js usa padrão IIFE+var (ES5) — testar requer indirect eval; migrar para ES modules permitiria import direto
- [QA] Remote já trouxe suite Playwright com axe-core (5 specs) — não precisou criar do zero
- [SCALE] 33/36 sessões pendentes é o maior risco do projeto — session-scaffold.md reduz fricção mas não substitui geração

### Constraints
- [HTML] Vanilla JS only — sem frameworks, sem CDN, sem npm runtime. Node apenas para devDependencies
- [FONTS] 22 WOFF2 self-hosted em `templates/fonts/` — `font-display: swap` causa FOUC em primeira carga (L2)
- [NODE] Node 22+ requer `--localstorage-file` flag — contornado com localStorage mock em `tests/setup.js`
- [TTS] Nenhum motor TTS instalado — `gerar-audio.sh` sempre falha até instalar edge-tts

### Patterns
- [SKILLS] Symlinks: canonical em `~/.agents/skills/<nome>/`, symlink em `<projeto>/skills/<nome>`. Nunca criar direto na pasta do projeto.
- [COMMITS] Convencionais: feat/fix/docs/chore/ci/test/refactor. Co-Authored-By obrigatório.
- [TEST] Unit tests para JS vanilla: indirect eval + globalThis + jsdom. Setup file para localStorage mock. Padrão replicável para `sessao.js`.
- [SCRIPTS] Scripts bash em `scripts/`: shebang + `set -euo pipefail` + help (`-h`). Permissão 755.
- [AUDIT] Adversarial: aplicar 6 dimensões (gap, contradiction, stress-test, failure-mode, assumptions, edge-case) + pre-mortem. Relatório em `AUDITORIA-ADVERSARIAL.md`.

## Session: 2026-06-08 (Diagnóstico, Correções e Próximos Passos)

### Diagnóstico das sessões existentes
- Design system renderiza corretamente — caminhos CSS e variáveis estão certos em todas as páginas
- Conteúdo de S01 e S02 é de alta qualidade (narrativa rica, citações reais, tooltips, viver-bem)
- Havia 1 bug funcional no quiz (abaixo) e 33 sessões pendentes como maior lacuna

### Fixes applied (PR #1 → main, squash merge)
- [BUG] Quiz feedback corrigido em `sessao.js`: indexação mudou de `data-correct` (índice da opção, 0–3) para posição da questão no DOM via `Array.prototype.indexOf`. Antes, S01 Q1 mostrava a mensagem de Q3; S02 só Q1 estava correta por acidente.
- [CSS] Cor hardcoded `#fffdf7` no `.reflexao button` substituída por `var(--color-bg-card)`
- [A11Y] Elemento `<main>` adicionado ao template e às 3 sessões (S00, S01, S02) — landmark semântico para screen readers
- [A11Y] Tooltips `.conceito` agora respondem a foco de teclado (focus/blur) e toque (toggle por clique, fecha ao clicar fora); `tabindex="0"` injetado via JS

### State
- 3 de 36 sessões geradas (S00, S01, S02) — base sólida, sem bugs funcionais conhecidos
- Próxima: **S03 — O Inconsciente: Estrutura e Provas** (Módulo 1)
- Repo público: https://github.com/pedrofernando0/estudos — main atualizado, sem CI/CD (intencional)

### Próximos Passos (ordenados por prioridade)

1. **Gerar sessões S03–S09 (Módulo 1 — Fundações Freudianas)**
   - Usar skill `estudo-psicanalise` → ciclo 5-Wave (A: Pesquisa → B: Estrutura → C: HTML → D: QA → E: Publicação)
   - S03: O Inconsciente: Estrutura e Provas
   - S04: Sonhos: A Interpretação Freudiana
   - S05: Sexualidade Infantil e Desenvolvimento Psicossexual
   - S06: A Segunda Tópica: Id, Ego e Superego
   - S07: Pulsão de Morte e Compulsão à Repetição
   - S08: O Mal-Estar na Civilização
   - S09: Transferência, Contratransferência e a Relação Analítica

2. **Gerar sessões S10–S15 (Módulo 2 — Dissidências e Expansões)**
   - Adler, Jung, Klein, Anna Freud, Hartmann/Erikson, Rank/Ferenczi

3. **Gerar sessões S16–S20 (Módulo 3 — Escola Inglesa/Relações Objetais)**
   - Winnicott, Bion, Bowlby, Fairbairn, Balint

4. **Gerar sessões S21–S26 (Módulo 4 — Lacan e Estruturalismo)**
   - RSI, significante, discursos, sinthome

5. **Gerar sessões S27–S32 (Módulo 5 — Contemporaneidade)**
   - Intersubjetividade, neuropsicanálise, psicanálise e sociedade, Brasil

6. **Gerar sessões S33–S35 (Módulo 6 — Síntese e Encerramento)**

7. **TTS**: instalar `edge-tts` e testar geração de áudio para S00

### Constraints conhecidos
- Tooltips hover-only em CSS puro (`:hover`) — JS já corrige para teclado/toque, mas o CSS original permanece como camada base para mouse

## Session: 2026-06-07 (GitHub Publication & Repo Organization)

### Fixes applied
- [CSS] `--text-md: 1rem` adicionado ao `:root` — `.session-subtitle` agora tem font-size explícito
- [CSS] `--radius-full: 999px` adicionado ao `:root` — `.badge-item` agora tem border-radius circular
- [A11Y] `--color-text-muted` ajustado para WCAG AA: `#6e6254` (light, ~5.0:1) / `#8c7a68` (dark, ~4.8:1)
- [MOBILE] Touch events (`touchstart/touchmove/touchend`) adicionados ao drag-scroll da timeline
- [JS] `templates/sessao.js` criado — extrai ~150 linhas de JS duplicadas de 4 arquivos HTML
- [CLEAN] 3 arquivos `*-source.css` removidos de `templates/fonts/` (artefatos de download)
- [GH] Repo publicado: https://github.com/pedrofernando0/estudos (3 commits, remote origin)
- [GH] LICENSE (MIT), `.github/ISSUE_TEMPLATE.md`, README.md atualizado com badge+estrutura+clone

### State
- 3 de 36 sessões geradas (S00, S01, S02)
- Próxima: S03 — O Inconsciente: Estrutura e Provas
- Repo público no GitHub — 3 commits, sem CI/CD (intencional)
- Design system v2 com todos os bugs críticos corrigidos
- JavaScript extraído para arquivo compartilhado (sessao.js)

## Session: 2026-06-07 (Auditoria e Correções)

### Fixes applied
- [BUG] Quiz feedback corrigido nas 3 sessões: `correctMessages[parseInt(correct)]` + fallback `|| 'Correto!'` (era `messages[parseInt(chosen)]`)
- [DESIGN] `fonts.css` adicionado a 7 páginas que não carregavam fontes self-hosted (hub raiz, dashboard, 5 recursos)
- [LINKS] 23 links de autor em `autores.html` corrigidos — apontavam para `sessoes/sessao-a1.html` (inexistente), agora mapeados para S01–S32
- [INFRA] `git init` — projeto versionado, commit inicial com 54 arquivos
- [DOCS] `PROJECT.md` (originalmente gemini.md) criado na raiz
- [SKILLS] `psicanalise/skills/` populado com symlinks para `~/.agents/skills/`

### State
- 3 de 36 sessões geradas (S00, S01, S02)
- Próxima: S03 — O Inconsciente: Estrutura e Provas
- QA visual (Puppeteer) e verificação de dark mode ainda pendentes
- TTS não instalado

## Session: 2026-06-07 (Redesign da Experiência de Leitura)

### Decisions
- [ARCH] ~/Estudos/ é hub multi-assunto; cada assunto é subpasta com seu próprio dashboard, sessões e recursos
- [ARCH] Templates (style.css, sessao-template.html) compartilhados em ~/Estudos/templates/ para todos os assuntos
- [PROCESS] Ciclo de produção canônico: Wave A (Pesquisa Exaustiva) → Wave B (Estruturação Pedagógica) → Wave C (Geração HTML) → Wave D (QA) → Wave E (Publicação). Nenhuma wave pode ser pulada
- [CURRICULUM] Psicanálise: 36 sessões (S00–S35), 6 módulos. "Viver Bem?" integrado em TODAS as sessões (não segregado)
- [SKILLS] 3 skills: estudo-psicanalise (catalog, 6 refs), sessao-html (catalog, 5 refs), curadoria-psicanalise (standalone). Canonical em ~/.agents/skills/, symlinks em ~/.claude/skills/ e ~/Estudos/skills/
- [DESIGN-v2] Redesign 2026-06-07: Editorial Acadêmico Cálido. Tipografia: Cormorant Garamond (headings) + Newsreader (corpo) + Manrope (UI), self-hosted WOFF2 em templates/fonts/. Paleta: parchment #fbf8f0 + sepia-charcoal #1f1a14 + terracota #8b5e3c. Escala tipográfica com contraste dramático entre níveis de heading. Progress bar de leitura (3px, scroll-driven). Keyboard nav (← →). Blockquote com fundo destacado. Design adversarially hardened — fonts self-hosted preserva offline-first, contraste verificado WCAG AA/AAA
- [DESIGN-v1-legacy] Anterior (deprecated): cream+charcoal+deep-blue, Georgia headings + Inter body, sem progress bar
- [LANG] PT-BR para todo conteúdo textual. Citações: APA 7th + Standard Edition para Freud

### Discoveries
- [ADVERSARIAL] Plano inicial tinha 5 contradições (C1-C5) e 5 gaps (G1-G5). Principal: 3 skills desenhadas mas só 1 task; Módulo 6 segregava "Viver Bem" contradizendo escolha do usuário por integração
- [AGENTS] frontend-design agent produziu HTML de qualidade superior a general-purpose para dashboard e recursos (2831 linhas, 5 páginas)
- [STRUCTURE] Recursos de referência são as 5 páginas mais pesadas do projeto (glossário 678 linhas, mapa-conceitual 861 linhas)
- [ADVERSARIAL-v2] Revisão adversarial do plano de redesign identificou 9 gaps. Corrigidos: fonts self-hosted (não CDN), paleta com verificação de contraste, espaçamento 1.25x (não 1.5x), mini-TOC e reading badge removidos, progress bar mantida, keyboard nav adicionado

### Constraints
- [TTS] Nenhum motor TTS instalado. Script gerar-audio.sh detecta edge-tts > gtts > espeak e reporta erro se nenhum disponível
- [HTML] Vanilla JS only — sem frameworks, sem CDN, sem npm. Fontes self-hosted em WOFF2
- [CONTRAST] ≥4.5:1 para texto normal (WCAG AA). Verificado: #1f1a14 on #fbf8f0 = 14.5:1 (AAA), #8b5e3c on #fbf8f0 = 5.8:1 (AA)
- [FONTS] 22 arquivos WOFF2 em templates/fonts/ — Cormorant Garamond (10), Newsreader (6), Manrope (6). fonts.css gerado com @font-face + font-display: swap

### Patterns
- [NAMING] Sessões: `sessoes/modulo-X/sXX-slug-em-portugues.html` (XX = 00–35, 2 dígitos)
- [CSS] Usar `var(--color-*)` e `var(--font-*)` exclusivamente. Nunca hardcodar cores ou fontes
- [SKILLS] Criar em ~/.agents/skills/<nome>/ primeiro, depois symlink. Nunca criar direto em ~/.claude/skills/
- [MULTI-SUBJECT] Cada assunto segue: assunto/index.html (dashboard), assunto/sessoes/, assunto/recursos/, assunto/progresso/tracking.json, assunto/.claude/CLAUDE.md

### Pending (handoff)
- QA visual (puppeteer) das 3 sessões com o novo design system pendente
- Verificação de dark mode nas 3 sessões pendente
- Geração das sessões S03–S35 pendente (33 sessões)
- Instalação de motor TTS (edge-tts) pendente
- ~~Projeto não versionado~~ → git init feito, commit inicial em main
