# PROJECT.md — Estudos

Hub multi-assunto de aprendizado autodirigido em HTML/CSS interativo.
Projeto vanilla (sem frameworks, sem npm, sem CDN). Fontes self-hosted em WOFF2.

## Estrutura

```
~/Estudos/
├── index.html              # Portal hub — seletor de assuntos
├── package.json            # DevDependencies (validação, testes) — zero runtime
├── vitest.config.js        # Testes unitários (jsdom)
├── templates/              # CSS e HTML templates (compartilhados)
│   ├── style.css           # Design system v2 — "Warm Academic Editorial"
│   ├── sessao-template.html# Template base para sessões HTML (com fixes a11y)
│   ├── sessao.js           # Script compartilhado (quiz, tooltips, nav)
│   └── fonts/              # 22 WOFF2 self-hosted
├── scripts/                # Utilitários (TTS, scaffold, validação, stats)
│   ├── gerar-audio.sh
│   ├── novo-assunto.sh     # Scaffold de novo assunto
│   ├── nova-sessao.sh      # Scaffold de nova sessão
│   ├── validar-links.sh    # Verificação de links internos
│   └── contar-palavras.sh  # Estatísticas de conteúdo
├── tests/                  # Testes unitários
│   └── unit/tracking.test.js  # 39 testes para tracking.js
├── qa/                     # Testes Playwright (a11y, dark-mode, quiz, nav, responsive)
├── skills/                 # 6 symlinks para skills paradigmáticas
├── .zed/                   # Configuração do editor Zed (compartilhada)
├── .github/workflows/      # CI: validação HTML/CSS + link checker + QA
└── psicanalise/            # Assunto ativo: Psicanálise & Viver Bem
    ├── index.html          # Dashboard do assunto
    ├── sessoes/            # 36 sessões planejadas (3 geradas)
    ├── recursos/           # Glossário, timeline, mapa, autores, refs
    └── progresso/          # tracking.js (localStorage) + tracking.json
```

## Assunto Ativo: Psicanálise & Viver Bem

- **36 sessões** (S00–S35), 6 módulos — Fundamentos Freudianos aos Contemporâneos
- **Sessões geradas:** S00, S01, S02 (3 de 36)
- **Próxima:** S03 — A Interpretação dos Sonhos
- **Briefs:** `psicanalise/.claude/session-scaffold.md` contém briefs para S03–S35
- **Design system:** v2 (2026-06-07) — paleta parchment+sepia-charcoal+terracota, tipografia Cormorant Garamond+Newsreader+Manrope
- **Acessibilidade:** WCAG AA (contraste ≥4.5:1), keyboard nav (← →), dark mode, responsivo (3 breakpoints)
- **QA:** Suite Playwright + axe-core em `qa/`

## Skills (6 symlinks em skills/)

| Skill | Propósito |
|-------|-----------|
| `estudo-psicanalise` | Orquestrador de geração de sessões (5-Wave cycle) |
| `sessao-html` | Geração de HTML com o design system |
| `curadoria-psicanalise` | Pesquisa acadêmica com fontes verificadas |
| `framework-education` | Lente pedagógica (Bloom, UbD, spiral curriculum) |
| `adversarial` | QA metodológica (gap analysis, contradições, failure modes) |
| `framework-engineering` | Excelência de engenharia (DRY, SOLID, tooling) |

## Ferramentas de Desenvolvimento

```bash
npm install          # devDependencies
npm test             # unit tests + HTML/CSS validation
npm run test:all     # unit + validation + QA (Playwright)
npm run links        # link checker
```

- **Editor:** Zed (config em `.zed/settings.json`) + `.editorconfig` + `.prettierrc`
- **CI:** GitHub Actions em `.github/workflows/validate.yml` (HTML, CSS, links, QA)

## Convenções

- Idioma: PT-BR
- Citações: APA 7th + Standard Edition (Freud)
- CSS: usar `var(--color-*)` e `var(--font-*)` exclusivamente
- Sessões: `sessoes/modulo-X/sXX-slug-em-portugues.html`
- Vanilla JS apenas — sem frameworks de runtime
- Commits: convencionais (feat, fix, docs, chore, ci, test, refactor)

## Pendências

- 33 sessões pendentes (S03–S35) — briefs prontos em session-scaffold.md
- Refatorar tracking.js para multi-assunto (namespace parameter)
- Separar conteúdo em dados estruturados (JSON Schema + build script)
- Instalar motor TTS (edge-tts)

_Última atualização: 2026-06-07_
