import type { BattleScenario } from '../types/scenario';

/**
 * غَزْوَةُ أُحُدٍ — مَدْرَسَةُ الأُمَّةِ
 * Battle of Uhud — The School of the Umma
 *
 * 7 Shawwal 3 AH (March 625 CE) — second year after Hijra
 * The southern foot of Mount Uhud, north of Medina, beside Wadi Qanat
 * and Jabal al-Rumat (Aynayn) — a 40-foot rocky knoll southwest of the
 * Muslim line.
 *
 * Quraysh, smarting from Badr, marched north up the Tihama coast under
 * Abu Sufyan ibn Harb with ~3,000 men (700 in mail, ~200 horse) and
 * encamped at Batn as-Sabkha north of Medina to draw the Muslims out.
 * The Prophet ﷺ marched with ~1,000; at al-Shawt — the threshold of
 * Uhud — Abdullah ibn Ubayy peeled off with ~300 munafiqun, censured by
 * ﴿هُمْ لِلْكُفْرِ يَوْمَئِذٍ أَقْرَبُ مِنْهُمْ لِلْإِيمَانِ﴾ (Al
 * 'Imran 167). Banu Salama and Banu Haritha almost faltered with him.
 *
 * On Saturday morning the Prophet ﷺ arrayed 700 men on the lower
 * southern slopes of Uhud, mountain at their back. He posted fifty
 * archers on Jabal al-Rumat (Aynayn) under Abdullah ibn Jubayr with
 * the standing order recorded in al-Bukhari 3039: «إِنْ رَأَيْتُمُونَا
 * تَخْطَفُنَا الطَّيْرُ فَلاَ تَبْرَحُوا مَكَانَكُمْ هَذَا حَتَّى
 * أُرْسِلَ إِلَيْكُمْ».
 *
 * Single combat opened. Talha ibn Abi Talha al-Abdari — "Kabsh al-Katiba"
 * — challenged and Ali killed him. The Banu 'Abd ad-Dar standard passed
 * in succession through his brothers and sons; ~9 standard-bearers fell
 * before the Quraysh center wavered. Hamza fought with two swords; Abu
 * Dujana wore the red 'isabat al-mawt and took the Prophet's sword "with
 * its right." The Quraysh line broke; Muslims gathered spoils.
 *
 * Forty of the fifty archers descended Jabal al-Rumat, against Ibn
 * Jubayr's protests. Khalid ibn al-Walid — still a polytheist — saw the
 * gap, wheeled the right cavalry around the abandoned knoll, Ikrimah
 * trailing him on the left. They overran Ibn Jubayr's holdouts and
 * struck the Muslim rear: a textbook double envelopment. Allah said:
 * ﴿حَتَّىٰ إِذَا فَشِلْتُمْ وَتَنَازَعْتُمْ فِي الأَمْرِ وَعَصَيْتُم
 * مِّن بَعْدِ مَا أَرَاكُم مَّا تُحِبُّونَ﴾ (Al 'Imran 152).
 *
 * Wahshi ibn Harb stalked Hamza behind a rock and hurled his Abyssinian
 * harbah javelin: «فَأَضَعُهَا فِي ثُنَّتِهِ حَتَّى خَرَجَتْ مِنْ
 * بَيْنِ وَرِكَيْه» (Bukhari 4072). Hind bint 'Utba had hired him in
 * vengeance for her father slain at Badr; afterwards she mutilated the
 * body. Hamza was Asad Allah, Sayyid ash-Shuhada.
 *
 * Mus'ab ibn 'Umayr fell holding the Muhajirun banner — his right hand
 * severed, then his left, then a spear ran him through. Ibn Qami'a,
 * mistaking him for the Prophet ﷺ, cried "I have killed Muhammad!" and
 * the rumor swept the field. Allah revealed: ﴿وَمَا مُحَمَّدٌ إِلَّا
 * رَسُولٌ قَدْ خَلَتْ مِنْ قَبْلِهِ الرُّسُلُ﴾ (Al 'Imran 144). The
 * Prophet ﷺ was wounded — a stone broke his rabaiyah tooth and gashed
 * his face; his helmet shattered driving two of its rings into his
 * cheek (Bukhari 4075). Talha ibn 'Ubaydullah caught blows on his hand,
 * paralyzed forever (Bukhari 4063). Sa'd ibn Abi Waqqas shot arrows the
 * Prophet ﷺ handed him personally: «ارْمِ فِدَاكَ أَبِي وَأُمِّي»
 * (Bukhari 4055). Abu Dujana shielded the Prophet ﷺ with his back. Umm
 * 'Ammarah Nusaybah took thirteen wounds defending him. He was led into
 * the shi'b on Uhud's slope. Sa'd and Ibn 'Abbas (Bukhari 4054, Muslim
 * 2306) saw two angels in white fighting beside him.
 *
 * Abu Sufyan climbed a height and shouted: «أُعْلُ هُبَلْ» — answered
 * by the Prophet ﷺ: «اللَّهُ أَعْلَى وَأَجَلُّ». «لَنَا العُزَّىٰ
 * وَلاَ عُزَّىٰ لَكُمْ» — «اللَّهُ مَوْلَانَا وَلاَ مَوْلَى لَكُمْ».
 * He closed: «يَوْمٌ بِيَوْمِ بَدْرٍ، وَالحَرْبُ سِجَالٌ» (Bukhari
 * 4043). Quraysh withdrew without taking prisoners — they could not
 * press into Medina.
 *
 * Seventy Companions were martyred, including Hamza, Mus'ab, 'Abdullah
 * ibn Jubayr, and Hanzala "Ghasil al-Mala'ika". Quraysh lost ~25. The
 * next day the Prophet ﷺ marched out, wounded, to Hamra al-Asad ~13 km
 * southwest, where the Muslims lit ~500 fires; Abu Sufyan declined the
 * return strike. Allah revealed: ﴿الَّذِينَ اسْتَجَابُوا لِلَّهِ
 * وَالرَّسُولِ مِنْ بَعْدِ مَا أَصَابَهُمُ القَرْحُ﴾ (Al 'Imran 172).
 *
 * Sources: Ibn Hisham, as-Sirah (Ghazwat Uhud); al-Bukhari (Maghazi:
 * 3039, 4043, 4047, 4054, 4055, 4063, 4072, 4075, 4077); Muslim 2306;
 * at-Tabari, Tarikh year 3 AH; Ibn Kathir, al-Bidayah vol. 4; al-Waqidi,
 * al-Maghazi. The longest Quranic passage tied to a single battle —
 * Al 'Imran 121-179 — was revealed in its aftermath.
 */
export const battleOfUhud: BattleScenario = {
  id: 'battle-of-uhud',
  name: 'Battle of Uhud',
  nameAr: 'غزوة أُحُد',
  date: '7 Shawwal 3 AH (March 625 CE)',
  location: "Southern foot of Mount Uhud, beside Jabal al-Rumat (Aynayn) and Wadi Qanat, north of Medina",
  description:
    "Quraysh's revenge campaign for Badr. Abu Sufyan led ~3,000 men north and encamped at Batn as-Sabkha to draw the Muslims out. The Prophet ﷺ marched with 1,000; Ibn Ubayy peeled off with 300 at al-Shawt. The 700 remaining were arrayed on the lower slopes of Uhud, mountain at their back, with 50 archers under Ibn Jubayr posted on Jabal al-Rumat with the standing order: 'Even if you see birds snatching us, do not leave this position.' Single combat felled the Banu 'Abd ad-Dar banner-bearers one after another; the Muslim line broke through and Quraysh fled. Forty archers descended for spoils — Khalid ibn al-Walid wheeled around the abandoned knoll and struck the Muslim rear. Hamza was killed by Wahshi's javelin; Mus'ab fell carrying the banner; the rumor of the Prophet's ﷺ death (refuted by Q 3:144) spread; he himself was wounded — a stone broke his tooth, his helmet rings drove into his cheek. Abu Sufyan's heights-dialogue («أُعْلُ هُبَلْ» — «اللَّهُ أَعْلَى وَأَجَلُّ») closed the field. Seventy Muslims martyred, ~25 Quraysh killed, no prisoners. The next day the Prophet ﷺ marched out wounded to Hamra al-Asad: 500 fires deterred Abu Sufyan's return.",
  descriptionAr:
    'حَمْلَةُ ثَأْرِ قُرَيْشٍ مِنْ بَدْرٍ. سَارَ أَبُو سُفْيَانَ بِنَحْوِ ثَلاثَةِ آلافٍ شَمالاً، وَنَزَلَ بِبَطْنِ السَّبْخَةِ يَسْتَدْرِجُ المُسْلِمِينَ. خَرَجَ النَّبِيُّ ﷺ بِأَلْفٍ، ثُمَّ انْخَزَلَ ابْنُ أُبَيٍّ بِالشَّوْطِ بِثَلاثِمِئَةٍ، فَبَقِيَ سَبْعُمِئَةٍ تَحْتَ سَفْحِ أُحُدٍ، أَمَّرَ النَّبِيُّ ﷺ عَلَى خَمْسِينَ رَامِياً عَبْدَ اللَّهِ بْنَ جُبَيْرٍ عَلَى جَبَلِ الرُّمَاةِ بِأَمْرٍ صَرِيحٍ: «إِنْ رَأَيْتُمُونَا تَخْطَفُنَا الطَّيْرُ فَلَا تَبْرَحُوا مَكَانَكُمْ». افْتَتَحَتِ المُبارَزَةُ بِسُقُوطِ حَمَلَةِ لِواءِ بَنِي عَبْدِ الدَّارِ واحِدًا إِثْرَ آخَرَ، فَتَكَسَّرَتْ صُفُوفُ قُرَيْشٍ وَأَدْبَرَتْ. فَنَزَلَ أَرْبَعُونَ مِنَ الرُّمَاةِ يَلْتَقِطُونَ الغَنِيمَةَ — فَكَرَّ خَالِدُ بْنُ الوَلِيدِ بِخَيْلِهِ مِنْ وَرَاءِ الجَبَلِ المَخْذُولِ، وَتَبِعَهُ عِكْرِمَةُ، فَضَرَبُوا ظُهُورَ المُسْلِمِينَ. اسْتُشْهِدَ حَمْزَةُ بِحَرْبَةِ وَحْشِيٍّ، وَسَقَطَ مُصْعَبُ بنُ عُمَيْرٍ تَحْتَ اللِّوَاءِ، وَانْتَشَرَتْ إِشَاعَةُ مَقْتَلِ النَّبِيِّ ﷺ فَرَدَّهَا الوَحْيُ ﴿وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ﴾. وَجُرِحَ النَّبِيُّ ﷺ، فَكُسِرَتْ رَبَاعِيَتُهُ، وَوَقَتْهُ يَدُ طَلْحَةَ فَشُلَّتْ، وَرَمَى سَعْدٌ بَيْنَ يَدَيْهِ. ثُمَّ صَعِدَ أَبُو سُفْيَانَ فَنَادَى: «أُعْلُ هُبَلْ» — فَأَجَابَ ﷺ: «اللَّهُ أَعْلَى وَأَجَلُّ». انْسَحَبَتْ قُرَيْشٌ دُونَ أَنْ تُقْتَحَمَ المَدِينَةُ. اسْتُشْهِدَ سَبْعُونَ مِنَ المُسْلِمِينَ، وَفِي الغَدِ خَرَجَ ﷺ مَجْرُوحًا إِلَى حَمْرَاءِ الأَسَدِ فَأَوْقَدُوا خَمْسَمِئَةِ نَارٍ، فَلَمْ يَعُدْ أَبُو سُفْيَانَ.',

  dayPhase: 'day',
  weather: 'clear',
  actualDayCount: 1,

  // ─── Map ───────────────────────────────────────────────────────────────────
  // Mount Uhud anchors the NORTH (top of map). Muslims face SOUTH (PI/2)
  // with the mountain at their back. Quraysh face NORTH (-PI/2). Jabal
  // al-Rumat — the 40-foot knoll — sits to the southwest of the Muslim
  // line, on the corridor toward Wadi Qanat. The unguarded gap behind it
  // is the avenue Khalid will exploit.
  map: {
    width: 1600,
    height: 1000,
    terrain: [
      // Main valley floor — open killing ground between the two armies
      {
        id: 'uhud-valley',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x6b5a3e,
        label: 'سَفْحُ أُحُدٍ',
      },
      // Mount Uhud — the granite massif at the Muslims' back
      {
        id: 'mount-uhud',
        type: 'mountain',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 130 },
          { x: 0, y: 130 },
        ],
        color: 0x3c2a1a,
        label: 'جَبَلُ أُحُدٍ',
      },
      // Wadi Qanat — narrow ribbon between Uhud's foot and the Muslim line
      {
        id: 'wadi-qanat',
        type: 'river',
        polygon: [
          { x: 0, y: 130 },
          { x: 1600, y: 130 },
          { x: 1600, y: 175 },
          { x: 0, y: 175 },
        ],
        color: 0x2a5e8c,
        label: 'وَادِي قَنَاةٍ',
      },
      // Jabal al-Rumat (Aynayn) — the 40-foot knoll on the Muslim left
      {
        id: 'jabal-rumat',
        type: 'rocky',
        polygon: [
          { x: 380, y: 380 },
          { x: 580, y: 380 },
          { x: 580, y: 540 },
          { x: 380, y: 540 },
        ],
        color: 0x6b5a4a,
        label: 'جَبَلُ الرُّمَاةِ (عَيْنَيْنِ)',
      },
      // Quraysh encampment area — the pastures of Batn as-Sabkha
      {
        id: 'quraysh-encampment',
        type: 'flat',
        polygon: [
          { x: 0, y: 720 },
          { x: 1600, y: 720 },
          { x: 1600, y: 880 },
          { x: 0, y: 880 },
        ],
        color: 0x5c4033,
      },
      // Medinan oasis fringe — the strategic prize Quraysh failed to take
      {
        id: 'medina-edge',
        type: 'oasis',
        polygon: [
          { x: 0, y: 880 },
          { x: 1600, y: 880 },
          { x: 1600, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x3a5a2a,
        label: 'أَطْرَافُ المَدِينَةِ',
      },
    ],
    landmarks: [
      {
        id: 'mount-uhud-peak',
        position: { x: 800, y: 60 },
        type: 'mountain_pass',
        label: 'Mount Uhud',
        labelAr: 'جَبَلُ أُحُدٍ',
      },
      {
        id: 'shib-uhud',
        position: { x: 920, y: 145 },
        type: 'marker',
        label: "Prophet's Shi'b",
        labelAr: 'شِعْبُ النَّبِيِّ ﷺ',
      },
      {
        id: 'jabal-rumat-marker',
        position: { x: 480, y: 460 },
        type: 'hill',
        label: "Jabal al-Rumat (Archers' Hill)",
        labelAr: 'جَبَلُ الرُّمَاةِ',
      },
      {
        id: 'al-shawt',
        position: { x: 1200, y: 940 },
        type: 'marker',
        label: 'Al-Shawt — Defection Point',
        labelAr: 'الشَّوْطُ — مَوْضِعُ انْخِزَالِ ابْنِ أُبَيٍّ',
      },
      {
        id: 'hamra-al-asad',
        position: { x: 200, y: 950 },
        type: 'camp',
        label: 'Hamra al-Asad',
        labelAr: 'حَمْرَاءُ الأَسَدِ',
      },
      {
        id: 'quraysh-camp',
        position: { x: 800, y: 800 },
        type: 'camp',
        label: 'Quraysh Camp (Batn as-Sabkha)',
        labelAr: 'مُعَسْكَرُ قُرَيْشٍ — بَطْنُ السَّبْخَةِ',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  // ─── Forces ────────────────────────────────────────────────────────────────
  forces: [
    // ─── Muslim Forces (~700 after Ibn Ubayy's defection) ──────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 700,
      units: [
        {
          // The center — the Prophet ﷺ at the heart, mountain at his back
          id: 'muslim-center-line',
          name: 'Muslim Center',
          nameAr: 'كَتِيبَةُ القَلْبِ — مَقَامُ النَّبِيِّ ﷺ',
          troopType: 'command',
          soldierCount: 380,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 800, y: 320 },
          startFormation: 'line',
          startFacing: Math.PI / 2, // facing south toward Quraysh
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // The Muhajirun banner under Mus'ab ibn 'Umayr — physical
          // resemblance to the Prophet ﷺ; his fall sparked the rumor
          id: 'muslim-muhajirun-banner',
          name: 'Muhajirun Banner',
          nameAr: 'كَتِيبَةُ لِوَاءِ المُهَاجِرِينَ',
          troopType: 'infantry',
          soldierCount: 30,
          commander: "Mus'ab ibn 'Umayr al-'Abdari",
          startPosition: { x: 800, y: 280 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 8, speed: 6, morale: 10 },
        },
        {
          // The fifty archers on Jabal al-Rumat — Bukhari 3039
          id: 'muslim-archers-rumat',
          name: 'Archers of Aynayn',
          nameAr: 'كَتِيبَةُ رُمَاةِ عَيْنَيْنِ',
          troopType: 'archers',
          soldierCount: 50,
          commander: "'Abdullah ibn Jubayr al-Ansari",
          startPosition: { x: 480, y: 460 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 6, speed: 5, morale: 9 },
        },
        {
          // Hamza's vanguard — the Lion of God, two swords, struck down
          // by Wahshi's javelin (Bukhari 4072)
          id: 'muslim-hamza-vanguard',
          name: 'Vanguard of the Lion',
          nameAr: 'كَتِيبَةُ أَسَدِ اللَّهِ',
          troopType: 'infantry',
          soldierCount: 60,
          commander: "Hamza ibn 'Abd al-Muttalib",
          startPosition: { x: 720, y: 380 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 7, speed: 7, morale: 10 },
        },
        {
          // The Aws banner — anchored toward Mount Uhud on the right
          id: 'muslim-aws-banner',
          name: 'Aws Banner',
          nameAr: 'كَتِيبَةُ لِوَاءِ الأَوْسِ',
          troopType: 'infantry',
          soldierCount: 90,
          commander: 'Usayd ibn Hudayr',
          startPosition: { x: 1020, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // The Khazraj banner — the left, between center and Jabal al-Rumat
          id: 'muslim-khazraj-banner',
          name: 'Khazraj Banner',
          nameAr: 'كَتِيبَةُ لِوَاءِ الخَزْرَجِ',
          troopType: 'infantry',
          soldierCount: 90,
          commander: 'al-Hubab ibn al-Mundhir',
          startPosition: { x: 580, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
      ],
    },

    // ─── Quraysh Forces (~3,000) ───────────────────────────────────────────
    {
      faction: 'quraysh',
      label: 'Quraysh Forces',
      labelAr: 'جَيْشُ قُرَيْشٍ',
      totalStrength: 3000,
      units: [
        {
          id: 'quraysh-center',
          name: "Quraysh Center — Abu Sufyan's Command",
          nameAr: 'كَتِيبَةُ قَلْبِ قُرَيْشٍ — قِيَادَةُ أَبِي سُفْيَانَ',
          troopType: 'command',
          soldierCount: 1300,
          commander: 'Abu Sufyan ibn Harb',
          startPosition: { x: 800, y: 770 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north toward Muslims
          stats: { attack: 7, defense: 8, speed: 5, morale: 7 },
        },
        {
          // The Banu 'Abd ad-Dar standard — Talha ibn Abi Talha "Kabsh
          // al-Katiba" felled by Ali; ~9 standard-bearers fell
          id: 'quraysh-banner-abdaldar',
          name: "Banu 'Abd ad-Dar Banner",
          nameAr: 'كَتِيبَةُ لِوَاءِ بَنِي عَبْدِ الدَّارِ',
          troopType: 'infantry',
          soldierCount: 80,
          commander: "Talha ibn Abi Talha al-'Abdari (Kabsh al-Katiba)",
          startPosition: { x: 800, y: 720 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 7 },
        },
        {
          // Khalid's right cavalry — the wing that wheeled around
          // Jabal al-Rumat
          id: 'quraysh-cavalry-right',
          name: "Right Cavalry — Khalid",
          nameAr: 'كَتِيبَةُ خَيْلِ المَيْمَنَةِ — خَالِدُ بْنُ الوَلِيدِ',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: 'Khalid ibn al-Walid al-Makhzumi',
          startPosition: { x: 1280, y: 700 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 9, morale: 8 },
        },
        {
          // 'Ikrimah's left cavalry — followed Khalid's track
          id: 'quraysh-cavalry-left',
          name: "Left Cavalry — 'Ikrimah",
          nameAr: 'كَتِيبَةُ خَيْلِ المَيْسَرَةِ — عِكْرِمَةُ بْنُ أَبِي جَهْلٍ',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: "'Ikrimah ibn Abi Jahl al-Makhzumi",
          startPosition: { x: 320, y: 700 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 9, morale: 7 },
        },
        {
          // Quraysh skirmishing archers
          id: 'quraysh-archers',
          name: 'Quraysh Archers',
          nameAr: 'كَتِيبَةُ نُبَّالَةِ قُرَيْشٍ',
          troopType: 'archers',
          soldierCount: 100,
          commander: "'Abdullah ibn Abi Rabi'a al-Makhzumi",
          startPosition: { x: 800, y: 820 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 5, speed: 5, morale: 6 },
        },
        {
          // 'Amr ibn al-'As's mixed cavalry detachment
          id: 'quraysh-cavalry-detachment',
          name: "'Amr ibn al-'As's Detachment",
          nameAr: 'كَتِيبَةُ فُرْسَانِ عَمْرٍو',
          troopType: 'horse_archer',
          soldierCount: 50,
          commander: "'Amr ibn al-'As",
          startPosition: { x: 1000, y: 730 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 7 },
        },
        {
          // Hind bint 'Utba and the women with their duff drums — she
          // hired Wahshi to kill Hamza in revenge for her father at Badr
          id: 'quraysh-women-drum',
          name: "The Drum-Women (Hind's Train)",
          nameAr: 'كَتِيبَةُ نِسَاءِ الدُّفِّ — مَع هِنْدَ بِنْتَ عُتْبَةَ',
          troopType: 'reserves',
          soldierCount: 15,
          commander: "Hind bint 'Utba",
          startPosition: { x: 800, y: 850 },
          startFormation: 'scattered',
          startFacing: -Math.PI / 2,
          stats: { attack: 3, defense: 4, speed: 4, morale: 7 },
        },
      ],
    },
  ],

  // ─── Phases (68 simulation seconds) ──────────────────────────────────────
  phases: [
    // Phase 1 (0–5s): Ibn Ubayy's defection at al-Shawt
    {
      id: 'phase-01-defection-shawt',
      name: "Ibn Ubayy's Defection at al-Shawt",
      nameAr: 'انْسِحَابُ ابْنِ أُبَيٍّ بِالشَّوْطِ',
      startTime: 0,
      duration: 5,
      description:
        "At al-Shawt, between Medina and Uhud, 'Abdullah ibn Ubayy peels off with ~300 munafiqun — the column drops from ~1,000 to ~700. Censured by Q 3:166-168; Bukhari 4051 preserves Banu Salama and Banu Haritha 'almost faltering.'",
      actions: [
        { type: 'camera_move', params: { x: 1100, y: 850, zoom: 0.55, duration: 3 }, delay: 0 },
        // The remaining 700 march north toward the deployment area
        { type: 'move_unit', targetUnitId: 'muslim-center-line', params: { position: { x: 800, y: 320 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-muhajirun-banner', params: { position: { x: 800, y: 280 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-aws-banner', params: { position: { x: 1020, y: 350 }, speed: 80 }, delay: 1.2 },
        { type: 'move_unit', targetUnitId: 'muslim-khazraj-banner', params: { position: { x: 580, y: 350 }, speed: 80 }, delay: 1.2 },
        { type: 'move_unit', targetUnitId: 'muslim-hamza-vanguard', params: { position: { x: 720, y: 380 }, speed: 90 }, delay: 1.5 },
      ],
      triggers: [],
    },

    // Phase 2 (5–11s): Deployment under the mountain — the archers' order
    {
      id: 'phase-02-deployment',
      name: 'Deployment & The Archers\' Order',
      nameAr: 'التَّعْبِئَةُ تَحْتَ الجَبَلِ وَأَمْرُ الرُّمَاةِ',
      startTime: 5,
      duration: 6,
      description:
        "Saturday morning, 7 Shawwal 3 AH. The Prophet ﷺ arrays ~700 men on the lower southern slopes of Uhud, mountain at their back. Fifty archers under Abdullah ibn Jubayr posted on Jabal al-Rumat with the standing order recorded in Bukhari 3039: 'Even if you see birds snatching us, do not leave this position.'",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.55, duration: 2.5 }, delay: 0 },
        // The archers ascend Jabal al-Rumat
        { type: 'move_unit', targetUnitId: 'muslim-archers-rumat', params: { position: { x: 480, y: 460 }, speed: 60 }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'muslim-archers-rumat', params: { formation: 'defensive_circle' }, delay: 2.5 },
        // Quraysh deploy on their side
        { type: 'move_unit', targetUnitId: 'quraysh-center', params: { position: { x: 800, y: 770 }, speed: 60 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'quraysh-banner-abdaldar', params: { position: { x: 800, y: 720 }, speed: 60 }, delay: 1.2 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-right', params: { position: { x: 1280, y: 700 }, speed: 90 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-left', params: { position: { x: 320, y: 700 }, speed: 90 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-archers', params: { position: { x: 800, y: 820 }, speed: 55 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-detachment', params: { position: { x: 1000, y: 730 }, speed: 90 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-women-drum', params: { position: { x: 800, y: 850 }, speed: 40 }, delay: 1.5 },
        // Camera tightens on the archers for the standing order
        { type: 'camera_move', params: { x: 480, y: 460, zoom: 0.85, duration: 3.5 }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 3 (11–17s): The duels and the falling banners
    {
      id: 'phase-03-mubaraza-banners',
      name: 'Single Combat & The Falling Banners',
      nameAr: 'المُبَارَزَةُ وَسُقُوطُ حَمَلَةِ اللِّوَاءِ',
      startTime: 11,
      duration: 6,
      description:
        "Single combat opens. Talha ibn Abi Talha al-'Abdari — 'Kabsh al-Katiba' — challenges; Ali strikes him down. The Banu 'Abd ad-Dar standard passes in succession through his brothers and sons; ~9 standard-bearers fall before the Meccan center wavers.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 470, zoom: 0.7, duration: 1.5 }, delay: 0 },
        // The Banu 'Abd ad-Dar banner moves slightly forward for the duel
        { type: 'move_unit', targetUnitId: 'quraysh-banner-abdaldar', params: { position: { x: 800, y: 600 }, speed: 60 }, delay: 0.5 },
        // The Muslim center steps forward to engage
        { type: 'move_unit', targetUnitId: 'muslim-muhajirun-banner', params: { position: { x: 800, y: 460 }, speed: 60 }, delay: 1.5 },
        { type: 'camera_move', params: { x: 800, y: 530, zoom: 0.9, duration: 4.5 }, delay: 1.5 },
        // The banner-bearers fall in succession — represented as repeated attacks
        { type: 'attack_unit', targetUnitId: 'muslim-muhajirun-banner', params: { targetId: 'quraysh-banner-abdaldar' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'quraysh-banner-abdaldar', params: { formation: 'scattered' }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 4 (17–24s): General melee, Hamza's charge, Quraysh rout
    {
      id: 'phase-04-melee-and-rout',
      name: "The Charge & Quraysh's Rout",
      nameAr: 'الالْتِحَامُ وَانْكِسَارُ قُرَيْشٍ',
      startTime: 17,
      duration: 7,
      description:
        "General engagement. Hamza fights with two swords; Abu Dujana takes the Prophet's ﷺ sword wearing the red 'isabat al-mawt. The Muslim line presses; Quraysh center collapses, the Meccans flee, and Muslims begin gathering spoils — the false dawn of victory.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.55, duration: 2 }, delay: 0 },
        // Hamza's vanguard punches through
        { type: 'set_behavior', targetUnitId: 'muslim-hamza-vanguard', params: { behavior: 'attacking' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'muslim-hamza-vanguard', params: { position: { x: 720, y: 580 }, speed: 100 }, delay: 0 },
        { type: 'attack_unit', targetUnitId: 'muslim-hamza-vanguard', params: { targetId: 'quraysh-banner-abdaldar' }, delay: 1.5 },
        // Wings press in
        { type: 'set_behavior', targetUnitId: 'muslim-aws-banner', params: { behavior: 'attacking' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-aws-banner', params: { position: { x: 1020, y: 580 }, speed: 80 }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'muslim-khazraj-banner', params: { behavior: 'attacking' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-khazraj-banner', params: { position: { x: 580, y: 580 }, speed: 80 }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'muslim-center-line', params: { behavior: 'advancing' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-center-line', params: { position: { x: 800, y: 540 }, speed: 70 }, delay: 1.5 },
        { type: 'attack_unit', targetUnitId: 'muslim-center-line', params: { targetId: 'quraysh-center' }, delay: 3 },
        // Quraysh center retreats
        { type: 'set_behavior', targetUnitId: 'quraysh-center', params: { behavior: 'retreating' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'quraysh-center', params: { position: { x: 800, y: 870 }, speed: 90 }, delay: 4 },
        { type: 'destroy_unit', targetUnitId: 'quraysh-banner-abdaldar', params: { cause: 'banner_falls' }, delay: 5 },
        { type: 'camera_move', params: { x: 800, y: 600, zoom: 0.5, duration: 2 }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 5 (24–29s): The archers descend
    {
      id: 'phase-05-archers-descend',
      name: 'The Archers Descend the Hill',
      nameAr: 'نُزُولُ الرُّمَاةِ عَنِ الجَبَلِ',
      startTime: 24,
      duration: 5,
      description:
        "Believing the battle won, ~40 of the 50 archers descend Jabal al-Rumat to share spoils, against Ibn Jubayr's protests. He and ~10 hold the post. Q 3:152: 'حَتَّى إِذَا فَشِلْتُمْ وَتَنَازَعْتُمْ فِي الأَمْرِ وَعَصَيْتُم.'",
      actions: [
        { type: 'camera_move', params: { x: 480, y: 460, zoom: 0.9, duration: 3 }, delay: 0 },
        // The archers descend — formation breaks; most leave the knoll
        { type: 'change_formation', targetUnitId: 'muslim-archers-rumat', params: { formation: 'scattered' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-archers-rumat', params: { position: { x: 580, y: 600 }, speed: 80 }, delay: 1.5 },
        // Tilt to reveal Khalid's wheel beginning
        { type: 'camera_move', params: { x: 420, y: 600, zoom: 0.85, duration: 2 }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 6 (29–35s): Khalid's flanking strike
    {
      id: 'phase-06-khalid-flank',
      name: "Khalid's Flanking Strike",
      nameAr: 'كَرَّةُ خَالِدٍ عَلَى الظُّهُورِ',
      startTime: 29,
      duration: 6,
      description:
        "Khalid wheels the right cavalry around the abandoned Jabal al-Rumat, Ikrimah trailing. They overrun Ibn Jubayr's holdouts and strike the Muslim rear — a textbook double envelopment, the canonical military hinge of Uhud.",
      actions: [
        { type: 'camera_move', params: { x: 380, y: 540, zoom: 0.7, duration: 4 }, delay: 0 },
        // Khalid's wheel — sweeps west around the knoll into the Muslim rear
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry-right', params: { behavior: 'flanking' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-right', params: { position: { x: 600, y: 500 }, speed: 150 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-right', params: { position: { x: 800, y: 350 }, speed: 150 }, delay: 2 },
        // Ikrimah's wing follows
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry-left', params: { behavior: 'flanking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-left', params: { position: { x: 500, y: 500 }, speed: 140 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-left', params: { position: { x: 700, y: 380 }, speed: 140 }, delay: 2.5 },
        // The 10 holdouts on the knoll are overrun
        { type: 'attack_unit', targetUnitId: 'quraysh-cavalry-right', params: { targetId: 'muslim-archers-rumat' }, delay: 1.5 },
        { type: 'destroy_unit', targetUnitId: 'muslim-archers-rumat', params: { cause: 'overrun' }, delay: 3 },
        // Strike the Muslim rear — formations break
        { type: 'attack_unit', targetUnitId: 'quraysh-cavalry-right', params: { targetId: 'muslim-center-line' }, delay: 3.5 },
        { type: 'change_formation', targetUnitId: 'muslim-center-line', params: { formation: 'scattered' }, delay: 4 },
        { type: 'change_formation', targetUnitId: 'muslim-aws-banner', params: { formation: 'scattered' }, delay: 4.5 },
        { type: 'change_formation', targetUnitId: 'muslim-khazraj-banner', params: { formation: 'scattered' }, delay: 4.5 },
        // Quraysh center rallies
        { type: 'set_behavior', targetUnitId: 'quraysh-center', params: { behavior: 'advancing' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'quraysh-center', params: { position: { x: 800, y: 600 }, speed: 80 }, delay: 4 },
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.45, duration: 2 }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 7 (35–41s): The martyrdom of Hamza
    {
      id: 'phase-07-hamza-falls',
      name: 'The Fall of the Master of Martyrs',
      nameAr: 'سُقُوطُ سَيِّدِ الشُّهَدَاءِ',
      startTime: 35,
      duration: 6,
      description:
        "Wahshi ibn Harb hurls his Abyssinian harbah javelin into Hamza's lower abdomen — Bukhari 4072: 'فَأَضَعُهَا فِي ثُنَّتِهِ حَتَّى خَرَجَتْ مِنْ بَيْنِ وَرِكَيْهِ.' Hind bint 'Utba had hired him in revenge for her father slain at Badr; afterwards she mutilated the body. The Prophet ﷺ called him Asad Allah, Sayyid ash-Shuhada.",
      actions: [
        { type: 'camera_move', params: { x: 720, y: 450, zoom: 0.92, duration: 5.5 }, delay: 0 },
        // Hamza's vanguard takes a single critical hit
        { type: 'change_formation', targetUnitId: 'muslim-hamza-vanguard', params: { formation: 'defensive_circle' }, delay: 1 },
        { type: 'destroy_unit', targetUnitId: 'muslim-hamza-vanguard', params: { cause: 'hamza_martyred' }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 8 (41–47s): Mus'ab's martyrdom and the rumor
    {
      id: 'phase-08-musab-rumor',
      name: "Mus'ab's Martyrdom & The Rumor",
      nameAr: 'شَهَادَةُ مُصْعَبٍ وَإِشَاعَةُ مَقْتَلِ النَّبِيِّ ﷺ',
      startTime: 41,
      duration: 6,
      description:
        "Mus'ab ibn 'Umayr falls holding the Muhajirun banner; Ibn Qami'a, mistaking him for the Prophet ﷺ due to physical resemblance, rides back shouting 'I have killed Muhammad!' The rumor spreads. Allah revealed Q 3:144: 'وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِنْ قَبْلِهِ الرُّسُلُ.' Bukhari 4047: Mus'ab buried in a single namira cloth too short for both head and feet.",
      actions: [
        { type: 'camera_move', params: { x: 770, y: 470, zoom: 0.88, duration: 4.5 }, delay: 0 },
        // The Muhajirun banner unit takes catastrophic damage
        { type: 'attack_unit', targetUnitId: 'quraysh-cavalry-right', params: { targetId: 'muslim-muhajirun-banner' }, delay: 0.5 },
        { type: 'destroy_unit', targetUnitId: 'muslim-muhajirun-banner', params: { cause: 'musab_martyred' }, delay: 3 },
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.55, duration: 2.5 }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 9 (47–54s): The Prophet ﷺ wounded; the shi'b
    {
      id: 'phase-09-prophet-wounded-shib',
      name: "The Prophet ﷺ Wounded; The Shi'b",
      nameAr: 'جُرْحُ النَّبِيِّ ﷺ وَالانْحِيَازُ إِلَى الشِّعْبِ',
      startTime: 47,
      duration: 7,
      description:
        "The Prophet ﷺ is wounded: 'Utba ibn Abi Waqqas hurls a stone breaking his rabaiyah tooth and splitting his lip; Ibn Qami'a strikes him, driving two helmet rings into his cheek; Ibn Shihab cuts his lip. Talha ibn 'Ubaydullah catches blows on his hand — paralyzed forever (Bukhari 4063). Sa'd shoots arrows the Prophet ﷺ hands him: 'ارْمِ فِدَاكَ أَبِي وَأُمِّي' (Bukhari 4055). Abu Dujana shields him with his back; Umm 'Ammarah Nusaybah takes 13 wounds defending him. The Prophet ﷺ is led into the shi'b on Uhud's slope. Sa'd and Ibn 'Abbas saw two angels in white fighting beside him (Bukhari 4054, Muslim 2306).",
      actions: [
        { type: 'camera_move', params: { x: 850, y: 380, zoom: 0.95, duration: 4 }, delay: 0 },
        // The center-line unit shifts north toward the shi'b
        { type: 'change_formation', targetUnitId: 'muslim-center-line', params: { formation: 'defensive_circle' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-center-line', params: { behavior: 'regrouping' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-center-line', params: { position: { x: 880, y: 200 }, speed: 50 }, delay: 1 },
        // Wings rally toward the Prophet's ﷺ position
        { type: 'set_behavior', targetUnitId: 'muslim-aws-banner', params: { behavior: 'regrouping' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-aws-banner', params: { position: { x: 1000, y: 280 }, speed: 60 }, delay: 1.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-khazraj-banner', params: { behavior: 'regrouping' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-khazraj-banner', params: { position: { x: 700, y: 280 }, speed: 60 }, delay: 1.5 },
        // Pull and tilt up the slope toward the shi'b
        { type: 'camera_move', params: { x: 880, y: 200 }, delay: 4.5 },
        { type: 'camera_move', params: { x: 880, y: 200, zoom: 0.7, duration: 2.5 }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 10 (54–60s): Abu Sufyan's heights dialogue
    {
      id: 'phase-10-abu-sufyan-dialogue',
      name: "Abu Sufyan's Heights Dialogue",
      nameAr: 'حِوَارُ أَبِي سُفْيَانَ عَلَى الجَبَلِ',
      startTime: 54,
      duration: 6,
      description:
        "Abu Sufyan ascends a height and shouts — Bukhari 4043: 'Hubal be exalted!' The Prophet ﷺ commands: 'Answer him: Allah is Higher and Mightier.' Then 'We have al-'Uzza, you have no 'Uzza' — 'Allah is our Patron, you have no patron.' He closes: 'A day for the day of Badr; war is alternating fortunes.' Quraysh withdraw — no prisoners taken on either side. They cannot press into Medina.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 700, zoom: 0.8, duration: 4 }, delay: 0 },
        // Abu Sufyan's command climbs to the heights
        { type: 'move_unit', targetUnitId: 'quraysh-center', params: { position: { x: 800, y: 750 }, speed: 50 }, delay: 0.5 },
        // Quraysh begin southward withdrawal
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry-right', params: { behavior: 'retreating' }, delay: 3 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-right', params: { position: { x: 1300, y: 950 }, speed: 110 }, delay: 3 },
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry-left', params: { behavior: 'retreating' }, delay: 3 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-left', params: { position: { x: 300, y: 950 }, speed: 110 }, delay: 3 },
        { type: 'set_behavior', targetUnitId: 'quraysh-archers', params: { behavior: 'retreating' }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-archers', params: { position: { x: 800, y: 950 }, speed: 80 }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-women-drum', params: { position: { x: 800, y: 970 }, speed: 60 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry-detachment', params: { position: { x: 1100, y: 950 }, speed: 100 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'quraysh-center', params: { position: { x: 800, y: 950 }, speed: 70 }, delay: 4.5 },
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.4, duration: 2 }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 11 (60–68s): Hamra al-Asad
    {
      id: 'phase-11-hamra-al-asad',
      name: 'The March to Hamra al-Asad',
      nameAr: 'مُلَاحَقَةُ حَمْرَاءَ الأَسَدِ',
      startTime: 60,
      duration: 8,
      description:
        "Sunday, 8 Shawwal 3 AH — the day after Uhud. Despite wounds, the Prophet ﷺ orders pursuit limited to those who fought at Uhud (excluding Ibn Ubayy's men). They march ~13 km southwest to Hamra al-Asad and light ~500 fires at night to inflate apparent numbers; Abu Sufyan, debating a return strike, abandons it. Allah revealed Q 3:172-174: 'الَّذِينَ اسْتَجَابُوا لِلَّهِ وَالرَّسُولِ مِنْ بَعْدِ مَا أَصَابَهُمُ القَرْحُ.' (Bukhari 4077.) The seventy martyrs are buried at Uhud's foot.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 350, zoom: 0.5, duration: 3 }, delay: 0 },
        // Burial scene — the wounded units regroup at the mountain foot
        { type: 'change_formation', targetUnitId: 'muslim-aws-banner', params: { formation: 'line' }, delay: 1.5 },
        { type: 'change_formation', targetUnitId: 'muslim-khazraj-banner', params: { formation: 'line' }, delay: 1.5 },
        // The wounded Companions march southwest to Hamra al-Asad
        { type: 'camera_move', params: { x: 400, y: 800, zoom: 0.55, duration: 2.5 }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'muslim-center-line', params: { position: { x: 250, y: 940 }, speed: 80 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'muslim-aws-banner', params: { position: { x: 350, y: 940 }, speed: 75 }, delay: 4.5 },
        { type: 'move_unit', targetUnitId: 'muslim-khazraj-banner', params: { position: { x: 150, y: 940 }, speed: 75 }, delay: 4.5 },
        { type: 'camera_move', params: { x: 250, y: 940, zoom: 0.7, duration: 1.5 }, delay: 6 },
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.4, duration: 0.5 }, delay: 7.5 },
      ],
      triggers: [],
    },
  ],

  // ─── Narration ─────────────────────────────────────────────────────────────
  narration: [
    {
      id: 'narr-01-shawt',
      time: 0.5,
      duration: 4,
      text: "At al-Shawt, on the threshold of Uhud, 'Abdullah ibn Ubayy peeled off with a third of the army — some three hundred turned back; seven hundred remained with the Prophet ﷺ.",
      textAr:
        'عِنْدَ الشَّوْطِ، عَلَى مَشَارِفِ أُحُدٍ، انْسَلَخَ عَبْدُ اللَّهِ بْنُ أُبَيٍّ بِثُلُثِ الجَيْشِ، فَعَادَ بِنَحْوِ ثَلَاثِمِئَةٍ، وَبَقِيَ مَعَ النَّبِيِّ ﷺ سَبْعُمِئَةٍ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-02-disbelief',
      time: 4.6,
      duration: 3,
      text: "Allah declared in Surah Al 'Imran 167: 'They were that day nearer to disbelief than to faith.'",
      textAr:
        'قَالَ تَعَالَى: ﴿هُمْ لِلْكُفْرِ يَوْمَئِذٍ أَقْرَبُ مِنْهُمْ لِلْإِيمَانِ﴾ (آل عمران 167).',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-03-archer-order',
      time: 7.5,
      duration: 5,
      text: "The Prophet ﷺ appointed 'Abdullah ibn Jubayr over fifty archers and ordered: 'Even if you see birds snatching us, do not leave this position of yours until I send for you.' (Bukhari 3039)",
      textAr:
        'أَمَّرَ النَّبِيُّ ﷺ عَلَى الرُّمَاةِ — وَكَانُوا خَمْسِينَ — عَبْدَ اللَّهِ بْنَ جُبَيْرٍ، وَقَالَ لَهُمْ: «إِنْ رَأَيْتُمُونَا تَخْطَفُنَا الطَّيْرُ فَلَا تَبْرَحُوا مَكَانَكُمْ هَذَا حَتَّى أُرْسِلَ إِلَيْكُمْ» (البخاري ٣٠٣٩).',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-04-banners',
      time: 12,
      duration: 5,
      text: "Talha ibn Abi Talha — 'the Ram of the Squadron' — stepped forward as Quraysh standard-bearer; Ali struck him down. Then his brothers and sons raised the banner one after another, and the sword reaped them; the Banu 'Abd ad-Dar fell around their flag.",
      textAr:
        'بَرَزَ حَامِلُ لِوَاءِ قُرَيْشٍ طَلْحَةُ بْنُ أَبِي طَلْحَةَ، المُلَقَّبُ بِـ «كَبْشِ الكَتِيبَةِ»، فَصَرَعَهُ عَلِيٌّ. ثُمَّ رَفَعَ اللِّوَاءَ إِخْوَتُهُ وَبَنُو أَبِيهِ وَاحِدًا إِثْرَ وَاحِدٍ، فَتَحَاصَدَهُمُ السَّيْفُ، فَسَقَطَ بَنُو عَبْدِ الدَّارِ حَوْلَ رَايَتِهِمْ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-05-hamza-charge',
      time: 17.5,
      duration: 4,
      text: "Hamza, Lion of God, plunged forward with two swords, and Abu Dujana drew the Prophet's ﷺ sword wearing the red headband of death; the Quraysh center split open before them.",
      textAr:
        'وَثَبَ حَمْزَةُ أَسَدُ اللَّهِ بِسَيْفَيْنِ يَجْتَزِرُ الصُّفُوفَ، وَجَرَّدَ أَبُو دُجَانَةَ سَيْفَ النَّبِيِّ ﷺ بِعِصَابَةِ المَوْتِ الحَمْرَاءِ، فَانْفَرَجَ قَلْبُ قُرَيْشٍ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-06-rout',
      time: 21.5,
      duration: 2.5,
      text: 'The polytheists fled the field; the Muslims fell upon the spoils, exulting in a victory not yet sealed.',
      textAr:
        'وَانْهَزَمَ المُشْرِكُونَ فَرّاً، وَأَقْبَلَ المُسْلِمُونَ عَلَى الغَنِيمَةِ، وَفَرِحَ الفَرِحُونَ بِفَتْحٍ لَمْ يُتَمَّمْ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-07-disobedience',
      time: 24.5,
      duration: 4,
      text: "When the archers saw the spoils, forty descended the hill; Ibn Jubayr held with ten. Allah said in 3:152: 'until you wavered and disputed about the order and disobeyed after He had shown you that which you love.'",
      textAr:
        'فَلَمَّا رَأَى الرُّمَاةُ الغَنِيمَةَ نَزَلَ أَرْبَعُونَ عَنِ الجَبَلِ، وَثَبَتَ ابْنُ جُبَيْرٍ فِي عَشَرَةٍ. قَالَ تَعَالَى: ﴿حَتَّى إِذَا فَشِلْتُمْ وَتَنَازَعْتُمْ فِي الأَمْرِ وَعَصَيْتُم مِّن بَعْدِ مَا أَرَاكُم مَّا تُحِبُّونَ﴾ (آل عمران 152).',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-08-khalid-flank',
      time: 29.5,
      duration: 5,
      text: "Khalid ibn al-Walid saw the gap and wheeled the right cavalry around the hill, 'Ikrimah trailing him; they overran the archers, martyring Ibn Jubayr, then crashed against the Muslim rear like a thunderbolt from where they did not expect.",
      textAr:
        'أَبْصَرَ خَالِدُ بْنُ الوَلِيدِ الثَّغْرَ، فَلَوَى خَيْلَ المَيْمَنَةِ حَوْلَ الجَبَلِ، وَتَبِعَهُ عِكْرِمَةُ، فَاجْتَاحُوا الرُّمَاةَ وَسَقَطَ ابْنُ جُبَيْرٍ شَهِيدًا، ثُمَّ ارْتَدُّوا عَلَى ظُهُورِ المُسْلِمِينَ صَاعِقَةً مِنْ حَيْثُ لَمْ يَحْتَسِبُوا.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-09-hamza-falls',
      time: 35.5,
      duration: 5.5,
      text: "Wahshi ibn Harb stalked Hamza behind a rock. He said: 'When he drew near, I hurled my javelin at him, planting it in his lower abdomen until it came out from between his hips' (Bukhari 4072). The Master of Martyrs fell, and his body was mutilated by Hind bint 'Utba in vengeance for her father slain at Badr.",
      textAr:
        'وَرَصَدَ وَحْشِيُّ بْنُ حَرْبٍ حَمْزَةَ خَلْفَ صَخْرَةٍ. قَالَ وَحْشِيٌّ: «فَلَمَّا دَنَا مِنِّي رَمَيْتُهُ بِحَرْبَتِي، فَأَضَعُهَا فِي ثُنَّتِهِ حَتَّى خَرَجَتْ مِنْ بَيْنِ وَرِكَيْهِ» (البخاري ٤٠٧٢). فَسَقَطَ سَيِّدُ الشُّهَدَاءِ، ثُمَّ مُثِّلَ بِجَسَدِهِ عَلَى يَدَيْ هِنْدٍ بِنْتَ عُتْبَةَ انْتِقَامًا لِأَبِيهَا دَفِينِ بَدْرٍ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-10-musab',
      time: 41.5,
      duration: 4,
      text: "Mus'ab ibn 'Umayr held the Muhajirun banner; his right hand was severed, he raised it with his left; the left was cut, he clutched it to his chest; then Ibn Qami'a's spear ran him through. Khabbab said: 'He was killed at Uhud, leaving nothing but a striped cloak' (Bukhari 4047).",
      textAr:
        'وَثَبَتَ مُصْعَبُ بْنُ عُمَيْرٍ عَلَى لِوَاءِ المُهَاجِرِينَ، فَضُرِبَتْ يَدُهُ الْيُمْنَى فَرَفَعَ اللِّوَاءَ بِالْيُسْرَى، ثُمَّ ضُرِبَ ثَانِيَةً فَأَمْسَكَهُ بِصَدْرِهِ، ثُمَّ خُرِقَ بِرُمْحِ ابْنِ قَمِيئَةَ. قَالَ خَبَّابٌ: «قُتِلَ يَوْمَ أُحُدٍ، لَمْ يَتْرُكْ إِلَّا نَمِرَةً» (البخاري ٤٠٤٧).',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-11-rumor',
      time: 45.5,
      duration: 3,
      text: "Ibn Qami'a cried, 'Muhammad has been killed!' Then Allah revealed: 'Muhammad is no more than a Messenger; messengers have passed away before him' (Al 'Imran 144).",
      textAr:
        'فَصَرَخَ ابْنُ قَمِيئَةَ: «قُتِلَ مُحَمَّدٌ!» فَأَنْزَلَ اللَّهُ: ﴿وَمَا مُحَمَّدٌ إِلَّا رَسُولٌ قَدْ خَلَتْ مِنْ قَبْلِهِ الرُّسُلُ﴾ (آل عمران 144).',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-12-prophet-wounded',
      time: 48,
      duration: 5,
      text: "The Prophet ﷺ was struck by a stone that broke his rabaiyah tooth and gashed his face; his helmet was shattered upon his head until two of its rings drove into his cheek (Bukhari 4075). Talha ibn 'Ubaydullah caught the blows on his hand — it was paralyzed forever.",
      textAr:
        'وَرُمِيَ النَّبِيُّ ﷺ بِحَجَرٍ فَكُسِرَتْ رَبَاعِيَتُهُ، وَشُجَّ وَجْهُهُ، وَكُسِرَتْ البَيْضَةُ عَلَى رَأْسِهِ حَتَّى دَخَلَتْ حَلَقَتَانِ فِي خَدِّهِ (البخاري ٤٠٧٥). وَوَقَتْ طَلْحَةُ بْنُ عُبَيْدِ اللَّهِ يَدَهُ دُونَ وَجْهِهِ فَشُلَّتْ إِلَى الأَبَدِ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-13-arrows',
      time: 51,
      duration: 3,
      text: "The Prophet ﷺ handed Sa'd arrows and said: 'Shoot, may my father and mother be sacrificed for you' (Bukhari 4055). And Abu Dujana shielded the Prophet ﷺ with his back until arrows lodged in it.",
      textAr:
        'وَنَاوَلَ النَّبِيُّ ﷺ سَعْدًا سِهَامًا وَقَالَ: «ارْمِ فِدَاكَ أَبِي وَأُمِّي» (البخاري ٤٠٥٥). وَسَتَرَ أَبُو دُجَانَةَ النَّبِيَّ ﷺ بِظَهْرِهِ حَتَّى غَرَسَتْ فِيهِ السِّهَامُ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-14-abu-sufyan',
      time: 54.5,
      duration: 5,
      text: "Abu Sufyan climbed the heights and shouted: 'Hubal be exalted!' The Prophet ﷺ commanded: 'Answer him: Allah is Higher and Mightier.' He said: 'We have al-'Uzza, you have no 'Uzza!' — 'Say: Allah is our Patron, you have no patron' (Bukhari 4043). Then he declared: 'A day for the day of Badr; war is alternating fortunes' — and the Quraysh withdrew.",
      textAr:
        'صَعِدَ أَبُو سُفْيَانَ الجَبَلَ فَصَاحَ: «أُعْلُ هُبَلْ!». فَأَمَرَ النَّبِيُّ ﷺ: «أَجِيبُوهُ، قُولُوا: اللَّهُ أَعْلَى وَأَجَلُّ». قَالَ: «لَنَا العُزَّى وَلَا عُزَّى لَكُمْ». قَالَ ﷺ: «قُولُوا: اللَّهُ مَوْلَانَا وَلَا مَوْلَى لَكُمْ» (البخاري ٤٠٤٣). ثُمَّ أَعْلَنَ: «يَوْمٌ بِيَوْمِ بَدْرٍ، وَالحَرْبُ سِجَالٌ»، ثُمَّ انْصَرَفُوا.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-15-hamra',
      time: 60,
      duration: 7,
      text: "Seventy martyrs were buried beneath Uhud. The next day the Prophet ﷺ marched out in pursuit; they reached Hamra al-Asad and lit five hundred fires — Abu Sufyan abandoned his return. Allah said in 3:172: 'Those who responded to Allah and the Messenger after injury had befallen them.' Medina did not fall, the call did not break, and Uhud became a school for the Umma until the Day of Judgment.",
      textAr:
        'وَفَّى المُسْلِمُونَ سَبْعِينَ شَهِيدًا تَحْتَ أُحُدٍ، وَفِي الغَدِ أَمَرَ النَّبِيُّ ﷺ بِالخُرُوجِ لِمُلَاحَقَةِ العَدُوِّ، فَبَلَغُوا حَمْرَاءَ الأَسَدِ وَأَوْقَدُوا خَمْسَ مِئَةِ نَارٍ، فَتَجَنَّبَ أَبُو سُفْيَانَ العَوْدَ. قَالَ تَعَالَى: ﴿الَّذِينَ اسْتَجَابُوا لِلَّهِ وَالرَّسُولِ مِنْ بَعْدِ مَا أَصَابَهُمُ القَرْحُ﴾ (آل عمران 172). فَلَمْ تَسْقُطِ المَدِينَةُ، وَثَبَتَتِ الدَّعْوَةُ، وَصَارَ أُحُدٌ مَدْرَسَةً لِلْأُمَّةِ إِلَى يَوْمِ الدِّينِ.',
      style: 'quote',
      position: 'bottom',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    { time: 0, position: { x: 800, y: 700 }, zoom: 0.45, duration: 2, easing: 'power2.out', type: 'overview' },
    { time: 2, position: { x: 700, y: 750 }, zoom: 0.6, duration: 3, easing: 'power2.inOut', type: 'pan' },
    { time: 5, position: { x: 800, y: 500 }, zoom: 0.55, duration: 2.5, easing: 'power2.out', type: 'overview' },
    { time: 7.5, position: { x: 480, y: 460 }, zoom: 0.85, duration: 3.5, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-archers-rumat' },
    { time: 11, position: { x: 800, y: 470 }, zoom: 0.7, duration: 1.5, easing: 'power2.out', type: 'pan' },
    { time: 12.5, position: { x: 800, y: 530 }, zoom: 0.9, duration: 4.5, easing: 'power3.out', type: 'focus' },
    { time: 17, position: { x: 800, y: 500 }, zoom: 0.55, duration: 2, easing: 'power2.out', type: 'overview' },
    { time: 19, position: { x: 720, y: 460 }, zoom: 0.85, duration: 3, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-hamza-vanguard' },
    { time: 22, position: { x: 850, y: 600 }, zoom: 0.5, duration: 2.5, easing: 'power2.out', type: 'overview' },
    { time: 24.5, position: { x: 480, y: 460 }, zoom: 0.9, duration: 3, easing: 'power3.out', type: 'focus' },
    { time: 27.5, position: { x: 420, y: 600 }, zoom: 0.85, duration: 2, easing: 'power2.inOut', type: 'pan' },
    { time: 29.5, position: { x: 600, y: 500 }, zoom: 0.7, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'quraysh-cavalry-right' },
    { time: 33.5, position: { x: 800, y: 500 }, zoom: 0.45, duration: 2, easing: 'power2.out', type: 'overview' },
    { time: 35.5, position: { x: 720, y: 450 }, zoom: 0.92, duration: 5.5, easing: 'power3.out', type: 'focus' },
    { time: 41, position: { x: 770, y: 470 }, zoom: 0.88, duration: 4.5, easing: 'power3.out', type: 'focus', followEntityId: 'muslim-muhajirun-banner' },
    { time: 45.5, position: { x: 800, y: 500 }, zoom: 0.55, duration: 2.5, easing: 'power2.out', type: 'overview' },
    { time: 48, position: { x: 850, y: 380 }, zoom: 0.95, duration: 4, easing: 'power3.out', type: 'focus', followEntityId: 'muslim-center-line' },
    { time: 52, position: { x: 880, y: 220 }, zoom: 0.7, duration: 2.5, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-center-line' },
    { time: 54.5, position: { x: 800, y: 700 }, zoom: 0.8, duration: 4, easing: 'power2.inOut', type: 'focus' },
    { time: 58.5, position: { x: 800, y: 500 }, zoom: 0.4, duration: 2, easing: 'power2.out', type: 'overview' },
    { time: 60.5, position: { x: 800, y: 350 }, zoom: 0.5, duration: 3, easing: 'power2.inOut', type: 'overview' },
    { time: 63.5, position: { x: 250, y: 940 }, zoom: 0.55, duration: 2.5, easing: 'power2.inOut', type: 'pan' },
    { time: 66, position: { x: 250, y: 940 }, zoom: 0.7, duration: 1.5, easing: 'power2.inOut', type: 'focus' },
    { time: 67.5, position: { x: 800, y: 500 }, zoom: 0.4, duration: 0.5, easing: 'power2.out', type: 'overview' },
  ],

  // ─── Outcome ───────────────────────────────────────────────────────────────
  outcome: {
    verdict: 'tactical_withdrawal',
    muslimCasualties: 70,
    enemyCasualties: 25,
    summary:
      "Uhud ended in tactical withdrawal: the archers' disobedience of the Prophet's ﷺ standing order to hold Jabal al-Rumat turned the early Muslim victory into a reversal when Khalid ibn al-Walid wheeled the Quraysh cavalry around the abandoned hill and struck the Muslim rear. Seventy Muslims were martyred including Hamza Sayyid ash-Shuhada, Mus'ab ibn 'Umayr, and 'Abdullah ibn Jubayr; Quraysh lost about twenty-five, and no prisoners were taken on either side. The Quraysh withdrew without assaulting Medina; the Prophet ﷺ marched out the next day to Hamra al-Asad, where five hundred camp-fires deterred any Meccan return strike.",
    summaryAr:
      'انْتَهَتْ غَزْوَةُ أُحُدٍ بِانْسِحَابٍ تَكْتِيكِيٍّ، إِذْ حَوَّلَتْ مُخَالَفَةُ الرُّمَاةِ أَمْرَ النَّبِيِّ ﷺ فِي لُزُومِ الجَبَلِ مُقَدِّمَةَ النَّصْرِ إِلَى تَغَيُّرٍ جَذْرِيٍّ، فَلَفَّ خَالِدُ بْنُ الوَلِيدِ خَيْلَهُ مِنْ وَرَاءِ جَبَلِ الرُّمَاةِ وَضَرَبَ المُسْلِمِينَ فِي ظُهُورِهِمْ. اسْتُشْهِدَ سَبْعُونَ مِنَ المُسْلِمِينَ وَعَلَى رَأْسِهِمْ سَيِّدُ الشُّهَدَاءِ حَمْزَةُ، وَمُصْعَبُ بْنُ عُمَيْرٍ، وَعَبْدُ اللَّهِ بْنُ جُبَيْرٍ، وَفُقِدَ مِنْ قُرَيْشٍ نَحْوُ خَمْسَةٍ وَعِشْرِينَ، وَلَمْ يُؤْخَذْ أَسْرَى مِنْ أَيِّ الفَرِيقَيْنِ. انْسَحَبَتْ قُرَيْشٌ دُونَ أَنْ تُقْتَحَمَ المَدِينَةُ، وَخَرَجَ النَّبِيُّ ﷺ فِي الغَدِ إِلَى حَمْرَاءِ الأَسَدِ فَأَوْقَدُوا خَمْسَمِئَةِ نَارٍ، فَرَدَّتِ العَدُوَّ عَنْ عَوْدَةٍ.',
    significance:
      "Uhud was not a strategic defeat but a divine pedagogy and a school for the Umma. The longest Quranic passage tied to a single battle — Al 'Imran 121-179 — was revealed in its aftermath, framing the setback as a lesson in obedience, reliance, and the eternal life of the martyrs ('alive with their Lord, receiving provision'). Jabal al-Rumat became the canonical case study of obedience to command; Hamza became the prototype of the shahid; Mus'ab the prototype of the da'i; and Medina, having held, became the fortress from which al-Khandaq, al-Hudaybiyya, and ultimately the Conquest of Mecca would follow.",
    significanceAr:
      'أُحُدٌ لَيْسَتْ هَزِيمَةً اسْتِرَاتِيجِيَّةً، بَلْ مِحْنَةٌ رَبَّانِيَّةٌ وَمَدْرَسَةٌ لِلْأُمَّةِ. تَنَزَّلَ فِيهَا أَطْوَلُ سِيَاقٍ قُرْآنِيٍّ فِي سُورَةِ آلِ عِمْرَانَ (١٢١-١٧٩)، فَجَعَلَ اللَّهُ الهَزِيمَةَ دَرْسًا فِي الطَّاعَةِ وَالتَّوَكُّلِ، وَأَفْرَدَ لِلشُّهَدَاءِ مَقَامًا خَالِدًا: ﴿أَحْيَاءٌ عِنْدَ رَبِّهِمْ يُرْزَقُونَ﴾. صَارَ جَبَلُ الرُّمَاةِ رَمْزًا لِوُجُوبِ الطَّاعَةِ، وَحَمْزَةُ سَيِّدَ الشُّهَدَاءِ، وَمُصْعَبٌ أُسْوَةً لِلدُّعَاةِ، وَصَارَتِ المَدِينَةُ حِصْنًا لَمْ يَسْقُطْ، فَتَبِعَتْهَا دُرُوسٌ أَخْلَصَتِ الصَّفَّ وَفَرَزَتِ المُنَافِقِينَ، ثُمَّ أَثْمَرَتْ فِي الخَنْدَقِ وَصُلْحِ الحُدَيْبِيَةِ وَفَتْحِ مَكَّةَ.',
  },

  totalDuration: 68,
};
