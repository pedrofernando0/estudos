#!/usr/bin/env bash
# contar-palavras.sh — Estatísticas de conteúdo do hub Estudos
#
# Uso: ./contar-palavras.sh [assunto]

set -euo pipefail

BASE="$(cd "$(dirname "$0")/.." && pwd)"
ASSUNTO="${1:-}"

contar_html() {
  local FILE="$1"
  # Extrair texto visível do HTML (remove tags, scripts, comentários)
  sed -e 's/<[^>]*>//g' \
      -e 's/&[a-z]\+;//g' \
      -e '/^[[:space:]]*$/d' \
      "$FILE" 2>/dev/null | wc -w
}

if [ -n "$ASSUNTO" ]; then
  TARGET="$BASE/$ASSUNTO"
  if [ ! -d "$TARGET" ]; then
    echo "❌ Assunto '$ASSUNTO' não encontrado."
    exit 1
  fi
  echo "📊 Estatísticas: $ASSUNTO"
  echo "============================"
  echo ""

  TOTAL=0
  while IFS= read -r -d '' FILE; do
    PALAVRAS=$(contar_html "$FILE")
    TOTAL=$((TOTAL + PALAVRAS))
    REL=$(echo "$FILE" | sed "s|$BASE/||")
    printf "  %-50s %6d palavras\n" "$REL" "$PALAVRAS"
  done < <(find "$TARGET" -name '*.html' -not -path '*/node_modules/*' -not -path '*/.git/*' -print0)

  echo ""
  echo "  Total: $TOTAL palavras"
else
  echo "📊 Estatísticas globais do hub"
  echo "=============================="
  echo ""
  echo "  Hub (index.html): $(contar_html "$BASE/index.html") palavras"
  echo ""

  while IFS= read -r -d '' DIR; do
    if [ "$DIR" != "$BASE" ] && [ -f "$DIR/index.html" ]; then
      NOME=$(basename "$DIR")
      TOTAL=0
      while IFS= read -r -d '' FILE; do
        P=$(contar_html "$FILE")
        TOTAL=$((TOTAL + P))
      done < <(find "$DIR" -name '*.html' -not -path '*/node_modules/*' -print0)
      printf "  %-40s %6d palavras\n" "$NOME:" "$TOTAL"
    fi
  done < <(find "$BASE" -maxdepth 1 -type d -not -path "$BASE" -not -path '*/node_modules' -not -path '*/.git' -not -name 'templates' -not -name 'scripts' -not -name 'qa' -not -name '.zed' -not -name '.github' -not -name '.claude' -print0)
fi
