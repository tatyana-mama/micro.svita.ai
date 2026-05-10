#!/usr/bin/env python3
"""
Build a self-contained HTML library page for every concept folder.

For each presentations/NN-<slug>[ [good]]/ directory:
  - reads concept.json (if present)
  - emits index.html — editorial split-view: every slide is paired with a
    structured annotation panel, then a meta section with palette / equipment /
    rituals / economics, then a CTA pointing to /account.html for subscription.

Run:
    python3 scripts/build_library_page.py             # all concepts
    python3 scripts/build_library_page.py 42-paris-candle-atelier
"""
from __future__ import annotations

import json
import re
import sys
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PRES = ROOT / "presentations"

# Slide PNGs and brandbook PDFs are NOT published to GitHub Pages (the slim
# pages.yml workflow excludes presentations/*/*.png and *.pdf because the bundle
# would exceed the 1 GB Pages limit). Instead, we serve heavy assets straight
# from jsDelivr's git CDN — same place concepts_catalog.hero_image already
# points to. Only the per-concept index.html lands on Pages.
JSDELIVR_PRES_BASE = "https://cdn.jsdelivr.net/gh/tatyana-mama/micro.svita.ai@main/presentations"

# canonical 25-slide narrative — title + intent for the annotation panel
SLIDE_NARRATIVE = [
    ("01", "cover",       "Anchor",            "First glance, full-bleed. The image you would put on the cover of a magazine if this place existed tomorrow. Mood, palette, aspiration in one frame."),
    ("02", "definition",  "What it is",        "One sentence answer to ‘what is this?’ Strip away marketing — what physical thing happens here, for whom, why it could not exist anywhere else."),
    ("03", "axonometric", "The blueprint",     "30° isometric of the room. Zones, footprint, flow. If a friend asked ‘can I afford to copy this?’, this is the page that answers — every metre is accounted for."),
    ("04", "facade",      "From the street",   "Façade in city context. Signage discreet, lighting warm. The first decision a passer-by makes is here: do I cross the threshold?"),
    ("05", "arrival",     "Crossing in",       "First three seconds inside. What the eye lands on, the smell, the sound. Arrival design is hospitality compressed into one moment."),
    ("06", "interior",    "The main space",    "Wide shot of the room as it is meant to be lived in. Materials, light, silence. No staged people — the place must feel inhabited, not photographed."),
    ("07", "materials",   "Hands and grain",   "Macro of textures: stone, wood, metal, linen. Fingers in frame. This is the page that tells a craftsperson what to source — and a customer why it costs what it costs."),
    ("08", "ritual",      "The signature gesture", "The single repeating gesture this place is built around. The thing the customer comes back for and tells a friend about."),
    ("09", "still-life",  "Three objects",     "Editorial still life of three to five hero objects on neutral ground. The product line distilled into a magazine spread."),
    ("10", "equipment",   "Tools of the trade","Top-down lay-out of the working equipment. Real models, real prices. This page is what you take to a supplier and a builder on day one."),
    ("11", "menu",        "What is sold",      "Nine miniatures of the offer with prices in euro. Not a menu card — a product family laid out for owner and customer simultaneously."),
    ("12", "takeaway",    "What leaves the room", "Flat-lay of branded packaging. The piece of the place a customer carries home. Continuity of identity beyond the four walls."),
    ("13", "signage",     "Wayfinding",        "Sign and navigation up close. Type, colour, hierarchy. A room without signage is a room without grammar."),
    ("14", "identity",    "Mark, type, palette","Logo lock-up, type pair, palette swatches, pattern. The identity board you hand to a print-shop or a developer."),
    ("15", "economics",   "The numbers",       "Editorial list — not a table. Pull-quote figures, hairlines. Rent, revenue, cost-of-goods, margin. EU-averaged ranges, not promises."),
    ("16", "capex",       "What it costs to open", "One-time spend, broken into honest chunks. No hidden line, no consultant fee. The amount that goes from your account to the world."),
    ("17", "timeline",    "Eight weeks",       "Horizontal Gantt across roughly eight weeks. Lease, licences, build, soft-open. The plan that turns a brief into a key in the door."),
    ("18", "team",        "Who runs it",       "Two or three roles, drawn or silhouetted. Responsibilities, hours, payroll order of magnitude."),
    ("19", "moment",      "After-service euphoria", "A live human after the service has happened. The reason the place exists — not a stock smile, an honest after-image."),
    ("20", "personas",    "Who walks in",      "Three personas — name, city, why they came today. Not demographics — small fictions specific enough to brief a copywriter."),
    ("21", "channels",    "Where they hear of you", "Four channels with a tone-of-voice for each. How this place speaks on Instagram is not how it speaks on Google Maps."),
    ("22", "risks",       "What can go wrong", "Three real risks and the short answer to each. Honest, not defensive. The page an investor reads first."),
    ("23", "manifest",    "The reason",        "Manifesto paragraph against a high-contrast image. Why this place, why now, why you. One paragraph you would tape to the back of the till."),
    ("24", "package",     "What you receive",  "Inventory of what comes inside the brandbook: P&L, floor-plan, equipment list, menu, eight-week plan, day-one checklist."),
    ("25", "cta",         "Claim it",          "Closing call: one concept, one place, one team. The handoff from idea to execution."),
]

# narrative for the optional 13-slide STORY format (newer concepts)
STORY_NARRATIVE = [
    ("01", "cover",       "Anchor",            "Full-bleed hero. The cover image of the place if it existed tomorrow."),
    ("02", "about",       "What it is",        "One sentence describing the business — what physically happens here, for whom."),
    ("03", "axonometric", "The blueprint",     "30° isometric. Zones, dimensions, palette strip, manifesto."),
    ("04", "view-1",      "View 1 — entrance", "Photo-render of the façade and arrival, grounded by the axonometric."),
    ("05", "view-2",      "View 2 — from the door", "View into the room from the threshold."),
    ("06", "view-3",      "View 3 — back wall","Reverse angle, looking from the far wall back toward the door."),
    ("07", "view-4",      "View 4 — side wall","Perpendicular angle from the right side."),
    ("08", "materials",   "Materials",         "Five materials with where they are used."),
    ("09", "decor",       "Decor",             "Real shelf, corner, detail expressed in those materials."),
    ("10", "ritual",      "The ritual",        "Macro of the central gesture this place is built around."),
    ("11", "crafts",      "The crafts",        "Still life of finished pieces, no people, hand-work visible."),
    ("12", "workspace-a", "Workspace A",       "Working position from the front."),
    ("13", "workspace-b", "Workspace B",       "Working position from the opposite side."),
]


# ---------- helpers ----------

def slugify_folder(name: str) -> tuple[str, str, bool]:
    """Returns (NN, slug, is_good).  '42-paris-candle-atelier' -> ('42','paris-candle-atelier',False)."""
    is_good = name.endswith(" [good]")
    base = name.removesuffix(" [good]")
    m = re.match(r"^(\d+)-(.+)$", base)
    if not m:
        return ("", base, is_good)
    return (m.group(1).zfill(2), m.group(2), is_good)


def url_encode_folder(name: str) -> str:
    return name.replace(" ", "%20").replace("[", "%5B").replace("]", "%5D")


def load_concept(folder: Path) -> dict:
    p = folder / "concept.json"
    if p.exists():
        try:
            return json.loads(p.read_text(encoding="utf-8"))
        except Exception:
            return {}
    return {}


def detect_slides(folder: Path) -> list[Path]:
    return sorted(folder.glob("slide-*.png"))


def detect_format(folder: Path) -> str:
    """Return '25' (classic) or '13' (story)."""
    slides = detect_slides(folder)
    n = len(slides)
    if n >= 20:
        return "25"
    if n >= 10:
        return "13"
    return "25"  # fallback


def palette_chips(palette: list) -> str:
    """Render palette as inline hex chips."""
    if not palette:
        return ""
    chips = []
    for c in palette:
        if isinstance(c, dict):
            hex_val = c.get("hex") or c.get("color") or ""
            label = c.get("name") or hex_val
        elif isinstance(c, str):
            # if it's a hex code or a palette name like "ivory-wax"
            if re.match(r"^#?[0-9A-Fa-f]{3,8}$", c):
                hex_val = c if c.startswith("#") else f"#{c}"
                label = hex_val
            else:
                hex_val = "#E8E2D5"  # neutral fallback for named tokens
                label = c
        else:
            continue
        chips.append(
            f'<li><span class="chip" style="background:{escape(hex_val)}"></span>'
            f'<span class="chip-label">{escape(str(label))}</span></li>'
        )
    return f'<ul class="chips">{"".join(chips)}</ul>'


def render_meta(concept: dict) -> str:
    if not concept:
        return ""
    blocks = []

    palette = concept.get("palette") or []
    if palette:
        blocks.append(f"""
        <article class="meta-block">
          <h3>Palette</h3>
          {palette_chips(palette)}
        </article>""")

    equipment = concept.get("equipment") or []
    if equipment:
        items = "".join(f"<li>{escape(str(e))}</li>" for e in equipment)
        blocks.append(f"""
        <article class="meta-block">
          <h3>Equipment</h3>
          <ul class="bullets">{items}</ul>
        </article>""")

    rituals = concept.get("rituals") or concept.get("ritual")
    if rituals:
        blocks.append(f"""
        <article class="meta-block">
          <h3>Ritual</h3>
          <p class="prose">{escape(str(rituals))}</p>
        </article>""")

    materials = concept.get("materials")
    if materials:
        blocks.append(f"""
        <article class="meta-block">
          <h3>Materials</h3>
          <p class="prose">{escape(str(materials))}</p>
        </article>""")

    audience = concept.get("audience") or []
    if audience:
        items = "".join(f"<li>{escape(str(a))}</li>" for a in audience)
        blocks.append(f"""
        <article class="meta-block">
          <h3>Audience</h3>
          <ul class="bullets">{items}</ul>
        </article>""")

    econ = concept.get("economics") or {}
    if econ:
        rows = []
        labels = {
            "rent_month_eur":     "Rent / month",
            "revenue_month_eur":  "Revenue / month",
            "cogs_percent":       "COGS",
            "margin_percent":     "Margin",
            "break_even_month":   "Break-even",
            "capex_eur":          "Open it for",
        }
        for key, label in labels.items():
            if key not in econ:
                continue
            val = econ[key]
            if "eur" in key:
                disp = f"€{int(val):,}".replace(",", " ")
            elif "percent" in key:
                disp = f"{val}%"
            elif "month" in key:
                disp = f"{val} mo"
            else:
                disp = str(val)
            rows.append(f'<dt>{label}</dt><dd>{escape(disp)}</dd>')
        if rows:
            blocks.append(f"""
        <article class="meta-block meta-econ">
          <h3>Numbers</h3>
          <dl>{"".join(rows)}</dl>
          <p class="footnote">EU-averaged ranges. Inspiration, not a guarantee.</p>
        </article>""")

    unique = concept.get("unique")
    if unique:
        blocks.append(f"""
        <article class="meta-block meta-wide">
          <h3>What makes it unique</h3>
          <p class="prose lead">{escape(str(unique))}</p>
        </article>""")

    return "<div class=\"meta-grid\">\n" + "\n".join(blocks) + "\n</div>"


def render_story_section(slides: list[Path], folder_name: str, fmt: str) -> str:
    narrative = STORY_NARRATIVE if fmt == "13" else SLIDE_NARRATIVE
    rendered = []
    for idx, slide_path in enumerate(slides):
        # match by slide number prefix
        m = re.match(r"slide-(\d+)", slide_path.name)
        if not m:
            continue
        n = m.group(1).zfill(2)
        meta = next((s for s in narrative if s[0] == n), None)
        title  = meta[2] if meta else f"Frame {n}"
        body   = meta[3] if meta else ""
        side   = "left" if idx % 2 == 0 else "right"
        img    = f"{JSDELIVR_PRES_BASE}/{url_encode_folder(folder_name)}/{slide_path.name}"
        n_total = len(slides)
        rendered.append(f"""
      <section class="slide-row slide-row--{side}" id="slide-{n}">
        <figure class="slide-figure">
          <img src="{img}" alt="Slide {n}: {escape(title)}" loading="lazy" />
          <figcaption>{n} / {n_total:02d} · {escape(title)}</figcaption>
        </figure>
        <aside class="slide-note">
          <span class="slide-note-num">{n}</span>
          <h2>{escape(title)}</h2>
          <p>{escape(body)}</p>
        </aside>
      </section>""")
    return "\n".join(rendered)


def build_html(folder: Path) -> str:
    folder_name = folder.name
    nn, slug, is_good = slugify_folder(folder_name)
    concept = load_concept(folder)
    fmt = detect_format(folder)
    slides = detect_slides(folder)

    name = concept.get("name") or slug.upper().replace("-", " ")
    display = f"{nn} · {name}" if nn else name
    tagline = concept.get("tagline") or concept.get("signature_scent") or ""
    city    = concept.get("city") or ""
    country = concept.get("country") or ""
    size_m2 = concept.get("size_m2")
    weeks   = concept.get("weeks")

    cover = next((p for p in slides if "slide-01" in p.name), None)
    cover_url = (
        f"{JSDELIVR_PRES_BASE}/{url_encode_folder(folder_name)}/{cover.name}" if cover else ""
    )

    # search for PDF deck if present
    pdf = next(folder.glob("*_deck.pdf"), None) or next(folder.glob("*deck*.pdf"), None)
    pdf_url = (
        f"{JSDELIVR_PRES_BASE}/{url_encode_folder(folder_name)}/{pdf.name}" if pdf else ""
    )

    meta_section = render_meta(concept)
    story_section = render_story_section(slides, folder_name, fmt)

    facts = []
    if city:
        facts.append(escape(f"{city}{', ' + country if country else ''}"))
    if size_m2:
        facts.append(f"{size_m2} m²")
    if weeks:
        facts.append(f"{weeks} weeks")
    facts_line = " · ".join(facts)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
  <title>{escape(display)} — micro.svita</title>
  <meta name="description" content="{escape(display)} — {escape(tagline)}">
  <link rel="canonical" href="https://micro.svita.ai/presentations/{url_encode_folder(folder_name)}/">
  <meta property="og:title" content="{escape(display)}">
  <meta property="og:description" content="{escape(tagline)}">
  <meta property="og:image" content="https://micro.svita.ai{cover_url}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@300;400;500;600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    :root{{
      --ink:#1a1612;
      --paper:#f6f1e7;
      --paper-2:#ede4d2;
      --rule:#1a1612;
      --accent:#6b1a2b;
      --serif:'Fraunces',Georgia,serif;
      --sans:'Inter',system-ui,sans-serif;
    }}
    *{{box-sizing:border-box;margin:0;padding:0}}
    html,body{{background:var(--paper);color:var(--ink);font-family:var(--sans);line-height:1.55;-webkit-font-smoothing:antialiased}}
    img{{display:block;max-width:100%;height:auto}}
    a{{color:inherit}}
    .topbar{{
      position:sticky;top:0;z-index:50;display:flex;align-items:center;justify-content:space-between;
      padding:14px 28px;border-bottom:1px solid color-mix(in srgb,var(--ink) 12%,transparent);
      background:color-mix(in srgb,var(--paper) 92%,transparent);backdrop-filter:blur(10px);
    }}
    .brand{{font-family:var(--serif);font-weight:300;font-size:18px;letter-spacing:.02em}}
    .brand b{{font-weight:500}}
    .topbar-actions{{display:flex;gap:18px;align-items:center;font-size:13px;letter-spacing:.04em}}
    .topbar-actions a{{text-decoration:none;color:var(--ink);opacity:.75;transition:opacity .2s}}
    .topbar-actions a:hover{{opacity:1}}
    .pill{{padding:7px 14px;border:1px solid var(--ink);border-radius:999px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;color:var(--ink);transition:background .2s,color .2s}}
    .pill:hover{{background:var(--ink);color:var(--paper)}}

    .hero{{
      position:relative;min-height:78vh;display:grid;place-items:end;padding:48px 28px;
      background-image:url('{cover_url}');
      background-size:cover;background-position:center;color:#f6f1e7;
    }}
    .hero::before{{content:'';position:absolute;inset:0;background:linear-gradient(180deg,transparent 30%,rgba(0,0,0,.6))}}
    .hero-inner{{position:relative;max-width:1200px;width:100%}}
    .hero-eyebrow{{font-family:var(--serif);font-weight:300;font-size:14px;letter-spacing:.18em;text-transform:uppercase;opacity:.85;margin-bottom:14px}}
    .hero h1{{font-family:var(--serif);font-weight:400;font-size:clamp(40px,7vw,96px);line-height:1.02;letter-spacing:-.02em;margin-bottom:18px}}
    .hero-tag{{font-family:var(--serif);font-weight:300;font-style:italic;font-size:clamp(16px,1.6vw,22px);max-width:640px;opacity:.9}}
    .hero-facts{{margin-top:24px;font-size:13px;letter-spacing:.18em;text-transform:uppercase;opacity:.85}}

    .pretext{{padding:64px 28px 24px;max-width:880px;margin:0 auto;text-align:center}}
    .pretext h2{{font-family:var(--serif);font-weight:400;font-size:clamp(22px,2.4vw,30px);line-height:1.4;color:var(--ink)}}
    .pretext .small{{margin-top:14px;font-size:13px;letter-spacing:.06em;opacity:.6}}

    .story{{max-width:1240px;margin:0 auto;padding:32px 28px 80px}}
    .slide-row{{display:grid;gap:40px;align-items:center;margin:64px 0;grid-template-columns:1fr 1fr}}
    .slide-row--right .slide-figure{{order:2}}
    .slide-row--right .slide-note{{order:1}}
    .slide-figure{{margin:0}}
    .slide-figure img{{width:100%;border-radius:2px;box-shadow:0 24px 60px -30px rgba(0,0,0,.35)}}
    .slide-figure figcaption{{margin-top:12px;font-family:var(--serif);font-weight:300;font-size:12px;letter-spacing:.16em;text-transform:uppercase;opacity:.55}}
    .slide-note{{padding:8px 0}}
    .slide-note-num{{display:inline-block;font-family:var(--serif);font-weight:300;font-size:12px;letter-spacing:.18em;opacity:.5;margin-bottom:14px}}
    .slide-note h2{{font-family:var(--serif);font-weight:400;font-size:clamp(26px,3vw,38px);line-height:1.15;letter-spacing:-.01em;margin-bottom:16px}}
    .slide-note p{{font-size:16.5px;line-height:1.7;max-width:46ch;color:color-mix(in srgb,var(--ink) 88%,transparent)}}

    .meta-section{{background:var(--paper-2);padding:80px 28px;border-top:1px solid color-mix(in srgb,var(--ink) 12%,transparent)}}
    .meta-section h2.section-title{{max-width:1240px;margin:0 auto 36px;font-family:var(--serif);font-weight:300;font-size:clamp(28px,3.4vw,42px);letter-spacing:-.01em}}
    .meta-grid{{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(2,1fr);gap:36px}}
    .meta-block{{padding:30px;background:var(--paper);border:1px solid color-mix(in srgb,var(--ink) 14%,transparent)}}
    .meta-wide{{grid-column:1/-1}}
    .meta-block h3{{font-family:var(--serif);font-weight:400;font-size:14px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:18px;opacity:.65}}
    .prose{{font-size:16px;line-height:1.75;color:color-mix(in srgb,var(--ink) 88%,transparent)}}
    .lead{{font-family:var(--serif);font-weight:300;font-size:clamp(20px,2vw,26px);line-height:1.45;letter-spacing:-.005em}}
    .bullets{{list-style:none;display:flex;flex-direction:column;gap:8px}}
    .bullets li{{padding-left:18px;position:relative;font-size:15px;line-height:1.55}}
    .bullets li::before{{content:'·';position:absolute;left:4px;top:-3px;font-size:22px;opacity:.6}}
    .chips{{list-style:none;display:flex;flex-wrap:wrap;gap:14px}}
    .chips li{{display:flex;align-items:center;gap:10px;font-size:13px;letter-spacing:.04em}}
    .chip{{display:inline-block;width:22px;height:22px;border-radius:50%;border:1px solid color-mix(in srgb,var(--ink) 20%,transparent)}}
    .meta-econ dl{{display:grid;grid-template-columns:1fr auto;column-gap:20px;row-gap:10px;font-variant-numeric:tabular-nums}}
    .meta-econ dt{{font-size:14px;opacity:.7}}
    .meta-econ dd{{font-family:var(--serif);font-weight:400;font-size:18px;text-align:right}}
    .footnote{{margin-top:18px;font-size:11.5px;letter-spacing:.06em;opacity:.55}}

    .cta{{padding:96px 28px;text-align:center;background:var(--ink);color:var(--paper);position:relative}}
    .cta-eyebrow{{font-family:var(--serif);font-weight:300;font-size:13px;letter-spacing:.2em;text-transform:uppercase;opacity:.6}}
    .cta h2{{font-family:var(--serif);font-weight:300;font-size:clamp(34px,5vw,68px);line-height:1.05;letter-spacing:-.02em;margin:18px auto 14px;max-width:840px}}
    .cta h2 b{{font-weight:500}}
    .cta p{{font-family:var(--serif);font-weight:300;font-style:italic;font-size:18px;opacity:.75;margin-bottom:36px}}
    .cta-row{{display:flex;gap:14px;justify-content:center;flex-wrap:wrap}}
    .btn{{display:inline-block;padding:16px 28px;border:1px solid var(--paper);text-decoration:none;color:var(--paper);font-size:13px;letter-spacing:.16em;text-transform:uppercase;transition:background .2s,color .2s}}
    .btn:hover{{background:var(--paper);color:var(--ink)}}
    .btn-primary{{background:var(--paper);color:var(--ink)}}
    .btn-primary:hover{{background:transparent;color:var(--paper)}}
    .cta-small{{margin-top:32px;font-size:12px;letter-spacing:.06em;opacity:.5}}

    /* paywall overlay when not subscribed */
    .paywall{{
      position:fixed;inset:0;z-index:200;display:none;align-items:center;justify-content:center;
      background:color-mix(in srgb,var(--paper) 86%,transparent);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
    }}
    body.gated .paywall{{display:flex}}
    body.gated main.story,
    body.gated .meta-section,
    body.gated .cta{{filter:blur(6px) saturate(.8);pointer-events:none;user-select:none}}
    .paywall-card{{background:var(--paper);border:1px solid color-mix(in srgb,var(--ink) 22%,transparent);max-width:520px;padding:48px 40px;text-align:center;box-shadow:0 30px 80px -30px rgba(0,0,0,.3)}}
    .paywall-card .pw-eyebrow{{font-family:var(--serif);font-weight:300;font-size:12px;letter-spacing:.2em;text-transform:uppercase;opacity:.55}}
    .paywall-card h3{{font-family:var(--serif);font-weight:300;font-size:32px;line-height:1.15;letter-spacing:-.01em;margin:14px 0 10px}}
    .paywall-card p{{font-family:var(--serif);font-weight:300;font-style:italic;font-size:16px;line-height:1.5;opacity:.7;margin-bottom:28px}}
    .paywall-card .pw-row{{display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-bottom:18px}}
    .paywall-card .pw-row a{{display:inline-block;padding:14px 22px;font-size:13px;letter-spacing:.14em;text-transform:uppercase;text-decoration:none;border:1px solid var(--ink)}}
    .paywall-card .pw-primary{{background:var(--ink);color:var(--paper)}}
    .paywall-card .pw-primary:hover{{background:transparent;color:var(--ink)}}
    .paywall-card .pw-secondary:hover{{background:var(--ink);color:var(--paper)}}
    .paywall-card .pw-small{{font-size:12px;letter-spacing:.06em;opacity:.55;line-height:1.6}}
    .paywall-card .pw-small a{{color:var(--ink);border-bottom:1px solid color-mix(in srgb,var(--ink) 35%,transparent);text-decoration:none}}

    footer.colophon{{padding:36px 28px;text-align:center;font-size:12px;letter-spacing:.08em;opacity:.55}}
    footer.colophon a{{text-decoration:none;border-bottom:1px solid color-mix(in srgb,var(--ink) 30%,transparent)}}

    @media (max-width:780px){{
      .slide-row{{grid-template-columns:1fr;gap:18px;margin:36px 0}}
      .slide-row--right .slide-figure{{order:0}}
      .slide-row--right .slide-note{{order:1}}
      .meta-grid{{grid-template-columns:1fr}}
      .topbar{{padding:12px 18px}}
      .topbar-actions{{gap:10px}}
      .topbar-actions a:not(.pill){{display:none}}
      .hero{{padding:32px 20px;min-height:64vh}}
    }}
  </style>
</head>
<body>
  <header class="topbar">
    <a class="brand" href="/"><b>micro.svita</b> · library</a>
    <nav class="topbar-actions">
      <a href="/shop.html">All concepts</a>
      <a href="/account.html">My library</a>
      <a class="pill" href="/account.html?subscribe=1">Subscribe</a>
    </nav>
  </header>

  <section class="hero" role="banner">
    <div class="hero-inner">
      <div class="hero-eyebrow">{escape(display.split(' · ')[0]) if ' · ' in display else 'micro.svita'}</div>
      <h1>{escape(display.split(' · ',1)[1] if ' · ' in display else display)}</h1>
      {f'<div class="hero-tag">{escape(tagline)}</div>' if tagline else ''}
      {f'<div class="hero-facts">{facts_line}</div>' if facts_line else ''}
    </div>
  </section>

  <section class="pretext">
    <h2>Read the place like a magazine. Twenty-five frames, each annotated — what is shown, why it matters, what to copy.</h2>
    <p class="small">Scroll, don’t skim. Each frame is a decision waiting to be made.</p>
  </section>

  <main class="story">
    {story_section}
  </main>

  {('<section class="meta-section"><h2 class="section-title">The brief, in detail.</h2>' + meta_section + '</section>') if meta_section else ''}

  <section class="cta">
    <div class="cta-eyebrow">{escape(display)}</div>
    <h2>Open it, or open the whole library.</h2>
    <p>One subscription · every concept · every update.</p>
    <div class="cta-row">
      <a class="btn btn-primary" href="/account.html?subscribe=1">Subscribe — $19/mo</a>
      <a class="btn" href="/account.html?subscribe=1&plan=yearly">$149 / year</a>
      {f'<a class="btn" href="{pdf_url}" download>Download PDF</a>' if pdf_url else ''}
    </div>
    <div class="cta-small">7-day trial · cancel anytime · taxes added at checkout where applicable · access keeps the whole library, not one concept.</div>
  </section>

  <div class="paywall" aria-hidden="true">
    <div class="paywall-card">
      <div class="pw-eyebrow">{escape(display)}</div>
      <h3>Open the whole library.</h3>
      <p>One subscription unlocks every concept page — including this one. No per-concept paywalls.</p>
      <div class="pw-row">
        <a class="pw-primary" href="/account.html?subscribe=1">$19 / month</a>
        <a class="pw-secondary" href="/account.html?subscribe=1&plan=yearly">$149 / year</a>
      </div>
      <div class="pw-small">7-day free trial · cancel anytime · taxes added at checkout · already a member? <a href="/account.html">Sign in →</a></div>
    </div>
  </div>

  <footer class="colophon">
    <a href="/">micro.svita</a> · concept library · 2026
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script>
  (async () => {{
    const SB_URL = 'https://ctdleobjnzniqkqomlrq.supabase.co';
    const SB_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0ZGxlb2JqbnpuaXFrcW9tbHJxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzE4MTEsImV4cCI6MjA4NzgwNzgxMX0.AMHtY7zGPemKYCxMy2bqRTOEAp8trA_Slor9wmg7C38';
    if (!window.supabase) {{ document.body.classList.add('gated'); return; }}
    const sb = window.supabase.createClient(SB_URL, SB_ANON, {{ auth: {{ persistSession: true, storageKey: 'svita-micro-auth' }} }});
    try {{
      const {{ data: {{ session }} }} = await sb.auth.getSession();
      if (!session) {{ document.body.classList.add('gated'); return; }}
      const {{ data, error }} = await sb.rpc('has_library_access', {{ p_user_id: session.user.id }});
      if (error || data !== true) {{ document.body.classList.add('gated'); return; }}
    }} catch (e) {{ document.body.classList.add('gated'); }}
  }})();
  </script>
</body>
</html>
"""


def build_one(folder: Path) -> bool:
    if not folder.is_dir() or folder.name.startswith("_"):
        return False
    slides = detect_slides(folder)
    if not slides:
        return False
    html = build_html(folder)
    out = folder / "index.html"
    out.write_text(html, encoding="utf-8")
    return True


def emit_routes() -> None:
    """Write data/library_routes.json mapping slug -> folder name."""
    routes = {}
    for d in sorted(PRES.iterdir()):
        if not d.is_dir() or d.name.startswith("_"):
            continue
        nn, slug, _ = slugify_folder(d.name)
        if not slug or not (d / "index.html").exists():
            continue
        routes[slug] = {"folder": d.name, "nn": nn}
    out = ROOT / "data" / "library_routes.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(
        json.dumps(routes, ensure_ascii=False, indent=2, sort_keys=True),
        encoding="utf-8",
    )
    print(f"\nrouted slugs: {len(routes)} -> {out.relative_to(ROOT)}")


def main():
    args = sys.argv[1:]
    if args:
        targets = []
        for a in args:
            # accept both "42-paris-candle-atelier" and the [good] form
            for cand in [PRES / a, PRES / f"{a} [good]"]:
                if cand.exists():
                    targets.append(cand)
                    break
            else:
                # fuzzy: starts with arg
                for d in sorted(PRES.iterdir()):
                    if d.is_dir() and (d.name == a or d.name.startswith(a)):
                        targets.append(d)
                        break
    else:
        targets = [d for d in sorted(PRES.iterdir()) if d.is_dir() and not d.name.startswith("_")]

    ok = 0
    skipped = 0
    for d in targets:
        if build_one(d):
            print(f"✓ {d.name}/index.html")
            ok += 1
        else:
            print(f"– skipped {d.name}")
            skipped += 1
    print(f"\nDone. built={ok} skipped={skipped}")
    emit_routes()


if __name__ == "__main__":
    main()
