# bin/

## rebuild-presentations-manifest.sh
Scans `presentations/` and writes a slug → deck-pdf-url map to
`presentations/manifest.json`. Run before every `git push` that adds or
renames an editorial PDF deck. `view.html` reads the manifest at runtime,
so the brandbook viewer automatically picks up new decks without a
database migration.

Usage:
```
bash bin/rebuild-presentations-manifest.sh
git add presentations/manifest.json
git commit -m "..."
git push
```
