#!/usr/bin/env python3
"""
Bulk-upload brandbook HTML files from data/concepts/*/ into the Supabase
`concept_brandbooks` table so that the admin panel, view.html brandbook reader
and tokenized access RPC can all see them.

Why: catalog.json carries a `has_brandbook` hint for the shop renderer, but the
buyer experience (iframe srcdoc via RPC) reads the HTML out of the database.
Every *-brandbook.html on disk must land in that table.

Requires the service_role key (never the anon key) because RLS blocks public
writes. Pass it via the SUPABASE_SERVICE_KEY environment variable.

Usage:
    export SUPABASE_SERVICE_KEY="eyJhbGciOi..."
    python3 scripts/upload_brandbooks.py           # upload all on-disk brandbooks
    python3 scripts/upload_brandbooks.py --dry     # list what would be uploaded
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CONCEPTS_DIR = ROOT / "data" / "concepts"
SUPABASE_URL = "https://ctdleobjnzniqkqomlrq.supabase.co"
ENDPOINT = f"{SUPABASE_URL}/rest/v1/concept_brandbooks"


def find_brandbooks() -> list[tuple[str, Path]]:
    items: list[tuple[str, Path]] = []
    for d in sorted(CONCEPTS_DIR.iterdir()):
        if not d.is_dir():
            continue
        slug = d.name
        html = d / f"{slug}-brandbook.html"
        if html.exists():
            items.append((slug, html))
    return items


def upsert(slug: str, html_path: Path, service_key: str) -> tuple[bool, str]:
    body = json.dumps({
        "concept_slug": slug,
        "html_content": html_path.read_text(encoding="utf-8"),
    }).encode("utf-8")
    req = urllib.request.Request(
        ENDPOINT,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "Prefer": "resolution=merge-duplicates,return=minimal",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return True, f"{resp.status}"
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:200]}"
    except Exception as e:
        return False, str(e)[:200]


def main() -> int:
    dry = "--dry" in sys.argv
    items = find_brandbooks()
    print(f"Found {len(items)} brandbook(s) on disk.")
    if dry:
        for slug, _ in items:
            print(f"  would upload: {slug}")
        return 0

    service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not service_key:
        print("ERROR: set SUPABASE_SERVICE_KEY env var.", file=sys.stderr)
        print("       get it from: Supabase Dashboard → Settings → API → service_role", file=sys.stderr)
        return 2

    ok = fail = 0
    for slug, html in items:
        success, msg = upsert(slug, html, service_key)
        mark = "✓" if success else "✗"
        print(f"  {mark} {slug}  {msg}")
        if success:
            ok += 1
        else:
            fail += 1
    print(f"\nDone. {ok} uploaded, {fail} failed.")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
