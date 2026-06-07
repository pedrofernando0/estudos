# Brainstorm Board — Estudos de Psicanálise & Viver Bem

## Decisões de Design

### 1. Multi-assunto vs Single-assunto

**Decisão:** Hub multi-assunto (`index.html` raiz) com `psicanalise/` como primeiro assunto.

**Alternativas consideradas:**
- Single-assunto: estrutura plana com sessões na raiz → rejeitada por limitar expansão futura
- Multi-repo: cada assunto em seu próprio repo git → rejeitada por complexidade desnecessária para projeto pessoal

**Trade-off:** Estrutura multi-assunto adiciona um nível de nesting mas permite que o hub cresça organicamente (ex: `filosofia/`, `neurociencia/`).

### 2. Formato HTML vs PDF vs Markdown

**Decisão:** HTML/CSS interativo com vanilla JS.

**Alternativas:**
- PDF: estático, não-interativo, difícil de versionar
- Markdown puro: sem interatividade, sem design
- React/Next.js: overkill para páginas estáticas, requer build step

**Trade-off:** HTML vanilla é o mais portátil (abre em qualquer navegador, offline) e permite componentes interativos (quiz, tooltips) sem dependências de runtime.

### 3. Tracking: localStorage vs IndexedDB vs server-side

**Decisão:** localStorage com chave `estudos-psicanalise-progress`, `tracking.json` como template de referência.

**Alternativas:**
- IndexedDB: mais capacidade mas API complexa → overkill para tracking simples
- Server-side (Firebase/Supabase): requer internet, autenticação → vai contra o princípio offline-first
- Cookies: limite de 4KB, expire

**Trade-off:** localStorage é síncrono e limitado a ~5MB, mas suficiente para tracking de 36 sessões. O `tracking.json` serve como documentação da estrutura e pode ser usado como fallback.

### 4. Design System: CSS Custom Properties

**Decisão:** Variáveis CSS no `:root` com fallbacks para light/dark mode via `prefers-color-scheme`.

**Alternativas:**
- Tailwind CSS: utility-first mas requer build step → rejeitado
- CSS-in-JS: requer runtime → rejeitado
- SASS/SCSS: requer compilação → rejeitado

**Trade-off:** CSS custom properties são nativas, zero-dependency, e permitem theming dinâmico sem JavaScript. A paleta cream+charcoal+deep-blue foi escolhida para evocar seriedade acadêmica com calor humano.

### 5. Skills: Project-based com canonical em ~/.agents/skills/

**Decisão:** 3 skills (estudo-psicanalise, sessao-html, curadoria-psicanalise) em `~/.agents/skills/` com symlinks duplos.

**Alternativas:**
- Skills inline no CLAUDE.md → rejeitada (muito longo, difícil de manter)
- Skills apenas no projeto → rejeitada (não disponíveis globalmente)

**Trade-off:** Symlinks duplos (`~/.claude/skills/` e `~/Estudos/skills/`) garantem disponibilidade tanto global quanto project-scoped.

### 6. Ciclo 5-Wave para produção de sessões

**Decisão:** Wave A (Pesquisa) → B (Estruturação) → C (HTML) → D (QA) → E (Publicação).

**Alternativas:**
- Geração direta (sem pesquisa): rápido mas baixa qualidade acadêmica
- Só pesquisa + escrita (sem QA): risco de erros de renderização

**Trade-off:** O ciclo completo leva ~30-60 min por sessão mas garante rigor acadêmico (Wave A), pedagógico (Wave B), técnico (Wave C) e visual (Wave D).

## Lenses Aplicados

| Lens | Aplicação |
|------|-----------|
| **Framework-education** | Bloom, UbD, spiral curriculum, ZPD scaffolding |
| **Framework-historian** | Estrutura cronológica, fontes primárias, consciência historiográfica |
| **Framework-design** | Design system com CSS custom properties, acessibilidade WCAG AA |
| **Framework-engineering** | Zero dependencies, vanilla HTML/CSS/JS, portabilidade máxima |

## Padrões que Emergiram

1. **PT-BR como idioma canônico** — todo conteúdo textual em português brasileiro
2. **APA 7th + Standard Edition** — padrão de citação duplo (APA para formato, SE para Freud)
3. **Viver Bem? em toda sessão** — integração, não segregação, da trilha contemporânea
4. **Quiz com feedback imediato** — não apenas certo/errado, mas explicação contextual
5. **Reflexão escrita salva** — localStorage persiste reflexões entre sessões

## Decisões Pendentes

- [ ] Áudio: instalar TTS (edge-tts) e testar geração para S00
- [ ] Módulo 1 completo: gerar S03–S09
- [ ] Git init: decidir se versiona as sessões HTML (arquivos grandes?)
- [ ] Expansão multi-assunto: qual será o próximo assunto?
