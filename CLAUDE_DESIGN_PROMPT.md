# Claude Design · Промт для hero-страницы micro.svita.ai

---

## PROJECT CONTEXT

**micro.svita.ai** — editorial atlas of 242 imagined micro-businesses across Europe. We photograph, brand, cost, and document each concept **before it physically exists**. Clients buy a 25-slide brandbook (€49) or exclusive rights (€149) to an entire concept and open it in real life.

**Users:** entrepreneurs, creative pros, franchise agencies, designers, film scouts.

**Current headline:** *"Before it exists, we photograph it."*

**Tone:** Kinfolk × Apartamento × Cereal Magazine. Tihi-luxury. Editorial-over-advertising. Quiet-but-hypnotic. Like a museum exhibition website, not an e-commerce store.

---

## DESIGN BRIEF

Design a **hero + above-the-fold landing page** for micro.svita.ai that stops the scroll and communicates in 3 seconds: *"this is not another marketplace — this is an atlas of imagined worlds, each a real business waiting to be opened."*

Must feel like a **digital version of a cloth-bound photography book** that someone pulled off a shelf in a Paris bookstore, not like a SaaS product.

### Core Emotions to hit:

1. **Curiosity** — "wait, what is this actually?"
2. **Intimacy** — "this was made by one human, not a corporation"
3. **Desire** — "I want to own one of these"
4. **Dignity** — "these are serious objects, not content slop"

---

## VISUAL SYSTEM

### Palette (strict — no other colors)

```
— amber        #D4A679   (primary accent, warm brass)
— cream        #F3EAD9   (typography, highlights)
— ink dim      rgba(243,234,217,0.62)
— ink faint    rgba(243,234,217,0.38)
— sumi bg      #0E0D0B   (page background, almost black)
— bg-2         #15130F   (alt surface)
```

### Typography

- **Display / headlines**: `Cormorant Garamond`, weight 300, italic — very thin, generous tracking, line-height 1.02–1.04
- **Eyebrows / labels**: `Inter` 500, 10–11px, tracking 0.3em, uppercase, color = amber
- **Body / sub**: `Inter` 300, 15–16px, line-height 1.7, color = ink-dim
- **Numbers / metadata**: `JetBrains Mono` 400, tabular, 10–12px

### Layout laws

- Full-bleed hero image, viewport-tall
- **Radial vignette** + **bottom gradient fade** over image (image → bg)
- Typography **centered horizontally, bottom-weighted** (leave breathing air at top)
- Amber acts as single accent — never use for bulk text, only for 1-2 eye-stops
- 25-slide brandbook shots are **not** shown here — only evoked through ambient photography

---

## STRUCTURE (hero + 4 above-fold bands)

### 1. NAV (sticky, minimal, transparent on top, glass on scroll)

```
micro.svita              [ atlas ]  [ account ]
```

- Brand word in Cormorant lowercase, letter-spaced
- 2 nav links only, uppercase micro-labels
- On scroll >80px: background → `rgba(14,13,11,0.82)` + backdrop blur 14px + 1px bottom hairline

### 2. HERO (100vh)

- **Background image**: atmospheric `/data/hero/home-hero-v1.png` (empty amber-lit storefront at blue hour, cobblestone, fog — image already exists in project)
- **Centered stack, vertically middle-to-bottom:**

  - **Eyebrow** (amber, uppercase mono): `AN ATLAS OF BUSINESSES YET TO OPEN`
  - **Headline** (Cormorant italic, 80–96px):
    *Before it exists,*
    **we photograph it.**
    (second line in amber, italic — key emotional beat)
  - **Subline** (Inter 300, 560px max-width, ink-dim):
    *242 micro-businesses across Europe — imagined, styled, costed. Each a 25-slide brandbook, a world ready to step into. One lit window at dawn. Yours could be next.*
  - **CTA row**: two pills, 12px tracking .18em uppercase
    - `[ BROWSE THE ATLAS → ]` — amber fill, sumi text, hover → outline amber
    - `[ SIGN IN ]` — ghost, cream border 28% opacity

- **Numbers strip** pinned to hero bottom (full width, horizontal):
  `242 concepts · 13 categories · 25 slides · €49 · 12 EU languages`
  (each number in Cormorant, label below in mono)

### 3. SECOND BAND — "The Method" (reveals on first scroll)

Full-width dark panel (`bg-2`), 120px vertical padding.

Three-column editorial row (stacks on mobile):

| Column | Content |
|---|---|
| **01 · IMAGE** | *"We begin with silence. A room. A window at dawn. A single object on a raw oak bench. We photograph what has not been built."* |
| **02 · BRIEF** | *"Then: the name. The tagline. The palette. Hero persona. Equipment list. Four-week opening plan. 25 slides, nothing more."* |
| **03 · HAND-OFF** | *"You claim the concept — for €49 you receive the brandbook. For €149, the concept retires to you alone. You open it."* |

Numbers in amber Cormorant 48px. Body in Inter 300. Hairline dividers between columns (1px, amber 22%).

### 4. THIRD BAND — "Gallery tease" (horizontal scroll of 6 brandbook covers)

**Title row:**
```
THE CURRENT ATLAS                    242 concepts · [view all →]
```

Horizontal scrolling row (touch/drag) of **6 brandbook cover shots** — editorial photography of concepts, each card:
- 16:10 aspect
- Subtle border (amber 14%)
- On hover: transform translateY(-4px), border → amber 50%, image zoom 1.04× over 1.2s
- Overlay at bottom: `42 · CIRE 11` (concept name in Cormorant) + `paris · craft` (metadata in mono, amber dim)

Covers to reference (use these atmospheres):
1. `42 · CIRE 11` — Parisian candle atelier, amber wax pools
2. `43 · HUMUS 14` — Tel Aviv hummus house, warm Levantine olive oil
3. `94 · UHR 3` — Basel watch repair, brass + green baize
4. `01 · SEN LAB` — Ljubljana sleep consult room, linen + oak
5. `216 · CHEMEX 1` — Paris mono-coffee, oxblood banquette at dawn
6. `92 · WHISKY 9` — Edinburgh whisky flights, peat + rain window

### 5. FOURTH BAND — "Tiers" (dark, ceremonial)

Two stark tiers, side-by-side, separated by amber hairline:

**LEFT — CONCEPT · €49**
*"The full 25-slide brandbook. Shared with others who loved the same concept. A library card, not a deed."*

**RIGHT — EXCLUSIVE · €149**
*"The concept retires to one owner. Withdrawn from the catalogue forever. Your unbuilt world, now private."*

Under each: one muted `[ claim · ]` button, outline only.

### 6. FOOTER (tiny, mono, amber-faint)

```
micro.svita · Warsaw · 2026          atlas · sign in · contact · /manifest
```

---

## INTERACTIONS & MOTION

- **Stagger-in animations** on hero load: eyebrow → headline → sub → CTA → numbers, 120ms between each, 900ms ease-out each, `translateY(14px→0)`
- **Scroll velocity reveal** on bands 2–5: opacity 0→1 + translateY(20px→0) as element enters viewport
- **Cursor**: on brandbook cards → custom cursor: amber dot (8px) + "view ·" label in mono next to it
- **Hero image micro-parallax**: image scales 1.02× as user scrolls 100vh (GPU-accelerated, transform only)
- **`prefers-reduced-motion`**: honor fully — disable all transforms, keep fades at 150ms
- **Loading**: first paint shows amber spinner centered, then hero image cross-fades in

---

## WHAT TO AVOID

- ❌ Generic hero video backgrounds (no Unsplash-y lifestyle clips)
- ❌ Gradients that aren't ink → sumi (no blue, no purple, no neon)
- ❌ SaaS-style feature tiles with icons
- ❌ Testimonial carousels
- ❌ "Trusted by X companies" logos strip
- ❌ Chatbot bubbles
- ❌ Emoji in copy
- ❌ Advertising voice ("transform your business", "unlock your potential")
- ❌ Bento layouts — we want editorial magazine rhythm, not dashboard grids

---

## DELIVERABLE

Output as **one single HTML file** with inline `<style>`:
- Semantic HTML (`<nav>`, `<section>`, `<footer>`)
- Google Fonts import (Cormorant Garamond ital 300 + Inter 300/500 + JetBrains Mono 400/500)
- CSS variables for palette
- `prefers-reduced-motion` fallbacks
- Fully responsive: 375px · 768px · 1024px · 1440px breakpoints
- Alt text on all images
- `<meta>` OG tags for share preview

Image placeholders: use `/data/hero/home-hero-v1.png` for hero, and `/presentations/42-paris-candle-atelier/slide-01-cover.png`, `/presentations/43-tel-aviv-hummus/slide-01-cover.png`, etc. for gallery.

---

## REFERENCE AESTHETICS (mood anchors)

- **kinfolk.com** — issue 54 Paris layout
- **apartamentomagazine.com** — homepage serif discipline
- **cereal-magazine.com** — vertical rhythm
- **otherwaysstudio.com** — amber accents on deep black
- **bureau-bureau.com** — Cormorant italic headlines
- **aesop.com/de/de** — minimalist product atlas feel
- Hotel website: **faenaforum.com**, **hotel-peter-paul.com**
- Museum: **tate.org.uk/art/artworks** (dignity without sterility)

**Do NOT reference:** Stripe, Linear, Vercel, Shopify, Notion, any SaaS dashboard.

---

## ONE LINE TO REMEMBER

> *"If a reader scrolls past the hero without feeling they've stepped into an unlit bookshop at dawn — we failed."*

Design the landing page.
