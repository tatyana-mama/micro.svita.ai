#!/usr/bin/env python3
"""PHYSIO 1 · Amsterdam Single-Room Physio — 25-slide deck (Nano Banana / Vertex)."""
import subprocess
import sys
import time
from pathlib import Path

HERE = Path(__file__).parent
VERTEX = "/Users/labs67prot101/labs67/shared/bin/vertex-nano-banana.py"

PALETTE = (
    "palette: chalk white #ECE7DD, brick red #A14B3C, north sea blue #4A6E7B, "
    "warm oak #B28952, linen oat #D9CDB8, ink graphite #272829"
)
CITY = (
    "Jordaan canal district, Amsterdam — red-brick gable facades, narrow bike-"
    "lined street, cool overcast daylight with sudden patches of sun"
)
BRAND_NAME = "PHYSIO 1"
BRAND_TAG = "AMSTERDAM · SINGLE-ROOM PHYSIO · 14 m²"
STYLE = (
    "editorial magazine photograph, Cereal / Kinfolk / Dwell aesthetic, clean "
    "cool Dutch daylight mixed with warm oak, shallow depth of field, film "
    "grain, 1.4–1.8 MB detail, highly detailed, photorealistic, premium "
    "minimalist clinical rehab mood, no stock smiles, no foreign logos, no "
    "trademark brands, no gibberish text, no duplicated rows, clean typography"
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
        "COVER · PHYSIO MICRO-CLINIC · AMSTERDAM · 14 m²",
        "FULL-BLEED COVER photograph: a physiotherapist's hands guiding a "
        "patient's knee on a padded oak-framed rehab bench with a natural linen "
        "cover, the therapist in a chalk-white linen polo and oak-coloured "
        "trousers, soft cool Dutch daylight from a tall canal-house window "
        "with slender white muntins, brick wall visible behind. "
        f"{CITY}. Overlay large thin-serif title '{BRAND_NAME}' top-left in ink "
        f"graphite, sub-line in tiny caps '{BRAND_TAG}'.",
    ),
    (
        2,
        "DEFINITION / PHYSIO 1, AMSTERDAM",
        "Vertical editorial page. Right half: close macro photograph of a single "
        "resistance band looped around a wooden dowel on an oak bench, soft cool "
        "daylight and a fragment of brick wall in the background. Left half: a "
        "single large thin-serif statement in ink graphite: 'A 14 m² clinic with "
        "one bench, one window, and forty-five minutes to move like yourself "
        "again.' Below in tiny caps: 'DEFINITION / PHYSIO 1 · AMSTERDAM'.",
    ),
    (
        3,
        "PLAN / 14 m² · BENCH · MAT · MIRROR",
        "Isometric 30° watercolour architectural drawing on cream paper of a "
        "14 m² Amsterdam canal-house single-room clinic: a padded oak-framed "
        "rehab bench centred, a large natural rubber floor mat to the left, a "
        "tall narrow mirror on the right wall for gait and posture checks, a "
        "slim oak wall-rail of resistance bands and hooks, a compact oak "
        "cabinet with foam rollers and balance pads, a tall sash window on the "
        "front wall, a porcelain sink near the door, wide oak plank floor. "
        "Thin hand-drawn labels in tiny serif: REHAB BENCH, RUBBER MAT, "
        "MIRROR, BAND RAIL, OAK CABINET, SINK, WINDOW. Subtle brick-red and "
        "north-sea-blue watercolour washes. No duplicate labels.",
    ),
    (
        4,
        "FACADE / JORDAAN CANAL STREET",
        f"Exterior mid-morning photo of a small ground-floor clinic in the "
        f"{CITY}: a simple chalk-white door set into a red-brick gable facade, "
        "a slim cast-iron plate on the brick wall beside the door reading "
        f"exactly '{BRAND_NAME}' in serif, a narrow window with a linen roller "
        "blind half-drawn, a black city bike parked on the railing, canal water "
        "reflecting the sky. Overcast Dutch light with one patch of sun on the "
        "door.",
    ),
    (
        5,
        "ARRIVAL / PATIENT WITH A KNEE BRACE",
        "A Dutch man in his early 30s in a simple wool coat, one knee in a soft "
        "black brace, walking toward the PHYSIO 1 door, his small canvas tote "
        "slung over one shoulder, cool Amsterdam daylight, unposed, no staged "
        "smile. Brick gable wall and cast-iron plaque with the brand name "
        "visible beside the door.",
    ),
    (
        6,
        "INTERIOR / BENCH, MAT, MIRROR",
        "Wide interior photograph of the 14 m² clinic: a padded oak-framed "
        "rehab bench with a natural linen cover in the centre, a large natural "
        "rubber floor mat on the oak plank floor beside it, a tall narrow "
        "full-height mirror on the right wall, a slim oak wall-rail on the "
        "back wall with three resistance bands hanging in order of thickness, "
        "a compact oak cabinet below it with folded towels, a porcelain sink "
        "by the door, a tall sash window with slender muntins letting in cool "
        "daylight, chalk-white walls, exposed red-brick strip along one wall, "
        "no people.",
    ),
    (
        7,
        "MATERIALS / LINEN, OAK, RUBBER, BAND",
        "Close macro photograph: a physiotherapist's hand resting on the oak "
        "frame of the bench next to a folded natural linen cover and a coiled "
        "moss-green resistance band, a sliver of the rubber mat visible on the "
        "floor below, cool daylight from the side. Real skin, short clean "
        "nails, no watch.",
    ),
    (
        8,
        "RITUAL / ASSESS, MOBILISE, STRENGTHEN",
        "A Dutch physiotherapist in his mid-30s in a chalk-white linen polo "
        "and oak-coloured trousers, guiding a patient (seated on the bench, "
        "fully clothed, neutrally composed) through a controlled knee flexion "
        "with one hand under the heel and one over the knee, cool focused "
        "daylight from the sash window, editorial portrait mood, no staged "
        "smile.",
    ),
    (
        9,
        "STILL LIFE / ROLLER, BAND, DOWEL",
        "A still-life arrangement on an oak shelf by the window: a dense foam "
        "roller, a folded moss-green resistance band, a short wooden dowel, a "
        "balance pad in linen oat, all laid out in a clean line with gentle "
        "shadows, cool daylight with one warm highlight catching the edge of "
        "the roller.",
    ),
    (
        10,
        "EQUIPMENT / BENCH, BANDS, MAT, ROLLERS",
        "Top-down flat-lay on warm oak plank floor, arranged like a tool "
        "diagram with tiny hand-drawn labels in serif: the rehab bench (side "
        "profile), three resistance bands in thickness order, a foam roller, "
        "a balance pad, a wooden dowel, a stack of folded linen towels, a "
        "small clock for timing reps. Labels each appearing exactly once: "
        "REHAB BENCH · RESISTANCE BANDS · FOAM ROLLER · BALANCE PAD · DOWEL · "
        "LINEN TOWELS · CLOCK.",
    ),
    (
        11,
        "SERVICES / FOUR ENTRY POINTS",
        "Elegant editorial page on cream paper, title 'SERVICES' in small "
        "serif caps. Four service rows separated by thin hairlines, each "
        "appearing exactly once, label on the left, price on the right:\n\n"
        "ASSESSMENT + FIRST SESSION · sixty-minute movement screen plus "
        "manual therapy · €95\n\n"
        "FOLLOW-UP · forty-five-minute session · €70\n\n"
        "REHAB BLOCK · eight-session recovery programme with home plan · €520\n\n"
        "DESK WORKER CLINIC · ninety-minute back-and-neck reset · €130\n\n"
        "Tiny bottom italic: 'Prices indicative, Amsterdam 2026.'",
    ),
    (
        12,
        "WELCOME KIT / LINEN, HOME-PLAN CARD",
        "Flat-lay on oak desk: a folded chalk-white linen towel tied with "
        "kraft twine, a small cream letterpress card with calligraphy reading "
        f"exactly '{BRAND_NAME} · Amsterdam · your first session · 2026', a "
        "small printed home-exercise card showing three pictogram movements, "
        "a tiny north-sea-blue wax seal, cool soft daylight.",
    ),
    (
        13,
        "SIGNAGE / CAST-IRON BRICK PLAQUE",
        "Close detail photograph of a slim cast-iron plaque mounted on a "
        "weathered red-brick gable wall in the Jordaan. The plaque is ink-"
        f"graphite black with the words '{BRAND_NAME}' engraved and filled in "
        "chalk white, below it a smaller sub-line in serif 'Physiotherapie · "
        "Amsterdam'. Subtle cool reflected daylight from the canal on the "
        "left edge.",
    ),
    (
        14,
        "IDENTITY / WORDMARK & PALETTE",
        "Editorial brand board on cream paper, three stacked horizontal "
        f"panels. Top panel: the wordmark '{BRAND_NAME}' in a tall thin modern "
        "serif, with a small geometric glyph of a knee joint replacing the "
        "'1'. Middle panel: six colour swatches side by side labeled in tiny "
        "caps: CHALK WHITE #ECE7DD, BRICK RED #A14B3C, NORTH SEA BLUE "
        "#4A6E7B, WARM OAK #B28952, LINEN OAT #D9CDB8, INK GRAPHITE #272829. "
        "Bottom panel: a close crop of a red-brick wall with one moss-green "
        "resistance band resting on it.",
    ),
    (
        15,
        "UNIT ECONOMICS",
        "Editorial single page typography, cream paper. No tables. Four big "
        "pull-quote numbers stacked vertically, separated by thin hairlines, "
        "each appearing exactly once:\n\n"
        "€ 1 850 · MONTHLY RENT — AMSTERDAM JORDAAN GROUND-FLOOR\n\n"
        "€ 9 200 · AVERAGE MONTHLY REVENUE\n\n"
        "62 % · GROSS MARGIN\n\n"
        "MONTH 11 · BREAK-EVEN\n\n"
        "Large thin-serif numerals in brick red, captions in tiny caps. "
        "Bottom micro italic: 'EU-average figures, adapt to your city.'",
    ),
    (
        16,
        "CAPEX / €14 600 TOTAL",
        "One large donut chart centred on cream paper, segments filled with "
        "textured swatches (oak, linen, brick, rubber). Centre label in thin "
        "serif: '€ 14 600 · TOTAL CAPEX'. Four hand-drawn arc labels with "
        "hairlines, each appearing exactly once:\n"
        "REHAB BENCH + MIRROR + RAIL — €4,800 (33%)\n"
        "FIT-OUT (BRICK STRIP, FLOOR, PLASTER) — €5,200 (36%)\n"
        "BANDS + ROLLERS + MAT + SINK — €3,000 (21%)\n"
        "SIGNAGE + BRAND — €1,600 (11%)",
    ),
    (
        17,
        "TIMELINE / 9-WEEK LAUNCH",
        "Gantt-like horizontal timeline on cream paper, nine columns W1-W9. "
        "Seven task rows with coloured bars in brick red, north-sea blue, "
        "oak, linen, each task appearing exactly once:\n"
        "LEASE + PERMITS (W1-W2)\n"
        "PLASTER + BRICK STRIP + FLOOR (W2-W4)\n"
        "BENCH + MIRROR + RAIL INSTALL (W4-W5)\n"
        "EQUIPMENT + LINEN ORDER (W4-W6)\n"
        "SIGNAGE + BRAND ROLL-OUT (W6-W7)\n"
        "INSURANCE + TEST SESSIONS (W7-W8)\n"
        "PUBLIC OPENING (W9)\n"
        "Bottom italic: '*Rehab-bench install is the critical path.'",
    ),
    (
        18,
        "TEAM / ONE HAND, ONE BENCH",
        "Two editorial portraits side by side, framed with thin hairline "
        "borders. Left: BRAM V., a Dutch physiotherapist in his mid-30s, "
        "short blond hair, chalk-white linen polo, standing beside the rehab "
        "bench. Caption: 'BRAM V. — PHYSIOTHERAPIST · KNGF-registered, eight "
        "years in sports rehab.' Right: SANNE K., a young Dutch woman in her "
        "late 20s, linen shirt, holding the clinic's slim leather appointment "
        "book. Caption: 'SANNE K. — FRONT DESK · half-time, kinesiology "
        "student, VU Amsterdam.'",
    ),
    (
        19,
        "AFTER / HIS FIRST REHAB BLOCK",
        "A Dutch man in his early 30s, the knee-brace now off and hanging "
        "from his tote bag, standing at ease by the clinic door, cool "
        "morning daylight on his face, unposed, quiet half-smile, no staged "
        "celebration.",
    ),
    (
        20,
        "PERSONAS / THREE PATIENTS",
        "Editorial page on cream paper, title 'PERSONAS'. Three persona "
        "blocks separated by thin hairlines, each with a small coloured "
        "dot on the left, exactly three rows:\n\n"
        "brick-red dot · THOMAS · 33 · Runner, De Pijp. Comes through the "
        "rehab block after a meniscus repair.\n\n"
        "north-sea-blue dot · EVA · 45 · Architect, Jordaan. Uses the desk-"
        "worker clinic monthly for back-and-neck reset.\n\n"
        "oak dot · MARIJKE · 67 · Retired GP, Amsterdam-Noord. Referred by "
        "her own former patients.\n\n"
        "Exactly three rows, clean typography, no duplicates.",
    ),
    (
        21,
        "CHANNELS / FOUR WAYS IN",
        "Elegant editorial page on cream paper, title 'CHANNELS' in small "
        "serif caps. Four rows separated by thin hairlines, each with a "
        "small hand-drawn line-icon and a short clean caption. Exactly four "
        "rows, no duplicates, no gibberish text:\n\n"
        "Row 1 · map icon · GP REFERRALS · three neighbourhood family "
        "doctors send the first eight weeks of patients.\n\n"
        "Row 2 · bicycle icon · SPORTS CLUBS · partnerships with two local "
        "running groups and a city-centre swim club.\n\n"
        "Row 3 · tablet icon · ONLINE BOOKING · open calendar on the "
        "website, fifty percent of new patients self-book.\n\n"
        "Row 4 · letter icon · REHAB NEWSLETTER · a fortnightly email with "
        "one exercise video and one recovery story.",
    ),
    (
        22,
        "RISKS / THREE, WITH MITIGATIONS",
        "Elegant editorial page on cream paper, title 'RISKS'. Three risk "
        "blocks stacked with thin hairlines. Numbers must read exactly 01, "
        "02, 03 — no repeats:\n\n"
        "RISK 01 · SINGLE-PRACTITIONER CAPACITY · a KNGF-registered locum "
        "on a zero-hours contract covers holiday and illness.\n\n"
        "RISK 02 · INSURANCE REIMBURSEMENT · direct-billing contracts with "
        "three major Dutch health insurers secured before opening.\n\n"
        "RISK 03 · BURNOUT · strict six-hour clinical day, two closed "
        "afternoons a week for admin and rest.",
    ),
    (
        23,
        "MANIFESTO / WHY NOW",
        "Full-bleed atmospheric photograph: a single pair of hands on a "
        "patient's knee on the oak-framed bench under cool side-light, the "
        "rest of the frame softly shadowed with a hint of brick wall. "
        "Centred thin-serif white text: 'WHY NOW. The Dutch move every day "
        "— they bike, they sit, they bike. But city knees and desk backs "
        "catch up with them just the same. PHYSIO 1 is one room in the "
        "Jordaan where the only task is putting people back inside their "
        "own movement. Forty-five minutes, one bench, no franchise.'",
    ),
    (
        24,
        "PACKAGE / SIX DELIVERABLES",
        "Flat-lay on a pale oak desk: six printed items arranged like a "
        "design package — a cream 'BRANDBOOK' booklet with the PHYSIO 1 "
        "wordmark, a folded 'P&L · 24 MONTHS' sheet, a brick-red "
        "'FLOORPLAN · 14 m²' blueprint, a small 'EQUIPMENT LIST' card "
        "listing Rehab bench / Bands / Mirror / Mat / Cabinet / Sink / "
        "Handbook / Risk, a '9-WEEK PLAN' sheet with brick and north-sea "
        "blue bars, and a small 'DAY-1 CHECKLIST' card. Cool daylight.",
    ),
    (
        25,
        "CLAIM / micro.svita.ai · amsterdam-physio",
        "Editorial final page, cream paper. Large centred thin-serif "
        "statement: 'CLAIM THIS CONCEPT.' Below, tiny caps: 'micro.svita.ai "
        "/ amsterdam-physio'. Three small price tiers stacked horizontally "
        "with hairline dividers, each appearing exactly once: 'BASIC — €79 · "
        "brandbook PDF' | 'AI-TUNED — €119 · brandbook + P&L + site-adapt' "
        "| 'EXCLUSIVE — €239 · full package + one-year support'. Bottom: a "
        "square QR-code placeholder with caption 'SCAN · "
        "view.html?c=amsterdam-physio'. Footer micro-line: "
        f"'{BRAND_NAME} · a micro.svita concept'.",
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
