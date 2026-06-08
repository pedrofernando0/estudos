# Estudos de Psicanálise & Viver Bem na Contemporaneidade

Ambiente de aprendizado autodirigido em HTML/CSS interativo. 36 sessões em 6 módulos: da fundação freudiana à psicanálise contemporânea, integradas com reflexões sobre como viver bem no caos informacional.

## Skills Disponíveis

Este projeto tem 3 skills. Use a tool `Skill` para invocá-las pelo nome exato:

| Skill | Quando usar |
|-------|------------|
| `estudo-psicanalise` | Gerar, criar ou continuar sessões de estudo. Orquestrador principal. |
| `sessao-html` | Criar ou editar páginas HTML de sessão usando o design system. |
| `curadoria-psicanalise` | Pesquisar autores, conceitos, obras psicanalíticas com rigor acadêmico. |

**Fluxo principal**: `estudo-psicanalise` → delega pesquisa para `curadoria-psicanalise` → delega HTML para `sessao-html`.

## Ciclo de Produção (5 Waves)

Toda sessão segue: **Wave A** (Pesquisa Exaustiva) → **Wave B** (Estruturação Pedagógica) → **Wave C** (Geração HTML) → **Wave D** (QA & Verificação) → **Wave E** (Publicação). Nenhuma Wave pode ser pulada. Pesquisa (Wave A) nunca deve ser apressada.

## Diretórios-Chave

| Caminho | Conteúdo |
|---------|----------|
| `templates/sessao-template.html` | Template base HTML com todos os componentes |
| `templates/style.css` | Design system (CSS custom properties, light/dark, responsivo) |
| `sessoes/modulo-X/` | Sessões HTML geradas |
| `recursos/` | Glossário, timeline, mapa conceitual, autores, referências |
| `progresso/tracking.json` | Progresso do estudante |
| `../scripts/gerar-audio.sh` | Extrai texto e gera áudio via TTS |
| `.brainstorm/` | Boards de brainstorming |

## Convenções

- Idioma: **Português (Brasil)** em todo conteúdo textual
- Sessões: `sessoes/modulo-X/sXX-slug-em-portugues.html` (XX = 00–35)
- Citações: APA 7th + Standard Edition para Freud
- Design: usar classes e variáveis do `templates/style.css` — nunca hardcodar cores ou fontes
- Acessibilidade: WCAG AA — contraste ≥4.5:1, roles ARIA, keyboard nav
- Skills: canonical em `~/.agents/skills/`, symlinks em `~/.claude/skills/` e `skills/`
