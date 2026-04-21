#!/usr/bin/env python3
"""
Upload brandbook PDFs from presentations/<num>-<slug>/*.pdf into Supabase
Storage bucket `brandbooks` as <slug>.pdf.

Usage:
    export SUPABASE_SERVICE_KEY="eyJhbGciOi..."
    python3 scripts/upload_brandbook_pdfs.py          # upload all
    python3 scripts/upload_brandbook_pdfs.py --dry    # list only
"""
from __future__ import annotations

import os
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRES_DIR = ROOT / "presentations"
SUPABASE_URL = "https://ctdleobjnzniqkqomlrq.supabase.co"
BUCKET = "brandbooks"


def slug_from_folder(folder: Path) -> str:
    m = re.match(r"^\d+-(.+?)(?:\s*\[good\])?$", folder.name)
    return m.group(1) if m else folder.name


def find_pdfs() -> list[tuple[str, Path]]:
    items: list[tuple[str, Path]] = []
    for d in sorted(PRES_DIR.iterdir()):
        if not d.is_dir() or d.name.startswith("_"):
            continue
        slug = slug_from_folder(d)
        pdfs = list(d.glob("*_deck.pdf"))
        if pdfs:
            items.append((slug, pdfs[0]))
    return items


def upload(slug: str, pdf: Path, service_key: str) -> tuple[bool, str]:
    url = f"{SUPABASE_URL}/storage/v1/object/{BUCKET}/{slug}.pdf"
    data = pdf.read_bytes()
    req = urllib.request.Request(
        url,
        data=data,
        method="POST",
        headers={
            "Content-Type": "application/pdf",
            "apikey": service_key,
            "Authorization": f"Bearer {service_key}",
            "x-upsert": "true",
            "Cache-Control": "public, max-age=31536000",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            return True, f"HTTP {resp.status} ({len(data)//1024}KB)"
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}: {e.read().decode('utf-8', 'replace')[:200]}"
    except Exception as e:
        return False, str(e)[:200]


def main() -> int:
    dry = "--dry" in sys.argv
    items = find_pdfs()
    print(f"Found {len(items)} brandbook PDF(s).")
    if dry:
        for slug, p in items:
            print(f"  {slug:<30}  {p.relative_to(ROOT)}  ({p.stat().st_size//1024}KB)")
        return 0

    service_key = os.environ.get("SUPABASE_SERVICE_KEY")
    if not service_key:
        print("ERROR: set SUPABASE_SERVICE_KEY env var.", file=sys.stderr)
        print("       get it from: Supabase Dashboard -> Project Settings -> API -> service_role", file=sys.stderr)
        return 2

    ok = fail = 0
    for slug, pdf in items:
        success, msg = upload(slug, pdf, service_key)
        mark = "OK" if success else "FAIL"
        print(f"  [{mark}] {slug:<30}  {msg}")
        if success:
            ok += 1
        else:
            fail += 1
    print(f"\nDone. {ok} uploaded, {fail} failed.")
    return 0 if fail == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main())
