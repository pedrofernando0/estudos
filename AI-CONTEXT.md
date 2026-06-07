# AI-CONTEXT — Estudos

Contexto técnico para agentes de IA. Atualizado a cada sessão significativa.

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
