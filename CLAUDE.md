# micro.svita.ai — ПРАВИЛА СЕССИИ

> **ОБЯЗАТЕЛЬНО при старте:** если задача связана с концепцией / брендбуком / `presentations/` — прочитай оба файла **до первого действия**:
>
> 1. [`presentations/_SOP.md`](presentations/_SOP.md) — полный протокол (PALETTE MATRIX, WOW LAYER, 25-slide spec, фазы 0-8)
> 2. [`presentations/_SESSION_PROMPT.md`](presentations/_SESSION_PROMPT.md) — короткая копируемая версия с NUMBERING RULE

## 🏆 GOLD STANDARD

Эталонные брендбуки — сессия, выдавшая лучший уровень по SOP:
- [`42-paris-candle-atelier`](presentations/42-paris-candle-atelier/) · CIRE 11 · craft
- [`43-tel-aviv-hummus`](presentations/43-tel-aviv-hummus/) · HUMUS 14 · food
- [`94-basel-watch-repair`](presentations/94-basel-watch-repair/) · UHR 3 · repair/service

Любая новая концепция должна **соответствовать** их планке: dramatically, плотность, типографика, editorial-подача. В ТЗ всегда строка `reference: 42 · 43 · 94` (или одна ближайшая по категории). Подробности применения — в `presentations/_SESSION_PROMPT.md`.

## Ключевые инварианты (не нарушать)

- **NUMBERING RULE:** название концепции **ВСЕГДА** идёт как `NN · <BRAND>` (пример: `01 · SEN LAB`, `07 · ZAPIEX`). Применяется на slide-01 / 02 / 14 / 25, в `manifest.json.name`, в `concepts_catalog.name`, в `shop.html` / `view.html` карточках, в Obsidian логе. Без исключений.
- **Модель:** nano-banana **PRO** (не flash), 16:9, page-mark `NN / 25` top-right.
- **Tier:** только 2 — `Concept €49` / `Exclusive €149`. Никаких €490, €2000, AI/Premium.
- **25 слайдов** ровно — не 13, не 8, не 24.
- **Папки с ` [good]`** — не трогать. Суффикс ставит только господин после QA.
- **git push СРАЗУ** после commit (господин проверяет на живом сайте).
- **Obsidian log** обязателен: `~/labs67/tools/labs67-vault/Хроника/Сессии.md` + `Сайты/micro.svita.ai.md`.

## Рабочие пути

| Что | Путь |
|---|---|
| Мастер-директория | `~/labs67/micro.svita.ai/` |
| SOP полный | `presentations/_SOP.md` |
| SOP короткий для новой сессии | `presentations/_SESSION_PROMPT.md` |
| Мастер-спека 25 слайдов | `presentations/_MASTER_PROMPT.md` |
| Форматы ввода ТЗ | `presentations/_HOW_TO_ORDER.md` |
| Manifest (slug → PDF) | `presentations/manifest.json` |
| Каталог фронта | `data/catalog.json` (поле `hero_image` → cover концепции) |
| Supabase проект | `ctdleobjnzniqkqomlrq` · таблица `concepts_catalog` |
| Obsidian vault | `~/labs67/tools/labs67-vault/` |

## Память агента (читать при релевантных задачах)

- [`feedback_concept_numbering.md`](../../.claude/projects/-Users-labs67prot101/memory/feedback_concept_numbering.md) — правило `NN · <BRAND>`
- [`micro_svita_concept_sop.md`](../../.claude/projects/-Users-labs67prot101/memory/micro_svita_concept_sop.md) — полная версия SOP в memory (синхронизирована с `presentations/_SOP.md`)
- [`micro_svita_state.md`](../../.claude/projects/-Users-labs67prot101/memory/micro_svita_state.md) — архитектура сайта, RPC, Supabase схема
- [`feedback_good_marker.md`](../../.claude/projects/-Users-labs67prot101/memory/feedback_good_marker.md) — правило папок `[good]`
- [`feedback_obsidian_logging.md`](../../.claude/projects/-Users-labs67prot101/memory/feedback_obsidian_logging.md) — обязательный vault-лог после каждой сессии
