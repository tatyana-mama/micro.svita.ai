#!/usr/bin/env python3
"""
concept_dice.py — deterministic randomization engine for micro.svita.ai brandbooks.

Cels:
  1. Guarantee visual variety between concepts (no two decks sharing ≥2 axes with recent ones).
  2. Force each concept to commit to a distinct combo BEFORE generation begins.
  3. Keep result reproducible — same slug always produces same roll (seed = hash(slug)).

Usage:
  python3 scripts/concept_dice.py <slug> --category food --country IT --nn 42
  python3 scripts/concept_dice.py warsaw-zapiekanka-okno --category food --country PL --nn 07

Output:
  1. stdout: human-readable brief — paste into nano-banana prompts as rigid constraints
  2. presentations/NN-<slug>/concept_dice.json — machine-readable for session to re-load
  3. presentations/_DICE_HISTORY.md — append-only log for anti-collision (read by next run)

Axes rolled (8):
  region · archetype · hero-hue · palette(5) · mood · light · composition · texture · human · season · time-of-day

See presentations/_SOP.md § 🎲 RANDOMIZATION MECHANIC for full rules.
"""
import argparse
import datetime
import hashlib
import json
import os
import sys

# ─────────────────────────────────────────────────────────────
# DICE POOLS — 8 axes + 2 bonus
# ─────────────────────────────────────────────────────────────

# country ISO → allowed culture regions (narrows dice so Warsaw cafe ≠ Nordic minimalism)
REGIONS = {
    'PL': ['Slavic PL'], 'BY': ['Slavic PL'], 'UA': ['Slavic PL'], 'RU': ['Slavic PL'],
    'SE': ['Nordic'], 'NO': ['Nordic'], 'DK': ['Nordic'], 'IS': ['Nordic'],
    'FI': ['Baltic', 'Nordic'], 'EE': ['Baltic'], 'LV': ['Baltic'], 'LT': ['Baltic'],
    'FR': ['French'], 'BE': ['French', 'Lisbon'], 'NL': ['Lisbon'], 'LU': ['French'],
    'IT': ['Mediterranean'], 'ES': ['Mediterranean', 'Iberian'], 'PT': ['Iberian', 'Lisbon'],
    'GR': ['Mediterranean'], 'MT': ['Mediterranean'],
    'AT': ['Alpine'], 'CH': ['Alpine'], 'SI': ['Alpine'],
    'DE': ['Berlin', 'Alpine'], 'CZ': ['Alpine', 'Slavic PL'],
    'SK': ['Alpine', 'Slavic PL'], 'HU': ['Alpine', 'Baltic'],
    'IE': ['British'], 'UK': ['British'], 'GB': ['British'],
    'JP': ['Japanese'],
    'LB': ['Levantine'], 'IL': ['Levantine'], 'TR': ['Levantine'],
    'TH': ['Thai'], 'VN': ['Thai'],
}

# 12 archetypes from WOW LAYER
ARCHETYPES = [
    'Quiet Master', 'Loud Host', 'Modern Alchemist', 'Old Soul',
    'Street Poet', 'Punk Florist', 'Digital Monk', 'Village Elder',
    'Design Purist', 'Heritage Keeper', 'Urban Rebel', 'Nurturer'
]

# category → archetypes that make sense (filters dice so clinic ≠ Punk Florist)
ARCHETYPE_FIT = {
    'food':       ['Loud Host', 'Old Soul', 'Street Poet', 'Village Elder', 'Heritage Keeper', 'Modern Alchemist', 'Nurturer'],
    'restaurant': ['Loud Host', 'Old Soul', 'Street Poet', 'Village Elder', 'Heritage Keeper', 'Modern Alchemist', 'Design Purist'],
    'beauty':     ['Quiet Master', 'Punk Florist', 'Design Purist', 'Modern Alchemist', 'Urban Rebel', 'Nurturer'],
    'wellness':   ['Quiet Master', 'Digital Monk', 'Nurturer', 'Design Purist', 'Heritage Keeper'],
    'health':     ['Quiet Master', 'Digital Monk', 'Nurturer', 'Modern Alchemist', 'Design Purist'],
    'service':    ['Quiet Master', 'Modern Alchemist', 'Digital Monk', 'Design Purist', 'Heritage Keeper'],
    'craft':      ['Old Soul', 'Heritage Keeper', 'Village Elder', 'Street Poet', 'Modern Alchemist', 'Quiet Master'],
    'repair':     ['Quiet Master', 'Old Soul', 'Modern Alchemist', 'Heritage Keeper', 'Village Elder'],
    'retail':     ['Design Purist', 'Modern Alchemist', 'Punk Florist', 'Heritage Keeper', 'Urban Rebel'],
    'education':  ['Digital Monk', 'Quiet Master', 'Village Elder', 'Modern Alchemist', 'Design Purist', 'Nurturer'],
}

# region → palette pool of 10 hex candidates. Dice picks 5 of them.
PALETTES = {
    'Slavic PL':     ['#2B4C8C', '#F3EAD9', '#A8312A', '#8B6F47', '#1F2D3D', '#CBA74C', '#5A6B3D', '#7E4A2A', '#D2C3A3', '#3E2C1E'],
    'Nordic':        ['#0F1115', '#E5EEF5', '#A0B8C9', '#3A4A56', '#D8C7A6', '#5A6A6E', '#EFE9DC', '#2E3742', '#B8C9B2', '#7A6B5D'],
    'Mediterranean': ['#C7755B', '#7A8B4F', '#F0E4CF', '#8B5E3C', '#3A4F3A', '#D4A679', '#5C3A2E', '#A89560', '#E8C79F', '#1F2E28'],
    'French':        ['#7B2C23', '#F3EBD7', '#C8A971', '#3D2E26', '#8B7456', '#D7C6A8', '#1F1A16', '#A25C4A', '#E5D4AA', '#6B4E32'],
    'Japanese':      ['#1A1A1C', '#F5EEE0', '#8B6F4F', '#2E2E2E', '#C2B59B', '#5A3E2B', '#E8DFC9', '#3D2E26', '#9B8C6E', '#141414'],
    'Thai':          ['#E8A03C', '#7A4523', '#8DA34D', '#F6EBD3', '#3A2E1D', '#C86B33', '#4A3A24', '#D9B67A', '#6B4423', '#1F1A10'],
    'Levantine':     ['#9B2C2C', '#C58B3A', '#5A7349', '#F3EAD9', '#1F2D3D', '#8B6F47', '#D4A679', '#4A332E', '#2A5A8E', '#E3C489'],
    'Alpine':        ['#2F4F3A', '#F3EEE0', '#8B7E6B', '#6B7A6E', '#D4C4A8', '#3E2A1D', '#A89E88', '#1F2A22', '#BBA988', '#5A6651'],
    'Iberian':       ['#2A5A8E', '#E07856', '#F3EBD7', '#A08360', '#3D2E26', '#8B6F4F', '#DBC9A6', '#1F1A16', '#A34A3E', '#5C4732'],
    'Baltic':        ['#5A6A42', '#F3EBD7', '#A8512B', '#3E2E1F', '#8B7E55', '#D7C6A8', '#6B5A3D', '#1F1A10', '#CBB88E', '#2E3A2B'],
    'Berlin':        ['#1C1E22', '#A8A8A8', '#D7CBA9', '#3A3A3A', '#C0D62F', '#6B5A4D', '#E0DAC5', '#2E2E2E', '#B0A998', '#4A4338'],
    'Lisbon':        ['#E8B4A8', '#8DA389', '#F3EBD7', '#8B6F4F', '#C5A16F', '#3D2E26', '#A8C2A8', '#D4A679', '#1F2A22', '#B8927A'],
    'British':       ['#1F3E34', '#EFE5CE', '#7B2C23', '#8B7456', '#C8A971', '#3D2E26', '#5A6B4F', '#D7C6A8', '#1F1A16', '#A25C4A'],
}

MOODS        = ['deep-warm', 'cool-crisp', 'neutral-moody', 'sun-faded', 'night-lit']
LIGHTS       = ['backlit', 'sidelit', 'overhead', 'candlelit', 'blue-hour']
COMPOSITIONS = ['symmetric', 'rule-of-thirds', 'diagonal', 'centered-void']
TEXTURES     = ['wood', 'stone', 'metal', 'fabric', 'ceramic', 'glass']
HUMANS       = ['macro-hand', 'portrait', 'full-body', 'empty-scene']
SEASONS      = ['winter', 'spring', 'summer', 'autumn']
TIMES        = ['dawn', 'morning', 'noon', 'afternoon', 'evening', 'night']

# collision-relevant axes (hero_hue, human, season, time_of_day are derived / too specific)
COLLISION_AXES = ('region', 'archetype', 'mood', 'light', 'composition', 'texture')


# ─────────────────────────────────────────────────────────────
# CORE
# ─────────────────────────────────────────────────────────────

def pick(seed: bytes, offset: int, options: list):
    """Deterministically pick one option from `options` using `offset` bytes of seed."""
    chunk = seed[offset:offset + 2] or b'\x00\x00'
    return options[int.from_bytes(chunk, 'big') % len(options)]


def roll(slug: str, category: str, country: str, variant: int = 0) -> dict:
    """Roll the dice for one concept. Variant ≥1 re-rolls with different seed."""
    seed = hashlib.sha256(f'{slug}:{variant}'.encode()).digest()

    regions = REGIONS.get((country or '').upper(), ['Mediterranean'])
    region = pick(seed, 0, regions)

    archetype_pool = ARCHETYPE_FIT.get(category, ARCHETYPES)
    archetype = pick(seed, 2, archetype_pool)

    # palette: deterministic "shuffle" of region pool, take first 5, hero = [0]
    pool = PALETTES.get(region, PALETTES['Mediterranean'])
    shuffled = sorted(pool, key=lambda h: hashlib.sha256(f'{slug}:{variant}:{h}'.encode()).hexdigest())
    palette = shuffled[:5]

    return {
        'slug': slug,
        'category': category,
        'country': (country or '').upper(),
        'variant': variant,
        'region': region,
        'archetype': archetype,
        'hero_hue': palette[0],
        'palette': palette,
        'mood': pick(seed, 4, MOODS),
        'light': pick(seed, 6, LIGHTS),
        'composition': pick(seed, 8, COMPOSITIONS),
        'texture': pick(seed, 10, TEXTURES),
        'human': pick(seed, 12, HUMANS),
        'season': pick(seed, 14, SEASONS),
        'time_of_day': pick(seed, 16, TIMES),
    }


def collision_score(a: dict, b: dict) -> int:
    """Count how many collision-relevant axes match."""
    return sum(1 for k in COLLISION_AXES if a.get(k) == b.get(k))


def read_history(path: str, n: int = 5) -> list:
    """Return last `n` rolls from history .md file."""
    if not os.path.exists(path):
        return []
    rows = []
    with open(path) as f:
        for line in f:
            line = line.rstrip('\n')
            if not line.startswith('| 20'):
                continue
            parts = [p.strip() for p in line.split('|')[1:-1]]
            if len(parts) < 10:
                continue
            rows.append({
                'date': parts[0], 'nn': parts[1], 'slug': parts[2],
                'region': parts[3], 'archetype': parts[4], 'hero_hue': parts[5].strip('`'),
                'mood': parts[6], 'light': parts[7], 'composition': parts[8], 'texture': parts[9],
            })
    return rows[-n:]


def roll_with_collision_check(slug, category, country, history, max_attempts=10) -> dict:
    """Roll; if ≥2 collision-axes match any of last N history rolls — try next variant."""
    best = None
    best_score = 99
    for v in range(max_attempts):
        r = roll(slug, category, country, variant=v)
        scores = [collision_score(r, h) for h in history] or [0]
        top = max(scores)
        if top < best_score:
            best_score = top
            best = r
        if top < 2:
            r['collision_score'] = top
            return r
    best['collision_score'] = best_score
    best['warning'] = f'kept best of {max_attempts} attempts (score={best_score}, ≥2 means overlap with recent)'
    return best


def format_brief(r: dict) -> str:
    warn = f'\n⚠ {r["warning"]}' if 'warning' in r else ''
    palette_fmt = ' · '.join(f'`{c}`' for c in r['palette'])
    return f"""# 🎲 Concept Dice — {r['slug']}

variant {r['variant']} · collision-score {r.get('collision_score', 0)}/6{warn}

**Region:**       {r['region']}
**Archetype:**    {r['archetype']}
**Hero hue:**     `{r['hero_hue']}`
**Palette (5):**  {palette_fmt}
**Mood:**         {r['mood']}
**Light:**        {r['light']}
**Composition:**  {r['composition']}
**Texture:**      {r['texture']}
**Human:**        {r['human']}
**Season:**       {r['season']}
**Time of day:**  {r['time_of_day']}

— Paste into every nano-banana prompt as RIGID constraints. Do not override based on own taste."""


def append_history(path: str, r: dict, nn: str) -> None:
    header = (
        '# CONCEPT DICE HISTORY\n\n'
        '*Append-only log. Each new concept dice roll is added here. Before rolling, the script reads the last 5 entries and re-rolls if ≥2 collision-relevant axes match.*\n\n'
        '*Collision-relevant axes: region, archetype, mood, light, composition, texture.*\n\n'
        '| Date | NN | Slug | Region | Archetype | Hero hue | Mood | Light | Composition | Texture | Human |\n'
        '|---|---|---|---|---|---|---|---|---|---|---|\n'
    )
    row = f"| {datetime.date.today()} | {nn} | {r['slug']} | {r['region']} | {r['archetype']} | `{r['hero_hue']}` | {r['mood']} | {r['light']} | {r['composition']} | {r['texture']} | {r['human']} |\n"
    if not os.path.exists(path):
        with open(path, 'w') as f:
            f.write(header + row)
    else:
        with open(path, 'a') as f:
            f.write(row)


# ─────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────

def main():
    ap = argparse.ArgumentParser(
        description='Deterministic concept dice roller for micro.svita.ai brandbooks.',
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__,
    )
    ap.add_argument('slug', help='concept slug (e.g. warsaw-zapiekanka-okno)')
    ap.add_argument('--category', required=True,
                    help='food · restaurant · beauty · wellness · health · service · craft · repair · retail · education')
    ap.add_argument('--country', required=True, help='ISO-2 (PL · IT · JP · TH · SE …)')
    ap.add_argument('--nn', default='??', help='folder prefix NN (default: ??)')
    ap.add_argument('--dry-run', action='store_true',
                    help='roll only, do not write JSON or history')
    ap.add_argument('--no-history', action='store_true',
                    help='do not check history or append to it')
    args = ap.parse_args()

    base = os.path.expanduser('~/labs67/micro.svita.ai/presentations')
    hist_path = os.path.join(base, '_DICE_HISTORY.md')

    history = [] if args.no_history else read_history(hist_path)
    r = roll_with_collision_check(args.slug, args.category, args.country, history)

    print(format_brief(r))

    if args.dry_run:
        print('\n(dry-run — no files written)')
        return

    out_dir = os.path.join(base, f'{args.nn}-{args.slug}')
    os.makedirs(out_dir, exist_ok=True)
    out_json = os.path.join(out_dir, 'concept_dice.json')
    with open(out_json, 'w') as f:
        json.dump(r, f, indent=2, ensure_ascii=False)
    print(f'\n→ saved {out_json}')

    if not args.no_history:
        append_history(hist_path, r, nn=args.nn)
        print(f'→ appended to {hist_path}')


if __name__ == '__main__':
    main()
