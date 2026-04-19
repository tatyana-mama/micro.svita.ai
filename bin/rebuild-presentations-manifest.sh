#!/usr/bin/env bash
# Scans presentations/ folder for every *_deck.pdf and writes a slug→URL map
# to presentations/manifest.json. Run before git push whenever you add or
# rename a brandbook deck; view.html reads this manifest at runtime to pick
# the right PDF per concept, so no DB migration is needed.
set -euo pipefail
cd "$(dirname "$0")/.."

OUT="presentations/manifest.json"
TMP="$(mktemp)"

{
  printf '{\n'
  first=1
  find presentations -mindepth 2 -maxdepth 2 -name "*_deck.pdf" | sort | while read -r path; do
    folder="$(dirname "$path" | sed 's|^presentations/||')"
    slug="$(echo "$folder" | sed -E 's/^[0-9]+-//; s/ \[good\]$//')"
    pdf="$(basename "$path")"
    # URL-encode spaces and brackets in folder name; rest of ASCII stays as-is
    urlfolder="$(echo "$folder" | sed 's/ /%20/g; s/\[/%5B/g; s/\]/%5D/g')"
    url="presentations/${urlfolder}/${pdf}"
    if [ $first -eq 1 ]; then first=0; else printf ',\n'; fi
    printf '  "%s": "%s"' "$slug" "$url"
  done
  printf '\n}\n'
} > "$TMP"

mv "$TMP" "$OUT"
count=$(grep -c '"' "$OUT")
echo "wrote $OUT — $(((count-1)/2)) entries"
