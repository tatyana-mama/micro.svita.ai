# SVITA — 25-slide deck generator

## CRITICAL · TONE, EMOTION & FORMATTING

1. **Focus on Inspiration & Awe.** Главная цель — произвести глубокое эстетическое и эмоциональное впечатление. Текст и визуал должны будоражить воображение, вызывать мурашки и жгучее желание воплотить идею в жизнь. Погружать в атмосферу и детали — не презентовать, а проживать.
2. **No guarantees.** Запрещены фразы о гарантиях: «гарантированный успех», «100 % прибыль», «безрисковый старт», «точно окупится». Вдохновлять видением, а не сказками про лёгкие деньги. Цифры — как планировочный ориентир, не обещание.
3. **Strictly no tables.** Никаких сухих таблиц с границами. Финансовые метрики, сметы, KPI — только элегантные вертикальные списки, текстовые блоки с hairlines или «pull-quote» большими цифрами. Как в Kinfolk или Apartamento, не как в Excel.


## Как пользоваться
Присылай концепцию в формате:

```
CONCEPT
slug: stockholm-cryo-bar
name: CRYO 3
category: wellness
country: SE
city: Stockholm
size_m2: 18
weeks: 8
palette: matte-black, ice-blue, pearl-white, warm-oak
tagline: three-pod cryotherapy studio
equipment:
  - whole-body cryo chamber (matte black, –140 °C)
  - LN₂ dewar 35 L with copper gauge
  - booking tablet on oak stand
  - vitals kit (pulse-oximeter + thermometer)
  - guest robe + slippers
audience: post-workout athletes · stressed executives · recovery-focused travellers
rituals: 3-min session → hot ginger tea → 10-min recovery bench
unique: only cryo studio with linen-curtain recovery nook and Arctic-birch scent
```

Я сделаю 25 слайдов ровно по структуре ниже, каждый 16:9, в единой палитре концепции, подписанный `X / 25`.

## Жёсткие правила визуала
- **Aspect ratio:** 16:9 всегда
- **Typography:** thin serif title top-left, `NN / 25` top-right page-mark, всё остальное маленьким serif-ом
- **Palette:** ровно та, что в концепции; без броских акцентов
- **People:** только реальные, облик нации/региона концепции, natural, no stock-smile
- **No logos** кроме самого бренда концепции
- **No emoji** кроме тонких миниатюрных геометрических отметок (•, ◉, ◆, ✦)
- **Light:** мягкий естественный, shallow DoF
- **Mood:** magazine-editorial, tihi-luxury, не "рекламное"

## Структура 25 слайдов

### I · OPEN (1–3)
1. **COVER** — full-bleed hero photograph + название и метаданные оверлеем
2. **DEFINITION** — одна крупная строка "что это" + маленькая подпись + деталь-фото
3. **AXONOMETRIC LAYOUT** — архитектурная изометрия 30°, подписи элементов, акварель

### II · EXPERIENCE (4–9)
4. **FACADE** — фасад снаружи, city-context, сдержанная signage
5. **ENTRY MOMENT** — момент когда клиент входит: взгляд, запах, звук
6. **INTERIOR WIDE** — главное пространство общим планом
7. **MATERIAL CLOSE-UP** — textures: дерево, ткань, металл — пальцы в кадре
8. **SIGNATURE RITUAL** — ключевой жест сервиса (один кадр)
9. **DETAIL STILL-LIFE** — три-четыре предмета-героя на нейтральном фоне

### III · PRODUCT & BRAND (10–14)
10. **EQUIPMENT KIT** — top-down выкладка оборудования с подписями и ценами
11. **MENU / SERVICES GRID** — 9 квадратных миниатюр + цены
12. **PACKAGING / WELCOME KIT** — flat-lay фирменной упаковки
13. **SIGNAGE / WAYFINDING** — вывеска и навигация крупным планом
14. **IDENTITY BOARD** — логотип, шрифты, цвета, pattern (мудборд)

### IV · BUSINESS (15–19)
15. **UNIT ECONOMICS** — вертикальный editorial-список (без таблицы): цифры как pull-quotes, thin hairlines между строками, одна строка = одна мысль («rent · 18 m² — €2,400 / month»)
16. **CAPEX BREAKDOWN** — donut/stack чарт + компоненты
17. **8-WEEK LAUNCH TIMELINE** — gantt-like горизонталка по неделям
18. **TEAM ROLES** — 2–3 роли, иконки/силуэты, зоны ответственности
19. **CUSTOMER MOMENT** — after-service euphoria, живой человек

### V · WHY & HOW (20–25)
20. **AUDIENCE PERSONAS** — 3 персоны × имя/город/почему приходит
21. **MARKETING CHANNELS** — 4 канала × tone-of-voice
22. **RISKS & MITIGATIONS** — 3 риска + короткий ответ
23. **WHY NOW** — один манифест-абзац на фоне контрастной фотографии
24. **WHAT YOU GET** — содержимое пакета (Brandbook, P&L, Floorplan, Equipment list, Menu, 8-week plan, Day-1 checklist)
25. **CALL TO ACTION** — "Claim this concept" + 3 tier prices + QR на view.html?c={slug}

## Генерация
- Каждый слайд — отдельный PNG `slide-NN-theme.png` в `presentations/{slug}/`
- Nano-banana 16:9
- На текстовые слайды (definition, risks, timeline) текст пишу внутри prompt — модель рендерит в типографике editorial-stиля
- Цифры — placeholder, подгоняются к реальным брендбук-данным перед отдачей клиенту

## Проверки перед отгрузкой
- Все 25 слайдов в папке
- Page-mark `NN / 25` на каждом
- Единая палитра (diff с cover)
- Без стоковых улыбок, рекламных штампов, logos чужих брендов
- Размер каждой картинки ≥ 1.4 MB (значит хорошо детализирована)
