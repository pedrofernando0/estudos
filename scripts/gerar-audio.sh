#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# gerar-audio.sh — Extrai texto de sessão HTML e gera áudio via TTS
# Uso:   ./gerar-audio.sh <caminho-da-sessao.html>
# Ex:     ./gerar-audio.sh ../sessoes/modulo-0-orientacao/s00-boas-vindas.html
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
AUDIO_DIR="$PROJECT_ROOT/audio"

# ─── Cores ───
RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'

usage() {
  cat <<EOF
${GREEN}gerar-audio.sh${NC} — Gera áudio a partir de uma sessão HTML de estudos

${YELLOW}Uso:${NC}
  ./gerar-audio.sh <caminho-da-sessao.html>

${YELLOW}Exemplo:${NC}
  ./gerar-audio.sh ../sessoes/modulo-0-orientacao/s00-boas-vindas.html

${YELLOW}Dependências (instale pelo menos uma):${NC}
  pip install edge-tts     # Melhor qualidade PT-BR (Microsoft Edge TTS)
  pip install gtts          # Google Text-to-Speech
  sudo apt install espeak   # Fallback offline (qualidade menor)

${YELLOW}Output:${NC}
  Áudio salvo em ${AUDIO_DIR}/<nome-da-sessao>.mp3
EOF
  exit 0
}

# ─── Parse ───
[[ "${1:-}" == "-h" || "${1:-}" == "--help" ]] && usage
[[ -z "${1:-}" ]] && echo -e "${RED}Erro:${NC} informe o caminho da sessão HTML." && usage

HTML_FILE="$1"
[[ ! -f "$HTML_FILE" ]] && echo -e "${RED}Erro:${NC} arquivo não encontrado: $HTML_FILE" && exit 1

# ─── Extrair nome da sessão ───
SESSION_NAME=$(basename "$HTML_FILE" .html)
OUTPUT_FILE="$AUDIO_DIR/$SESSION_NAME.mp3"
TXT_FILE="/tmp/estudos_tts_$$.txt"

mkdir -p "$AUDIO_DIR"

# ─── Extrair texto limpo do HTML ───
echo -e "${YELLOW}Extraindo texto de:${NC} $HTML_FILE"

# Remove scripts, styles, nav, header meta, and extract main content
python3 - "$HTML_FILE" "$TXT_FILE" <<'PYEOF'
import sys, re
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = False
        self.skip_tags = {'script', 'style', 'nav', 'noscript', 'code'}
        self.text = []
        self.in_body = False

    def handle_starttag(self, tag, attrs):
        if tag in self.skip_tags:
            self.skip = True
        # Skip header meta (badges, timestamps), nav elements
        attrs_dict = dict(attrs)
        if attrs_dict.get('class', '') in ('session-meta', 'session-nav', 'timeline-mini'):
            self.skip = True

    def handle_endtag(self, tag):
        if tag in self.skip_tags:
            self.skip = False
        if tag in ('p', 'h1', 'h2', 'h3', 'h4', 'li', 'blockquote'):
            self.text.append('\n')
        # Re-enable after skipping meta sections
        if tag == 'div' or tag == 'footer' or tag == 'header':
            self.skip = False

    def handle_data(self, data):
        if not self.skip:
            cleaned = data.strip()
            if cleaned:
                self.text.append(cleaned + ' ')

extractor = TextExtractor()
with open(sys.argv[1], 'r') as f:
    extractor.feed(f.read())

# Clean up: remove excessive newlines, quiz labels, button text, etc.
text = ''.join(extractor.text)
text = re.sub(r'\n{3,}', '\n\n', text)
text = re.sub(r'[→←↑↓]', '', text)
text = re.sub(r'\s+', ' ', text)
text = text.strip()

with open(sys.argv[2], 'w') as f:
    f.write(text)
PYEOF

TEXT_LEN=$(wc -c < "$TXT_FILE")
echo -e "${GREEN}Texto extraído:${NC} ${TEXT_LEN} caracteres"

if [[ "$TEXT_LEN" -lt 100 ]]; then
    echo -e "${RED}Erro:${NC} texto extraído muito curto (${TEXT_LEN} chars). Verifique o HTML."
    rm -f "$TXT_FILE"
    exit 1
fi

# ─── Detectar e usar TTS engine ───
echo -e "${YELLOW}Gerando áudio...${NC}"

if command -v edge-tts &>/dev/null; then
    echo "Usando edge-tts (Microsoft) — melhor qualidade PT-BR"
    edge-tts --voice pt-BR-FranciscaNeural --text "$(cat "$TXT_FILE")" --write-media "$OUTPUT_FILE"

elif command -v gtts-cli &>/dev/null; then
    echo "Usando gTTS (Google)"
    gtts-cli -f "$TXT_FILE" -l pt-br -o "$OUTPUT_FILE"

elif command -v espeak &>/dev/null; then
    echo "Usando espeak (fallback) — qualidade limitada"
    espeak -v pt-br -f "$TXT_FILE" -w "$OUTPUT_FILE"

else
    echo -e "${RED}Nenhum motor TTS encontrado.${NC}"
    echo ""
    echo "Instale um dos seguintes:"
    echo "  pip install edge-tts      # Recomendado: melhor qualidade PT-BR"
    echo "  pip install gtts           # Alternativa: Google TTS"
    echo "  sudo apt install espeak    # Fallback offline"
    echo ""
    echo "Texto extraído salvo em: $TXT_FILE (para uso manual)"
    exit 1
fi

# ─── Resultado ───
if [[ -f "$OUTPUT_FILE" ]]; then
    AUDIO_SIZE=$(du -h "$OUTPUT_FILE" | cut -f1)
    rm -f "$TXT_FILE"
    echo ""
    echo -e "${GREEN}✓ Áudio gerado com sucesso!${NC}"
    echo "  Arquivo: $OUTPUT_FILE"
    echo "  Tamanho: $AUDIO_SIZE"
    echo "  Sessão:  $SESSION_NAME"
else
    echo -e "${RED}Erro:${NC} falha ao gerar áudio."
    exit 1
fi
