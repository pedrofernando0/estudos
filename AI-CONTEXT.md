# AI-CONTEXT — Estudos

Contexto técnico para agentes de IA. Atualizado a cada sessão significativa.

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
- Próxima: **S03 — A Interpretação dos Sonhos** (Módulo 1)
- Repo público: https://github.com/pedrofernando0/estudos — main atualizado, sem CI/CD (intencional)

### Próximos Passos (ordenados por prioridade)

1. **Gerar sessões S03–S09 (Módulo 1 — Fundações Freudianas)**
   - Usar skill `estudo-psicanalise` → ciclo 5-Wave (A: Pesquisa → B: Estrutura → C: HTML → D: QA → E: Publicação)
   - S03: A Interpretação dos Sonhos
   - S04: Metapsicologia e o Aparelho Psíquico
   - S05: A Teoria da Sexualidade
   - S06: O Complexo de Édipo
   - S07: Pulsão de Morte e Além do Princípio do Prazer
   - S08: O Mal-Estar na Civilização
   - S09: A Técnica Psicanalítica

2. **Gerar sessões S10–S15 (Módulo 2 — Dissidências e Expansões)**
   - Adler, Jung, Rank, Anna Freud, Hartmann, Erikson, Melanie Klein

3. **Gerar sessões S16–S20 (Módulo 3 — Escola Inglesa/Relações Objetais)**
   - Fairbairn, Winnicott, Balint, Bowlby, Bion

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
- Próxima: S03 — A Interpretação dos Sonhos
- Repo público no GitHub — 3 commits, sem CI/CD (intencional)
- Design system v2 com todos os bugs críticos corrigidos
- JavaScript extraído para arquivo compartilhado (sessao.js)

## Session: 2026-06-07 (Auditoria e Correções)

### Fixes applied
- [BUG] Quiz feedback corrigido nas 3 sessões: `correctMessages[parseInt(correct)]` + fallback `|| 'Correto!'` (era `messages[parseInt(chosen)]`)
- [DESIGN] `fonts.css` adicionado a 7 páginas que não carregavam fontes self-hosted (hub raiz, dashboard, 5 recursos)
- [LINKS] 23 links de autor em `autores.html` corrigidos — apontavam para `sessoes/sessao-a1.html` (inexistente), agora mapeados para S01–S32
- [INFRA] `git init` — projeto versionado, commit inicial com 54 arquivos
- [DOCS] `gemini.md` criado na raiz
- [SKILLS] `psicanalise/skills/` populado com symlinks para `~/.agents/skills/`

### State
- 3 de 36 sessões geradas (S00, S01, S02)
- Próxima: S03 — A Interpretação dos Sonhos
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
