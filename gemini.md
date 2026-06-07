# gemini.md — Estudos

Hub multi-assunto de aprendizado autodirigido em HTML/CSS interativo.
Projeto vanilla (sem frameworks, sem npm, sem CDN). Fontes self-hosted em WOFF2.

## Estrutura

```
~/Estudos/
├── index.html              # Portal hub — seletor de assuntos
├── templates/              # CSS e HTML templates (compartilhados)
│   ├── style.css           # Design system v2 — "Warm Academic Editorial"
│   ├── sessao-template.html# Template base para sessões HTML
│   └── fonts/              # 22 WOFF2 self-hosted
├── scripts/                # Utilitários (TTS, etc.)
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
- **Design system:** v2 (2026-06-07) — paleta parchment+sepia-charcoal+terracota, tipografia Cormorant Garamond+Newsreader+Manrope
- **Acessibilidade:** WCAG AA (contraste ≥4.5:1), keyboard nav (← →), dark mode, responsivo (3 breakpoints)

## Skills (Agentes de IA)

| Skill | Propósito |
|-------|-----------|
| `estudo-psicanalise` | Orquestrador de geração de sessões (5-Wave cycle) |
| `sessao-html` | Geração de HTML com o design system |
| `curadoria-psicanalise` | Pesquisa acadêmica com fontes verificadas |

## Convenções

- Idioma: PT-BR
- Citações: APA 7th + Standard Edition (Freud)
- CSS: usar `var(--color-*)` e `var(--font-*)` exclusivamente
- Sessões: `sessoes/modulo-X/sXX-slug-em-portugues.html`
- Vanilla JS apenas — sem frameworks

## Pendências

- 33 sessões pendentes (S03–S35)
- QA visual (Puppeteer) pendente
- TTS não instalado (edge-tts)
- Dark mode verification pendente

_Última atualização: 2026-06-07_
