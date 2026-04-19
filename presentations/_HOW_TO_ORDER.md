# Как заказать мне 25-слайдовый брендбук

## Минимум (одна строка)

```
брендбук: stockholm-cryo-bar
```

Я сам подтяну из БД: name, category, country, size_m2, weeks, tagline, price, ls_url. Соберу палитру под категорию, пропишу 25 слайдов по master-prompt, залью в `presentations/{slug}/` и соберу PDF.

## Обычный запрос (5 строк)

```
брендбук: stockholm-cryo-bar
город: Stockholm, Södermalm
палитра: matte-black, ice-blue, pearl-white, warm-oak
фишка: три минуты в холоде, перед уходом — ginger tea
оборудование: single cryo chamber, LN₂ dewar 35L, booking tablet
```

Палитра и фишка — это то, что я никогда не угадаю из БД. Всё остальное необязательно.

## Полный контроль (если хочешь задать всё сам)

```
брендбук: {slug}
name: {NAME}
category: {food|restaurant|beauty|service|repair|craft|retail|wellness|health|education}
country: {ISO}
city: {city, district}
size_m2: {n}
weeks: {n}
tagline: {одна строка}
palette: {4–6 цветов}
equipment: {3–5 предметов}
audience: {3 персоны}
rituals: {ключевой жест сервиса}
unique: {чем отличается от похожих}
```

## Что я делаю каждый раз

1. Читаю `_MASTER_PROMPT.md` — критические правила (inspire / no guarantees / no tables) и структуру 25 слайдов.
2. Если есть свежий брендбук на диске — подтягиваю цифры (CAPEX, OpEx, break-even) для слайдов 15-16.
3. Генерю 25 PNG в `presentations/{slug}/` через nano-banana, 16:9, единая палитра, page-mark `NN / 25` на каждом.
4. Склеиваю в `{SLUG}_deck.pdf` (Pillow) и открываю.

## Triggers которые точно запускают этот flow

- «сделай брендбук для {slug}»
- «брендбук: {slug}»
- «25 слайдов по {slug}»
- «/deck {slug}»

## Чего я НЕ буду делать без твоего подтверждения

- Перегенерировать уже готовые слайды (если видишь косяк — скажи номер: «переделай slide-15, цифры поправь на 3,200 rent»).
- Публиковать на сайт — deck лежит в `presentations/`, на продакшн не попадает без твоей команды.
- Менять ценники концепции в БД — только если явно попросишь.

## Пример короткого корректирующего запроса

```
переделай slide-23 — вместо "Nordic idea" сделай про семейную культуру матча
```

или

```
переделай весь блок 15-17 — бюджет должен быть меньше, базовая цена €49
```
