# 📚 Estudos — Biblioteca Pessoal de Aprendizado

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

Hub de aprendizado autodirigido em HTML/CSS interativo. Cada assunto é uma subpasta independente com suas próprias sessões, dashboard e recursos. **Vanilla HTML/CSS/JS — zero dependências, offline-first.**

## Como usar

```bash
git clone https://github.com/pedrofernando0/estudos.git
cd estudos
```

1. Abra `index.html` no navegador — é o portal de entrada
2. Escolha um assunto (atualmente: Psicanálise & Viver Bem)
3. Navegue pelas sessões na ordem (S00 → S01 → ...) ou use o dashboard
4. Complete quizzes e reflexões ao final de cada sessão
5. Seu progresso é salvo automaticamente no navegador (localStorage)

## Estrutura

```
estudos/
├── index.html                  # Portal hub — seletor de assuntos
├── templates/                  # CSS e templates compartilhados
│   ├── style.css               # Design system (cores, tipografia, componentes, dark mode)
│   ├── sessao-template.html    # Template base para sessões HTML
│   ├── sessao.js               # JavaScript compartilhado (quiz, progresso, navegação)
│   └── fonts/                  # Fontes self-hosted WOFF2 (Cormorant Garamond, Newsreader, Manrope)
├── psicanalise/                # Assunto: Psicanálise & Viver Bem
│   ├── index.html              # Dashboard do assunto
│   ├── sessoes/                # Sessões HTML (36 planejadas, 3 geradas)
│   ├── recursos/               # Glossário, timeline, mapa conceitual, autores, referências
│   └── progresso/              # tracking.js (persistência localStorage)
├── scripts/                    # Scripts utilitários (TTS audio)
├── LICENSE                     # MIT
└── .github/                    # Issue template
```

## Assuntos

### 🧠 Psicanálise & Viver Bem (`psicanalise/`)

**36 sessões · 6 módulos** · Da fundação freudiana à contemporaneidade

| Módulo | Sessões | Conteúdo |
|--------|---------|----------|
| 0 — Orientação | S00–S01 | Boas-vindas, o que é psicanálise |
| 1 — Fundações | S02–S09 | Freud: da hipnose à metapsicologia |
| 2 — Dissidências | S10–S15 | Adler, Jung, Anna Freud, Klein |
| 3 — Relações Objetais | S16–S20 | Winnicott, Fairbairn, Bowlby, Bion |
| 4 — Lacan | S21–S26 | Estruturalismo, RSI, discursos |
| 5 — Contemporaneidade | S27–S32 | Intersubjetividade, campo, neuropsicanálise |
| 6 — Síntese | S33–S35 | Diagnóstico do presente, ética do viver |

## Design System

Os arquivos em `templates/` são compartilhados entre todos os assuntos:

- **`style.css`** — Design system "Warm Academic Editorial": paleta parchment+terracota, tipografia self-hosted, 3 breakpoints, dark mode automático, WCAG AA
- **`sessao-template.html`** — Template base com todos os componentes interativos (quiz, tooltips, reflexão, progress bar, keyboard nav)
- **`sessao.js`** — Lógica compartilhada de quiz, progresso, navegação e reflexão

## Para Agentes de IA

O arquivo `.claude/CLAUDE.md` contém instruções para agentes. Skills disponíveis (6):

| Skill | Propósito |
|-------|-----------|
| `estudo-psicanalise` | Orquestrador: geração de sessões com ciclo 5-Wave |
| `sessao-html` | Geração de HTML com o design system |
| `curadoria-psicanalise` | Pesquisa acadêmica com fontes verificadas (APA 7th) |
| `framework-education` | Lente pedagógica: Bloom, UbD, spiral curriculum, assessment |
| `adversarial` | QA metodológica: gap analysis, contradições, failure modes |
| `framework-engineering` | Excelência de engenharia: DRY, SOLID, tooling, CI/CD |

> **Nota:** As skills são symlinks em `skills/` apontando para `~/.agents/skills/`.

## Desenvolvimento

```bash
git clone https://github.com/pedrofernando0/estudos.git
cd estudos
npm install        # devDependencies apenas (validação, testes)
npm run setup      # instala tudo + browsers Playwright
```

### Scripts

| Comando | Descrição |
|---------|-----------|
| `npm run validate` | Valida HTML e CSS em todas as páginas |
| `npm run test:unit` | Testes unitários (tracking.js) |
| `npm run test:qa` | Testes Playwright (a11y, dark-mode, quiz, nav, responsive) |
| `npm test` | Unit tests + validação HTML/CSS |
| `npm run test:all` | Todos os testes (unit + validate + QA) |
| `npm run links` | Verifica links quebrados |
| `./scripts/novo-assunto.sh <nome>` | Scaffold de novo assunto |
| `./scripts/nova-sessao.sh <assunto> <mod> <num> <slug>` | Scaffold de nova sessão |
| `./scripts/validar-links.sh` | Verificação rápida de links internos |
| `./scripts/contar-palavras.sh` | Estatísticas de conteúdo |

### Editor

Configurações compartilhadas em `.editorconfig`, `.prettierrc` e `.zed/settings.json`. Zed é o editor recomendado para contribuir.

## Licença

MIT — veja [LICENSE](LICENSE).
