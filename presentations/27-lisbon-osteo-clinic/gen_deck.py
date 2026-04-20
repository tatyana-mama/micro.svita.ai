#!/usr/bin/env python3
"""OSTEO 1 · Lisbon Single-Room Osteopathy — 25-slide deck (Nano Banana / Vertex)."""
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).parent
VERTEX = "/Users/labs67prot101/labs67/shared/bin/vertex-nano-banana.py"

PALETTE = (
    "palette: lime-wash white #F2EEE5, azulejo blue #3E5C7E, warm oak #A87A4E, "
    "terracotta tile #C97A5A, eucalyptus sage #8AA38F, ink charcoal #232122"
)
CITY = (
    "Alfama / Principe Real, Lisbon — narrow cobbled street, pastel pink and "
    "ochre facades, azulejo tile details, clear Atlantic morning light"
)
BRAND_NAME = "OSTEO 1"
BRAND_TAG = "LISBON · SINGLE-ROOM OSTEOPATHY · 14 m²"
STYLE = (
    "editorial magazine photograph, Kinfolk / Cereal aesthetic, soft clinical "
    "Portuguese light, shallow depth of field, film grain, 1.4–1.8 MB detail, "
    "highly detailed, photorealistic, premium minimalist clinical calm mood, "
    "no stock smiles, no foreign logos, no trademark brands, no gibberish text, "
    "no duplicated rows, clean typography, confident composition"
)


def p(n: int, theme: str, body: str) -> str:
    return (
        f"{body}\n\n"
        f"Top-left small thin serif label reading exactly: '{BRAND_NAME}'.\n"
        f"Top-right small thin serif page mark reading exactly: "
        f"'{n:02d} / 25' (two digits, slash, 25).\n"
        f"Bottom-left tiny serif caption reading exactly: '{theme}'.\n"
        f"Consistent {PALETTE}.\n"
        f"{STYLE}. Aspect 3:4 vertical magazine page."
    )


SLIDES = [
    (
        1,
        "COVER · OSTEOPATHY MICRO-CLINIC · LISBON · 14 m²",
        "FULL-BLEED COVER photograph: an osteopath's hands placed on the upper "
        "back of a patient lying face-down on a wooden treatment table with a "
        "natural linen sheet, the therapist wearing a soft sage linen uniform, "
        "warm side light from a tall window with blue-and-white azulejo tiles "
        f"on the wall behind. {CITY}. Overlay large thin-serif title "
        f"'{BRAND_NAME}' top-left in ink charcoal, sub-line in tiny caps "
        f"'{BRAND_TAG}'.",
    ),
    (
        2,
        "DEFINITION / OSTEO 1, LISBON",
        "Vertical editorial page, cream paper. Right half: close macro photo "
        "of a single azulejo tile (cobalt on white floral pattern) in soft "
        "daylight, one warm hand resting gently on it. Left half: one large "
        "thin-serif statement in ink charcoal, consisting of FOUR very short "
        "sentences, each on its own line, written in simple English with NO "
        "typos and NO invented words. Use these EXACT four lines:\n\n"
        "'14 m² clinic.'\n"
        "'One table.'\n"
        "'One window.'\n"
        "'45 quiet minutes.'\n\n"
        "Nothing else in the text block. Below in tiny serif caps at the "
        "bottom: 'DEFINITION · OSTEO 1 · LISBON'.",
    ),
    (
        3,
        "PLAN / 14 m² · TABLE · CABINET · WASH",
        "Isometric 30° watercolour architectural drawing on cream paper of a "
        "14 m² Lisbon single-room clinic: a padded osteopathic treatment table "
        "centred in the room, a slim oak cabinet along the left wall with a "
        "small stack of folded linen sheets, a tall arched window on the back "
        "wall with azulejo tile frame, a small porcelain sink by the door, a "
        "linen-upholstered chair for the patient to undress by, a simple coat "
        "hook, terracotta tile floor. Thin hand-drawn labels in tiny serif: "
        "TREATMENT TABLE, OAK CABINET, WINDOW, SINK, CHAIR, COAT HOOK. Subtle "
        "azulejo-blue and terracotta watercolour washes. No duplicate labels.",
    ),
    (
        4,
        "FACADE / ALFAMA STREET, MORNING",
        f"Exterior morning photo of a Lisbon shopfront on a {CITY}: a slim "
        "white-framed door with a small cast-iron plaque beside it reading "
        f"exactly '{BRAND_NAME}' in simple serif, a tiny window with linen "
        "curtain, pale pink plaster wall, a pot of rosemary on the stone step. "
        "Bright Atlantic morning light, cobblestones damp from early mist, no "
        "cars, no people.",
    ),
    (
        5,
        "ARRIVAL / PATIENT AT THE DOOR",
        "A Portuguese man in his late 40s in a linen shirt and light wool coat, "
        "one hand unconsciously resting on his lower back, arriving at the "
        "OSTEO 1 door in Alfama, soft morning light on his face, unposed, no "
        "staged smile. Cast-iron plaque with brand name visible beside the "
        "door.",
    ),
    (
        6,
        "INTERIOR / TABLE, WINDOW, AZULEJOS",
        "Wide interior photograph of the 14 m² clinic: a simple padded "
        "osteopathic treatment table with natural linen sheet centred in the "
        "room, a tall arched window on the back wall with a narrow panel of "
        "blue-and-white azulejo tiles around its frame, a slim oak cabinet on "
        "the left wall with folded linen, a porcelain sink near the door, "
        "terracotta tile floor, lime-washed walls, a single pendant lamp with a "
        "linen shade, no people, tranquil clean air.",
    ),
    (
        7,
        "MATERIALS / LINEN, OAK, AZULEJO, HAND",
        "Close macro photograph: an osteopath's warm hand resting on a folded "
        "natural linen sheet on an oak edge of the treatment table, a corner of "
        "a blue-and-white azulejo tile visible in the background, soft daylight "
        "from the side. Real skin detail, clean short nails, no gloves, no "
        "watch. The linen weave is clearly visible.",
    ),
    (
        8,
        "RITUAL / CONSULT, PALPATE, RELEASE",
        "A Portuguese osteopath in her mid-30s, short dark hair, in a sage "
        "linen uniform, standing calmly beside the treatment table, her hands "
        "placed symmetrically on a patient's upper back (patient lying face-"
        "down, neutrally covered), soft side light from the arched window, "
        "focused and calm, editorial portrait mood, no staged smile.",
    ),
    (
        9,
        "STILL LIFE / TABLE, LINEN, WATER",
        "A still-life arrangement at the window of the clinic: a neatly folded "
        "natural linen sheet on the end of the treatment table, a small "
        "terracotta glass of water beside it, a single rosemary sprig on the "
        "sill, a warm strip of morning light falling across the scene, no "
        "other objects.",
    ),
    (
        10,
        "EQUIPMENT / TABLE, BOLSTERS, CABINET, SINK",
        "Top-down flat-lay on terracotta tile floor, arranged like a tool "
        "diagram with tiny hand-drawn labels in serif: a padded osteopathic "
        "treatment table (foot-end visible), two linen-covered bolsters, a "
        "stack of four folded natural linen sheets, a slim oak cabinet (door "
        "partly open), a porcelain sink fixture, a small ceramic bowl with a "
        "single cake of olive-oil soap, a linen-upholstered side chair. Labels "
        "each appearing exactly once: TREATMENT TABLE · BOLSTERS · LINEN · OAK "
        "CABINET · SINK · OLIVE SOAP · CHAIR.",
    ),
    (
        11,
        "SERVICES / FOUR ENTRY POINTS",
        "Elegant editorial page on cream paper, title 'SERVICES' in small "
        "serif caps. Exactly FOUR price rows, separated by thin hairlines. "
        "Each row has a left-aligned short label and a right-aligned price. "
        "ONLY four rows — do not repeat any row, do not invent a fifth row. "
        "Use these EXACT labels, each spelled exactly once:\n\n"
        "Row 1 left: 'First visit'         right: '€120'\n"
        "Row 2 left: 'Return visit'        right: '€75'\n"
        "Row 3 left: 'Ten-pack'            right: '€680'\n"
        "Row 4 left: 'House call'          right: '€150'\n\n"
        "Tiny bottom italic: 'Prices indicative, Lisbon 2026.'",
    ),
    (
        12,
        "WELCOME KIT / LINEN, POSTURE CARD",
        "Flat-lay on warm oak desk: a folded sage-green linen towel tied with "
        "kraft twine, a small cream letterpress card with calligraphy reading "
        f"exactly '{BRAND_NAME} · Lisbon · your first session · 2026', a small "
        "printed posture-guide card showing three pictogram exercises for "
        "everyday, a tiny azulejo-blue wax seal. Soft window light.",
    ),
    (
        13,
        "SIGNAGE / AZULEJO PLAQUE",
        "Close detail photograph of a small azulejo-tile plaque mounted beside "
        "a weathered wooden door on a pale pink plaster Lisbon wall. The "
        f"plaque is a hand-painted tile panel of blue on white reading "
        f"'{BRAND_NAME}' in simple serif with a small sub-line 'Osteopatia · "
        "Lisboa'. Gentle reflected morning light from the cobbled street.",
    ),
    (
        14,
        "IDENTITY / WORDMARK & PALETTE",
        "Editorial brand board on cream paper, three stacked horizontal panels. "
        f"Top panel: the wordmark '{BRAND_NAME}' in a tall thin modern serif, "
        "with a tiny geometric glyph of a spine on the right like a signature. "
        "Middle panel: six colour swatches side by side labeled in tiny caps: "
        "LIME-WASH WHITE #F2EEE5, AZULEJO BLUE #3E5C7E, WARM OAK #A87A4E, "
        "TERRACOTTA TILE #C97A5A, EUCALYPTUS SAGE #8AA38F, INK CHARCOAL "
        "#232122. Bottom panel: a close crop of a single azulejo tile.",
    ),
    (
        15,
        "UNIT ECONOMICS",
        "Editorial single page typography, cream paper. No tables. Four big "
        "pull-quote numbers stacked vertically, separated by thin hairlines, "
        "each appearing exactly once:\n\n"
        "€ 1 100 · MONTHLY RENT — LISBON ALFAMA GROUND-FLOOR\n\n"
        "€ 7 400 · AVERAGE MONTHLY REVENUE\n\n"
        "58 % · GROSS MARGIN\n\n"
        "MONTH 10 · BREAK-EVEN\n\n"
        "Large thin-serif numerals in ink charcoal, captions in tiny caps. "
        "Bottom micro italic: 'EU-average figures, adapt to your city.'",
    ),
    (
        16,
        "CAPEX / €13 200 TOTAL",
        "One large donut chart centred on cream paper, segments filled with "
        "textured swatches (linen, oak, azulejo, terracotta). Centre label in "
        "thin serif: '€ 13 200 · TOTAL CAPEX'. Four hand-drawn arc labels with "
        "hairlines, each appearing exactly once:\n"
        "TREATMENT TABLE + BOLSTERS — €3,600 (27%)\n"
        "FIT-OUT (AZULEJO, FLOOR, PLASTER) — €5,400 (41%)\n"
        "CABINET + SINK + LINEN + LIGHT — €3,000 (23%)\n"
        "BRANDING + PLAQUE — €1,200 (9%)",
    ),
    (
        17,
        "TIMELINE / 8-WEEK LAUNCH",
        "Gantt-like horizontal timeline on cream paper, eight columns W1-W8. "
        "Seven task rows with coloured bars in azulejo blue, terracotta, sage, "
        "oak, each task appearing exactly once:\n"
        "LEASE + PERMITS (W1-W2)\n"
        "PLASTER + AZULEJO FIT-OUT (W2-W4)\n"
        "TABLE + CABINET + SINK INSTALL (W3-W5)\n"
        "LIGHTING + LINEN ORDER (W4-W5)\n"
        "AZULEJO PLAQUE + BRAND (W5-W6)\n"
        "INSURANCE + TEST SESSIONS (W6-W7)\n"
        "PUBLIC OPENING (W8)\n"
        "Bottom italic: '*Azulejo fit-out is the critical path.'",
    ),
    (
        18,
        "TEAM / ONE HAND, ONE TABLE",
        "Two editorial portraits side by side, framed with thin hairline "
        "borders. Left: INÊS R., a Portuguese osteopath in her mid-30s, short "
        "dark hair, sage linen uniform, standing by the treatment table. "
        "Caption: 'INÊS R. — OSTEOPATH · Escola Superior de Saúde do Porto, "
        "ten years in manual therapy.' Right: DIOGO M., a young Portuguese "
        "man in his late 20s, linen shirt, holding the clinic's leather "
        "appointment book. Caption: 'DIOGO M. — FRONT DESK · half-time, "
        "Sciences Po exchange student.'",
    ),
    (
        19,
        "AFTER / HER FIRST SESSION",
        "A Portuguese woman in her early 40s sitting on the linen-upholstered "
        "side chair after her first session, slowly putting on her coat, her "
        "shoulders visibly relaxed, soft morning light from the arched window, "
        "half-smile, unposed, no staged beauty shot.",
    ),
    (
        20,
        "PERSONAS / THREE PATIENTS",
        "Editorial page on cream paper, title 'PERSONAS'. Three persona blocks "
        "separated by thin hairlines, each with a small coloured dot on the "
        "left, exactly three rows:\n\n"
        "azulejo-blue dot · RICARDO · 48 · Programmer, Alfama. Comes weekly for "
        "a desk-posture reset.\n\n"
        "terracotta dot · SOFIA · 35 · Mother of twins, Graça. Uses the ten-"
        "pack for monthly recovery sessions.\n\n"
        "sage dot · ANA PAULA · 62 · Retired teacher, Madragoa. Books the "
        "house-call service after her weekly walks.\n\n"
        "Exactly three rows, clean typography, no duplicates.",
    ),
    (
        21,
        "CHANNELS / FOUR WAYS IN",
        "Elegant editorial page on cream paper, title 'CHANNELS' in small "
        "serif caps. Four rows separated by thin hairlines, each with a small "
        "hand-drawn line-icon and a short clean caption. Exactly four rows, "
        "no duplicates, no gibberish text:\n\n"
        "Row 1 · phone icon · WHATSAPP BOOKING · direct-booked sessions, "
        "ninety percent of repeat bookings.\n\n"
        "Row 2 · door icon · NEIGHBOURHOOD REFERRALS · Alfama residents tell "
        "neighbours across the stair.\n\n"
        "Row 3 · calendar icon · CORPORATE DESK-POSTURE · monthly contracts "
        "with three nearby tech offices.\n\n"
        "Row 4 · letter icon · POSTURE NEWSLETTER · a monthly email with two "
        "exercises and one recipe.",
    ),
    (
        22,
        "RISKS / THREE, WITH MITIGATIONS",
        "Elegant editorial page on cream paper, title 'RISKS'. Three risk "
        "blocks stacked with thin hairlines. Numbers must read exactly 01, "
        "02, 03 — no repeats:\n\n"
        "RISK 01 · SINGLE-PRACTITIONER DEPENDENCY · a trusted covering "
        "osteopath contracted as locum for holiday and sick weeks.\n\n"
        "RISK 02 · INSURANCE AND LIABILITY · mandatory professional indemnity, "
        "annual renewal, signed informed-consent on every file.\n\n"
        "RISK 03 · SEASONAL DEMAND · summer tourists replace winter locals; "
        "hotel partnerships bring back-pain travellers.",
    ),
    (
        23,
        "MANIFESTO / WHY NOW",
        "Full-bleed atmospheric photograph: a single pair of warm hands on the "
        "upper back of a patient in a softly lit room, a corner of azulejo "
        "visible on the wall, the rest of the frame in shadow. Centred thin-"
        "serif white text: 'WHY NOW. European cities run on screens and sit-"
        "down work; backs and necks quietly collect the bill. Lisbon is warm "
        "enough for walking, old enough to still believe in hands, and small "
        "enough for a 14 m² room to become someone's weekly reset. OSTEO 1 is "
        "one table, one window, and forty-five minutes that put you back in "
        "your own body.'",
    ),
    (
        24,
        "PACKAGE / SIX DELIVERABLES",
        "Flat-lay on a pale oak desk: six printed items arranged like a design "
        "package — a cream 'BRANDBOOK' booklet with the OSTEO 1 wordmark, a "
        "folded 'P&L · 24 MONTHS' sheet, an azulejo-blue 'FLOORPLAN · 14 m²' "
        "blueprint, a small 'EQUIPMENT LIST' card listing Treatment table / "
        "Bolsters / Cabinet / Sink / Linen / Light / Handbook / Risk, an "
        "'8-WEEK PLAN' sheet with azulejo and terracotta bars, and a small "
        "'DAY-1 CHECKLIST' card. Soft natural light.",
    ),
    (
        25,
        "CLAIM / micro.svita.ai · lisbon-osteo-clinic",
        "Editorial final page, cream paper. Large centred thin-serif statement: "
        "'CLAIM THIS CONCEPT.' Below, tiny caps: 'micro.svita.ai / "
        "lisbon-osteo-clinic'. Three small price tiers stacked horizontally "
        "with hairline dividers, each appearing exactly once: 'BASIC — €79 · "
        "brandbook PDF' | 'AI-TUNED — €119 · brandbook + P&L + site-adapt' | "
        "'EXCLUSIVE — €239 · full package + one-year support'. Bottom: a "
        "square QR-code placeholder with caption 'SCAN · view.html?c=lisbon-"
        f"osteo-clinic'. Footer micro-line: '{BRAND_NAME} · a micro.svita "
        "concept'.",
    ),
]


def slug(theme: str) -> str:
    key = theme.split("/")[0].strip().lower().replace(" ", "")
    mapping = {
        "cover": "cover",
        "definition": "definition",
        "plan": "axonometric",
        "facade": "facade",
        "arrival": "arrival",
        "interior": "interior",
        "materials": "materials",
        "ritual": "ritual",
        "stilllife": "stilllife",
        "equipment": "equipment",
        "services": "services",
        "welcomekit": "welcomekit",
        "signage": "signage",
        "identity": "identity",
        "uniteconomics": "economics",
        "capex": "capex",
        "timeline": "timeline",
        "team": "team",
        "after": "after",
        "personas": "personas",
        "channels": "channels",
        "risks": "risks",
        "manifesto": "whynow",
        "package": "package",
        "claim": "cta",
    }
    return mapping.get(key, key)


def main() -> None:
    assert len(SLIDES) == 25, f"expected 25 slides, got {len(SLIDES)}"
    aspect = "3:4"
    only = sys.argv[1:]
    wanted = {int(x) for x in only} if only else None
    for n, theme, body in SLIDES:
        if wanted and n not in wanted:
            continue
        out = HERE / f"slide-{n:02d}-{slug(theme)}.png"
        if out.exists() and not wanted:
            print(f"skip {out.name}")
            continue
        prompt = p(n, theme, body)
        print(f"→ slide {n:02d} · {theme[:40]}")
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
                time.sleep(10 * attempt)
        time.sleep(1)


if __name__ == "__main__":
    main()
