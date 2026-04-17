# X.com Starter Pack — micro.svita.ai

5 picture-post combos ready to publish. Rotate languages across posts.

---

## Post 1 — Banner / pinned intro (EN)
**Image:** `01_banner.png` (21:9 → crop to 3:1 for header, or post as-is for landscape banner)

> Opening a micro-business in 2026?
> 
> Don't waste 6 months on branding, menu design, equipment lists, renovation specs.
>
> 200+ ready concepts. Cafés, barbershops, bakeries, salons. Every detail spec'd.
>
> ↓ micro.svita.ai

---

## Post 2 — Launch photo (PL)
**Image:** `02_launch.png`

> Dzień 1. Twoja kawiarnia otwiera się jutro.
> 
> Logo — gotowe.
> Menu — wydrukowane.
> Instrukcja renowacji — w wykonawstwie.
> Obsada kadry — podpisane.
>
> Brandbook to nie logo. To cała firma w jednym PDF-ie.
>
> micro.svita.ai

---

## Post 3 — Brandbook flatlay (RU)
**Image:** `03_brandbook.png`

> Открыть микробизнес — это 400 решений за полгода.
>
> Цвета. Шрифты. Меню. Цены. Зарплаты. Оборудование. RODO. Санэпид.
>
> Мы собрали их все в один брендбук. За €79.
>
> 200+ концепций. Для Варшавы, Берлина, Праги.
>
> micro.svita.ai

---

## Post 4 — Barbershop (EN)
**Image:** `04_barbershop.png`

> A barbershop isn't a haircut business.
> 
> It's tile choices. Chair angles. Music licensing. Waiting-area psychology. Retail display math.
>
> Our concept covers all 217 details. Open your doors faster.
>
> micro.svita.ai

---

## Post 5 — Street-front (UK)
**Image:** `05_streetfront.png`

> Уяви вулицю.
> 
> Пекарня. Бістро. Квітковий магазин. Кавова обсмажка.
> 
> Кожна з них почалася з брендбука — колір, форма, голос, меню, постачальники.
>
> 200+ готових концепцій для твоєї вулиці.
>
> micro.svita.ai

---

## Post 6 — Belarusian variant (BE, bonus)
**Image:** `04_barbershop.png` or `05_streetfront.png`

> Пачаць свой бізнес — гэта не «прыдумаць назву».
> 
> Гэта 200+ рашэнняў: лагатып, меню, абсталяванне, дазволы, кошты.
>
> Мы ўжо прайшлі гэты шлях. Прададзім цябе поўны брэндбук. Адкрывай.
>
> micro.svita.ai

---

## Posting strategy

**Week 1:** Post 1 (banner), Post 4, Post 2, Post 3, Post 5 — every 2 days
**Week 2+:** AI-generated variations via SVITA-Multi after overnight train finishes

**Best times (UTC+2 Warsaw):** 10:00, 14:00, 19:00
**Hashtags:** #microbusiness #startup #brandbook #entrepreneur — use 2-3 max per post

**CTA:** always end with `micro.svita.ai` — no emoji, no link shorteners (algorithm penalty)

---

## Auto-posting stack (when ready)

```
Cron @ Jetson → Python tweepy → Twitter API v2
  └→ Text generator: SVITA-Multi :11436 (post-training v2)
  └→ Image: rotate from /twitter/*.png or generate fresh via nano-banana MCP
```

Setup time: ~2 hours. Cost: $0 (Twitter Free tier = 50 posts/day).
