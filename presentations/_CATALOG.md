# MICRO.SVITA.AI — CONCEPTS CATALOG (FULL)

*Источник правды: Supabase `concepts_catalog` (project `ctdleobjnzniqkqomlrq`). Снимок: 2026-04-21 v3 · **242 концепций** (включая WIP/unverified).*

> **ВАЖНО для любой сессии:** все концепции с `catalog_number` существуют в БД. **НЕ ВЫДУМЫВАТЬ.** Если slug тут есть — можно брать в работу независимо от verified/is_active статуса. Если нет — запросить YAML-бриф у господина.

## Легенда статусов папок

| Символ | Значение |
|---|---|
| ✓ `[good]` | QA-подтверждено господином, не трогать |
| ◉ WIP+PDF | PDF есть, QA не прошёл, может требовать правки |
| · WIP | слайды частично, PDF нет |
| ∅ empty | папка пустая |
| — no folder | в БД есть, папки пока нет (берём в работу по dice+SOP) |

## Легенда БД-статусов

| Метка | Значение |
|---|---|
| **V+A** | verified=true, is_active=true — показывается в shop.html, готов к продаже |
| **wip** | verified=false — в БД есть, но в shop.html не показывается, ждёт брендбук+модерацию |
| **arch** | archived=true — sold out exclusive, retired |

## FOOD — 54 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 32 | `warsaw-zapiekanka-okno` | ZAPIEX PRAGA | Warsaw, PL | 8 · 7 | **V+A** | ✓ [good] |
| 33 | `warsaw-waffle-works` | Warsaw Waffle Works | Warsaw, PL | 13 · 5 | **V+A** | ◉ WIP+PDF |
| 34 | `copenhagen-smorre` | Copenhagen Smorre | Copenhagen, DK | 18 · 7 | **V+A** | ◉ WIP+PDF |
| 35 | `poppy-matcha` | POPPY MATCHA | Poppy, NL | 8 · 7 | **V+A** | ◉ WIP+PDF |
| 36 | `amsterdam-juice-lab` | Amsterdam Juice Lab | Amsterdam, NL | 12 · 6 | **V+A** | · WIP |
| 37 | `berlin-bagel-co` | Berlin Bagel Co | Berlin, DE | 22 · 7 | **V+A** | ◉ WIP+PDF |
| 41 | `milano-gelato-cube` | Milano Gelato Cube | Milano, IT | 10 · 5 | **V+A** | ◉ WIP+PDF |
| 89 | `athens-gyro-box` | Athens Gyro Box | Athens, GR | 11 · 5 | **V+A** | — no folder |
| 102 | `brussels-frites-box` | Brussels Frites Box | Brussels, BE | 10 · 5 | **V+A** | — no folder |
| 117 | `dublin-donut-den` | Dublin Donut Den | Dublin, IE | 16 · 6 | **V+A** | — no folder |
| 126 | `helsinki-salmiakki` | Helsinki Salmiakki | Helsinki, FI | 9 · 5 | **V+A** | — no folder |
| 144 | `lyon-boulangerie` | MIE DE LYON | Lyon, FR | 12 · 7 | **V+A** | — no folder |
| 146 | `madrid-churro-cart` | Madrid Churro Cart | Madrid, ES | 9 · 4 | **V+A** | — no folder |
| 159 | `porto-pastel-bar` | Porto Pastel Bar | Porto, PT | 14 · 6 | **V+A** | — no folder |
| 160 | `prague-trdelnik` | Prague Trdelnik | Prague, CZ | 8 · 4 | **V+A** | — no folder |
| 161 | `riga-rye-bakery` | Riga Rye Bakery | Riga, LV | 24 · 8 | **V+A** | — no folder |
| 162 | `scandi-coffee` | ALKA KAFFE | Scandi, PL | 10 · 6 | **V+A** | — no folder |
| 164 | `sofia-banitsa-bar` | Sofia Banitsa Bar | Sofia, BG | 12 · 5 | **V+A** | — no folder |
| 184 | `vibrant-coffee` | YELLOW POLE | Vibrant, FR | 6 · 5 | **V+A** | — no folder |
| 195 | `wien-kaffee-tram` | Wien Kaffee Tram | Wien, AT | 10 · 5 | **V+A** | — no folder |
| 198 | `zagreb-bubble-tea` | Zagreb Bubble Tea | Zagreb, HR | 15 · 6 | **V+A** | — no folder |
| 203 | `amsterdam-jenever-stoel` | BRUIN | Amsterdam, NL | 16 · 8 | wip | — no folder |
| 204 | `berlin-spaeti-window-bar` | SPÄTI 1 | Berlin, DE | 8 · 5 | wip | — no folder |
| 205 | `brussels-trappist-nook` | ABBAYE | Brussels, BE | 12 · 7 | wip | — no folder |
| 206 | `budapest-palinka-cellar` | PÁL | Budapest, HU | 15 · 8 | wip | — no folder |
| 207 | `copenhagen-akvavit-window` | AKVA | Copenhagen, DK | 9 · 6 | wip | — no folder |
| 208 | `dublin-cask-snug` | THE SNUG | Dublin, IE | 14 · 8 | wip | — no folder |
| 209 | `krakow-wodka-buffet` | WÓDKA | Krakow, PL | 14 · 7 | wip | — no folder |
| 210 | `lisbon-bica-stand` | BICA | Lisbon, PT | 6 · 5 | wip | — no folder |
| 211 | `lisbon-vermouth-hour` | VERMU | Lisbon, PT | 16 · 7 | wip | — no folder |
| 212 | `madrid-cerveza-artesana` | CAÑA | Madrid, ES | 10 · 6 | wip | — no folder |
| 213 | `milan-espresso-otto` | OTTO | Milan, IT | 6 · 5 | wip | — no folder |
| 214 | `milano-negroni-solo` | NEGRO | Milano, IT | 11 · 6 | wip | — no folder |
| 215 | `palermo-marsala-stool` | MARSALA | Palermo, IT | 10 · 6 | wip | — no folder |
| 216 | `paris-chemex-only` | 216 · CHEMEX 1 | Paris, FR | 8 · 6 | **V+A** | ✓ [good] |
| 217 | `porto-ginjinha-door` | GINJA | Porto, PT | 6 · 5 | wip | — no folder |
| 218 | `reykjavik-brennivin-bench` | SVARTI | Reykjavik, IS | 10 · 7 | wip | — no folder |
| 219 | `stockholm-filter-lab` | FILTER | Stockholm, SE | 12 · 7 | wip | — no folder |
| 220 | `tallinn-schnapps-cabinet` | KÄBI | Tallinn, EE | 12 · 7 | wip | — no folder |
| 221 | `vienna-heuriger-corner` | HEURIG | Vienna, AT | 18 · 8 | wip | — no folder |
| 222 | `vienna-melange-mini` | MELANGE | Vienna, AT | 14 · 8 | wip | — no folder |
| 223 | `amsterdam-gelato-lab` | GELO 9 | Amsterdam, NL | 12 · 7 | wip | — no folder |
| 224 | `bucharest-amaro-cabinet` | AMARO 40 | Bucharest, RO | 11 · 7 | wip | — no folder |
| 225 | `copenhagen-smorrebrod-six` | SMØR 6 | Copenhagen, DK | 14 · 7 | wip | — no folder |
| 226 | `edinburgh-porridge-inn` | OATS | Edinburgh, GB | 12 · 7 | wip | — no folder |
| 227 | `istanbul-turk-kahve-sedir` | SEDIR | Istanbul, TR | 10 · 6 | wip | — no folder |
| 228 | `lisbon-haiku-tea` | SEVENTEEN | Lisbon, PT | 14 · 7 | wip | — no folder |
| 230 | `lyon-quenelle-zinc` | ZINC | Lyon, FR | 16 · 8 | wip | — no folder |
| 232 | `naples-napoletano-otto` | TAZZA | Naples, IT | 8 · 6 | wip | — no folder |
| 233 | `naples-sfogliatella-bar` | SFOGLI | Naples, IT | 8 · 6 | wip | — no folder |
| 235 | `paris-croissant-only` | BEURRE | Paris, FR | 10 · 6 | wip | — no folder |
| 236 | `paris-phinh-corner` | PHINH | Paris, FR | 9 · 6 | wip | — no folder |
| 238 | `rome-orzo-bar` | ORZO | Rome, IT | 10 · 6 | wip | — no folder |
| 241 | `warsaw-kawa-owsiana` | OWIES | Warsaw, PL | 13 · 7 | wip | — no folder |

## RESTAURANT — 20 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 43 | `tel-aviv-hummus` | Tel Aviv Hummus | Tel, IL | 24 · 8 | **V+A** | ◉ WIP+PDF |
| 55 | `mumbai-curry-house` | TIFFIN 10 | Mumbai, IN | 14 · 7 | **V+A** | — no folder |
| 58 | `oaxaca-taco-joint` | Oaxaca Taco Joint | Oaxaca, MX | 26 · 8 | **V+A** | ◉ WIP+PDF |
| 73 | `sardinia-pasta-lab` | MALLOREDDUS | Sardinia, IT | 14 · 8 | **V+A** | ✓ [good] |
| 74 | `seville-tapas-nook` | LA NIETA | Seville, ES | 12 · 7 | **V+A** | ◉ WIP+PDF |
| 75 | `bangkok-pad-thai` | SOI 14 | Bangkok, TH | 6 · 4 | **V+A** | ✓ [good] |
| 76 | `beirut-mezze-den` | MEZZE 12 | Beirut, LB | 16 · 8 | **V+A** | ✓ [good] |
| 95 | `barcelona-tapas-nook` | CAL PEP 8 | Barcelona, ES | 16 · 9 | **V+A** | — no folder |
| 109 | `cairo-shawarma` | Cairo Shawarma | Cairo, BE | 28 · 8 | **V+A** | — no folder |
| 123 | `hanoi-pho-spot` | PHO GO | Hanoi, SE | 10 · 6 | **V+A** | — no folder |
| 128 | `istanbul-kebap-ev` | KEBAP EV | Istanbul, AT | 14 · 7 | **V+A** | — no folder |
| 132 | `lima-ceviche-bar` | BARRA NIKKEI | Lima, FR | 14 · 8 | **V+A** | — no folder |
| 133 | `lisbon-bifana` | Lisbon Bifana | Lisbon, PT | 26 · 8 | **V+A** | — no folder |
| 153 | `munich-wurst-haus` | KLEIN WURST | Munich, DE | 9 · 5 | **V+A** | — no folder |
| 154 | `napoli-pizza-forno` | FORNO 14 | Napoli, IT | 18 · 9 | **V+A** | — no folder |
| 155 | `nonnas-trattoria` | NONNA'S 12 | Nonnas, IT | 18 · 9 | **V+A** | — no folder |
| 156 | `osaka-takoyaki` | Osaka Takoyaki | Osaka, IT | 22 · 8 | **V+A** | — no folder |
| 157 | `paris-bistro-petit` | PETIT 14 | Paris, FR | 20 · 10 | **V+A** | — no folder |
| 163 | `seoul-kbbq-table` | ONE TABLE KBBQ | Seoul, NL | 12 · 8 | **V+A** | — no folder |
| 178 | `tokyo-ramen-bar` | KATSU 8 | Tokyo, DE | 14 · 9 | **V+A** | — no folder |

## BEAUTY — 20 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 40 | `lisbon-barber-co` | 40 · BARBA AZUL | Lisbon, PT | 18 · 7 | **V+A** | ◉ WIP+PDF |
| 45 | `bruges-beauty-bar` | Bruges Beauty Bar | Bruges, BE | 26 · 8 | **V+A** | · WIP |
| 56 | `nicosia-glow-studio` | Nicosia Glow Studio | Nicosia, CY | 20 · 7 | **V+A** | — no folder |
| 86 | `amsterdam-tattoo-atelier` | Amsterdam Tattoo Atelier | Amsterdam, NL | 26 · 8 | **V+A** | — no folder |
| 94 | `athens-waxing-co` | Athens Waxing Co | Athens, GR | 18 · 6 | **V+A** | — no folder |
| 99 | `berlin-skin-clinic` | SKIN ATELIER | Berlin, DE | 12 · 9 | **V+A** | ∅ empty |
| 110 | `cluj-hair-salon` | Cluj Hair Salon | Cluj, RO | 30 · 8 | **V+A** | — no folder |
| 120 | `dublin-lash-lounge` | Dublin Lash Lounge | Dublin, IE | 16 · 6 | **V+A** | — no folder |
| 130 | `krakow-nail-art` | Krakow Nail Art | Krakow, PL | 16 · 6 | **V+A** | — no folder |
| 141 | `luxembourg-brow` | Luxembourg Brow | Luxembourg, LU | 12 · 5 | **V+A** | — no folder |
| 145 | `madonna-pop-salon` | Madonna Pop Salon | Madonna, ES | 35 · 8 | **V+A** | — no folder |
| 152 | `milano-nail-studio` | Milano Nail Studio | Milano, IT | 18 · 7 | **V+A** | — no folder |
| 158 | `paris-brow-bar` | Paris Brow Bar | Paris, FR | 14 · 6 | **V+A** | — no folder |
| 165 | `sofia-barber-shop` | Sofia Barber Shop | Sofia, BG | 22 · 7 | **V+A** | — no folder |
| 171 | `stockholm-blow-dry` | Stockholm Blow Dry | Stockholm, SE | 24 · 8 | **V+A** | — no folder |
| 175 | `tallinn-spa-nook` | Tallinn Spa Nook | Tallinn, EE | 28 · 8 | **V+A** | — no folder |
| 181 | `valletta-henna-bar` | Valletta Henna Bar | Valletta, MT | 14 · 6 | wip | — no folder |
| 189 | `vienna-makeup-salon` | Vienna Makeup Salon | Vienna, AT | 20 · 7 | **V+A** | — no folder |
| 193 | `vilnius-mens-grooming` | Vilnius Men's Grooming | Vilnius, LT | 24 · 8 | wip | — no folder |
| 196 | `zadar-sun-salon` | Zadar Sun Salon | Zadar, HR | 22 · 7 | wip | — no folder |

## WELLNESS — 21 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 3 | `stockholm-cryo-bar` | CRYO 3 | Stockholm, SE | 12 · 9 | **V+A** | ✓ [good] |
| 10 | `madrid-yoga-barre` | BARRE 10 | Madrid, ES | 24 · 9 | **V+A** | ◉ WIP+PDF |
| 11 | `paris-meditation` | PAUSE | Paris, FR | 14 · 6 | **V+A** | ◉ WIP+PDF |
| 13 | `lisbon-pilates` | REFORMER 3 | Lisbon, PT | 20 · 9 | **V+A** | ✓ [good] |
| 15 | `helsinki-sauna-club` | LÖYLY MINI | Helsinki, FI | 10 · 8 | **V+A** | ✓ [good] |
| 16 | `amsterdam-massage` | Amsterdam Massage | Amsterdam, NL | 34 · 8 | **V+A** | ◉ WIP+PDF |
| 18 | `athens-olive-spa` | ELIA SPA | Athens, GR | 14 · 7 | **V+A** | ✓ [good] |
| 25 | `rome-thermal-bath` | PICCOLA TERMA | Rome, IT | 16 · 10 | **V+A** | ◉ WIP+PDF |
| 29 | `brussels-yoga-shala` | SHALA 8 | Brussels, BE | 20 · 8 | **V+A** | ◉ WIP+PDF |
| 30 | `budapest-bath-mini` | THERMAL 4 | Budapest, HU | 18 · 10 | **V+A** | ◉ WIP+PDF |
| 39 | `berlin-yoga-loft` | Berlin Yoga Loft | Berlin, DE | 56 · 9 | **V+A** | ◉ WIP+PDF |
| 68 | `prague-crystal-spa` | CRYSTAL 1 | Prague, CZ | 12 · 7 | **V+A** | ◉ WIP+PDF |
| 72 | `riga-cold-plunge` | Riga Cold Plunge | Riga, LV | 30 · 8 | **V+A** | — no folder |
| 82 | `warsaw-movement` | RUCH | Warsaw, PL | 20 · 8 | **V+A** | ✓ [good] |
| 105 | `bucharest-stretch-lab` | Bucharest Stretch Lab | Bucharest, RO | 28 · 7 | wip | — no folder |
| 113 | `copenhagen-zen-den` | Copenhagen Zen Den | Copenhagen, DK | 32 · 8 | wip | — no folder |
| 114 | `dublin-breath-lab` | Dublin Breath Lab | Dublin, IE | 28 · 8 | wip | — no folder |
| 140 | `ljubljana-sound-bath` | Ljubljana Sound Bath | Ljubljana, SI | 26 · 7 | wip | — no folder |
| 183 | `valletta-salt-cave` | Valletta Salt Cave | Valletta, MT | 32 · 8 | wip | — no folder |
| 187 | `vienna-float-tank` | FLOAT 2 | Vienna, AT | 14 · 9 | **V+A** | — no folder |
| 234 | `oslo-breath-lab` | PUST | Oslo, NO | 8 · 6 | wip | — no folder |

## HEALTH — 20 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 1 | `ljubljana-sleep-lab` | 01 · SEN LAB | Ljubljana, SI | 14 · 9 | **V+A** | ✓ [good] |
| 5 | `stockholm-wellness` | LAGOM LAB | Stockholm, SE | 14 · 8 | **V+A** | ✓ [good] |
| 6 | `vienna-dental-spa` | ZAHN SPA | Vienna, AT | 14 · 10 | **V+A** | ✓ [good] |
| 20 | `brussels-chiro-care` | CHIRO 1 | Brussels, BE | 14 · 8 | **V+A** | ✓ [good] |
| 21 | `paris-optometry` | LUNETTE 6 | Paris, FR | 6 · 6 | **V+A** | ✓ [good] |
| 24 | `rome-posture-clinic` | POSTURA | Rome, IT | 14 · 8 | **V+A** | ✓ [good] |
| 27 | `lisbon-osteo-clinic` | OSTEO 1 | Lisbon, PT | 14 · 8 | **V+A** | ◉ WIP+PDF |
| 28 | `amsterdam-physio` | 28 · PHYSIO 1 | Amsterdam, NL | 14 · 9 | **V+A** | ◉ WIP+PDF |
| 44 | `berlin-dental-hygiene` | HYGIENE LAB | Berlin, DE | 14 · 10 | **V+A** | ◉ WIP+PDF |
| 51 | `copenhagen-physio` | FYS 1 | Copenhagen, DK | 14 · 9 | **V+A** | — no folder |
| 64 | `prague-acupuncture` | Prague Acupuncture | Prague, CZ | 24 · 8 | **V+A** | — no folder |
| 81 | `warsaw-hygiene-hub` | HIG HUB | Warsaw, PL | 14 · 8 | **V+A** | ◉ WIP+PDF |
| 92 | `athens-physio-mini` | Athens Physio Mini | Athens, GR | 26 · 8 | wip | — no folder |
| 104 | `bucharest-eye-care` | Bucharest Eye Care | Bucharest, RO | 28 · 8 | wip | — no folder |
| 115 | `dublin-dental-scan` | Dublin Dental Scan | Dublin, IE | 28 · 8 | wip | — no folder |
| 125 | `helsinki-eye-scan` | Helsinki Eye Scan | Helsinki, FI | 24 · 8 | wip | — no folder |
| 148 | `madrid-reflexology` | Madrid Reflexology | Madrid, ES | 22 · 7 | wip | — no folder |
| 167 | `sofia-reflex-den` | Sofia Reflex Den | Sofia, BG | 20 · 7 | wip | — no folder |
| 173 | `tallinn-blood-test` | Tallinn Blood Test | Tallinn, EE | 22 · 8 | wip | — no folder |
| 200 | `zagreb-kids-dental` | DZIECI | Zagreb, HR | 14 · 9 | **V+A** | — no folder |

## SERVICE — 22 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 2 | `stockholm-car-wash` | ALKA VASK | Stockholm, SE | 25 · 7 | **V+A** | ✓ [good] |
| 54 | `milano-key-cutting` | Milano Key Cutting | Milano, IT | 8 · 4 | **V+A** | — no folder |
| 62 | `paris-laundry-spot` | Paris Laundry Spot | Paris, FR | 32 · 8 | **V+A** | — no folder |
| 69 | `prague-pet-wash` | Prague Pet Wash | Prague, CZ | 20 · 7 | **V+A** | — no folder |
| 84 | `amsterdam-bike-fix` | Amsterdam Bike Fix | Amsterdam, NL | 28 · 7 | **V+A** | — no folder |
| 93 | `athens-tailoring` | Athens Tailoring | Athens, GR | 18 · 6 | wip | — no folder |
| 96 | `berlin-dog-grooming` | Berlin Dog Grooming | Berlin, DE | 24 · 7 | **V+A** | — no folder |
| 101 | `brussels-bike-cafe` | VELO CAFE | Brussels, BE | 18 · 8 | **V+A** | — no folder |
| 103 | `bucharest-car-detail` | DETAIL BOX | Bucharest, RO | 22 · 7 | **V+A** | — no folder |
| 111 | `copenhagen-print-bar` | Copenhagen Print Bar | Copenhagen, DK | 22 · 7 | wip | — no folder |
| 116 | `dublin-dog-daycare` | PAW LOFT | Dublin, IE | 20 · 8 | **V+A** | — no folder |
| 127 | `helsinki-sauna-rent` | VUOKRA SAUNA | Helsinki, FI | 8 · 8 | **V+A** | — no folder |
| 135 | `lisbon-flower-studio` | Lisbon Flower Studio | Lisbon, PT | 16 · 6 | wip | — no folder |
| 139 | `ljubljana-ski-wax` | Ljubljana Ski Wax | Ljubljana, SI | 22 · 7 | wip | — no folder |
| 149 | `madrid-shoe-repair` | Madrid Shoe Repair | Madrid, ES | 14 · 6 | wip | — no folder |
| 177 | `tallinn-tech-fix` | Tallinn Tech Fix | Tallinn, EE | 16 · 6 | wip | — no folder |
| 180 | `valletta-boat-clean` | Valletta Boat Clean | Valletta, MT | 20 · 7 | wip | — no folder |
| 188 | `vienna-gift-wrap` | Vienna Gift Wrap | Vienna, AT | 10 · 4 | wip | — no folder |
| 194 | `warsaw-dry-clean` | Warsaw Dry Clean | Warsaw, PL | 30 · 8 | wip | — no folder |
| 199 | `zagreb-car-keys` | Zagreb Car Keys | Zagreb, HR | 12 · 6 | wip | — no folder |
| 239 | `tallinn-darkroom-cabinet` | GELATIN | Tallinn, EE | 12 · 7 | wip | — no folder |
| 240 | `vienna-listening-bar` | CONRAD | Vienna, AT | 22 · 9 | wip | — no folder |

## CRAFT — 23 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 4 | `stockholm-glass-blow` | BLAS STUDIO | Stockholm, SE | 14 · 9 | **V+A** | ✓ [good] |
| 14 | `helsinki-wood-studio` | KOVA WOOD | Helsinki, FI | 16 · 8 | **V+A** | ◉ WIP+PDF |
| 17 | `amsterdam-letterpress` | Amsterdam Letterpress | Amsterdam, NL | 22 · 8 | **V+A** | ✓ [good] |
| 42 | `paris-candle-atelier` | Paris Candle Atelier | Paris, FR | 18 · 7 | **V+A** | ◉ WIP+PDF |
| 46 | `brussels-chocolatier` | Brussels Chocolatier | Brussels, BE | 22 · 8 | **V+A** | — no folder |
| 48 | `bucharest-eggcraft` | Bucharest Eggcraft | Bucharest, RO | 10 · 4 | **V+A** | — no folder |
| 53 | `marseille-soap-house` | Marseille Soap House | Marseille, FR | 16 · 6 | **V+A** | — no folder |
| 57 | `nicosia-weavers` | Nicosia Weavers | Nicosia, CY | 20 · 7 | **V+A** | — no folder |
| 63 | `porto-tile-studio` | Porto Tile Studio | Porto, PT | 26 · 8 | **V+A** | ✓ [good] |
| 70 | `prague-puppet-atelier` | Prague Puppet Atelier | Prague, CZ | 14 · 6 | **V+A** | ◉ WIP+PDF |
| 71 | `riga-amber-bar` | Riga Amber Bar | Riga, LV | 14 · 6 | **V+A** | — no folder |
| 83 | `gdansk-amber-atelier` | BURSZTYN 14 | Gdansk, PL | 10 · 9 | **V+A** | ◉ WIP+PDF |
| 98 | `berlin-screen-print` | Berlin Screen Print | Berlin, DE | 28 · 8 | **V+A** | · WIP |
| 118 | `dublin-knit-nook` | Dublin Knit Nook | Dublin, IE | 18 · 6 | wip | — no folder |
| 122 | `florence-leather-bar` | Florence Leather Bar | Florence, IT | 20 · 7 | wip | — no folder |
| 134 | `lisbon-ceramic-studio` | Lisbon Ceramic Studio | Lisbon, PT | 24 · 8 | wip | — no folder |
| 151 | `malta-filigree-shop` | Malta Filigree Shop | Malta, MT | 12 · 6 | wip | — no folder |
| 166 | `sofia-icon-studio` | Sofia Icon Studio | Sofia, BG | 14 · 6 | wip | — no folder |
| 179 | `valencia-tile-craft` | Valencia Tile Craft | Valencia, ES | 22 · 7 | wip | — no folder |
| 185 | `vienna-bookbinder` | Vienna Bookbinder | Vienna, AT | 16 · 7 | wip | — no folder |
| 192 | `vilnius-linen-loom` | Vilnius Linen Loom | Vilnius, LT | 26 · 8 | wip | — no folder |
| 229 | `lyon-kintsugi-studio` | YOBITSUGI | Lyon, FR | 14 · 8 | wip | — no folder |
| 237 | `prague-wax-seal-atelier` | SIGIL | Prague, CZ | 10 · 7 | wip | — no folder |

## REPAIR — 21 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 22 | `rome-camera-repair` | Rome Camera Repair | Rome, IT | 16 · 7 | **V+A** | ◉ WIP+PDF |
| 61 | `paris-laptop-medic` | Paris Laptop Medic | Paris, FR | 18 · 7 | **V+A** | — no folder |
| 67 | `prague-clock-shop` | Prague Clock Shop | Prague, CZ | 16 · 7 | **V+A** | — no folder |
| 78 | `ljubljana-bag-fix` | Ljubljana Bag Fix | Ljubljana, SI | 12 · 5 | **V+A** | ◉ WIP+PDF |
| 87 | `amsterdam-vinyl-fix` | Amsterdam Vinyl Fix | Amsterdam, NL | 14 · 6 | **V+A** | — no folder |
| 88 | `antwerp-jewelry-fix` | Antwerp Jewelry Fix | Antwerp, BE | 10 · 5 | wip | — no folder |
| 97 | `berlin-phone-fix` | Berlin Phone Fix | Berlin, DE | 14 · 6 | **V+A** | ◉ WIP+PDF |
| 100 | `bratislava-tv-fix` | Bratislava TV Fix | Bratislava, SK | 16 · 6 | **V+A** | ∅ empty |
| 107 | `budapest-piano-tune` | Budapest Piano Tune | Budapest, HU | 22 · 7 | wip | — no folder |
| 119 | `dublin-laptop-rescue` | Dublin Laptop Rescue | Dublin, IE | 20 · 7 | wip | — no folder |
| 124 | `helsinki-drone-repair` | Helsinki Drone Repair | Helsinki, FI | 18 · 7 | wip | — no folder |
| 129 | `krakow-console-fix` | Krakow Console Fix | Krakow, PL | 14 · 6 | wip | — no folder |
| 137 | `lisbon-umbrella-fix` | Lisbon Umbrella Fix | Lisbon, PT | 8 · 4 | wip | — no folder |
| 143 | `luxembourg-lux-watch` | Luxembourg Lux Watch | Luxembourg, LU | 14 · 8 | wip | — no folder |
| 147 | `madrid-phone-clinic` | Madrid Phone Clinic | Madrid, ES | 12 · 6 | wip | — no folder |
| 169 | `sofia-shoe-medic` | Sofia Shoe Medic | Sofia, BG | 10 · 4 | wip | — no folder |
| 170 | `stockholm-bike-service` | Stockholm Bike Service | Stockholm, SE | 26 · 7 | wip | — no folder |
| 176 | `tallinn-synth-repair` | Tallinn Synth Repair | Tallinn, EE | 20 · 7 | wip | — no folder |
| 191 | `vienna-watch-atelier` | Vienna Watch Atelier | Vienna, AT | 12 · 6 | wip | — no folder |
| 197 | `zagreb-appliance-fix` | Zagreb Appliance Fix | Zagreb, HR | 22 · 7 | wip | — no folder |
| 231 | `madrid-knife-sharp` | FILO | Madrid, ES | 8 · 5 | wip | — no folder |

## RETAIL — 21 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 12 | `milano-design-store` | OGGETTO | Milano, IT | 12 · 7 | **V+A** | ✓ [good] |
| 26 | `sofia-eco-store` | Sofia Eco Store | Sofia, BG | 28 · 8 | **V+A** | ◉ WIP+PDF |
| 38 | `berlin-vintage-shop` | Berlin Vintage Shop | Berlin, DE | 32 · 8 | **V+A** | ◉ WIP+PDF |
| 59 | `paris-bookstore` | Paris Bookstore | Paris, FR | 28 · 8 | **V+A** | — no folder |
| 65 | `prague-book-nook` | Prague Book Nook | Prague, CZ | 20 · 7 | **V+A** | — no folder |
| 77 | `lisbon-plant-store` | Lisbon Plant Store | Lisbon, PT | 22 · 7 | **V+A** | ◉ WIP+PDF |
| 85 | `amsterdam-records` | Amsterdam Records | Amsterdam, NL | 24 · 8 | **V+A** | — no folder |
| 90 | `athens-olive-store` | Athens Olive Store | Athens, GR | 14 · 6 | wip | — no folder |
| 106 | `bucharest-wine-shop` | Bucharest Wine Shop | Bucharest, RO | 24 · 8 | wip | — no folder |
| 108 | `budapest-toy-store` | Budapest Toy Store | Budapest, HU | 26 · 7 | wip | — no folder |
| 112 | `copenhagen-stationery` | Copenhagen Stationery | Copenhagen, DK | 18 · 7 | wip | — no folder |
| 121 | `dublin-record-club` | Dublin Record Club | Dublin, IE | 22 · 7 | wip | — no folder |
| 131 | `krakow-plant-lab` | Krakow Plant Lab | Krakow, PL | 24 · 7 | wip | — no folder |
| 138 | `ljubljana-green-store` | Ljubljana Green Store | Ljubljana, SI | 22 · 7 | wip | — no folder |
| 142 | `luxembourg-gift-gallery` | Luxembourg Gift Gallery | Luxembourg, LU | 16 · 7 | wip | — no folder |
| 150 | `madrid-vintage-den` | Madrid Vintage Den | Madrid, ES | 26 · 7 | wip | — no folder |
| 174 | `tallinn-design-shop` | Tallinn Design Shop | Tallinn, EE | 18 · 7 | wip | — no folder |
| 182 | `valletta-map-shop` | Valletta Map Shop | Valletta, MT | 12 · 5 | wip | — no folder |
| 186 | `vienna-chocolate-shop` | Vienna Chocolate Shop | Vienna, AT | 16 · 7 | wip | — no folder |
| 202 | `zagreb-vinyl-den` | Zagreb Vinyl Den | Zagreb, HR | 20 · 7 | wip | — no folder |
| 242 | `warsaw-scent-library` | NASAL | Warsaw, PL | 16 · 8 | wip | — no folder |

## EDUCATION — 20 концепций

| # | Slug | Name | City, Country | m² · w | DB | Folder |
|---|------|------|---------------|--------|----|--------|
| 7 | `copenhagen-makers` | MAKER 10 | Copenhagen, DK | 22 · 9 | **V+A** | ✓ [good] |
| 8 | `dublin-english-hub` | ENGLISH HUB | Dublin, IE | 16 · 6 | **V+A** | ◉ WIP+PDF |
| 9 | `ljubljana-yoga-teach` | TEACH YOGA | Ljubljana, SI | 24 · 9 | **V+A** | ◉ WIP+PDF |
| 19 | `berlin-code-camp` | CODE 6 | Berlin, DE | 16 · 7 | **V+A** | ✓ [good] |
| 23 | `rome-italian-school` | PARLA | Rome, IT | 18 · 7 | **V+A** | ◉ WIP+PDF |
| 31 | `amsterdam-kids-studio` | KIDS MAKE | Amsterdam, NL | 18 · 7 | **V+A** | ◉ WIP+PDF |
| 47 | `brussels-kids-code` | Brussels Kids Code | Brussels, BE | 34 · 8 | **V+A** | — no folder |
| 49 | `bucharest-english-kids` | Bucharest English Kids | Bucharest, RO | 36 · 8 | **V+A** | — no folder |
| 50 | `budapest-dance-studio` | TANC 10 | Budapest, HU | 24 · 8 | **V+A** | ◉ WIP+PDF |
| 52 | `helsinki-design-lab` | DESIGN 8 | Helsinki, FI | 20 · 8 | **V+A** | ◉ WIP+PDF |
| 60 | `paris-language-cafe` | Paris Language Cafe | Paris, FR | 36 · 8 | **V+A** | — no folder |
| 66 | `prague-chess-club` | Prague Chess Club | Prague, CZ | 36 · 8 | **V+A** | — no folder |
| 79 | `madrid-music-lessons` | Madrid Music Lessons | Madrid, ES | 30 · 7 | **V+A** | ◉ WIP+PDF |
| 80 | `warsaw-art-studio` | ATELIER 6 | Warsaw, PL | 18 · 7 | **V+A** | ◉ WIP+PDF |
| 91 | `athens-philosophy` | Athens Philosophy | Athens, GR | 32 · 7 | wip | — no folder |
| 136 | `lisbon-surf-school` | Lisbon Surf School | Lisbon, PT | 26 · 8 | wip | — no folder |
| 168 | `sofia-robot-club` | Sofia Robot Club | Sofia, BG | 38 · 8 | wip | — no folder |
| 172 | `stockholm-math-lab` | Stockholm Math Lab | Stockholm, SE | 32 · 8 | wip | — no folder |
| 190 | `vienna-violin-studio` | Vienna Violin Studio | Vienna, AT | 24 · 7 | wip | — no folder |
| 201 | `zagreb-pottery-class` | Zagreb Pottery Class | Zagreb, HR | 32 · 8 | wip | · WIP |

---

## Как использовать

1. **Господин называет slug или номер** → ищешь в таблицах выше.
2. **Статус "— no folder"** → концепция ещё не делалась, можно брать в работу. `python3 scripts/concept_dice.py <slug> --category <cat> --country <ISO> --nn <NN>` → следуй SOP фазы 1-8.
3. **Статус "∅ empty"** → папка создана но пустая — начинай как new.
4. **Статус "· WIP"** или **"◉ WIP+PDF"** → WIP, сверь что уже есть, доделай недостающее.
5. **Статус "✓ [good]"** → НЕ трогать без прямой команды.
6. **Нет в списке?** → запроси у господина YAML-бриф. Не придумывай.

**GOLD STANDARD уровень:** всегда `reference: 42 · 43 · 94` в ТЗ (см. `_SESSION_PROMPT.md`).

*Генерация: `python3 scripts/gen_catalog_md.py` — регенерировать когда статусы меняются.*