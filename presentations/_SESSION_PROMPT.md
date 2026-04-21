# MICRO.SVITA.AI — CONCEPT BRANDBOOK · SESSION PROMPT

*Копируй этот текст в новую Claude-сессию вместе с концепцией. Полный SOP с PALETTE MATRIX и WOW LAYER — в `_SOP.md` рядом.*

---

## 🚀 БЫСТРЫЙ СТАРТ НОВОЙ СЕССИИ

Вариант 1 — **короткая команда** (достаточно, если сессия открыта в `~/labs67/micro.svita.ai/`):
```
Прочитай CLAUDE.md, presentations/_SOP.md и presentations/_SESSION_PROMPT.md — потом берём концепцию <slug>.
```

Вариант 2 — **если сессия в другой директории**:
```
cd ~/labs67/micro.svita.ai
Прочитай CLAUDE.md + presentations/_SOP.md + presentations/_SESSION_PROMPT.md. Берём концепцию <slug>.
```

Вариант 3 — **агент/subagent** (общий prompt-шаблон):
```
Ты работаешь над брендбуком micro.svita.ai. Перед первым действием прочитай:
1. ~/labs67/micro.svita.ai/CLAUDE.md
2. ~/labs67/micro.svita.ai/presentations/_SOP.md
3. ~/labs67/micro.svita.ai/presentations/_SESSION_PROMPT.md
Затем берём <slug> и следуем SOP фазам 0-8.
```

CLAUDE.md загружается автоматически в Claude Code когда `cwd` = директория проекта (или её подпапка) — но явное упоминание гарантирует, что агент точно его перечитает.

---

## 🏆 GOLD STANDARD — сессия 42 / 43 / 94

Эталонные концепции, созданные в одной сессии и выдавшие **лучший уровень SOP**. Любой новый брендбук должен соответствовать их планке — композиция, dramatically, плотность деталей, типографика, палитра-дисциплина, editorial-подача.

| NN | Slug | Brand | Категория | Что особенного |
|---|---|---|---|---|
| **42** | `42-paris-candle-atelier` | CIRE 11 | craft · candles | French palette, medieval ритуал литья, гильдийская типографика |
| **43** | `43-tel-aviv-hummus` | HUMUS 14 (+ BEITEINU) | food · Levantine | warm Levantine palette, руки в тесте, общинный стол |
| **94** | `94-basel-watch-repair` | UHR 3 | repair · watches | tobacco/brass/зелёное сукно, лупа, микродетали |

**Три разные культуры, три разные категории — одинаковый уровень**. Это доказательство, что SOP работает не только на одной эстетике.

### Как применять в задании

1. **В ТЗ всегда строка:**
   ```
   reference: 42-paris-candle-atelier · 43-tel-aviv-hummus · 94-basel-watch-repair
   ```
   (Или выбери 1 самую близкую по категории: craft → 42, food → 43, repair/health/service → 94.)

2. **Агент/сессия перед генерацией** читает через Read:
   - `presentations/<ref>/slide-01-cover.png`
   - `presentations/<ref>/slide-08-ritual.png` (signature moment)
   - `presentations/<ref>/slide-14-identity.png` (типографика/мудборд)
   - `presentations/<ref>/slide-25-cta.png` (CTA-композиция)
   Изучает dramatically / плотность / editorial-подачу.

3. **В nano-banana промптах слайдов 2-25** передавай **несколько reference**:
   ```python
   reference_images=[
     "presentations/NN-<slug>/slide-01-cover.png",                    # палитра своей концепции
     "presentations/94-basel-watch-repair/slide-01-cover.png",        # gold-standard #1
     "presentations/42-paris-candle-atelier/slide-01-cover.png"       # gold-standard #2 (если релевантно по категории)
   ]
   ```

4. **Категорийный mapping** (какой эталон брать):
   - `craft / retail / repair` → 42 (candle atelier)
   - `food / restaurant / beauty-salon` → 43 (hummus)
   - `service / health / wellness / repair-tech / education` → 94 (watch repair)
   - Для универсального fallback — все три.

### Флаг QA

Если слайд новой концепции визуально проигрывает тому же номеру из 42/43/94 — **переделать**. Не «прошло чек-лист», а «соответствует gold-standard».

---

## 🎲 RANDOMIZATION MECHANIC — ОБЯЗАТЕЛЬНО ПЕРЕД ГЕНЕРАЦИЕЙ

Чтобы ни одна концепция не повторяла другую по стилю, палитре, вайбу — используется **детерминированный dice** на 10 осях (region / archetype / hero-hue / palette(5) / mood / light / composition / texture / human / season / time-of-day).

### Правило

**Перед первым вызовом nano-banana** любая сессия **ОБЯЗАНА**:
```bash
cd ~/labs67/micro.svita.ai
python3 scripts/concept_dice.py <slug> --category <cat> --country <ISO> --nn <NN>
```

Скрипт:
1. Бросает кубики детерминированно от `hash(slug)` — один slug = одна комбинация навсегда.
2. Читает `presentations/_DICE_HISTORY.md` — если ≥2 оси совпадают с последними 5 концепциями → перекатывает (variant++).
3. Пишет `presentations/NN-<slug>/concept_dice.json` (машинно-читаемый).
4. Пишет строку в `presentations/_DICE_HISTORY.md` (лог истории, growing append-only).
5. Выводит brief в stdout — вставить **как rigid constraints** в каждый nano-banana промпт.

### Что делать со стандартным dice-результатом

- **Region / Archetype / Palette / Hero hue** — **жёсткий** констрейнт (не менять). Палитра записывается в slide-14 IDENTITY BOARD.
- **Mood / Light / Composition / Texture / Human / Season / Time-of-day** — общий тон **всего декка**. Не рисовать каждый кадр буквально по этим словам, но по общему впечатлению декк должен ложиться в dice.

### Читать перед стартом: что было в последних 5 концепциях

```bash
tail -7 presentations/_DICE_HISTORY.md
```

Если твоя концепция по стилю напоминает одну из последних — **посмотри** какие оси ещё не использовались, скрипт уже это учёл через anti-collision, но глазом свериться полезно.

### Dice НЕ ограничивает воображение

- Dice даёт 8 осей как rigid якоря визуального стиля.
- Всё остальное (ритуал, signature moment, hero persona, необычные детали, странные идеи) — **свободное воображение**, чем оригинальнее тем лучше.
- Dice — это страховка от «ещё одна Muji-beige кофейня», не сценарий концепции.

---

## 🔢 NUMBERING RULE — ИСКЛЮЧИТЕЛЬНО ВСЕГДА

Ко всем названиям концепций **ВСЕГДА** добавлять номер из NN-префикса папки `presentations/NN-<slug>/`.

**Формат:** `NN · <BRAND>` (пример: `01 · CRYO 3`, `07 · ZAPIEX`, `23 · PAD THAI STREET`)

**Где:** slide-01 cover overlay · slide-02 subtitle · slide-14 identity board · slide-25 CTA headline · `manifest.json.name` · `concepts_catalog.name` · shop.html / view.html карточки · Obsidian лог.

**Имя PDF-файла** — без номера (номер уже в папке): `CRYO-3_deck.pdf`, не `01-CRYO-3_deck.pdf`.

**Флаг:** slide-01 без `NN · <BRAND>` → переделать. Сквозной стандарт, не стилистический выбор.

---

## 1 · BRIEF — приём ТЗ

**Форматы ввода (из `_HOW_TO_ORDER.md`):**

**Минимум (1 строка):**
```
брендбук: <slug>
```

**Обычный (5 строк) — рекомендованный:**
```
брендбук: <slug>
город: <City, District>
палитра: <4-6 цветов>
фишка: <ключевой ритуал>
оборудование: <3-5 предметов>
```

**Полный контроль** — полный YAML (name, category, country, size_m2, weeks, tagline, palette, equipment, audience, rituals, unique).

**Подтверждение господину перед стартом:**
```
Беру <slug>
 · NN:          <номер из папки>
 · display:     NN · <BRAND>     ← ОБЯЗАТЕЛЬНО
 · name:        <NAME>
 · city:        <City>
 · <N> m² · <N> weeks
 · palette:     <list>
 · 25 слайдов по _MASTER_PROMPT.md
 · nano-banana PRO · 16:9 · page-mark NN/25
 · ETA: ~45 мин

Поехали?
```

---

## 2 · PROMPT — модель и правила

```python
mcp__nano-banana__set_model(model="pro", conversation_id="<slug>")
mcp__nano-banana__set_aspect_ratio(aspect_ratio="16:9", conversation_id="<slug>")
```

**Критические правила тона (из `_MASTER_PROMPT.md`):**
1. **Inspire & awe** — эстетика и эмоция, погружение не презентация
2. **No guarantees** — запрещены «гарантированный успех», «100% прибыль», «безрисковый», «точно окупится». Цифры = ориентир, не обещание
3. **Strictly no tables** — никаких таблиц с границами. Финансы = вертикальные списки, hairlines, pull-quotes. Kinfolk × Apartamento.

**Жёсткие правила визуала:**
- Aspect ratio: **16:9** всегда
- Typography: thin serif title top-left · **`NN / 25`** top-right · остальное маленький serif
- Название концепции на слайдах 01/02/14/25 — **`NN · <BRAND>`**
- Palette: точно та, что в концепции, без броских акцентов
- People: реальные, облик нации/региона концепции, natural, **NO stock-smile**
- **No logos** кроме самого бренда концепции
- **No emoji** кроме `·` `◉` `◆` `✦`
- Light: мягкий естественный, shallow DoF
- Mood: magazine-editorial, tihi-luxury, не «рекламное»

**Универсальный prompt-шаблон:**
```
Editorial 16:9 brandbook slide NN/25 for "NN · <BRAND>" — <category> in <city>.
<composition: описание кадра>
Tone: Kinfolk × Apartamento magazine-editorial, tihi-luxury.
Page mark "NN / 25" in thin serif top-right.
Concept name lock-up "NN · <BRAND>" in thin serif top-left (slides 01/02/14/25).
Strict palette: <palette>. No other colors.
Thin serif title top-left. Small serif captions. No bold sans.
NO stock smiles. NO emojis. NO tables. NO brand logos except own.
NO "guaranteed-success" language.
Shot on Leica Q3 28mm f/2.8, 8k, subtle film grain, soft natural light, shallow DoF.
```

---

## 3 · PLAN — структура 25 слайдов

### I · OPEN (1-3)
| # | Файл | Смысл |
|---|---|---|
| 01 | `slide-01-cover.png` | Full-bleed hero photo + overlay: **`NN · <BRAND>`** / city / m² / tagline |
| 02 | `slide-02-definition.png` | Крупная строка «что это» + маленькая подпись **`NN · <BRAND>`** + деталь-фото |
| 03 | `slide-03-axonometric.png` | Архитектурная изометрия 30° с подписями, акварель |

### II · EXPERIENCE (4-9)
| # | Файл | Смысл |
|---|---|---|
| 04 | `slide-04-facade.png` | Фасад снаружи, city-context, сдержанная signage |
| 05 | `slide-05-arrival.png` | Момент входа клиента: взгляд, запах, звук |
| 06 | `slide-06-interior.png` | Главное пространство общим планом |
| 07 | `slide-07-materials.png` | Macro textures: дерево, ткань, металл — пальцы в кадре |
| 08 | `slide-08-ritual.png` | Ключевой жест сервиса — один кадр (signature moment) |
| 09 | `slide-09-still-life.png` | 3-4 предмета-героя на нейтральном фоне |

### III · PRODUCT & BRAND (10-14)
| # | Файл | Смысл |
|---|---|---|
| 10 | `slide-10-equipment.png` | Top-down выкладка оборудования с подписями и ценами |
| 11 | `slide-11-menu.png` | 9 квадратных миниатюр + цены в € |
| 12 | `slide-12-takeaway.png` | Flat-lay фирменной упаковки |
| 13 | `slide-13-signage.png` | Вывеска и навигация крупным планом |
| 14 | `slide-14-identity.png` | Логотип **`NN · <BRAND>`**, шрифты, цвета, pattern (мудборд) |

### IV · BUSINESS (15-19)
| # | Файл | Смысл |
|---|---|---|
| 15 | `slide-15-economics.png` | Editorial-список БЕЗ таблицы: числа = pull-quotes, hairlines |
| 16 | `slide-16-capex.png` | Donut/stack chart + компоненты |
| 17 | `slide-17-timeline.png` | Gantt-like горизонталка по 8 неделям |
| 18 | `slide-18-team.png` | 2-3 роли, иконки/силуэты, зоны ответственности |
| 19 | `slide-19-moment.png` | After-service euphoria, живой человек |

### V · WHY & HOW (20-25)
| # | Файл | Смысл |
|---|---|---|
| 20 | `slide-20-personas.png` | 3 персоны × имя/город/почему приходит |
| 21 | `slide-21-channels.png` | 4 канала × tone-of-voice |
| 22 | `slide-22-risks.png` | 3 риска + короткий ответ |
| 23 | `slide-23-manifest.png` | Манифест-абзац на фоне контрастной фотографии |
| 24 | `slide-24-package.png` | What you get: Brandbook · P&L · Floorplan · Equipment · Menu · 8-week · Day-1 |
| 25 | `slide-25-cta.png` | **«Claim this concept NN · <BRAND>»** + €49 Concept / €149 Exclusive + QR на `view.html?c=<slug>` |

---

## 4 · BUILD — производство

**Структура папки:**
```
presentations/NN-<slug>/
  ├─ slide-01-cover.png    …   slide-14-identity.png
  ├─ slide-02-definition   …   slide-15-economics
  ├─ …                     …   slide-25-cta
  ├─ {BRAND}_deck.pdf      ← финальный (BRAND UPPERCASE-DASH: CRYO-3, SEN-LAB, ZAPIEX)
  └─ _photos/               (опц. сырые исходники)
```

**Вычисление NN:**
```bash
next=$(( $(ls presentations/ | grep -oE '^[0-9]+' | sort -n | tail -1) + 1 ))
NN=$(printf '%02d' $next)
mkdir "presentations/${NN}-<slug>"
echo "NN = $NN → display name: ${NN} · <BRAND>"
```

**Генерация (порядок):**
```python
# slide 1 — без reference, задаёт стиль
mcp__nano-banana__gemini_generate_image(
  conversation_id="<slug>",
  aspect_ratio="16:9",
  output_path="presentations/NN-<slug>/slide-01-cover.png",
  prompt="…Concept name lock-up 'NN · <BRAND>' top-left thin serif…")

# slides 2-25 — с reference на slide-01 для единой палитры
mcp__nano-banana__gemini_generate_image(
  conversation_id="<slug>",
  aspect_ratio="16:9",
  output_path="presentations/NN-<slug>/slide-NN-theme.png",
  reference_images=["presentations/NN-<slug>/slide-01-cover.png"],
  prompt="…")
```

**Сборка PDF (Pillow):**
```python
from PIL import Image
import glob
slides = sorted(glob.glob("presentations/NN-<slug>/slide-*.png"))
imgs = [Image.open(s).convert("RGB") for s in slides]
imgs[0].save(f"presentations/NN-<slug>/{BRAND}_deck.pdf",
             save_all=True, append_images=imgs[1:], resolution=200)
```

**Update `manifest.json` (с display-name NN · BRAND):**
```python
import json
m = json.load(open("presentations/manifest.json"))
m["<slug>"] = {
    "name": f"{NN} · {BRAND}",                                    # ← NUMBERING RULE
    "pdf":  f"presentations/{NN}-<slug>/{BRAND}_deck.pdf"
}
json.dump(m, open("presentations/manifest.json","w"), indent=2, ensure_ascii=False)
```

**Update Supabase `concepts_catalog.name` = `"NN · BRAND"`** (через edit.html или mcp__supabase).

---

## 5 · ASSEMBLY — карта файлов

| Что | Куда |
|---|---|
| 25 PNG слайдов | `presentations/NN-<slug>/slide-NN-*.png` |
| Финальный PDF | `presentations/NN-<slug>/{BRAND}_deck.pdf` |
| Manifest | `presentations/manifest.json` (`name: "NN · BRAND"` + `pdf:` путь) |
| Сырые варианты | `presentations/NN-<slug>/_photos/` (опц.) |
| i18n контент | Supabase `concepts_i18n` (12 языков) через `edit.html` |
| Tier + LS URLs | Supabase `concepts_catalog`: `price_concept=49`, `price_exclusive=149`, `ls_url_concept`, `ls_url_exclusive`, **`name="NN · BRAND"`** |

---

## 6 · QA — проверка

```bash
open presentations/NN-<slug>/
open presentations/NN-<slug>/{BRAND}_deck.pdf
```

**Чеклист:**
- [ ] все 25 слайдов в папке
- [ ] page-mark `NN / 25` на каждом
- [ ] **`NN · <BRAND>`** на слайдах 01, 02, 14, 25
- [ ] единая палитра (visual diff с cover)
- [ ] без стоковых улыбок, чужих logos
- [ ] размер каждой PNG ≥ 400 KB (nano-banana PRO обычно 460-720 KB для 16:9)
- [ ] текст: без «гарантированный успех», «100% прибыль»
- [ ] таблиц с границами нет — только hairlines / pull-quotes
- [ ] эмодзи только `·` `◉` `◆` `✦`
- [ ] slide-25 CTA показывает **€49 Concept / €149 Exclusive** (никаких €490)
- [ ] `manifest.json["<slug>"].name == "NN · BRAND"`
- [ ] `concepts_catalog.name == "NN · BRAND"`

**Localhost preview:**
```bash
cd ~/labs67/micro.svita.ai
python3 -m http.server 8000
open "http://localhost:8000/view.html?c=<slug>"
```
Проверить: карточка в `shop.html` (показывает `NN · <BRAND>`) · iframe `view.html?c=<slug>` · tier-кнопки ведут на LS · mobile 375px.

**Точечная правка:**
```
переделай slide-15 — цифры поправь на rent €2,400
```
→ регенерируется ТОЛЬКО один слайд, пересобирается PDF.

---

## 7 · DEPLOY

```bash
cd ~/labs67/micro.svita.ai
git add presentations/NN-<slug>/ presentations/manifest.json
git commit -m "feat(deck): add NN · <BRAND> · 25-slide brandbook"
git push
```

GitHub Pages раздаст за 1-2 мин. **Push СРАЗУ после commit** (CLAUDE.md).

**Live check:**
```bash
open "https://micro.svita.ai/presentations/NN-<slug>/{BRAND}_deck.pdf"
open "https://micro.svita.ai/view.html?c=<slug>"
```

---

## 8 · CLOSE — финал

**A) Открыть результат:**
```bash
open ~/labs67/micro.svita.ai/presentations/NN-<slug>/
open ~/labs67/micro.svita.ai/presentations/NN-<slug>/{BRAND}_deck.pdf
```

**B) Shared tracking (CLAUDE.md):**
- `~/labs67/shared/log.md` → `- [Кай] micro.svita: NN · <BRAND> 25-slide deck v1 pushed → manifest`
- `~/labs67/shared/status.md` → отметить `[x]`
- `memory/open_tasks.md` → синхронизировать

**C) Obsidian vault (`~/labs67/tools/labs67-vault/`) — ОБЯЗАТЕЛЬНО:**
- `Хроника/Сессии.md` → если раздела с датой нет — создать → дописать:
  ```
  ### [[micro.svita.ai]] — NN · <BRAND> brandbook v1
  - 25 слайдов nano-banana PRO
  - Tier: Concept €49 · Exclusive €149
  - Palette: <list>
  - Путь: `presentations/NN-<slug>/{BRAND}_deck.pdf`
  - Live: https://micro.svita.ai/view.html?c=<slug>
  ```
- `Сайты/micro.svita.ai.md` → обновить счётчики (концепции готовы: N+1)
- Новый бренд → создать `Бренды/<brand>.md`
- `[[wiki-links]]` для связности, русский, без эмодзи
- Обращение: «господин» / «Артём», не «user»

**D) Рапорт господину:**
```
✅ NN · <BRAND> готов · 25 слайдов · {BRAND}_deck.pdf

Local:    presentations/NN-<slug>/
Live:     https://micro.svita.ai/view.html?c=<slug>
PDF:      https://micro.svita.ai/presentations/NN-<slug>/{BRAND}_deck.pdf
Manifest: обновлён (name: "NN · <BRAND>")
Tier:     Concept €49 · Exclusive €149
Палитра:  <list>

Obsidian логирование: Хроника + Сайты/micro.svita.ai
Если всё ок — добавь ` [good]` к имени папки.
```

**E) Ожидание `[good]`:**
Господин делает вручную:
```bash
mv "presentations/NN-<slug>" "presentations/NN-<slug> [good]"
# + URL-encode space в manifest.json.pdf (%20%5Bgood%5D)
git commit -am "qa: mark NN · <BRAND> as good"
git push
```
**Сессия НЕ ставит `[good]` сама.**

---

## 📎 КРАТКАЯ МНЕМОНИКА

```
0 · RECON     → audit presentations/ + waitlist → выбор цели → фиксируем NN
1 · BRIEF     → концепция из _HOW_TO_ORDER (1/5/полный) → display = NN · <BRAND>
2 · PROMPT    → nano-banana PRO · 16:9 · session=<slug> · NN · <BRAND> в промптах
3 · PLAN      → 25 слайдов (OPEN · EXPERIENCE · PRODUCT · BUSINESS · WHY)
4 · BUILD     → slide-NN-*.png × 25 → {BRAND}_deck.pdf → manifest.name = "NN · <BRAND>"
5 · ASSEMBLY  → всё в presentations/NN-<slug>/ + БД name обновлён
6 · QA        → PDF + localhost + mobile 375 + €49/€149 + NN · <BRAND> check
7 · DEPLOY    → git commit + push СРАЗУ → live check
8 · CLOSE     → open + shared/log + Obsidian + рапорт → ждём [good]
```

---

## ❗ FAQ / ТИПИЧНЫЕ ОШИБКИ

| Ошибка | Причина | Фикс |
|---|---|---|
| **Нет `NN · <BRAND>` на slide-01/02/14/25** | ИИ забыл правило | явный lock-up в промпте, переделать |
| **manifest.json без `name` поля** | старый формат | `{"name": "NN · <BRAND>", "pdf": "…"}` |
| **concepts_catalog.name без номера** | прошлая версия | UPDATE на `NN · <BRAND>` |
| Flash вместо Pro | рыхлый текст, кривая типографика | всегда `model="pro"` |
| Меньше 25 слайдов | недобрендбук, не подходит для Exclusive | строго 25 |
| Папка без NN-префикса | ломает сортировку | всегда `NN-<slug>` |
| Сам ставлю `[good]` | нарушение feedback_good_marker.md | только господин |
| Таблицы с границами | нарушение _MASTER_PROMPT.md | hairlines / pull-quotes |
| Stock-smile лица | AI-артефакт | явный `NO stock smiles` в промпте |
| Разная палитра | AI забыл стиль | `reference_images=["slide-01-cover.png"]` |
| Опечатки на меню | AI галлюцинирует текст | `NO text` в промпте, накладывать PIL потом |
| Забыл manifest.json | view.html 404 | обязательный шаг 4 |
| Забыл git push | сайт не обновился | CLAUDE.md: сразу после commit |
| Забыл Obsidian | знания теряются | feedback_obsidian_logging.md |
| Цена €490/€2000/€999 | ИИ придумал | FIXED: только €49 + €149 |
| Третий tier (AI/Premium) | устарело (старая 3-tier модель) | только 2 tier теперь |

---

### Куда положить этот текст

```bash
# Вариант A — обновить память для всех будущих Claude-сессий:
cp presentations/_SESSION_PROMPT.md ~/.claude/projects/-Users-labs67prot101/memory/micro_svita_concept_sop.md

# Вариант B — рядом с мастер-файлами в repo (уже здесь):
~/labs67/micro.svita.ai/presentations/_SESSION_PROMPT.md

# Commit & push:
cd ~/labs67/micro.svita.ai
git add presentations/_SESSION_PROMPT.md
git commit -m "docs: session prompt v4 — numbering rule NN · <BRAND>"
git push
```

**Рекомендация:** оба места. Memory подхватится любой Claude-сессией автоматически, файл в repo — человеком или агентом с диска проекта.
