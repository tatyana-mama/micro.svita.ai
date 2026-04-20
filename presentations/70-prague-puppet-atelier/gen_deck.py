#!/usr/bin/env python3
"""LOUTKA — Prague Puppet Atelier — 25-slide deck generator (Nano Banana / Vertex)."""
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).parent
VERTEX = "/Users/labs67prot101/labs67/shared/bin/vertex-nano-banana.py"

# palette brief reused across slides for consistency
PALETTE = (
    "palette: deep burgundy wine #5C1A1B, antique brass #A8803A, ivory linen #EBE2CE, "
    "aged oak #6B4A2B, faded sage wallpaper #8C9A7E, soot grey #2A2520"
)
CITY = "old Malá Strana, Prague, Czechia — cobblestones, baroque plaster, candle-lit"
BRAND = "LOUTKA Atelier · Prague marionette micro-atelier · 14 m²"
CRAFT = (
    "traditional Czech marionette-making: carved lime-wood puppets, painted faces, "
    "strings and control-crosses, hand-stitched costumes, tiny tools, Bohemian folk feel"
)
STYLE = (
    "editorial magazine photograph, Kinfolk / Apartamento aesthetic, soft natural window "
    "light, shallow depth of field, film grain, 1.4–1.6 MB detail, highly detailed, "
    "photorealistic, premium craft mood, no stock smiles, no logos"
)

PAGE_MARK = 'small thin serif page mark in the top-right corner reading "{n:02d} / 25"'
COVER_MARK = PAGE_MARK  # same style


def p(n, theme, body):
    return (
        f"{body}\n\n"
        f"Top-left small serif label: 'LOUTKA'.\n"
        f"{PAGE_MARK.format(n=n)}.\n"
        f"Bottom-left micro caption in tiny serif: '{theme}'.\n"
        f"Consistent {PALETTE}.\n"
        f"{STYLE}. Aspect 3:4 vertical magazine page."
    )


SLIDES = [
    # ——— I · OPEN (1–3) ———
    (
        1, "cover",
        p(
            1,
            "COVER · PUPPET MICRO-ATELIER · MALÁ STRANA · 14 m²",
            "FULL-BLEED COVER photograph: a Czech master puppet-maker's weathered "
            "hands HOLDING a wooden T-shaped marionette control-cross (a simple "
            "handle with two horizontal cross-bars) in the upper portion of the "
            "frame; four thin strings descend cleanly from this wooden cross down "
            "to a small hand-carved lime-wood harlequin marionette in red-and-"
            "ivory diamond costume, suspended at mid-frame. NO CEILING LAMP, NO "
            "HANGING LIGHT, NO PENDANT in frame. Warm amber side light from a "
            "leaded window on the left, faded sage wallpaper behind, dark oak "
            f"workbench with wood shavings in the foreground. {CITY}. Title "
            "'LOUTKA' overlay top-left in large thin serif, sub-line tiny caps "
            "'MARIONETTE MICRO-ATELIER / MALÁ STRANA / 14 m²'."
        ),
    ),
    (
        2, "definition",
        p(
            2,
            "DEFINITION / LOUTKA ATELIER, PRAGUE",
            "Vertical editorial page. Right side: close macro photograph of a single "
            "freshly carved marionette face — eyes half-painted, lime-wood pale, one "
            "brass hook on the forehead — warm rim-light. Left side: a single large "
            "thin-serif statement in dark wine ink: 'A 14 m² puppet atelier with one "
            "carving bench, one painting table, and a window full of hanging "
            "marionettes.' Below in tiny caps: 'DEFINITION / LOUTKA ATELIER, PRAGUE'."
        ),
    ),
    (
        3, "axonometric",
        p(
            3,
            "PLAN / 14 m² · BENCH · PAINT TABLE · HANGING WINDOW",
            "Isometric 30° watercolour architectural drawing on cream paper of a tiny "
            "14 m² Prague shop interior: a wooden carving bench with vise on the left "
            "wall, a painting table with jars and brushes on the right, a tall leaded "
            "window facing the cobblestone street with a horizontal rod from which "
            "small marionettes hang, a narrow tool wall with gouges, chisels, files, "
            "a small cast-iron stove in the corner, wooden plank floor. Thin hand-drawn "
            "labels in tiny serif: CARVING BENCH, PAINT TABLE, HANGING ROD, TOOL WALL, "
            "STOVE, WINDOW. Subtle burgundy and brass watercolour washes."
        ),
    ),
    # ——— II · EXPERIENCE (4–9) ———
    (
        4, "facade",
        p(
            4,
            "FACADE / MALÁ STRANA STREET, DUSK",
            f"Exterior twilight photo of a narrow Prague {CITY} shop front: "
            "baroque mustard plaster wall, a single tall black-framed window with "
            "leaded glass panes, inside glowing amber lamplight, a row of small "
            "marionettes silhouetted hanging in the window. A hand-forged iron sign "
            "bracket outside reading 'LOUTKA' in small serif. Damp cobblestones "
            "reflecting window light. An old bicycle leaning on the wall."
        ),
    ),
    (
        5, "arrival",
        p(
            5,
            "ARRIVAL / PASSERBY AT THE WINDOW",
            "A Czech woman in her 30s in a long wool coat and knitted scarf, pausing "
            "at the LOUTKA window on a dusk cobblestone street, face softly lit by "
            "the amber lamps inside, looking at the dangling marionettes with gentle "
            "wonder. Shallow DoF, natural unposed, no smile. Old plaster wall, brass "
            "sign 'LOUTKA' visible. Cold breath in the air hints at winter."
        ),
    ),
    (
        6, "interior",
        p(
            6,
            "INTERIOR / BENCH, HANGING ROD, TOOLS",
            "Wide interior photograph of the 14 m² atelier at dusk: a dark oak "
            "carving bench in the foreground with half-finished marionettes, a vise, "
            "and chisels, a painted wooden tool wall on the right with gouges neatly "
            "hung, a horizontal wooden rod by the window from which six small "
            "marionettes hang in silhouette against amber lamp glow, worn plank floor, "
            "faded sage-green wallpaper, one warm pendant lamp, candle on the bench."
        ),
    ),
    (
        7, "materials",
        p(
            7,
            "MATERIALS / LIME-WOOD, LINEN, BRASS HOOKS",
            "Close macro photograph: a craftsman's weathered hands holding a small "
            "lime-wood marionette torso, one hand with a gouge carving a delicate "
            "curve, fresh wood shavings spiralling off, a tiny brass control hook "
            "beside it, a strip of hand-dyed linen costume fabric, gentle warm window "
            "light, burgundy apron in the background blur."
        ),
    ),
    (
        8, "ritual",
        p(
            8,
            "RITUAL / FIRST STRINGS, FIRST STEP",
            "A Czech male master puppet-maker, 50s, bearded, in a dark linen shirt "
            "and burgundy apron, standing at the carving bench, carefully attaching "
            "the four strings from a wooden control-cross to a freshly painted "
            "marionette, eyes focused, working lamp warm on his hands, the puppet "
            "half-lifting off the bench — the moment it 'comes alive'. Deep shadows, "
            "editorial portrait mood, no staged smile."
        ),
    ),
    (
        9, "stilllife",
        p(
            9,
            "STILL LIFE / HARLEQUIN, KING, WITCH",
            "A still-life arrangement on a worn oak plank at a leaded window: three "
            "finished marionettes — a small harlequin in red-and-ivory diamond "
            "costume, a tiny Bohemian king with brass crown and burgundy velvet cloak, "
            "a gentle witch with linen dress and sage shawl — each hanging from its "
            "own small wooden control-cross, soft winter window light behind, "
            "cobblestone street blurred outside."
        ),
    ),
    # ——— III · PRODUCT & BRAND (10–14) ———
    (
        10, "equipment",
        p(
            10,
            "EQUIPMENT / GOUGES, VISE, LATHE, PAINT, CLOTH",
            "Top-down flat-lay on a warm oak plank floor, arranged like a tool diagram "
            "with tiny hand-drawn labels in serif: a row of three wood-carving gouges, "
            "a small bench vise, a compact mini wood-lathe, a set of fine sable "
            "brushes, three tiny jars of pigment (burgundy, brass, ivory), a coil of "
            "waxed string, a wooden control-cross, folded scraps of hand-dyed linen. "
            "Labels: GOUGES · VISE · MINI LATHE · BRUSHES · PIGMENTS · STRINGS · "
            "CONTROL-CROSS · LINEN."
        ),
    ),
    (
        11, "services",
        p(
            11,
            "SERVICES / FOUR ENTRY POINTS",
            "Elegant editorial page, cream paper, no table, four services listed "
            "vertically with hairline dividers between each: '— WATCH-A-CARVE · "
            "stop at the window, watch a face being painted · FREE / DROP-IN' · "
            "'— 1-HOUR PUPPET CLASS · paint your own small marionette head · €65' · "
            "'— 3-DAY INTENSIVE · from raw lime-wood block to a finished walking "
            "marionette · €540' · '— COMMISSION · your own character, hand-carved and "
            "costumed · FROM €280'. Top small caps 'SERVICES'. Tiny bottom line in "
            "italic: 'Prices indicative, Prague 2026.'"
        ),
    ),
    (
        12, "welcomekit",
        p(
            12,
            "WELCOME KIT / KRAFT, LINEN, HAND-WRITTEN CARD",
            "Flat-lay on pale plank floor: a small marionette wrapped in kraft paper "
            "and tied with linen twine, a folded natural linen cloth beside it, a "
            "cream letterpress card with calligraphy 'LOUTKA · Malá Strana · "
            "Harlequin, carved 2026 · costumed by Vojtěch', a small wax seal in "
            "burgundy with the letters 'LA'. Warm soft window light."
        ),
    ),
    (
        13, "signage",
        p(
            13,
            "SIGNAGE / HAND-FORGED IRON BRACKET",
            "Close detail photograph of a hand-forged black iron hanging sign "
            "mounted on the mustard baroque plaster wall of the Prague shop. The "
            "iron plate reads 'LOUTKA' in deep engraved serif with a small "
            "sub-line 'Atelier Malá Strana' in brass inlay. Slight rust patina, "
            "reflected amber glow from the shop window on the left edge."
        ),
    ),
    (
        14, "identity",
        p(
            14,
            "IDENTITY / LOGOMARK & PALETTE",
            "Editorial brand board on cream paper, three stacked horizontal panels. "
            "Top panel: the wordmark 'LOUTKA' in tall thin Czech-serif with a tiny "
            "control-cross glyph replacing the 'O'. Middle panel: six colour swatches "
            "side by side labeled in tiny caps: SOOT GREY #2A2520, WINE BURGUNDY "
            "#5C1A1B, ANTIQUE BRASS #A8803A, AGED OAK #6B4A2B, SAGE WALLPAPER "
            "#8C9A7E, IVORY LINEN #EBE2CE. Bottom panel: a close texture shot of "
            "carved lime-wood grain with a single brass hook."
        ),
    ),
    # ——— IV · BUSINESS (15–19) ———
    (
        15, "economics",
        p(
            15,
            "UNIT ECONOMICS",
            "Editorial single-page typography, cream paper. No tables. Four big "
            "pull-quote numbers stacked vertically, separated by thin hairlines:\n"
            "'€ 1 200 · MONTHLY RENT — MALÁ STRANA GROUND-FLOOR'\n"
            "'€ 5 800 · AVERAGE MONTHLY REVENUE'\n"
            "'42 % · GROSS MARGIN'\n"
            "'MONTH 9 · BREAK-EVEN'.\n"
            "Large thin-serif numerals in wine burgundy, captions in tiny caps. "
            "Bottom micro italic: 'EU-average figures, adapt to your city.'"
        ),
    ),
    (
        16, "capex",
        p(
            16,
            "CAPEX / €9 600 TOTAL",
            "One large donut chart filled with textured wood-grain / linen / paint / "
            "brass swatches instead of flat colours, centred on cream paper. Centre "
            "label in thin serif: '€ 9 600 · TOTAL CAPEX'. Four hand-drawn arc "
            "labels with hairlines: 'CARVING TOOLS + LATHE — €3,800 (40%)', "
            "'FIT-OUT (BENCH, FLOOR, LIGHTING) — €3,200 (33%)', 'RAW MATERIALS + "
            "FABRIC + PIGMENT — €1,600 (17%)', 'BRANDING & SIGNAGE — €1,000 (10%)'."
        ),
    ),
    (
        17, "timeline",
        p(
            17,
            "TIMELINE / 6-WEEK LAUNCH",
            "Gantt-like horizontal timeline on cream paper, six columns W1–W6 "
            "across the top in thin serif. Seven task rows with coloured bars in "
            "burgundy, brass, sage, oak: 'LEASE & PERMITS' W1 · 'SHOP FIT-OUT & "
            "FLOOR' W1–W3 · 'BENCH + LATHE + TOOLS' W2–W3 · 'SIGNAGE + BRAND' W3–W4 "
            "· 'MATERIAL STOCK' W3–W4 · 'TEST CARVES + SOFT OPEN WATCH-A-CARVE' "
            "W5 · 'PUBLIC OPENING' W6. Bottom italic: '*Tool calibration is the "
            "critical path.'"
        ),
    ),
    (
        18, "team",
        p(
            18,
            "TEAM / TWO HANDS, ONE BENCH",
            "Two editorial portraits side by side, framed with thin hairline borders. "
            "Left: VOJTĚCH K., a Czech master puppet-maker in his 50s, short grey "
            "beard, dark linen shirt, burgundy apron, standing in the lamp-lit "
            "atelier with a half-finished marionette in hand. Caption: 'VOJTĚCH K. "
            "— MASTER CARVER · 22 years at Prague Puppet Theatre.' Right: TEREZA "
            "M., a young Czech woman in her mid-20s, ivory linen shirt, dark apron, "
            "holding a fine brush and a small painted puppet head. Caption: 'TEREZA "
            "M. — PAINTER & COSTUMIER · fine-arts grad, UMPRUM.'"
        ),
    ),
    (
        19, "after",
        p(
            19,
            "AFTER / HER FIRST MARIONETTE, BY LAMPLIGHT",
            "A Czech woman in her late 20s, unposed, holding a small marionette she "
            "just painted in the 1-hour class — a tiny harlequin hanging from its "
            "wooden control-cross — looking down at it with a quiet proud smile. "
            "Lamp glow on her face, the atelier blurred behind her, hanging puppets "
            "as soft bokeh circles."
        ),
    ),
    # ——— V · WHY & HOW (20–25) ———
    (
        20, "personas",
        p(
            20,
            "PERSONAS / THREE VISITORS",
            "Editorial page, cream paper, no table, three persona blocks separated "
            "by hairlines, each with a small coloured dot on the left:\n"
            "burgundy dot — 'KATEŘINA — 42 · Theatre director, Prague. Commissions a "
            "set of marionettes for her next Bohemian fairytale production.'\n"
            "brass dot — 'TOBIAS — 31 · Design traveller, Munich. Stops on a winter "
            "walk through Malá Strana; joins the 1-hour class.'\n"
            "sage dot — 'ELLA — 25 · Fine-arts student, UMPRUM. Books the 3-day "
            "intensive to build a portfolio piece.'"
        ),
    ),
    (
        21, "channels",
        p(
            21,
            "CHANNELS / FOUR WAYS IN",
            "Elegant editorial page on cream paper, title at top in small serif caps "
            "'CHANNELS'. Below, exactly four rows separated by thin hairlines, each "
            "row has a small hand-drawn line-icon on the left and a short clear "
            "caption on the right. Use exactly these four rows in this order:\n\n"
            "Row 1 · camera icon · INSTAGRAM REELS · fifteen-second close-ups of a "
            "gouge shaping a puppet face.\n\n"
            "Row 2 · window icon · MALA STRANA FOOT TRAFFIC · the lamp-lit window "
            "with hanging marionettes turns passersby into walk-ins.\n\n"
            "Row 3 · parcel icon · ETSY · small signed marionettes shipped across "
            "Europe.\n\n"
            "Row 4 · key icon · HOTEL CONCIERGE · boutique hotels Augustine and "
            "Aria gift the one-hour class.\n\n"
            "Clean sharp typography, no duplicated rows, no gibberish text, no "
            "extra rows."
        ),
    ),
    (
        22, "risks",
        p(
            22,
            "RISKS / THREE, WITH MITIGATIONS",
            "Elegant editorial page on cream paper, title at top in small serif "
            "caps 'RISKS'. Below, exactly three risk blocks stacked vertically, "
            "separated by thin hairlines. Use exactly these three risks in this "
            "order — the numbers must read 01, 02, 03 with no repeats:\n\n"
            "RISK 01 · LIME-WOOD SUPPLY · partner directly with a Bohemian "
            "forestry co-op and maintain a six-month kiln-dried reserve.\n\n"
            "RISK 02 · TOURIST SEASONALITY · winter is the peak (window theatre); "
            "summer shifts to three-day intensives and Etsy commissions.\n\n"
            "RISK 03 · IP AND KNOCK-OFFS · every marionette is hand-numbered, "
            "wax-sealed, and registered under the LOUTKA studio mark.\n\n"
            "Clean sharp typography, exactly three blocks, numbers strictly 01, "
            "02, 03, no duplicates."
        ),
    ),
    (
        23, "whynow",
        p(
            23,
            "MANIFESTO / WHY NOW",
            "Full-bleed dark atmospheric photograph of a single lime-wood marionette "
            "hanging from a wooden control-cross in the soft amber glow of the "
            "atelier lamp, rest of frame in deep shadow. Centred white thin-serif "
            "text reading: 'WHY NOW. Cities are rediscovering slow craft. Prague "
            "has the theatre tradition, the tourists, and streets lit for theatre "
            "after dusk. LOUTKA turns 14 square metres into a nightly performance — "
            "and a place where anyone can learn to carve, paint, and pull the "
            "strings of a character of their own.'"
        ),
    ),
    (
        24, "package",
        p(
            24,
            "PACKAGE / SIX DELIVERABLES",
            "Flat-lay on a pale oak desk: six printed items arranged like a design "
            "package — a cream 'BRANDBOOK' booklet, a folded 'P&L · 24 MONTHS' sheet, "
            "a blue-tinted 'FLOORPLAN · 14 m²' blueprint, a small 'EQUIPMENT LIST' "
            "card (Carving bench, Mini lathe, Paint table, Tool wall, Hanging rod, "
            "Handbook, Storage, Risk), a '6-WEEK PLAN' sheet with coloured bars in "
            "wine and brass, and a small 'DAY-1 CHECKLIST' card. Soft natural light."
        ),
    ),
    (
        25, "cta",
        p(
            25,
            "CLAIM / micro.svita.ai · prague-puppet-atelier",
            "Editorial final page, cream paper. Large centred thin-serif statement: "
            "'CLAIM THIS CONCEPT.' Below, tiny caps: 'micro.svita.ai / "
            "prague-puppet-atelier'. Under that, three small price tiers stacked "
            "horizontally with hairlines between: 'BASIC — €79 · brandbook PDF' | "
            "'AI-TUNED — €119 · brandbook + P&L + site-adapt' | 'EXCLUSIVE — €239 · "
            "full package + one-year support'. Bottom: a square QR code placeholder "
            "with caption 'SCAN · view.html?c=prague-puppet-atelier'. Footer "
            "micro-line: 'LOUTKA · a micro.svita concept'."
        ),
    ),
]


def main() -> None:
    assert len(SLIDES) == 25, f"expected 25 slides, got {len(SLIDES)}"
    # Nano banana supports 3:4 vertical, matches BLAS deck format
    aspect = "3:4"
    only = sys.argv[1:]  # optional list of slide numbers to regenerate
    wanted = {int(x) for x in only} if only else None
    for n, theme, prompt in SLIDES:
        if wanted and n not in wanted:
            continue
        out = HERE / f"slide-{n:02d}-{theme}.png"
        if out.exists() and not wanted:
            print(f"skip {out.name} (exists)")
            continue
        print(f"→ slide {n:02d} · {theme}")
        for attempt in (1, 2, 3):
            try:
                subprocess.run(
                    ["python3", VERTEX, prompt, "-o", str(out), "-a", aspect],
                    check=True,
                )
                break
            except subprocess.CalledProcessError as exc:
                print(f"   ! attempt {attempt} failed: {exc}", file=sys.stderr)
                if attempt == 3:
                    raise
                time.sleep(3 * attempt)
        time.sleep(1)


if __name__ == "__main__":
    main()
