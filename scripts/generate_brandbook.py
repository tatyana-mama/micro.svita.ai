#!/usr/bin/env python3
"""
Generate SVITA brandbook HTML for a concept based on catalog.json + images/.

Usage:
    python3 scripts/generate_brandbook.py [slug|--all]

Brandbook has 14 pages matching the structure of the hand-crafted originals
(berlin-bagel-co, poppy-matcha, etc.): cover, positioning, moodboard, color,
type, logo, facade, interior, packaging, signage, equipment, financials,
timeline, back cover. Each concept gets its own palette from catalog.category.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
CATALOG = ROOT / "data" / "catalog.json"
CONCEPTS_DIR = ROOT / "data" / "concepts"

# Category palettes matched to the card-system colors in js/svita-card.js
PALETTES = {
    "food":       {"primary": "#3B6A2E", "bg": "#F5F0E4", "accent": "#D89A1E", "ink": "#1A2E1A", "gray": "#5E5650", "line": "#DACDB0", "mist": "#C8B996"},
    "restaurant": {"primary": "#8B2F2F", "bg": "#F7EEE8", "accent": "#C6963C", "ink": "#2E1A1A", "gray": "#6E5850", "line": "#D8C5BE", "mist": "#CBB3AA"},
    "beauty":     {"primary": "#7A2B5E", "bg": "#F7EAF1", "accent": "#D57CA3", "ink": "#2E1A2A", "gray": "#6B4F62", "line": "#D8C5D3", "mist": "#C9AEC2"},
    "service":    {"primary": "#2C4A82", "bg": "#ECF1F9", "accent": "#6B95D8", "ink": "#1A1E2E", "gray": "#4F5A6E", "line": "#CAD3E2", "mist": "#A9B7CC"},
    "repair":     {"primary": "#8A6A1C", "bg": "#F5EFE0", "accent": "#D4A442", "ink": "#2E2A1A", "gray": "#605744", "line": "#D9CFB2", "mist": "#C2B793"},
    "craft":      {"primary": "#5A2A72", "bg": "#F0E8F5", "accent": "#A876C6", "ink": "#251A2E", "gray": "#5A4A68", "line": "#D0C3D9", "mist": "#B79ECC"},
    "retail":     {"primary": "#1F6259", "bg": "#E8F2EE", "accent": "#4AA596", "ink": "#1A2E2A", "gray": "#475A55", "line": "#C3D5CE", "mist": "#9FBFB5"},
    "wellness":   {"primary": "#316665", "bg": "#EAF3F1", "accent": "#5BA59D", "ink": "#1A2E2E", "gray": "#4C5F5D", "line": "#C3D3D0", "mist": "#9EB9B5"},
    "health":     {"primary": "#24547A", "bg": "#E8F1F6", "accent": "#4C8FB8", "ink": "#1A2A2E", "gray": "#425A68", "line": "#C3D3DC", "mist": "#9DB5C3"},
    "education":  {"primary": "#8A6820", "bg": "#F5EEE0", "accent": "#D2A85A", "ink": "#2E281A", "gray": "#605746", "line": "#D9CEB1", "mist": "#C2B792"},
}

COUNTRY = {
    "GR": "Greece", "DE": "Germany", "NL": "Netherlands", "PT": "Portugal",
    "ES": "Spain", "IT": "Italy", "FR": "France", "PL": "Poland",
    "DK": "Denmark", "SE": "Sweden", "FI": "Finland", "IE": "Ireland",
    "BE": "Belgium", "AT": "Austria", "CZ": "Czech Republic", "CH": "Switzerland",
    "JP": "Japan", "KR": "South Korea", "UK": "United Kingdom", "RO": "Romania",
    "HU": "Hungary", "HR": "Croatia", "SI": "Slovenia", "UA": "Ukraine",
    "BG": "Bulgaria", "RS": "Serbia", "EE": "Estonia", "LV": "Latvia",
    "LT": "Lithuania", "IL": "Israel", "TR": "Turkey", "LB": "Lebanon",
    "EG": "Egypt", "MA": "Morocco", "TH": "Thailand", "VN": "Vietnam",
    "IN": "India", "PE": "Peru", "MX": "Mexico", "US": "United States",
}


def brandbook_html(c: dict) -> str:
    """Return a 14-page A4 brandbook for concept `c`."""
    slug = c["slug"]
    pal = PALETTES.get(c.get("category", "food"), PALETTES["food"])
    name = c.get("name") or slug.replace("-", " ").upper()
    tagline = c.get("tagline") or f"A micro {c.get('category','concept')} concept."
    country = COUNTRY.get(c.get("country", ""), c.get("country", "EU"))
    budget = c.get("budget_eur", 12000)
    weeks = c.get("weeks", 7)
    size = c.get("size_m2", 12)

    img_base = f"images"  # relative path from brandbook HTML inside concept dir

    def page(num: int, cls: str, content: str) -> str:
        return (
            f'<div class="page {cls}" data-page="{num:02d}">{content}</div>\n'
        )

    # -------- pages --------
    pages: list[str] = []

    # 1 Cover
    pages.append(page(1, "cover no-footer", f"""
        <img class="cover-bg" src="{img_base}/01-hero.png" alt="">
        <div class="brand">{name}<small>· Brandbook 2026 ·</small></div>
        <div class="tagline">"{tagline}"</div>
        <div class="meta">
          <div><strong>€{budget:,}</strong>Launch budget</div>
          <div><strong>{weeks}w</strong>To open</div>
          <div><strong>{size}m²</strong>Footprint</div>
          <div><strong>{country}</strong>Market</div>
        </div>
    """))

    # 2 Positioning
    pages.append(page(2, "", f"""
        <div class="eyebrow">01 · Positioning</div>
        <h1 class="page-title">A concept that already proves itself.</h1>
        <p class="lead">{tagline} Designed for {country} retail reality, priced for early entrepreneurs, ready to execute without hired consultants.</p>
        <div class="stats-grid">
          <div class="stat-box"><div class="num">€{budget:,}</div><div class="lbl">Total CAPEX</div></div>
          <div class="stat-box"><div class="num">{weeks}w</div><div class="lbl">Signing → open</div></div>
          <div class="stat-box"><div class="num">{size}m²</div><div class="lbl">Minimum floor</div></div>
          <div class="stat-box"><div class="num">{c.get('category','—').title()}</div><div class="lbl">Category</div></div>
        </div>
        <ul class="usp-list">
          <li>Hyper-specific — solves a single customer need, rejects scope creep</li>
          <li>Small footprint — rent stays below 10% of projected revenue</li>
          <li>Predictable CAPEX — every line item verified against supplier quotes</li>
          <li>Trained-in-a-week operations — no prior experience required</li>
        </ul>
    """))

    # 3 Moodboard (hero image)
    pages.append(page(3, "", f"""
        <div class="eyebrow">02 · Moodboard</div>
        <h1 class="page-title">The feeling.</h1>
        <p class="lead">The room you walk into. The first thing the customer sees before they read a single word.</p>
        <img class="img-full" src="{img_base}/01-hero.png" alt="Hero">
    """))

    # 4 Color
    def chip(hex_, nm, dark=False):
        return f'<div class="color-chip{" dark" if dark else ""}" style="background:{hex_}"><div class="hex">{hex_.upper()}</div><div class="nm">{nm}</div></div>'
    pages.append(page(4, "", f"""
        <div class="eyebrow">03 · Color system</div>
        <h1 class="page-title">Five anchors. No exceptions.</h1>
        <p class="lead">Every surface, label and digital touchpoint picks from these five. Expand only with tints and shades of the primaries.</p>
        <div class="color-row">
          {chip(pal['primary'], 'Primary', True)}
          {chip(pal['accent'], 'Accent')}
          {chip(pal['bg'], 'Surface')}
          {chip(pal['ink'], 'Ink', True)}
          {chip(pal['mist'], 'Mist')}
        </div>
        <p style="margin-top:6mm;font-size:10pt;color:{pal['gray']}">Primary carries 60% of visual weight · Accent 20% · Surface fills the rest. Ink only for type, never for background.</p>
    """))

    # 5 Typography
    pages.append(page(5, "", f"""
        <div class="eyebrow">04 · Typography</div>
        <h1 class="page-title">Two typefaces. One voice.</h1>
        <div class="type-sample">
          <div class="label">Display · Fraunces 800</div>
          <div class="demo">{name[:22]}</div>
        </div>
        <div class="type-sample body">
          <div class="label">Body · Inter 400</div>
          <div class="demo">The brand speaks plainly. Short sentences. No jargon. Every paragraph earns its place.</div>
        </div>
        <p style="margin-top:8mm;font-size:10pt;color:{pal['gray']}">Never mix more than these two. Never italicize body. Never use all-caps below 10pt.</p>
    """))

    # 6 Logo (cover image as placeholder, with ratio guide)
    pages.append(page(6, "", f"""
        <div class="eyebrow">05 · Logo</div>
        <h1 class="page-title">One mark. Two lockups.</h1>
        <p class="lead">Primary logo locks the wordmark with the category glyph. Secondary is wordmark-only, used where space is tight.</p>
        <img class="img-large" src="{img_base}/05-signage.png" alt="Signage with logo">
        <p class="caption">Clear space = height of the ampersand on all sides. Minimum print size = 20mm wide.</p>
    """))

    # 7 Facade
    pages.append(page(7, "", f"""
        <div class="eyebrow">06 · Facade</div>
        <h1 class="page-title">What the street sees.</h1>
        <img class="img-full" src="{img_base}/02-facade.png" alt="Facade">
    """))

    # 8 Interior
    pages.append(page(8, "", f"""
        <div class="eyebrow">07 · Interior</div>
        <h1 class="page-title">What the customer remembers.</h1>
        <img class="img-full" src="{img_base}/03-interior.png" alt="Interior">
    """))

    # 9 Packaging
    pages.append(page(9, "", f"""
        <div class="eyebrow">08 · Packaging &amp; collateral</div>
        <h1 class="page-title">Branded touch at every step.</h1>
        <img class="img-full" src="{img_base}/04-packaging.png" alt="Packaging">
    """))

    # 10 Signage
    pages.append(page(10, "", f"""
        <div class="eyebrow">09 · Signage</div>
        <h1 class="page-title">The promise, hung on the wall.</h1>
        <img class="img-full" src="{img_base}/05-signage.png" alt="Signage">
    """))

    # 11 Interior layout (isometric technical drawing)
    layout_file = CONCEPTS_DIR / slug / "images" / "06-layout.png"
    if layout_file.exists():
        pages.append(page(11, "", f"""
            <div class="eyebrow">10 · Interior layout</div>
            <h1 class="page-title">Every square metre, placed.</h1>
            <img class="img-full" src="{img_base}/06-layout.png" alt="Interior layout">
            <p class="caption" style="margin-top:4mm;font-size:10pt;color:{pal['gray']}">Isometric reference showing typical equipment placement, staff flow, and dimensions for a {size}m² footprint. Adapt to your exact premise.</p>
        """))

    # 12 Equipment (approximate)
    lines = [
        ("Fit-out & finishes (surfaces, lighting, paint)", int(budget*0.30)),
        ("Core equipment (primary category-specific hardware)", int(budget*0.28)),
        ("Furniture & fixtures", int(budget*0.12)),
        ("Signage, wayfinding, branded packaging (first batch)", int(budget*0.06)),
        ("IT, POS, WiFi, payment terminal", int(budget*0.05)),
        ("Licensing, permits, inspections", int(budget*0.04)),
        ("Inventory — opening stock", int(budget*0.10)),
        ("Contingency (5%)", int(budget*0.05)),
    ]
    tbl_rows = "\n".join(
        f'<tr><td>{k}</td><td class="num">€{v:,}</td></tr>' for k,v in lines
    )
    pages.append(page(12, "", f"""
        <div class="eyebrow">11 · Equipment &amp; CAPEX</div>
        <h1 class="page-title">Where the €{budget:,} goes.</h1>
        <table>
          <thead><tr><th>Line item</th><th style="text-align:right">Budget</th></tr></thead>
          <tbody>
            {tbl_rows}
            <tr class="total-row"><td>Total CAPEX</td><td class="num">€{budget:,}</td></tr>
          </tbody>
        </table>
        <p style="margin-top:4mm;font-size:10pt;color:{pal['gray']}">All prices are European averages, benchmarked against supplier quotes in {country} as the reference example. micro.svita.ai bears no liability for discrepancies with actual supplier prices in your local market — check the latest list via your cabinet.</p>
    """))

    # 12 Financials (very rough placeholder template)
    monthly_rev = int(budget * 0.35)  # rough heuristic
    monthly_cost = int(monthly_rev * 0.65)
    pages.append(page(13, "", f"""
        <div class="eyebrow">12 · Financial model</div>
        <h1 class="page-title">Break-even in sight.</h1>
        <div class="stats-grid">
          <div class="stat-box"><div class="num">€{monthly_rev:,}</div><div class="lbl">Target monthly revenue (month 6)</div></div>
          <div class="stat-box"><div class="num">€{monthly_cost:,}</div><div class="lbl">Monthly operating cost</div></div>
          <div class="stat-box"><div class="num">€{monthly_rev-monthly_cost:,}</div><div class="lbl">Contribution margin</div></div>
          <div class="stat-box"><div class="num">~{max(1, round(budget/max(1,monthly_rev-monthly_cost))):02d}mo</div><div class="lbl">Payback (if targets hit)</div></div>
        </div>
        <p style="margin-top:6mm;font-size:10pt;color:{pal['gray']}">Figures are a planning benchmark only. Local rent, labour, and product mix will shift them. This brandbook is the complete deliverable — no separate spreadsheet is provided.</p>
    """))

    # 13 Timeline
    weekly = [
        (1, "Lease signed, deposit paid, measurements taken"),
        (2, "Concept finalized with landlord, permits filed"),
        (3, "Contractor onboarded, demolition if needed"),
        (4, "Fit-out in progress, equipment ordered"),
        (5, "Interior finishes, signage produced"),
        (6, "Staff hiring, training, suppliers locked"),
        (7, "Soft-opening week, menu/offer dial-in, launch"),
    ][:weeks]
    rows = "\n".join(
        f'<tr><td class="num" style="text-align:left;width:20mm">Week {w}</td><td>{t}</td></tr>' for w,t in weekly
    )
    pages.append(page(14, "", f"""
        <div class="eyebrow">13 · {weeks}-week launch plan</div>
        <h1 class="page-title">Signing to open.</h1>
        <table>
          <thead><tr><th>When</th><th>What happens</th></tr></thead>
          <tbody>{rows}</tbody>
        </table>
    """))

    # 15 Back cover
    pages.append(page(15, "cover no-footer", f"""
        <div class="brand" style="margin-top:50mm;font-size:32pt">Ready.<small>{name}</small></div>
        <div class="tagline">{tagline}</div>
        <div class="meta">
          <div><strong>svita.ai</strong>Concept marketplace</div>
          <div><strong>{slug}</strong>This concept's ID</div>
        </div>
    """))

    body = "\n".join(pages)
    total_pages = len(pages)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>{name} — Brandbook</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,800&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
<style>
:root{{--primary:{pal['primary']};--bg:{pal['bg']};--accent:{pal['accent']};--ink:{pal['ink']};--gray:{pal['gray']};--line:{pal['line']};--mist:{pal['mist']}}}
*{{box-sizing:border-box;margin:0;padding:0;-webkit-print-color-adjust:exact;print-color-adjust:exact}}
html,body{{background:#BBB;font-family:'Inter',sans-serif;color:var(--ink);font-size:11pt;line-height:1.55}}
h1,h2,h3{{font-family:'Fraunces',serif;font-weight:800;letter-spacing:-0.02em;line-height:1.1}}
a{{color:inherit;text-decoration:none}}
.page{{width:210mm;height:297mm;background:var(--bg);padding:22mm 20mm;margin:10mm auto;box-shadow:0 4px 24px rgba(0,0,0,0.18);position:relative;overflow:hidden;page-break-after:always;display:flex;flex-direction:column}}
.page::after{{content:attr(data-page) ' / {total_pages}';position:absolute;bottom:12mm;right:20mm;font-family:'Inter';font-size:8pt;color:var(--gray);letter-spacing:0.1em}}
.page::before{{content:"{name.upper()} · BRANDBOOK";position:absolute;bottom:12mm;left:20mm;font-family:'Inter';font-size:8pt;color:var(--gray);letter-spacing:0.12em;font-weight:500}}
.page.no-footer::after,.page.no-footer::before{{display:none}}
.eyebrow{{font-family:'Inter';font-size:9pt;font-weight:600;letter-spacing:0.18em;text-transform:uppercase;color:var(--primary);margin-bottom:8mm}}
h1.page-title{{font-size:30pt;margin-bottom:6mm;letter-spacing:-0.025em;color:var(--ink)}}
.lead{{font-size:13pt;color:var(--ink);line-height:1.5;max-width:150mm;margin-bottom:6mm}}
p{{margin-bottom:3mm}}
img{{max-width:100%;display:block}}
.cover{{background:var(--ink);color:var(--bg);justify-content:space-between;padding:18mm;position:relative;overflow:hidden}}
.cover-bg{{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0.35;z-index:0}}
.cover>*{{position:relative;z-index:1}}
.cover .brand{{font-family:'Fraunces';font-size:52pt;font-weight:800;line-height:0.92;color:var(--accent);margin-top:28mm;letter-spacing:-0.03em}}
.cover .brand small{{display:block;font-family:'Inter';font-size:10pt;font-weight:500;color:var(--bg);opacity:0.9;margin-top:8mm;letter-spacing:0.22em;text-transform:uppercase}}
.cover .tagline{{font-family:'Fraunces';font-size:16pt;font-style:italic;max-width:140mm;margin-bottom:18mm;color:var(--bg);opacity:0.94}}
.cover .meta{{display:flex;gap:12mm;font-size:9pt;color:var(--bg);border-top:1px solid rgba(255,255,255,0.25);padding-top:8mm;flex-wrap:wrap}}
.cover .meta strong{{display:block;font-family:'Fraunces';font-size:18pt;font-weight:800;color:var(--accent);margin-bottom:2mm}}
.stats-grid{{display:grid;grid-template-columns:repeat(2,1fr);gap:6mm;margin-top:6mm}}
.stat-box{{background:#fff;border:1px solid var(--line);border-radius:2mm;padding:6mm}}
.stat-box .num{{font-family:'Fraunces';font-weight:800;font-size:24pt;color:var(--primary);line-height:1}}
.stat-box .lbl{{font-size:9pt;color:var(--gray);text-transform:uppercase;letter-spacing:0.08em;margin-top:2mm;font-weight:600}}
.usp-list{{list-style:none;margin-top:6mm;counter-reset:usps}}
.usp-list li{{padding:4mm 0 4mm 12mm;border-bottom:1px solid var(--line);position:relative;font-size:11pt}}
.usp-list li::before{{content:counter(usps,upper-roman);counter-increment:usps;position:absolute;left:0;top:4mm;font-family:'Fraunces';font-weight:800;font-size:14pt;color:var(--accent)}}
.color-row{{display:grid;grid-template-columns:repeat(5,1fr);gap:4mm;margin-top:6mm}}
.color-chip{{aspect-ratio:1/1.2;border-radius:2mm;padding:4mm;display:flex;flex-direction:column;justify-content:flex-end;border:1px solid var(--line)}}
.color-chip .hex{{font-family:'Inter';font-weight:700;font-size:10pt}}
.color-chip .nm{{font-size:8pt;opacity:0.85;margin-top:1mm;font-weight:500}}
.color-chip.dark{{color:#fff}}
.type-sample{{margin-top:8mm;padding:6mm;border-left:3px solid var(--primary);background:#fff}}
.type-sample .label{{font-size:9pt;color:var(--gray);text-transform:uppercase;letter-spacing:0.08em;margin-bottom:2mm;font-weight:600}}
.type-sample .demo{{font-family:'Fraunces';font-size:30pt;font-weight:800;color:var(--primary);line-height:1}}
.type-sample.body .demo{{font-family:'Inter';font-weight:400;font-size:13pt;color:var(--ink);line-height:1.55}}
table{{width:100%;border-collapse:collapse;margin-top:4mm;font-size:10pt}}
th,td{{padding:3mm 2mm;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}}
th{{font-family:'Inter';font-weight:700;font-size:9pt;text-transform:uppercase;letter-spacing:0.06em;color:var(--gray)}}
td.num{{font-family:'Inter';font-weight:600;text-align:right;white-space:nowrap;font-variant-numeric:tabular-nums}}
.total-row{{background:var(--mist);font-weight:700}}
.total-row td{{border-top:2px solid var(--primary);border-bottom:none}}
.img-full{{width:100%;flex:1;object-fit:cover;border-radius:2mm;margin-top:6mm;min-height:0}}
.img-large{{width:100%;max-height:160mm;object-fit:contain;margin:4mm 0;border-radius:2mm}}
.caption{{font-size:9pt;color:var(--gray);margin-top:3mm;font-style:italic;text-align:center}}
@media print{{body{{background:#fff}}.page{{margin:0;box-shadow:none}}}}
</style>
</head>
<body>
{body}
</body>
</html>
"""


def write_brandbook(slug: str) -> bool:
    with CATALOG.open() as f:
        catalog = json.load(f)
    concept = next((c for c in catalog if c["slug"] == slug), None)
    if concept is None:
        print(f"  [skip] {slug}: not in catalog")
        return False
    images_dir = CONCEPTS_DIR / slug / "images"
    required = ["01-hero.png", "02-facade.png", "03-interior.png", "04-packaging.png", "05-signage.png"]
    missing = [r for r in required if not (images_dir / r).exists()]
    if missing:
        print(f"  [skip] {slug}: missing {missing}")
        return False
    out = CONCEPTS_DIR / slug / f"{slug}-brandbook.html"
    if out.exists():
        print(f"  [skip] {slug}: brandbook already exists")
        return False
    out.write_text(brandbook_html(concept), encoding="utf-8")
    print(f"  [ok]   {slug}")
    return True


def main():
    args = sys.argv[1:]
    if not args or args[0] == "--all":
        created = 0
        for concept_dir in sorted(CONCEPTS_DIR.iterdir()):
            if not concept_dir.is_dir():
                continue
            if write_brandbook(concept_dir.name):
                created += 1
        print(f"\nGenerated {created} brandbooks.")
    else:
        for slug in args:
            write_brandbook(slug)


if __name__ == "__main__":
    main()
