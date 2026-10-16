# Content migration report (Phase 1)

Written by `scripts/migrate-content.ts`. Lists what the migration could not decide on its own.
Nothing here was guessed: each record keeps what the app showed before the migration.

Migrated 131 events, 161 people, 10 cities, 51 Quran passages, 6 eras, 7 categories.

## 1. People names that match more than one person

The app opens the first match. For Mostafa: confirm or name the right person for each row.

| Event | Name shown | Opens today | All matches |
| --- | --- | --- | --- |
| `ghazwat_sawiq` | أبو سفيان | `abu-sufyan` | `abu-sufyan`, `abu-sufyan-ibn-al-harith` |
| `ghazwat_badr_mawuid` | أبو سفيان | `abu-sufyan` | `abu-sufyan`, `abu-sufyan-ibn-al-harith` |

## 2. Event and replay numbers that differ

Event text (army size, duration) next to the replay scenario figures (strength, day count).
For Mostafa: which figure to trust (plan, Decision 2). Nothing is changed until then.

| Event | Army (event) | Muslims (replay) | Enemy (event) | Enemy (replay) | Duration (event) | Days (replay) |
| --- | --- | --- | --- | --- | --- | --- |
| `battle-badr` | حَوَالَيْ ٣١٣ مُقَاتِلًا | 313 | حَوَالَيْ ١٠٠٠ مُقَاتِلٍ | 950 | يَوْمٌ وَاحِدٌ (١٧ رَمَضَانَ ٢ هـ) | 1 |
| `battle-uhud` | حَوَالَيْ ٧٠٠ مُقَاتِلٍ | 700 | حَوَالَيْ ٣٠٠٠ مُقَاتِلٍ | 3,000 | يَوْمٌ وَاحِدٌ (٧ شَوَّالٍ ٣ هـ) | 1 |
| `battle-khandaq` | حَوَالَيْ ٣٠٠٠ مُقَاتِلٍ | 3,000 | حَوَالَيْ ١٠٠٠٠ مُقَاتِلٍ (الْأَحْزَابُ) | 10,000 | مَا يُقَارِبُ ٢٤ يَوْمًا (حِصَارٌ) | 27 |
| `battle-khaybar` | حَوَالَيْ ١٤٠٠ مُقَاتِلٍ | 1,600 | حَوَالَيْ ١٠٠٠٠ مُقَاتِلٍ مُتَحَصِّنِينَ فِي حُصُونٍ مَنِيعَةٍ | 10,000 | قُرَابَةَ شَهْرٍ (حِصَارٌ وَمَعَارِكُ مُتَقَطِّعَةٌ) | 22 |
| `battle-mutah` | ٣٠٠٠ مُقَاتِلٍ | 3,000 | حَوَالَيْ ٢٠٠٠٠٠ مُقَاتِلٍ (الرُّومُ وَحُلَفَاؤُهُمْ مِنَ الْغَسَاسِنَةِ) | 19,500 | ٦ أَيَّامٍ مِنَ الْقِتَالِ الضَّارِي | 1 |
| `conquest-mecca` | حَوَالَيْ ١٠٠٠٠ مُقَاتِلٍ | 10,000 | — | 1,200 | بِضْعَةُ أَيَّامٍ لِلْفَتْحِ (تَمَّ دُخُولُ مَكَّةَ فِي ٢٠ رَمَضَانَ ٨ هـ) | 11 |
| `battle-hunayn` | ١٢٠٠٠ مُقَاتِلٍ | 12,000 | حَوَالَيْ ٢٠٠٠٠ مُقَاتِلٍ (هَوَازِنُ وَثَقِيفٌ) | 6,000 | يَوْمٌ وَاحِدٌ | 1 |
| `battle-tabuk` | حَوَالَيْ ٣٠٠٠٠ مُقَاتِلٍ | 30,000 | جَيْشُ الرُّومِ (لَمْ يَحْضُرُوا) | 690 | حَوَالَيْ ٥٠ يَوْمًا (شَمِلَتِ السَّفَرَ وَالْبَقَاءَ فِي تَبُوكَ) | 50 |
| `battle_yamama` | — | 13,000 | — | 40,000 | — | 2 |
| `battle-yarmouk` | حَوَالَيْ 36,000 مُقَاتِلٍ | 36,400 | حَوَالَيْ 240,000 مُقَاتِلٍ (الرُّومُ الْبِيزَنْطِيُّونَ) | 110,000 | 6 أَيَّامٍ | 6 |
| `battle-qadisiyyah` | حَوَالَيْ 30,000 مُقَاتِلٍ | 30,000 | حَوَالَيْ 120,000 مُقَاتِلٍ (الْفُرْسُ) مَعَ 33 فِيلًا | 60,000 | 4 أَيَّامٍ (أَيَّامُ أَرْمَاثَ، أَغْوَاثَ، عَمَاسَ، وَالْقَادِسِيَّةِ) | 4 |
| `battle-nahavand` | حَوَالَيْ 30,000 مُقَاتِلٍ | 30,000 | حَوَالَيْ 150,000 مُقَاتِلٍ (الْفُرْسُ) | 100,000 | 3 أَيَّامٍ | 3 |

## 3. Force sizes kept as text only

The text has no single plain number (several numbers, words such as "ألف" or "أكثر من", or none).
The text is kept; a number can be added by hand later.

| Event | Field | Text |
| --- | --- | --- |
| `banu-qaynuqa` | army | جَيْشُ الْمُسْلِمِينَ |
| `battle-tabuk` | enemyArmy | جَيْشُ الرُّومِ (لَمْ يَحْضُرُوا) |
| `conquest-iraq-start` | enemyArmy | غَيْرُ مُحَدَّدٍ بِدِقَّةٍ، لَكِنَّهُ جَيْشٌ ضَخْمٌ |
| `battle-qadisiyyah` | enemyArmy | حَوَالَيْ 120,000 مُقَاتِلٍ (الْفُرْسُ) مَعَ 33 فِيلًا |
| `conquest-egypt` | army | بَدَأَ بِـ 4,000 ثُمَّ وَصَلَ الْمَدَدُ إِلَى 12,000 مُقَاتِلٍ |
| `conquest-egypt` | enemyArmy | حَامِيَةٌ بِيزَنْطِيَّةٌ ضَخْمَةٌ |
| `alexandria-reconquest` | army | جُنْدُ مِصْرَ مَعَ أَمْدَادٍ (الْعَدَدُ الدَّقِيقُ لَمْ يُنْقَلْ) |
| `alexandria-reconquest` | enemyArmy | أُسْطُولٌ وَجَيْشٌ رُومِيٌّ ضَخْمٌ بِقِيَادَةِ مَنْوِيلَ الْخَصِيِّ |
| `conquest-rayy-jurjan` | army | جَيْشُ الْكُوفَةِ وَجَيْشُ الْبَصْرَةِ (بِضْعَةُ عَشَرَ أَلْفًا) |
| `conquest-rayy-jurjan` | enemyArmy | مَرَازِبَةُ الْجِبَالِ وَبَقَايَا السَّاسَانِيِّينَ |
| `conquest-nubia-baqt` | enemyArmy | رُمَاةُ مَمْلَكَةِ الْمُقُرَّةِ النُّوبِيَّةِ |

## 4. Events without a Hijri year (90)

The old data had a Hijri year for the other events only. The date label is kept as it was.

| Event | Date label |
| --- | --- |
| `fijar-war` | 38 ق.هـ |
| `hilf-al-fudul` | 33 ق.هـ |
| `marriage-khadija` | 28 ق.هـ |
| `rebuilding-kaaba` | 18 ق.هـ |
| `revelation-hira` | قَبْلَ الْهِجْرَةِ بِـ 13 عَامًا |
| `public-dawah` | 10 ق.هـ |
| `migration-abyssinia` | الْعَامُ الْخَامِسُ مِنَ الْبَعْثَةِ |
| `islam_hamza` | 6 قَبْلَ الْهِجْرَةِ |
| `islam_umar` | 6 قَبْلَ الْهِجْرَةِ |
| `boycott-hashim` | 7 ق.هـ |
| `year-of-sorrow` | 3 ق.هـ |
| `journey-taif` | 3 ق.هـ |
| `isra-miraj` | قبل الهجرة بسنة |
| `first-aqaba` | 1 ق.هـ |
| `second-aqaba` | ذُو الْحِجَّةِ، قُبَيْلَ الْهِجْرَةِ |
| `hijra-medina` | عام 1 هـ |
| `building-mosque` | 1 هـ |
| `medina-constitution` | 1 هـ |
| `sariyyat-hamza` | 1 هـ |
| `sariyyat-ubaydah` | 1 هـ |
| `sariyyat-nakhla` | 2 هـ |
| `change-qibla` | شعبان، 2 هـ |
| `battle-badr` | 17 رمضان، 2 هـ |
| `banu-qaynuqa` | شوال، 2 هـ |
| `ghazwat_sawiq` | 2 هـ |
| `ghazwat_dhi_amar` | 3 هـ |
| `battle-uhud` | شوال، 3 هـ |
| `banu-nadir` | ربيع الأول، 4 هـ |
| `incident_rajeei` | 4 هـ |
| `incident_bir_mauna` | 4 هـ |
| `ghazwat_badr_mawuid` | 4 هـ |
| `ghazwat_dumat_aljandal` | 5 هـ |
| `battle-khandaq` | شوال، 5 هـ |
| `banu-qurayza` | ذو القعدة، 5 هـ |
| `ghazwat_bani_mustaliq` | 5 هـ |
| `incident_ifk` | 5 هـ |
| `treaty-hudaybiyyah` | ذو القعدة، 6 هـ |
| `battle-khaybar` | محرم، 7 هـ |
| `umrat_alqada` | 7 هـ |
| `battle-mutah` | جمادى الأولى، 8 هـ |
| `sariyat_khabt` | 8 هـ |
| `conquest-mecca` | رمضان، 8 هـ |
| `battle-hunayn` | شوال، 8 هـ |
| `siege_of_taif` | 8 هـ |
| `battle-tabuk` | رجب، 9 هـ |
| `farewell-pilgrimage` | ذو الحجة، 10 هـ |
| `prophet-death` | 12 ربيع الأول، 11 هـ |
| `ridda-wars-start` | 11 هـ |
| `battle_buzakha` | 11 هـ |
| `battle_yamama` | 11 هـ |
| `conquest-iraq-start` | 12 هـ |
| `conquest_hira` | 12 هـ |
| `battle_ullais` | 12 هـ |
| `battle-hasid` | 12 هـ |
| `battle-musayyakh` | 12 هـ |
| `battle-thani` | 12 هـ |
| `battle-zumail` | 12 هـ |
| `battle-marj-dabiq` | جمادى الآخرة 13 هـ |
| `battle_firaz` | 12 هـ |
| `battle_namariq` | 13 هـ |
| `conquest-damascus` | 13 هـ |
| `battle-saqatiya` | 12 شعبان 13 هـ |
| `battle-bridge` | 13 هـ |
| `battle-buwaib` | 14 هـ |
| `battle_fahl` | 14 هـ |
| `conquest-homs` | 14 هـ |
| `battle-yarmouk` | رجب، 15 هـ |
| `battle-qadisiyyah` | 15 هـ |
| `conquest-madain` | 16 هـ |
| `conquest-qinnasrin` | 16 هـ |
| `conquest_jalula` | 16 هـ |
| `conquest-aleppo` | 16 هـ |
| `conquest-antioch` | 16 هـ |
| `battle-hadir` | 17 هـ |
| `famine-am-ramada` | 18 هـ |
| `conquest-edessa` | 18 هـ |
| `plague-amwas` | 18 هـ |
| `conquest-raqqa` | 18 هـ |
| `conquest-egypt` | 20 هـ |
| `conquest_tustar` | 20 هـ |
| `conquest-alexandria` | 21 هـ |
| `battle-nahavand` | 21 هـ |
| `conquest_istakhr` | 23 هـ |
| `conquest_armenia` | 25 هـ |
| `conquest-north-africa` | 27 هـ |
| `conquest-cyprus` | 28 هـ |
| `conquest_khorasan` | 31 هـ |
| `battle-masts` | 34 هـ |
| `battle-camel` | 36 هـ |
| `battle-nahrawan` | 38 هـ |

## 5. Events that share a date (`tieOrder`)

They keep their order on the timeline through `date.tieOrder`.

| sortKey | tieOrder | Event |
| --- | --- | --- |
| 619 | 0 | `year-of-sorrow` |
| 619 | 1 | `journey-taif` |
| 621 | 0 | `isra-miraj` |
| 621 | 1 | `first-aqaba` |
| 622 | 0 | `second-aqaba` |
| 622 | 1 | `hijra-medina` |
| 622 | 2 | `building-mosque` |
| 623 | 0 | `medina-constitution` |
| 623 | 1 | `sariyyat-hamza` |
| 623 | 2 | `sariyyat-ubaydah` |
| 624 | 0 | `sariyyat-nakhla` |
| 624 | 1 | `change-qibla` |
| 624 | 2 | `battle-badr` |
| 624 | 3 | `banu-qaynuqa` |
| 625 | 0 | `battle-uhud` |
| 625 | 1 | `banu-nadir` |
| 627 | 0 | `battle-khandaq` |
| 627 | 1 | `banu-qurayza` |
| 627.1 | 0 | `ghazwat_bani_mustaliq` |
| 627.1 | 1 | `incident_ifk` |
| 633.5 | 0 | `conquest-iraq-start` |
| 633.5 | 1 | `event-55-جمع-القرن-الكريم-الأول` |
| 633.5 | 2 | `conquest_hira` |
| 633.58 | 0 | `battle_ullais` |
| 633.58 | 1 | `battle-hasid` |
| 634.65 | 0 | `event-65-وفاة-أبي-بكر-الصديق` |
| 634.65 | 1 | `event-66-تولي-عمر-بن-الخطاب-الخلافة` |
| 635.08 | 0 | `battle-saqatiya` |
| 635.08 | 1 | `battle-bridge` |
| 658 | 0 | `battle-nahrawan` |
| 658 | 1 | `event-112-التحكيم-بين-علي-ومعاوية` |

## 6. Spellings merged into one id

Not visible: the era badge, colours and markers stay the same.

| Era as written | Era id | Events |
| --- | --- | --- |
| العهد المكي | `meccan` | 17 |
| العهد المدني | `medinan` | 32 |
| أبو بكر الصديق | `abu-bakr` | 16 |
| عهد أبي بكر الصديق | `abu-bakr` | 1 |
| عمر بن الخطاب | `umar` | 27 |
| عهد عثمان بن عفان | `uthman` | 21 |
| عهد علي بن أبي طالب | `ali` | 17 |

| Category as written | Category id | Events |
| --- | --- | --- |
| battle | `battle` | 55 |
| غزوات ومعارك | `battle` | 1 |
| migration | `migration` | 2 |
| revelation | `revelation` | 5 |
| landmark | `landmark` | 22 |
| treaty | `treaty` | 5 |
| politics | `politics` | 5 |
| أحداث | `events` | 30 |
| فتوحات | `events` | 1 |
| إنجازات حضارية | `events` | 2 |
| أحداث سياسية | `events` | 3 |
