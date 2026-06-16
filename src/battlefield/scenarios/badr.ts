import type { BattleScenario } from '../types/scenario';

/**
 * غَزْوَةُ بَدْرٍ الكُبْرى — يَوْمُ الفُرْقَانِ
 * Battle of Badr — The Day of Discrimination
 *
 * 17 Ramadan 2 AH (13 March 624 CE) — Prophetic era, third year after Hijra
 * Wadi Badr, between the 'Udwa Dunya (north — Madinah road) and the
 * 'Udwa Quswa (south — Mecca road), on the Hejaz caravan route.
 *
 * The first major military engagement between the Prophet ﷺ and Quraysh.
 * Three hundred and ten odd Muslims faced approximately a thousand chiefs
 * of Mecca after Banu Zuhra and Banu 'Adi peeled off at al-Juhfa. The
 * Muslims arrived first at Badr but encamped at the wrong well; al-Hubab
 * ibn al-Mundhir asked the Prophet ﷺ whether the position was a divine
 * directive — receiving the famous reply «بَلِ الرَّأْيُ وَالحَرْبُ
 * وَالمَكِيدَة» — and on his counsel the army advanced to seize the
 * well nearest the enemy, filled the others, and built a cistern. Sa'd
 * ibn Mu'adh proposed the 'arish: a shelter of palm-frond on the rise
 * from which the Prophet ﷺ would oversee the field, with mounts ready
 * for retreat if needed.
 *
 * On the field three Quraysh nobles — 'Utba ibn Rabi'a, his brother
 * Shayba, and his son al-Walid — called for duels; the Prophet ﷺ sent
 * 'Ubayda, Hamza, and Ali. Ali killed al-Walid; Hamza struck down Shayba;
 * 'Ubayda and 'Utba traded blows simultaneously, then Hamza and Ali
 * finished 'Utba while 'Ubayda was carried back, his leg severed.
 *
 * In the 'arish the Prophet ﷺ stretched out his hands until his cloak
 * fell from his shoulders, beseeching: «اللَّهُمَّ إِنْ تُهْلِكْ هَذِهِ
 * العِصَابَةَ مِنْ أَهْلِ الإِسْلامِ لاَ تُعْبَدْ فِي الأَرْض». Abu Bakr
 * embraced him from behind and assured him Allah would fulfil His
 * promise. Allah revealed: ﴿إِذْ تَسْتَغِيثُونَ رَبَّكُمْ فَاسْتَجَابَ
 * لَكُمْ أَنِّي مُمِدُّكُم بِأَلْفٍ مِّنَ المَلَائِكَةِ مُرْدِفِينَ﴾
 * (al-Anfal 9). The Prophet ﷺ took a handful of pebbles and cast them
 * at the faces of the foe; ﴿وَمَا رَمَيْتَ إِذْ رَمَيْتَ وَلَكِنَّ
 * اللَّهَ رَمَى﴾ (al-Anfal 17).
 *
 * The Quraysh line broke. The two boys of Banu 'Afra' — Mu'adh and
 * Mu'awwidh ibn 'Afra' from the Khazraj — converged on Abu Jahl and
 * struck him down; Ibn Mas'ud finished him and severed his head. Bilal
 * and the Ansar killed Umayya ibn Khalaf; Hamza killed al-Aswad ibn 'Abd
 * al-Asad at the cistern. Fourteen Muslims were martyred — six Muhajirun
 * and eight Ansar (six Khazraj, two Aws). Around seventy Quraysh chiefs
 * were killed; another seventy were captured, among them al-'Abbas ibn
 * 'Abd al-Muttalib and 'Aqil ibn Abi Talib.
 *
 * The Prophet ﷺ stood at the qalib — the well of Badr — and addressed
 * the dead chiefs by name: «هَلْ وَجَدْتُمْ مَا وَعَدَ رَبُّكُمْ
 * حَقًّا؟ فَإِنِّي وَجَدْتُ مَا وَعَدَنِي رَبِّي حَقًّا». And in the
 * matter of the captives Allah revealed: ﴿مَا كَانَ لِنَبِيٍّ أَنْ
 * يَكُونَ لَهُ أَسْرَى حَتَّى يُثْخِنَ فِي الأَرْضِ﴾ (al-Anfal 67).
 *
 * Sources: Ibn Hisham, as-Sirah an-Nabawiyyah (Ghazwat Badr al-Kubra);
 *          al-Bukhari, Sahih (Kitab al-Maghazi: 2915, 3952, 3961, 3965,
 *          3971, 3976, 3984, 3988, 3992); Muslim, Sahih (1763, 1901,
 *          2873); at-Tabari, Tarikh year 2 AH; Ibn Kathir, al-Bidayah
 *          wa'n-Nihayah vol. 3; Ibn Sa'd, at-Tabaqat. The whole of
 *          Surat al-Anfal was revealed in connection with this day.
 */
export const battleOfBadr: BattleScenario = {
  id: 'battle-of-badr',
  name: 'Battle of Badr',
  nameAr: 'غزوة بدر',
  date: '17 Ramadan 2 AH (13 March 624 CE)',
  location: "Wadi Badr, between the two banks ('Udwa Dunya and 'Udwa Quswa), Hejaz",
  description:
    "The first major battle between the Prophet ﷺ and Quraysh. Around 313 Muslims faced ~950 of Mecca's chiefs after Banu Zuhra and Banu 'Adi defected at al-Juhfa. On al-Hubab's counsel the Muslims seized the well nearest the enemy and built a cistern; on Sa'd ibn Mu'adh's counsel they built the 'arish for the Prophet ﷺ. The Prophet ﷺ raised his hands in the 'arish until his cloak fell — \"O Allah, if You destroy this band of the people of Islam, You will not be worshipped on the earth\" — and Allah revealed Q 8:9 promising a thousand angels in succession. Three duels (Ali killed al-Walid, Hamza killed Shayba, 'Ubayda and 'Utba mortally wounded each other) opened the engagement. The Prophet ﷺ cast pebbles, the lines clashed, and Quraysh broke. Mu'adh and Mu'awwidh ibn 'Afra' struck down Abu Jahl; Ibn Mas'ud finished him. Fourteen Companions were martyred; ~70 Quraysh chiefs were killed and ~70 captured. The Prophet ﷺ addressed the dead at the qalib, and revelation came concerning the captives (Q 8:67). The whole of Surat al-Anfal was revealed in connection with this day, called by the Qur'an \"the Day of Discrimination, the Day the two hosts met\" (Q 8:41).",
  descriptionAr:
    'أَوَّلُ مَلْحَمَةٍ كُبْرى بَيْنَ النَّبِيِّ ﷺ وَقُرَيْشٍ. الْتَقَى ثَلاثُ مِئَةٍ وَبِضْعَةَ عَشَرَ مِنَ المُسْلِمِينَ بِنَحْوِ تِسْعِ مِئَةٍ وَخَمْسِينَ مِنْ صَنادِيدِ مَكَّةَ بَعْدَ انْخِزَالِ بَنِي زُهْرَةَ وَبَنِي عَدِيٍّ بِالجُحْفَةِ. أَشَارَ الحُبَابُ بنُ المُنْذِرِ بِالنُّزُولِ عَلَى أَدْنَى المَاءِ مِنَ القَوْمِ، وَتَغْوِيرِ مَا سِوَاهُ، وَبِناءِ الحَوْضِ. وَاقْتَرَحَ سَعْدُ بنُ مُعاذٍ بِناءَ العَرِيشِ لِلنَّبِيِّ ﷺ يُطِلُّ مِنْهُ عَلَى المَعْرَكَةِ. خَرَجَ ثَلاثَةٌ مِنْ صَنادِيدِ قُرَيْشٍ — عُتْبَةُ وَأَخُوهُ شَيْبَةُ وَابْنُهُ الوَلِيدُ — يَطْلُبُونَ المُبارَزَةَ، فَبَرَزَ إِلَيْهِم حَمْزَةُ وَعَلِيٌّ وَعُبَيْدَةُ بنُ الحارِثِ، فَقَتَلَ عَلِيٌّ الوَلِيدَ، وَأَجْهَزَ حَمْزَةُ عَلَى شَيْبَةَ، وَاحْتُمِلَ عُبَيْدَةُ شَهِيداً وَقَدْ قُطِعَتْ رِجْلُهُ، وَكَرَّ حَمْزَةُ وَعَلِيٌّ عَلَى عُتْبَةَ. ثُمَّ مَدَّ النَّبِيُّ ﷺ يَدَيْهِ فِي العَرِيشِ يَدْعُو حَتَّى سَقَطَ رِدَاؤُهُ، فَأَخَذَهُ أَبُو بَكْرٍ وَقَالَ: «كَفاكَ مُناشَدَتُكَ رَبَّكَ». وَأَنْزَلَ اللَّهُ ﴿أَنِّي مُمِدُّكُم بِأَلْفٍ مِّنَ المَلَائِكَةِ مُرْدِفِينَ﴾. وَأَخَذَ ﷺ قَبْضَةً مِنَ الحَصَى فَرَمَى بِهَا وُجُوهَ القَوْمِ ﴿وَمَا رَمَيْتَ إِذْ رَمَيْتَ وَلَكِنَّ اللَّهَ رَمَى﴾. وَحَمَلَ غُلامَا بَنِي عَفْراءَ — مُعاذٌ وَمُعَوِّذٌ — عَلَى أَبِي جَهْلٍ فَأَثْبَتاهُ، ثُمَّ احْتَزَّ ابْنُ مَسْعُودٍ رَأْسَهُ. اسْتُشْهِدَ مِنَ المُسْلِمِينَ أَرْبَعَةَ عَشَرَ، وَقُتِلَ مِنْ قُرَيْشٍ نَحْوُ سَبْعِينَ وَأُسِرَ نَحْوُ سَبْعِينَ. وَوَقَفَ ﷺ عَلَى القَلِيبِ يُخاطِبُهُمْ: «هَلْ وَجَدْتُمْ مَا وَعَدَ رَبُّكُمْ حَقّاً؟ فَإِنِّي وَجَدْتُ مَا وَعَدَنِي رَبِّي حَقّاً». وَهُوَ ﴿يَوْمُ الْفُرْقانِ يَوْمَ الْتَقَى الجَمْعانِ﴾.',

  // First light at Badr — the engagement opens at dawn after the night
  // approach via the Madinah road, with rain having softened the southern
  // bank and firmed the northern Muslim ground (Q 8:11).
  dayPhase: 'dawn',
  weather: 'clear',
  actualDayCount: 1,

  // ─── Map ───────────────────────────────────────────────────────────────────
  // North-south orientation: Muslims occupy the 'Udwa Dunya in the north
  // (closer to Madinah, firm sandy ground after the rain). Quraysh occupy
  // the 'Udwa Quswa in the south (Mecca road, soft mud). The 'arish sits
  // on a rise at the northern edge; the wells run through the middle of
  // the valley; Kathib al-'Aqanqal rises behind the Quraysh.
  map: {
    width: 1600,
    height: 1000,
    terrain: [
      // Main valley floor — sand
      {
        id: 'badr-valley',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x8c6f3f,
        label: 'وَادِي بَدْرٍ',
      },
      // Northern ridge — Jabal al-Mala'ika and the Madinah pass approach
      {
        id: 'jabal-malaika',
        type: 'elevated',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 110 },
          { x: 0, y: 110 },
        ],
        color: 0x6b5a4a,
        label: 'جَبَلُ المَلَائِكَةِ',
      },
      // 'Udwa Dunya — Muslim ground, firmer after the rain (Q 8:11)
      {
        id: 'udwa-dunya',
        type: 'flat',
        polygon: [
          { x: 0, y: 110 },
          { x: 1600, y: 110 },
          { x: 1600, y: 470 },
          { x: 0, y: 470 },
        ],
        color: 0x9c7f4a,
      },
      // Palm grove on the northern edge near the wells
      {
        id: 'palm-grove',
        type: 'oasis',
        polygon: [
          { x: 100, y: 110 },
          { x: 480, y: 110 },
          { x: 480, y: 320 },
          { x: 100, y: 320 },
        ],
        color: 0x3a5a2a,
        label: 'نَخِيلُ بَدْرٍ',
      },
      {
        id: 'palm-grove-east',
        type: 'oasis',
        polygon: [
          { x: 1120, y: 110 },
          { x: 1500, y: 110 },
          { x: 1500, y: 320 },
          { x: 1120, y: 320 },
        ],
        color: 0x3a5a2a,
      },
      // 'Udwa Quswa — Quraysh ground, soft mud
      {
        id: 'udwa-quswa',
        type: 'sand',
        polygon: [
          { x: 0, y: 530 },
          { x: 1600, y: 530 },
          { x: 1600, y: 880 },
          { x: 0, y: 880 },
        ],
        color: 0x6b5530,
      },
      // Kathib al-'Aqanqal — the great dune behind the Quraysh camp
      {
        id: 'aqanqal-dune',
        type: 'dune',
        polygon: [
          { x: 0, y: 880 },
          { x: 1600, y: 880 },
          { x: 1600, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x6b4f1f,
        label: 'كَثِيبُ العَقَنْقَلِ',
      },
    ],
    landmarks: [
      {
        id: 'arish',
        position: { x: 800, y: 170 },
        type: 'camp',
        label: "Prophet's 'Arish",
        labelAr: 'العَرِيشُ — قُبَّةُ القِيَادَةِ النَّبَوِيَّةِ',
      },
      {
        id: 'well-near',
        position: { x: 800, y: 500 },
        type: 'well',
        label: 'Nearest Well & Cistern',
        labelAr: 'البِئْرُ القُصْوَى وَالحَوْضُ',
      },
      {
        id: 'well-east',
        position: { x: 1000, y: 480 },
        type: 'well',
        label: 'Filled Well',
        labelAr: 'القَلِيبُ المَطْمُوسُ',
      },
      {
        id: 'well-west',
        position: { x: 600, y: 480 },
        type: 'well',
        label: 'Filled Well',
        labelAr: 'القَلِيبُ المَطْمُوسُ',
      },
      {
        id: 'qalib',
        position: { x: 720, y: 530 },
        type: 'well',
        label: 'Qalib of Badr',
        labelAr: 'قَلِيبُ بَدْرٍ',
      },
      {
        id: 'madina-pass',
        position: { x: 200, y: 60 },
        type: 'mountain_pass',
        label: 'Madinah Pass',
        labelAr: 'ثَنِيَّةُ المَدِينَةِ',
      },
      {
        id: 'makka-pass',
        position: { x: 1400, y: 940 },
        type: 'mountain_pass',
        label: 'Mecca Pass',
        labelAr: 'ثَنِيَّةُ مَكَّةَ',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  // ─── Forces ────────────────────────────────────────────────────────────────
  forces: [
    // ─── Muslim Forces (~313) ──────────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 313,
      units: [
        {
          // The 'arish — Prophet ﷺ + Abu Bakr + a guard of Ansar at the door
          id: 'muslim-command-arish',
          name: "The 'Arish — Prophet's Shelter",
          nameAr: 'كَتِيبَةُ العَرِيشِ — مَقَامُ النَّبِيِّ ﷺ وَأَبِي بَكْرٍ',
          troopType: 'command',
          soldierCount: 8,
          commander: 'Prophet Muhammad ﷺ, with Abu Bakr as-Siddiq',
          startPosition: { x: 800, y: 170 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2, // facing south toward Quraysh
          stats: { attack: 6, defense: 9, speed: 5, morale: 10 },
        },
        {
          // The Muhajirun under the white liwa' of Mus'ab ibn 'Umayr,
          // with the al-'Uqab banner held by Ali — 82 men per Ibn Hisham
          id: 'muslim-vanguard-muhajirun',
          name: 'Muhajirun — Banner of al-Uqab',
          nameAr: 'كَتِيبَةُ المُهَاجِرِينَ — لِوَاءُ العُقَابِ',
          troopType: 'infantry',
          soldierCount: 82,
          commander: "Mus'ab ibn 'Umayr (white liwa') and Ali ibn Abi Talib (al-Uqab)",
          startPosition: { x: 800, y: 380 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 6, morale: 10 },
        },
        {
          // The Aws under the banner of Sa'd ibn Mu'adh — 61 per Ibn Hisham
          id: 'muslim-ansar-aws',
          name: 'Ansar of Aws',
          nameAr: 'كَتِيبَةُ الأَوْسِ — رَايَةُ سَعْدِ بْنِ مُعَاذٍ',
          troopType: 'infantry',
          soldierCount: 61,
          commander: "Sa'd ibn Mu'adh, with Usayd ibn Hudayr",
          startPosition: { x: 580, y: 380 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // The Khazraj — the largest contingent at 170 — Sa'd ibn 'Ubadah
          // and al-Hubab ibn al-Mundhir; among them the killers of Abu Jahl
          id: 'muslim-ansar-khazraj',
          name: 'Ansar of Khazraj',
          nameAr: 'كَتِيبَةُ الخَزْرَجِ — رَايَةُ الحُبَابِ',
          troopType: 'infantry',
          soldierCount: 170,
          commander: "Sa'd ibn 'Ubadah and al-Hubab ibn al-Mundhir",
          startPosition: { x: 1020, y: 380 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // The saqah — the rear guard under Qays ibn Abi Sa'sa'a
          id: 'muslim-rearguard',
          name: 'Saqah — Rear Guard',
          nameAr: 'كَتِيبَةُ السَّاقَةِ',
          troopType: 'reserves',
          soldierCount: 6,
          commander: "Qays ibn Abi Sa'sa'a al-Ansari",
          startPosition: { x: 800, y: 240 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
        {
          // Az-Zubayr ibn al-'Awwam — one of only two horsemen the Muslims
          // had at Badr — on the right wing
          id: 'muslim-cavalry-zubayr',
          name: 'Right Wing — az-Zubayr',
          nameAr: 'فَارِسُ المَيْمَنَةِ — الزُّبَيْرُ بْنُ العَوَّامِ',
          troopType: 'cavalry',
          soldierCount: 1,
          commander: "az-Zubayr ibn al-'Awwam",
          startPosition: { x: 1180, y: 350 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 7, speed: 9, morale: 10 },
        },
        {
          // Al-Miqdad ibn al-Aswad — the second of the only two horsemen —
          // on the left wing, the man of the famous shura speech (Bukhari 3952)
          id: 'muslim-cavalry-miqdad',
          name: 'Left Wing — al-Miqdad',
          nameAr: 'فَارِسُ المَيْسَرَةِ — المِقْدَادُ بْنُ الأَسْوَدِ',
          troopType: 'cavalry',
          soldierCount: 1,
          commander: 'al-Miqdad ibn al-Aswad al-Kindi',
          startPosition: { x: 420, y: 350 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 7, speed: 9, morale: 10 },
        },
      ],
    },

    // ─── Quraysh Forces (~950–1000) ────────────────────────────────────────
    {
      faction: 'quraysh',
      label: 'Quraysh Forces',
      labelAr: 'جَيْشُ قُرَيْشٍ',
      totalStrength: 950,
      units: [
        {
          // Abu Jahl — supreme commander after he overrode 'Utba's call
          // for retreat, with the Makhzumi clan around him
          id: 'quraysh-command-abu-jahl',
          name: "Abu Jahl's Command (Banu Makhzum)",
          nameAr: 'كَتِيبَةُ المَخْزُومِيِّينَ — قِيَادَةُ أَبِي جَهْلٍ',
          troopType: 'command',
          soldierCount: 100,
          commander: "'Amr ibn Hisham (Abu Jahl)",
          startPosition: { x: 800, y: 720 },
          startFormation: 'defensive_circle',
          startFacing: -Math.PI / 2, // facing north toward Muslims
          stats: { attack: 7, defense: 8, speed: 5, morale: 7 },
        },
        {
          // Banu 'Abd Shams — 'Utba, his brother Shayba, and his son
          // al-Walid stepped out of this unit for the duels
          id: 'quraysh-vanguard-abd-shams',
          name: "Banu 'Abd Shams — Champions of the Mubaraza",
          nameAr: 'كَتِيبَةُ بَنِي عَبْدِ شَمْسٍ — أَبْطَالُ المُبَارَزَةِ',
          troopType: 'heavy_cavalry',
          soldierCount: 80,
          commander: "'Utba ibn Rabi'a, Shayba ibn Rabi'a, al-Walid ibn 'Utba",
          startPosition: { x: 800, y: 600 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 8, speed: 7, morale: 8 },
        },
        {
          // Banu 'Abd al-Dar — hereditary banner-bearers of Quraysh,
          // with an-Nadr ibn al-Harith carrying the great liwa'
          id: 'quraysh-banner-abd-al-dar',
          name: "Banu 'Abd al-Dar — Banner Bearers",
          nameAr: 'كَتِيبَةُ بَنِي عَبْدِ الدَّارِ — حَمَلَةُ اللِّوَاءِ',
          troopType: 'infantry',
          soldierCount: 60,
          commander: 'an-Nadr ibn al-Harith',
          startPosition: { x: 800, y: 760 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 7 },
        },
        {
          // Banu Jumah and the bulk of Banu Makhzum — Umayya ibn Khalaf
          // (killed by Bilal and the Ansar) and the Makhzumi infantry
          id: 'quraysh-jumah-makhzum',
          name: 'Banu Jumah & Makhzum',
          nameAr: 'كَتِيبَةُ بَنِي جُمَحَ وَمَخْزُومٍ',
          troopType: 'infantry',
          soldierCount: 220,
          commander: 'Umayya ibn Khalaf al-Jumahi',
          startPosition: { x: 580, y: 720 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 6 },
        },
        {
          // Banu Asad and Banu Nawfal — Nawfal ibn Khuwaylid, Tu'ayma
          // ibn 'Adi, Zam'a ibn al-Aswad — all killed at Badr
          id: 'quraysh-asad-nawfal',
          name: 'Banu Asad & Nawfal',
          nameAr: 'كَتِيبَةُ بَنِي أَسَدٍ وَنَوْفَلٍ',
          troopType: 'infantry',
          soldierCount: 180,
          commander: "Nawfal ibn Khuwaylid, Tu'ayma ibn 'Adi, Zam'a ibn al-Aswad",
          startPosition: { x: 1020, y: 720 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 6 },
        },
        {
          // Quraysh's hundred horsemen — armored, in stark contrast to
          // the Muslims' two — under Hakim ibn Hizam and 'Ikrima
          id: 'quraysh-cavalry',
          name: 'Quraysh Cavalry',
          nameAr: 'خَيَّالَةُ قُرَيْشٍ',
          troopType: 'heavy_cavalry',
          soldierCount: 100,
          commander: "Hakim ibn Hizam and 'Ikrima ibn Abi Jahl",
          startPosition: { x: 1180, y: 620 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 9, morale: 7 },
        },
        {
          // Banu Sahm — Munabbih and Nubayh ibn al-Hajjaj, both killed
          id: 'quraysh-sahm',
          name: 'Banu Sahm',
          nameAr: 'كَتِيبَةُ بَنِي سَهْمٍ',
          troopType: 'infantry',
          soldierCount: 110,
          commander: 'Munabbih and Nubayh ibn al-Hajjaj',
          startPosition: { x: 420, y: 620 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 6 },
        },
        {
          // The rear guard — those who held back from the front rank
          id: 'quraysh-rearguard',
          name: 'Quraysh Rear Guard',
          nameAr: 'سَاقَةُ قُرَيْشٍ وَسَوَادُهَا',
          troopType: 'reserves',
          soldierCount: 100,
          commander: "Abu Sufyan ibn al-Harith and others held back from the saff",
          startPosition: { x: 800, y: 830 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 5, morale: 5 },
        },
      ],
    },
  ],

  // ─── Phases (68 simulation seconds across 1 actual day) ──────────────────
  phases: [
    // Phase 1 (0–7s): Encampment and al-Hubab's counsel
    {
      id: 'phase-01-deployment',
      name: 'Encampment and al-Hubab\'s Counsel',
      nameAr: 'النُّزُولُ بِبَدْرٍ وَمَشُورَةُ الحُبَابِ',
      startTime: 0,
      duration: 7,
      description:
        "Night of 16 Ramadan. The Muslims encamp first — but at the wrong well. Al-Hubab ibn al-Mundhir asks the Prophet ﷺ whether the position is divinely ordained: 'Rather it is judgment, war, and stratagem.' On his counsel, the army advances to seize the well nearest the enemy, fills the others, and builds a cistern.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.45, duration: 4 }, delay: 0 },
        // Initial position near the palm grove (north) — units shift south to seize the well
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-muhajirun', params: { position: { x: 800, y: 380 }, speed: 50 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-aws', params: { position: { x: 580, y: 380 }, speed: 50 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-khazraj', params: { position: { x: 1020, y: 380 }, speed: 50 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-zubayr', params: { position: { x: 1180, y: 350 }, speed: 80 }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-miqdad', params: { position: { x: 420, y: 350 }, speed: 80 }, delay: 2 },
        // Pan south as the cistern is built at the well-near
        { type: 'camera_move', params: { x: 800, y: 480, zoom: 0.62, duration: 3 }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 2 (7–13s): The 'arish and the dressed line
    {
      id: 'phase-02-arish',
      name: "The 'Arish & The Dressed Saff",
      nameAr: 'بِنَاءُ العَرِيشِ وَتَعْبِئَةُ الصُّفُوفِ',
      startTime: 7,
      duration: 6,
      description:
        "Sa'd ibn Mu'adh proposes the 'arish: 'O Prophet of Allah, shall we not build you a shelter? If Allah honours us, it is what we love; if otherwise, you mount and ride.' The Prophet ﷺ takes the qidh (arrow shaft) to dress the line; he prods Sawad ibn Ghaziya for standing forward — Sawad asks for retaliation, then embraces him.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 250, zoom: 0.7, duration: 3 }, delay: 0 },
        // The arish unit settles on the rise
        { type: 'move_unit', targetUnitId: 'muslim-command-arish', params: { position: { x: 800, y: 170 }, speed: 30 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-rearguard', params: { position: { x: 800, y: 240 }, speed: 30 }, delay: 1 },
        // The line dresses — formation reset to line for all infantry
        { type: 'change_formation', targetUnitId: 'muslim-vanguard-muhajirun', params: { formation: 'line' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'muslim-ansar-aws', params: { formation: 'line' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'muslim-ansar-khazraj', params: { formation: 'line' }, delay: 2 },
        { type: 'camera_move', params: { x: 800, y: 380, zoom: 0.6, duration: 3 }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 3 (13–19s): Quraysh arrival — 'Utba's plea, Abu Jahl's refusal
    {
      id: 'phase-03-quraysh-arrival',
      name: "Quraysh Arrive at the 'Udwa Quswa",
      nameAr: 'وُصُولُ قُرَيْشٍ وَنُزُولُهُمُ العُدْوَةَ القُصْوى',
      startTime: 13,
      duration: 6,
      description:
        "Quraysh marched from Mecca through 'Usfan, Qudayd and al-Juhfa; Banu Zuhra (~300) and Banu 'Adi peeled off there. The remainder (~950) descend on the 'Udwa Quswa. 'Utba ibn Rabi'a — whose son Abu Hudhayfa was a Muslim and whose family pride is at stake — calls for retreat: 'Go back, your caravan is safe.' Abu Jahl refuses: 'We will not return until we descend on Badr and stay three days.'",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 850, zoom: 0.5, duration: 4 }, delay: 0 },
        // Quraysh march from the southern pass into the Udwa Quswa positions
        { type: 'move_unit', targetUnitId: 'quraysh-command-abu-jahl', params: { position: { x: 800, y: 720 }, speed: 60 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'quraysh-vanguard-abd-shams', params: { position: { x: 800, y: 600 }, speed: 65 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-banner-abd-al-dar', params: { position: { x: 800, y: 760 }, speed: 55 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-jumah-makhzum', params: { position: { x: 580, y: 720 }, speed: 60 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'quraysh-asad-nawfal', params: { position: { x: 1020, y: 720 }, speed: 60 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry', params: { position: { x: 1180, y: 620 }, speed: 90 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-sahm', params: { position: { x: 420, y: 620 }, speed: 60 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-rearguard', params: { position: { x: 800, y: 830 }, speed: 50 }, delay: 2 },
      ],
      triggers: [],
    },

    // Phase 4 (19–26s): The Prophetic dua in the 'arish
    {
      id: 'phase-04-prophetic-dua',
      name: "The Prophetic Du'a in the 'Arish",
      nameAr: 'دُعَاءُ النَّبِيِّ ﷺ فِي العَرِيشِ',
      startTime: 19,
      duration: 7,
      description:
        "Muslim 1763: The Prophet ﷺ saw the disbelievers — a thousand — and his Companions — three hundred and ten odd. He faced the qibla and stretched out his hands until his cloak fell from his shoulders. Abu Bakr picked it up and embraced him from behind: 'O Prophet of Allah, your beseeching of your Lord suffices; He will fulfil what He promised you.' Allah revealed Q 8:9 — 'I shall reinforce you with a thousand of the angels in succession.'",
      actions: [
        // Cinematic zoom into the arish for the most intimate moment
        { type: 'camera_move', params: { x: 800, y: 200, zoom: 0.85, duration: 5 }, delay: 0 },
        // The arish unit holds firm — formation tightens
        { type: 'change_formation', targetUnitId: 'muslim-command-arish', params: { formation: 'defensive_circle' }, delay: 1 },
        // Slow pull-back as the verse is revealed
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.55, duration: 2 }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 5 (26–34s): The duels of the three
    {
      id: 'phase-05-mubaraza',
      name: 'The Duels of the Three',
      nameAr: 'مُبَارَزَةُ الثَّلَاثَةِ',
      startTime: 26,
      duration: 8,
      description:
        "Bukhari 3965: 'Utba, Shayba, and al-Walid step out and call for duels. Three Ansar youths stepped forward — but they refused them, demanding 'their cousins.' The Prophet ﷺ said: 'Rise, Ubayda ibn al-Harith. Rise, Hamza. Rise, Ali.' Ali killed al-Walid; Hamza struck down Shayba; Ubayda and 'Utba traded blows simultaneously, and Hamza and Ali finished 'Utba while Ubayda was carried back, his leg severed — he died of his wound at as-Safra'.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.78, duration: 3 }, delay: 0 },
        // The Quraysh champions step out — vanguard moves slightly forward
        { type: 'move_unit', targetUnitId: 'quraysh-vanguard-abd-shams', params: { position: { x: 800, y: 540 }, speed: 60 }, delay: 1 },
        // Tight on the duel
        { type: 'camera_move', params: { x: 800, y: 480, zoom: 0.9, duration: 2 }, delay: 4 },
        // Three Muslim champions step out from the muhajirun
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-muhajirun', params: { position: { x: 800, y: 440 }, speed: 50 }, delay: 4 },
        // Engagement — duels resolve
        { type: 'attack_unit', targetUnitId: 'muslim-vanguard-muhajirun', params: { targetId: 'quraysh-vanguard-abd-shams' }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 6 (34–42s): Fire-discipline order, the lines clash, Umayr ibn al-Humam
    {
      id: 'phase-06-arrows-and-clash',
      name: 'The Order of Arrows & The Clash',
      nameAr: 'أَمْرُ الرَّمْيِ وَاشْتِبَاكُ الصُّفُوفِ',
      startTime: 34,
      duration: 8,
      description:
        "Bukhari 3984–3985: The Prophet ﷺ commanded fire-discipline: 'When they close upon you, shoot them with arrows, and conserve your shafts.' Umayr ibn al-Humam stood with dates in his hand. When he heard the Prophet's call 'Rise to a Paradise as wide as the heavens and the earth,' he said: 'Bakhin, bakhin! Is there nothing between me and Paradise but that these men kill me?' He cast away the dates and fought until martyred (Muslim 1901).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.55, duration: 3 }, delay: 0 },
        // Quraysh advance up the muddy slope
        { type: 'set_behavior', targetUnitId: 'quraysh-vanguard-abd-shams', params: { behavior: 'advancing' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'quraysh-vanguard-abd-shams', params: { position: { x: 800, y: 490 }, speed: 70 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'quraysh-jumah-makhzum', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-jumah-makhzum', params: { position: { x: 580, y: 540 }, speed: 65 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'quraysh-asad-nawfal', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-asad-nawfal', params: { position: { x: 1020, y: 540 }, speed: 65 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-sahm', params: { position: { x: 420, y: 540 }, speed: 60 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry', params: { position: { x: 1180, y: 530 }, speed: 100 }, delay: 1 },
        // Muslim line advances slightly to engage
        { type: 'set_behavior', targetUnitId: 'muslim-vanguard-muhajirun', params: { behavior: 'attacking' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-muhajirun', params: { position: { x: 800, y: 460 }, speed: 60 }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-aws', params: { position: { x: 580, y: 460 }, speed: 60 }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-khazraj', params: { position: { x: 1020, y: 460 }, speed: 60 }, delay: 2.5 },
        // Engagements
        { type: 'attack_unit', targetUnitId: 'muslim-vanguard-muhajirun', params: { targetId: 'quraysh-vanguard-abd-shams' }, delay: 3.5 },
        { type: 'attack_unit', targetUnitId: 'muslim-ansar-aws', params: { targetId: 'quraysh-jumah-makhzum' }, delay: 4 },
        { type: 'attack_unit', targetUnitId: 'muslim-ansar-khazraj', params: { targetId: 'quraysh-asad-nawfal' }, delay: 4 },
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.45, duration: 2 }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 7 (42–49s): The pebbles and the angels
    {
      id: 'phase-07-pebbles-and-angels',
      name: 'The Pebbles and the Angels',
      nameAr: 'قَبْضَةُ الحَصَى وَنُزُولُ المَلَائِكَةِ',
      startTime: 42,
      duration: 7,
      description:
        "The Prophet ﷺ stepped out of the 'arish, took a handful of pebbles and cast them at the faces of the foe. Allah revealed: 'You did not throw when you threw — but Allah threw' (Q 8:17). And: 'Allah gave you victory at Badr while you were lowly' (Q 3:123). Jibril said: 'And so are those of the angels who were present at Badr' (Bukhari 3992).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 280, zoom: 0.8, duration: 3 }, delay: 0 },
        // The Prophet's symbolic gesture — Quraysh formation falters
        { type: 'change_formation', targetUnitId: 'quraysh-vanguard-abd-shams', params: { formation: 'scattered' }, delay: 2 },
        { type: 'camera_move', params: { x: 800, y: 600, zoom: 0.55, duration: 3 }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 8 (49–57s): Rout and the death of Abu Jahl
    {
      id: 'phase-08-rout-abu-jahl',
      name: 'The Rout & The Death of Abu Jahl',
      nameAr: 'هَزِيمَةُ قُرَيْشٍ وَمَصْرَعُ أَبِي جَهْلٍ',
      startTime: 49,
      duration: 8,
      description:
        "Bukhari 3961, 3988: Quraysh broke and fled south. Mu'adh and Mu'awwidh ibn 'Afra' — two boys of the Khazraj — both vowed to kill Abu Jahl. They fell upon him and disabled him. Ibn Mas'ud found him with a breath remaining, severed his head, and brought it to the Prophet ﷺ. Bilal pointed out Umayya ibn Khalaf and the Ansar killed him; Hamza killed al-Aswad ibn 'Abd al-Asad at the cistern.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 600, zoom: 0.6, duration: 3 }, delay: 0 },
        // The Quraysh army routs south
        { type: 'set_behavior', targetUnitId: 'quraysh-vanguard-abd-shams', params: { behavior: 'retreating' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'quraysh-vanguard-abd-shams', params: { position: { x: 1300, y: 900 }, speed: 100 }, delay: 0 },
        { type: 'destroy_unit', targetUnitId: 'quraysh-vanguard-abd-shams', params: { cause: 'champions_slain' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry', params: { behavior: 'retreating' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry', params: { position: { x: 1400, y: 900 }, speed: 130 }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'quraysh-cavalry', params: { formation: 'scattered' }, delay: 1.5 },
        { type: 'set_behavior', targetUnitId: 'quraysh-jumah-makhzum', params: { behavior: 'retreating' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-jumah-makhzum', params: { position: { x: 400, y: 880 }, speed: 90 }, delay: 1.5 },
        { type: 'change_formation', targetUnitId: 'quraysh-jumah-makhzum', params: { formation: 'scattered' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'quraysh-asad-nawfal', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'quraysh-asad-nawfal', params: { position: { x: 1200, y: 880 }, speed: 90 }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'quraysh-asad-nawfal', params: { formation: 'scattered' }, delay: 2.5 },
        { type: 'set_behavior', targetUnitId: 'quraysh-sahm', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'quraysh-sahm', params: { position: { x: 300, y: 880 }, speed: 85 }, delay: 2 },
        // The Khazraj — the boys of 'Afra' among them — close on Abu Jahl
        { type: 'set_behavior', targetUnitId: 'muslim-ansar-khazraj', params: { behavior: 'pursuing' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-khazraj', params: { position: { x: 800, y: 700 }, speed: 90 }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'muslim-ansar-khazraj', params: { targetId: 'quraysh-command-abu-jahl' }, delay: 2.5 },
        { type: 'camera_move', params: { x: 800, y: 700, zoom: 0.82, duration: 2 }, delay: 3 },
        { type: 'destroy_unit', targetUnitId: 'quraysh-command-abu-jahl', params: { cause: 'abu_jahl_killed' }, delay: 4.5 },
        // The banner falls
        { type: 'destroy_unit', targetUnitId: 'quraysh-banner-abd-al-dar', params: { cause: 'banner_lost' }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 9 (57–63s): The captives and the qalib address
    {
      id: 'phase-09-captives-and-qalib',
      name: 'The Captives & The Address at the Qalib',
      nameAr: 'الأَسْرَى وَخِطَابُ القَلِيبِ',
      startTime: 57,
      duration: 6,
      description:
        "Around seventy of Quraysh were captured, including al-'Abbas ibn 'Abd al-Muttalib, 'Aqil ibn Abi Talib, and Abu al-'As ibn ar-Rabi'. Twenty-four chiefs were thrown into the qalib — the well of Badr. The Prophet ﷺ stood at its edge and addressed them by name: 'Have you found what your Lord promised true? For I have found what my Lord promised me true.' Asked, 'Do you address bodies without souls?' he said: 'By Him in whose hand is my soul, you are not better hearing of what I say than they — but they cannot answer' (Bukhari 3976; Muslim 2873).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 600, zoom: 0.5, duration: 3 }, delay: 0 },
        // Surviving Quraysh units scatter further or are destroyed
        { type: 'destroy_unit', targetUnitId: 'quraysh-jumah-makhzum', params: { cause: 'umayya_killed' }, delay: 1 },
        { type: 'destroy_unit', targetUnitId: 'quraysh-asad-nawfal', params: { cause: 'chiefs_killed' }, delay: 1.5 },
        { type: 'set_behavior', targetUnitId: 'quraysh-rearguard', params: { behavior: 'retreating' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'quraysh-rearguard', params: { position: { x: 800, y: 950 }, speed: 90 }, delay: 0 },
        // Tight low-angle on the Prophet at the qalib
        { type: 'camera_move', params: { x: 720, y: 530, zoom: 0.92, duration: 4 }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 10 (63–68s): The ransom debate and Yawm al-Furqan
    {
      id: 'phase-10-ransom',
      name: 'The Ransom Debate & Yawm al-Furqan',
      nameAr: 'مَشُورَةُ الفِدَاءِ وَيَوْمُ الفُرْقَانِ',
      startTime: 63,
      duration: 5,
      description:
        "Muslim 1763: The Prophet ﷺ consulted on the captives. Abu Bakr counselled ransom — 'they are kin and clan; perhaps Allah will guide them.' Umar counselled execution — 'these are the chiefs and leaders of disbelief.' The Prophet ﷺ inclined to Abu Bakr; Allah revealed Q 8:67 rebuking the choice. The Prophet ﷺ wept, and said: 'Had a punishment descended from heaven, none would have escaped but Umar.' The day of Badr is Yawm al-Furqan — the Day of Discrimination.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 280, zoom: 0.7, duration: 2 }, delay: 0 },
        // The arish becomes the consultation chamber
        { type: 'change_formation', targetUnitId: 'muslim-command-arish', params: { formation: 'defensive_circle' }, delay: 0.5 },
        // Final golden-hour pull-back across the whole valley
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.42, duration: 3 }, delay: 2 },
      ],
      triggers: [],
    },
  ],

  // ─── Narration ─────────────────────────────────────────────────────────────
  // Verbatim quotations are drawn from the canonical sources cited in the
  // header — Bukhari, Muslim, Ibn Hisham. Quranic verses are quoted from
  // Surat al-Anfal and Al 'Imran, the suras revealed concerning Badr.
  narration: [
    {
      id: 'narr-01-opening',
      time: 0.5,
      duration: 6,
      text: "Badr — a valley between Mecca and Sham, on the caravan road. On the 17th of Ramadan, year 2 AH, the two hosts met: three hundred and ten odd against a thousand of Quraysh's chiefs.",
      textAr:
        'بَدْرٌ — وَادٍ بَيْنَ مَكَّةَ وَالشَّامِ، عَلَى دَرْبِ القَوَافِلِ. فِي السَّابِعَ عَشَرَ مِنْ رَمَضَانَ سَنَةَ اثْنَتَيْنِ لِلْهِجْرَةِ، الْتَقَى الجَمْعَانِ: ثَلَاثُ مِئَةٍ وَبِضْعَةَ عَشَرَ، فِي وَجْهِ أَلْفٍ مِنْ صَنَادِيدِ قُرَيْشٍ.',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-02-hubab',
      time: 7,
      duration: 6,
      text: "Al-Hubab ibn al-Mundhir asked: 'O Messenger of Allah — is this a position Allah has revealed, or is it judgment, war, and stratagem?' He said: 'Rather it is judgment, war, and stratagem.' The army advanced to the well nearest the enemy; the rest were filled, a cistern was built.",
      textAr:
        'قَالَ الحُبَابُ بْنُ المُنْذِرِ: «يَا رَسُولَ اللَّهِ، أَهَذَا مَنْزِلٌ أَنْزَلَكَهُ اللَّهُ، أَمْ هُوَ الرَّأْيُ وَالحَرْبُ وَالمَكِيدَةُ؟» قَالَ ﷺ: «بَلِ الرَّأْيُ وَالحَرْبُ وَالمَكِيدَةُ». فَنَهَضَ الجَيْشُ إِلَى أَدْنَى المَاءِ مِنَ القَوْمِ، وَغُوِّرَتِ القُلُبُ، وَبُنِيَ الحَوْضُ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-03-arish',
      time: 14,
      duration: 6,
      text: "Sa'd ibn Mu'adh said: 'O Prophet of Allah — shall we not build you a shelter on the rise, and ready your mounts beside you, then meet our enemy? If Allah honours us, it is what we love; if otherwise, you mount and ride to those behind us.' The Prophet praised him and prayed for him.",
      textAr:
        'قَالَ سَعْدُ بْنُ مُعَاذٍ: «يَا نَبِيَّ اللَّهِ، أَلَا نَبْنِي لَكَ عَرِيشًا تَكُونُ فِيهِ، وَنُعِدُّ عِنْدَكَ رَكَائِبَكَ، ثُمَّ نَلْقَى عَدُوَّنَا، فَإِنْ أَعَزَّنَا اللَّهُ كَانَ ذَلِكَ مَا أَحْبَبْنَا، وَإِنْ كَانَتِ الأُخْرَى جَلَسْتَ عَلَى رَكَائِبِكَ فَلَحِقْتَ بِمَنْ وَرَاءَنَا». فَأَثْنَى عَلَيْهِ النَّبِيُّ ﷺ وَدَعَا لَهُ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-04-quraysh-arrival',
      time: 20,
      duration: 5,
      text: "Quraysh encamped on the far bank — Banu Zuhrah and Banu 'Adi having peeled off. 'Utba ibn Rabi'a urged: 'Go back — your caravan is safe.' Abu Jahl refused: 'We will not return until we descend on Badr and stay three days.'",
      textAr:
        'وَنَزَلَتْ قُرَيْشٌ بِالعُدْوَةِ القُصْوَى، وَقَدِ انْخَزَلَ عَنْهَا بَنُو زُهْرَةَ وَبَنُو عَدِيٍّ. قَالَ عُتْبَةُ بْنُ رَبِيعَةَ: «ارْجِعُوا، فَقَدْ نَجَتْ عِيرُكُمْ». فَأَبَى أَبُو جَهْلٍ وَقَالَ: «لَا نَرْجِعُ حَتَّى نَرِدَ بَدْرًا فَنُقِيمَ بِهَا ثَلَاثًا».',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-05-dua',
      time: 25.5,
      duration: 8,
      text: "The Prophet faced the qibla in the shelter and stretched out his hands until his cloak fell from his shoulders: 'O Allah, fulfil for me what You have promised. O Allah, if You destroy this band of the people of Islam, You will not be worshipped on the earth.' Abu Bakr took the cloak and said: 'O Prophet of Allah — your beseeching of your Lord suffices; He will fulfil what He has promised you.'",
      textAr:
        'اسْتَقْبَلَ النَّبِيُّ ﷺ القِبْلَةَ فِي العَرِيشِ، وَمَدَّ يَدَيْهِ يَدْعُو حَتَّى سَقَطَ رِدَاؤُهُ عَنْ مَنْكِبَيْهِ: «اللَّهُمَّ أَنْجِزْ لِي مَا وَعَدْتَنِي، اللَّهُمَّ إِنْ تُهْلِكْ هَذِهِ العِصَابَةَ مِنْ أَهْلِ الإِسْلَامِ لَا تُعْبَدْ فِي الأَرْضِ». فَأَخَذَ أَبُو بَكْرٍ رِدَاءَهُ وَقَالَ: «يَا نَبِيَّ اللَّهِ، كَفَاكَ مُنَاشَدَتُكَ رَبَّكَ، فَإِنَّهُ سَيُنْجِزُ لَكَ مَا وَعَدَكَ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-06-imdad',
      time: 33.5,
      duration: 5,
      text: "Then Allah revealed: 'When you sought help from your Lord and He answered: I shall reinforce you with a thousand of the angels in succession.' (Q 8:9)",
      textAr:
        'فَأَنْزَلَ اللَّهُ تَعَالَى: ﴿إِذْ تَسْتَغِيثُونَ رَبَّكُمْ فَاسْتَجَابَ لَكُمْ أَنِّي مُمِدُّكُم بِأَلْفٍ مِّنَ المَلَائِكَةِ مُرْدِفِينَ﴾.',
      style: 'quote',
      position: 'top',
    },
    {
      id: 'narr-07-mubaraza',
      time: 27,
      duration: 6.5,
      text: "'Utba, his brother Shayba, and his son al-Walid stepped out, calling for duels. The Prophet said: 'Rise, Ubayda ibn al-Harith. Rise, Hamza. Rise, Ali.' Ali killed al-Walid; Hamza struck down Shayba; then Hamza and Ali finished 'Utba — Ubayda was carried back, his leg severed.",
      textAr:
        'خَرَجَ عُتْبَةُ وَأَخُوهُ شَيْبَةُ وَابْنُهُ الوَلِيدُ، فَطَلَبُوا المُبَارَزَةَ. فَقَالَ النَّبِيُّ ﷺ: «قُمْ يَا عُبَيْدَةَ بْنَ الحَارِثِ، وَقُمْ يَا حَمْزَةُ، وَقُمْ يَا عَلِيُّ». فَقَتَلَ عَلِيٌّ الوَلِيدَ، وَأَجْهَزَ حَمْزَةُ عَلَى شَيْبَةَ، وَكَرَّ حَمْزَةُ وَعَلِيٌّ عَلَى عُتْبَةَ فَقَتَلَاهُ، وَاحْتُمِلَ عُبَيْدَةُ وَقَدْ قُطِعَتْ رِجْلُهُ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-08-firediscipline',
      time: 35,
      duration: 6,
      text: "The Prophet commanded: 'When they close upon you, shoot them with arrows — and conserve your shafts.' Umayr ibn al-Humam stood with dates in his hand. When he heard 'Rise to a Paradise as wide as the heavens and the earth,' he said: 'Bakhin, bakhin! Is there nothing between me and Paradise but that these men kill me?' He cast away the dates and fought until he was martyred.",
      textAr:
        'وَأَمَرَ النَّبِيُّ ﷺ: «إِذَا أَكْثَبُوكُمْ — أَيْ قَرُبُوا — فَارْمُوهُمْ بِالنَّبْلِ، وَاسْتَبْقُوا نَبْلَكُمْ». فَقَامَ عُمَيْرُ بْنُ الحُمَامِ وَفِي يَدِهِ تَمَرَاتٌ، فَلَمَّا سَمِعَ قَوْلَهُ ﷺ: «قُومُوا إِلَى جَنَّةٍ عَرْضُهَا السَّمَاوَاتُ وَالأَرْضُ»، قَالَ: «بَخٍ بَخٍ! أَفَمَا بَيْنِي وَبَيْنَ أَنْ أَدْخُلَ الجَنَّةَ إِلَّا أَنْ يَقْتُلَنِي هَؤُلَاءِ؟» فَأَلْقَى التَّمَرَاتِ وَقَاتَلَ حَتَّى اسْتُشْهِدَ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-09-pebbles',
      time: 42.5,
      duration: 6,
      text: "The Prophet took a handful of pebbles and cast them at the faces of the foe. Allah revealed: 'You did not throw when you threw — but Allah threw.' (Q 8:17) And: 'Allah gave you victory at Badr while you were lowly.' (Q 3:123)",
      textAr:
        'وَأَخَذَ النَّبِيُّ ﷺ قَبْضَةً مِنَ الحَصَى فَرَمَى بِهَا وُجُوهَ القَوْمِ. فَأَنْزَلَ اللَّهُ: ﴿وَمَا رَمَيْتَ إِذْ رَمَيْتَ وَلَكِنَّ اللَّهَ رَمَى﴾. وَقَالَ سُبْحَانَهُ: ﴿وَلَقَدْ نَصَرَكُمُ اللَّهُ بِبَدْرٍ وَأَنْتُمْ أَذِلَّةٌ﴾.',
      style: 'quote',
      position: 'top',
    },
    {
      id: 'narr-10-angels',
      time: 48.5,
      duration: 5,
      text: "Jibril came and asked: 'How do you reckon the people of Badr among you?' He said: 'Among the best of the Muslims.' He said: 'And so are those of the angels who were present at Badr.'",
      textAr:
        'وَجَاءَ جِبْرِيلُ عَلَيْهِ السَّلَامُ فَقَالَ: «مَا تَعُدُّونَ أَهْلَ بَدْرٍ فِيكُمْ؟» قَالَ ﷺ: «مِنْ أَفْضَلِ المُسْلِمِينَ». قَالَ: «وَكَذَلِكَ مَنْ شَهِدَ بَدْرًا مِنَ المَلَائِكَةِ».',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-11-abu-jahl',
      time: 53.5,
      duration: 6.5,
      text: "Quraysh turned in flight. The two boys, Mu'adh and Mu'awwidh ibn 'Afra', struck down Abu Jahl until he was disabled; Ibn Mas'ud severed his head and brought it to the Prophet. Bilal and the Ansar killed Umayya ibn Khalaf; Hamza killed al-Aswad ibn 'Abd al-Asad at the cistern.",
      textAr:
        'وَتَوَلَّتْ قُرَيْشٌ مُدْبِرَةً. وَحَمَلَ الغُلَامَانِ مُعَاذٌ وَمُعَوِّذٌ ابْنَا عَفْرَاءَ عَلَى أَبِي جَهْلٍ فَأَثْبَتَاهُ، ثُمَّ احْتَزَّ ابْنُ مَسْعُودٍ رَأْسَهُ وَأَتَى بِهِ النَّبِيَّ ﷺ. وَقَتَلَ بِلَالٌ وَالأَنْصَارُ أُمَيَّةَ بْنَ خَلَفٍ، وَقَتَلَ حَمْزَةُ الأَسْوَدَ بْنَ عَبْدِ الأَسَدِ عِنْدَ الحَوْضِ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-12-qalib',
      time: 60,
      duration: 6.5,
      text: "The Prophet stood at the well of Badr and called: 'O Abu Jahl ibn Hisham! O Umayya ibn Khalaf! O 'Utba ibn Rabi'a! O Shayba ibn Rabi'a! Have you found what your Lord promised true? For I have found what my Lord promised me true.' Asked, 'Do you address bodies without souls?' he said: 'By Him in whose hand is my soul, you are not better hearing of what I say than they — but they cannot answer.'",
      textAr:
        'وَقَفَ النَّبِيُّ ﷺ عَلَى قَلِيبِ بَدْرٍ فَنَادَى: «يَا أَبَا جَهْلِ بْنَ هِشَامٍ، يَا أُمَيَّةَ بْنَ خَلَفٍ، يَا عُتْبَةَ بْنَ رَبِيعَةَ، يَا شَيْبَةَ بْنَ رَبِيعَةَ، هَلْ وَجَدْتُمْ مَا وَعَدَ رَبُّكُمْ حَقًّا؟ فَإِنِّي وَجَدْتُ مَا وَعَدَنِي رَبِّي حَقًّا». قِيلَ: يَا رَسُولَ اللَّهِ، أَتُكَلِّمُ أَجْسَادًا لَا أَرْوَاحَ فِيهَا؟ قَالَ: «وَالَّذِي نَفْسِي بِيَدِهِ، مَا أَنْتُمْ بِأَسْمَعَ لِمَا أَقُولُ مِنْهُمْ، وَلَكِنْ لَا يَقْدِرُونَ عَلَى أَنْ يُجِيبُوا».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-13-ransom',
      time: 64,
      duration: 4,
      text: "Concerning the captives, Allah revealed: 'It is not for a Prophet to have prisoners until he has subdued the land.' (Q 8:67) And the day of Badr was 'the Day of Discrimination — the day the two hosts met.' (Q 8:41)",
      textAr:
        'وَفِي شَأْنِ الأُسَارَى نَزَلَ قَوْلُ اللَّهِ تَعَالَى: ﴿مَا كَانَ لِنَبِيٍّ أَنْ يَكُونَ لَهُ أَسْرَى حَتَّى يُثْخِنَ فِي الأَرْضِ﴾. وَكَانَ يَوْمُ بَدْرٍ هُوَ ﴿يَوْمَ الْفُرْقَانِ يَوْمَ الْتَقَى الْجَمْعَانِ﴾.',
      style: 'quote',
      position: 'top',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    { time: 0, position: { x: 800, y: 500 }, zoom: 0.45, duration: 4, easing: 'power2.inOut', type: 'overview' },
    { time: 4, position: { x: 800, y: 480 }, zoom: 0.62, duration: 3, easing: 'power2.inOut', type: 'pan' },
    { time: 7, position: { x: 800, y: 220 }, zoom: 0.7, duration: 4, easing: 'power2.out', type: 'focus' },
    { time: 11, position: { x: 800, y: 380 }, zoom: 0.55, duration: 3, easing: 'power2.inOut', type: 'pan' },
    { time: 14, position: { x: 800, y: 800 }, zoom: 0.5, duration: 4, easing: 'power2.out', type: 'follow', followEntityId: 'quraysh-command-abu-jahl' },
    { time: 19, position: { x: 800, y: 200 }, zoom: 0.85, duration: 5, easing: 'power3.out', type: 'focus', followEntityId: 'muslim-command-arish' },
    { time: 24, position: { x: 800, y: 500 }, zoom: 0.55, duration: 2, easing: 'power2.out', type: 'pan' },
    { time: 26, position: { x: 800, y: 500 }, zoom: 0.78, duration: 3, easing: 'power2.out', type: 'focus' },
    { time: 30, position: { x: 800, y: 480 }, zoom: 0.9, duration: 2, easing: 'power3.out', type: 'focus' },
    { time: 34, position: { x: 800, y: 510 }, zoom: 0.55, duration: 3, easing: 'power2.out', type: 'overview' },
    { time: 37, position: { x: 800, y: 500 }, zoom: 0.7, duration: 4, easing: 'power2.inOut', type: 'focus' },
    { time: 41, position: { x: 800, y: 500 }, zoom: 0.45, duration: 2, easing: 'power2.inOut', type: 'overview' },
    { time: 43, position: { x: 800, y: 280 }, zoom: 0.8, duration: 3, easing: 'power3.out', type: 'focus', followEntityId: 'muslim-command-arish' },
    { time: 46, position: { x: 800, y: 600 }, zoom: 0.55, duration: 3, easing: 'power2.inOut', type: 'pan' },
    { time: 49, position: { x: 800, y: 600 }, zoom: 0.6, duration: 3, easing: 'power2.out', type: 'overview' },
    { time: 52, position: { x: 800, y: 700 }, zoom: 0.82, duration: 3, easing: 'power3.out', type: 'follow' },
    { time: 57, position: { x: 800, y: 600 }, zoom: 0.5, duration: 3, easing: 'power2.inOut', type: 'overview' },
    { time: 60, position: { x: 720, y: 530 }, zoom: 0.92, duration: 4, easing: 'power3.out', type: 'focus' },
    { time: 64, position: { x: 800, y: 280 }, zoom: 0.7, duration: 2, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-command-arish' },
    { time: 66, position: { x: 800, y: 500 }, zoom: 0.42, duration: 2, easing: 'power2.out', type: 'overview' },
  ],

  // ─── Outcome ───────────────────────────────────────────────────────────────
  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 14,
    enemyCasualties: 70,
    summary:
      "A decisive Muslim victory in the first major engagement between Islam and Quraysh. Fourteen Companions were martyred (six Muhajirun, eight Ansar — six Khazraj and two Aws). Around seventy Quraysh chieftains were killed — including Abu Jahl, 'Utba, Shayba, al-Walid, and Umayya ibn Khalaf — and roughly seventy more were captured, among them al-'Abbas ibn 'Abd al-Muttalib and 'Aqil ibn Abi Talib.",
    summaryAr:
      'نَصْرٌ مُؤَزَّرٌ لِلْمُسْلِمِينَ فِي أَوَّلِ مَلْحَمَةٍ كُبْرَى بَيْنَ الإِسْلَامِ وَقُرَيْشٍ. اسْتُشْهِدَ أَرْبَعَةَ عَشَرَ صَحَابِيًّا (سِتَّةٌ مِنَ المُهَاجِرِينَ وَثَمَانِيَةٌ مِنَ الأَنْصَارِ، مِنْهُمْ سِتَّةٌ مِنَ الخَزْرَجِ وَاثْنَانِ مِنَ الأَوْسِ). وَقُتِلَ مِنْ قُرَيْشٍ نَحْوُ سَبْعِينَ مِنْ صَنَادِيدِهَا، فِيهِمْ أَبُو جَهْلٍ وَعُتْبَةُ وَشَيْبَةُ وَالوَلِيدُ وَأُمَيَّةُ بْنُ خَلَفٍ، وَأُسِرَ مِنْهُمْ نَحْوُ سَبْعِينَ، فِيهِمُ العَبَّاسُ بْنُ عَبْدِ المُطَّلِبِ وَعَقِيلُ بْنُ أَبِي طَالِبٍ.',
    significance:
      "This is 'the Day of Discrimination — the day the two hosts met' (Q 8:41), when Allah parted truth from falsehood. It established the political and military power of the nascent Islamic polity in Medina, shattered Quraysh's prestige, triggered the expulsion of Banu Qaynuqa, and drew surrounding tribes into treaty with the Prophet. The People of Badr (Ahl Badr) hold the highest rank among the Companions: the Prophet ﷺ said, 'Perhaps Allah has looked upon the people of Badr and said: Do as you wish — I have forgiven you' (Bukhari 3983). The whole of Surat al-Anfal was revealed in connection with this day.",
    significanceAr:
      'هُوَ ﴿يَوْمُ الفُرْقَانِ يَوْمَ الْتَقَى الجَمْعَانِ﴾ (الأنفال 41) — اليَوْمُ الَّذِي فَرَّقَ اللَّهُ بِهِ بَيْنَ الحَقِّ وَالبَاطِلِ. أُسِّسَتْ بِهِ شَوْكَةُ الدَّوْلَةِ الإِسْلَامِيَّةِ بِالمَدِينَةِ، وَانْكَسَرَتْ هَيْبَةُ قُرَيْشٍ، وَخَرَجَتْ بَنُو قَيْنُقَاعَ بَعْدَهُ مِنَ المَدِينَةِ، وَدَخَلَتِ القَبَائِلُ فِي حِلْفِ النَّبِيِّ ﷺ. وَأَهْلُ بَدْرٍ هُمْ صَفْوَةُ الصَّحَابَةِ، قَالَ ﷺ فِي شَأْنِهِمْ: «لَعَلَّ اللَّهَ اطَّلَعَ عَلَى أَهْلِ بَدْرٍ فَقَالَ: اعْمَلُوا مَا شِئْتُمْ فَقَدْ غَفَرْتُ لَكُمْ» (البخاري ٣٩٨٣). وَنَزَلَتْ فِيهَا سُورَةُ الأَنْفَالِ بِأَسْرِهَا.',
  },

  totalDuration: 68,
};
