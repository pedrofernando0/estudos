#!/usr/bin/env bash
# nova-sessao.sh — Scaffold de nova sessão a partir do template
#
# Uso: ./nova-sessao.sh <assunto> <módulo> <número> <slug> ["Título da Sessão"]
#
# Exemplo: ./nova-sessao.sh psicanalise 1 3 interpretacao-dos-sonhos "A Interpretação dos Sonhos"

set -euo pipefail

if [ $# -lt 4 ]; then
  echo "Uso: $0 <assunto> <módulo> <número> <slug> [\"Título da Sessão\"]"
  echo "Exemplo: $0 psicanalise 1 3 interpretacao-dos-sonhos \"A Interpretação dos Sonhos\""
  exit 1
fi

ASSUNTO="$1"
MODULO="$2"
NUMERO="$3"
SLUG="$4"
TITULO="${5:-Sessão $NUMERO}"
BASE="$(cd "$(dirname "$0")/.." && pwd)"

if [ ! -d "$BASE/$ASSUNTO" ]; then
  echo "❌ Assunto '$ASSUNTO' não encontrado. Use scripts/novo-assunto.sh primeiro."
  exit 1
fi

# Inferir nome do módulo a partir dos diretórios existentes
MOD_DIR=$(ls -d "$BASE/$ASSUNTO/sessoes/modulo-$MODULO-"* 2>/dev/null | head -1 || true)

if [ -z "$MOD_DIR" ]; then
  # Criar diretório do módulo — nome precisa ser definido manualmente se não existir
  echo "⚠️  Diretório do módulo $MODULO não encontrado."
  echo "   Criando: $BASE/$ASSUNTO/sessoes/modulo-$MODULO/"
  mkdir -p "$BASE/$ASSUNTO/sessoes/modulo-$MODULO"
  MOD_DIR="$BASE/$ASSUNTO/sessoes/modulo-$MODULO"
fi

# Formatar número com 2 dígitos
NUM_PAD=$(printf "%02d" "$NUMERO")
NOME_ARQUIVO="s${NUM_PAD}-${SLUG}.html"
DESTINO="$MOD_DIR/$NOME_ARQUIVO"

if [ -f "$DESTINO" ]; then
  echo "❌ Arquivo já existe: $DESTINO"
  exit 1
fi

TEMPLATE="$BASE/templates/sessao-template.html"

if [ ! -f "$TEMPLATE" ]; then
  echo "❌ Template não encontrado: $TEMPLATE"
  exit 1
fi

echo "📄 Criando sessão a partir do template..."
echo "   Assunto: $ASSUNTO"
echo "   Módulo:  $MODULO"
echo "   Sessão:  S${NUM_PAD}"
echo "   Arquivo: $NOME_ARQUIVO"

# Copiar template e substituir placeholders básicos
sed \
  -e "s|SESSÃO_TITLE|$TITULO|g" \
  -e "s|SESSÃO_NUM|S${NUM_PAD}|g" \
  -e "s|../../templates/|../templates/|g" \
  "$TEMPLATE" > "$DESTINO"

echo ""
echo "✅ Sessão criada: $DESTINO"
echo "🔜 Editar o HTML para preencher conteúdo, badges, quiz, e seções."
