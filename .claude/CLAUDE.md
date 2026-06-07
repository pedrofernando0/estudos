# Estudos — Biblioteca Pessoal de Aprendizado

Hub multi-assunto em HTML/CSS interativo. Cada assunto é uma subpasta com seu próprio dashboard, sessões e recursos.

## Assuntos Ativos

| Assunto | Pasta | Sessões | Status |
|---------|-------|---------|--------|
| 🧠 Psicanálise & Viver Bem | `psicanalise/` | 36 sessões (6 módulos) | Em progresso |

## Estrutura

```
~/Estudos/
├── index.html              # Portal hub — seletor de assuntos
├── templates/              # CSS e HTML templates (compartilhados entre assuntos)
│   ├── style.css           # Design system (cores, tipografia, componentes)
│   └── sessao-template.html# Template base para sessões HTML
├── scripts/                # Scripts utilitários (TTS, etc.)
├── psicanalise/            # Assunto: Psicanálise & Viver Bem
│   ├── index.html          # Dashboard do assunto
│   ├── .claude/CLAUDE.md   # Instruções para agentes
│   ├── sessoes/            # Sessões HTML
│   ├── recursos/           # Glossário, timeline, mapa, autores, refs
│   └── progresso/          # tracking.json
└── [futuros assuntos]/
```

## Skills Disponíveis

Use via `Skill` tool no Claude Code:

| Skill | Escopo | Quando usar |
|-------|--------|------------|
| `estudo-psicanalise` | Psicanálise | Orquestrador: geração de sessões com ciclo 5-Wave |
| `sessao-html` | Global | Geração de HTML interativo com o design system |
| `curadoria-psicanalise` | Psicanálise | Pesquisa acadêmica com fontes verificadas |

## Templates Compartilhados

`templates/style.css` e `templates/sessao-template.html` são usados por todos os assuntos. O design system define: paleta de cores (cream+charcoal+deep-blue), tipografia (Georgia+Inter), componentes (quiz, tooltips, timeline-mini, callouts, viver-bem), dark mode automático, responsividade (3 breakpoints), WCAG AA.

## Convenções

- Idioma: PT-BR
- Citações: APA 7th + Standard Edition para Freud
- Design: usar `var(--color-*)` e `var(--font-*)` — nunca hardcodar cores ou fontes
- Acessibilidade: WCAG AA — contraste ≥4.5:1, roles ARIA, keyboard nav
