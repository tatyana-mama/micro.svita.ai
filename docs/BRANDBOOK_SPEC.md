# BRANDBOOK SPEC · micro.svita.ai

Шаблон под редактирование. Заполняй `[FILL: ...]` поля, удаляй что не нужно, добавляй свои заметки. Отдай готовый файл Каю — он сгенерит концепцию без догадок.

Легенда:
- `[FILL: ...]` — обязательно заполнить
- `[FILL OR KEEP: ...]` — есть дефолт, можешь оставить или переписать
- `[OPTIONAL: ...]` — можно удалить, если не нужно
- `[AUTO]` — генератор подставит сам, не трогай

---

# A · ИДЕНТИФИКАЦИЯ

## A.1 · Slug
```
[FILL: slug-в-kebab-case]
```
- только a-z, 0-9, дефисы
- без акцентов, без заглавных, без пробелов
- формат: `город-бренд-тип` или `тема-категория`
- примеры: `warsaw-zapiekanka-okno`, `paris-candle-atelier`, `scandi-coffee`

## A.2 · Brand name (ОДНА строка)
```
Полное название (как на вывеске):  [FILL: ZAPIEX PRAGA]
Короткий wordmark (≤12 символов):   [FILL: ZAPIEX]
Монограмма (≤3 символа):            [FILL: ZP]
```
- Это имя **ИДЕНТИЧНО** появится на всех 6 фото и во всём брендбуке
- Если slug содержит город — имя **не обязано** содержать (slug — технический)

## A.3 · Tagline (10–14 слов)
```
[FILL: Tiny zapiekanka window on a Praga corner. Three breads. Zero compromise.]
```
- Это лид-слоган всей концепции
- Используется на обложке, странице positioning и back cover

## A.4 · Founding year (ОДИН)
```
[FILL: 2026]  (или 1928 — если концепция винтажная)
```
- **Ровно одно число**. Никогда не `since 1895` на hero и `seit 1928` на signage одновременно.
- Если концепция новая — ставь год запуска (2026)
- Если стилизация «ретро с легендой» — выбери одну легенду и не меняй

## A.5 · Cross-consistency details
Значения которые **могут** попасть в кадр (на фасаде / упаковке / вывеске):
```
Номер дома / киоска / линии:  [OPTIONAL: LINIE 1 / №4 / 2304]
Улица / район:                [OPTIONAL: Freta 42, Warsaw Praga]
Телефон / @handle:            [OPTIONAL: @zapiex]
Количество мест:              [OPTIONAL: 6 seats]
Слоган на вывеске:            [OPTIONAL: SEIT 2026]
```
- Всё что заполнил — **должно быть идентично** на всех 6 фото

---

# B · ЭКОНОМИКА

## B.1 · Операционные параметры
```
Площадь (m²):                    [FILL: 8]
Launch budget (€):               [FILL: 11400]
Срок открытия (weeks, 4–7):      [FILL: 7]
Категория:                       [FILL: food]  (one of: food / restaurant / beauty / service / repair / craft / retail / wellness / health / education)
Country ISO-2:                   [FILL: PL]  (PL/DE/FR/AT/IT/ES/...)
Reference-country для цен:       [FILL: AT]  (по какой стране ты брал ценники оборудования)
```

## B.2 · Метрики для раздела Financial
```
Средний чек (€):                 [FILL: 7]
Транзакций/день:                 [FILL: 80]
Рабочих дней/месяц:              [FILL: 26]
Месячная выручка target:         [AUTO: чек × транз × дней]
Rent/месяц (€):                  [FILL: 900]
Labour/месяц (€):                [FILL: 2100]
COGS %:                          [FILL: 28]
```
- Payback и margin посчитает генератор. Ты задаёшь только верхние 7 строк.

## B.3 · CAPEX split (если отличается от дефолта)
Дефолт (не трогай если норм):
- Fit-out 30% · Core equipment 28% · Furniture 12% · Signage 6% · IT/POS 5% · Permits 4% · Inventory 10% · Contingency 5%

Кастом (если хочешь другие проценты):
```
[OPTIONAL: Fit-out: 35%, Core equipment: 20%, ...]
```

---

# C · ВИЗУАЛЬНЫЙ КАНОН

## C.1 · Палитра (5 hex)
```
Primary (60% веса):    [FILL OR KEEP: #1A1A1A]
Accent (20%):          [FILL OR KEEP: #C9A24B]
Surface (фон):         [FILL OR KEEP: #F5EFE4]
Ink (текст):           [FILL OR KEEP: #0F0F0F]
Mist (muted):          [FILL OR KEEP: #C2B79A]
```
- Для стандартных категорий есть готовые в `generate_brandbook.py:PALETTES`
- Если пишешь свою — обязательно 5 цветов, ни больше ни меньше

## C.2 · Материалы / текстуры (ровно одна строка)
```
[FILL: matte black wood exterior + pale birch plywood interior + brushed brass pendants + stainless steel counter + cream chalkboard]
```
- Это строка `material` для nano-banana промпта
- Все 6 фото должны показывать **именно эти** материалы

## C.3 · Освещение / время суток
```
[FILL: soft late-afternoon golden hour, overcast sky, warm interior glow from brass pendants]
```
- Если концепция дневная — **все** 6 фото днём
- Не миксуй день+ночь+неон в одной серии

## C.4 · Архитектурный стиль / эпоха
```
[FILL: Scandi-Polish minimalism, 2020s street food architecture, flat planes, no ornament]
```
- Примеры: `Vienna Biedermeier 1890s tram`, `Memphis 80s bold color blocks`, `Japanese wabi-sabi`, `Brutalist concrete`

## C.5 · BLACKLIST — чего НЕ должно быть в кадре
```
[FILL: no neon signs, no red brick walls, no string lights, no crowd, no banners with other names, no other cities in signage]
```
- Это активно передаётся в prompt как `"No ..."`
- Важно перечислить всё что было в прошлых ошибках концепции, если это повторная генерация

---

# D · ИЗОБРАЖЕНИЯ (в `data/concepts/{slug}/images/`)

Aspect ratio: **3:2** все. Минимум 6 файлов. Все в **одном визуальном стиле** (одна палитра, один материал, одно освещение — по разделу C). Если хоть одно выбивается — концепцию не публиковать.

Три обязательных категории:

| Категория | Цель | Минимум |
|---|---|---|
| **I · Фото бизнеса (разные ракурсы)** | Показать как заведение выглядит в реальности с 3+ углов | 3 |
| **II · Макапы (продукт/упаковка/вывеска)** | Брендинг на физических носителях | 2 |
| **III · Изометрия (техническая схема)** | Размещение оборудования и зон в помещении | 1 |

## I · Фото разных ракурсов (обязательно ≥3)

## D.1 · `01-hero.png` — establishing shot
```
Что в кадре:     [FILL: tiny matte black kiosk built into stone building corner, large serving window, brass pendants glowing inside, chalkboard menu on side, person visible at window]
Ракурс:          [FILL: 3/4 exterior view from pedestrian eye-level]
Время суток:     [наследуется от C.3]
На фасаде видно: [FILL: "ZAPIEX PRAGA" embossed gold letters above window]
```
- Это **reference** для всех следующих изображений
- Если этот кадр плох — все остальные унаследуют проблему

## D.2 · `02-facade.png` — другой ракурс экстерьера
```
Ракурс:          [FILL: wide architectural shot from across the street, shows full kiosk + neighboring building]
Что ДОЛЖНО быть идентично 01: [FILL: same brand name "ZAPIEX PRAGA", same matte black, same brass pendants visible, same person/staff]
Что МОЖЕТ отличаться:          [FILL: angle, people walking by, lighting slightly different]
```

## D.3 · `03-interior.png` — вид изнутри
```
Ракурс:          [FILL: looking from kitchen counter toward the serving window, showing prep area foreground, window in middle, street in background]
Оборудование видно: [FILL: toaster-oven, squeeze bottles, baguette board, hand-wash sink, 2 brass pendants, birch plywood wall]
Люди:            [FILL: 1 staff in black t-shirt + apron, no customers visible]
```

## D.3a · Дополнительные ракурсы (опционально, но рекомендуется)
Если хочется больше чем 3 фото — добавляй по одному в формате `07-angle-NN.png`, `08-angle-NN.png`, `09-detail-NN.png`. Каждый **обязан** быть в том же стиле (C.1-C.5). Примеры:
```
[OPTIONAL: 07-night.png — вечерний shot, те же brass pendants, тот же фасад, но с включённым светом]
[OPTIONAL: 08-queue.png — короткая очередь днём, клиенты в минималистичной одежде, тот же киоск]
[OPTIONAL: 09-rooftop-detail.png — крупный план крыши/навеса, материалы видно]
```
- Нумерация не должна перебивать 01–06 (они зарезервированы под template)
- Если ракурс не ложится в стиль — **не добавлять**, лучше 3 правильных чем 5 случайных

---

## II · Макапы (обязательно ≥2)

Макап = брендинг на физическом носителе, показанный **в контексте заведения** (не студийная белая подложка). Проверяет как лого/палитра работают на реальных объектах.

## D.4 · `04-packaging.png` — упаковка
```
Product shot:    [FILL: brown kraft paper bag with "ZAPIEX" stamped in gold, open-faced zapiekanka on wax paper, brass foil sticker with year]
Фон:             [FILL: same stainless steel counter from 03-interior, in-context not studio]
Дополнительно:   [FILL: napkin with small ZP monogram, a receipt peeking out]
```
- **НЕ** студийная съёмка на белом
- Упаковка с brand name = brand name с signage

## D.5 · `05-signage.png` — крупный план вывески
```
Главный элемент: [FILL: brass-embossed "ZAPIEX PRAGA" sign above the serving window, night macro shot]
Дополнительно:   [FILL: chalkboard menu legible in frame, 3 prices in €]
Год/номер:       [FILL: "EST 2026" small under brand name, matches A.4]
```

## D.4a / D.5a · Дополнительные макапы (опционально)
Можно добавить ещё брендированные носители (тот же стиль, тот же лого/палитра):
```
[OPTIONAL: 10-menu-mockup.png  — меловая доска с меню крупно, все позиции и цены в €]
[OPTIONAL: 11-uniform.png      — фартук/футболка сотрудника с монограммой]
[OPTIONAL: 12-receipt.png      — чек/наклейка с монограммой]
[OPTIONAL: 13-business-card.png — визитка руководителя]
```
- Все опциональные макапы = тот же бренд + та же палитра
- Если макап читается как «другой бренд» → не публиковать

---

## III · Изометрия (обязательно ≥1)

## D.6 · `06-layout.png` — изометрическая схема
```
Формат:          isometric 3D architectural drawing, top-down 30° angle
Размер площади:  [FILL: 2m × 4m = 8m²]
Зоны с подписями и размерами в мм:
  [FILL:
    - Serving window: 2000mm × 900mm
    - Stainless steel counter under window
    - Chalkboard menu panel left of window
    - Toaster-oven on rear counter
    - Prep area: ingredient bowls, squeeze bottles
    - Mini fridge under counter (right)
    - 2 brass pendant lamps, centered
    - Hand-wash sink (back-left corner)
    - Storage shelves (rear wall)
    - Electrical panel (rear-right)
    - Staff clear depth: 1200mm
  ]
Стиль:           blueprint aesthetic, thin black linework, cream paper background, small sans-serif labels with leader lines
Цветовые акценты: [наследуется от C.1 — только subtle brass/wood fill]
```

## D.6a · Дополнительные изометрии (опционально)
Если площадь большая (>30 m²) или у концепции 2 уровня / несколько зон — можно добавить:
```
[OPTIONAL: 14-layout-night.png    — та же изометрия, но показывает ночной режим (закрытая витрина)]
[OPTIONAL: 15-layout-expanded.png — план с зоной патио / расширения]
[OPTIONAL: 16-layout-flow.png     — тот же план со стрелками клиентского/staff flow]
```
- Каждая — в том же blueprint-стиле, те же размеры совпадают с основной

---

## IV · Правило единого стиля (строго)

**Перед публикацией сравни все изображения side-by-side.** Если хотя бы одно из следующих не одинаково во всех картинках — концепцию не публиковать:

- **Палитра** (C.1) — dominant colors одинаковые во всех кадрах
- **Материалы** (C.2) — одни и те же текстуры и отделка
- **Освещение** (C.3) — не миксовать день/ночь/неон, кроме явных night-variants (07/14)
- **Эпоха** (C.4) — никаких «минимал + ретро-ярмарка» в одной серии
- **Brand name** (A.2) — идентично на всех 2D-элементах (фасад/упаковка/вывеска)
- **Год/номер** (A.4/A.5) — одинаково везде или нигде

Быстрая проверка: открыть все 6+ картинок в одной коллекции — чужой человек должен сказать «это одно заведение» с первого взгляда. Если сомневается — регенерь выбивающуюся картинку.

---

# E · СТРАНИЦЫ БРЕНДБУКА (15 шт)

## E.1 · Page 1 — Cover
```
Фон:         01-hero.png с opacity 0.35 поверх ink
Заголовок:   [A.2 полное имя] 52pt Fraunces 800 цвет accent
Подзагол.:   · Brandbook 2026 ·  (10pt Inter caps)
Tagline:     [A.3]
Meta:        €[B.1.budget] · [B.1.weeks]w · [B.1.m²]m² · [country из B.1]
```

## E.2 · Page 2 — Positioning
```
Eyebrow:     01 · Positioning
Заголовок:   A concept that already proves itself.
Lead:        "[A.3] Designed for [country] retail reality, priced for early entrepreneurs, ready to execute without hired consultants."
Stats 2×2:   €[budget] · [weeks]w · [m²]m² · [category]
USP (4 шт, можно кастом):
  [FILL OR KEEP:
    I. Hyper-specific — solves a single customer need
    II. Small footprint — rent below 10% of revenue
    III. Predictable CAPEX — line items verified against quotes
    IV. Trained-in-a-week operations — no prior experience
  ]
```

## E.3 · Page 3 — Moodboard
```
Eyebrow:     02 · Moodboard
Заголовок:   The feeling.
Lead:        The room you walk into. The first thing the customer sees before they read a single word.
Изображение: 01-hero.png (full page bottom)
```

## E.4 · Page 4 — Color system
```
Eyebrow:     03 · Color system
Заголовок:   Five anchors. No exceptions.
Lead:        Every surface, label and digital touchpoint picks from these five. Expand only with tints and shades of the primaries.
5 color chips из C.1:
  Primary · Accent · Surface · Ink · Mist
Правило:     Primary 60% · Accent 20% · Surface fills rest · Ink only for type
```

## E.5 · Page 5 — Typography
```
Eyebrow:     04 · Typography
Заголовок:   Two typefaces. One voice.
Display:     Fraunces 800 — демо = [A.2 полное имя, первые 22 символа]
Body:        Inter 400 — "The brand speaks plainly. Short sentences. No jargon. Every paragraph earns its place."
Правила:     Never mix more than these two. Never italicize body. Never use all-caps below 10pt.
```
[Не меняется per-concept. Оставь как есть.]

## E.6 · Page 6 — Logo
```
Eyebrow:     05 · Logo
Заголовок:   One mark. Two lockups.
Lead:        Primary logo locks the wordmark with the category glyph. Secondary is wordmark-only, used where space is tight.
Изображение: 05-signage.png (large)
Caption:     Clear space = height of the ampersand on all sides. Minimum print size = 20mm wide.
```

## E.7 · Page 7 — Facade
```
Eyebrow:     06 · Facade
Заголовок:   What the street sees.
Изображение: 02-facade.png
```

## E.8 · Page 8 — Interior
```
Eyebrow:     07 · Interior
Заголовок:   What the customer remembers.
Изображение: 03-interior.png
```

## E.9 · Page 9 — Packaging
```
Eyebrow:     08 · Packaging & collateral
Заголовок:   Branded touch at every step.
Изображение: 04-packaging.png
```

## E.10 · Page 10 — Signage
```
Eyebrow:     09 · Signage
Заголовок:   The promise, hung on the wall.
Изображение: 05-signage.png
```

## E.11 · Page 11 — Interior layout [НОВОЕ]
```
Eyebrow:     10 · Interior layout
Заголовок:   Every square metre, placed.
Изображение: 06-layout.png
Caption:     Isometric reference showing typical equipment placement, staff flow, and dimensions for a [B.1.m²]m² footprint. Adapt to your exact premise.
```

## E.12 · Page 12 — Equipment & CAPEX
```
Eyebrow:     11 · Equipment & CAPEX
Заголовок:   Where the €[budget] goes.
Таблица:     8 строк + total, проценты из B.3 или дефолт
Дисклеймер:  [AUTO — не удалять]
  "All prices are European averages, benchmarked against supplier quotes in [country из B.1 reference-country] as the reference example. micro.svita.ai bears no liability for discrepancies with actual supplier prices in your local market — check the latest list via your cabinet."
```
ЗАПРЕЩЕНО: имена вендоров, конкретные модели, цены с точностью до копейки.

## E.13 · Page 13 — Financial model
```
Eyebrow:     12 · Financial model
Заголовок:   Break-even in sight.
4 stat-box:
  Monthly revenue (month 6):  € [из B.2]
  Monthly operating cost:     € [из B.2 rent + labour + rev × COGS%]
  Contribution margin:        € [рев − кост]
  Payback:                    ~[budget/margin] mo
Дисклеймер:  [AUTO — не удалять]
  "Figures are a planning benchmark only. Local rent, labour, and product mix will shift them. This brandbook is the complete deliverable — no separate spreadsheet is provided."
```
ЗАПРЕЩЕНО: ROI %, IRR, обещания Excel/источников.

## E.14 · Page 14 — Launch plan
```
Eyebrow:     13 · [B.1.weeks]-week launch plan
Заголовок:   Signing to open.
Таблица (обрезается до weeks):
  Week 1 → Lease signed, deposit paid, measurements taken
  Week 2 → Concept finalized with landlord, permits filed
  Week 3 → Contractor onboarded, demolition if needed
  Week 4 → Fit-out in progress, equipment ordered
  Week 5 → Interior finishes, signage produced
  Week 6 → Staff hiring, training, suppliers locked
  Week 7 → Soft-opening week, menu dial-in, launch
```
Можно кастомизировать конкретную фразу недели — оставь формат, переписывай текст.

## E.15 · Page 15 — Back cover
```
Заголовок:   Ready.
Sub:         [A.2 полное имя]
Tagline:     [A.3]
Meta:        svita.ai · Concept marketplace
             [A.1 slug] · This concept's ID
```

---

# F · ДОПОЛНИТЕЛЬНО (опционально)

## F.1 · Уникальные продукты/услуги для этой концепции
```
[FILL: 
  - Zapiekanka Tradycyjna (mushroom + cheese) — €4
  - Zapiekanka Klasyk (ham + pickle + mushroom) — €5
  - Zapiekanka ze Szefem (chef's special rotating) — €6
  - Frytki — €3
  - Napoje — €2
]
```
- Это попадёт в prompt для `04-packaging` и `05-signage` (чтобы меню было консистентным)

## F.2 · Целевая аудитория (1-2 предложения)
```
[OPTIONAL: Office workers 25-40 on lunch break + evening students heading home via tram. Average visit: 3 minutes.]
```

## F.3 · Первичный позиционинг vs что это НЕ
```
Это:      [FILL: a 3-item window kiosk, not a restaurant]
Это не:   [FILL: не ресторан, не кафе со столиками, не food truck на колёсах, не pop-up]
```
- Помогает Каю не генерить "ресторан с плитой и залом" когда речь о киоске

---

# G · CHECKLIST ПЕРЕД СДАЧЕЙ

Кай пройдёт это перед загрузкой. Ты можешь пройти сам для проверки себя:

- [ ] A.2 brand name написано идентично во всех 6 фото
- [ ] A.4 founding year один и тот же везде (если есть)
- [ ] A.5 cross-detail (номер/улица/места) идентичны на фото
- [ ] B.1 цифры (площадь/бюджет/weeks) совпадают на странице 1, 2, 11, 12, 13, back cover
- [ ] C.1 палитра — ровно 5 hex, не больше
- [ ] C.5 blacklist заполнен (что НЕ должно быть)
- [ ] D.1–D.6 все 6 описаний детальны: кадр, ракурс, видимые элементы, люди
- [ ] E.12 дисклеймер CAPEX оставлен auto-версия
- [ ] E.13 дисклеймер "complete deliverable" оставлен auto-версия
- [ ] F.1 меню/услуги перечислены с ценами в €
- [ ] Нигде не обещается Excel / source files / spreadsheet

---

# H · ФОРМАТ ОТДАЧИ КАЮ

Когда заполнил — просто пиши: «Кай, вот spec, делай». Заполненный файл должен лежать в:
```
labs67/micro.svita.ai/docs/concepts/{slug}.spec.md
```

Кай:
1. Читает этот spec
2. Генерит 6 изображений с nano-banana (reference chain: 01 → рефс для 02-06)
3. Апдейтит `catalog.json` + Supabase `concepts_catalog`
4. Запускает `generate_brandbook.py {slug}` → HTML
5. Заливает HTML в Supabase `concept_brandbooks`
6. Пушит изображения в GitHub Pages
7. Проходит checklist раздела G
8. Если что-то не сходится — возвращает тебе с отметкой что не сошлось

---

# I · ПРОШЛЫЕ ОШИБКИ (reference, чтобы помнить)

| Что | Где было | Почему плохо |
|---|---|---|
| 4 разных brand name | wien-kaffee-tram | Клиент видит 4 разных бизнеса |
| 3 разных года | wien-kaffee-tram | Ломает доверие |
| 2 разных номера | wien-kaffee-tram | Нарушает consistency |
| Меню в zł, сайт в € | warsaw-zapiekanka-okno (до фикса) | Клиент путается в валюте |
| 01 минимал / 02 ярмарка / 03 ресторан | warsaw-zapiekanka-okno (до фикса) | 3 бренда в одной карточке |
| Нет layout | все 100 до фикса | Непонятно как расставить |
| Обещали Excel | брендбук + view.html | Риск возвратов |
| Цены без дисклеймера | брендбук CAPEX | Юрриск |
