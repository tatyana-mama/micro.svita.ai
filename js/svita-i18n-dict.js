/* Global translation dictionary for micro.svita.ai
   Format: window.I18N = { key: { be, en, pl, ru, uk } }
   Consumed by js/labs67-i18n.js via window.I18N lookup.

   Locales enabled (per index.html `window.LABS67_LANGS`): en (base) · pl · uk · be · ru.
   Belarusian (be) is rendered in the switcher as BY but stays `be` internally per ISO 639-1.

   Translations are the agency-quality first pass — domain copy preserved,
   any nuance the user spots can be hand-corrected per key without touching markup. */
window.I18N = {

  // ========== HERO ==========
  hero_eyebrow: {
    en: '№ {N} · atlas of unbuilt worlds',
    ru: '№ {N} · атлас непостроенных миров',
    pl: '№ {N} · atlas niezbudowanych światów',
    uk: '№ {N} · атлас небудованих світів',
    be: '№ {N} · атлас непабудаваных светаў'
  },
  hero_h1_a: {
    en: 'Eight out of ten ideas',
    ru: 'Восемь из десяти идей',
    pl: 'Osiem z dziesięciu pomysłów',
    uk: 'Вісім з десяти ідей',
    be: 'Восем з дзесяці ідэй'
  },
  hero_h1_b: {
    en: 'die <br/>before the door ever opens.',
    ru: 'умирают <br/>до того, как откроется дверь.',
    pl: 'ginie <br/>zanim otworzą się drzwi.',
    uk: 'помирають <br/>ще до того, як відчиняться двері.',
    be: 'гінуць <br/>яшчэ да таго, як адчыняцца дзверы.'
  },
  hero_sub_html: {
    en: 'Here lives a library of {N} ready-to-launch concepts — from a massage atelier to a street coffee bar. One subscription opens everything: every brandbook, every floor plan, every calculation.',
    ru: 'Здесь живёт библиотека из {N} готовых к запуску концепций — от массажного ателье до уличной кофейни. Одна подписка открывает всё: каждый брендбук, каждый план этажа, каждый расчёт.',
    pl: 'Tu mieszka biblioteka {N} gotowych do uruchomienia konceptów — od atelier masażu po uliczną kawiarnię. Jedna subskrypcja otwiera wszystko: każdy brandbook, każdy plan piętra, każde wyliczenie.',
    uk: 'Тут живе бібліотека з {N} готових до запуску концепцій — від масажного ательє до вуличної кавʼярні. Одна підписка відкриває все: кожен брендбук, кожен план поверху, кожен розрахунок.',
    be: 'Тут жыве бібліятэка з {N} гатовых да запуску канцэпцый — ад масажнага атэлье да вулічнай кавярні. Адна падпіска адкрывае ўсё: кожны брэндбук, кожны план паверху, кожны разлік.'
  },
  hero_cta_open: {
    en: 'Open library — $19/mo',
    ru: 'Открыть библиотеку — $19/мес',
    pl: 'Otwórz bibliotekę — $19/mies',
    uk: 'Відкрити бібліотеку — $19/міс',
    be: 'Адкрыць бібліятэку — $19/мес'
  },
  hero_cta_browse: {
    en: 'Browse catalog',
    ru: 'Смотреть каталог',
    pl: 'Przeglądaj katalog',
    uk: 'Дивитися каталог',
    be: 'Глядзець каталог'
  },
  cta_dont_be_eight: {
    en: 'Don’t be the eight · €49',
    ru: 'Не будь восьмёркой · €49',
    pl: 'Nie bądź jednym z ośmiu · 49 €',
    uk: 'Не будь однією з вісьмох · €49',
    be: 'Не будзь адной з васьмі · €49'
  },
  cta_why_die: {
    en: 'Why ideas die ↓',
    ru: 'Почему идеи умирают ↓',
    pl: 'Dlaczego pomysły giną ↓',
    uk: 'Чому ідеї помирають ↓',
    be: 'Чаму ідэі гінуць ↓'
  },

  // ========== KPI strip ==========
  kpi_concepts: { en: 'concepts', ru: 'концепций', pl: 'koncepcji', uk: 'концепцій', be: 'канцэпцый' },
  kpi_pages: { en: 'pages each', ru: 'страниц в каждой', pl: 'stron każda', uk: 'сторінок у кожній', be: 'старонак у кожнай' },
  kpi_from: { en: 'from', ru: 'от', pl: 'od', uk: 'від', be: 'ад' },
  kpi_cities: { en: 'cities', ru: 'городов', pl: 'miast', uk: 'міст', be: 'гарадоў' },
  kpi_categories: { en: 'categories', ru: 'категорий', pl: 'kategorii', uk: 'категорій', be: 'катэгорый' },

  // ========== SIGNATURE SLIDER ==========
  sig_h: {
    en: 'Signature concepts', ru: 'Фирменные концепции',
    pl: 'Koncepcje sygnowane', uk: 'Сигнатурні концепції', be: 'Фірмовыя канцэпцыі'
  },
  sig_meta_html: {
    en: 'Every card includes a 25-page brandbook · <b id="sig-count">— · —</b>',
    ru: 'Каждая карточка содержит 25-страничный брендбук · <b id="sig-count">— · —</b>',
    pl: 'Każda karta zawiera 25-stronicowy brandbook · <b id="sig-count">— · —</b>',
    uk: 'Кожна картка містить 25-сторінковий брендбук · <b id="sig-count">— · —</b>',
    be: 'Кожная картка ўтрымлівае 25-старонкавы брэндбук · <b id="sig-count">— · —</b>'
  },
  sig_browse: {
    en: 'Browse all 90 in the shop',
    ru: 'Смотреть все 90 в магазине',
    pl: 'Przejrzyj wszystkie 90 w sklepie',
    uk: 'Переглянути всі 90 у магазині',
    be: 'Прагледзіць усе 90 у краме'
  },

  // ========== HOW IT WORKS ==========
  method_eyebrow: { en: 'Method', ru: 'Метод', pl: 'Metoda', uk: 'Метод', be: 'Метад' },
  method_h_html: {
    en: 'From a browse tab <span class="accent">to opening day</span> — in three moves.',
    ru: 'От вкладки в браузере <span class="accent">до дня открытия</span> — в три хода.',
    pl: 'Od karty w przeglądarce <span class="accent">do dnia otwarcia</span> — w trzech ruchach.',
    uk: 'Від вкладки у браузері <span class="accent">до дня відкриття</span> — за три кроки.',
    be: 'Ад укладкі ў браўзеры <span class="accent">да дня адкрыцця</span> — за тры хады.'
  },
  step1_num: { en: '01 / Browse', ru: '01 / Выбор', pl: '01 / Przegląd', uk: '01 / Перегляд', be: '01 / Прагляд' },
  step1_h: { en: 'Pick a concept', ru: 'Выберите концепцию', pl: 'Wybierz koncepcję', uk: 'Оберіть концепцію', be: 'Абярыце канцэпцыю' },
  step1_p: {
    en: 'Scroll through 90 curated micro-businesses across 13 categories and 34 European cities. Each one is shot like a magazine editorial — not stock.',
    ru: 'Пролистайте 90 кураторских микро-бизнесов в 13 категориях и 34 европейских городах. Каждый снят как журнальная съёмка, а не сток.',
    pl: 'Przewiń 90 wyselekcjonowanych mikro-biznesów w 13 kategoriach i 34 europejskich miastach. Każdy sfotografowany jak sesja redakcyjna, nie stock.',
    uk: 'Перегляньте 90 кураторських мікро-бізнесів у 13 категоріях і 34 європейських містах. Кожен знятий як редакційна зйомка, а не сток.',
    be: 'Пракруціце 90 курыраваных мікра-бізнесаў у 13 катэгорыях і 34 еўрапейскіх гарадах. Кожны зняты як часопісная здымка, а не сток.'
  },
  step1_li1: { en: '{N} concepts', ru: '{N} концепций', pl: '90 koncepcji', uk: '{N} концепцій', be: '{N} канцэпцый' },
  step1_li2: { en: '13 categories', ru: '13 категорий', pl: '13 kategorii', uk: '13 категорій', be: '13 катэгорый' },
  step1_li3: {
    en: 'real interiors & packaging',
    ru: 'реальные интерьеры и упаковка',
    pl: 'realne wnętrza i opakowania',
    uk: 'реальні інтер’єри та упаковка',
    be: 'рэальныя інтэр’еры і ўпакоўка'
  },
  step2_num: { en: '02 / Buy', ru: '02 / Покупка', pl: '02 / Zakup', uk: '02 / Купівля', be: '02 / Купля' },
  step2_h: {
    en: 'Claim the brandbook',
    ru: 'Заберите брендбук',
    pl: 'Odbierz brandbook',
    uk: 'Заберіть брендбук',
    be: 'Забярыце брэндбук'
  },
  step2_p: {
    en: 'One concept, one checkout. From €49 you receive the full 25-page brandbook — palette, interior, signage, menu, CAPEX, 4-week opening plan.',
    ru: 'Одна концепция — одна оплата. С €49 вы получаете полный 25-страничный брендбук: палитра, интерьер, вывески, меню, CAPEX, 4-недельный план открытия.',
    pl: 'Jedna koncepcja, jeden checkout. Od 49 € otrzymujesz pełny 25-stronicowy brandbook — paletę, wnętrze, oznakowanie, menu, CAPEX, 4-tygodniowy plan otwarcia.',
    uk: 'Одна концепція — один платіж. Від €49 ви отримуєте повний 25-сторінковий брендбук: палітра, інтер’єр, вивіски, меню, CAPEX, 4-тижневий план відкриття.',
    be: 'Адна канцэпцыя — адзін плацёж. Ад €49 вы атрымліваеце поўны 25-старонкавы брэндбук: палітра, інтэр’ер, вывескі, меню, CAPEX, 4-тыднёвы план адкрыцця.'
  },
  step2_li1: { en: '25-page PDF', ru: '25-страничный PDF', pl: 'PDF na 25 stron', uk: 'PDF на 25 сторінок', be: 'PDF на 25 старонак' },
  step2_li2: {
    en: 'palette · interior · menu',
    ru: 'палитра · интерьер · меню',
    pl: 'paleta · wnętrze · menu',
    uk: 'палітра · інтер’єр · меню',
    be: 'палітра · інтэр’ер · меню'
  },
  step2_li3: {
    en: '4-week opening timeline',
    ru: '4-недельный график открытия',
    pl: 'harmonogram otwarcia 4 tygodnie',
    uk: '4-тижневий графік відкриття',
    be: '4-тыднёвы графік адкрыцця'
  },
  step3_num: { en: '03 / Launch', ru: '03 / Старт', pl: '03 / Start', uk: '03 / Старт', be: '03 / Старт' },
  step3_h: {
    en: 'Open in four weeks',
    ru: 'Откройтесь за четыре недели',
    pl: 'Otwórz w cztery tygodnie',
    uk: 'Відкрийтеся за чотири тижні',
    be: 'Адкрыйцеся за чатыры тыдні'
  },
  step3_p: {
    en: 'Take the book to your contractor, printer, and chef. Everything is briefed, costed, and sourced. You skip the six-month design phase entirely.',
    ru: 'Отнесите книгу подрядчику, типографу и шеф-повару. Всё описано, посчитано и расфасовано по поставщикам. Вы полностью пропускаете шестимесячную фазу дизайна.',
    pl: 'Zabierz książkę do wykonawcy, drukarni i kucharza. Wszystko jest zbriefowane, wycenione i zaopatrzone. Pomijasz całe sześciomiesięczne etap projektowania.',
    uk: 'Віднесіть книгу підряднику, друкарні та шеф-кухарю. Все описано, прораховано та підібрано по постачальниках. Ви пропускаєте шестимісячну фазу дизайну повністю.',
    be: 'Аднясіце кнігу падрадчыку, друкарні і шэф-кухару. Усё апісана, разлічана і падабрана па пастаўшчыках. Вы цалкам прапускаеце шасцімесячны этап дызайну.'
  },
  step3_li1: {
    en: 'contractor-ready',
    ru: 'готово к подрядчику',
    pl: 'gotowe dla wykonawcy',
    uk: 'готово підряднику',
    be: 'гатова падрадчыку'
  },
  step3_li2: {
    en: 'CAPEX verified (€)',
    ru: 'CAPEX проверен (€)',
    pl: 'CAPEX zweryfikowany (€)',
    uk: 'CAPEX перевірено (€)',
    be: 'CAPEX правераны (€)'
  },
  step3_li3: {
    en: 'top 20% on day one',
    ru: 'топ-20% с первого дня',
    pl: 'top 20% od pierwszego dnia',
    uk: 'топ-20% з першого дня',
    be: 'топ-20% з першага дня'
  },

  // ========== TIERS ==========
  tiers_eyebrow: {
    en: 'Two ways to own it',
    ru: 'Два способа владения',
    pl: 'Dwa sposoby posiadania',
    uk: 'Два способи володіння',
    be: 'Два спосабы валодання'
  },
  tiers_h_html: {
    en: 'A library card, <span style="color:var(--accent);font-style:italic;font-weight:500">or a deed.</span>',
    ru: 'Читательский билет, <span style="color:var(--accent);font-style:italic;font-weight:500">или собственность.</span>',
    pl: 'Karta biblioteczna, <span style="color:var(--accent);font-style:italic;font-weight:500">albo akt własności.</span>',
    uk: 'Бібліотечний квиток, <span style="color:var(--accent);font-style:italic;font-weight:500">або документ власності.</span>',
    be: 'Бібліятэчны білет, <span style="color:var(--accent);font-style:italic;font-weight:500">альбо дакумент уласнасці.</span>'
  },
  tier_concept_unit: { en: '/ one-off', ru: '/ разово', pl: '/ jednorazowo', uk: '/ разово', be: '/ аднаразова' },
  tier_concept_sub: {
    en: 'The full brandbook. Shared with other builders who loved the same concept.',
    ru: 'Полный брендбук. Доступен и другим, кому нравится та же концепция.',
    pl: 'Pełny brandbook. Dzielony z innymi twórcami, którym spodobała się ta sama koncepcja.',
    uk: 'Повний брендбук. Спільний з іншими творцями, які обрали ту саму концепцію.',
    be: 'Поўны брэндбук. Падзелены з іншымі творцамі, якія абралі тую ж канцэпцыю.'
  },
  tier_concept_li1_html: {
    en: '<b>25-page editorial PDF</b> — palette, interior, menu, signage',
    ru: '<b>25-страничный editorial PDF</b> — палитра, интерьер, меню, вывески',
    pl: '<b>25-stronicowy PDF redakcyjny</b> — paleta, wnętrze, menu, oznakowanie',
    uk: '<b>25-сторінковий editorial PDF</b> — палітра, інтер’єр, меню, вивіски',
    be: '<b>25-старонкавы editorial PDF</b> — палітра, інтэр’ер, меню, вывескі'
  },
  tier_concept_li2_html: {
    en: '<b>Opening plan</b> — 4 weeks, task by task',
    ru: '<b>План открытия</b> — 4 недели, задача за задачей',
    pl: '<b>Plan otwarcia</b> — 4 tygodnie, zadanie po zadaniu',
    uk: '<b>План відкриття</b> — 4 тижні, задача за задачею',
    be: '<b>План адкрыцця</b> — 4 тыдні, задача за задачай'
  },
  tier_concept_li3_html: {
    en: '<b>CAPEX & unit economics</b> — verified in EUR',
    ru: '<b>CAPEX и юнит-экономика</b> — проверено в EUR',
    pl: '<b>CAPEX i unit economics</b> — zweryfikowane w EUR',
    uk: '<b>CAPEX і юніт-економіка</b> — перевірено в EUR',
    be: '<b>CAPEX і юніт-эканоміка</b> — праверана ў EUR'
  },
  tier_concept_li4_html: {
    en: '<b>Print-ready identity</b> — logo, type, packaging',
    ru: '<b>Готовая к печати айдентика</b> — логотип, шрифт, упаковка',
    pl: '<b>Identyfikacja gotowa do druku</b> — logo, typografia, opakowania',
    uk: '<b>Айдентика готова до друку</b> — логотип, шрифт, упаковка',
    be: '<b>Айдэнтыка гатовая да друку</b> — лагатып, шрыфт, упакоўка'
  },
  tier_concept_li5: {
    en: 'Non-exclusive license',
    ru: 'Неэксклюзивная лицензия',
    pl: 'Licencja niewyłączna',
    uk: 'Неексклюзивна ліцензія',
    be: 'Неэксклюзіўная ліцэнзія'
  },
  tier_concept_cta: {
    en: 'Browse concepts →',
    ru: 'Смотреть концепции →',
    pl: 'Przeglądaj koncepcje →',
    uk: 'Переглянути концепції →',
    be: 'Прагледзець канцэпцыі →'
  },
  tier_excl_sub: {
    en: 'The concept retires to one owner. Withdrawn from the catalogue forever.',
    ru: 'Концепция уходит к одному владельцу. Снимается с каталога навсегда.',
    pl: 'Koncepcja przechodzi do jednego właściciela. Usuwana z katalogu na zawsze.',
    uk: 'Концепція переходить до одного власника. Знімається з каталогу назавжди.',
    be: 'Канцэпцыя пераходзіць да аднаго ўласніка. Здымаецца з каталога назаўжды.'
  },
  tier_excl_li1_html: {
    en: '<b>Everything in Concept</b>',
    ru: '<b>Всё, что входит в Concept</b>',
    pl: '<b>Wszystko, co w Concept</b>',
    uk: '<b>Усе, що в Concept</b>',
    be: '<b>Усё, што ў Concept</b>'
  },
  tier_excl_li2_html: {
    en: '<b>Concept removed from catalogue</b> — yours alone',
    ru: '<b>Концепция убирается из каталога</b> — только ваша',
    pl: '<b>Koncepcja usunięta z katalogu</b> — tylko Twoja',
    uk: '<b>Концепція знята з каталогу</b> — тільки ваша',
    be: '<b>Канцэпцыя знятая з каталога</b> — толькі ваша'
  },
  tier_excl_li3_html: {
    en: '<b>Editable source files</b> — InDesign, Figma, raw PNG',
    ru: '<b>Редактируемые исходники</b> — InDesign, Figma, raw PNG',
    pl: '<b>Edytowalne pliki źródłowe</b> — InDesign, Figma, raw PNG',
    uk: '<b>Редаговані вихідники</b> — InDesign, Figma, raw PNG',
    be: '<b>Рэдагавальныя зыходнікі</b> — InDesign, Figma, raw PNG'
  },
  tier_excl_li4_html: {
    en: '<b>Transfer of rights</b> — full commercial use',
    ru: '<b>Передача прав</b> — полное коммерческое использование',
    pl: '<b>Przeniesienie praw</b> — pełne użycie komercyjne',
    uk: '<b>Передача прав</b> — повне комерційне використання',
    be: '<b>Перадача правоў</b> — поўнае камерцыйнае выкарыстанне'
  },
  tier_excl_li5_html: {
    en: '<b>Name & trademark path</b> — filing notes included',
    ru: '<b>Имя и путь к товарному знаку</b> — заметки по подаче включены',
    pl: '<b>Nazwa i ścieżka do znaku towarowego</b> — notatki o zgłoszeniu w komplecie',
    uk: '<b>Ім’я та шлях до торгової марки</b> — нотатки щодо подання включено',
    be: '<b>Імя і шлях да гандлёвай маркі</b> — нататкі па падачы ўключаны'
  },
  tier_excl_cta: {
    en: 'Claim an exclusive',
    ru: 'Забрать эксклюзив',
    pl: 'Odbierz exclusive',
    uk: 'Забрати ексклюзив',
    be: 'Забраць эксклюзіў'
  },

  // ========== FAQ ==========
  faq_eyebrow: { en: 'FAQ', ru: 'FAQ', pl: 'FAQ', uk: 'FAQ', be: 'FAQ' },
  faq_h: { en: 'Short answers.', ru: 'Короткие ответы.', pl: 'Krótkie odpowiedzi.', uk: 'Короткі відповіді.', be: 'Кароткія адказы.' },
  faq_q1: {
    en: 'What exactly do I get for €49?',
    ru: 'Что именно я получаю за €49?',
    pl: 'Co dokładnie dostaję za 49 €?',
    uk: 'Що саме я отримую за €49?',
    be: 'Што менавіта я атрымліваю за €49?'
  },
  faq_q1_a: {
    en: 'A 25-page editorial PDF and a print-ready identity pack. It includes the palette, materials, interior axonometry, packaging mockups, signage, menu or service grid, 4-week opening timeline, and verified CAPEX in EUR. No generic templates — the concept is shot and costed as a specific business in a specific city.',
    ru: '25-страничный editorial PDF и пакет готовой к печати айдентики. Включает палитру, материалы, аксонометрию интерьера, упаковочные мокапы, вывески, меню или сетку услуг, 4-недельный график открытия и проверенный CAPEX в EUR. Никаких generic-шаблонов — концепция снята и посчитана как конкретный бизнес в конкретном городе.',
    pl: '25-stronicowy PDF redakcyjny i pakiet identyfikacji gotowy do druku. Zawiera paletę, materiały, aksonometrię wnętrza, makiety opakowań, oznakowanie, menu lub siatkę usług, 4-tygodniowy harmonogram otwarcia i zweryfikowany CAPEX w EUR. Brak generycznych szablonów — koncepcja sfotografowana i wyceniona jako konkretny biznes w konkretnym mieście.',
    uk: '25-сторінковий editorial PDF та пакет айдентики готовий до друку. Містить палітру, матеріали, аксонометрію інтер’єру, мокапи упаковки, вивіски, меню чи сітку послуг, 4-тижневий графік відкриття та перевірений CAPEX у EUR. Без шаблонів — концепція знята та прорахована як конкретний бізнес у конкретному місті.',
    be: '25-старонкавы editorial PDF і пакет айдэнтыкі гатовы да друку. Уключае палітру, матэрыялы, аксанаметрыю інтэр’еру, макапы ўпакоўкі, вывескі, меню або сетку паслуг, 4-тыднёвы графік адкрыцця і правераны CAPEX у EUR. Без шаблонаў — канцэпцыя знятая і разлічаная як канкрэтны бізнес у канкрэтным горадзе.'
  },
  faq_q2: {
    en: 'Do I really own it?',
    ru: 'Я действительно владею этим?',
    pl: 'Czy naprawdę jestem właścicielem?',
    uk: 'Я справді є власником?',
    be: 'Я сапраўды з’яўляюся ўласнікам?'
  },
  faq_q2_a: {
    en: 'Concept (€49) gives you a non-exclusive license — multiple builders can open the same concept in different cities. Exclusive (€149) removes the concept from the catalogue forever and transfers full commercial rights, including editable source files.',
    ru: 'Concept (€49) даёт неэксклюзивную лицензию — одну и ту же концепцию могут открыть несколько основателей в разных городах. Exclusive (€149) убирает концепцию из каталога навсегда и передаёт полные коммерческие права, включая редактируемые исходники.',
    pl: 'Concept (49 €) daje licencję niewyłączną — tę samą koncepcję może otworzyć kilku founderów w różnych miastach. Exclusive (149 €) usuwa koncepcję z katalogu na zawsze i przenosi pełne prawa komercyjne, w tym edytowalne pliki źródłowe.',
    uk: 'Concept (€49) дає неексклюзивну ліцензію — одну й ту саму концепцію можуть відкрити кілька засновників у різних містах. Exclusive (€149) знімає концепцію з каталогу назавжди й передає повні комерційні права, включно з редагованими вихідниками.',
    be: 'Concept (€49) дае неэксклюзіўную ліцэнзію — адну і тую ж канцэпцыю могуць адкрыць некалькі заснавальнікаў у розных гарадах. Exclusive (€149) здымае канцэпцыю з каталога назаўжды і перадае поўныя камерцыйныя правы, уключна з рэдагавальнымі зыходнікамі.'
  },
  faq_q3: {
    en: 'Can I use it in any country?',
    ru: 'Можно использовать в любой стране?',
    pl: 'Czy mogę użyć w dowolnym kraju?',
    uk: 'Чи можу використати в будь-якій країні?',
    be: 'Ці можна выкарыстаць у любой краіне?'
  },
  faq_q3_a: {
    en: 'Yes. Concepts are designed EU-wide and can be adapted to any city. Prices, suppliers, and regulatory notes lean on the original reference city, but the visual system, economics, and opening plan translate cleanly.',
    ru: 'Да. Концепции рассчитаны на ЕС и адаптируются к любому городу. Цены, поставщики и регуляторные заметки опираются на референсный город, но визуальная система, экономика и план открытия переносятся чисто.',
    pl: 'Tak. Koncepcje są projektowane dla całej UE i można je dostosować do dowolnego miasta. Ceny, dostawcy i notatki regulacyjne opierają się na mieście referencyjnym, ale system wizualny, ekonomia i plan otwarcia przenoszą się bez problemu.',
    uk: 'Так. Концепції розраховані на ЄС і адаптуються до будь-якого міста. Ціни, постачальники та регуляторні нотатки спираються на референсне місто, але візуальна система, економіка та план відкриття переносяться без втрат.',
    be: 'Так. Канцэпцыі разлічаныя на ЕЗ і адаптуюцца да любога горада. Цэны, пастаўшчыкі і рэгулятарныя нататкі абапіраюцца на рэферэнсны горад, але візуальная сістэма, эканоміка і план адкрыцця пераносяцца чыста.'
  },
  faq_q4: {
    en: 'Refunds?',
    ru: 'Возвраты?',
    pl: 'Zwroty?',
    uk: 'Повернення коштів?',
    be: 'Звароты?'
  },
  faq_q4_a: {
    en: '14-day money-back guarantee on every brandbook. If it isn’t what we described, you get a full refund and keep nothing. No questions, no tickets.',
    ru: '14-дневная гарантия возврата на каждый брендбук. Если он не соответствует описанию — полный возврат, ничего у вас не остаётся. Без вопросов, без тикетов.',
    pl: '14-dniowa gwarancja zwrotu na każdy brandbook. Jeśli nie odpowiada opisowi — pełny zwrot, niczego nie zatrzymujesz. Bez pytań, bez ticketów.',
    uk: '14-денна гарантія повернення на кожен брендбук. Якщо не відповідає опису — повне повернення, нічого у вас не залишається. Без питань, без тикетів.',
    be: '14-дзённая гарантыя звароту на кожны брэндбук. Калі не адпавядае апісанню — поўны зварот, нічога ў вас не застаецца. Без пытанняў, без тыкетаў.'
  },
  faq_q5: {
    en: 'Is this a franchise?',
    ru: 'Это франшиза?',
    pl: 'Czy to franczyza?',
    uk: 'Це франшиза?',
    be: 'Гэта франшыза?'
  },
  faq_q5_a: {
    en: 'No. You own the business, we never take equity or royalties. SVITA Micro is a shop of visual concepts — you pay once, open the business, keep 100%.',
    ru: 'Нет. Бизнес ваш, мы никогда не берём долю или роялти. SVITA Micro — магазин визуальных концепций: вы платите один раз, открываете бизнес и оставляете себе 100%.',
    pl: 'Nie. Biznes jest Twój, nigdy nie bierzemy udziałów ani royalties. SVITA Micro to sklep koncepcji wizualnych — płacisz raz, otwierasz biznes i zatrzymujesz 100%.',
    uk: 'Ні. Бізнес ваш, ми ніколи не беремо частку чи роялті. SVITA Micro — магазин візуальних концепцій: ви платите один раз, відкриваєте бізнес і залишаєте собі 100%.',
    be: 'Не. Бізнес ваш, мы ніколі не бярэм долю ці раялці. SVITA Micro — крама візуальных канцэпцый: вы плаціце адзін раз, адкрываеце бізнес і пакідаеце сабе 100%.'
  },

  // ========== FINAL CTA ==========
  final_h_html: {
    en: 'Your next business is <span class="accent">already photographed.</span>',
    ru: 'Твой следующий бизнес <span class="accent">уже сфотографирован.</span>',
    pl: 'Twój następny biznes <span class="accent">jest już sfotografowany.</span>',
    uk: 'Твій наступний бізнес <span class="accent">уже сфотографовано.</span>',
    be: 'Твой наступны бізнес <span class="accent">ужо сфатаграфаваны.</span>'
  },
  final_p: {
    en: '{N} concepts waiting. One is probably the one.',
    ru: '{N} концепций ждут. Одна из них точно ваша.',
    pl: '90 koncepcji czeka. Jedna jest prawdopodobnie tą jedyną.',
    uk: '{N} концепцій чекають. Одна з них точно ваша.',
    be: '{N} канцэпцый чакаюць. Адна з іх дакладна ваша.'
  },
  final_cta: {
    en: 'Open the shop',
    ru: 'Открыть магазин',
    pl: 'Otwórz sklep',
    uk: 'Відкрити магазин',
    be: 'Адкрыць краму'
  },

  // ========== SHOP page strings ==========
  shop_eyebrow: { en:'Concept shop', ru:'Магазин концепций', pl:'Sklep koncepcji', uk:'Магазин концепцій', be:'Крама канцэпцый' },
  shop_h1_a: { en:'Ready-to-launch ', ru:'Готовые к запуску ', pl:'Gotowe do startu ', uk:'Готові до старту ', be:'Гатовыя да старту ' },
  shop_h1_b: { en:'concepts.', ru:'концепции.', pl:'koncepcje.', uk:'концепції.', be:'канцэпцыі.' },
  shop_lead: {
    en:'Each concept ships with a 25-slide brandbook, verified budget, and a 7-week launch plan. Pick one, go from idea to first customer without re-inventing anything.',
    ru:'Каждая концепция содержит 25-слайдовый брендбук, проверенный бюджет и 7-недельный план запуска. Выберите одну — от идеи до первого клиента без изобретения велосипеда.',
    pl:'Każda koncepcja zawiera 25-slajdowy brandbook, zweryfikowany budżet i 7-tygodniowy plan startu. Wybierz jedną — od pomysłu do pierwszego klienta bez wymyślania koła na nowo.',
    uk:'Кожна концепція містить 25-слайдовий брендбук, перевірений бюджет і 7-тижневий план запуску. Обери одну — від ідеї до першого клієнта без винайдення колеса.',
    be:'Кожная канцэпцыя ўтрымлівае 25-слайдавы брэндбук, правераны бюджэт і 7-тыднёвы план запуску. Абяры адну — ад ідэі да першага кліента без вынаходжання кола.'
  },
  shop_chip_all: { en:'All', ru:'Все', pl:'Wszystkie', uk:'Усі', be:'Усе' },
  shop_search_ph: { en:'Search concepts…', ru:'Поиск концепций…', pl:'Szukaj koncepcji…', uk:'Пошук концепцій…', be:'Пошук канцэпцый…' },
  shop_sort_price: { en:'Price', ru:'Цена', pl:'Cena', uk:'Ціна', be:'Цана' },
  shop_sort_budget: { en:'Budget', ru:'Бюджет', pl:'Budżet', uk:'Бюджет', be:'Бюджэт' },
  shop_load_more: { en:'Load more', ru:'Показать ещё', pl:'Pokaż więcej', uk:'Показати ще', be:'Паказаць яшчэ' },
  shop_empty: { en:'No concepts match your filters.', ru:'Нет концепций по выбранным фильтрам.', pl:'Brak koncepcji pasujących do filtrów.', uk:'Немає концепцій за обраними фільтрами.', be:'Няма канцэпцый па абраных фільтрах.' },
  cs_eyebrow: { en:'Coming soon', ru:'Скоро', pl:'Wkrótce', uk:'Незабаром', be:'Хутка' },
  cs_h_a: { en:' more concepts ', ru:' ещё концепций ', pl:' więcej koncepcji ', uk:' ще концепцій ', be:' яшчэ канцэпцый ' },
  cs_h_b: { en:'in the works.', ru:'в работе.', pl:'w przygotowaniu.', uk:'у роботі.', be:'у працы.' },
  cs_lead: {
    en:"We release them as each brandbook ships. Tell us which one excites you — we'll notify you the moment it's live, with a founder-only discount.",
    ru:'Мы выпускаем их по мере готовности брендбуков. Скажи, какая зацепила — пришлём, когда выйдет, со скидкой для основателей.',
    pl:'Wypuszczamy je w miarę gotowości brandbooków. Powiedz, która Cię zainteresowała — wyślemy alert, gdy wyjdzie, ze zniżką dla founderów.',
    uk:'Ми випускаємо їх по мірі готовності брендбуків. Скажи, яка зацікавила — пришлемо, коли вийде, зі знижкою для засновників.',
    be:'Мы выпускаем іх па меры гатоўнасці брэндбукаў. Скажы, якая зацікавіла — прышлем, калі выйдзе, са скідкай для заснавальнікаў.'
  },
  cs_modal_lead: {
    en: "Leave your email — we'll tell you the moment this concept's brandbook is live, with a founder-only discount.",
    ru: 'Оставь email — сообщим, как только брендбук этой концепции выйдет, со скидкой для основателей.',
    pl: 'Zostaw e-mail — damy znać, gdy brandbook tej koncepcji będzie gotowy, ze zniżką dla founderów.',
    uk: 'Залиш email — повідомимо, щойно брендбук цієї концепції вийде, зі знижкою для засновників.',
    be: 'Пакінь email — паведамім, як толькі брэндбук гэтай канцэпцыі выйдзе, са скідкай для заснавальнікаў.'
  },
  cs_email_ph: { en:'you@example.com', ru:'you@example.com', pl:'you@example.com', uk:'you@example.com', be:'you@example.com' },
  cs_notify: { en:'Notify me', ru:'Сообщить мне', pl:'Powiadom mnie', uk:'Сповістити', be:'Паведаміць' },

  // ========== HERO PRE-FILTER (one-line concierge above grid) ==========
  pf_label: { en:'Help me find', ru:'Помоги найти', pl:'Pomóż znaleźć', uk:'Допоможи знайти', be:'Дапамажы знайсці' },
  pf_any_cat: { en:'any category', ru:'любая категория', pl:'dowolna kategoria', uk:'будь-яка категорія', be:'любая катэгорыя' },
  pf_any_country: { en:'any country', ru:'любая страна', pl:'dowolny kraj', uk:'будь-яка країна', be:'любая краіна' },
  pf_any_budget: { en:'any budget', ru:'любой бюджет', pl:'dowolny budżet', uk:'будь-який бюджет', be:'любы бюджэт' },
  pf_show: { en:'Show matches', ru:'Показать', pl:'Pokaż', uk:'Показати', be:'Паказаць' },
  pf_ai: { en:'Ask AI →', ru:'Спросить AI →', pl:'Zapytaj AI →', uk:'Запитати AI →', be:'Спытаць AI →' },

  // ========== AI shop advisor (sidebar + CTA banner) ==========
  advisor_cta_title: {
    en: 'Hard to choose your future business?',
    ru: 'Трудно выбрать будущий бизнес?',
    pl: 'Trudno wybrać przyszły biznes?',
    uk: 'Важко обрати майбутній бізнес?',
    be: 'Цяжка абраць будучы бізнес?'
  },
  advisor_cta_sub: {
    en: 'Our AI assistant knows every concept in the catalog. Tell it your budget, city and the vibe — it points you to the 1–2 that fit.',
    ru: 'AI-ассистент знает каждую концепцию в каталоге. Напиши бюджет, город и вайб — он подскажет 1–2 подходящие.',
    pl: 'Nasz AI zna każdą koncepcję w katalogu. Powiedz budżet, miasto i klimat — wskaże 1–2 pasujące.',
    uk: 'Наш AI знає кожну концепцію в каталозі. Скажи бюджет, місто й вайб — підкаже 1–2 підходящі.',
    be: 'Наш AI ведае кожную канцэпцыю ў каталогу. Скажы бюджэт, горад і вайб — падкажа 1–2 прыдатныя.'
  },
  advisor_cta_btn: {
    en: 'Ask the assistant →',
    ru: 'Спросить ассистента →',
    pl: 'Zapytaj asystenta →',
    uk: 'Запитати асистента →',
    be: 'Спытаць асістэнта →'
  },
  advisor_title: {
    en: 'Catalog concierge',
    ru: 'Консьерж каталога',
    pl: 'Concierge katalogu',
    uk: 'Консьєрж каталогу',
    be: 'Кансьерж каталога'
  },
  advisor_role: { en: 'AI · Beta', ru: 'AI · Бета', pl: 'AI · Beta', uk: 'AI · Бета', be: 'AI · Бэта' },
  advisor_placeholder: {
    en: 'Tell me budget, city, vibe…',
    ru: 'Бюджет, город, вайб…',
    pl: 'Budżet, miasto, klimat…',
    uk: 'Бюджет, місто, вайб…',
    be: 'Бюджэт, горад, вайб…'
  },
  advisor_foot: {
    en: 'Anonymous · Catalog only · Claude Haiku',
    ru: 'Анонимно · Только каталог · Claude Haiku',
    pl: 'Anonimowo · Tylko katalog · Claude Haiku',
    uk: 'Анонімно · Тільки каталог · Claude Haiku',
    be: 'Ананімна · Толькі каталог · Claude Haiku'
  },
  advisor_chip_budget: { en: '€20k budget · Warsaw', ru: 'бюджет €20k · Варшава', pl: 'budżet 20 tys. € · Warszawa', uk: 'бюджет €20k · Варшава', be: 'бюджэт €20k · Варшава' },
  advisor_chip_food: { en: 'small food spot', ru: 'небольшой формат еды', pl: 'mały lokal gastronomiczny', uk: 'невеликий гастро-формат', be: 'невялікі гастра-фармат' },
  advisor_chip_solo: { en: 'solo founder', ru: 'один основатель', pl: 'pojedynczy founder', uk: 'один засновник', be: 'адзін заснавальнік' },

  // ========== NAV ==========
  nav_shop: { en: 'Shop', ru: 'Магазин', pl: 'Sklep', uk: 'Магазин', be: 'Крама' },
  nav_what: { en: 'What it is', ru: 'Что это', pl: 'Co to jest', uk: 'Що це', be: 'Што гэта' },
  nav_how: { en: 'How it works', ru: 'Как это работает', pl: 'Jak to działa', uk: 'Як це працює', be: 'Як гэта працуе' },
  nav_catalog: { en: 'Catalog', ru: 'Каталог', pl: 'Katalog', uk: 'Каталог', be: 'Каталог' },
  nav_pricing: { en: 'Pricing', ru: 'Цены', pl: 'Cennik', uk: 'Ціни', be: 'Цэны' },
  nav_support: { en: 'Full support', ru: 'Полная поддержка', pl: 'Pełne wsparcie', uk: 'Повна підтримка', be: 'Поўная падтрымка' },
  nav_faq: { en: 'FAQ', ru: 'FAQ', pl: 'FAQ', uk: 'FAQ', be: 'FAQ' },
  nav_signin: { en: 'Sign in', ru: 'Войти', pl: 'Zaloguj', uk: 'Увійти', be: 'Увайсці' },
  nav_signup: { en: 'Sign up', ru: 'Регистрация', pl: 'Rejestracja', uk: 'Реєстрація', be: 'Рэгістрацыя' },
  nav_cabinet: { en: 'My cabinet', ru: 'Мой кабинет', pl: 'Mój kabinet', uk: 'Мій кабінет', be: 'Мой кабінет' },
  nav_favs: { en: 'Favorites', ru: 'Избранное', pl: 'Ulubione', uk: 'Обране', be: 'Абранае' },
  nav_mine: { en: 'My concepts', ru: 'Мои концепции', pl: 'Moje koncepcje', uk: 'Мої концепції', be: 'Мае канцэпцыі' },
  nav_settings: { en: 'Settings', ru: 'Настройки', pl: 'Ustawienia', uk: 'Налаштування', be: 'Налады' },
  nav_signout: { en: 'Sign out', ru: 'Выйти', pl: 'Wyloguj', uk: 'Вийти', be: 'Выйсці' },
  nav_admin: { en: 'Admin', ru: 'Админ', pl: 'Admin', uk: 'Адмін', be: 'Адмін' },
  nav_subscribe: { en: 'Subscribe', ru: 'Подписка', pl: 'Subskrypcja', uk: 'Підписка', be: 'Падпіска' },
  nav_generate: { en: 'Generate', ru: 'Создать', pl: 'Generuj', uk: 'Створити', be: 'Стварыць' },
  nav_cart: { en: 'Cart', ru: 'Корзина', pl: 'Koszyk', uk: 'Кошик', be: 'Кошык' },
  nav_library: { en: 'Open library', ru: 'Открыть библиотеку', pl: 'Otwórz bibliotekę', uk: 'Відкрити бібліотеку', be: 'Адкрыць бібліятэку' },

  // ========== shop.html ==========
  shop_eyebrow: { en: 'Concept shop', ru: 'Магазин концепций', pl: 'Sklep konceptów', uk: 'Магазин концепцій', be: 'Крама канцэпцый' },
  shop_h1_a: { en: 'Ready-to-launch ', ru: 'Готовые к запуску ', pl: 'Gotowe do startu ', uk: 'Готові до запуску ', be: 'Гатовыя да запуску ' },
  shop_h1_b: { en: 'concepts.', ru: 'концепции.', pl: 'koncepty.', uk: 'концепції.', be: 'канцэпцыі.' },
  shop_lead: {
    en: 'Each concept ships with a 25-slide brandbook, verified budget, and a 7-week launch plan. Pick one, go from idea to first customer without re-inventing anything.',
    ru: 'Каждая концепция — 25-слайдовый брендбук, проверенный бюджет и 7-недельный план запуска. Выбери одну, иди от идеи до первого клиента без изобретения колеса.',
    pl: 'Każdy koncept zawiera 25-slajdowy brandbook, zweryfikowany budżet i 7-tygodniowy plan startu. Wybierz jeden, przejdź od pomysłu do pierwszego klienta bez wymyślania koła.',
    uk: 'Кожна концепція — 25-слайдовий брендбук, перевірений бюджет і 7-тижневий план запуску. Обери одну та йди від ідеї до першого клієнта без винайдення велосипеда.',
    be: 'Кожная канцэпцыя — 25-слайдавы брэндбук, праверены бюджэт і 7-тыднёвы план запуску. Выберы адну і йдзі ад ідэі да першага кліента без выдумкі ровара.'
  },
  shop_chip_all: { en: 'All', ru: 'Все', pl: 'Wszystkie', uk: 'Усі', be: 'Усе' },
  shop_search_ph: { en: 'Search concepts…', ru: 'Поиск концепций…', pl: 'Szukaj konceptów…', uk: 'Пошук концепцій…', be: 'Шукаць канцэпцыі…' },
  shop_sort_price: { en: 'Price', ru: 'Цена', pl: 'Cena', uk: 'Ціна', be: 'Цана' },
  shop_sort_budget: { en: 'Budget', ru: 'Бюджет', pl: 'Budżet', uk: 'Бюджет', be: 'Бюджэт' },
  shop_count_word: { en: 'concepts', ru: 'концепций', pl: 'konceptów', uk: 'концепцій', be: 'канцэпцый' },
  shop_load_more: { en: 'Load more', ru: 'Загрузить ещё', pl: 'Załaduj więcej', uk: 'Завантажити ще', be: 'Загрузіць яшчэ' },
  shop_empty: { en: 'No concepts match your filters.', ru: 'Нет концепций под твои фильтры.', pl: 'Brak konceptów pasujących do filtrów.', uk: 'Немає концепцій під твої фільтри.', be: 'Няма канцэпцый пад твае фільтры.' },

  // ========== Coming Soon ==========
  cs_eyebrow: { en: 'Coming soon', ru: 'Скоро', pl: 'Wkrótce', uk: 'Незабаром', be: 'Хутка' },
  cs_h_a: { en: ' more concepts ', ru: ' концепций ', pl: ' kolejnych konceptów ', uk: ' нових концепцій ', be: ' новых канцэпцый ' },
  cs_h_b: { en: 'in the works.', ru: 'в работе.', pl: 'w drodze.', uk: 'у роботі.', be: 'у працы.' },
  cs_lead: {
    en: "We release them as each brandbook ships. Tell us which one excites you — we'll notify you the moment it's live, with a founder-only discount.",
    ru: 'Выпускаем по мере готовности брендбуков. Скажи, какая интересна — уведомим в момент запуска, со скидкой для основателей.',
    pl: 'Wypuszczamy je w miarę powstawania brandbooków. Powiedz, który Cię interesuje — powiadomimy Cię w chwili publikacji, z rabatem dla founderów.',
    uk: 'Випускаємо їх по мірі готовності брендбуків. Скажи, яка цікава — повідомимо в момент запуску, зі знижкою для засновників.',
    be: 'Выпускаем іх па меры гатоўнасці брэндбукаў. Скажы, якая цікавая — паведамім у момант запуску, са зніжкай для заснавальнікаў.'
  },
  cs_email_ph: { en: 'you@example.com', ru: 'ты@пример.com', pl: 'ty@przyklad.pl', uk: 'ти@приклад.com', be: 'ты@прыклад.com' },
  cs_notify: { en: 'Notify me', ru: 'Сообщить мне', pl: 'Powiadom mnie', uk: 'Сповістити', be: 'Паведаміць' },
  cs_modal_lead: {
    en: "Leave your email — we'll tell you the moment this concept's brandbook is live, with a founder-only discount.",
    ru: 'Оставь email — уведомим в момент запуска этой концепции, со скидкой для основателей.',
    pl: 'Zostaw email — powiadomimy Cię w momencie publikacji tego konceptu, z rabatem dla founderów.',
    uk: 'Залиш email — повідомимо в момент запуску цієї концепції, зі знижкою для засновників.',
    be: 'Пакінь email — паведамім у момант запуску гэтай канцэпцыі, са зніжкай для заснавальнікаў.'
  },

  // ========== account.html ==========
  acc_welcome: { en: 'Welcome', ru: 'Добро пожаловать', pl: 'Witaj', uk: 'Вітаємо', be: 'Вітаю' },
  acc_signin: { en: 'Sign in', ru: 'Войти', pl: 'Zaloguj się', uk: 'Увійти', be: 'Увайсці' },
  acc_signup: { en: 'Sign up', ru: 'Регистрация', pl: 'Zarejestruj się', uk: 'Реєстрація', be: 'Рэгістрацыя' },
  acc_email: { en: 'Email', ru: 'Email', pl: 'Email', uk: 'Email', be: 'Email' },
  acc_password: { en: 'Password', ru: 'Пароль', pl: 'Hasło', uk: 'Пароль', be: 'Пароль' },
  acc_continue: { en: 'Continue', ru: 'Продолжить', pl: 'Dalej', uk: 'Далі', be: 'Далей' },
  acc_send_link: { en: 'Send magic link', ru: 'Отправить magic link', pl: 'Wyślij magic link', uk: 'Надіслати magic link', be: 'Адправіць magic link' },
  acc_or: { en: 'or', ru: 'или', pl: 'lub', uk: 'або', be: 'або' },
  acc_have: { en: 'Have an account?', ru: 'Уже есть аккаунт?', pl: 'Masz konto?', uk: 'Вже маєш акаунт?', be: 'Маеш акаўнт?' },
  acc_no: { en: 'No account yet?', ru: 'Ещё нет аккаунта?', pl: 'Nie masz konta?', uk: 'Ще немає акаунту?', be: 'Яшчэ няма акаўнта?' },
  acc_tab_cabinet: { en: 'Cabinet', ru: 'Кабинет', pl: 'Panel', uk: 'Кабінет', be: 'Кабінет' },
  acc_tab_favs: { en: 'Favorites', ru: 'Избранное', pl: 'Ulubione', uk: 'Обране', be: 'Абранае' },
  acc_tab_owned: { en: 'My concepts', ru: 'Мои концепции', pl: 'Moje koncepty', uk: 'Мої концепції', be: 'Мае канцэпцыі' },
  acc_tab_settings: { en: 'Settings', ru: 'Настройки', pl: 'Ustawienia', uk: 'Налаштування', be: 'Налады' },
  acc_owned_empty: { en: 'You haven’t purchased any concept yet.', ru: 'Ещё не куплено ни одной концепции.', pl: 'Nie kupiłeś jeszcze żadnego konceptu.', uk: 'Ще не придбано жодної концепції.', be: 'Яшчэ не куплена ні адной канцэпцыі.' },
  acc_favs_empty: { en: 'No favorites yet.', ru: 'Нет избранного.', pl: 'Brak ulubionych.', uk: 'Немає обраного.', be: 'Няма абранага.' },
  acc_browse_shop: { en: 'Browse shop →', ru: 'В магазин →', pl: 'Przejdź do sklepu →', uk: 'До магазину →', be: 'У краму →' },
  acc_signout_btn: { en: 'Sign out', ru: 'Выйти', pl: 'Wyloguj', uk: 'Вийти', be: 'Выйсці' },

  // ========== generate.html ==========
  gen_eyebrow:    { en: 'AI concept generator', ru: 'AI-генератор концепций', pl: 'Generator konceptów AI', uk: 'AI-генератор концепцій', be: 'AI-генератар канцэпцый' },
  gen_h1:         { en: 'Tell us what to <span class="accent">imagine</span>.', ru: 'Скажите, что нам <span class="accent">придумать</span>.', pl: 'Powiedz, co <span class="accent">wymyślić</span>.', uk: 'Скажіть, що нам <span class="accent">придумати</span>.', be: 'Скажыце, што нам <span class="accent">прыдумаць</span>.' },
  gen_lead:       { en: 'Pick the shape of your future business. In about a minute Svita will return a full concept — brand name, tagline, palette, interior, equipment list, and four nano-banana prompts ready for a 25-page brandbook.', ru: 'Опишите будущий бизнес. Примерно за минуту Svita вернёт целую концепцию — название, слоган, палитру, интерьер, список оборудования и четыре nano-banana промпта для 25-страничного брендбука.', pl: 'Opisz przyszły biznes. W około minutę Svita zwróci pełny koncept — nazwę marki, hasło, paletę, wnętrze, listę sprzętu i cztery nano-banana prompty na 25-stronicowy brandbook.', uk: 'Опишіть майбутній бізнес. Приблизно за хвилину Svita поверне повну концепцію — назву бренду, слоган, палітру, інтерʼєр, список обладнання та чотири nano-banana промпти для 25-сторінкового брендбуку.', be: 'Апішыце будучы бізнес. Прыкладна за хвіліну Svita верне поўную канцэпцыю — назву брэнда, слоган, палітру, інтэрʼер, спіс абсталявання і чатыры nano-banana промпты для 25-старонкавага брэндбуку.' },
  gen_f01:        { en: '<b>01</b> Business direction', ru: '<b>01</b> Направление бизнеса', pl: '<b>01</b> Kierunek biznesu', uk: '<b>01</b> Напрямок бізнесу', be: '<b>01</b> Накірунак бізнесу' },
  gen_f02:        { en: '<b>02</b> Budget tier', ru: '<b>02</b> Бюджетный уровень', pl: '<b>02</b> Poziom budżetu', uk: '<b>02</b> Рівень бюджету', be: '<b>02</b> Узровень бюджэту' },
  gen_f03:        { en: '<b>03</b> Style &amp; mood', ru: '<b>03</b> Стиль и настроение', pl: '<b>03</b> Styl i nastrój', uk: '<b>03</b> Стиль і настрій', be: '<b>03</b> Стыль і настрой' },
  gen_f04:        { en: '<b>04</b> Country', ru: '<b>04</b> Страна', pl: '<b>04</b> Kraj', uk: '<b>04</b> Країна', be: '<b>04</b> Краіна' },
  gen_f05:        { en: '<b>05</b> City', ru: '<b>05</b> Город', pl: '<b>05</b> Miasto', uk: '<b>05</b> Місто', be: '<b>05</b> Горад' },
  gen_f06:        { en: '<b>06</b> Footprint', ru: '<b>06</b> Площадь', pl: '<b>06</b> Powierzchnia', uk: '<b>06</b> Площа', be: '<b>06</b> Плошча' },
  gen_f07:        { en: '<b>07</b> Primary audience', ru: '<b>07</b> Основная аудитория', pl: '<b>07</b> Główna grupa', uk: '<b>07</b> Основна аудиторія', be: '<b>07</b> Асноўная аўдыторыя' },
  gen_f08:        { en: '<b>08</b> Uniqueness level', ru: '<b>08</b> Уровень оригинальности', pl: '<b>08</b> Poziom oryginalności', uk: '<b>08</b> Рівень оригінальності', be: '<b>08</b> Узровень арыгінальнасці' },
  gen_f09:        { en: '<b>09</b> Season focus', ru: '<b>09</b> Сезонный фокус', pl: '<b>09</b> Sezonowy fokus', uk: '<b>09</b> Сезонний фокус', be: '<b>09</b> Сезонны фокус' },
  gen_brand_hint: { en: 'Brand name hint', ru: 'Подсказка названия', pl: 'Sugestia nazwy', uk: 'Підказка назви', be: 'Падказка назвы' },
  gen_brand_opt:  { en: '(optional — leave blank to let AI invent)', ru: '(не обязательно — оставьте пустым, AI придумает сам)', pl: '(opcjonalnie — zostaw puste, AI wymyśli)', uk: '(необовʼязково — залиште порожнім, AI вигадає)', be: '(неабавязкова — пакіньце пустым, AI прыдумае)' },
  gen_hint:       { en: 'One generation ≈ 30–60 seconds. The concept is saved to your cabinet as a draft — you can claim it as exclusive afterwards.', ru: 'Одна генерация ≈ 30–60 секунд. Концепция сохраняется в кабинете как черновик — позже её можно сделать эксклюзивной.', pl: 'Jedna generacja ≈ 30–60 sekund. Koncept zapisuje się w gabinecie jako szkic — później można odebrać go jako wyłączny.', uk: 'Одна генерація ≈ 30–60 секунд. Концепція зберігається в кабінеті як чернетка — пізніше її можна забрати як ексклюзивну.', be: 'Адна генерацыя ≈ 30–60 секунд. Канцэпцыя захоўваецца ў кабінеце як чарнавік — пазней яе можна забраць як эксклюзіўную.' },
  gen_go:         { en: 'Generate concept', ru: 'Создать концепцию', pl: 'Wygeneruj koncept', uk: 'Створити концепцію', be: 'Стварыць канцэпцыю' },

  // category options
  gen_cat_food:      { en: 'Food & drink', ru: 'Еда и напитки', pl: 'Jedzenie i napoje', uk: 'Їжа і напої', be: 'Ежа і напоі' },
  gen_cat_craft:     { en: 'Craft & making', ru: 'Ремесло', pl: 'Rzemiosło', uk: 'Ремесло', be: 'Рамяство' },
  gen_cat_wellness:  { en: 'Wellness & beauty', ru: 'Велнес и красота', pl: 'Wellness i uroda', uk: 'Велнес і краса', be: 'Велнес і прыгажосць' },
  gen_cat_service:   { en: 'Service & repair', ru: 'Сервис и ремонт', pl: 'Serwis i naprawa', uk: 'Сервіс і ремонт', be: 'Сэрвіс і рамонт' },
  gen_cat_education: { en: 'Education & learning', ru: 'Образование', pl: 'Edukacja', uk: 'Освіта', be: 'Адукацыя' },
  gen_cat_retail:    { en: 'Retail boutique', ru: 'Бутик-ретейл', pl: 'Butik', uk: 'Бутик-рітейл', be: 'Бутык' },
  gen_cat_studio:    { en: 'Studio & practice', ru: 'Студия / практика', pl: 'Studio / praktyka', uk: 'Студія / практика', be: 'Студыя / практыка' },

  // audience options
  gen_aud_locals:    { en: 'Locals + creatives', ru: 'Местные и креативщики', pl: 'Lokalni + kreatywni', uk: 'Місцеві + креативщики', be: 'Мясцовыя + крэатыўныя' },
  gen_aud_young:     { en: 'Young professionals', ru: 'Молодые профессионалы', pl: 'Młodzi profesjonaliści', uk: 'Молоді професіонали', be: 'Маладыя прафесіяналы' },
  gen_aud_tourists:  { en: 'Tourists & travellers', ru: 'Туристы и путешественники', pl: 'Turyści i podróżnicy', uk: 'Туристи і подорожні', be: 'Турысты і падарожнікі' },
  gen_aud_wealthy:   { en: 'Wealthy regulars', ru: 'Состоятельные постоянные клиенты', pl: 'Zamożni stali klienci', uk: 'Заможні постійні клієнти', be: 'Заможныя сталыя кліенты' },
  gen_aud_students:  { en: 'Students + grad-school', ru: 'Студенты и аспиранты', pl: 'Studenci', uk: 'Студенти', be: 'Студэнты' },
  gen_aud_families:  { en: 'Families with kids', ru: 'Семьи с детьми', pl: 'Rodziny z dziećmi', uk: 'Сімʼї з дітьми', be: 'Сямʼі з дзецьмі' },
  gen_aud_late:      { en: 'Late-night crowd', ru: 'Ночная публика', pl: 'Publika nocna', uk: 'Нічна публіка', be: 'Начная публіка' },
  gen_aud_health:    { en: 'Health-conscious', ru: 'Сторонники здорового образа жизни', pl: 'Świadomi zdrowia', uk: 'Прихильники здоровʼя', be: 'Прыхільнікі здаровага ладу жыцця' },

  // uniqueness levels
  gen_uniq_conservative: { en: 'Conservative — familiar format done beautifully', ru: 'Консервативно — знакомый формат, выполненный красиво', pl: 'Konserwatywnie — znany format wykonany pięknie', uk: 'Консервативно — знайомий формат, виконаний красиво', be: 'Кансерватыўна — знаёмы фармат, выкананы прыгожа' },
  gen_uniq_bold:         { en: 'Bold — twist on a known idea', ru: 'Смело — необычный поворот известной идеи', pl: 'Śmiało — twist znanej idei', uk: 'Сміливо — твіст відомої ідеї', be: 'Адважна — паварот вядомай ідэі' },
  gen_uniq_avant:        { en: 'Avant-garde — unseen format', ru: 'Авангард — невиданный формат', pl: 'Awangarda — niewidziany format', uk: 'Авангард — небачений формат', be: 'Авангард — небачаны фармат' },

  // season focus
  gen_season_all:     { en: 'All-year', ru: 'Круглый год', pl: 'Cały rok', uk: 'Цілий рік', be: 'Увесь год' },
  gen_season_summer:  { en: 'Summer heavy', ru: 'Летний пик', pl: 'Sezon letni', uk: 'Літній пік', be: 'Летні пік' },
  gen_season_winter:  { en: 'Winter heavy', ru: 'Зимний пик', pl: 'Sezon zimowy', uk: 'Зимовий пік', be: 'Зімовы пік' },
  gen_season_holiday: { en: 'Holiday / seasonal pop-up', ru: 'Праздничный поп-ап', pl: 'Świąteczny pop-up', uk: 'Святковий поп-ап', be: 'Святочны поп-ап' },

  // loader
  gen_loading:        { en: 'Generating your concept…', ru: 'Генерируем вашу концепцию…', pl: 'Generujemy koncept…', uk: 'Генеруємо вашу концепцію…', be: 'Генеруем вашу канцэпцыю…' },

  // ========== landing section blocks ==========
  ba_eyebrow:      { en: '— two paths from idea to door —', ru: '— два пути от идеи до двери —', pl: '— dwie ścieżki od pomysłu do drzwi —', uk: '— два шляхи від ідеї до дверей —', be: '— два шляхі ад ідэі да дзвярэй —' },
  ba_h2:           { en: 'One is long and expensive. <span class="italic">The other is ours.</span>', ru: 'Один — долгий и дорогой. <span class="italic">Другой — наш.</span>', pl: 'Jedna jest długa i kosztowna. <span class="italic">Druga jest nasza.</span>', uk: 'Один — довгий і дорогий. <span class="italic">Інший — наш.</span>', be: 'Адзін — доўгі і дарагі. <span class="italic">Іншы — наш.</span>' },
  deli_eyebrow:    { en: "— what's inside a single concept —", ru: '— что внутри одной концепции —', pl: '— co kryje pojedynczy koncept —', uk: '— що всередині однієї концепції —', be: '— што ўнутры адной канцэпцыі —' },
  deli_h2:         { en: '7 documents · one linen folder.', ru: '7 документов · одна льняная папка.', pl: '7 dokumentów · jedna lniana teczka.', uk: '7 документів · одна лляна папка.', be: '7 дакументаў · адна льняная папка.' },
  deli_lead:       { en: 'Everything you need to hand to your contractor, printer and chef. Nothing left to write yourself.', ru: 'Всё, что нужно отдать подрядчику, типографии и шефу. Ничего не остаётся писать самому.', pl: 'Wszystko, co przekażesz wykonawcy, drukarni i szefowi kuchni. Nic do napisania samemu.', uk: 'Усе, що передасте підряднику, друкарні та шефу. Нічого не залишається писати самому.', be: 'Усё, што перадаеце падрадчыку, друкарні і шэфу. Нічога не застаецца пісаць самому.' },
  cat_btn_full:    { en: 'Open the full catalog', ru: 'Открыть весь каталог', pl: 'Otwórz pełny katalog', uk: 'Відкрити весь каталог', be: 'Адкрыць увесь каталог' },
  faq_eyebrow_idx: { en: '— frequently asked —', ru: '— частые вопросы —', pl: '— często zadawane —', uk: '— часті питання —', be: '— частыя пытанні —' },
  faq_h2_idx:      { en: 'The short answers.', ru: 'Короткие ответы.', pl: 'Krótkie odpowiedzi.', uk: 'Короткі відповіді.', be: 'Кароткія адказы.' },

  // ========== subscribe.html ==========
  sub_eyebrow:        { en: 'one subscription · whole library', ru: 'одна подписка · вся библиотека', pl: 'jedna subskrypcja · cała biblioteka', uk: 'одна підписка · вся бібліотека', be: 'адна падпіска · уся бібліятэка' },
  sub_hero_h1:        { en: 'One subscription. <span class="it">Every concept.</span>', ru: 'Одна подписка. <span class="it">Все концепции.</span>', pl: 'Jedna subskrypcja. <span class="it">Każdy koncept.</span>', uk: 'Одна підписка. <span class="it">Усі концепції.</span>', be: 'Адна падпіска. <span class="it">Усе канцэпцыі.</span>' },
  sub_hero_lead:      { en: 'A library of {N} ready-to-launch business concepts — each one a full brandbook, not a teaser. One card opens all of it.', ru: 'Библиотека из {N} готовой к запуску бизнес-концепции — каждая полный брендбук, а не тизер. Одна карта открывает всё.', pl: 'Biblioteka {N} gotowych do uruchomienia konceptów — każdy pełny brandbook, nie tylko zajawka. Jedna karta otwiera wszystko.', uk: 'Бібліотека з {N} готової до запуску бізнес-концепції — кожна повний брендбук, а не тизер. Одна карта відкриває все.', be: 'Бібліятэка з {N} гатовай да запуску бізнес-канцэпцыі — кожная поўны брэндбук, а не тызер. Адна карта адкрывае ўсё.' },
  sub_trust_trial:    { en: '2 days free', ru: '2 дня бесплатно', pl: '2 dni za darmo', uk: '2 дні безкоштовно', be: '2 дні бясплатна' },
  sub_trust_cancel:   { en: 'cancel in one click', ru: 'отмена в один клик', pl: 'anuluj jednym kliknięciem', uk: 'скасування одним кліком', be: 'адмена ў адзін клік' },
  sub_trust_weekly:   { en: 'new concepts every week', ru: 'новые концепции каждую неделю', pl: 'nowe koncepty co tydzień', uk: 'нові концепції щотижня', be: 'новыя канцэпцыі кожны тыдзень' },
  sub_pick:           { en: 'pick your card', ru: 'выберите карту', pl: 'wybierz kartę', uk: 'оберіть карту', be: 'абярыце карту' },
  sub_two_ways:       { en: 'Two ways to <span class="it">subscribe.</span>', ru: 'Два способа <span class="it">подписаться.</span>', pl: 'Dwa sposoby na <span class="it">subskrypcję.</span>', uk: 'Два способи <span class="it">підписатися.</span>', be: 'Два спосабы <span class="it">падпісацца.</span>' },
  sub_monthly_name:   { en: 'Monthly', ru: 'Ежемесячно', pl: 'Miesięcznie', uk: 'Щомісяця', be: 'Штомесяц' },
  sub_per_mo:         { en: '/ mo', ru: '/ мес', pl: '/ mies', uk: '/ міс', be: '/ мес' },
  sub_monthly_sub:    { en: 'The whole library. Cancel anytime — nothing you opened is lost.', ru: 'Вся библиотека. Отмена в любой момент — то, что вы открыли, остаётся с вами.', pl: 'Cała biblioteka. Anuluj w każdej chwili — to, co otworzyłeś, zostaje z Tobą.', uk: 'Уся бібліотека. Скасування будь-коли — те, що ви відкрили, залишається з вами.', be: 'Уся бібліятэка. Адмена ў любы момант — тое, што вы адкрылі, застаецца з вамі.' },
  sub_b_access:       { en: 'Access to all {N} concepts', ru: 'Доступ ко всем {N} концепции', pl: 'Dostęp do wszystkich {N} konceptów', uk: 'Доступ до всіх {N} концепцій', be: 'Доступ да ўсіх {N} канцэпцый' },
  sub_b_new:          { en: 'New concepts unlock instantly', ru: 'Новые концепции открываются мгновенно', pl: 'Nowe koncepty otwierają się natychmiast', uk: 'Нові концепції відкриваються миттєво', be: 'Новыя канцэпцыі адкрываюцца імгненна' },
  sub_b_ai:           { en: 'AI concept generator included', ru: 'AI-генератор концепций включён', pl: 'Generator konceptów AI w cenie', uk: 'AI-генератор концепцій включено', be: 'AI-генератар канцэпцый уключаны' },
  sub_b_trial:        { en: '2 days free · cancel in one click', ru: '2 дня бесплатно · отмена в один клик', pl: '2 dni za darmo · anuluj jednym kliknięciem', uk: '2 дні безкоштовно · скасування одним кліком', be: '2 дні бясплатна · адмена ў адзін клік' },
  sub_cta_trial:      { en: 'Start free trial →', ru: 'Начать бесплатно →', pl: 'Rozpocznij za darmo →', uk: 'Почати безкоштовно →', be: 'Пачаць бясплатна →' },
  sub_best:           { en: 'best value', ru: 'лучшая цена', pl: 'najlepsza wartość', uk: 'найкраща ціна', be: 'найлепшы кошт' },
  sub_yearly_name:    { en: 'Yearly · −35%', ru: 'Год · −35%', pl: 'Roczna · −35%', uk: 'Рік · −35%', be: 'Год · −35%' },
  sub_per_yr:         { en: '/ year', ru: '/ год', pl: '/ rok', uk: '/ рік', be: '/ год' },
  sub_yearly_sub:     { en: 'The same library in one annual payment — about two months cheaper.', ru: 'Та же библиотека за один годовой платёж — примерно на два месяца дешевле.', pl: 'Ta sama biblioteka w jednej rocznej płatności — około dwóch miesięcy taniej.', uk: 'Та сама бібліотека за один річний платіж — приблизно на два місяці дешевше.', be: 'Тая ж бібліятэка за адзін гадавы плацёж — прыкладна на два месяцы танней.' },
  sub_y_all:          { en: 'Everything in Monthly', ru: 'Всё из ежемесячного тарифа', pl: 'Wszystko z planu miesięcznego', uk: 'Усе з місячного тарифу', be: 'Усё з месячнага тарыфу' },
  sub_y_save:         { en: 'About −35% vs paying monthly', ru: 'Около −35% против ежемесячной оплаты', pl: 'Około −35% w porównaniu z opłatą miesięczną', uk: 'Близько −35% проти щомісячної оплати', be: 'Каля −35% супраць штомесячнай аплаты' },
  sub_y_invoice:      { en: 'One invoice a year — no surprise charges', ru: 'Один счёт в год — без сюрпризов', pl: 'Jedna faktura rocznie — bez niespodzianek', uk: 'Один рахунок на рік — без сюрпризів', be: 'Адзін рахунак у год — без сюрпрызаў' },
  sub_y_cancel:       { en: 'Cancel before the next renewal', ru: 'Отмена до следующего продления', pl: 'Anuluj przed kolejnym przedłużeniem', uk: 'Скасуйте до наступного поновлення', be: 'Адмяніце да наступнага падаўжэння' },
  sub_cta_yearly:     { en: 'Pay yearly →', ru: 'Оплатить за год →', pl: 'Zapłać rocznie →', uk: 'Сплатити за рік →', be: 'Аплаціць за год →' },
  sub_pay_note:       { en: 'VAT / sales tax added at checkout where required · payments via Lemon Squeezy · cards, SEPA, Apple Pay, Google Pay', ru: 'НДС / налог с продаж добавляется при оплате, где применимо · платежи через Lemon Squeezy · карты, SEPA, Apple Pay, Google Pay', pl: 'VAT / podatek dodawany przy płatności, gdzie wymagany · płatności przez Lemon Squeezy · karty, SEPA, Apple Pay, Google Pay', uk: 'ПДВ / податок з продажу додається при оплаті, де потрібно · платежі через Lemon Squeezy · картки, SEPA, Apple Pay, Google Pay', be: 'ПДВ / падатак з продажу дадаецца пры аплаце, дзе патрэбна · плацяжы праз Lemon Squeezy · карты, SEPA, Apple Pay, Google Pay' },
  sub_inside_eyebrow: { en: "what's inside", ru: 'что внутри', pl: 'co w środku', uk: 'що всередині', be: 'што ўнутры' },
  sub_inside_h2:      { en: 'Everything the subscription unlocks.', ru: 'Всё, что открывает подписка.', pl: 'Wszystko, co otwiera subskrypcja.', uk: 'Усе, що відкриває підписка.', be: 'Усё, што адкрывае падпіска.' },
  sub_p1_h:           { en: 'The whole library — {N} concepts', ru: 'Вся библиотека — {N} концепция', pl: 'Cała biblioteka — {N} konceptów', uk: 'Уся бібліотека — {N} концепція', be: 'Уся бібліятэка — {N} канцэпцыя' },
  sub_p1_p:           { en: 'Coffee bars, matcha kiosks, ramen counters, beauty studios, repair ateliers. Every category, every concept — open the moment you subscribe.', ru: 'Кофейни, матча-киоски, рамен-бары, салоны красоты, ремонтные ателье. Каждая категория, каждая концепция — открываются в момент подписки.', pl: 'Kawiarnie, kioski matcha, bary ramen, salony piękności, atelier napraw. Każda kategoria, każdy koncept — otwierane w chwili subskrypcji.', uk: 'Кавʼярні, матча-кіоски, рамен-бари, салони краси, ремонтні ательє. Кожна категорія, кожна концепція — відкриваються в момент підписки.', be: 'Кавярні, матча-кіёскі, рамен-бары, салоны прыгажосці, рамонтныя атэлье. Кожная катэгорыя, кожная канцэпцыя — адкрываюцца ў момант падпіскі.' },
  sub_p2_h:           { en: 'A full 25-page brandbook each', ru: 'Полный 25-страничный брендбук в каждой', pl: 'Pełny 25-stronicowy brandbook w każdej', uk: 'Повний 25-сторінковий брендбук у кожній', be: 'Поўны 25-старонкавы брэндбук у кожнай' },
  sub_p2_p:           { en: 'Not a mood board. Concept, audience, floor plan, equipment list, verified budget, P&L, suppliers, registration steps and a 9-week launch timeline.', ru: 'Не мудборд. Концепция, аудитория, план этажа, список оборудования, проверенный бюджет, P&L, поставщики, шаги регистрации и 9-недельный план запуска.', pl: 'Nie mood board. Koncept, grupa docelowa, plan piętra, lista sprzętu, zweryfikowany budżet, P&L, dostawcy, kroki rejestracji i 9-tygodniowy harmonogram uruchomienia.', uk: 'Не мудборд. Концепція, аудиторія, план поверху, список обладнання, перевірений бюджет, P&L, постачальники, кроки реєстрації та 9-тижневий план запуску.', be: 'Не мудборд. Канцэпцыя, аўдыторыя, план паверху, спіс абсталявання, праверны бюджэт, P&L, пастаўшчыкі, крокі рэгістрацыі і 9-тыднёвы план запуску.' },
  sub_p3_h:           { en: 'New concepts every week', ru: 'Новые концепции каждую неделю', pl: 'Nowe koncepty co tydzień', uk: 'Нові концепції щотижня', be: 'Новыя канцэпцыі кожны тыдзень' },
  sub_p3_p:           { en: 'The library keeps growing. Fresh editorial brandbooks land continuously and unlock instantly for every subscriber — no extra charge.', ru: 'Библиотека продолжает расти. Новые редакторские брендбуки появляются постоянно и открываются мгновенно для каждого подписчика — без доплат.', pl: 'Biblioteka rośnie. Świeże redakcyjne brandbooki pojawiają się ciągle i otwierają się natychmiast dla każdego subskrybenta — bez dopłat.', uk: 'Бібліотека продовжує рости. Нові редакційні брендбуки зʼявляються постійно і відкриваються миттєво для кожного підписника — без доплат.', be: 'Бібліятэка працягвае расці. Новыя рэдакцыйныя брэндбукі зʼяўляюцца пастаянна і адкрываюцца імгненна для кожнага падпісчыка — без даплат.' },
  sub_p4_h:           { en: 'AI concept generator', ru: 'AI-генератор концепций', pl: 'Generator konceptów AI', uk: 'AI-генератор концепцій', be: 'AI-генератар канцэпцый' },
  sub_p4_p:           { en: "Need something that isn't in the catalogue? Spin up a fresh brandbook in about a minute and keep it in your cabinet forever.", ru: 'Нужно то, чего нет в каталоге? Создайте свежий брендбук примерно за минуту и оставьте его в кабинете навсегда.', pl: 'Potrzebujesz czegoś, czego nie ma w katalogu? Wygeneruj świeży brandbook w około minutę i zatrzymaj go w swoim gabinecie na zawsze.', uk: 'Потрібно щось, чого немає в каталозі? Створіть свіжий брендбук приблизно за хвилину і залиште його в кабінеті назавжди.', be: 'Патрэбна штосьці, чаго няма ў каталогу? Стварыце свежы брэндбук прыкладна за хвіліну і пакіньце яго ў кабінеце назаўсёды.' },
  sub_p5_h:           { en: 'Day-1 opening checklist', ru: 'Чек-лист первого дня', pl: 'Checklista dnia otwarcia', uk: 'Чек-лист першого дня', be: 'Чэк-ліст першага дня' },
  sub_p5_p:           { en: 'A printable PDF with 48 pre-launch tasks — included with every concept you open, so nothing is forgotten before the door swings.', ru: 'PDF для печати с 48 задачами до запуска — входит в каждую вашу концепцию, чтобы ничего не забыть до открытия.', pl: 'PDF do druku z 48 zadaniami przed startem — w komplecie z każdym konceptem, by nic nie zostało zapomniane przed otwarciem drzwi.', uk: 'PDF для друку з 48 завданнями до запуску — входить у кожну вашу концепцію, щоб нічого не забути до відкриття.', be: 'PDF для друку з 48 задачамі да запуску — уваходзіць у кожную вашу канцэпцыю, каб нічога не забыць да адкрыцця.' },
  sub_p6_h:           { en: 'Yours on every device', ru: 'Доступ с любого устройства', pl: 'Twoje na każdym urządzeniu', uk: 'Доступ з будь-якого пристрою', be: 'Доступ з любога прылады' },
  sub_p6_p:           { en: "Everything you open lives in your cabinet. Sign in anywhere — laptop, phone, the print shop's screen — and it's all there.", ru: 'Всё, что вы открыли, хранится в кабинете. Войдите откуда угодно — ноутбук, телефон, экран в типографии — всё на месте.', pl: 'Wszystko, co otworzysz, jest w Twoim gabinecie. Zaloguj się skądkolwiek — laptop, telefon, ekran w drukarni — wszystko tam jest.', uk: 'Усе, що ви відкрили, зберігається в кабінеті. Увійдіть звідки завгодно — ноутбук, телефон, екран в друкарні — все на місці.', be: 'Усё, што вы адкрылі, захоўваецца ў кабінеце. Увайдзіце адкуль заўгодна — ноўтбук, тэлефон, экран у друкарні — усё на месцы.' },
  sub_r1_t:           { en: 'Try before you pay', ru: 'Попробуйте перед оплатой', pl: 'Spróbuj zanim zapłacisz', uk: 'Спробуйте перед оплатою', be: 'Паспрабуйце перад аплатай' },
  sub_r1_d:           { en: "Two full days, the entire library open. If it's not for you, cancel and you're charged nothing.", ru: 'Целых семь дней — вся библиотека открыта. Если не подойдёт, отмените, и с вас ничего не возьмут.', pl: 'Pełne siedem dni — cała biblioteka otwarta. Jeśli nie pasuje, anuluj i nic Cię nie kosztuje.', uk: 'Цілих сім днів — уся бібліотека відкрита. Якщо не підійде, скасуйте, і з вас нічого не візьмуть.', be: 'Цэлых сем дзён — уся бібліятэка адкрыта. Калі не падыдзе, адмяніце, і з вас нічога не возьмуць.' },
  sub_r2_t:           { en: 'Cancel in one click', ru: 'Отмена в один клик', pl: 'Anuluj jednym kliknięciem', uk: 'Скасування одним кліком', be: 'Адмена ў адзін клік' },
  sub_r2_d:           { en: 'No emails, no retention maze. One button in your cabinet ends it — everything you already opened stays readable.', ru: 'Без писем и удерживающих лабиринтов. Одна кнопка в кабинете завершает всё — то, что вы уже открыли, остаётся доступным.', pl: 'Bez maili, bez labiryntu retencji. Jeden przycisk w gabinecie kończy wszystko — to, co już otworzyłeś, pozostaje czytelne.', uk: 'Без листів, без лабіринту утримання. Одна кнопка в кабінеті завершує все — те, що ви вже відкрили, залишається доступним.', be: 'Без лістоў, без лабірынта ўтрымання. Адна кнопка ў кабінеце завяршае ўсё — тое, што вы ўжо адкрылі, застаецца даступным.' },
  sub_r3_t:           { en: 'Bought a concept before?', ru: 'Покупали концепцию раньше?', pl: 'Kupiłeś koncept wcześniej?', uk: 'Купували концепцію раніше?', be: 'Куплялі канцэпцыю раней?' },
  sub_r3_d:           { en: 'Legacy buyers keep permanent access to what they purchased — no subscription needed for those.', ru: 'Старые покупатели сохраняют постоянный доступ к купленному — подписка для них не нужна.', pl: 'Klienci legacy zachowują stały dostęp do tego, co kupili — subskrypcja nie jest dla nich potrzebna.', uk: 'Старі покупці зберігають постійний доступ до купленого — підписка для них не потрібна.', be: 'Старыя пакупнікі захоўваюць пастаянны доступ да купленага — падпіска для іх не патрэбна.' },
  sub_back_shop:      { en: '← Browse the catalogue first', ru: '← Сначала посмотрите каталог', pl: '← Najpierw przejrzyj katalog', uk: '← Спочатку перегляньте каталог', be: '← Спачатку прагледзьце каталог' },

  // ========== account.html — full page ==========
  acc_access_eyebrow: { en: 'Account access', ru: 'Доступ к аккаунту', pl: 'Dostęp do konta', uk: 'Доступ до акаунта', be: 'Доступ да акаўнта' },
  acc_title_cabinet: { en: 'Your <span class="accent">cabinet</span>.', ru: 'Ваш <span class="accent">кабинет</span>.', pl: 'Twój <span class="accent">gabinet</span>.', uk: 'Ваш <span class="accent">кабінет</span>.', be: 'Ваш <span class="accent">кабінет</span>.' },
  acc_lead_signin: { en: 'Sign in to see your purchased concepts. No magic link required — just email and password.', ru: 'Войдите, чтобы увидеть купленные концепции. Без magic-ссылок — только email и пароль.', pl: 'Zaloguj się, aby zobaczyć kupione koncepty. Bez magic-linków — tylko email i hasło.', uk: 'Увійдіть, щоб побачити куплені концепції. Без magic-посилань — лише email і пароль.', be: 'Увайдзіце, каб убачыць купленыя канцэпцыі. Без magic-спасылак — толькі email і пароль.' },
  acc_forgot: { en: 'Forgot password?', ru: 'Забыли пароль?', pl: 'Nie pamiętasz hasła?', uk: 'Забули пароль?', be: 'Забылі пароль?' },
  acc_continue_google: { en: 'Continue with Google', ru: 'Войти через Google', pl: 'Kontynuuj z Google', uk: 'Увійти через Google', be: 'Увайсці праз Google' },
  acc_continue_github: { en: 'Continue with GitHub', ru: 'Войти через GitHub', pl: 'Kontynuuj z GitHub', uk: 'Увійти через GitHub', be: 'Увайсці праз GitHub' },
  acc_continue_discord: { en: 'Continue with Discord', ru: 'Войти через Discord', pl: 'Kontynuuj z Discord', uk: 'Увійти через Discord', be: 'Увайсці праз Discord' },
  acc_name: { en: 'Name', ru: 'Имя', pl: 'Imię', uk: 'Імʼя', be: 'Імя' },
  acc_confirm_pw: { en: 'Confirm password', ru: 'Повторите пароль', pl: 'Powtórz hasło', uk: 'Повторіть пароль', be: 'Паўтарыце пароль' },
  acc_create_account: { en: 'Create account', ru: 'Создать аккаунт', pl: 'Utwórz konto', uk: 'Створити акаунт', be: 'Стварыць акаўнт' },
  acc_send_reset: { en: 'Send reset link', ru: 'Отправить ссылку для сброса', pl: 'Wyślij link resetujący', uk: 'Надіслати посилання для скидання', be: 'Адправіць спасылку для скіду' },
  acc_back_signin: { en: 'Back to sign in', ru: 'Назад ко входу', pl: 'Powrót do logowania', uk: 'Назад до входу', be: 'Назад да ўваходу' },
  acc_new_pw: { en: 'New password', ru: 'Новый пароль', pl: 'Nowe hasło', uk: 'Новий пароль', be: 'Новы пароль' },
  acc_save_pw: { en: 'Save password', ru: 'Сохранить пароль', pl: 'Zapisz hasło', uk: 'Зберегти пароль', be: 'Захаваць пароль' },
  acc_note_tied: { en: 'Your purchased concepts are tied to your account. We never share your email.', ru: 'Купленные концепции привязаны к вашему аккаунту. Мы никогда не передаём ваш email.', pl: 'Kupione koncepty są przypisane do Twojego konta. Nigdy nie udostępniamy Twojego emaila.', uk: 'Куплені концепції привʼязані до вашого акаунта. Ми ніколи не передаємо ваш email.', be: 'Купленыя канцэпцыі прывязаны да вашага акаўнта. Мы ніколі не перадаём ваш email.' },
  acc_back_shop: { en: 'Back to shop', ru: 'Назад в магазин', pl: 'Powrót do sklepu', uk: 'Назад до магазину', be: 'Назад у краму' },
  acc_hero_eyebrow: { en: 'Your cabinet', ru: 'Ваш кабинет', pl: 'Twój gabinet', uk: 'Ваш кабінет', be: 'Ваш кабінет' },
  acc_hero_meta: { en: "Everything you've bought lives here.", ru: 'Здесь хранится всё, что вы купили.', pl: 'Tu jest wszystko, co kupiłeś.', uk: 'Тут зберігається все, що ви купили.', be: 'Тут захоўваецца ўсё, што вы купілі.' },
  acc_hello: { en: 'Hello,', ru: 'Привет,', pl: 'Cześć,', uk: 'Привіт,', be: 'Прывітанне,' },
  acc_lib_access: { en: 'Library access', ru: 'Доступ к библиотеке', pl: 'Dostęp do biblioteki', uk: 'Доступ до бібліотеки', be: 'Доступ да бібліятэкі' },
  acc_active: { en: 'Active', ru: 'Активен', pl: 'Aktywny', uk: 'Активний', be: 'Актыўны' },
  acc_trial: { en: 'Trial', ru: 'Пробный период', pl: 'Okres próbny', uk: 'Пробний період', be: 'Пробны перыяд' },
  acc_manage: { en: 'Manage', ru: 'Управление', pl: 'Zarządzaj', uk: 'Керувати', be: 'Кіраванне' },
  acc_open_library: { en: 'Open the library →', ru: 'Открыть библиотеку →', pl: 'Otwórz bibliotekę →', uk: 'Відкрити бібліотеку →', be: 'Адкрыць бібліятэку →' },
  acc_lib_card: { en: 'Library card', ru: 'Карта библиотеки', pl: 'Karta biblioteki', uk: 'Карта бібліотеки', be: 'Карта бібліятэкі' },
  acc_lib_card_title: { en: 'Open every concept — $19/mo', ru: 'Откройте все концепции — $19/мес', pl: 'Otwórz każdy koncept — $19/mies', uk: 'Відкрийте кожну концепцію — $19/міс', be: 'Адкрыйце кожную канцэпцыю — $19/мес' },
  acc_lib_card_lead: { en: '90+ editorial brandbooks. New concepts every week. 2-day free trial. Cancel anytime. Taxes added at checkout where applicable.', ru: '90+ редакторских брендбуков. Новые концепции каждую неделю. 2 дня бесплатно. Отмена в любой момент. Налоги добавляются при оплате, где применимо.', pl: '90+ redakcyjnych brandbooków. Nowe koncepty co tydzień. 2 dni za darmo. Anuluj w każdej chwili. Podatki doliczane przy płatności, gdzie dotyczy.', uk: '90+ редакційних брендбуків. Нові концепції щотижня. 2 дні безкоштовно. Скасування будь-коли. Податки додаються при оплаті, де застосовно.', be: '90+ рэдакцыйных брэндбукаў. Новыя канцэпцыі кожны тыдзень. 2 дні бясплатна. Адмена ў любы момант. Падаткі дадаюцца пры аплаце, дзе прымяняльна.' },
  acc_start_trial: { en: 'Start trial · $19/month', ru: 'Начать пробный · $19/мес', pl: 'Rozpocznij okres próbny · $19/mies', uk: 'Почати пробний · $19/міс', be: 'Пачаць пробны · $19/мес' },
  acc_yearly: { en: '$149 / year (save ~35%)', ru: '$149 / год (экономия ~35%)', pl: '$149 / rok (oszczędzasz ~35%)', uk: '$149 / рік (економія ~35%)', be: '$149 / год (эканомія ~35%)' },
  acc_legacy: { en: 'Legacy access · You bought concepts under the old per-purchase model — your library access is permanent without a subscription.', ru: 'Старый доступ · Вы покупали концепции по старой модели — доступ к библиотеке постоянный, без подписки.', pl: 'Dostęp legacy · Kupiłeś koncepty w starym modelu — dostęp do biblioteki jest stały, bez subskrypcji.', uk: 'Старий доступ · Ви купували концепції за старою моделлю — доступ до бібліотеки постійний, без підписки.', be: 'Стары доступ · Вы куплялі канцэпцыі па старой мадэлі — доступ да бібліятэкі пастаянны, без падпіскі.' },
  acc_checking: { en: 'Checking your access…', ru: 'Проверяем доступ…', pl: 'Sprawdzamy dostęp…', uk: 'Перевіряємо доступ…', be: 'Правяраем доступ…' },
  acc_my_concepts: { en: 'My concepts', ru: 'Мои концепции', pl: 'Moje koncepty', uk: 'Мої концепції', be: 'Мае канцэпцыі' },
  acc_favorites: { en: 'Favorites', ru: 'Избранное', pl: 'Ulubione', uk: 'Обране', be: 'Абранае' },
  acc_settings: { en: 'Settings', ru: 'Настройки', pl: 'Ustawienia', uk: 'Налаштування', be: 'Налады' },
  acc_bonus_title: { en: '✓ Your bonus · Day-1 opening checklist', ru: '✓ Ваш бонус · чек-лист первого дня', pl: '✓ Twój bonus · checklista dnia otwarcia', uk: '✓ Ваш бонус · чек-лист першого дня', be: '✓ Ваш бонус · чэк-ліст першага дня' },
  acc_bonus_sub: { en: 'Printable PDF · 48 pre-launch tasks · included with every concept you own.', ru: 'PDF для печати · 48 задач до запуска · входит в каждую вашу концепцию.', pl: 'PDF do druku · 48 zadań przed startem · w komplecie z każdym Twoim konceptem.', uk: 'PDF для друку · 48 завдань до запуску · входить у кожну вашу концепцію.', be: 'PDF для друку · 48 задач да запуску · уваходзіць у кожную вашу канцэпцыю.' },
  acc_download_pdf: { en: 'Download PDF →', ru: 'Скачать PDF →', pl: 'Pobierz PDF →', uk: 'Завантажити PDF →', be: 'Спампаваць PDF →' },
  acc_empty_cabinet: { en: 'Empty cabinet', ru: 'Пустой кабинет', pl: 'Pusty gabinet', uk: 'Порожній кабінет', be: 'Пусты кабінет' },
  acc_pick_first: { en: 'Pick your first <span class="accent">concept</span>.', ru: 'Выберите первую <span class="accent">концепцию</span>.', pl: 'Wybierz swój pierwszy <span class="accent">koncept</span>.', uk: 'Оберіть першу <span class="accent">концепцію</span>.', be: 'Абярыце першую <span class="accent">канцэпцыю</span>.' },
  acc_pick_first_p: { en: '{N} ready-to-launch concepts waiting. Coffee shops, matcha kiosks, ramen bars, beauty salons. Open the whole library — $19/mo.', ru: '{N}+ готовых к запуску концепций. Кофейни, матча-киоски, рамен-бары, салоны красоты. Откройте всю библиотеку — $19/мес.', pl: '{N}+ gotowych konceptów. Kawiarnie, kioski matcha, bary ramen, salony piękności. Otwórz całą bibliotekę — $19/mies.', uk: '{N}+ готових до запуску концепцій. Кавʼярні, матча-кіоски, рамен-бари, салони краси. Відкрийте всю бібліотеку — $19/міс.', be: '90+ гатовых да запуску канцэпцый. Кавярні, матча-кіёскі, рамен-бары, салоны прыгажосці. Адкрыйце ўсю бібліятэку — $19/мес.' },
  acc_browse_concepts: { en: 'Browse concepts', ru: 'Смотреть концепции', pl: 'Przeglądaj koncepty', uk: 'Дивитися концепції', be: 'Глядзець канцэпцыі' },
  acc_generated_by_you: { en: 'Generated by you', ru: 'Сгенерировано вами', pl: 'Wygenerowane przez Ciebie', uk: 'Згенеровано вами', be: 'Згенеравана вамі' },
  acc_nothing_gen: { en: 'Nothing generated yet', ru: 'Пока ничего не сгенерировано', pl: 'Nic jeszcze nie wygenerowano', uk: 'Поки нічого не згенеровано', be: 'Пакуль нічога не згенеравана' },
  acc_next_idea: { en: 'Design your <span class="accent">next idea</span>.', ru: 'Создайте <span class="accent">следующую идею</span>.', pl: 'Zaprojektuj <span class="accent">następny pomysł</span>.', uk: 'Створіть <span class="accent">наступну ідею</span>.', be: 'Стварыце <span class="accent">наступную ідэю</span>.' },
  acc_gen_p: { en: 'Use the AI Concept Generator to spin up a fresh brandbook in about a minute. It lives here even after you close the tab.', ru: 'Используйте AI-генератор концепций — свежий брендбук примерно за минуту. Он останется здесь даже после закрытия вкладки.', pl: 'Użyj generatora konceptów AI — świeży brandbook w około minutę. Zostaje tu nawet po zamknięciu karty.', uk: 'Використайте AI-генератор концепцій — свіжий брендбук приблизно за хвилину. Він залишається тут навіть після закриття вкладки.', be: 'Выкарыстайце AI-генератар канцэпцый — свежы брэндбук прыкладна за хвіліну. Ён застаецца тут нават пасля закрыцця ўкладкі.' },
  acc_open_generator: { en: 'Open generator', ru: 'Открыть генератор', pl: 'Otwórz generator', uk: 'Відкрити генератор', be: 'Адкрыць генератар' },
  acc_favs_empty_full: { en: 'No favorites yet. Tap the ♥ on any concept to save it here.', ru: 'Пока нет избранного. Нажмите ♥ на любой концепции, чтобы сохранить её здесь.', pl: 'Brak ulubionych. Kliknij ♥ na dowolnym koncepcie, by go tu zapisać.', uk: 'Поки немає обраного. Натисніть ♥ на будь-якій концепції, щоб зберегти її тут.', be: 'Пакуль няма абранага. Націсніце ♥ на любой канцэпцыі, каб захаваць яе тут.' },
  acc_browse_shop_arrow: { en: 'Browse shop →', ru: 'В магазин →', pl: 'Do sklepu →', uk: 'До магазину →', be: 'У краму →' },
  acc_profile: { en: 'Profile', ru: 'Профиль', pl: 'Profil', uk: 'Профіль', be: 'Профіль' },
  acc_profile_sub: { en: "Your display name and email. Email can't be changed — contact support if you need to.", ru: 'Ваше отображаемое имя и email. Email изменить нельзя — напишите в поддержку при необходимости.', pl: 'Twoja nazwa wyświetlana i email. Emaila nie można zmienić — napisz do wsparcia w razie potrzeby.', uk: 'Ваше відображуване імʼя та email. Email змінити не можна — зверніться до підтримки за потреби.', be: 'Ваша адлюстроўванае імя і email. Email змяніць нельга — напішыце ў падтрымку пры неабходнасці.' },
  acc_display_name: { en: 'Display name', ru: 'Отображаемое имя', pl: 'Nazwa wyświetlana', uk: 'Відображуване імʼя', be: 'Адлюстроўванае імя' },
  acc_save_profile: { en: 'Save profile', ru: 'Сохранить профиль', pl: 'Zapisz profil', uk: 'Зберегти профіль', be: 'Захаваць профіль' },
  acc_pw_block_sub: { en: "Enter a new password of at least 8 characters and we'll update it.", ru: 'Введите новый пароль не короче 8 символов — мы его обновим.', pl: 'Wprowadź nowe hasło o długości min. 8 znaków — zaktualizujemy je.', uk: 'Введіть новий пароль не менше 8 символів — ми його оновимо.', be: 'Увядзіце новы пароль не карацей за 8 сімвалаў — мы яго абновім.' },
  acc_confirm_new_pw: { en: 'Confirm new password', ru: 'Повторите новый пароль', pl: 'Powtórz nowe hasło', uk: 'Повторіть новий пароль', be: 'Паўтарыце новы пароль' },
  acc_update_pw: { en: 'Update password', ru: 'Обновить пароль', pl: 'Zaktualizuj hasło', uk: 'Оновити пароль', be: 'Абнавіць пароль' },
  acc_contacts: { en: 'Contacts', ru: 'Контакты', pl: 'Kontakty', uk: 'Контакти', be: 'Кантакты' },
  acc_contacts_sub: { en: 'Questions, refunds, partnerships — one inbox handles everything.', ru: 'Вопросы, возвраты, партнёрства — всё в одном ящике.', pl: 'Pytania, zwroty, partnerstwa — wszystko w jednej skrzynce.', uk: 'Питання, повернення, партнерства — все в одній скриньці.', be: 'Пытанні, вяртанні, партнёрствы — усё ў адной скрыні.' },
  acc_support: { en: 'Support', ru: 'Поддержка', pl: 'Wsparcie', uk: 'Підтримка', be: 'Падтрымка' },
  acc_commercial: { en: 'Commercial', ru: 'Сотрудничество', pl: 'Współpraca', uk: 'Співпраця', be: 'Супрацоўніцтва' },
  acc_faq_common: { en: 'Common questions →', ru: 'Частые вопросы →', pl: 'Częste pytania →', uk: 'Часті питання →', be: 'Частыя пытанні →' },
  acc_shop_word: { en: 'Shop', ru: 'Магазин', pl: 'Sklep', uk: 'Магазин', be: 'Крама' },
  acc_browse_n: { en: 'Browse all concepts →', ru: 'Все концепции →', pl: 'Wszystkie koncepty →', uk: 'Усі концепції →', be: 'Усе канцэпцыі →' },
  acc_danger: { en: 'Danger zone', ru: 'Опасная зона', pl: 'Strefa zagrożenia', uk: 'Небезпечна зона', be: 'Небяспечная зона' },
  acc_danger_sub: { en: 'Sign out from this browser, or permanently delete your account and purchase history.', ru: 'Выйти из этого браузера или навсегда удалить аккаунт и историю покупок.', pl: 'Wyloguj się z tej przeglądarki lub trwale usuń konto i historię zakupów.', uk: 'Вийти з цього браузера або назавжди видалити акаунт та історію покупок.', be: 'Выйсці з гэтага браўзера або назаўсёды выдаліць акаўнт і гісторыю пакупак.' },
  acc_delete_account: { en: 'Delete account…', ru: 'Удалить аккаунт…', pl: 'Usuń konto…', uk: 'Видалити акаунт…', be: 'Выдаліць акаўнт…' },
  acc_faq: { en: 'FAQ', ru: 'FAQ', pl: 'FAQ', uk: 'FAQ', be: 'FAQ' },
  acc_faq_close: { en: 'Close', ru: 'Закрыть', pl: 'Zamknij', uk: 'Закрити', be: 'Закрыць' },

  // ========== subscribe.html ==========
  sub_eyebrow: { en: 'one subscription · whole library', ru: 'одна подписка · вся библиотека', pl: 'jedna subskrypcja · cała biblioteka', uk: 'одна підписка · вся бібліотека', be: 'адна падпіска · уся бібліятэка' },
  sub_hero_h1: { en: 'One subscription. <span class="it">Every concept.</span>', ru: 'Одна подписка. <span class="it">Все концепции.</span>', pl: 'Jedna subskrypcja. <span class="it">Każdy koncept.</span>', uk: 'Одна підписка. <span class="it">Усі концепції.</span>', be: 'Адна падпіска. <span class="it">Усе канцэпцыі.</span>' },
  sub_hero_lead: { en: 'A library of {N} ready-to-launch business concepts — each one a full brandbook, not a teaser. One card opens all of it.', ru: 'Библиотека из {N} готовой к запуску бизнес-концепции — каждая полный брендбук, не тизер. Одна карта открывает всё.', pl: 'Biblioteka {N} gotowych do startu konceptów biznesowych — każdy to pełny brandbook, nie teaser. Jedna karta otwiera wszystko.', uk: 'Бібліотека з {N} готової до запуску бізнес-концепції — кожна повний брендбук, не тизер. Одна картка відкриває все.', be: 'Бібліятэка з {N} гатовай да запуску бізнес-канцэпцыі — кожная поўны брэндбук, не тызэр. Адна карта адкрывае ўсё.' },
  sub_trust_trial: { en: '2 days free', ru: '2 дня бесплатно', pl: '2 dni za darmo', uk: '2 дні безкоштовно', be: '2 дні бясплатна' },
  sub_trust_cancel: { en: 'cancel in one click', ru: 'отмена в один клик', pl: 'anulujesz jednym kliknięciem', uk: 'скасування в один клік', be: 'адмена ў адзін клік' },
  sub_trust_weekly: { en: 'new concepts every week', ru: 'новые концепции каждую неделю', pl: 'nowe koncepty co tydzień', uk: 'нові концепції щотижня', be: 'новыя канцэпцыі кожны тыдзень' },
  sub_pick: { en: 'pick your card', ru: 'выберите карту', pl: 'wybierz kartę', uk: 'оберіть карту', be: 'абярыце карту' },
  sub_two_ways: { en: 'Two ways to <span class="it">subscribe.</span>', ru: 'Два варианта <span class="it">подписки.</span>', pl: 'Dwa sposoby <span class="it">subskrypcji.</span>', uk: 'Два варіанти <span class="it">підписки.</span>', be: 'Два варыянты <span class="it">падпіскі.</span>' },
  sub_monthly_name: { en: 'Monthly', ru: 'Помесячно', pl: 'Miesięcznie', uk: 'Щомісяця', be: 'Штомесяц' },
  sub_per_mo: { en: '/ mo', ru: '/ мес', pl: '/ mies', uk: '/ міс', be: '/ мес' },
  sub_per_yr: { en: '/ year', ru: '/ год', pl: '/ rok', uk: '/ рік', be: '/ год' },
  sub_monthly_sub: { en: 'The whole library. Cancel anytime — nothing you opened is lost.', ru: 'Вся библиотека. Отмена в любой момент — ничего из открытого не пропадает.', pl: 'Cała biblioteka. Anulujesz w każdej chwili — nic z otwartego nie znika.', uk: 'Уся бібліотека. Скасування будь-коли — нічого з відкритого не зникає.', be: 'Уся бібліятэка. Адмена ў любы момант — нічога з адкрытага не знікае.' },
  sub_b_access: { en: 'Access to all {N} concepts', ru: 'Доступ ко всем {N} концепции', pl: 'Dostęp do wszystkich {N} konceptów', uk: 'Доступ до всіх {N} концепцій', be: 'Доступ да ўсіх {N} канцэпцыі' },
  sub_b_new: { en: 'New concepts unlock instantly', ru: 'Новые концепции открываются сразу', pl: 'Nowe koncepty otwierają się natychmiast', uk: 'Нові концепції відкриваються миттєво', be: 'Новыя канцэпцыі адкрываюцца адразу' },
  sub_b_ai: { en: 'AI concept generator included', ru: 'AI-генератор концепций включён', pl: 'Generator konceptów AI w cenie', uk: 'AI-генератор концепцій у комплекті', be: 'AI-генератар канцэпцый у камплекце' },
  sub_b_trial: { en: '2 days free · cancel in one click', ru: '2 дня бесплатно · отмена в один клик', pl: '2 dni za darmo · anulujesz jednym kliknięciem', uk: '2 дні безкоштовно · скасування в один клік', be: '2 дні бясплатна · адмена ў адзін клік' },
  sub_cta_trial: { en: 'Start free trial →', ru: 'Начать бесплатный период →', pl: 'Rozpocznij okres próbny →', uk: 'Почати пробний період →', be: 'Пачаць пробны перыяд →' },
  sub_best: { en: 'best value', ru: 'лучшая цена', pl: 'najlepsza wartość', uk: 'найкраща ціна', be: 'найлепшая цана' },
  sub_yearly_name: { en: 'Yearly · −35%', ru: 'Годовая · −35%', pl: 'Roczna · −35%', uk: 'Річна · −35%', be: 'Гадавая · −35%' },
  sub_yearly_sub: { en: 'The same library in one annual payment — about two months cheaper.', ru: 'Та же библиотека одним годовым платежом — примерно на два месяца дешевле.', pl: 'Ta sama biblioteka w jednej rocznej płatności — około dwa miesiące taniej.', uk: 'Та сама бібліотека одним річним платежем — приблизно на два місяці дешевше.', be: 'Тая ж бібліятэка адным гадавым плацяжом — прыкладна на два месяцы танней.' },
  sub_y_all: { en: 'Everything in Monthly', ru: 'Всё из помесячной', pl: 'Wszystko z miesięcznej', uk: 'Усе з місячної', be: 'Усё з месячнай' },
  sub_y_save: { en: 'About −35% vs paying monthly', ru: 'Около −35% против помесячной', pl: 'Około −35% wobec miesięcznej', uk: 'Приблизно −35% проти місячної', be: 'Каля −35% супраць месячнай' },
  sub_y_invoice: { en: 'One invoice a year — no surprise charges', ru: 'Один счёт в год — без неожиданных списаний', pl: 'Jedna faktura rocznie — bez niespodzianek', uk: 'Один рахунок на рік — без сюрпризів', be: 'Адзін рахунак у год — без сюрпрызаў' },
  sub_y_cancel: { en: 'Cancel before the next renewal', ru: 'Отмена до следующего продления', pl: 'Anuluj przed kolejnym odnowieniem', uk: 'Скасувати до наступного поновлення', be: 'Адмена да наступнага падаўжэння' },
  sub_cta_yearly: { en: 'Pay yearly →', ru: 'Оплатить за год →', pl: 'Zapłać rocznie →', uk: 'Сплатити за рік →', be: 'Аплаціць за год →' },
  sub_pay_note: { en: 'VAT / sales tax added at checkout where required · payments via Lemon Squeezy · cards, SEPA, Apple Pay, Google Pay', ru: 'НДС / налог с продаж добавляется при оплате где применимо · платежи через Lemon Squeezy · карты, SEPA, Apple Pay, Google Pay', pl: 'VAT / podatek dodawany przy płatności, gdzie wymagany · płatności przez Lemon Squeezy · karty, SEPA, Apple Pay, Google Pay', uk: 'ПДВ / податок додається при оплаті, де потрібно · платежі через Lemon Squeezy · картки, SEPA, Apple Pay, Google Pay', be: 'ПДВ / падатак дадаецца пры аплаце, дзе патрабуецца · плацяжы праз Lemon Squeezy · карты, SEPA, Apple Pay, Google Pay' },
  sub_inside_eyebrow: { en: "what's inside", ru: 'что внутри', pl: 'co w środku', uk: 'що всередині', be: 'што ўнутры' },
  sub_inside_h2: { en: 'Everything the subscription unlocks.', ru: 'Всё, что открывает подписка.', pl: 'Wszystko, co odblokowuje subskrypcja.', uk: 'Усе, що відкриває підписка.', be: 'Усё, што адкрывае падпіска.' },
  sub_p1_h: { en: 'The whole library — {N} concepts', ru: 'Вся библиотека — {N} концепция', pl: 'Cała biblioteka — {N} konceptów', uk: 'Уся бібліотека — {N} концепція', be: 'Уся бібліятэка — {N} канцэпцыя' },
  sub_p1_p: { en: 'Coffee bars, matcha kiosks, ramen counters, beauty studios, repair ateliers. Every category, every concept — open the moment you subscribe.', ru: 'Кофейни, матча-киоски, рамен-бары, бьюти-студии, ремонтные ателье. Каждая категория, каждая концепция — открыты в момент подписки.', pl: 'Kawiarnie, kioski matcha, bary ramen, studia urody, atelier napraw. Każda kategoria, każdy koncept — dostępne od razu po subskrypcji.', uk: 'Кавʼярні, матча-кіоски, рамен-бари, бʼюті-студії, ремонтні ательє. Кожна категорія, кожна концепція — відкриваються одразу після підписки.', be: 'Кавярні, матча-кіёскі, рамен-бары, бʼюці-студыі, рамонтныя атэлье. Кожная катэгорыя, кожная канцэпцыя — адкрываюцца адразу пасля падпіскі.' },
  sub_p2_h: { en: 'A full 25-page brandbook each', ru: 'Полный 25-страничный брендбук в каждой', pl: 'Pełny 25-stronicowy brandbook każdy', uk: 'Повний 25-сторінковий брендбук у кожній', be: 'Поўны 25-старонкавы брэндбук у кожнай' },
  sub_p2_p: { en: 'Not a mood board. Concept, audience, floor plan, equipment list, verified budget, P&L, suppliers, registration steps and a 9-week launch timeline.', ru: 'Не мудборд. Концепция, аудитория, план зала, список оборудования, проверенный бюджет, P&L, поставщики, шаги регистрации и 9-недельный план запуска.', pl: 'Nie moodboard. Koncept, audiencja, plan piętra, lista sprzętu, zweryfikowany budżet, P&L, dostawcy, kroki rejestracji i 9-tygodniowy plan startu.', uk: 'Не мудборд. Концепція, аудиторія, план приміщення, список обладнання, перевірений бюджет, P&L, постачальники, кроки реєстрації та 9-тижневий план запуску.', be: 'Не мудборд. Канцэпцыя, аўдыторыя, план памяшкання, спіс абсталявання, праверны бюджэт, P&L, пастаўшчыкі, крокі рэгістрацыі і 9-тыднёвы план запуску.' },
  sub_p3_h: { en: 'New concepts every week', ru: 'Новые концепции каждую неделю', pl: 'Nowe koncepty co tydzień', uk: 'Нові концепції щотижня', be: 'Новыя канцэпцыі кожны тыдзень' },
  sub_p3_p: { en: 'The library keeps growing. Fresh editorial brandbooks land continuously and unlock instantly for every subscriber — no extra charge.', ru: 'Библиотека растёт. Новые редакторские брендбуки добавляются непрерывно и открываются мгновенно для каждого подписчика — без доплат.', pl: 'Biblioteka stale rośnie. Świeże redakcyjne brandbooki pojawiają się ciągle i otwierają natychmiast dla każdego subskrybenta — bez dopłat.', uk: 'Бібліотека постійно зростає. Свіжі редакційні брендбуки зʼявляються безперервно й відкриваються миттєво для кожного підписника — без доплат.', be: 'Бібліятэка стала расце. Свежыя рэдакцыйныя брэндбукі зʼяўляюцца няспынна і адкрываюцца імгненна для кожнага падпісчыка — без даплат.' },
  sub_p4_h: { en: 'AI concept generator', ru: 'AI-генератор концепций', pl: 'Generator konceptów AI', uk: 'AI-генератор концепцій', be: 'AI-генератар канцэпцый' },
  sub_p4_p: { en: "Need something that isn't in the catalogue? Spin up a fresh brandbook in about a minute and keep it in your cabinet forever.", ru: 'Нужно то, чего нет в каталоге? Создайте свежий брендбук примерно за минуту — он останется в вашем кабинете навсегда.', pl: 'Potrzebujesz czegoś, czego nie ma w katalogu? Wygeneruj świeży brandbook w około minutę — zostanie w Twoim gabinecie na zawsze.', uk: 'Потрібно щось, чого немає в каталозі? Створіть свіжий брендбук приблизно за хвилину — він залишиться у вашому кабінеті назавжди.', be: 'Патрэбна нешта, чаго няма ў каталогу? Стварыце свежы брэндбук прыкладна за хвіліну — ён застанецца ў вашым кабінеце назаўсёды.' },
  sub_p5_h: { en: 'Day-1 opening checklist', ru: 'Чек-лист первого дня', pl: 'Checklista pierwszego dnia', uk: 'Чек-лист першого дня', be: 'Чэк-ліст першага дня' },
  sub_p5_p: { en: 'A printable PDF with 48 pre-launch tasks — included with every concept you open, so nothing is forgotten before the door swings.', ru: 'PDF для печати с 48 задачами до запуска — входит в каждую открытую концепцию, чтобы ничего не забыть до открытия дверей.', pl: 'PDF do druku z 48 zadaniami przed startem — w komplecie z każdym otwartym konceptem, by nic nie umknęło przed otwarciem drzwi.', uk: 'PDF для друку з 48 завданнями до запуску — входить у кожну відкриту концепцію, щоб нічого не забути до відкриття дверей.', be: 'PDF для друку з 48 задачамі да запуску — уваходзіць у кожную адкрытую канцэпцыю, каб нічога не забыцца да адкрыцця дзвярэй.' },
  sub_p6_h: { en: 'Yours on every device', ru: 'Доступно на любом устройстве', pl: 'Twoje na każdym urządzeniu', uk: 'Ваше на будь-якому пристрої', be: 'Вашае на любой прыладзе' },
  sub_p6_p: { en: "Everything you open lives in your cabinet. Sign in anywhere — laptop, phone, the print shop's screen — and it's all there.", ru: 'Всё открытое хранится в вашем кабинете. Войдите где угодно — с ноутбука, телефона, экрана в типографии — всё на месте.', pl: 'Wszystko, co otworzysz, jest w Twoim gabinecie. Zaloguj się gdziekolwiek — z laptopa, telefonu, ekranu w drukarni — wszystko tam jest.', uk: 'Усе відкрите зберігається у вашому кабінеті. Увійдіть будь-де — з ноутбука, телефона, екрана в друкарні — усе на місці.', be: 'Усё адкрытае захоўваецца ў вашым кабінеце. Увайдзіце дзе заўгодна — з ноўтбука, тэлефона, экрана ў друкарні — усё на месцы.' },
  sub_r1_t: { en: 'Try before you pay', ru: 'Попробуйте перед оплатой', pl: 'Wypróbuj przed zapłatą', uk: 'Спробуйте перед оплатою', be: 'Паспрабуйце перад аплатай' },
  sub_r1_d: { en: "Two full days, the entire library open. If it's not for you, cancel and you're charged nothing.", ru: 'Два полных дня, вся библиотека открыта. Если не подойдёт — отмените, ничего не спишется.', pl: 'Dwa pełne dni, cała biblioteka otwarta. Jeśli to nie dla Ciebie, anulujesz — nic nie zostanie pobrane.', uk: 'Два повних дні, уся бібліотека відкрита. Якщо не підходить — скасуйте, нічого не спишеться.', be: 'Два поўныя дні, уся бібліятэка адкрыта. Калі не падыдзе — адменіце, нічога не спішацца.' },
  sub_r2_t: { en: 'Cancel in one click', ru: 'Отмена в один клик', pl: 'Anulujesz jednym kliknięciem', uk: 'Скасування в один клік', be: 'Адмена ў адзін клік' },
  sub_r2_d: { en: 'No emails, no retention maze. One button in your cabinet ends it — everything you already opened stays readable.', ru: 'Без писем, без лабиринта удержания. Одна кнопка в кабинете завершает подписку — всё уже открытое останется доступным.', pl: 'Bez maili, bez labiryntu retencji. Jeden przycisk w gabinecie kończy subskrypcję — wszystko już otwarte zostaje do czytania.', uk: 'Без листів, без лабіринту утримання. Одна кнопка в кабінеті завершує підписку — все вже відкрите залишається.', be: 'Без лістоў, без лабірынту ўтрымання. Адна кнопка ў кабінеце завяршае падпіску — усё ўжо адкрытае застаецца.' },
  sub_r3_t: { en: 'Bought a concept before?', ru: 'Покупали концепцию раньше?', pl: 'Kupiłeś koncept wcześniej?', uk: 'Купували концепцію раніше?', be: 'Куплялі канцэпцыю раней?' },
  sub_r3_d: { en: 'Legacy buyers keep permanent access to what they purchased — no subscription needed for those.', ru: 'Покупатели по старой модели сохраняют постоянный доступ к купленному — подписка для них не нужна.', pl: 'Kupujący w starym modelu zachowują stały dostęp do tego, co kupili — subskrypcja nie jest dla nich potrzebna.', uk: 'Покупці за старою моделлю зберігають постійний доступ до купленого — підписка для них не потрібна.', be: 'Пакупнікі па старой мадэлі захоўваюць пастаянны доступ да купленага — падпіска для іх не патрэбна.' },
  sub_back_shop: { en: '← Browse the catalogue first', ru: '← Сначала каталог', pl: '← Najpierw przejrzyj katalog', uk: '← Спочатку каталог', be: '← Спачатку каталог' },

  // ========== view.html ==========
  view_loading: { en: 'Loading…', ru: 'Загрузка…', pl: 'Wczytywanie…', uk: 'Завантаження…', be: 'Загрузка…' },
  view_close: { en: 'Close', ru: 'Закрыть', pl: 'Zamknij', uk: 'Закрити', be: 'Закрыць' },
  view_buy: { en: 'Buy', ru: 'Купить', pl: 'Kup', uk: 'Купити', be: 'Купіць' },
  view_locked: { en: 'Preview locked', ru: 'Превью заблокировано', pl: 'Podgląd zablokowany', uk: 'Перегляд заблоковано', be: 'Прагляд заблакаваны' },
  view_locked_p: {
    en: 'Buy the concept to unlock the full brandbook PDF, editable source files, and registration plan.',
    ru: 'Купи концепцию, чтобы открыть полный брендбук PDF, исходники и план регистрации.',
    pl: 'Kup koncept, by odblokować pełny brandbook PDF, edytowalne źródła i plan rejestracji.',
    uk: 'Купи концепцію, щоб розблокувати повний брендбук PDF, вихідники та план реєстрації.',
    be: 'Купі канцэпцыю, каб разблакаваць поўны брэндбук PDF, зыходнікі і план рэгістрацыі.'
  },
  view_inside: { en: "What's inside", ru: 'Что внутри', pl: 'Co w środku', uk: 'Що всередині', be: 'Што ўнутры' },
  view_inside_p: {
    en: 'Complete launch package — Brandbook (25 pages), equipment list with real models and prices, country-specific registration walkthrough, weekly schedule, P&L forecast, supplier directory.',
    ru: 'Полный стартовый пакет — Брендбук (25 страниц), список оборудования с реальными моделями и ценами, локальный маршрут регистрации, недельный график, прогноз P&L, каталог поставщиков.',
    pl: 'Kompletny pakiet startowy — Brandbook (25 stron), lista sprzętu z prawdziwymi modelami i cenami, lokalna ścieżka rejestracji, harmonogram tygodniowy, prognoza P&L, katalog dostawców.',
    uk: 'Повний стартовий пакет — Брендбук (25 сторінок), список обладнання з реальними моделями і цінами, локальний маршрут реєстрації, тижневий розклад, прогноз P&L, каталог постачальників.',
    be: 'Поўны стартавы пакет — Брэндбук (25 старонак), спіс абсталявання з рэальнымі мадэлямі і коштамі, лакальны шлях рэгістрацыі, тыднёвы графік, прагноз P&L, каталог пастаўшчыкоў.'
  },
  view_once: { en: 'One-time · Lifetime access', ru: 'Разово · Доступ навсегда', pl: 'Jednorazowo · Dostęp na zawsze', uk: 'Разово · Доступ назавжди', be: 'Аднаразова · Доступ назаўсёды' },
  view_budget: { en: 'Budget', ru: 'Бюджет', pl: 'Budżet', uk: 'Бюджет', be: 'Бюджэт' },
  view_timeline: { en: 'Timeline', ru: 'График', pl: 'Harmonogram', uk: 'Графік', be: 'Графік' },
  view_size: { en: 'Size', ru: 'Площадь', pl: 'Powierzchnia', uk: 'Площа', be: 'Плошча' },
  view_country: { en: 'Country', ru: 'Страна', pl: 'Kraj', uk: 'Країна', be: 'Краіна' },
  view_category: { en: 'Category', ru: 'Категория', pl: 'Kategoria', uk: 'Категорія', be: 'Катэгорыя' },
  view_weeks: { en: 'weeks', ru: 'нед.', pl: 'tyg.', uk: 'тиж.', be: 'тыд.' },
  view_lock_note: { en: 'Full brandbook available after purchase.', ru: 'Полный брендбук доступен после покупки.', pl: 'Pełny brandbook dostępny po zakupie.', uk: 'Повний брендбук доступний після купівлі.', be: 'Поўны брэндбук даступны пасля куплі.' },

  // ========== index.html — landing ==========
  idx_trial_line:     { en: '2 days free · cancel anytime', ru: '2 дня бесплатно · отмена в любой момент', pl: '2 dni za darmo · anulujesz w każdej chwili', uk: '2 дні безкоштовно · скасування будь-коли', be: '2 дні бясплатна · адмена ў любы момант' },
  kpi_concepts:       { en: 'concepts', ru: 'концепций', pl: 'konceptów', uk: 'концепцій', be: 'канцэпцый' },
  kpi_cities:         { en: 'cities · across Europe', ru: 'городов · по Европе', pl: 'miast · w Europie', uk: 'міст · по Європі', be: 'гарадоў · па Еўропе' },
  kpi_documents:      { en: 'documents in every dossier', ru: 'документов в каждом досье', pl: 'dokumentów w każdym dossier', uk: 'документів у кожному досьє', be: 'дакументаў у кожным дасье' },
  kpi_per_month:      { en: 'per month · entire library', ru: 'в месяц · вся библиотека', pl: 'miesięcznie · cała biblioteka', uk: 'на місяць · уся бібліотека', be: 'у месяц · уся бібліятэка' },
  idx_catalog_eyebrow:{ en: '— catalog · 12 of {N} —', ru: '— каталог · 12 из {N} —', pl: '— katalog · 12 z {N} —', uk: '— каталог · 12 із {N} —', be: '— каталог · 12 з {N} —' },
  idx_catalog_h2:     { en: 'Step into the library.', ru: 'Зайдите в библиотеку.', pl: 'Wejdź do biblioteki.', uk: 'Зайдіть у бібліотеку.', be: 'Зайдзіце ў бібліятэку.' },
  idx_pricing_eyebrow:{ en: '— one subscription · whole library —', ru: '— одна подписка · вся библиотека —', pl: '— jedna subskrypcja · cała biblioteka —', uk: '— одна підписка · уся бібліотека —', be: '— адна падпіска · уся бібліятэка —' },
  idx_pricing_h2:     { en: 'One subscription. <span class="italic">Every concept.</span>', ru: 'Одна подписка. <span class="italic">Все концепции.</span>', pl: 'Jedna subskrypcja. <span class="italic">Każdy koncept.</span>', uk: 'Одна підписка. <span class="italic">Усі концепції.</span>', be: 'Адна падпіска. <span class="italic">Усе канцэпцыі.</span>' },
  idx_pricing_vat:    { en: 'VAT/sales tax is added at checkout where required by law.', ru: 'НДС / налог с продаж добавляется при оплате, где требуется по закону.', pl: 'VAT/podatek dodawany przy płatności tam, gdzie wymagane prawem.', uk: 'ПДВ / податок з продажу додається при оплаті, де цього вимагає закон.', be: 'ПДВ / падатак з продажу дадаецца пры аплаце, дзе гэтага патрабуе закон.' },
  idx_pricing_pay:    { en: 'payments via Lemon Squeezy · all major cards · SEPA · Apple Pay · Google Pay', ru: 'платежи через Lemon Squeezy · все основные карты · SEPA · Apple Pay · Google Pay', pl: 'płatności przez Lemon Squeezy · wszystkie karty · SEPA · Apple Pay · Google Pay', uk: 'платежі через Lemon Squeezy · усі основні картки · SEPA · Apple Pay · Google Pay', be: 'плацяжы праз Lemon Squeezy · усе асноўныя карты · SEPA · Apple Pay · Google Pay' },
  idx_final_eyebrow:    { en: '— open the door —', ru: '— открыть дверь —', pl: '— otwórz drzwi —', uk: '— відчинити двері —', be: '— адчыніць дзверы —' },
  idx_final_h2:         { en: 'Six months of work. Eight weeks to open. One account.', ru: 'Полгода работы. Восемь недель до открытия. Один аккаунт.', pl: 'Sześć miesięcy pracy. Osiem tygodni do otwarcia. Jedno konto.', uk: 'Півроку роботи. Вісім тижнів до відкриття. Один акаунт.', be: 'Паўгода працы. Восем тыдняў да адкрыцця. Адзін акаўнт.' },
  idx_final_cta_open:   { en: 'Open library — $19/mo', ru: 'Открыть библиотеку — $19/мес', pl: 'Otwórz bibliotekę — $19/mies', uk: 'Відкрити бібліотеку — $19/міс', be: 'Адкрыць бібліятэку — $19/мес' },
  idx_final_cta_browse: { en: 'Browse the catalog first →', ru: 'Сначала посмотреть каталог →', pl: 'Najpierw przejrzyj katalog →', uk: 'Спочатку перегляньте каталог →', be: 'Спачатку прагледзьце каталог →' },
  idx_final_trial:      { en: '2 days free · cancel in one click · cards, SEPA, Apple Pay', ru: '2 дня бесплатно · отмена в один клик · карты, SEPA, Apple Pay', pl: '2 dni za darmo · anulujesz jednym kliknięciem · karty, SEPA, Apple Pay', uk: '2 дні безкоштовно · скасування в один клік · картки, SEPA, Apple Pay', be: '2 дні бясплатна · адмена ў адзін клік · карты, SEPA, Apple Pay' },

  // ========== index.html — WhatIsConcept ==========
  wic_eyebrow: { en: '— what is a concept —', ru: '— что такое концепция —', pl: '— czym jest koncept —', uk: '— що таке концепція —', be: '— што такое канцэпцыя —' },
  wic_h2_html: {
    en: 'Not just a PDF. <span class="italic">A finished venue on paper</span> — assembled so it can go straight to your contractor without edits.',
    ru: 'Это не просто PDF. <span class="italic">Готовое заведение на бумаге</span> — собранное так, что его можно отдать подрядчику без правок.',
    pl: 'To nie tylko PDF. <span class="italic">Gotowy lokal na papierze</span> — złożony tak, by trafić do wykonawcy bez poprawek.',
    uk: 'Це не просто PDF. <span class="italic">Готовий заклад на папері</span> — зібраний так, щоб одразу віддати підряднику без правок.',
    be: 'Гэта не проста PDF. <span class="italic">Гатовая ўстанова на паперы</span> — сабраная так, каб адразу аддаць падрадчыку без правак.'
  },
  wic_lead: {
    en: 'Every concept includes interior photography, scale axonometry, a menu priced in euros, CAPEX and monthly OPEX, and a week-by-week opening plan. On the left — an example: concept 16 · RUST, a massage atelier in Amsterdam.',
    ru: 'В каждой концепции — фотография интерьеров, масштабная аксонометрия, меню в евро, CAPEX и помесячный OPEX, план открытия по неделям. Слева — пример: концепция 16 · RUST, массажное ателье в Амстердаме.',
    pl: 'Każdy koncept zawiera fotografię wnętrz, aksonometrię w skali, menu w euro, CAPEX i miesięczny OPEX oraz tygodniowy plan otwarcia. Po lewej — przykład: koncept 16 · RUST, atelier masażu w Amsterdamie.',
    uk: 'Кожна концепція містить фотографію інтерʼєрів, масштабну аксонометрію, меню в євро, CAPEX і помісячний OPEX, потижневий план відкриття. Ліворуч — приклад: концепція 16 · RUST, масажне ательє в Амстердамі.',
    be: 'У кожнай канцэпцыі — фатаграфія інтэрʼераў, маштабная аксанаметрыя, меню ў еўра, CAPEX і памесячны OPEX, плян адкрыцця па тыднях. Злева — прыклад: канцэпцыя 16 · RUST, масажнае атэлье ў Амстэрдаме.'
  },
  wic_chip_1: { en: 'visual brandbook',   ru: 'визуальный брендбук',  pl: 'brandbook wizualny',     uk: 'візуальний брендбук',   be: 'візуальны брэндбук' },
  wic_chip_2: { en: 'P&L · 3 years',      ru: 'P&L · 3 года',         pl: 'P&L · 3 lata',            uk: 'P&L · 3 роки',           be: 'P&L · 3 гады' },
  wic_chip_3: { en: '1:40 floor plan',    ru: 'план 1:40',            pl: 'plan 1:40',               uk: 'план 1:40',              be: 'план 1:40' },
  wic_chip_4: { en: 'equipment list',     ru: 'список оборудования',  pl: 'lista wyposażenia',       uk: 'перелік обладнання',     be: 'спіс абсталявання' },
  wic_chip_5: { en: 'menu in euros',      ru: 'меню в евро',          pl: 'menu w euro',             uk: 'меню в євро',            be: 'меню ў еўра' },
  wic_chip_6: { en: '8-week schedule',    ru: 'график на 8 недель',   pl: 'harmonogram 8 tygodni',   uk: 'графік на 8 тижнів',     be: 'графік на 8 тыдняў' },
  wic_chip_7: { en: 'day-one checklist',  ru: 'чек-лист дня открытия',pl: 'checklist dnia otwarcia', uk: 'чек-лист дня відкриття', be: 'чэк-ліст дня адкрыцця' },
  wic_live_eyebrow: { en: 'live example · concept № 16', ru: 'живой пример · концепция № 16', pl: 'żywy przykład · koncept nr 16', uk: 'живий приклад · концепція № 16', be: 'жывы прыклад · канцэпцыя № 16' },
  wic_live_title_html: {
    en: '16 · RUST <span class="italic">— atelier van stilte</span>',
    ru: '16 · RUST <span class="italic">— atelier van stilte</span>',
    pl: '16 · RUST <span class="italic">— atelier van stilte</span>',
    uk: '16 · RUST <span class="italic">— atelier van stilte</span>',
    be: '16 · RUST <span class="italic">— atelier van stilte</span>'
  },
  wic_live_sub: {
    en: 'Amsterdam · 34 m² · 8 weeks to open',
    ru: 'Амстердам · 34 м² · 8 недель до открытия',
    pl: 'Amsterdam · 34 m² · 8 tygodni do otwarcia',
    uk: 'Амстердам · 34 м² · 8 тижнів до відкриття',
    be: 'Амстэрдам · 34 м² · 8 тыдняў да адкрыцця'
  },
  wic_open_page: { en: 'open concept page →', ru: 'открыть страницу концепции →', pl: 'otwórz stronę konceptu →', uk: 'відкрити сторінку концепції →', be: 'адкрыць старонку канцэпцыі →' },

  // ========== index.html — BeforeAfter / COMPARE ==========
  ba_path_01: { en: 'path 01', ru: 'путь 01', pl: 'ścieżka 01', uk: 'шлях 01', be: 'шлях 01' },
  ba_path_02: { en: 'path 02', ru: 'путь 02', pl: 'ścieżka 02', uk: 'шлях 02', be: 'шлях 02' },
  ba_hard_label: { en: 'on your own', ru: 'своими силами', pl: 'na własną rękę', uk: 'своїми силами', be: 'сваімі сіламі' },
  ba_easy_label: { en: 'with the library', ru: 'с библиотекой', pl: 'z biblioteką', uk: 'з бібліотекою', be: 'з бібліятэкай' },
  ba_hard_s1_t: { en: 'brand agency',              ru: 'брендинговое агентство',     pl: 'agencja brandingowa',         uk: 'брендингова агенція',         be: 'брэндынгавая агенцыя' },
  ba_hard_s1_d: { en: 'identity, naming, voice',   ru: 'айдентика, нейминг, голос',  pl: 'identyfikacja, naming, głos', uk: 'айдентика, нейминг, голос',   be: 'ідэнтычнасць, нэймінг, голас' },
  ba_hard_s2_t: { en: 'architect & draftsman',     ru: 'архитектор и чертёжник',     pl: 'architekt i kreślarz',        uk: 'архітектор та кресляр',       be: 'архітэктар і чарцёжнік' },
  ba_hard_s2_d: { en: 'floor plan, sections, finishes', ru: 'план, разрезы, отделка', pl: 'rzut, przekroje, wykończenia', uk: 'план, перерізи, оздоблення', be: 'план, разрэзы, аздабленне' },
  ba_hard_s3_t: { en: 'photographer & copywriter', ru: 'фотограф и копирайтер',      pl: 'fotograf i copywriter',       uk: 'фотограф і копірайтер',       be: 'фатограф і капірайтэр' },
  ba_hard_s3_d: { en: 'visuals, copy, packaging',  ru: 'визуал, тексты, упаковка',   pl: 'wizualizacje, teksty, opakowania', uk: 'візуал, тексти, упаковка', be: 'візуал, тэксты, пакаванне' },
  ba_hard_s4_t: { en: 'menu consultant',           ru: 'консультант по меню',        pl: 'konsultant menu',             uk: 'консультант з меню',          be: 'кансультант па меню' },
  ba_hard_s4_d: { en: 'positioning, recipes',      ru: 'позиционирование, рецепты',  pl: 'pozycjonowanie, przepisy',    uk: 'позиціонування, рецепти',     be: 'пазіцыянаванне, рэцэпты' },
  ba_hard_s5_t: { en: 'lawyer & accountant',       ru: 'юрист и бухгалтер',          pl: 'prawnik i księgowy',          uk: 'юрист і бухгалтер',           be: 'юрыст і бухгалтар' },
  ba_hard_s5_d: { en: 'contracts, taxes, licences',ru: 'договоры, налоги, лицензии', pl: 'umowy, podatki, licencje',    uk: 'договори, податки, ліцензії', be: 'дамовы, падаткі, ліцэнзіі' },
  ba_hard_time: { en: '≈ 6 months', ru: '≈ 6 месяцев', pl: '≈ 6 miesięcy', uk: '≈ 6 місяців', be: '≈ 6 месяцаў' },
  ba_hard_time_sub: { en: 'until the door opens · in parallel with finding the venue', ru: 'до открытия двери · параллельно с поиском помещения', pl: 'do otwarcia drzwi · równolegle z szukaniem lokalu', uk: 'до відкриття дверей · паралельно з пошуком приміщення', be: 'да адкрыцця дзвярэй · паралельна з пошукам памяшкання' },
  ba_easy_s1_t: { en: 'picked a concept',           ru: 'выбрал концепцию',           pl: 'wybrałeś koncept',            uk: 'обрав концепцію',             be: 'выбраў канцэпцыю' },
  ba_easy_s1_d: { en: 'an hour reading the catalog',ru: 'час за чтением каталога',    pl: 'godzina przeglądania katalogu', uk: 'година читання каталогу',   be: 'гадзіна чытання каталога' },
  ba_easy_s2_t: { en: 'subscribed',                 ru: 'оформил подписку',           pl: 'wykupiłeś subskrypcję',       uk: 'оформив підписку',            be: 'аформіў падпіску' },
  ba_easy_s2_d: { en: '$19 — all {N} concepts unlocked', ru: '$19 — открыты все {N} концепций', pl: '$19 — odblokowane wszystkie {N} konceptów', uk: '$19 — відкриті всі {N} концепцій', be: '$19 — адкрытыя ўсе {N} канцэпцый' },
  ba_easy_s3_t: { en: 'downloaded the full dossier',ru: 'скачал полное досье',        pl: 'pobrałeś pełne dossier',      uk: 'завантажив повне досьє',      be: 'спампаваў поўнае дасье' },
  ba_easy_s3_d: { en: '7 documents · one linen folder', ru: '7 документов · одна льняная папка', pl: '7 dokumentów · jedna lniana teczka', uk: '7 документів · одна лляна папка', be: '7 дакументаў · адна льняная папка' },
  ba_easy_s4_t: { en: 'handed it to the contractor',ru: 'передал подрядчику',         pl: 'przekazałeś wykonawcy',       uk: 'передав підряднику',          be: 'перадаў падрадчыку' },
  ba_easy_s4_d: { en: 'everything already counted, described, sourced', ru: 'всё уже посчитано, описано, найдено', pl: 'wszystko już policzone, opisane, znalezione', uk: 'усе вже пораховано, описано, знайдено', be: 'усё ўжо палічана, апісана, знойдзена' },
  ba_easy_s5_t: { en: 'opened',                     ru: 'открылся',                   pl: 'otworzyłeś',                  uk: 'відкрився',                   be: 'адкрыўся' },
  ba_easy_s5_d: { en: '8 weeks to the first guest', ru: '8 недель до первого гостя',  pl: '8 tygodni do pierwszego gościa', uk: '8 тижнів до першого гостя', be: '8 тыдняў да першага госця' },
  ba_easy_time: { en: '≈ 8 weeks', ru: '≈ 8 недель', pl: '≈ 8 tygodni', uk: '≈ 8 тижнів', be: '≈ 8 тыдняў' },
  ba_easy_time_sub: { en: 'until the door opens · drawn from the 8-week plan of concept 16 · RUST', ru: 'до открытия двери · по плану на 8 недель из концепции 16 · RUST', pl: 'do otwarcia drzwi · według 8-tygodniowego planu konceptu 16 · RUST', uk: 'до відкриття дверей · за 8-тижневим планом концепції 16 · RUST', be: 'да адкрыцця дзвярэй · паводле 8-тыднёвага плану канцэпцыі 16 · RUST' },
  ba_footnote: {
    en: 'The "6 months" figure is the typical cycle of a brand agency + architect + copywriter + menu consultant. The "8 weeks" figure is drawn from the milestone list of concept 16 · RUST (see the timeline slide). Other concepts land in a similar range — 6 to 10 weeks.',
    ru: 'Цифра «6 месяцев» — типичный цикл брендингового агентства + архитектора + копирайтера + консультанта по меню. Цифра «8 недель» взята из списка вех концепции 16 · RUST (см. слайд таймлайна). Другие концепции укладываются в похожий диапазон — 6–10 недель.',
    pl: 'Liczba „6 miesięcy" to typowy cykl agencji brandingowej + architekta + copywritera + konsultanta menu. Liczba „8 tygodni" pochodzi z listy kamieni milowych konceptu 16 · RUST (patrz slajd osi czasu). Inne koncepty mieszczą się w podobnym zakresie — 6–10 tygodni.',
    uk: 'Цифра «6 місяців» — типовий цикл брендингової агенції + архітектора + копірайтера + консультанта з меню. Цифра «8 тижнів» взята зі списку віх концепції 16 · RUST (див. слайд таймлайну). Інші концепції лягають у схожий діапазон — 6–10 тижнів.',
    be: 'Лічба «6 месяцаў» — тыповы цыкл брэндынгавай агенцыі + архітэктара + капірайтэра + кансультанта па меню. Лічба «8 тыдняў» узята са спіса вех канцэпцыі 16 · RUST (гл. слайд таймлайна). Іншыя канцэпцыі трапляюць у падобны дыяпазон — 6–10 тыдняў.'
  },

  // ========== index.html — Deliverables ==========
  deli_1_t: { en: 'BRANDBOOK',       ru: 'БРЕНДБУК',           pl: 'BRANDBOOK',         uk: 'БРЕНДБУК',          be: 'БРЭНДБУК' },
  deli_1_c: { en: 'visual pack',     ru: 'визуальный пакет',   pl: 'pakiet wizualny',   uk: 'візуальний пакет',  be: 'візуальны пакет' },
  deli_1_d: { en: 'identity, voice, typography, palette, print & web applications', ru: 'айдентика, голос, типографика, палитра, применение в печати и вебе', pl: 'identyfikacja, głos, typografia, paleta, zastosowania w druku i webie', uk: 'айдентика, голос, типографіка, палітра, застосування в друці й вебі', be: 'ідэнтычнасць, голас, тыпаграфіка, палітра, ужыванне ў друку і вэбе' },
  deli_2_t: { en: 'P&L · 3 years',   ru: 'P&L · 3 года',       pl: 'P&L · 3 lata',      uk: 'P&L · 3 роки',      be: 'P&L · 3 гады' },
  deli_2_c: { en: 'monthly forecast',ru: 'помесячный прогноз', pl: 'prognoza miesięczna', uk: 'помісячний прогноз', be: 'памесячны прагноз' },
  deli_2_d: { en: 'revenue, OPEX, break-even, gross margin', ru: 'выручка, OPEX, точка безубыточности, валовая маржа', pl: 'przychody, OPEX, próg rentowności, marża brutto', uk: 'виручка, OPEX, точка беззбитковості, валова маржа', be: 'выручка, OPEX, кропка беззбытковасці, валавая маржа' },
  deli_3_t: { en: 'FLOORPLAN',       ru: 'ПЛАН ПОМЕЩЕНИЯ',     pl: 'PLAN LOKALU',       uk: 'ПЛАН ПРИМІЩЕННЯ',   be: 'ПЛАН ПАМЯШКАННЯ' },
  deli_3_c: { en: 'plan + axonometric', ru: 'план + аксонометрия', pl: 'plan + aksonometria', uk: 'план + аксонометрія', be: 'план + аксанаметрыя' },
  deli_3_d: { en: 'layout, facade, sections, street context', ru: 'планировка, фасад, разрезы, контекст улицы', pl: 'układ, fasada, przekroje, kontekst ulicy', uk: 'планування, фасад, перерізи, контекст вулиці', be: 'планіроўка, фасад, разрэзы, кантэкст вуліцы' },
  deli_4_t: { en: 'EQUIPMENT LIST',  ru: 'СПИСОК ОБОРУДОВАНИЯ',pl: 'LISTA WYPOSAŻENIA', uk: 'ПЕРЕЛІК ОБЛАДНАННЯ',be: 'СПІС АБСТАЛЯВАННЯ' },
  deli_4_c: { en: 'every piece',     ru: 'каждая позиция',     pl: 'każda pozycja',     uk: 'кожна позиція',     be: 'кожная пазіцыя' },
  deli_4_d: { en: 'per item: supplier, spec, contact, price in euros', ru: 'по каждой позиции: поставщик, спецификация, контакт, цена в евро', pl: 'dla każdej pozycji: dostawca, specyfikacja, kontakt, cena w euro', uk: 'на кожну позицію: постачальник, специфікація, контакт, ціна в євро', be: 'на кожную пазіцыю: пастаўшчык, спецыфікацыя, кантакт, кошт у еўра' },
  deli_5_t: { en: 'MENU',            ru: 'МЕНЮ',               pl: 'MENU',              uk: 'МЕНЮ',              be: 'МЕНЮ' },
  deli_5_c: { en: 'menu + recipes',  ru: 'меню + рецепты',     pl: 'menu + przepisy',   uk: 'меню + рецепти',    be: 'меню + рэцэпты' },
  deli_5_d: { en: 'items with prices, seasonal recipes, serving notes', ru: 'позиции с ценами, сезонные рецепты, заметки по подаче', pl: 'pozycje z cenami, sezonowe przepisy, notatki o serwowaniu', uk: 'позиції з цінами, сезонні рецепти, нотатки щодо подачі', be: 'пазіцыі з коштамі, сезонныя рэцэпты, нататкі пра падачу' },
  deli_6_t: { en: '8-WEEK PLAN',     ru: 'ПЛАН НА 8 НЕДЕЛЬ',   pl: 'PLAN 8 TYGODNI',    uk: 'ПЛАН НА 8 ТИЖНІВ',  be: 'ПЛАН НА 8 ТЫДНЯЎ' },
  deli_6_c: { en: 'opening schedule',ru: 'график открытия',    pl: 'harmonogram otwarcia', uk: 'графік відкриття', be: 'графік адкрыцця' },
  deli_6_d: { en: 'week by week: permits, build-out, training, soft-open', ru: 'неделя за неделей: разрешения, ремонт, обучение, soft-open', pl: 'tydzień po tygodniu: pozwolenia, prace wykończeniowe, szkolenia, soft-open', uk: 'тиждень за тижнем: дозволи, ремонт, навчання, soft-open', be: 'тыдзень за тыднем: дазволы, рамонт, навучанне, soft-open' },
  deli_7_t: { en: 'DAY-1 CHECKLIST', ru: 'ЧЕК-ЛИСТ ДНЯ-1',     pl: 'CHECKLIST DNIA-1',  uk: 'ЧЕК-ЛИСТ ДНЯ-1',    be: 'ЧЭК-ЛІСТ ДНЯ-1' },
  deli_7_c: { en: 'opening day',     ru: 'день открытия',      pl: 'dzień otwarcia',    uk: 'день відкриття',    be: 'дзень адкрыцця' },
  deli_7_d: { en: 'morning · evening · press-day script', ru: 'утро · вечер · сценарий пресс-дня', pl: 'rano · wieczór · scenariusz dnia prasowego', uk: 'ранок · вечір · сценарій прес-дня', be: 'раніца · вечар · сцэнар прэс-дня' },

  // ========== index.html — Catalog card subtitles ==========
  cat_16_s:  { en: 'massage · Amsterdam', ru: 'массаж · Амстердам',  pl: 'masaż · Amsterdam',  uk: 'масаж · Амстердам',  be: 'масаж · Амстэрдам' },
  cat_13_s:  { en: 'studio · Lisbon',     ru: 'студия · Лиссабон',   pl: 'studio · Lizbona',    uk: 'студія · Лісабон',   be: 'студыя · Лісабон' },
  cat_15_s:  { en: 'club · Helsinki',     ru: 'клуб · Хельсинки',    pl: 'klub · Helsinki',     uk: 'клуб · Гельсінкі',   be: 'клуб · Хельсінкі' },
  cat_06_s:  { en: 'clinic · Vienna',     ru: 'клиника · Вена',      pl: 'klinika · Wiedeń',    uk: 'клініка · Відень',   be: 'клініка · Вена' },
  cat_12_s:  { en: 'shop · Milano',       ru: 'магазин · Милан',     pl: 'sklep · Mediolan',    uk: 'крамниця · Мілан',   be: 'крама · Мілан' },
  cat_11_s:  { en: 'room · Paris',        ru: 'зал · Париж',         pl: 'sala · Paryż',        uk: 'зала · Париж',       be: 'зала · Парыж' },
  cat_14_s:  { en: 'workshop · Helsinki', ru: 'мастерская · Хельсинки', pl: 'pracownia · Helsinki', uk: 'майстерня · Гельсінкі', be: 'майстэрня · Хельсінкі' },
  cat_03_s:  { en: 'bar · Stockholm',     ru: 'бар · Стокгольм',     pl: 'bar · Sztokholm',     uk: 'бар · Стокгольм',    be: 'бар · Стакгольм' },
  cat_09_s:  { en: 'school · Ljubljana',  ru: 'школа · Любляна',     pl: 'szkoła · Lublana',    uk: 'школа · Любляна',    be: 'школа · Любляна' },
  cat_04_s:  { en: 'studio · Stockholm',  ru: 'студия · Стокгольм',  pl: 'studio · Sztokholm',  uk: 'студія · Стокгольм', be: 'студыя · Стакгольм' },
  cat_102_s: { en: 'kiosk · Brussels',    ru: 'киоск · Брюссель',    pl: 'kiosk · Bruksela',    uk: 'кіоск · Брюссель',   be: 'кіёск · Брусэль' },
  cat_101_s: { en: 'cafe · Brussels',     ru: 'кафе · Брюссель',     pl: 'kawiarnia · Bruksela',uk: 'кафе · Брюссель',    be: 'кавярня · Брусэль' },

  // ========== index.html — FAQ ==========
  idx_faq_q1: {
    en: 'Can I buy just one concept?',
    ru: 'Можно ли купить только одну концепцию?',
    pl: 'Czy mogę kupić tylko jeden koncept?',
    uk: 'Чи можна купити лише одну концепцію?',
    be: 'Ці можна купіць толькі адну канцэпцыю?'
  },
  idx_faq_a1: {
    en: 'Not anymore. We moved to a single subscription: one account unlocks the whole library. If you only need one concept, grab Monthly for $19, download the dossier and cancel the next day — still cheaper than the old per-concept price.',
    ru: 'Больше нет. Мы перешли на единую подписку: один аккаунт открывает всю библиотеку. Если нужна только одна концепция — оформите Monthly за $19, скачайте досье и отмените на следующий день. Всё равно дешевле, чем старая цена за одну концепцию.',
    pl: 'Już nie. Przeszliśmy na jedną subskrypcję: jedno konto odblokowuje całą bibliotekę. Jeśli potrzebujesz tylko jednego konceptu — kup Monthly za $19, pobierz dossier i anuluj następnego dnia. I tak będzie taniej niż dawna cena za koncept.',
    uk: 'Уже ні. Ми перейшли на єдину підписку: один акаунт відкриває всю бібліотеку. Якщо потрібна лише одна концепція — оформіть Monthly за $19, завантажте досьє та скасуйте наступного дня. Усе одно дешевше за стару ціну за концепцію.',
    be: 'Ужо не. Мы перайшлі на адзіную падпіску: адзін акаўнт адкрывае ўсю бібліятэку. Калі патрэбна толькі адна канцэпцыя — аформце Monthly за $19, спампуйце дасье і скасуйце наступным днём. Усё адно танней за старую цану за канцэпцыю.'
  },
  idx_faq_q2: {
    en: 'What happens if I cancel?',
    ru: 'Что будет, если я отменю подписку?',
    pl: 'Co się stanie, jeśli anuluję?',
    uk: 'Що буде, якщо я скасую підписку?',
    be: 'Што будзе, калі я скасую падпіску?'
  },
  idx_faq_a2: {
    en: 'Access to concept pages and future updates ends. Files you have already downloaded stay on your disk — they are yours under the licence.',
    ru: 'Доступ к страницам концепций и будущим обновлениям заканчивается. Файлы, которые вы уже скачали, остаются у вас на диске — они ваши по лицензии.',
    pl: 'Dostęp do stron konceptów i przyszłych aktualizacji się kończy. Pliki, które już pobrałeś, zostają na twoim dysku — należą do ciebie zgodnie z licencją.',
    uk: 'Доступ до сторінок концепцій і майбутніх оновлень припиняється. Файли, які ви вже завантажили, залишаються на вашому диску — вони ваші згідно з ліцензією.',
    be: 'Доступ да старонак канцэпцый і будучых абнаўленняў сканчваецца. Файлы, якія вы ўжо спампавалі, застаюцца на вашым дыску — яны вашыя паводле ліцэнзіі.'
  },
  idx_faq_q3: {
    en: 'Can I actually open a business from a concept?',
    ru: 'Можно ли реально открыть бизнес по концепции?',
    pl: 'Czy naprawdę można otworzyć biznes na podstawie konceptu?',
    uk: 'Чи можна справді відкрити бізнес за концепцією?',
    be: 'Ці можна на самой справе адкрыць бізнес па канцэпцыі?'
  },
  idx_faq_a3: {
    en: 'Yes — that\'s why we make them. The base licence covers one owner and one venue in one city per concept. Planning a chain or franchise? Write to us and we\'ll draw up a separate agreement.',
    ru: 'Да — для этого их и делаем. Базовая лицензия покрывает одного владельца и одно заведение в одном городе на концепцию. Планируете сеть или франшизу? Напишите нам — оформим отдельный договор.',
    pl: 'Tak — po to je tworzymy. Licencja podstawowa obejmuje jednego właściciela i jeden lokal w jednym mieście dla każdego konceptu. Planujesz sieć lub franczyzę? Napisz do nas — sporządzimy osobną umowę.',
    uk: 'Так — для цього їх і робимо. Базова ліцензія покриває одного власника і один заклад в одному місті на концепцію. Плануєте мережу або франшизу? Напишіть нам — складемо окремий договір.',
    be: 'Так — для гэтага іх і робім. Базавая ліцэнзія пакрывае аднаго ўладальніка і адну ўстанову ў адным горадзе на канцэпцыю. Плануеце сетку ці франшызу? Напішыце нам — складзем асобную дамову.'
  },
  idx_faq_q4: {
    en: 'Are the revenue and CAPEX numbers a promise?',
    ru: 'Цифры по выручке и CAPEX — это обещание?',
    pl: 'Czy liczby przychodów i CAPEX to obietnica?',
    uk: 'Чи цифри виручки та CAPEX — це обіцянка?',
    be: 'Ці лічбы выручкі і CAPEX — гэта абяцанне?'
  },
  idx_faq_a4: {
    en: 'No. They\'re planning orientation based on average European-market figures. Every P&L states this plainly: numbers are indicative and depend on city, lease and suppliers. Adjust them for your situation.',
    ru: 'Нет. Это ориентир для планирования, основанный на средних европейских цифрах. В каждом P&L это прямо указано: цифры индикативны и зависят от города, аренды и поставщиков. Подстраивайте их под свою ситуацию.',
    pl: 'Nie. To orientacja do planowania na podstawie średnich europejskich. Każdy P&L mówi to wprost: liczby są poglądowe i zależą od miasta, najmu i dostawców. Dostosuj je do swojej sytuacji.',
    uk: 'Ні. Це орієнтир для планування на основі середніх європейських цифр. У кожному P&L це чітко вказано: цифри індикативні й залежать від міста, оренди та постачальників. Адаптуйте їх до своєї ситуації.',
    be: 'Не. Гэта арыенцір для планавання, заснаваны на сярэдніх еўрапейскіх лічбах. У кожным P&L гэта прама пазначана: лічбы індыкатыўныя і залежаць ад горада, арэнды і пастаўшчыкоў. Прыстасоўвайце іх пад сваю сітуацыю.'
  },
  idx_faq_q5: {
    en: 'What language are the concepts in?',
    ru: 'На каком языке концепции?',
    pl: 'W jakim języku są koncepty?',
    uk: 'Якою мовою концепції?',
    be: 'На якой мове канцэпцыі?'
  },
  idx_faq_a5: {
    en: 'Content is in English with local vocabulary (Dutch, Italian, Japanese — wherever it\'s part of the place\'s character). The site itself is being translated into 12 languages.',
    ru: 'Контент на английском с местной лексикой (нидерландский, итальянский, японский — там, где это часть характера места). Сам сайт переводится на 12 языков.',
    pl: 'Treść jest po angielsku z lokalnym słownictwem (niderlandzkim, włoskim, japońskim — tam, gdzie należy do charakteru miejsca). Sama strona jest tłumaczona na 12 języków.',
    uk: 'Контент англійською з місцевою лексикою (нідерландська, італійська, японська — там, де це частина характеру місця). Сам сайт перекладається 12 мовами.',
    be: 'Кантэнт на англійскай з мясцовай лексікай (нідэрландская, італьянская, японская — там, дзе гэта частка характару месца). Сам сайт перакладаецца на 12 моў.'
  },
  idx_faq_q6: {
    en: 'Where do the brandbook photos come from?',
    ru: 'Откуда фотографии в брендбуках?',
    pl: 'Skąd zdjęcia w brandbookach?',
    uk: 'Звідки фотографії в брендбуках?',
    be: 'Адкуль фатаграфіі ў брэндбуках?'
  },
  idx_faq_a6: {
    en: 'Every visual scene is shot specifically for the concept — no stock. Where needed we use generative AI (Nano Banana / Vertex) with manual detail polish.',
    ru: 'Каждая визуальная сцена создаётся специально под концепцию — без стока. Где нужно — используем генеративный ИИ (Nano Banana / Vertex) с ручной доводкой деталей.',
    pl: 'Każda scena wizualna jest tworzona specjalnie pod koncept — bez stocku. Tam, gdzie trzeba, używamy generatywnej AI (Nano Banana / Vertex) z ręcznym dopracowaniem detali.',
    uk: 'Кожна візуальна сцена створюється спеціально під концепцію — без стоку. Де потрібно — використовуємо генеративний ШІ (Nano Banana / Vertex) з ручним доопрацюванням деталей.',
    be: 'Кожная візуальная сцэна ствараецца спецыяльна пад канцэпцыю — без стоку. Дзе трэба — выкарыстоўваем генератыўны ШІ (Nano Banana / Vertex) з ручной даводкай дэталяў.'
  },

  // ========== index.html — Concierge ==========
  cncrg_eyebrow: { en: '— full support —', ru: '— полная поддержка —', pl: '— pełne wsparcie —', uk: '— повна підтримка —', be: '— поўная падтрымка —' },
  cncrg_h2_html: {
    en: 'More than a concept — <span class="italic">we\'ll open the venue with you.</span>',
    ru: 'Больше, чем концепция — <span class="italic">мы откроем заведение вместе с вами.</span>',
    pl: 'Więcej niż koncept — <span class="italic">otworzymy lokal razem z tobą.</span>',
    uk: 'Більше, ніж концепція — <span class="italic">ми відкриємо заклад разом із вами.</span>',
    be: 'Больш, чым канцэпцыя — <span class="italic">мы адкрыем установу разам з вамі.</span>'
  },
  cncrg_lead: {
    en: 'We can accompany you end-to-end through opening your venue. Leave a request and our manager will get back to you.',
    ru: 'Мы можем сопровождать вас от и до по пути открытия заведения. Оставьте заявку — наш менеджер свяжется с вами.',
    pl: 'Możemy towarzyszyć ci od początku do końca w otwarciu lokalu. Zostaw zgłoszenie, a nasz menedżer się odezwie.',
    uk: 'Ми можемо супроводжувати вас від А до Я в дорозі до відкриття закладу. Залиште заявку — наш менеджер звʼяжеться з вами.',
    be: 'Мы можам суправаджаць вас ад А да Я па шляху да адкрыцця ўстановы. Пакіньце заяўку — наш менеджэр звяжацца з вамі.'
  },
  cncrg_b1: { en: 'site, lease agreement, permits', ru: 'помещение, договор аренды, разрешения', pl: 'lokal, umowa najmu, pozwolenia', uk: 'приміщення, договір оренди, дозволи', be: 'памяшканне, дамова арэнды, дазволы' },
  cncrg_b2: { en: 'interior & facade design, brand identity', ru: 'дизайн интерьера и фасада, фирменный стиль', pl: 'projekt wnętrza i fasady, identyfikacja marki', uk: 'дизайн інтерʼєру та фасаду, фірмовий стиль', be: 'дызайн інтэрʼеру і фасада, фірмовы стыль' },
  cncrg_b3: { en: 'equipment, suppliers, installation', ru: 'оборудование, поставщики, монтаж', pl: 'wyposażenie, dostawcy, montaż', uk: 'обладнання, постачальники, монтаж', be: 'абсталяванне, пастаўшчыкі, мантаж' },
  cncrg_b4: { en: 'team: hiring & training', ru: 'команда: найм и обучение', pl: 'zespół: rekrutacja i szkolenia', uk: 'команда: найм і навчання', be: 'каманда: найм і навучанне' },
  cncrg_b5: { en: 'launch plan and first month of operations', ru: 'план запуска и первый месяц работы', pl: 'plan startu i pierwszy miesiąc działania', uk: 'план запуску і перший місяць роботи', be: 'план запуску і першы месяц працы' },
  cncrg_sent_h: { en: 'Request received.', ru: 'Заявка получена.', pl: 'Zgłoszenie przyjęte.', uk: 'Заявку отримано.', be: 'Заяўка прынятая.' },
  cncrg_sent_p: {
    en: 'A LABS67 manager will contact you within one business day. Thank you.',
    ru: 'Менеджер LABS67 свяжется с вами в течение одного рабочего дня. Спасибо.',
    pl: 'Menedżer LABS67 skontaktuje się z tobą w ciągu jednego dnia roboczego. Dziękujemy.',
    uk: 'Менеджер LABS67 звʼяжеться з вами протягом одного робочого дня. Дякуємо.',
    be: 'Менеджэр LABS67 звяжацца з вамі на працягу аднаго працоўнага дня. Дзякуй.'
  },
  cncrg_lbl_name:  { en: 'Your name', ru: 'Ваше имя', pl: 'Twoje imię', uk: 'Ваше імʼя', be: 'Ваша імя' },
  cncrg_lbl_email: { en: 'Email',     ru: 'Email',    pl: 'Email',      uk: 'Email',     be: 'Email' },
  cncrg_lbl_phone: { en: 'Phone',     ru: 'Телефон',  pl: 'Telefon',    uk: 'Телефон',   be: 'Тэлефон' },
  cncrg_lbl_msg:   { en: "What's on your mind (optional)", ru: 'О чём думаете (необязательно)', pl: 'O czym myślisz (opcjonalnie)', uk: 'Про що думаєте (необовʼязково)', be: 'Пра што думаеце (неабавязкова)' },
  cncrg_msg_placeholder: {
    en: "City, timing, budget, any details — anything you'd like us to know.",
    ru: 'Город, сроки, бюджет, любые детали — всё, что хотите нам сообщить.',
    pl: 'Miasto, terminy, budżet, dowolne szczegóły — wszystko, co chcesz nam przekazać.',
    uk: 'Місто, терміни, бюджет, будь-які деталі — усе, що хочете нам розповісти.',
    be: 'Горад, тэрміны, бюджэт, любыя дэталі — усё, што хочаце нам паведаміць.'
  },
  cncrg_btn_sending: { en: 'Sending…', ru: 'Отправка…', pl: 'Wysyłanie…', uk: 'Надсилання…', be: 'Адпраўка…' },
  cncrg_btn_send:    { en: 'Send request', ru: 'Отправить заявку', pl: 'Wyślij zgłoszenie', uk: 'Надіслати заявку', be: 'Адправіць заяўку' },
  cncrg_consent: {
    en: "By submitting, you agree to the processing of your contact data. We'll reply within one business day.",
    ru: 'Отправляя форму, вы соглашаетесь на обработку контактных данных. Ответим в течение одного рабочего дня.',
    pl: 'Wysyłając zgodzasz się na przetwarzanie danych kontaktowych. Odpowiemy w ciągu jednego dnia roboczego.',
    uk: 'Надсилаючи, ви погоджуєтесь на обробку контактних даних. Відповімо протягом одного робочого дня.',
    be: 'Адпраўляючы, вы згаджаецеся на апрацоўку кантактных даных. Адкажам на працягу аднаго працоўнага дня.'
  },
  cncrg_err_name:    { en: 'Please tell us your name.', ru: 'Пожалуйста, укажите имя.', pl: 'Podaj swoje imię.', uk: 'Будь ласка, вкажіть імʼя.', be: 'Калі ласка, пакажыце імя.' },
  cncrg_err_contact: { en: 'Leave an email or phone so we can get back to you.', ru: 'Оставьте email или телефон, чтобы мы могли с вами связаться.', pl: 'Zostaw email lub telefon, byśmy mogli się skontaktować.', uk: 'Залиште email або телефон, щоб ми могли звʼязатися.', be: 'Пакіньце email ці тэлефон, каб мы маглі звязацца.' },
  cncrg_err_email:   { en: 'That email looks invalid.', ru: 'Email выглядит некорректно.', pl: 'Ten email wygląda na nieprawidłowy.', uk: 'Email виглядає некоректно.', be: 'Email выглядае некарэктна.' },
  cncrg_err_submit:  { en: 'Could not submit. Please try again or email ceo@labs67.com.', ru: 'Не удалось отправить. Попробуйте ещё раз или напишите на ceo@labs67.com.', pl: 'Nie udało się wysłać. Spróbuj ponownie lub napisz na ceo@labs67.com.', uk: 'Не вдалося надіслати. Спробуйте ще раз або напишіть на ceo@labs67.com.', be: 'Не атрымалася адправіць. Паспрабуйце яшчэ раз ці напішыце на ceo@labs67.com.' },

  // ========== index.html — Footer ==========
  footer_tagline: { en: 'atlas of unbuilt worlds', ru: 'атлас непостроенных миров', pl: 'atlas niezbudowanych światów', uk: 'атлас небудованих світів', be: 'атлас непабудаваных светаў' },
  footer_language: { en: 'Language', ru: 'Язык', pl: 'Język', uk: 'Мова', be: 'Мова' },
  footer_h_product: { en: 'product', ru: 'продукт', pl: 'produkt', uk: 'продукт', be: 'прадукт' },
  footer_h_company: { en: 'company', ru: 'компания', pl: 'firma', uk: 'компанія', be: 'кампанія' },
  footer_h_legal:   { en: 'legal',   ru: 'правовое', pl: 'prawne', uk: 'юридичне', be: 'юрыдычнае' },
  footer_link_catalog: { en: 'Concept catalog', ru: 'Каталог концепций', pl: 'Katalog konceptów', uk: 'Каталог концепцій', be: 'Каталог канцэпцый' },
  footer_link_subscription: { en: 'Subscription', ru: 'Подписка', pl: 'Subskrypcja', uk: 'Підписка', be: 'Падпіска' },
  footer_link_account: { en: 'Account', ru: 'Аккаунт', pl: 'Konto', uk: 'Акаунт', be: 'Акаўнт' },
  footer_link_licence: { en: 'Licence', ru: 'Лицензия', pl: 'Licencja', uk: 'Ліцензія', be: 'Ліцэнзія' },
  footer_link_refunds: { en: 'Refunds', ru: 'Возвраты', pl: 'Zwroty', uk: 'Повернення', be: 'Звароты' },
  footer_link_imprint: { en: 'Imprint', ru: 'Реквизиты', pl: 'Stopka prawna', uk: 'Реквізити', be: 'Рэквізіты' },
  footer_link_terms:   { en: 'Terms',   ru: 'Условия',   pl: 'Regulamin',  uk: 'Умови',     be: 'Умовы' },
  footer_link_privacy: { en: 'Privacy', ru: 'Приватность', pl: 'Prywatność', uk: 'Приватність', be: 'Прыватнасць' },
  footer_link_legal:   { en: 'Legal notice', ru: 'Правовая информация', pl: 'Informacja prawna', uk: 'Правова інформація', be: 'Прававая інфармацыя' },
  footer_copyright: { en: '© 2026 micro.svita · atlas of unbuilt worlds', ru: '© 2026 micro.svita · атлас непостроенных миров', pl: '© 2026 micro.svita · atlas niezbudowanych światów', uk: '© 2026 micro.svita · атлас небудованих світів', be: '© 2026 micro.svita · атлас непабудаваных светаў' },
  footer_made: { en: 'made at LABS67', ru: 'сделано в LABS67', pl: 'wykonane w LABS67', uk: 'зроблено в LABS67', be: 'зроблена ў LABS67' }
};
