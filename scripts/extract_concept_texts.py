#!/usr/bin/env python3
"""Extract the editorial text from every presentations/*/index.html into a
single JSON keyed by slug — this becomes the assistant's knowledge base.

Each concept folder is named NN-<slug>[ [good]]/. We pull:
  - the H1 hero title
  - the pretext H2 / paragraph
  - every <aside class="slide-note"> body (24 slide annotations × ~30 words)
  - the hero eyebrow (concept number)

Output: data/concept_texts.json
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRES = ROOT / "presentations"
OUT = ROOT / "data" / "concept_texts.json"


def strip_tags(s: str) -> str:
    s = re.sub(r"<[^>]+>", " ", s)
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def slug_from_dir(d: Path) -> str:
    name = d.name
    # strip leading "NN-" prefix and trailing " [good]" suffix
    name = re.sub(r"^\d+-", "", name)
    name = re.sub(r"\s*\[good\]\s*$", "", name)
    return name.strip()


def extract(html: str) -> dict:
    out = {}
    m = re.search(r"<h1>([^<]+)</h1>", html)
    if m:
        out["title"] = strip_tags(m.group(1))
    m = re.search(r'<div class="hero-eyebrow">([^<]+)</div>', html)
    if m:
        out["eyebrow"] = strip_tags(m.group(1))
    m = re.search(r'<section class="pretext">([\s\S]*?)</section>', html)
    if m:
        pre = strip_tags(m.group(1))
        if pre:
            out["pretext"] = pre
    # tagline (hero-tag div)
    m = re.search(r'<div class="hero-tag">([^<]+)</div>', html)
    if m:
        out["hero_tag"] = strip_tags(m.group(1))
    # per-slide annotations
    notes = re.findall(r'<aside class="slide-note">([\s\S]*?)</aside>', html)
    out["slides"] = [strip_tags(n) for n in notes]
    return out


def main() -> int:
    bundle: dict[str, dict] = {}
    if not PRES.is_dir():
        print(f"no presentations dir at {PRES}", file=sys.stderr)
        return 1
    for d in sorted(PRES.iterdir()):
        if not d.is_dir():
            continue
        if d.name.startswith("_"):
            continue
        f = d / "index.html"
        if not f.is_file():
            continue
        try:
            html = f.read_text(encoding="utf-8", errors="ignore")
        except Exception as e:
            print(f"skip {d.name}: {e}", file=sys.stderr)
            continue
        slug = slug_from_dir(d)
        rec = extract(html)
        rec["slug"] = slug
        bundle[slug] = rec
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(bundle, ensure_ascii=False, indent=2), encoding="utf-8")
    total_slides = sum(len(r.get("slides", [])) for r in bundle.values())
    size_kb = OUT.stat().st_size // 1024
    print(f"wrote {OUT.relative_to(ROOT)}: {len(bundle)} concepts, {total_slides} slide notes, {size_kb} KB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
