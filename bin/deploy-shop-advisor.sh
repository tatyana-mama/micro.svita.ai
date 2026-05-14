#!/usr/bin/env bash
# Один-shot деплой shop-advisor на Jetson Ollama.
#
# Использование:
#   SUPABASE_ACCESS_TOKEN=sbp_xxx ./bin/deploy-shop-advisor.sh
# или
#   ./bin/deploy-shop-advisor.sh sbp_xxx
#
# Что делает:
#   1) npx supabase login --token <PAT>
#   2) supabase secrets set LLM_PROVIDER=ollama
#   3) supabase functions deploy shop-advisor
#   4) Test-call в развёрнутый эндпоинт — увидим что качается из Jetson, не Anthropic
set -euo pipefail

REF="ctdleobjnzniqkqomlrq"
TOKEN="${SUPABASE_ACCESS_TOKEN:-${1:-}}"

if [[ -z "$TOKEN" ]]; then
  echo "ERR: PAT не передан. usage:"
  echo "  SUPABASE_ACCESS_TOKEN=sbp_xxx $0"
  echo "  $0 sbp_xxx"
  exit 1
fi

cd "$(dirname "$0")/.."
echo "== cwd: $(pwd)"

echo
echo "== 1) login (token-mode, без браузера)"
echo "$TOKEN" | npx --yes supabase@latest login --token-stdin

echo
echo "== 2) secrets — LLM_PROVIDER=ollama (LLM_ENDPOINT/LLM_MODEL уже стоят для ai-concept-chat)"
npx --yes supabase@latest secrets set LLM_PROVIDER=ollama --project-ref "$REF"

echo
echo "== 3) deploy shop-advisor"
npx --yes supabase@latest functions deploy shop-advisor --project-ref "$REF" --no-verify-jwt

echo
echo "== 4) smoke-test"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38"
RESP=$(curl -sS -X POST "https://${REF}.supabase.co/functions/v1/shop-advisor" \
  -H "Content-Type: application/json" -H "apikey: $ANON_KEY" \
  --data '{"message":"Bar Warsaw under 25k"}' --max-time 60)
echo "$RESP" | head -c 1000
echo

if echo "$RESP" | grep -q '"provider":"ollama"'; then
  echo "✓ qwen2.5:14b отвечает через Jetson Tailscale Funnel"
elif echo "$RESP" | grep -q '"reply"'; then
  echo "⚠ ответ есть, но не от Ollama — проверь поле provider в JSON выше"
else
  echo "✗ smoke-test failed — посмотри JSON выше"
fi
