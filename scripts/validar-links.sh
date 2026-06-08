#!/usr/bin/env bash
# validar-links.sh — Verifica links internos entre páginas HTML
#
# Uso: ./validar-links.sh [--strict]
#
# Verifica que todos os href apontam para arquivos existentes.
# --strict: também verifica links para outras sessões (que podem não existir ainda).

set -euo pipefail

STRICT=false
if [ "${1:-}" = "--strict" ]; then
  STRICT=true
fi

BASE="$(cd "$(dirname "$0")/.." && pwd)"
ERRORS=0
CHECKED=0

echo "🔍 Verificando links internos..."
echo ""

while IFS= read -r -d '' HTML_FILE; do
  CHECKED=$((CHECKED + 1))
  REL_DIR=$(dirname "$HTML_FILE")

  # Extrair hrefs que apontam para arquivos locais (não http/https)
  while IFS= read -r HREF; do
    # Remover possíveis âncoras e parâmetros
    TARGET=$(echo "$HREF" | sed 's/[#?].*//')

    # Pular links vazios, javascript:, mailto:, tel:
    [ -z "$TARGET" ] && continue
    [[ "$TARGET" =~ ^(https?|javascript|mailto|tel): ]] && continue
    # Pular links para raiz (são do hub)
    [[ "$TARGET" == "../index.html" || "$TARGET" == "../../index.html" ]] && continue

    # Resolver caminho relativo
    RESOLVED="$REL_DIR/$TARGET"
    RESOLVED=$(realpath --relative-to="$BASE" "$RESOLVED" 2>/dev/null || echo "$REL_DIR/$TARGET")

    # Verificar se existe
    if [ ! -f "$BASE/$RESOLVED" ] && [ ! -d "$BASE/$RESOLVED" ]; then
      if $STRICT || [[ ! "$RESOLVED" =~ s[0-9]{2}-.*\.html$ ]]; then
        echo "❌ $(echo "$HTML_FILE" | sed "s|$BASE/||"):$HREF → $RESOLVED (não encontrado)"
        ERRORS=$((ERRORS + 1))
      fi
    fi
  done < <(grep -oP 'href="\K[^"]+' "$HTML_FILE" || true)
done < <(find "$BASE" -name '*.html' -not -path '*/node_modules/*' -not -path '*/.git/*' -print0)

echo ""
echo "📊 $CHECKED arquivos verificados, $ERRORS links quebrados encontrados."

if [ "$ERRORS" -gt 0 ]; then
  exit 1
else
  echo "✅ Todos os links internos válidos."
fi
