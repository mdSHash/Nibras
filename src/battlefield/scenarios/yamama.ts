import type { BattleScenario } from '../types/scenario';

/**
 * مَعْرَكَةُ الْيَمَامَةِ — حَدِيقَةُ الْمَوْتِ
 * Battle of al-Yamamah — The Garden of Death
 *
 * 12 AH / December 632 – January 633 CE — Caliphate of Abu Bakr al-Siddiq.
 * Aqraba plain, region of al-Yamamah (central-eastern Najd, ~70km SE of
 * modern Riyadh). The decisive battle of the Ridda Wars.
 *
 * Khalid ibn al-Walid led ~13,000 Muslims against ~40,000 of Banu Hanifa
 * under Musaylimah ibn Habib al-Hanafi al-Kadhdhab (the False Prophet of
 * al-Yamamah). After the failures of Ikrima and Shurahbil, Abu Bakr
 * appointed Khalid. Battle opened with a ferocious Hanafi shock-charge
 * under Muhakkim ibn al-Tufayl and al-Rajjal ibn Unfuwa — the apostate
 * former Companion who had falsely testified that the Prophet ﷺ named
 * Musaylimah a co-prophet. The Hanafi taunt rang out: «يَا أَهْلَ سُورَةِ
 * الْبَقَرَةِ، بَطَلَتِ الْبَقَرَةُ الْيَوْم!» Banu Hanifa broke the
 * mixed Muslim line, reached the women's tents, and Khalid's wife Umm
 * Tamim was nearly captured. Khalid roared: «الْيَوْمَ يَوْمُ الْغَيْرَة!»
 *
 * On Thabit ibn Qays's advice, Khalid ordered the famous tribal-banner
 * reorganization: «تَمَيَّزُوا!» — Muhajirun under Salim's standard,
 * Ansar under Thabit's, the Bedouin contingents apart. Thabit anointed
 * himself with hanut (the embalming-perfume of those vowing to die),
 * wrapped his shroud upon himself, and rebuked the fleers: «بِئْسَ مَا
 * عَوَّدْتُمْ أَقْرَانَكُم» (Bukhari 2845). Zayd ibn al-Khattab — Umar's
 * elder brother — raised the Muhajirun banner and exhorted: «أَيُّهَا
 * النَّاسُ، عَضُّوا عَلَى أَضْرَاسِكُم، وَاضْرِبُوا فِي عَدُوِّكُم،
 * وَامْضُوا قُدُمًا، وَاللهِ لَا أَتَكَلَّمُ حَتَّى يُهْزَمُوا أَوْ
 * أَلْقَى اللهَ فَأُكَلِّمَهُ بِحُجَّتِي.»
 *
 * The reorganized line surged. Zayd killed al-Rajjal — the believer
 * felled the apostate — and Hanafi morale snapped. Muhakkim fell during
 * the rearguard fighting; the Hanafi cavalry broke. The four named
 * Reciters were martyred holding their standards: Salim mawla Abi
 * Hudhayfa carried the Muhajirun banner until both his hands were severed,
 * then clutched it to his chest reciting ﴿وَمَا مُحَمَّدٌ إِلَّا رَسُول﴾,
 * found dead embracing his master Abu Hudhayfa ibn Utba; Zayd ibn al-Khattab
 * was killed by Abu Maryam al-Hanafi still holding the banner; Thabit ibn
 * Qays, the Khatib of the Ansar, fell in his hanut-perfume; Abu Dujana
 * Simak ibn Kharasha al-Ansari fell at the gate.
 *
 * The survivors retreated into the walled garden — حَدِيقَةُ الرَّحْمَن,
 * named for Musaylimah's claim to be «الرَّحْمَن of al-Yamamah» — and
 * sealed the single gate. al-Bara ibn Malik al-Ansari (brother of Anas,
 * Banu Najjar/Khazraj) cried: «أَرْسِلُونِي عَلَى تُرْسِكُم» (Ibn Sa'd,
 * Tabaqat 7/17; al-Bayhaqi, Dala'il). His comrades hoisted him on shields
 * raised on spears, vaulted him over the wall, and he fought through to
 * the gate alone, sustaining ~80 wounds, throwing it open from inside.
 * He survived a month of convalescence under Khalid's care.
 *
 * The Muslim army poured through. Inside the walls, retreat was impossible.
 * The orchard ran red and Hadiqat al-Rahman became Hadiqat al-Mawt — the
 * Garden of Death. Wahshi ibn Harb — the Ethiopian freedman who had
 * killed Hamza ibn Abd al-Muttalib at Uhud, now a repentant Muslim —
 * hurled his harba (the same javelin) at Musaylimah, and Abu Dujana
 * struck simultaneously with the sword. Mujja'a ibn Murara identified
 * the small sallow corpse. Wahshi's words (Bukhari 4072): «قَتَلْتُ
 * خَيْرَ النَّاسِ فِي الْجَاهِلِيَّة، وَقَتَلْتُ شَرَّ النَّاسِ فِي
 * الْإِسْلَام» — closing the Hamza wound by the very same hand and weapon.
 *
 * Casualties: ~1,200 Muslims martyred, of whom traditional sources count
 * between 360 and 700 huffaz — the largest single loss of memorizers of
 * the Qur'an in Islamic history. Banu Hanifa lost more than 21,000 between
 * the open field, the garden, and the pursuit. The aftermath in Madinah
 * was the first compilation of the Mushaf: Umar came to Abu Bakr saying
 * «إِنَّ الْقَتْلَ قَدِ اسْتَحَرَّ يَوْمَ الْيَمَامَةِ بِقُرَّاءِ الْقُرْآن»;
 * Abu Bakr at first hesitated — «كَيْفَ نَفْعَلُ شَيْئًا لَمْ يَفْعَلْهُ
 * رَسُولُ اللهِ ﷺ؟» — then Allah opened his breast to it, and he commissioned
 * Zayd ibn Thabit to gather the Qur'an into a single mushaf. From that
 * codex descend all later masahif. The Ridda Wars ended decisively, the
 * Arabian peninsula was sealed under the caliphate, and the road to Iraq
 * and Syria was opened.
 */
export const battleOfYamama: BattleScenario = {
  id: 'battle-of-yamama',
  name: 'Battle of al-Yamamah',
  nameAr: 'معركة اليمامة',
  date: '12 AH (December 632 – January 633 CE)',
  location: 'Aqraba plain, al-Yamamah, central Arabia',
  description:
    "The decisive battle of the Ridda Wars under Caliph Abu Bakr al-Siddiq. Khalid ibn al-Walid led ~13,000 Muslims against ~40,000 of Banu Hanifa under the false prophet Musaylimah al-Kadhdhab. After early Muslim setbacks — the line broken, the camp overrun, the Hanafi taunt 'O people of Surat al-Baqara, today al-Baqara has failed!' — Khalid's tribal-banner reorganization on Thabit ibn Qays's advice turned the field. The named Reciters fell holding their standards: Salim mawla Abi Hudhayfa, Zayd ibn al-Khattab, Thabit ibn Qays, Abu Hudhayfa, Abu Dujana. The survivors made their last stand inside Hadiqat al-Rahman, which al-Bara ibn Malik stormed by being hoisted on shields and dropped over the wall to fight to the gate alone. Wahshi ibn Harb killed Musaylimah with the same javelin he had once thrown at Hamza at Uhud. Roughly 1,200 Muslims fell, of whom traditional sources count 360–700 huffaz — the loss that prompted Abu Bakr's first compilation of the Qur'an into a single mushaf.",
  descriptionAr:
    'الْمَعْرَكَةُ الْفَاصِلَةُ مِنْ حُرُوبِ الرِّدَّةِ فِي خِلَافَةِ أَبِي بَكْرٍ الصِّدِّيقِ رَضِيَ اللهُ عَنْه. قَادَ خَالِدُ بْنُ الْوَلِيدِ نَحْوَ ثَلَاثَةَ عَشَرَ أَلْفًا مِنَ الْمُسْلِمِينَ فِي مُوَاجَهَةِ قُرَابَةِ أَرْبَعِينَ أَلْفًا مِنْ بَنِي حَنِيفَةَ بِقِيَادَةِ مُسَيْلِمَةَ الْكَذَّاب. اِنْكَسَرَ الصَّفُّ الْأَوَّل، وَبَلَغَ الْعَدُوُّ خِيَامَ النِّسَاء، وَتَنَادَى بَنُو حَنِيفَةَ سَاخِرِينَ: «يَا أَهْلَ سُورَةِ الْبَقَرَةِ، بَطَلَتِ الْبَقَرَةُ الْيَوْم!» فَأَمَرَ خَالِدٌ بِنَصِيحَةِ ثَابِتِ بْنِ قَيْسٍ بِتَنْظِيمِ الْقَبَائِلِ تَحْتَ رَايَاتِهَا — الْمُهَاجِرُونَ تَحْتَ رَايَةِ سَالِمٍ، وَالْأَنْصَارُ تَحْتَ رَايَةِ ثَابِتٍ — فَتَحَوَّلَتِ الْكِفَّة. اِسْتُشْهِدَ الْقُرَّاءُ الْأَرْبَعَة، وَلَجَأَ مَنْ بَقِيَ مِنْ بَنِي حَنِيفَةَ إِلَى حَدِيقَةِ الرَّحْمَنِ الْمَسْوُورَة. اِقْتَحَمَهَا الْبَرَاءُ بْنُ مَالِكٍ بَعْدَ أَنْ حُمِلَ عَلَى التُّرُسِ وَقُذِفَ مِنْ فَوْقِ الْجِدَار، فَفَتَحَ الْبَابَ مِنْ دَاخِلِه. وَقَتَلَ وَحْشِيُّ بْنُ حَرْبٍ مُسَيْلِمَةَ بِالْحَرْبَةِ ذَاتِهَا الَّتِي قَتَلَ بِهَا حَمْزَةَ يَوْمَ أُحُد. اِسْتُشْهِدَ قُرَابَةَ أَلْفٍ وَمِئَتَيْ مُسْلِم، مِنْهُمْ مَا بَيْنَ ثَلَاثِمِئَةٍ وَسِتِّينَ وَسَبْعِمِئَةٍ مِنْ حُفَّاظِ كِتَابِ الله — وَكَانَ ذَلِكَ السَّبَبَ فِي جَمْعِ الْمُصْحَفِ عَلَى عَهْدِ الصِّدِّيق.',

  dayPhase: 'day',
  weather: 'dust',
  actualDayCount: 2,

  map: {
    width: 1500,
    height: 1000,
    terrain: [
      // Main field — the open Aqraba plain (sahl Aqraba)
      {
        id: 'aqraba-plain',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 1500, y: 0 },
          { x: 1500, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0xb89968,
        label: 'سهل عقرباء',
      },
      // The Najd uplands form the northern horizon of al-Yamamah —
      // jagged dark sandstone ridges visible during the battle
      {
        id: 'najd-mountains',
        type: 'mountain',
        polygon: [
          { x: 0, y: 0 },
          { x: 1500, y: 0 },
          { x: 1500, y: 90 },
          { x: 0, y: 90 },
        ],
        color: 0x3c2a1a,
        label: 'جبال نجد',
      },
      // Low rolling hills bordering the south of the plain
      {
        id: 'southern-hills',
        type: 'elevated',
        polygon: [
          { x: 0, y: 920 },
          { x: 1500, y: 920 },
          { x: 1500, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x6b5a4a,
      },
      // Shu'ayb al-Dam — the Gully of Blood, drainage gully cutting
      // the center-east of the plain where blood ran in a rivulet
      // during the open-field phase (named in classical sources)
      {
        id: 'shu-ayb-al-dam',
        type: 'gorge',
        polygon: [
          { x: 720, y: 470 },
          { x: 1020, y: 470 },
          { x: 1020, y: 540 },
          { x: 720, y: 540 },
        ],
        color: 0x5a3220,
        label: 'شعيب الدم',
      },
      // Palm groves to the north and south of the garden
      {
        id: 'north-palms',
        type: 'oasis',
        polygon: [
          { x: 950, y: 110 },
          { x: 1450, y: 110 },
          { x: 1450, y: 290 },
          { x: 950, y: 290 },
        ],
        color: 0x3a5a2a,
        label: 'بساتين النخل',
      },
      {
        id: 'south-palms',
        type: 'oasis',
        polygon: [
          { x: 950, y: 720 },
          { x: 1450, y: 720 },
          { x: 1450, y: 900 },
          { x: 950, y: 900 },
        ],
        color: 0x3a5a2a,
      },
      // The Garden of Death — walled enclosure on the east side.
      // Pre-battle name: حديقة الرحمن (Musaylimah claimed to be
      // 'al-Rahman of al-Yamamah'). After: حديقة الموت.
      // Rendered as fortress_wall terrain.
      {
        id: 'garden-of-death',
        type: 'fortress_wall',
        polygon: [
          { x: 1050, y: 320 },
          { x: 1430, y: 320 },
          { x: 1430, y: 700 },
          { x: 1050, y: 700 },
        ],
        color: 0x6b6359,
        label: 'حديقة الموت',
      },
      // Muslim camp — west side (Medina-facing, Khalid approached from Buta)
      {
        id: 'muslim-camp',
        type: 'flat',
        polygon: [
          { x: 0, y: 350 },
          { x: 180, y: 350 },
          { x: 180, y: 650 },
          { x: 0, y: 650 },
        ],
        color: 0x8c6f3f,
      },
      // Banu Hanifa main encampment — center-east, in front of the garden
      {
        id: 'hanifa-camp',
        type: 'flat',
        polygon: [
          { x: 800, y: 400 },
          { x: 1000, y: 400 },
          { x: 1000, y: 600 },
          { x: 800, y: 600 },
        ],
        color: 0x6f4f2a,
      },
    ],
    landmarks: [
      {
        id: 'khalid-command',
        position: { x: 90, y: 500 },
        type: 'camp',
        label: "Khalid's Command",
        labelAr: 'قيادة خالد بن الوليد',
      },
      {
        id: 'aqraba-marker',
        position: { x: 600, y: 60 },
        type: 'marker',
        label: 'Aqraba Plain',
        labelAr: 'سهل عقرباء',
      },
      {
        id: 'najd-ridges',
        position: { x: 900, y: 30 },
        type: 'mountain_pass',
        label: 'Najd Ridges',
        labelAr: 'جبال نجد',
      },
      {
        id: 'shu-ayb-al-dam-marker',
        position: { x: 870, y: 510 },
        type: 'marker',
        label: 'Gully of Blood',
        labelAr: 'شعيب الدم',
      },
      {
        id: 'hanifa-camp-marker',
        position: { x: 900, y: 500 },
        type: 'camp',
        label: 'Banu Hanifa Camp',
        labelAr: 'معسكر بني حنيفة',
      },
      {
        id: 'reciters-fall',
        position: { x: 720, y: 460 },
        type: 'marker',
        label: 'Where the Reciters Fell',
        labelAr: 'مصارع القراء',
      },
      {
        id: 'garden-gate',
        position: { x: 1050, y: 510 },
        type: 'marker',
        label: 'Gate of the Garden',
        labelAr: 'باب الحديقة',
      },
      {
        id: 'baraa-wall-point',
        position: { x: 1240, y: 320 },
        type: 'marker',
        label: "al-Bara's Leap",
        labelAr: 'موضع اقتحام البراء',
      },
      {
        id: 'musaylimah-spot',
        position: { x: 1320, y: 510 },
        type: 'marker',
        label: 'Musaylimah Killed',
        labelAr: 'مصرع مسيلمة',
      },
    ],
    backgroundColor: 0x3a2c1a,
  },

  forces: [
    // ─── Muslim Forces (~13,000) ─────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 13000,
      units: [
        {
          // Khalid himself with the elite cavalry — the wedge that
          // drove into Muhakkim's line during the counter-attack
          id: 'khalid-vanguard',
          name: "Khalid's Vanguard",
          nameAr: 'كتيبة خالد بن الوليد',
          troopType: 'heavy_cavalry',
          soldierCount: 1500,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 280, y: 500 },
          startFormation: 'wedge',
          startFacing: 0, // east toward Banu Hanifa
          stats: { attack: 10, defense: 8, speed: 9, morale: 10 },
        },
        {
          // The Muhajirun under Salim's banner. Salim mawla Abi Hudhayfa
          // is one of the four named in Sahih al-Bukhari 4999 from whom
          // to take the Qur'an. He fell with the banner, found dead
          // embracing his master Abu Hudhayfa ibn Utba.
          id: 'muhajirun',
          name: 'Muhajirun',
          nameAr: 'كتيبة المهاجرين',
          troopType: 'infantry',
          soldierCount: 2400,
          commander: 'Salim mawla Abi Hudhayfa',
          startPosition: { x: 250, y: 380 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // The Ansar under Thabit ibn Qays — Khatib of the Ansar.
          // He advised the tribal reorganization, perfumed himself
          // with hanut (the embalming-perfume of those vowing to die),
          // and rebuked the fleers with «بِئْسَ مَا عَوَّدْتُمْ
          // أَقْرَانَكُم» (Bukhari 2845).
          id: 'ansar',
          name: 'Ansar',
          nameAr: 'كتيبة الأنصار',
          troopType: 'infantry',
          soldierCount: 2900,
          commander: 'Thabit ibn Qays',
          startPosition: { x: 250, y: 620 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // The Bedouin tribal contingents — wavered during the first
          // Hanafi shock-charge, prompting the tribal reorganization.
          // Sidelined for the decisive engagement, rallied for the pursuit.
          id: 'bedouin-allies',
          name: 'Bedouin Tribes',
          nameAr: 'كتيبة قبائل الأعراب',
          troopType: 'cavalry',
          soldierCount: 2000,
          commander: undefined,
          startPosition: { x: 220, y: 500 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 7, defense: 6, speed: 8, morale: 7 },
        },
        {
          // al-Bara ibn Malik al-Ansari (brother of Anas, Banu
          // Najjar/Khazraj) — led the storming of the gate of Hadiqat
          // al-Mawt, hoisted on shields and dropped over the wall to
          // fight to the gate alone. Survived ~80 wounds and a month
          // of convalescence under Khalid.
          id: 'baraa-company',
          name: "al-Bara ibn Malik's Company",
          nameAr: 'كتيبة البراء بن مالك',
          troopType: 'infantry',
          soldierCount: 1500,
          commander: 'al-Bara ibn Malik',
          startPosition: { x: 320, y: 440 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 7, speed: 6, morale: 10 },
        },
        {
          // Zayd ibn al-Khattab — Umar's elder brother. Held the
          // Muhajirun standard and exhorted: «أَيُّهَا النَّاسُ، عَضُّوا
          // عَلَى أَضْرَاسِكُم...». Killed by Abu Maryam al-Hanafi while
          // holding the banner. Umar later said: «سَبَقَنِي إِلَى
          // الْحُسْنَيَيْنِ — الْإِسْلَامِ وَالشَّهَادَة.»
          id: 'muslim-reserve',
          name: "Zayd ibn al-Khattab's Company",
          nameAr: 'كتيبة زيد بن الخطاب',
          troopType: 'reserves',
          soldierCount: 2200,
          commander: 'Zayd ibn al-Khattab',
          startPosition: { x: 130, y: 500 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
        {
          // Abu Dujana Simak ibn Kharasha al-Ansari — the swordsman who
          // fought beside Wahshi to finish Musaylimah (the Ansari finisher
          // named in tradition; Bukhari leaves him unnamed). He fell at
          // Yamama, completing the symmetry with Uhud.
          id: 'abu-dujana',
          name: "Abu Dujana al-Ansari",
          nameAr: 'كتيبة أبي دجانة الأنصاري',
          troopType: 'infantry',
          soldierCount: 450,
          commander: 'Abu Dujana al-Ansari',
          startPosition: { x: 290, y: 560 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 7, speed: 6, morale: 10 },
        },
        {
          // Wahshi ibn Harb — the Ethiopian freedman who killed Hamza
          // at Uhud, now a Muslim. Threw the same harba (short spear)
          // at Musaylimah inside the garden. Bukhari 4072 preserves
          // his self-narration framing it as expiation. Tiny unit so
          // the renderer reads him as a single distinct figure.
          id: 'wahshi',
          name: 'Wahshi ibn Harb',
          nameAr: 'كتيبة وحشي بن حرب',
          troopType: 'infantry',
          soldierCount: 50,
          commander: 'Wahshi ibn Harb',
          startPosition: { x: 380, y: 520 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 10, defense: 5, speed: 7, morale: 10 },
        },
      ],
    },

    // ─── Banu Hanifa (~40,000 under Musaylimah) ──────────────────────────
    {
      faction: 'banu_hanifa',
      label: 'Banu Hanifa',
      labelAr: 'بنو حنيفة',
      totalStrength: 40000,
      units: [
        {
          // Muhakkim ibn al-Tufayl ('Muhakkim al-Yamama') — commanded
          // the Hanafi cavalry wing. The strike force that broke the
          // Muslim front in Phase 1. Killed during the rearguard
          // fighting of the retreat to the garden; his fall triggered
          // the rout.
          id: 'muhakkim-cavalry',
          name: "Muhakkim's Cavalry",
          nameAr: 'كتيبة محكّم بن الطفيل',
          troopType: 'heavy_cavalry',
          soldierCount: 5000,
          commander: 'Muhakkim ibn al-Tufayl',
          startPosition: { x: 880, y: 400 },
          startFormation: 'wedge',
          startFacing: Math.PI, // west toward Muslims
          stats: { attack: 9, defense: 7, speed: 8, morale: 9 },
        },
        {
          // al-Rajjal ibn Unfuwa — the apostate former Companion sent
          // by Madinah to teach Banu Hanifa the Qur'an, who instead
          // defected and falsely testified that the Prophet ﷺ named
          // Musaylimah co-prophet. Killed by Zayd ibn al-Khattab; his
          // death is the moral collapse-point of Hanafi morale.
          id: 'al-rajjal',
          name: 'al-Rajjal ibn Unfuwa',
          nameAr: 'كتيبة نهار الرجّال بن عُنفُوة',
          troopType: 'infantry',
          soldierCount: 3000,
          commander: 'Nahar al-Rajjal ibn Unfuwa',
          startPosition: { x: 850, y: 540 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 7, speed: 5, morale: 8 },
        },
        {
          // The mass infantry center of Banu Hanifa. Their first charge
          // under al-Rajjal and Muhakkim drove the Muslims back through
          // their own camp, prompting the Hanafi taunt.
          id: 'hanifa-center',
          name: 'Banu Hanifa Center',
          nameAr: 'قلب بني حنيفة',
          troopType: 'infantry',
          soldierCount: 12000,
          commander: undefined,
          startPosition: { x: 920, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 7, speed: 5, morale: 8 },
        },
        {
          id: 'hanifa-right',
          name: 'Banu Hanifa Right',
          nameAr: 'ميمنة بني حنيفة',
          troopType: 'infantry',
          soldierCount: 7000,
          commander: undefined,
          startPosition: { x: 920, y: 320 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 8 },
        },
        {
          id: 'hanifa-left',
          name: 'Banu Hanifa Left',
          nameAr: 'ميسرة بني حنيفة',
          troopType: 'infantry',
          soldierCount: 7000,
          commander: undefined,
          startPosition: { x: 920, y: 680 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 8 },
        },
        {
          // Garden defenders — sit inside the walls from t=0,
          // engage only during the assault phases. Traditional sources
          // give ~7,000 killed inside Hadiqat al-Mawt.
          id: 'garden-defenders',
          name: 'Garden Defenders',
          nameAr: 'كتيبة حُماة الحديقة',
          troopType: 'infantry',
          soldierCount: 4500,
          commander: undefined,
          startPosition: { x: 1240, y: 510 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 9, speed: 4, morale: 8 },
        },
        {
          // Mujja'a ibn Murara — the Hanifa elder who survived as
          // chief negotiator with Khalid after the battle, famously
          // inflating the garrison's apparent strength to secure
          // favorable surrender terms. Captured during the rout;
          // identified Musaylimah's small sallow corpse.
          id: 'mujjaa',
          name: "Mujja'a ibn Murara",
          nameAr: 'كتيبة مُجَّاعة بن مُرارة',
          troopType: 'infantry',
          soldierCount: 1000,
          commander: "Mujja'a ibn Murara",
          startPosition: { x: 1100, y: 600 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 8 },
        },
        {
          // Musaylimah and his personal guard. Took refuge inside
          // Hadiqat al-Mawt. Mujja'a identified his small sallow
          // corpse after the slaughter.
          id: 'musaylimah-guard',
          name: "Musaylimah's Guard",
          nameAr: 'كتيبة حرس مسيلمة',
          troopType: 'heavy_cavalry',
          soldierCount: 1500,
          commander: 'Musaylimah ibn Habib al-Kadhdhab',
          startPosition: { x: 1340, y: 510 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 6, morale: 8 },
        },
      ],
    },
  ],

  phases: [
    // Phase 1 (0–4s): Opening Deployment. Khalid's army draws up on
    // the Aqraba plain. Banu Hanifa massed in front of Hadiqat al-Rahman.
    {
      id: 'opening-deployment',
      name: 'Deployment on Aqraba',
      nameAr: 'الاصطفاف على عقرباء',
      startTime: 0,
      duration: 4,
      description:
        "Khalid's army (Muhajirun under Salim, Ansar under Thabit, Bedouin contingents, ~13,000 total) draws up on the Aqraba plain. Banu Hanifa massed in front of Hadiqat al-Rahman. Wide reveal: dust over Aqraba, the dark Najd ridges, the walled garden glinting on the eastern horizon.",
      actions: [
        { type: 'camera_move', params: { x: 700, y: 500, zoom: 0.42, duration: 3 }, delay: 0 },
      ],
      triggers: [],
    },

    // Phase 2 (4–12s): The Hanafi Shock-Charge. Muhakkim and al-Rajjal
    // launch the wedge that breaks the mixed Muslim line. The taunt
    // rings out: "ya ashab Surat al-Baqara, batalat al-Baqara al-yawm!"
    {
      id: 'hanifa-shock-charge',
      name: 'The Hanafi Shock-Charge',
      nameAr: 'صدمة بني حنيفة',
      startTime: 4,
      duration: 8,
      description:
        "The Hanafi line under Muhakkim ibn al-Tufayl and al-Rajjal ibn Unfuwa launches a ferocious shock-charge that breaks the initially mixed Muslim line. The Hanafi taunt rings out: 'O people of Surat al-Baqara — today al-Baqara has failed!' The Bedouin allies waver.",
      actions: [
        { type: 'camera_move', params: { x: 700, y: 480, zoom: 0.6, duration: 2 }, delay: 0 },
        // Banu Hanifa surges forward
        { type: 'move_unit', targetUnitId: 'muhakkim-cavalry', params: { position: { x: 500, y: 460 }, speed: 110 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'hanifa-center', params: { position: { x: 600, y: 500 }, speed: 75 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hanifa-right', params: { position: { x: 600, y: 360 }, speed: 70 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hanifa-left', params: { position: { x: 600, y: 640 }, speed: 70 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'al-rajjal', params: { position: { x: 560, y: 540 }, speed: 80 }, delay: 1 },
        // Engagements: cavalry shatters the Bedouin allies; infantry hits the line
        { type: 'attack_unit', targetUnitId: 'muhakkim-cavalry', params: { targetId: 'bedouin-allies' }, delay: 4 },
        { type: 'attack_unit', targetUnitId: 'hanifa-center', params: { targetId: 'muhajirun' }, delay: 5 },
        { type: 'attack_unit', targetUnitId: 'hanifa-right', params: { targetId: 'ansar' }, delay: 5 },
        { type: 'attack_unit', targetUnitId: 'al-rajjal', params: { targetId: 'muslim-reserve' }, delay: 5 },
        { type: 'attack_unit', targetUnitId: 'hanifa-left', params: { targetId: 'ansar' }, delay: 5.5 },
      ],
      triggers: [],
    },

    // Phase 3 (12–17s): Camp Overrun. Hanafi units break through
    // and reach the women's tents. Khalid cries: "al-yawma yawm
    // al-ghayrah!"
    {
      id: 'camp-overrun',
      name: 'The Camp Overrun',
      nameAr: 'اقتحام المعسكر',
      startTime: 12,
      duration: 5,
      description:
        "Hanafi units break through and reach the women's tents. Khalid's wife Umm Tamim is nearly captured. Bedouin allies break and run. Khalid roars: 'al-yawma yawm al-ghayrah!' (Today is the day of jealous honour) — Tabari preserves the verbatim phrase.",
      actions: [
        { type: 'camera_move', params: { x: 450, y: 500, zoom: 0.55, duration: 1.5 }, delay: 0 },
        // Bedouin allies break — fall back to the camp
        { type: 'set_behavior', targetUnitId: 'bedouin-allies', params: { behavior: 'retreating' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'bedouin-allies', params: { position: { x: 100, y: 480 }, speed: 130 }, delay: 0 },
        // Muhakkim presses
        { type: 'move_unit', targetUnitId: 'muhakkim-cavalry', params: { position: { x: 350, y: 480 }, speed: 100 }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'muhakkim-cavalry', params: { targetId: 'muslim-reserve' }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 4 (17–24s): Tribal-Banner Reorganization. On Thabit ibn
    // Qays's advice Khalid orders «تَمَيَّزُوا!» — each tribe under
    // its own banner. Thabit perfumes himself with hanut.
    {
      id: 'tribal-reorganization',
      name: "Khalid's Tribal Reorganization",
      nameAr: 'تميَّزوا — تنظيم الرايات',
      startTime: 17,
      duration: 7,
      description:
        "On Thabit ibn Qays's advice Khalid orders the tribal reorganization: Muhajirun under Salim's banner, Ansar under Thabit's, Bedouin sidelined. Thabit perfumes himself with hanut and rebukes the fleers: 'bi'sa ma awwadtum aqranakum' (Bukhari 2845).",
      actions: [
        { type: 'camera_move', params: { x: 320, y: 500, zoom: 0.7, duration: 2 }, delay: 0 },
        // Khalid rides forward
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 380, y: 500 }, speed: 110 }, delay: 1 },
        // Muhajirun realign in tighter line under Salim's banner
        { type: 'change_formation', targetUnitId: 'muhajirun', params: { formation: 'line' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 360, y: 380 }, speed: 60 }, delay: 1.5 },
        // Ansar reform under Thabit's banner
        { type: 'change_formation', targetUnitId: 'ansar', params: { formation: 'line' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 360, y: 620 }, speed: 60 }, delay: 1.5 },
        // al-Bara's company forward
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 420, y: 480 }, speed: 80 }, delay: 3 },
        // Bedouin allies rally back to a flank position
        { type: 'set_behavior', targetUnitId: 'bedouin-allies', params: { behavior: 'advancing' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'bedouin-allies', params: { position: { x: 300, y: 540 }, speed: 90 }, delay: 2.5 },
        // Abu Dujana joins the Ansar wing
        { type: 'move_unit', targetUnitId: 'abu-dujana', params: { position: { x: 360, y: 580 }, speed: 70 }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 5 (24–33s): The Reciters' Counter-Charge. Three banners
    // surge forward. Khalid drives his wedge into Muhakkim. Zayd
    // exhorts the Muhajirun.
    {
      id: 'reciters-counter-charge',
      name: "The Reciters' Counter-Charge",
      nameAr: 'حملة القراء',
      startTime: 24,
      duration: 9,
      description:
        "The reorganized line — banners flying, men beside their kin — surges forward. Salim mawla Abi Hudhayfa carries the Muhajirun standard. Zayd ibn al-Khattab exhorts: 'O people, bite down on your molars, strike your enemy, press forward; by Allah I shall not speak until they are routed or I meet Allah and speak my plea.' Khalid drives his wedge into Muhakkim's cavalry.",
      actions: [
        { type: 'camera_move', params: { x: 600, y: 500, zoom: 0.45, duration: 2.5 }, delay: 0 },
        // Charges
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 580, y: 470 }, speed: 130 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 560, y: 400 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 560, y: 600 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 620, y: 480 }, speed: 90 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-reserve', params: { position: { x: 520, y: 500 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'abu-dujana', params: { position: { x: 560, y: 570 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'bedouin-allies', params: { position: { x: 580, y: 530 }, speed: 95 }, delay: 1 },
        // Engagements
        { type: 'attack_unit', targetUnitId: 'khalid-vanguard', params: { targetId: 'muhakkim-cavalry' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'muhajirun', params: { targetId: 'hanifa-right' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'ansar', params: { targetId: 'hanifa-left' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'baraa-company', params: { targetId: 'hanifa-center' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'muslim-reserve', params: { targetId: 'al-rajjal' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 6 (33–37s): Fall of al-Rajjal. Zayd kills the apostate.
    // Hanafi morale buckles. Then Zayd himself falls, banner held high.
    {
      id: 'fall-of-al-rajjal',
      name: 'The Fall of al-Rajjal',
      nameAr: 'مصرع الرجّال بن عُنفُوة',
      startTime: 33,
      duration: 4,
      description:
        "Zayd ibn al-Khattab kills al-Rajjal ibn Unfuwa — the apostate ex-Companion who legitimized Musaylimah. Hanafi morale buckles. Zayd then falls himself, killed by Abu Maryam al-Hanafi while still holding the banner. The standard does not fall — Salim catches it.",
      actions: [
        { type: 'camera_move', params: { x: 560, y: 520, zoom: 0.95, duration: 1.3 }, delay: 0 },
        { type: 'attack_unit', targetUnitId: 'muslim-reserve', params: { targetId: 'al-rajjal' }, delay: 0.5 },
        { type: 'destroy_unit', targetUnitId: 'al-rajjal', params: {}, delay: 1.5 },
      ],
      triggers: [],
    },

    // Phase 7 (37–42s): The Fall of Muhakkim. Hanafi cavalry breaks.
    // Infantry begins streaming east toward the garden gate.
    {
      id: 'muhakkim-falls',
      name: 'The Fall of Muhakkim',
      nameAr: 'مصرع محكّم اليمامة',
      startTime: 37,
      duration: 5,
      description:
        "Muhakkim ibn al-Tufayl falls during the rearguard fighting as he tries to cover the Hanafi withdrawal. The Hanafi cavalry breaks. Infantry begins streaming east toward the garden gate.",
      actions: [
        { type: 'camera_move', params: { x: 580, y: 470, zoom: 0.85, duration: 1.5 }, delay: 0 },
        // Muhakkim's cavalry destroyed
        { type: 'destroy_unit', targetUnitId: 'muhakkim-cavalry', params: {}, delay: 1.5 },
        // Hanifa starts retreating to the garden
        { type: 'set_behavior', targetUnitId: 'hanifa-center', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'hanifa-right', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'hanifa-left', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'hanifa-center', params: { position: { x: 1100, y: 510 }, speed: 110 }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'hanifa-right', params: { position: { x: 1100, y: 380 }, speed: 110 }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'hanifa-left', params: { position: { x: 1100, y: 640 }, speed: 110 }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 8 (42–48s): Martyrdom of the Reciters. Salim holds the
    // Muhajirun banner until both his hands are severed; he clutches
    // it to his chest reciting Q3:144 and dies. Found embracing Abu
    // Hudhayfa. Hundreds of huffaz are martyred.
    {
      id: 'martyrdom-of-the-reciters',
      name: 'Martyrdom of the Reciters',
      nameAr: 'استشهاد القراء',
      startTime: 42,
      duration: 6,
      description:
        "During the rout's pursuit, the standard-bearers fall. Salim mawla Abi Hudhayfa holds the Muhajirun banner until both his hands are severed; he clutches it to his chest reciting Q3:144 'wa ma Muhammadun illa rasul' and dies. Found embracing his master Abu Hudhayfa ibn Utba. Hundreds of huffaz are martyred. Total Muslim losses ~1,200, of whom traditional sources count 360–700 huffaz.",
      actions: [
        { type: 'camera_move', params: { x: 700, y: 460, zoom: 0.9, duration: 2 }, delay: 0 },
      ],
      triggers: [],
    },

    // Phase 9 (48–53s): Retreat to the Garden. Hanifa survivors pour
    // through the single gate. The gate slams shut.
    {
      id: 'retreat-to-garden',
      name: 'Retreat to the Garden',
      nameAr: 'الفرار إلى الحديقة',
      startTime: 48,
      duration: 5,
      description:
        "Banu Hanifa survivors pour through the single gate of Hadiqat al-Rahman. The gate slams shut behind the last man. The walls are too high to climb directly. Muslims surround the garden but cannot enter.",
      actions: [
        { type: 'camera_move', params: { x: 1080, y: 510, zoom: 0.55, duration: 2.5 }, delay: 0 },
        // Hanifa units enter the garden
        { type: 'move_unit', targetUnitId: 'hanifa-center', params: { position: { x: 1240, y: 510 }, speed: 130 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'hanifa-right', params: { position: { x: 1200, y: 400 }, speed: 130 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'hanifa-left', params: { position: { x: 1200, y: 620 }, speed: 130 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'mujjaa', params: { position: { x: 1220, y: 600 }, speed: 110 }, delay: 0 },
        // Muslims reach the wall
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 980, y: 380 }, speed: 90 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 980, y: 620 }, speed: 90 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 1010, y: 470 }, speed: 95 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 940, y: 510 }, speed: 110 }, delay: 1 },
      ],
      triggers: [],
    },

    // Phase 10 (53–60s): al-Bara's Shield-Toss. He calls «أَرْسِلُونِي
    // عَلَى تُرْسِكُم». Hoisted on shields, vaulted over the wall,
    // fights through to the gate, throws it open.
    {
      id: 'baraas-wall',
      name: "al-Bara's Shield-Toss",
      nameAr: 'اقتحام البراء بن مالك',
      startTime: 53,
      duration: 7,
      description:
        "al-Bara ibn Malik says: 'irfa'uni ala al-turus wa-alquni fi al-hadiqa' (Ibn Sa'd, Tabaqat 7/17). His comrades hoist him on shields raised on spears, drop him over the wall. He fights through to the gate alone, sustains ~80 wounds, throws the gate open from inside. Muslims pour through. He survives a month of convalescence under Khalid's care.",
      actions: [
        { type: 'camera_move', params: { x: 1230, y: 380, zoom: 1.5, duration: 1.5 }, delay: 0 },
        // al-Bara is hoisted and vaulted
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 1240, y: 360 }, speed: 130 }, delay: 0 },
        { type: 'attack_unit', targetUnitId: 'baraa-company', params: { targetId: 'garden-defenders' }, delay: 2 },
        // Gate opens — pan to gate
        { type: 'camera_move', params: { x: 1100, y: 510, zoom: 0.85, duration: 1.5 }, delay: 3 },
        // Muslim units pour into the garden
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 1180, y: 510 }, speed: 140 }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 1180, y: 420 }, speed: 100 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 1180, y: 600 }, speed: 100 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'wahshi', params: { position: { x: 1240, y: 480 }, speed: 100 }, delay: 4.5 },
        { type: 'move_unit', targetUnitId: 'abu-dujana', params: { position: { x: 1220, y: 540 }, speed: 100 }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 11 (60–64s): Hadiqat al-Mawt. Inside the walls, retreat
    // is impossible. The orchard runs red. Hadiqat al-Rahman becomes
    // Hadiqat al-Mawt.
    {
      id: 'garden-of-death',
      name: 'The Garden of Death',
      nameAr: 'حديقة الموت',
      startTime: 60,
      duration: 4,
      description:
        "Inside the walls, retreat is impossible. The Muslims and the ~7,000 Hanafi defenders fight at sword-point in cramped space. The garden runs red. Banu Hanifa's military power is permanently broken. The orchard, once Hadiqat al-Rahman, is renamed Hadiqat al-Mawt — the Garden of Death.",
      actions: [
        { type: 'camera_move', params: { x: 1240, y: 510, zoom: 0.65, duration: 2 }, delay: 0 },
        // Engagements inside the garden
        { type: 'attack_unit', targetUnitId: 'khalid-vanguard', params: { targetId: 'garden-defenders' }, delay: 0.5 },
        { type: 'attack_unit', targetUnitId: 'muhajirun', params: { targetId: 'hanifa-right' }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'ansar', params: { targetId: 'hanifa-left' }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'baraa-company', params: { targetId: 'hanifa-center' }, delay: 1 },
      ],
      triggers: [],
    },

    // Phase 12 (64–68s): Wahshi and the Javelin. The same harba that
    // killed Hamza at Uhud strikes Musaylimah. Abu Dujana finishes
    // him. Mujja'a identifies the corpse. The Mushaf is foreshadowed.
    {
      id: 'wahshi-and-the-javelin',
      name: 'Wahshi and the Javelin',
      nameAr: 'وحشيٌّ والحربة',
      startTime: 64,
      duration: 4,
      description:
        "Wahshi ibn Harb — the Ethiopian who killed Hamza at Uhud — hurls his harba (the same short spear) at Musaylimah. An Ansari (Abu Dujana in tradition; unnamed in Bukhari) strikes simultaneously with the sword. Mujja'a identifies the small sallow corpse. Wahshi narrates in Bukhari 4072 framed as expiation. Banu Hanifa surrender; the Mushaf is commissioned in Madinah; the Ridda Wars are decided.",
      actions: [
        { type: 'camera_move', params: { x: 1320, y: 510, zoom: 0.92, duration: 1 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'wahshi', params: { position: { x: 1310, y: 510 }, speed: 120 }, delay: 0.2 },
        { type: 'attack_unit', targetUnitId: 'wahshi', params: { targetId: 'musaylimah-guard' }, delay: 0.8 },
        { type: 'attack_unit', targetUnitId: 'abu-dujana', params: { targetId: 'musaylimah-guard' }, delay: 1.0 },
        // Musaylimah's guard falls
        { type: 'destroy_unit', targetUnitId: 'musaylimah-guard', params: {}, delay: 2 },
        // Pull back for the aftermath
        { type: 'camera_move', params: { x: 900, y: 500, zoom: 0.4, duration: 1.5 }, delay: 2.5 },
      ],
      triggers: [],
    },
  ],

  narration: [
    {
      id: 'opening',
      time: 0.5,
      duration: 5,
      text: 'The Battle of al-Yamama — late 11–12 AH, in the caliphate of Abu Bakr al-Siddiq. On the plain of Aqraba, Khalid ibn al-Walid meets Banu Hanifa under Musaylimah the Liar — thirteen thousand against forty.',
      textAr:
        'مَعْرَكَةُ الْيَمَامَة — أَوَاخِرُ الْحَادِيَةِ عَشْرَةَ مِنَ الْهِجْرَة، فِي خِلَافَةِ أَبِي بَكْرٍ الصِّدِّيقِ رَضِيَ اللهُ عَنْه. عَلَى سَهْلِ عَقْرَبَاءَ يَلْتَقِي خَالِدُ بْنُ الْوَلِيدِ بِثَلَاثَةَ عَشَرَ أَلْفًا، وَمُسَيْلِمَةُ الْكَذَّابُ بِأَرْبَعِينَ أَلْفًا مِنْ بَنِي حَنِيفَة.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'first-shock',
      time: 6,
      duration: 5,
      text: "Muhakkim al-Yamama charges with his cavalry; al-Rajjal ibn Unfuwa, the apostate Companion, drives forward. Banu Hanifa taunt the Muslims: 'O people of Surat al-Baqara — today al-Baqara has failed!' The Muslim line trembles.",
      textAr:
        'يَحْمِلُ مُحَكَّمُ الْيَمَامَةِ بِفُرْسَانِهِ، وَيَنْدَفِعُ الرَّجَّالُ بْنُ عُنْفُوَةَ — الْمُرْتَدُّ مِنَ الصَّحَابَة — وَيَتَنَادَى بَنُو حَنِيفَةَ سَاخِرِينَ: «يَا أَهْلَ سُورَةِ الْبَقَرَةِ، بَطَلَتِ الْبَقَرَةُ الْيَوْم!» يَتَزَعْزَعُ صَفُّ الْمُسْلِمِينَ.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'camp-overrun',
      time: 12.5,
      duration: 4,
      text: "Banu Hanifa reach the women's tents — the camp itself is in danger. Khalid roars to his men: 'Today is the day of jealous honour — today reputations are defended!'",
      textAr:
        'يَبْلُغُ بَنُو حَنِيفَةَ خِيَامَ النِّسَاء! يَكَادُ مُعَسْكَرُ الْمُسْلِمِينَ يَسْقُط. وَيَصِيحُ خَالِدٌ فِي جُنْدِهِ: «الْيَوْمَ يَوْمُ الْغَيْرَة، الْيَوْمَ تُذَبُّ الْأَحْسَاب!»',
      position: 'top',
      style: 'dramatic',
    },
    {
      id: 'thabit-hanut',
      time: 17.5,
      duration: 5,
      text: "Thabit ibn Qays anoints himself with hanut — the perfume of the dying — wraps his shroud upon himself, and rebukes the fleeing men: 'What an evil habit you have taught your foes!'",
      textAr:
        'يَتَحَنَّطُ ثَابِتُ بْنُ قَيْسٍ بِالطِّيبِ — طِيبِ الْمَوْت — وَيَكْفُرُ نَفْسَهُ بِكَفَنِه، وَيَزْأَرُ فِي الْفَارِّين: «بِئْسَ مَا عَوَّدْتُمْ أَقْرَانَكُم!»',
      position: 'top',
      style: 'quote',
    },
    {
      id: 'reorganization',
      time: 22.5,
      duration: 5,
      text: "Khalid rides among the men shouting: 'Distinguish yourselves! Let each tribe fight under its own banner!' The Muhajirun rally under Salim's standard, the Ansar under Thabit's, the Bedouin contingents stand apart.",
      textAr:
        'يَجُولُ خَالِدٌ بَيْنَ النَّاسِ صَائِحًا: «تَمَيَّزُوا! لِيُقَاتِلْ كُلُّ قَوْمٍ تَحْتَ رَايَتِهِم.» فَتَتَمَيَّزُ الْمُهَاجِرُونَ تَحْتَ رَايَةِ سَالِمٍ، وَالْأَنْصَارُ تَحْتَ رَايَةِ ثَابِتٍ، وَيَنْحَازُ الْأَعْرَابُ.',
      position: 'top',
      style: 'normal',
    },
    {
      id: 'zayd-exhorts',
      time: 28,
      duration: 5,
      text: "Zayd ibn al-Khattab — Umar's elder brother — raises the Muhajirun banner and cries: 'O people! Bite down on your molars, strike at your enemy, press forward! By Allah, I shall not speak again until they are routed, or I meet Allah and speak my plea to Him.'",
      textAr:
        'يَرْفَعُ زَيْدُ بْنُ الْخَطَّابِ — أَخُو عُمَرَ — رَايَةَ الْمُهَاجِرِينَ وَيَصْرُخ: «أَيُّهَا النَّاسُ، عَضُّوا عَلَى أَضْرَاسِكُم، وَاضْرِبُوا فِي عَدُوِّكُم، وَامْضُوا قُدُمًا، وَاللهِ لَا أَتَكَلَّمُ حَتَّى يُهْزَمُوا أَوْ أَلْقَى اللهَ فَأُكَلِّمَهُ بِحُجَّتِي.»',
      position: 'top',
      style: 'quote',
    },
    {
      id: 'rajjal-falls',
      time: 33.5,
      duration: 4,
      text: "Zayd and al-Rajjal duel — the believer and the apostate — and al-Rajjal falls. The moral spine of Banu Hanifa snaps with him; the line begins to break.",
      textAr:
        'يَتَبَارَزُ زَيْدٌ وَالرَّجَّالُ — الْمُؤْمِنُ وَالْمُرْتَدّ — فَيَخِرُّ الرَّجَّالُ صَرِيعًا. يَنْكَسِرُ مَوْقِفُ بَنِي حَنِيفَةِ الْمَعْنَوِيُّ، فَيَنْكَسِرُ صَفُّهُم.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'muhakkim-falls',
      time: 38,
      duration: 4,
      text: "Muhakkim al-Yamama falls. The Hanafi cavalry scatters, and the foot soldiers flood eastward toward the walled garden — the Garden of al-Rahman.",
      textAr:
        'يَسْقُطُ مُحَكَّمُ الْيَمَامَة. تَتَفَرَّقُ خَيْلُ بَنِي حَنِيفَة، وَيَنْدَفِعُ الْمُشَاةُ فِرَارًا نَحْوَ الْحَدِيقَةِ الْمَسْوُورَة — حَدِيقَةِ الرَّحْمَن.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'salim-banner',
      time: 42.5,
      duration: 6,
      text: "Salim mawla Abi Hudhayfa carries the Muhajirun banner, saying: 'Wretched would I be as a bearer of the Qur'an if the Muslims were attacked from my side.' His hands are severed; he clutches the banner to his chest reciting 'Muhammad is naught but a Messenger' — and is found dead embracing his master, Abu Hudhayfa. Hundreds of memorizers of the Qur'an fall around them.",
      textAr:
        'يَحْمِلُ سَالِمٌ مَوْلَى أَبِي حُذَيْفَةَ رَايَةَ الْمُهَاجِرِينَ، وَيَقُول: «بِئْسَ حَامِلُ الْقُرْآنِ أَنَا إِنْ أُتِيَ الْمُسْلِمُونَ مِنْ قِبَلِي.» تُقْطَعُ يَدَاه، فَيَحْتَضِنُ الرَّايَةَ بِصَدْرِهِ تَالِيًا: «وَمَا مُحَمَّدٌ إِلَّا رَسُول» حَتَّى يُوجَدَ صَرِيعًا مُعَانِقًا مَوْلَاهُ أَبَا حُذَيْفَة. يَسْقُطُ مَعَهُمَا مِئَاتٌ مِنْ حُفَّاظِ كِتَابِ الله.',
      position: 'top',
      style: 'dramatic',
    },
    {
      id: 'baraa-call',
      time: 53.5,
      duration: 6,
      text: "At the wall al-Bara ibn Malik — Anas's brother — calls out: 'O my people, lift me upon the shield, then cast me upon them inside the garden!' He is hoisted on shields, vaulted over the wall, and fights through eighty wounds until he throws the gate open from within.",
      textAr:
        'يَصْرُخُ الْبَرَاءُ بْنُ مَالِكٍ — أَخُو أَنَس — عِنْدَ السُّور: «يَا قَوْمِ، ارْفَعُونِي عَلَى التُّرْسِ، ثُمَّ أَلْقُونِي عَلَيْهِمْ فِي الْحَدِيقَة!» فَيُحْمَلُ عَلَى التِّرَاسِ، وَيُقْذَفُ مِنْ فَوْقِ الْجِدَار، وَيُقَاتِلُ بِثَمَانِينَ جُرْحًا حَتَّى يَفْتَحَ الْبَابَ مِنْ دَاخِلِه.',
      position: 'top',
      style: 'dramatic',
    },
    {
      id: 'into-the-garden',
      time: 60.5,
      duration: 3,
      text: "The Muslim army surges through the open gate. The Garden of al-Rahman becomes — the Garden of Death.",
      textAr:
        'يَنْدَفِعُ الْجَيْشُ مِنَ الْبَابِ الْمَفْتُوح. تَسْتَحِيلُ حَدِيقَةُ الرَّحْمَنِ — حَدِيقَةَ الْمَوْت.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'wahshi-throws',
      time: 64,
      duration: 3,
      text: "Wahshi ibn Harb hurls his javelin — the same javelin he had cast at Hamza on the day of Uhud — and Abu Dujana strikes with his sword. Musaylimah falls.",
      textAr:
        'يَرْمِي وَحْشِيُّ بْنُ حَرْبٍ بِحَرْبَتِه — هِيَ الْحَرْبَةُ ذَاتُهَا الَّتِي قَتَلَ بِهَا حَمْزَةَ يَوْمَ أُحُد — وَيَضْرِبُ أَبُو دُجَانَةَ بِسَيْفِه. فَيَخِرُّ مُسَيْلِمَةُ صَرِيعًا.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'wahshi-quote',
      time: 67,
      duration: 4,
      text: "Wahshi says: 'I have killed the best of men in the Jahiliyya, and I have killed the worst of men in Islam — and I hope Allah will forgive me by the second for the first.'",
      textAr:
        'يَقُولُ وَحْشِيٌّ: «قَدْ قَتَلْتُ خَيْرَ النَّاسِ فِي الْجَاهِلِيَّة، وَقَتَلْتُ شَرَّ النَّاسِ فِي الْإِسْلَام، فَأَرْجُو أَنْ يَغْفِرَ اللهُ لِي بِالثَّانِي عَنِ الْأَوَّل.»',
      position: 'center',
      style: 'quote',
    },
  ],

  cameraScript: [
    // Opening reveal — full plain of Aqraba, Najd ridges, the garden glinting east
    { time: 0, position: { x: 700, y: 500 }, zoom: 0.42, duration: 3, easing: 'power2.inOut', type: 'overview' },
    // Drop in on the Hanafi shock-charge — Muhakkim's wedge collides with the Muslim front
    { time: 4, position: { x: 650, y: 480 }, zoom: 0.6, duration: 2, easing: 'power2.inOut', type: 'focus' },
    // Pull west toward the Muslim camp as Hanifa overruns the tents
    { time: 12, position: { x: 420, y: 500 }, zoom: 0.55, duration: 2, easing: 'power2.inOut', type: 'pan' },
    // Tight on Thabit perfuming himself with hanut — the moral pivot
    { time: 17, position: { x: 280, y: 520 }, zoom: 0.75, duration: 2, easing: 'power2.inOut', type: 'focus' },
    // Glide along the new tribal banners separating into distinct lines
    { time: 22, position: { x: 340, y: 500 }, zoom: 0.7, duration: 2, easing: 'power2.inOut', type: 'pan' },
    // Wide for the simultaneous counter-charge — three Muslim banners striking at once
    { time: 27, position: { x: 600, y: 500 }, zoom: 0.45, duration: 2.5, easing: 'power2.inOut', type: 'overview' },
    // Tight on the Zayd–al-Rajjal duel
    { time: 33, position: { x: 560, y: 520 }, zoom: 0.95, duration: 1.3, easing: 'power3.out', type: 'focus' },
    // Muhakkim's fall and the camera tracks east as the rout begins
    { time: 38, position: { x: 680, y: 480 }, zoom: 0.78, duration: 1.5, easing: 'power3.out', type: 'focus' },
    // Solemn focus on Salim raising the banner with severed hands — the moral weight that produces the Mushaf
    { time: 42, position: { x: 700, y: 460 }, zoom: 0.9, duration: 2, easing: 'power2.inOut', type: 'focus' },
    // Sweep east following the rout into the garden gate
    { time: 48, position: { x: 1080, y: 510 }, zoom: 0.55, duration: 2.5, easing: 'power2.inOut', type: 'pan' },
    // al-Bara on the wall — the shield-toss vault
    { time: 53, position: { x: 1230, y: 380 }, zoom: 0.85, duration: 1.5, easing: 'power3.out', type: 'focus' },
    // Pan with the Muslim wave pouring through the opened gate
    { time: 58, position: { x: 1100, y: 510 }, zoom: 0.7, duration: 2, easing: 'power2.inOut', type: 'pan' },
    // Wide enough to read the carnage inside the walls — the rename
    { time: 60, position: { x: 1240, y: 510 }, zoom: 0.65, duration: 2, easing: 'power2.inOut', type: 'overview' },
    // Tight on Wahshi's javelin and Abu Dujana's sword striking Musaylimah
    { time: 64, position: { x: 1320, y: 510 }, zoom: 0.92, duration: 1, easing: 'power3.out', type: 'focus' },
    // Pull back wide for the aftermath — silence after the storm, with the Mushaf-aftermath narration
    { time: 66.5, position: { x: 900, y: 500 }, zoom: 0.4, duration: 1.5, easing: 'power2.inOut', type: 'overview' },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 1200,
    enemyCasualties: 21000,
    summary:
      "A decisive Muslim victory ending the Ridda Wars. About 1,200 Muslims fell, of whom traditional sources count between 360 and 700 huffaz — among them Salim mawla Abi Hudhayfa, Abu Hudhayfa ibn Utba, Zayd ibn al-Khattab (Umar's brother), Thabit ibn Qays the Khatib of the Ansar, and Abu Dujana. Banu Hanifa lost more than 21,000 between the open field, the walled garden, and the pursuit. Wahshi ibn Harb killed Musaylimah with the same javelin he had once thrown at Hamza, and Abu Dujana finished him with the sword. Khalid ibn al-Walid was confirmed as supreme commander of the caliphal armies, and the road to Iraq and Syria opened.",
    summaryAr:
      'اِنْتِصَارٌ حَاسِمٌ أَنْهَى حُرُوبَ الرِّدَّة. اُسْتُشْهِدَ قُرَابَةَ أَلْفٍ وَمِئَتَيْ مُسْلِم، تَذْكُرُ الرِّوَايَاتُ أَنَّ بَيْنَ ثَلَاثِمِئَةٍ وَسِتِّينَ وَسَبْعِمِئَةٍ مِنْهُمْ مِنْ حُفَّاظِ كِتَابِ الله — مِنْهُمْ سَالِمٌ مَوْلَى أَبِي حُذَيْفَة، وَأَبُو حُذَيْفَةَ بْنُ عُتْبَة، وَزَيْدُ بْنُ الْخَطَّاب، وَثَابِتُ بْنُ قَيْس، وَأَبُو دُجَانَةَ الْأَنْصَارِيّ. سَقَطَ مِنْ بَنِي حَنِيفَةَ مَا يَزِيدُ عَلَى وَاحِدٍ وَعِشْرِينَ أَلْفًا بَيْنَ السَّهْلِ وَالْحَدِيقَةِ وَالطَّلَب، وَقَتَلَ وَحْشِيُّ بْنُ حَرْبٍ بِحَرْبَتِهِ مُسَيْلِمَةَ الْكَذَّاب، وَأَجْهَزَ عَلَيْهِ أَبُو دُجَانَة. ثَبَّتَ خَالِدُ بْنُ الْوَلِيدِ قَائِدًا عَامًّا لِجُيُوشِ الْخِلَافَة، وَانْفَتَحَ الطَّرِيقُ نَحْوَ الْعِرَاقِ وَالشَّام.',
    significance:
      "The catastrophic loss of Qur'an memorizers was the direct cause of the first compilation of the Qur'an under Abu Bakr. Umar came to him saying 'Casualties have been heavy among the reciters of the Qur'an on the Day of al-Yamama'; Abu Bakr at first refused — 'How can we do a thing the Messenger of Allah did not do?' — then Allah opened his breast to it, and he commissioned Zayd ibn Thabit. From that mushaf descend all later codices. The Ridda Wars ended decisively, securing the unity of the Arabian peninsula under the caliphate. Khalid's tribal-banner reorganization passed into the doctrine of the conquest armies. And 'the Garden of Death' — Hadiqat al-Mawt — became proverbial in Arabic for any field of battle from which there is no escape.",
    significanceAr:
      'كَانَ سُقُوطُ هَذَا الْعَدَدِ مِنْ حُفَّاظِ كِتَابِ اللهِ السَّبَبَ الْمُبَاشِرَ لِجَمْعِ الْقُرْآنِ فِي مُصْحَفٍ وَاحِدٍ عَلَى عَهْدِ أَبِي بَكْرٍ الصِّدِّيق. جَاءَ عُمَرُ إِلَى أَبِي بَكْرٍ فَقَال: «إِنَّ الْقَتْلَ قَدِ اسْتَحَرَّ يَوْمَ الْيَمَامَةِ بِقُرَّاءِ الْقُرْآن»، فَتَرَدَّدَ أَبُو بَكْرٍ: «كَيْفَ نَفْعَلُ شَيْئًا لَمْ يَفْعَلْهُ رَسُولُ اللهِ ﷺ؟» ثُمَّ شَرَحَ اللهُ صَدْرَهُ، فَكَلَّفَ زَيْدَ بْنَ ثَابِتٍ بِالْجَمْع — فَكَانَ ذَلِكَ أَصْلَ كُلِّ مُصْحَفٍ بَعْدَه. اِنْتَهَتْ حُرُوبُ الرِّدَّةِ حَسْمًا، وَثَبَتَتْ وَحْدَةُ الْجَزِيرَةِ الْعَرَبِيَّةِ تَحْتَ رَايَةِ الْخِلَافَة. وَصَارَ تَنْظِيمُ خَالِدٍ لِلْقَبَائِلِ تَحْتَ رَايَاتِهَا مَذْهَبًا عَسْكَرِيًّا تَوَارَثَتْهُ جُيُوشُ الْفُتُوحِ مِنْ بَعْد، وَصَارَتْ «حَدِيقَةُ الْمَوْت» مَثَلًا عَرَبِيًّا لِكُلِّ سَاحَةِ قِتَالٍ لَا مَهْرَبَ مِنْهَا.',
  },

  totalDuration: 68,
};
