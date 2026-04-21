# MICRO.SVITA.AI — CONCEPT BRANDBOOK SOP
*v3 · 2026-04-21 · добавлена Palette Matrix для культурного разнообразия*

**Мастер-путь:** `~/labs67/micro.svita.ai/`
**Источники правды:**
- `presentations/_HOW_TO_ORDER.md` — триггеры и форматы ввода
- `presentations/_MASTER_PROMPT.md` — 25 слайдов × спека
- `presentations/manifest.json` — slug → путь к PDF
- `presentations/_SOP.md` — **этот файл**

---

## 🔢 NUMBERING RULE — ИСКЛЮЧИТЕЛЬНО ВСЕГДА

Ко всем названиям концепций **ВСЕГДА** добавлять номер из NN-префикса папки.

**Формат:** `NN · <BRAND>` (пример: `01 · CRYO 3`, `07 · ZAPIEX`, `23 · PAD THAI STREET`)

**Где:** slide-01 cover, slide-02, slide-14 identity, slide-25 CTA, `manifest.json.name`, `shop.html`/`view.html` карточки, Supabase `concepts_catalog.name`, Obsidian.

Имя файла PDF — без номера (номер уже в NN-папке). Если видишь slide-01 без `NN · <BRAND>` — переделать.

---

## 🔒 КРИТИЧНЫЕ ПРАВИЛА

- **nano-banana PRO** (не flash) — всегда
- **25 слайдов** ровно, не меньше
- **16:9** всегда, page-mark `NN / 25` top-right
- **Единая палитра** внутри одной концепции через `reference_images`
- **РАЗНЫЕ палитры** между разными концепциями (см. Palette Matrix)
- No guarantees · no stock smiles · no tables with borders
- Суффикс ` [good]` — только господин. Сессия **не ставит**.
- Папки с `[good]` не трогать.
- `manifest.json` обновлять обязательно
- git push **сразу** после commit
- Obsidian vault (`~/labs67/tools/labs67-vault/`) логирование — обязательно после каждой concept-session

---

## 💰 ЦЕНЫ (ФИКС — 2 TIER)

| Tier | EUR | Логика |
|------|-----|--------|
| **Concept** | **€49** | brandbook PDF, несколько покупателей на один slug |
| **Exclusive** | **€149** | slug снимается из shop.html после покупки, один владелец |

Выше €149 — запрещено. На slide-25 (CTA) — только эти 2 tier.

---

## 🎨 PALETTE MATRIX — ГЛАВНЫЙ ИСТОЧНИК РАЗНООБРАЗИЯ

**Почему это правило №1:** без явной культурной палитры все 70 концепций сливаются в одну «холодную скандинавскую» синеватую студию. Брендбуки должны выглядеть как 70 **разных миров**.

### Шаг 1 — Определить культурный якорь

| Регион / культура | Ключ-цвета (HEX) | Материалы | Mood-референс |
|---|---|---|---|
| **Slavic Polish / Belarusian** | cobalt #2B4C8C · cream #F3EAD9 · brass · ruby red #A8312A | Bolesławiec керамика, лён, дуб, белёная штукатурка | Poznań rogale, Krakow obwarzanek, ручник |
| **Nordic / Scandinavian** | matte black · ice blue · pearl white · warm oak | Oak, concrete, brushed steel, wool felt | Hay, Kinfolk, Muji × Copenhagen |
| **Mediterranean IT/ES** | terracotta #C7755B · olive #7A8B4F · cream · brass | Terracotta, travertine, limestone, rattan | Ottolenghi, Cereal Med |
| **French / Parisian** | oxblood #7B2C23 · cream marble · honey oak · brass | Marble, zinc bar, oak herringbone, iron | Septime, Le Servan, Apartamento Paris |
| **Japanese / minimal** | charcoal · rice #F5EEE0 · hinoki · sumi ink | Cedar, rice paper, raw linen, unglazed ceramic | Mingei, BAMFORD, Sophie Lou Jacobsen |
| **Thai / SEA street** | saffron #E8A03C · tamarind · lime · teak | Woven bamboo, teak, brass, painted metal, banana leaf | Krua, Nahm, Bangkok street |
| **Levantine / Middle East** | pomegranate #9B2C2C · turmeric · olive · limestone · indigo tile | Limestone, brass, glazed tile, olive wood | Beirut mezze, Ottolenghi, Jerusalem |
| **Alpine / Swiss-Austrian** | forest green #2F4F3A · cream wool · smoked pine · brass | Larch wood, sheepskin, enamel, copper | Zurich fondue, Alpine chalet |
| **Iberian / Portuguese** | azulejo #2A5A8E · coral #E07856 · cork · whitewash | Azulejo tile, cork, limewash, oxidised brass | Lisboa pastelaria, Porto tiles |
| **Baltic / Estonian-Latvian** | moss #5A6A42 · birch white · rust #A8512B · rye | Birch, linen, rye straw, dark iron | Riga rye bakery, Tallinn sauna |
| **Berlin / Neue industrial** | concrete · black metal · tan leather · acid green | Concrete, steel beam, oak floor | Mitte galleries, Berghain aesthetic |
| **Lisbon / Latin-warm** | pink plaster #E8B4A8 · sage · azulejo white · aged gold | Limewash, tile, cork, rattan | LX Factory, Lisboa-Apartamento |
| **British / London editorial** | bottle green #1F3E34 · clotted cream · oxblood · brass | Oak panel, green marble, leather, brass | Violet bakery, The Gentlewoman |

### Шаг 2 — Наложить категорию

| Категория | Что добавить | Ритуал-paттерн |
|---|---|---|
| **food · restaurant** | тёплые mid-tones, свечной свет | руки, тесто, пар, капли соуса |
| **food · cafe/bakery** | молочные, тёплый brown | утренний свет, мука, кирпич |
| **beauty · barber** | матовый чёрный, bronze, tungsten | зеркала, пена, straight razor |
| **beauty · salon** | rose-gold, powder, мрамор | шёлк, цветок, макро рук |
| **wellness · sauna/spa** | пар, мокрое дерево, cold pool | пар-мист, полотенце, босые ноги |
| **wellness · yoga/pilates** | muted earth, sand, rattan | дыхание, reformer, босое тело |
| **retail · concept store** | галерейный white space, bold accent | предметы-герои на постаменте |
| **craft · ceramics/glass** | печная охра, feuer-red, пыль | руки в глине, печь, полки |
| **service · optometry/dental** | clinical white, soft green, steel | оптика, инструменты, портрет |
| **education · music/language** | книжный beige, pencil, green board | учебник, метроном, окно-класс |
| **repair · watches/leather** | tobacco, brass, green cloth | лупа, пинцеты, полка |
| **health · osteo/physio** | soft cream, sage, light wood | массажный стол, свечи, кальки |

### Шаг 3 — Правило 5 цветов

**1 hero accent + 2-3 нейтральных + 1 текстура/материал = 5 max**

Примеры:
```
stockholm-cryo-bar       → Nordic    × wellness  → matte-black · ice-blue(hero) · pearl-white · oak · steam
warsaw-zapiekanka-okno   → Slavic PL × food      → cobalt(hero) · cream · brass · char · Bolesławiec
paris-bistro-petit       → French    × food      → oxblood(hero) · marble · honey oak · brass · candles
bangkok-pad-thai         → Thai      × food      → saffron(hero) · tamarind · lime · teak · bamboo
beirut-mezze-den         → Levantine × food      → pomegranate(hero) · turmeric · olive · tile · indigo
porto-tile-studio        → Iberian   × craft     → azulejo(hero) · coral · cork · whitewash
helsinki-sauna-club      → Baltic    × wellness  → birch · rye(hero) · steam · black iron
berlin-code-camp         → Berlin    × education → concrete · acid-green(hero) · tan leather · steel
krakow-obwarzanek-cart   → Slavic PL × food      → cobalt(hero) · flour-cream · brass · rye brown
rome-posture-clinic      → Mediter.  × health    → travertine(hero) · sage · cream linen · brass
```

### Шаг 4 — Red Flags (увидишь → стоп, передумай)

- Все 70 концепций в одной палитре «cold blue + oak» → палитра не выбрана, дефолт Nordic
- Parisian bistro в «Muji-beige» → региональный якорь проигнорирован
- Thai street food стерильный «gallery mood» → потерян ритуал (у стритфуда пар, масло, ярки)
- По умолчанию везде «pearl white + warm oak» → безопасная лень, а не дизайн

### Шаг 5 — Промпт-блок палитры (копировать в каждый slide-prompt)

```
Cultural grounding: <регион>, authentic <city> mood. NOT generic, NOT Nordic-by-default.
STRICT palette: <hex1>, <hex2>, <hex3>, <hex4>. Dominant accent: <hero>.
Materials in frame: <oak/terracotta/marble/linen/brass/concrete/etc>. Texture must read.
NO cold-blue ice tones unless explicitly in palette. NO Muji-beige default.
```

---

## 📋 8 ФАЗ

### 0 · RECON — выбираем цель
```bash
cd ~/labs67/micro.svita.ai/presentations
ls -d */ | grep -v '\[good\]' | grep -v '^_'
```
Приоритет: waitlist → заказ господина → старые WIP без PDF → новые TODO.

### 1 · BRIEF — приём ТЗ

**Формат** (из `_HOW_TO_ORDER.md`):
- минимум: `брендбук: <slug>`
- обычный (5 строк): slug · город · палитра · фишка · оборудование
- полный: YAML со всеми полями

**Обязательно до старта генерации:**
1. Определить **регион** (культурный якорь)
2. Определить **категорию** (food/beauty/…)
3. Выписать **палитру** из PALETTE MATRIX
4. Описать **ритуал** (1 жест)
5. Подтверждение господину:
```
Беру <slug>
 · name · city · m² · weeks
 · регион + категория + ритуал
 · palette: <hero> + <neutrals> + <material>
 · reference mood: <3-name-drop refs>
 · ETA ~45 мин
Поехали?
```

### 2 · PROMPT — nano-banana PRO

```python
mcp__nano-banana__set_model(model="pro", conversation_id="<slug>")
mcp__nano-banana__set_aspect_ratio(aspect_ratio="16:9", conversation_id="<slug>")
```

Критичные правила тона (из `_MASTER_PROMPT.md`):
1. **Inspire & awe** — эстетика эмоционального погружения
2. **No guarantees** — никаких «гарантированный успех», «100 % прибыль»
3. **Strictly no tables** — никаких таблиц с границами, только hairlines / pull-quotes

Визуал: 16:9 · thin serif title top-left · `NN / 25` top-right · единая палитра · no stock-smile · no foreign logos · no emojis · soft natural DoF · magazine-editorial.

### 3 · PLAN — структура 25 слайдов

| Блок | Слайды |
|------|--------|
| **I · OPEN (1-3)**          | cover · definition · axonometric |
| **II · EXPERIENCE (4-9)**   | facade · arrival · interior · materials · ritual · still-life |
| **III · PRODUCT (10-14)**   | equipment · menu · takeaway · signage · identity-board |
| **IV · BUSINESS (15-19)**   | economics · capex · timeline · team · customer-moment |
| **V · WHY (20-25)**         | personas · channels · risks · why-now · what-you-get · CTA |

Слайд **14 (IDENTITY BOARD)** — audit-якорь: палитра + шрифты + материалы. Проверяем консистентность слайдов 1-13 против 14. Если разошлись — регенерируем отклонения.

Слайд **25 (CTA)** — **только 2 tier: €49 Concept / €149 Exclusive**. Ничего выше.

### 4 · BUILD — генерация

**Структура папки:**
```
presentations/NN-<slug>/
  ├─ slide-01-cover.png      ↔   slide-14-identity.png
  ├─ slide-02-definition     ↔   slide-15-economics
  ├─ …                       ↔   slide-25-cta
  ├─ {BRAND}_deck.pdf        (BRAND = UPPERCASE-DASH: CRYO-3, SEN-LAB, ZAPIEX)
  └─ _photos/                (опц. сырые исходники)
```

**Номер NN:**
```bash
next=$(( $(ls presentations/ | grep -oE '^[0-9]+' | sort -n | tail -1) + 1 ))
mkdir "presentations/$(printf '%02d' $next)-<slug>"
```

**Порядок генерации:**
1. `slide-01-cover.png` — БЕЗ reference, задаёт стиль
2. `slide-02 … slide-25` — **с** `reference_images=["slide-01-cover.png"]` для единой палитры
3. После каждого слайда — визуальный чек: в палитре? лица живые? текст чистый?
4. Не двигаемся дальше, пока текущий слайд не ок

**Сборка PDF (Pillow):**
```python
from PIL import Image; import glob
slides = sorted(glob.glob("presentations/NN-<slug>/slide-*.png"))
imgs = [Image.open(s).convert("RGB") for s in slides]
imgs[0].save(f"presentations/NN-<slug>/{BRAND}_deck.pdf",
             save_all=True, append_images=imgs[1:], resolution=200)
```

**Update `manifest.json`:**
```python
import json
m = json.load(open("presentations/manifest.json"))
m["<slug>"] = f"presentations/NN-<slug>/{BRAND}_deck.pdf"
json.dump(m, open("presentations/manifest.json","w"), indent=2, ensure_ascii=False)
```

### 5 · ASSEMBLY — карта файлов

| Что | Куда |
|-----|------|
| 25 PNG слайдов | `presentations/NN-<slug>/slide-NN-*.png` |
| Финальный PDF | `presentations/NN-<slug>/{BRAND}_deck.pdf` |
| Manifest | `presentations/manifest.json` |
| Сырые варианты | `presentations/NN-<slug>/_photos/` (опц.) |
| i18n контент | Supabase `concepts_i18n` × 12 языков через `edit.html` |
| Tier + цены + LS URLs | Supabase `concepts_catalog` (`price_concept=49`, `price_exclusive=149`, `ls_url_concept`, `ls_url_exclusive`) |

### 6 · QA

```bash
open presentations/NN-<slug>/
open presentations/NN-<slug>/{BRAND}_deck.pdf
```

**Чек-лист:**
- [ ] 25 слайдов в папке
- [ ] page-mark `NN / 25` на каждом
- [ ] единая палитра (визуальный diff с cover и с identity-board слайдом 14)
- [ ] **палитра соответствует культурному якорю** (польская концепция = cobalt-cream, НЕ Nordic!)
- [ ] без stock-smile лиц
- [ ] без чужих logos / emoji (кроме `·` `◉` `◆` `✦`)
- [ ] без таблиц с границами
- [ ] без «гарантированный успех»
- [ ] slide-25 CTA: **€49 Concept / €149 Exclusive** (никаких €490)
- [ ] PNG ≥ 1.4 MB каждый
- [ ] brand abbreviation в PDF-имени

**Localhost preview:**
```bash
cd ~/labs67/micro.svita.ai && python3 -m http.server 8000
open "http://localhost:8000/view.html?c=<slug>"
```

**Точечная правка:**
```
переделай slide-15 — цифры поправь на rent €2,400
```
→ регенерирует только один слайд, пересобирает PDF.

### 7 · DEPLOY

```bash
cd ~/labs67/micro.svita.ai
git add presentations/NN-<slug>/ presentations/manifest.json
git commit -m "feat(deck): add <slug> · 25-slide brandbook · <регион>/<категория> palette"
git push
```

GitHub Pages раздаст за 1-2 мин. Live check:
```bash
open "https://micro.svita.ai/presentations/NN-<slug>/{BRAND}_deck.pdf"
open "https://micro.svita.ai/view.html?c=<slug>"
```

### 8 · CLOSE — финал

**A) Открыть:**
```bash
open ~/labs67/micro.svita.ai/presentations/NN-<slug>/
open ~/labs67/micro.svita.ai/presentations/NN-<slug>/{BRAND}_deck.pdf
```

**B) Shared tracking (CLAUDE.md):**
- `~/labs67/shared/log.md` → `- [Кай] micro.svita: <slug> 25-slide deck v1 pushed → manifest`
- `~/labs67/shared/status.md` → `[x]`
- `memory/open_tasks.md` → синхронизировать

**C) Obsidian vault (`~/labs67/tools/labs67-vault/`) — ОБЯЗАТЕЛЬНО:**
- `Хроника/Сессии.md` → раздел с сегодняшней датой → блок:
  ```
  ### [[micro.svita.ai]] — <slug> brandbook v1
  - 25 слайдов nano-banana PRO
  - Регион: <…> · Категория: <…>
  - Palette: <hero + neutrals + material>
  - Tier: Concept €49 · Exclusive €149
  - Путь: `presentations/NN-<slug>/{BRAND}_deck.pdf`
  - Live: https://micro.svita.ai/view.html?c=<slug>
  ```
- `Сайты/micro.svita.ai.md` → обновить счётчики
- Новый бренд/продукт → `Бренды/<brand>.md`
- `[[wiki-links]]` для связности · русский · без эмодзи · обращение «господин»

**D) Рапорт господину:**
```
✅ <slug> · 25 слайдов · {BRAND}_deck.pdf

Local:    presentations/NN-<slug>/
Live:     https://micro.svita.ai/view.html?c=<slug>
Manifest: обновлён
Регион:   <…> · Категория: <…>
Palette:  <список>
Tier:     Concept €49 / Exclusive €149
Obsidian: Хроника + Сайты + (новый бренд)

Подтверди → добавь ` [good]` к имени папки.
```

**E) Ждём `[good]`** — только господин, сессия не ставит.

---

## 📎 КРАТКАЯ МНЕМОНИКА

```
0 · RECON    → audit presentations/ + waitlist → выбор цели
1 · BRIEF    → регион + категория + ритуал + palette (из PALETTE MATRIX!)
2 · PROMPT   → nano-banana PRO · 16:9 · session=<slug>
3 · PLAN     → 25 слайдов (OPEN · EXPERIENCE · PRODUCT · BUSINESS · WHY)
4 · BUILD    → slide-NN-*.png × 25 + reference_images + {BRAND}_deck.pdf + manifest++
5 · ASSEMBLY → presentations/NN-<slug>/ + БД + LS
6 · QA       → палитра-чек + slide-25 €49/€149 + mobile 375
7 · DEPLOY   → git commit + push СРАЗУ → live check
8 · CLOSE    → open + shared/log + Obsidian + рапорт → ждём [good]
```

---

## ❗ FAQ / ТИПИЧНЫЕ ОШИБКИ

| Ошибка | Причина | Фикс |
|---|---|---|
| Все концепции в cold-blue / Nordic | не выбрана Palette Matrix | **обязательный шаг 1.3** с явным регионом |
| Парижский бистро в Muji-beige | дефолт вместо культуры | прописать `STRICT palette: oxblood, marble, oak, brass` |
| Flash вместо Pro | рыхлый текст, кривая типографика | всегда `model="pro"` |
| Меньше 25 слайдов | недобрендбук | строго 25 |
| Разная палитра между слайдами одной концепции | AI забыл стиль | `reference_images=["slide-01-cover.png"]` в каждом prompt |
| Опечатки на меню/упаковке | AI галлюцинирует текст | «NO text on labels» в промпте, накладывать PIL потом |
| Сам ставлю `[good]` | нарушение feedback_good_marker.md | только господин |
| Таблицы с границами | нарушение _MASTER_PROMPT.md | hairlines / pull-quotes |
| Забыл manifest.json | view.html 404 | обязательный шаг 4 |
| Забыл git push | сайт не обновился | CLAUDE.md: сразу после commit |
| Забыл Obsidian | знания теряются между сессиями | feedback_obsidian_logging.md |
| Цена €490 / €2000 / третий tier | устарело (2-tier модель) | только Concept €49 + Exclusive €149 |
