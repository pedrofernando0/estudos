# AUDITORIA-SKILLS.md — Refinamento das 3 Skills Custom

Relatório de auditoria das skills customizadas do projeto Estudos.
Data: 2026-06-07

## escopo

As 3 skills customizadas em `~/.agents/skills/` foram auditadas contra as convenções atuais do projeto (`.claude/CLAUDE.md`, design system v2, QA workflow, convenções ARIA).

---

## estudo-psicanalise (121 linhas)

**Verificações:**
- [x] Referencia ciclo 5-Wave completo
- [x] Referencia frameworks pedagógicos (Bloom, UbD, spiral, ZPD)
- [x] Integração "Viver Bem?" documentada
- [x] Delegação para `curadoria-psicanalise` e `sessao-html`

**Ajustes aplicados:**
1. **Wave D**: Adicionado step `cd qa && npm run test:ci` (Playwright + axe-core) como primeira verificação — antes do QA visual com puppeteer. O `test:ci` é bloqueante.
2. **Wave E**: Corrigido path de salvamento de `~/Estudos/sessoes/...` → `~/Estudos/psicanalise/sessoes/...` (faltava o prefixo do assunto).

---

## sessao-html (95 → ~115 linhas)

**Verificações:**
- [x] Referencia design system (style.css, sessao-template.html)
- [x] Lista componentes obrigatórios (header, pré-leitura, quiz, viver-bem, etc.)
- [x] Cobre responsividade (3 breakpoints)
- [x] Convenção de nomenclatura de arquivos documentada

**Ajustes aplicados:**
1. **Descrição (frontmatter)**: Corrigida tipografia de "Georgia+Inter" → "Cormorant Garamond+Newsreader+Manrope" (design system v2).
2. **Template de quiz**: Adicionado `role="radiogroup"` e `aria-label="Opções de resposta"` no container `.quiz-options`, e `aria-checked="false"` em cada `.quiz-option` — conforme convenção ARIA do `.claude/CLAUDE.md`.
3. **Nova subseção "Convenções ARIA do Projeto"**: Documenta os padrões de tooltip (`aria-label` no `.conceito`, nunca `aria-describedby`) e quiz (`role="radiogroup"`, `aria-checked` via `sessao.js`), sincronizado com `.claude/CLAUDE.md`.
4. **Workflow de geração**: Adicionado step 8 (`cd qa && npm run test:ci`) antes da validação visual com puppeteer. Corrigido path de salvamento (step 7) para `~/Estudos/psicanalise/sessoes/...`.

---

## curadoria-psicanalise (111 linhas)

**Verificações:**
- [x] Referencia fontes canônicas (Standard Edition, Écrits, Klein, Winnicott, Bion, Bowlby)
- [x] Classificação de qualidade de fonte (A/B/C/Rejeitar)
- [x] Formatação APA 7th + Standard Edition documentada com exemplos
- [x] Workflow de pesquisa completo (8 passos: consulta → fontes → busca → classificação → triangulação → síntese → formatação → limitações)
- [x] Sem caminhos quebrados ou features removidas

**Ajustes aplicados:** Nenhum. A skill já cobre todos os requisitos: APA 7th, Standard Edition, fontes canônicas, critérios de qualidade. É a mais madura das 3.

---

## Resumo

| Skill | Issues | Ajustes |
|-------|--------|---------|
| `estudo-psicanalise` | 2 (QA workflow ausente, path incorreto) | 2 edits |
| `sessao-html` | 4 (tipografia errada, ARIA incompleto, QA ausente, path incorreto) | 4 edits |
| `curadoria-psicanalise` | 0 | Nenhum |

**Verificação cruzada:** Nenhum SKILL.md contém caminhos quebrados ou referências a features removidas (hexagonal-architecture, code-review, tdd-skill, frontend-design).
