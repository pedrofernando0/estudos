# Auditoria Adversarial — Estudos

**Data:** 2026-06-07
**Artefato:** Repositório completo (estado pós-evolução)
**Metodologias aplicadas:** Gap Analysis, Contradiction Detection, Architectural Stress-Testing, Failure Mode Analysis, Assumption Challenging, Edge Case Discovery, Pre-Mortem

---

## Sumário

| Severidade | Quantidade |
|-----------|-----------|
| BLOCKING | 0 |
| HIGH | 2 |
| MEDIUM | 5 |
| LOW | 4 |
| **Total** | **11** |

**Veredito:** PASS — Nenhum finding bloqueante. Recomenda-se resolver HIGH findings antes do próximo ciclo de geração de sessões.

---

## Critical Findings (BLOCKING)

Nenhum. O repositório está funcionalmente íntegro.

---

## High-Severity Findings

### H1: 33 sessões pendentes — risco de perda de momentum pedagógico

- **Dimensão:** Gap Analysis (coverage mapping)
- **Evidência:** `psicanalise/sessoes/` contém 3 arquivos HTML de 36 planejados (8.3%). Módulos 2–6 são pastas vazias.
- **Impacto:** Usuário completa S02 e encontra caminho vazio. Sem sessões seguintes, o streak e engajamento colapsam.
- **Mitigação:** `session-scaffold.md` contém briefs para S03–S35 — mas são briefs, não sessões. Priorizar geração de S03–S09 (Módulo 1) via ciclo 5-Wave.
- **Recomendação:** Gerar S03 imediatamente. Manter cadência de 2-3 sessões por sprint até completar Módulo 1.

### H2: `psicanalise/skills/` duplica symlinks da raiz — ambiguidade de autoridade

- **Dimensão:** Contradiction Detection (cross-reference)
- **Evidência:** `skills/` (raiz) e `psicanalise/skills/` contêm symlinks idênticos para as mesmas 3 skills. `skills/` raiz foi atualizado para 10; `psicanalise/skills/` permanece com 3.
- **Impacto:** Agentes que leem `psicanalise/.claude/CLAUDE.md` veem 3 skills; agentes que leem `.claude/CLAUDE.md` veem 10. Divergência de capacidade entre contexto raiz e contexto assunto.
- **Recomendação:** Remover `psicanalise/skills/` (manter apenas raiz `skills/`) ou atualizá-lo para espelhar os 10 symlinks. A primeira opção é mais limpa (DRY).

---

## Medium-Severity Findings

### M1: `session-scaffold.md` descreve S03–S09 com títulos diferentes do `tracking.js`

- **Dimensão:** Contradiction Detection
- **Evidência:** O tracking.js mapeia S03 como "A Interpretação dos Sonhos" mas o session-scaffold.md pode ter brief diferente. Verificar alinhamento entre `tracking.js:SESSION_MAP` e `session-scaffold.md`.
- **Impacto:** Se o scaffold divergir do tracking, o dashboard mostrará títulos errados ou links quebrados.
- **Recomendação:** Adicionar script de verificação de consistência `SESSION_MAP` ↔ `session-scaffold.md` ou unificar fonte da verdade.

### M2: Sem diferenciação de níveis de dificuldade entre sessões (ZPD gap)

- **Dimensão:** Gap Analysis (pedagógico — framework-education)
- **Evidência:** Todas as sessões seguem o mesmo template estrutural (pré-leitura, conteúdo, quiz, reflexão). Não há variação de complexidade ou scaffolding adaptativo.
- **Impacto:** Learners com diferentes níveis de conhecimento prévio recebem a mesma experiência. Pode ser frustrante para iniciantes ou entediante para avançados.
- **Recomendação:** Adicionar trilhas opcionais: "Essencial" (caminho básico), "Aprofundar" (com leituras extras), "Avançado" (com textos fonte).

### M3: Tracking.js usa `var` — inconsistente com ES6+ no resto do projeto

- **Dimensão:** Edge Case Discovery + framework-engineering
- **Evidência:** `tracking.js:17` usa `var EstudosTracking` e `'use strict'` dentro de IIFE. `sessao.js:11` usa IIFE com `'use strict'` também. Padrão consistente entre os dois, mas é padrão legado (ES5).
- **Impacto:** Baixo. Funciona em todos os browsers. Mas impede tree-shaking, module bundling, e测试 de unidade mais limpo (precisou de indirect eval).
- **Recomendação:** Migrar para ES modules quando refatorar tracking.js para multi-assunto (Task 7).

### M4: Sem mecanismo de export/import de progresso

- **Dimensão:** Failure Mode Analysis
- **Evidência:** Progresso salvo apenas em `localStorage`. Se o usuário limpar dados do navegador, trocar de dispositivo, ou usar navegação privada, perde todo o progresso.
- **Impacto:** Perda de 36 sessões de progresso = abandono do curso.
- **Recomendação:** Adicionar botão "Exportar progresso" (download JSON) e "Importar progresso" (upload JSON) no dashboard.

### M5: `npm run validate` não foi executado após as mudanças

- **Dimensão:** Gap Analysis (verification)
- **Evidência:** CI está configurado mas não rodou localmente. Possíveis erros de HTML/CSS introduzidos pelas edições de hoje.
- **Impacto:** CI pode falhar no primeiro push, exigindo correções pós-commit.
- **Recomendação:** Executar `npm run validate` antes do commit final.

---

## Low-Severity Findings

### L1: `gerar-audio.sh` referencia engines TTS que podem não estar instaladas

- **Dimensão:** Failure Mode Analysis
- **Evidência:** `scripts/gerar-audio.sh` suporta edge-tts, gtts, espeak — mas nenhum está instalado (confirmado em AI-CONTEXT.md:59).
- **Impacto:** Script sempre reporta erro. Usuário pode achar que está quebrado.
- **Recomendação:** Instalar edge-tts ou adicionar mensagem mais amigável com instruções de instalação.

### L2: `fonts.css` usa `font-display: swap` — FOUC em conexões lentas

- **Dimensão:** Edge Case Discovery
- **Evidência:** `templates/fonts/fonts.css` declara `font-display: swap` para todas as fontes.
- **Impacto:** Em primeira carga com rede lenta, texto renderiza em fallback (Georgia/Inter) antes de trocar para Cormorant Garamond/Newsreader. Layout shift visível.
- **Recomendação:** Considerar `font-display: optional` para visitantes recorrentes (fontes já em cache) ou adicionar `size-adjust` para reduzir layout shift.

### L3: Sem testes para `sessao.js`

- **Dimensão:** Gap Analysis
- **Evidência:** `tests/unit/tracking.test.js` cobre tracking.js mas não há testes para `sessao.js` (113 linhas, quiz logic, keyboard nav, progress bar, reflexão).
- **Impacto:** Mudanças no sessao.js (como o bug de quiz corrigido no PR #1) podem regredir sem detecção.
- **Recomendação:** Adicionar testes unitários para `sessao.js` ou cobrir via testes E2E existentes em `qa/`.

### L4: `.prettierrc` configurado mas `prettier` não está nas devDependencies

- **Dimensão:** Contradiction Detection
- **Evidência:** `.prettierrc` existe na raiz mas `prettier` não está listado em `devDependencies` no `package.json`. O `.zed/settings.json` referencia `"formatter": "prettier"`.
- **Impacto:** Zed usará prettier built-in (funciona), mas `npx prettier --check` falha sem instalação explícita.
- **Recomendação:** Adicionar `prettier` às devDependencies ou documentar que a formatação é via editor (Zed built-in).

---

## Unchallenged Assumptions (verificadas e confirmadas)

| Assumption | Verificação |
|-----------|------------|
| "Vanilla JS é suficiente para este projeto" | ✅ Confirmado. Projeto é conteúdo estático + interatividade leve. Frameworks trariam complexidade desnecessária. |
| "localStorage é adequado para persistência" | ✅ Confirmado para single-device. Adicionar export/import (M4) resolve multi-device. |
| "36 sessões é o número certo para o currículo" | ✅ Confirmado. Cobertura de Freud a contemporâneos em 6 módulos é abrangente sem ser exaustiva. |
| "Design system auto-contido em templates/ escala para multi-assunto" | ✅ Confirmado. `style.css` + `sessao-template.html` + `sessao.js` são genéricos o suficiente. Tracking.js precisa de namespace (G8 já identificado). |
| "Fontes self-hosted são melhores que CDN" | ✅ Confirmado. Offline-first, sem dependência externa, sem tracking de terceiros. |

---

## Pre-Mortem: Cenários de Falha (6 meses)

### Cenário 1: "O curador perdeu interesse"
**Probabilidade:** Média. **Impacto:** Alto.
Apenas 3/36 sessões geradas. Se o ritmo de geração não mantiver, o projeto estagna como "mais um curso incompleto". Tracking mostra abandono após S02.
**Mitigação:** Automatizar geração com agent pipeline (5-Wave cycle). Meta: 1 sessão/dia.

### Cenário 2: "Browser update quebrou o localStorage"
**Probabilidade:** Baixa. **Impacto:** Alto.
Tracking.js depende de localStorage. Se o browser mudar a API (ex: particionamento de storage), progresso do usuário some.
**Mitigação:** Adicionar export JSON (M4). Considerar IndexedDB como fallback.

### Cenário 3: "Design system não escala para 5 assuntos"
**Probabilidade:** Baixa. **Impacto:** Médio.
style.css tem 818 linhas com componentes específicos de psicanálise (`.viver-bem`, `.session-bloom`). Adicionar 4 novos assuntos pode exigir refatoração do CSS.
**Mitigação:** Extrair componentes específicos de assunto para CSS separado. Manter `style.css` como base genérica.

---

## Próximos Passos Recomendados

1. **[Imediato]** Executar `npm run validate` e corrigir erros antes do commit
2. **[Imediato]** Resolver H2: remover ou sincronizar `psicanalise/skills/`
3. **[Curto prazo]** Gerar S03 (A Interpretação dos Sonhos) via ciclo 5-Wave
4. **[Curto prazo]** Adicionar export/import de progresso (M4)
5. **[Médio prazo]** Refatorar tracking.js para multi-assunto + ES modules (M3)
6. **[Médio prazo]** Verificar alinhamento session-scaffold.md ↔ tracking.js SESSION_MAP (M1)
7. **[Longo prazo]** Adicionar trilhas de dificuldade (Essencial/Aprofundar/Avançado) (M2)
