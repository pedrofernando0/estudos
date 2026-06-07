# 📚 Estudos — Biblioteca Pessoal

Hub de aprendizado autodirigido em HTML/CSS interativo. Cada assunto é uma subpasta independente com suas próprias sessões, dashboard e recursos.

## Como usar

1. Abra `index.html` no navegador — é o portal de entrada
2. Escolha um assunto (atualmente: Psicanálise & Viver Bem)
3. Navegue pelas sessões na ordem (S00 → S01 → ...) ou use o dashboard
4. Complete quizzes e reflexões ao final de cada sessão
5. Seu progresso é salvo automaticamente (localStorage)

## Assuntos

### 🧠 Psicanálise & Viver Bem (`psicanalise/`)

**36 sessões · 6 módulos**

| Módulo | Sessões | Conteúdo |
|--------|---------|----------|
| 0 — Orientação | S00–S01 | Boas-vindas, o que é psicanálise |
| 1 — Fundações | S02–S09 | Freud: da hipnose à metapsicologia |
| 2 — Dissidências | S10–S15 | Adler, Jung, Anna Freud, Klein |
| 3 — Relações Objetais | S16–S20 | Winnicott, Fairbairn, Bowlby, Bion |
| 4 — Lacan | S21–S26 | Estruturalismo, RSI, discursos |
| 5 — Contemporaneidade | S27–S32 | Intersubjetividade, campo, neuropsicanálise |
| 6 — Síntese | S33–S35 | Diagnóstico do presente, ética do viver |

## Templates Compartilhados

Os arquivos em `templates/` são usados por todos os assuntos:

- `style.css` — Design system completo (cores, tipografia, componentes, dark mode, responsivo)
- `sessao-template.html` — Template base com todos os componentes interativos (quiz, tooltips, reflexão, navegação)

## Para Agentes de IA

O arquivo `.claude/CLAUDE.md` contém instruções para agentes Claude Code. Skills disponíveis:

- `estudo-psicanalise` — Orquestrador de sessões do assunto Psicanálise
- `sessao-html` — Gerador de HTML com o design system
- `curadoria-psicanalise` — Pesquisa acadêmica com fontes verificadas

Cada assunto também tem seu próprio `.claude/CLAUDE.md` com instruções específicas.
