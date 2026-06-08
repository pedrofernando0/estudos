#!/usr/bin/env bash
# novo-assunto.sh — Scaffold de novo assunto no hub Estudos
#
# Uso: ./novo-assunto.sh <nome-do-assunto> ["Título Legível"]
#
# Exemplo: ./novo-assunto.sh filosofia "Filosofia Ocidental"

set -euo pipefail

if [ $# -lt 1 ]; then
  echo "Uso: $0 <nome-do-assunto> [\"Título Legível\"]"
  echo "Exemplo: $0 filosofia \"Filosofia Ocidental\""
  exit 1
fi

SLUG="$1"
TITULO="${2:-$SLUG}"
BASE="$(cd "$(dirname "$0")/.." && pwd)"

if [ -d "$BASE/$SLUG" ]; then
  echo "❌ Assunto '$SLUG' já existe em $BASE/$SLUG"
  exit 1
fi

echo "📁 Criando estrutura para: $TITULO ($SLUG)"

# Criar diretórios
mkdir -p "$BASE/$SLUG/sessoes"
mkdir -p "$BASE/$SLUG/recursos"
mkdir -p "$BASE/$SLUG/progresso"
mkdir -p "$BASE/$SLUG/.claude"
mkdir -p "$BASE/$SLUG/audio"

# index.html — dashboard do assunto
cat > "$BASE/$SLUG/index.html" << HTML
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$TITULO — Estudos</title>
  <link rel="stylesheet" href="../templates/fonts/fonts.css">
  <link rel="stylesheet" href="../templates/style.css">
</head>
<body>
  <div class="reading-progress" id="reading-progress" aria-hidden="true"></div>

  <nav class="breadcrumb" aria-label="Localização">
    <a href="../index.html">Estudos</a>
    <span aria-hidden="true"> › </span>
    <span>$TITULO</span>
  </nav>

  <header class="session-header">
    <h1>$TITULO</h1>
    <p class="session-subtitle">Em breve — sessões de estudo em preparação.</p>
  </header>

  <main id="main-content">
    <section class="dashboard-grid">
      <div class="dashboard-card">
        <h4>Sessões</h4>
        <div class="dashboard-stat">0</div>
        <p style="font-size:var(--text-sm);color:var(--color-text-secondary)">
          Primeira sessão em breve
        </p>
      </div>
    </section>
  </main>

  <footer class="session-nav">
    <a href="../index.html">← Estudos</a>
    <span class="nav-center">$TITULO</span>
    <span></span>
  </footer>
</body>
</html>
HTML

# .claude/CLAUDE.md
cat > "$BASE/$SLUG/.claude/CLAUDE.md" << MD
# $TITULO — Estudos

Assunto em estruturação. Sessões, recursos e tracking serão adicionados.

## Estrutura

- \`sessoes/\` — Sessões HTML (seguir template \`../templates/sessao-template.html\`)
- \`recursos/\` — Glossário, timeline, mapa conceitual, referências
- \`progresso/\` — tracking.js (localStorage)

## Convenções

- Idioma: PT-BR
- Sessões: \`sessoes/modulo-X/sXX-slug.html\`
- Design: usar classes e variáveis de \`../templates/style.css\`
- Acessibilidade: WCAG AA
MD

echo ""
echo "✅ Assunto '$SLUG' criado com sucesso!"
echo "   Dashboard: $SLUG/index.html"
echo "   Agente:    $SLUG/.claude/CLAUDE.md"
echo ""
echo "🔜 Próximo: criar a primeira sessão com scripts/nova-sessao.sh"
