import type { BattleScenario } from '../types/scenario';

/**
 * غَزْوَةُ الخَنْدَقِ — يَوْمُ الأَحْزَابِ
 * Battle of the Trench (Khandaq) — The Day of the Confederates
 *
 * Shawwal 5 AH / March 627 CE — fifth year after the Hijra.
 * Medina, at the tripoint of Wadi al-'Aql, al-'Aqiq and al-Himdh,
 * with Mount Sal' at the back, the basalt harras of Waqim (east)
 * and al-Wabara (west) on the flanks, palm-groves and stone fortresses
 * to the south, and a single open plain — the only cavalry-passable
 * face — to the north.
 *
 * The Confederate host (al-Ahzab) was the largest military coalition
 * the Hejaz had ever raised against the Prophet ﷺ: ~10,000 men with
 * ~600 horse. Quraysh and their Ahabish (~4,000) marched from Mecca
 * by the coastal road under Abu Sufyan ibn Harb and encamped at Rumat
 * / al-Jurf in the north-west. Ghatafan, Banu Murra, Banu Sulaym,
 * Banu Asad and Banu Ashja' (~6,000) marched from Najd under 'Uyayna
 * ibn Hisn al-Fazari and encamped near the foot of Uhud and Naqama
 * in the north-east. The coalition was the project of the Banu al-Nadir
 * exiles — Huyayy ibn Akhtab and Sallam ibn Abi al-Huqayq — who rode
 * between Mecca and Najd until they had bound the chiefs to the war.
 *
 * On Salman al-Farisi's counsel, drawn from Sasanian siege practice,
 * the Prophet ﷺ ordered a trench (al-khandaq) cut across the open
 * northern flank — every ten Companions assigned forty cubits per
 * al-Waqidi. The Prophet ﷺ dug with his own hand until dust covered
 * the skin of his belly (Bukhari 4106), and the Companions chanted
 * 'Abdullah ibn Rawaha's rajaz: «اللَّهُمَّ لَوْلَا أَنْتَ مَا
 * اهْتَدَيْنَا...». A stubborn rock blocked the dig; the Prophet ﷺ
 * struck it three times — and at each strike (Bukhari 4101; Ibn Abi
 * Shayba; al-Nasa'i al-Kubra via al-Bara') a flash of light burst
 * forth and he saw the keys of Sham, of Persia at al-Mada'in, and
 * of Yemen at San'a' — the prophecy that would unfold across the
 * coming forty years.
 *
 * When the Ahzab arrived they were halted at the trench: their
 * cavalry could not cross. Twenty-odd nights of arrow exchanges and
 * failed leap-attempts followed. Hibban ibn al-'Ariqa shot Sa'd ibn
 * Mu'adh in the akhal — the median vein — a wound that would claim
 * him after he passed judgement on Banu Qurayza (Bukhari 463, 4122).
 * Then Huyayy ibn Akhtab entered the fortress of Ka'b ibn Asad and
 * persuaded Banu Qurayza to tear up the Sahifa. The threat now came
 * from north and south together. Allah revealed: ﴿إِذْ جَاءُوكُم
 * مِّن فَوْقِكُمْ وَمِنْ أَسْفَلَ مِنكُمْ وَإِذْ زَاغَتِ الأَبْصَارُ
 * وَبَلَغَتِ القُلُوبُ الحَنَاجِرَ﴾ (al-Ahzab 10).
 *
 * The Prophet ﷺ explored offering Ghatafan a third of Medina's date
 * harvest to peel them off the coalition; the two Sa'ds — Sa'd ibn
 * Mu'adh and Sa'd ibn 'Ubada — refused: «وَاللَّهِ مَا كَانُوا
 * يَطْمَعُونَ مِنَّا فِي الجَاهِلِيَّةِ بِتَمْرَةٍ إِلَّا قِرًى أَوْ
 * بَيْعًا» — and he tore up the draft. 'Amr ibn 'Abd Wudd al-'Amiri
 * leapt the narrow crossing of the trench with four riders and called
 * for a champion; 'Ali ibn Abi Talib rose, the Prophet ﷺ girded him
 * with his own sword and prayed for him, and 'Ali killed 'Amr in
 * single combat (Ibn Hisham; al-Tabari 5 AH). Continual pressure kept
 * the Muslims from the 'Asr prayer until after sunset; the Prophet ﷺ
 * said: «مَلَأَ اللَّهُ عَلَيْهِمْ بُيُوتَهُمْ وَقُبُورَهُمْ نَارًا
 * كَمَا شَغَلُونَا عَنِ الصَّلَاةِ الوُسْطَى حَتَّى غَابَتِ الشَّمْسُ»
 * (Bukhari 4111).
 *
 * Then Nu'aym ibn Mas'ud al-Ghatafani secretly accepted Islam. The
 * Prophet ﷺ said: «إِنَّمَا أَنْتَ فِينَا رَجُلٌ وَاحِدٌ، فَخَذِّلْ
 * عَنَّا إِنِ اسْتَطَعْتَ، فَإِنَّ الحَرْبَ خُدْعَةٌ» (Bukhari 3030).
 * He sowed distrust among Quraysh, Ghatafan and Qurayza: each
 * believed the others were about to betray them. Coordination
 * collapsed. On the freezing storm-night that followed Allah sent
 * the saba — the eastern wind — and ﴿أَرْسَلْنَا عَلَيْهِمْ رِيحًا
 * وَجُنُودًا لَّمْ تَرَوْهَا﴾ (al-Ahzab 9): tents overturned, fires
 * guttered, horses and camels perished. The Prophet ﷺ called three
 * times for a scout and only Hudhayfa ibn al-Yaman answered: «قُمْ
 * يَا حُذَيْفَةُ، فَأْتِنَا بِخَبَرِ القَوْمِ، وَلَا تَذْعَرْهُمْ
 * عَلَيَّ» (Sahih Muslim 1788). Hudhayfa slipped into Abu Sufyan's
 * camp and heard the order to depart: «يَا مَعْشَرَ قُرَيْشٍ، إِنَّكُمْ
 * — وَاللَّهِ — مَا أَصْبَحْتُمْ بِدَارِ مُقَامٍ... فَارْتَحِلُوا،
 * فَإِنِّي مُرْتَحِلٌ». The Confederates dispersed before dawn.
 *
 * Six Muslims were martyred — among them Sa'd ibn Mu'adh, who would
 * die of his wound after passing judgement on Banu Qurayza. Three
 * named Confederates fell, foremost 'Amr ibn 'Abd Wudd. And on the
 * day the Ahzab withdrew the Prophet ﷺ said (Sulayman ibn Surad
 * al-Khuza'i — Bukhari 4109–4110): «الآنَ نَغْزُوهُمْ وَلَا
 * يَغْزُونَنَا» — "Now we shall raid them, and they shall not raid us."
 * Quraysh never marched on Medina again. Surat al-Ahzab was revealed
 * about it; ﴿وَكَفَى اللَّهُ المُؤْمِنِينَ القِتَالَ﴾ (33:25). The
 * trench was the strategic hinge of the Sira — opening the way to
 * the removal of Banu Qurayza, then Hudaybiyya, then Khaybar, then
 * the Conquest of Mecca.
 *
 * Sources: al-Bukhari, Sahih (Kitab al-Maghazi: 4097, 4101, 4106,
 *          4109–4111, 4122, 463, 3030, 4533); Muslim, Sahih (1740,
 *          1788, 900, 1035); Ibn Hisham, as-Sirah an-Nabawiyyah
 *          (Ghazwat al-Khandaq); al-Waqidi, Kitab al-Maghazi 2/440–490;
 *          at-Tabari, Tarikh year 5 AH; Ibn Kathir, al-Bidayah
 *          wa'n-Nihayah vol. 4. Surat al-Ahzab was revealed in
 *          connection with this engagement.
 */
export const battleOfKhandaq: BattleScenario = {
  id: 'battle-of-khandaq',
  name: 'Battle of the Trench (Khandaq)',
  nameAr: 'غزوة الخندق',
  date: 'Shawwal 5 AH (March 627 CE)',
  location: "Northern flank of Medina — between the harras of Waqim and al-Wabara, with Mount Sal' at the rear",
  description:
    "The largest coalition the Hejaz raised against the Prophet ﷺ — ~10,000 men with ~600 horse — besieged Medina for some twenty-seven days. On Salman al-Farisi's counsel a Persian-style trench was cut across the only cavalry-passable face of the city. The Prophet ﷺ dug with his own hand and, striking a stubborn rock, saw in three flashes the keys of Sham, Persia and Yemen (Bukhari 4101). The trench halted the Confederate cavalry; arrow exchanges followed; Hibban ibn al-'Ariqa wounded Sa'd ibn Mu'adh in the akhal. Banu Qurayza tore up the treaty after Huyayy ibn Akhtab entered Ka'b ibn Asad's fortress; ﴿إِذْ جَاءُوكُم مِّن فَوْقِكُمْ وَمِنْ أَسْفَلَ مِنكُمْ﴾ (Q 33:10). The two Sa'ds rejected the Ghatafan date-bribe; 'Ali killed 'Amr ibn 'Abd Wudd at the narrow crossing. The 'Asr prayer was missed and the Prophet ﷺ pronounced the imprecation against the Confederates. Nu'aym ibn Mas'ud's secret conversion — \"al-harb khud'a\" (Bukhari 3030) — fractured the coalition. Then Allah sent the saba wind on a freezing night; tents overturned, fires guttered. Hudhayfa ibn al-Yaman alone answered the Prophet's three-time call (Muslim 1788) and brought back word of Abu Sufyan's order to depart. The Confederates dispersed without a decisive engagement. The Prophet ﷺ said: \"Now we shall raid them, and they shall not raid us\" (Bukhari 4109). Six Muslims were martyred including Sa'd ibn Mu'adh; three named Confederates fell. Surat al-Ahzab was revealed in connection with this day.",
  descriptionAr:
    'أَكْبَرُ تَحَالُفٍ عَسْكَرِيٍّ ثَارَ عَلَى النَّبِيِّ ﷺ فِي الجَزِيرَةِ — نَحْوُ عَشَرَةِ آلَافٍ وَفِيهِمْ سِتُّ مِئَةِ فَارِسٍ — حَاصَرَ المَدِينَةَ نَحْوًا مِنْ سَبْعٍ وَعِشْرِينَ لَيْلَةً. أَشَارَ سَلْمَانُ الفَارِسِيُّ بِحَفْرِ خَنْدَقٍ عَلَى الجِهَةِ الشَّمَالِيَّةِ، وَهِيَ الوَجْهُ الوَحِيدُ المَكْشُوفُ لِخَيْلِ المُغِيرِينَ. حَفَرَ النَّبِيُّ ﷺ بِنَفْسِهِ حَتَّى وَارَى التُّرَابُ جِلْدَةَ بَطْنِهِ، وَلَمَّا اعْتَرَضَتْهُمْ كُدْيَةٌ ضَرَبَهَا ثَلَاثًا، فَرَأَى فِي كُلِّ ضَرْبَةٍ بَرْقَةً: مَفَاتِحَ الشَّامِ، ثُمَّ مَفَاتِحَ فَارِسَ مَعَ قَصْرِ المَدَائِنِ الأَبْيَضِ، ثُمَّ مَفَاتِحَ اليَمَنِ مَعَ أَبْوَابِ صَنْعَاءَ. صَدَّ الخَنْدَقُ خَيْلَ الأَحْزَابِ، فَدَامَتِ النِّبَالُ تَتَطَايَرُ فَوْقَهُ، فَرَمَى حِبَّانُ بنُ العَرِقَةِ سَعْدَ بنَ مُعَاذٍ فَقَطَعَ أَكْحَلَهُ. وَدَخَلَ حُيَيُّ بنُ أَخْطَبَ حِصْنَ كَعْبِ بنِ أَسَدٍ فَنَقَضَ بَنُو قُرَيْظَةَ العَهْدَ مِنْ خَلْفِ المَدِينَةِ ﴿إِذْ جَاءُوكُم مِّن فَوْقِكُمْ وَمِنْ أَسْفَلَ مِنكُمْ﴾. وَهَمَّ النَّبِيُّ ﷺ أَنْ يُعْطِيَ غَطَفَانَ ثُلُثَ ثِمَارِ المَدِينَةِ فَأَبَى السَّعْدَانِ، فَمَزَّقَ الصَّحِيفَةَ. وَوَثَبَ عَمْرُو بنُ عَبْدِ وُدٍّ مِنْ مَضِيقِ الخَنْدَقِ فَنَادَى لِلْمُبَارَزَةِ، فَقَتَلَهُ عَلِيُّ بنُ أَبِي طَالِبٍ. وَشَغَلَتْهُمُ الأَحْزَابُ عَنِ العَصْرِ حَتَّى غَابَتِ الشَّمْسُ، فَدَعَا النَّبِيُّ ﷺ عَلَيْهِمْ. وَأَسْلَمَ نُعَيْمُ بنُ مَسْعُودٍ سِرًّا فَخَذَّلَ بَيْنَ قُرَيْشٍ وَغَطَفَانَ وَقُرَيْظَةَ. ثُمَّ أَرْسَلَ اللَّهُ عَلَيْهِمْ رِيحَ الصَّبَا فِي لَيْلَةٍ ذَاتِ بَرْدٍ شَدِيدٍ، فَأَكْفَأَتْ خِيَامَهُمْ، وَأَطْفَأَتْ نِيرَانَهُمْ، وَهَلَكَتْ خَيْلُهُمْ. وَقَامَ حُذَيْفَةُ بنُ اليَمَانِ وَحْدَهُ بَعْدَ الثَّلَاثَةِ فَدَخَلَ مُعَسْكَرَ أَبِي سُفْيَانَ، فَجَاءَ بِخَبَرِ الِارْتِحَالِ. تَفَرَّقَتِ الأَحْزَابُ قَبْلَ الفَجْرِ. اسْتُشْهِدَ مِنَ المُسْلِمِينَ سِتَّةٌ مِنْهُمْ سَعْدُ بنُ مُعَاذٍ بَعْدَ قَضَائِهِ فِي بَنِي قُرَيْظَةَ، وَقُتِلَ مِنَ الأَحْزَابِ ثَلَاثَةٌ أَشْهَرُهُمْ عَمْرُو بنُ عَبْدِ وُدٍّ. وَقَالَ ﷺ يَوْمَ انْصَرَفَتْ: «الآنَ نَغْزُوهُمْ وَلَا يَغْزُونَنَا». وَنَزَلَتْ سُورَةُ الأَحْزَابِ فِي شَأْنِهَا.',

  // A wet, freezing dusk turning to night through the climactic phases —
  // the saba wind comes after dark on the storm-night.
  dayPhase: 'dusk',
  weather: 'storm',
  // ~27 days of siege compressed into 68 simulation seconds.
  actualDayCount: 27,

  // ─── Map ───────────────────────────────────────────────────────────────────
  // North-up. The northern half is open ground — the only cavalry-passable
  // face — bisected east-to-west by the trench. The southern half is
  // Mount Sal', the city, the palm-groves, and the Banu Qurayza fortresses
  // in the south-east. The harras of Waqim (east) and al-Wabara (west)
  // are basalt lava fields impassable to cavalry.
  map: {
    width: 1600,
    height: 1100,
    terrain: [
      // Base plain
      {
        id: 'medina-plain',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x5c4a30,
        label: 'سَهْلُ المَدِينَةِ',
      },
      // Mount Uhud — distant northern horizon
      {
        id: 'mount-uhud-horizon',
        type: 'mountain',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 70 },
          { x: 0, y: 70 },
        ],
        color: 0x2a1c12,
        label: 'جَبَلُ أُحُدٍ',
      },
      // Harrat al-Wabara — western basalt field, impassable to cavalry
      {
        id: 'harrat-wabara',
        type: 'mountain',
        polygon: [
          { x: 0, y: 70 },
          { x: 180, y: 70 },
          { x: 180, y: 880 },
          { x: 0, y: 880 },
        ],
        color: 0x33241a,
        label: 'حَرَّةُ الوَبَرَةِ',
      },
      // Harrat Waqim — eastern basalt field
      {
        id: 'harrat-waqim',
        type: 'mountain',
        polygon: [
          { x: 1430, y: 70 },
          { x: 1600, y: 70 },
          { x: 1600, y: 880 },
          { x: 1430, y: 880 },
        ],
        color: 0x33241a,
        label: 'حَرَّةُ وَاقِمٍ',
      },
      // The trench (al-khandaq) — east-west across the open northern flank
      {
        id: 'the-trench',
        type: 'trench',
        polygon: [
          { x: 180, y: 400 },
          { x: 1430, y: 400 },
          { x: 1430, y: 440 },
          { x: 180, y: 440 },
        ],
        color: 0x140c06,
        label: 'الخَنْدَقُ',
      },
      // Excavated-earth embankment — south of the trench, archery firing platform
      {
        id: 'embankment',
        type: 'elevated',
        polygon: [
          { x: 180, y: 440 },
          { x: 1430, y: 440 },
          { x: 1430, y: 470 },
          { x: 180, y: 470 },
        ],
        color: 0x6d5635,
      },
      // Mount Sal' — Muslim command position, the Prophet's qubba at its foot
      {
        id: 'mount-sal',
        type: 'elevated',
        polygon: [
          { x: 660, y: 660 },
          { x: 940, y: 660 },
          { x: 940, y: 820 },
          { x: 660, y: 820 },
        ],
        color: 0x4a3520,
        label: 'جَبَلُ سَلْعٍ',
      },
      // Palm-groves and city southern belt
      {
        id: 'palm-groves',
        type: 'oasis',
        polygon: [
          { x: 180, y: 830 },
          { x: 1430, y: 830 },
          { x: 1430, y: 1100 },
          { x: 180, y: 1100 },
        ],
        color: 0x2e4a1f,
        label: 'نَخِيلُ المَدِينَةِ',
      },
      // Atam Fari' — stone fortress where the women and children sheltered
      {
        id: 'atam-fari',
        type: 'fortress_wall',
        polygon: [
          { x: 380, y: 810 },
          { x: 510, y: 810 },
          { x: 510, y: 920 },
          { x: 380, y: 920 },
        ],
        color: 0x6b5e4e,
        label: 'أُطُمُ فَارِعٍ',
      },
      // Banu Qurayza fortresses — south-east, the rear threat
      {
        id: 'qurayza-fortresses',
        type: 'fortress_wall',
        polygon: [
          { x: 1200, y: 830 },
          { x: 1400, y: 830 },
          { x: 1400, y: 990 },
          { x: 1200, y: 990 },
        ],
        color: 0x5a4a36,
        label: 'حُصُونُ بَنِي قُرَيْظَةَ',
      },
      // Quraysh + Ahabish camp at Rumat / al-Jurf — north-west
      {
        id: 'quraysh-camp',
        type: 'sand',
        polygon: [
          { x: 180, y: 80 },
          { x: 460, y: 80 },
          { x: 460, y: 220 },
          { x: 180, y: 220 },
        ],
        color: 0x6b552f,
        label: 'مُعَسْكَرُ قُرَيْشٍ',
      },
      // Ghatafan + Najdi camp near foot of Uhud — north-east
      {
        id: 'ghatafan-camp',
        type: 'sand',
        polygon: [
          { x: 1140, y: 80 },
          { x: 1430, y: 80 },
          { x: 1430, y: 220 },
          { x: 1140, y: 220 },
        ],
        color: 0x6b552f,
        label: 'مُعَسْكَرُ غَطَفَانَ',
      },
      // Rocky broken ground in no-man's-land south of the camps
      {
        id: 'no-mans-land',
        type: 'rocky',
        polygon: [
          { x: 180, y: 220 },
          { x: 1430, y: 220 },
          { x: 1430, y: 400 },
          { x: 180, y: 400 },
        ],
        color: 0x4a3826,
      },
    ],
    landmarks: [
      {
        id: 'mount-sal',
        position: { x: 800, y: 740 },
        type: 'hill',
        label: "Mount Sal' — Prophet's Command",
        labelAr: 'جَبَلُ سَلْعٍ — مَقَامُ النَّبِيِّ ﷺ',
      },
      {
        id: 'trench-narrow-crossing',
        position: { x: 800, y: 420 },
        type: 'marker',
        label: 'Narrow Crossing of the Trench',
        labelAr: 'مَضِيقُ الخَنْدَقِ',
      },
      {
        id: 'quraysh-camp-marker',
        position: { x: 320, y: 150 },
        type: 'camp',
        label: "Quraysh Camp at Rumat",
        labelAr: 'مُعَسْكَرُ قُرَيْشٍ بِالرُّومَةِ',
      },
      {
        id: 'ghatafan-camp-marker',
        position: { x: 1280, y: 150 },
        type: 'camp',
        label: "Ghatafan Camp by Uhud",
        labelAr: 'مُعَسْكَرُ غَطَفَانَ بِجَانِبِ أُحُدٍ',
      },
      {
        id: 'qurayza-fortress-marker',
        position: { x: 1300, y: 900 },
        type: 'marker',
        label: "Banu Qurayza's Fortresses",
        labelAr: 'حُصُونُ بَنِي قُرَيْظَةَ',
      },
      {
        id: 'atam-fari-marker',
        position: { x: 445, y: 865 },
        type: 'marker',
        label: "Atam Fari' (Hassan's Tower)",
        labelAr: 'أُطُمُ فَارِعٍ',
      },
      {
        id: 'mount-uhud',
        position: { x: 1500, y: 50 },
        type: 'mountain_pass',
        label: 'Mount Uhud',
        labelAr: 'جَبَلُ أُحُدٍ',
      },
    ],
    backgroundColor: 0x1a1208,
  },

  // ─── Forces ────────────────────────────────────────────────────────────────
  forces: [
    // ─── Muslim Forces (~3,000 effective + 100 inner-city patrol) ─────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 3000,
      units: [
        {
          // The Prophet's command qubba at the foot of Mount Sal'
          id: 'prophet-command-sal',
          name: "The Prophet's Command at Mount Sal'",
          nameAr: 'كَتِيبَةُ قِيَادَةِ النَّبِيِّ ﷺ بِسَلْعٍ',
          troopType: 'command',
          soldierCount: 200,
          commander: 'النَّبِيُّ مُحَمَّدٌ ﷺ',
          startPosition: { x: 800, y: 720 },
          startFormation: 'defensive_circle',
          startFacing: -Math.PI / 2, // facing north toward the Confederates
          stats: { attack: 8, defense: 10, speed: 5, morale: 10 },
        },
        {
          // Muhajirun on the trench — Abu Bakr's sector
          id: 'muhajirun-trench-line',
          name: 'Muhajirun on the Trench',
          nameAr: 'كَتِيبَةُ المُهَاجِرِينَ عَلَى الخَنْدَقِ',
          troopType: 'infantry',
          soldierCount: 700,
          commander: 'أَبُو بَكْرٍ الصِّدِّيقُ',
          startPosition: { x: 700, y: 480 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // Aws under Sa'd ibn Mu'adh — eastern trench sector, will be wounded
          id: 'ansar-aws-sad-muadh',
          name: "Aws Contingent under Sa'd ibn Mu'adh",
          nameAr: 'كَتِيبَةُ الأَوْسِ مَعَ سَعْدِ بنِ مُعَاذٍ',
          troopType: 'infantry',
          soldierCount: 800,
          commander: 'سَعْدُ بنُ مُعَاذٍ',
          startPosition: { x: 1000, y: 480 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // Khazraj under Sa'd ibn 'Ubada — western trench sector
          id: 'ansar-khazraj-sad-ubada',
          name: "Khazraj Contingent under Sa'd ibn 'Ubada",
          nameAr: 'كَتِيبَةُ الخَزْرَجِ مَعَ سَعْدِ بنِ عُبَادَةَ',
          troopType: 'infantry',
          soldierCount: 900,
          commander: 'سَعْدُ بنُ عُبَادَةَ',
          startPosition: { x: 450, y: 480 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // Archers and slingers on the embankment
          id: 'archers-embankment',
          name: 'Archers on the Embankment',
          nameAr: 'كَتِيبَةُ الرُّمَاةِ عَلَى الرَّدْمِ',
          troopType: 'archers',
          soldierCount: 250,
          commander: 'سَعْدُ بنُ أَبِي وَقَّاصٍ',
          startPosition: { x: 800, y: 460 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 5, speed: 5, morale: 10 },
        },
        {
          // 'Ali at the narrow crossing — the duel reserve
          id: 'ali-champion-reserve',
          name: "'Ali's Reserve at the Narrow Crossing",
          nameAr: 'كَتِيبَةُ عَلِيٍّ عَلَى المَضِيقِ',
          troopType: 'heavy_cavalry',
          soldierCount: 30,
          commander: 'عَلِيُّ بنُ أَبِي طَالِبٍ',
          startPosition: { x: 800, y: 540 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 10, defense: 9, speed: 7, morale: 10 },
        },
        {
          // Zubayr's mounted scout detachment — the Prophet's hawari
          id: 'zubayr-scout',
          name: "Zubayr's Scouting Detachment",
          nameAr: 'كَتِيبَةُ الزُّبَيْرِ لِلِاسْتِطْلَاعِ',
          troopType: 'cavalry',
          soldierCount: 12,
          commander: 'الزُّبَيْرُ بنُ العَوَّامِ',
          startPosition: { x: 740, y: 690 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 9, morale: 10 },
        },
        {
          // Salama b. Aslam — fortress guard for the women and children
          id: 'salama-fortress-guard',
          name: "Salama ibn Aslam's Fortress Guard",
          nameAr: 'كَتِيبَةُ سَلَمَةَ بنِ أَسْلَمَ بِالأُطُمِ',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'سَلَمَةُ بنُ أَسْلَمَ بنِ حُرَيْسٍ',
          startPosition: { x: 445, y: 865 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2, // facing south toward Qurayza
          stats: { attack: 7, defense: 9, speed: 5, morale: 9 },
        },
        {
          // Zayd b. Haritha — mounted inner-city patrol against Qurayza incursions
          id: 'inner-city-patrol',
          name: "Zayd's Inner-City Patrol",
          nameAr: 'كَتِيبَةُ حِرَاسَةِ شَوَارِعِ المَدِينَةِ',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: 'زَيْدُ بنُ حَارِثَةَ',
          startPosition: { x: 800, y: 920 },
          startFormation: 'scattered',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 9, morale: 9 },
        },
        {
          // Salman al-Farisi's engineer detachment — proposed and led the dig
          id: 'salman-engineer',
          name: "Salman's Engineer Detachment",
          nameAr: 'كَتِيبَةُ سَلْمَانَ لِحَفْرِ الخَنْدَقِ',
          troopType: 'siege_engineer',
          soldierCount: 100,
          commander: 'سَلْمَانُ الفَارِسِيُّ',
          startPosition: { x: 1100, y: 480 },
          startFormation: 'scattered',
          startFacing: -Math.PI / 2,
          stats: { attack: 4, defense: 6, speed: 4, morale: 10 },
        },
        {
          // Hudhayfa — the lone night-scout into Abu Sufyan's camp
          id: 'hudhayfa-night-scout',
          name: "Hudhayfa's Night Scout",
          nameAr: 'كَتِيبَةُ حُذَيْفَةَ لِلِاسْتِطْلَاعِ اللَّيْلِيِّ',
          troopType: 'infantry',
          soldierCount: 1,
          commander: 'حُذَيْفَةُ بنُ اليَمَانِ',
          startPosition: { x: 820, y: 730 },
          startFormation: 'scattered',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 8, morale: 10 },
        },
      ],
    },

    // ─── Confederate Forces (~10,000 with ~600 horse) ─────────────────────
    {
      faction: 'quraysh',
      label: 'The Confederates (al-Ahzab)',
      labelAr: 'جَيْشُ الأَحْزَابِ',
      totalStrength: 10000,
      units: [
        {
          // Quraysh and Ahabish — the largest tribal block, north-west camp
          id: 'quraysh-main',
          name: 'Quraysh and the Ahabish',
          nameAr: 'كَتِيبَةُ قُرَيْشٍ وَالأَحَابِيشِ',
          troopType: 'infantry',
          soldierCount: 4000,
          commander: 'أَبُو سُفْيَانَ بنُ حَرْبٍ',
          startPosition: { x: 320, y: 150 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 8 },
        },
        {
          // Quraysh cavalry — 'Ikrima's striking arm
          id: 'quraysh-cavalry',
          name: 'Quraysh Cavalry',
          nameAr: 'كَتِيبَةُ خَيْلِ قُرَيْشٍ',
          troopType: 'cavalry',
          soldierCount: 300,
          commander: 'عِكْرِمَةُ بنُ أَبِي جَهْلٍ',
          startPosition: { x: 360, y: 280 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 8 },
        },
        {
          // 'Amr ibn 'Abd Wudd's leap-the-trench raiding party
          id: 'amr-champion-party',
          name: "'Amr ibn 'Abd Wudd's Champion Party",
          nameAr: 'فِئَةُ عَمْرِو بنِ عَبْدِ وُدٍّ',
          troopType: 'heavy_cavalry',
          soldierCount: 5,
          commander: 'عَمْرُو بنُ عَبْدِ وُدٍّ العَامِرِيُّ',
          startPosition: { x: 770, y: 320 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 8, speed: 9, morale: 9 },
        },
        {
          // Ghatafan main body — 'Uyayna's column from Najd
          id: 'ghatafan-fazara',
          name: 'Ghatafan from Fazara',
          nameAr: 'كَتِيبَةُ غَطَفَانَ مِنْ فَزَارَةَ',
          troopType: 'infantry',
          soldierCount: 1000,
          commander: 'عُيَيْنَةُ بنُ حِصْنٍ الفَزَارِيُّ',
          startPosition: { x: 1280, y: 150 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 7 },
        },
        {
          // Ghatafan cavalry — second half of the 600-strong Confederate horse
          id: 'ghatafan-cavalry',
          name: 'Ghatafan Cavalry',
          nameAr: 'خَيْلُ غَطَفَانَ',
          troopType: 'cavalry',
          soldierCount: 300,
          commander: 'عُيَيْنَةُ بنُ حِصْنٍ الفَزَارِيُّ',
          startPosition: { x: 1240, y: 280 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 7 },
        },
        {
          id: 'banu-murra',
          name: 'Banu Murra',
          nameAr: 'كَتِيبَةُ بَنِي مُرَّةَ',
          troopType: 'infantry',
          soldierCount: 400,
          commander: 'الحَارِثُ بنُ عَوْفٍ المُرِّيُّ',
          startPosition: { x: 1380, y: 200 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 5, morale: 6 },
        },
        {
          id: 'banu-sulaym',
          name: 'Banu Sulaym',
          nameAr: 'كَتِيبَةُ بَنِي سُلَيْمٍ',
          troopType: 'infantry',
          soldierCount: 700,
          commander: 'أَبُو الأَعْوَرِ السُّلَمِيُّ',
          startPosition: { x: 1100, y: 150 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 6, speed: 5, morale: 7 },
        },
        {
          id: 'banu-asad-tulayha',
          name: 'Banu Asad',
          nameAr: 'كَتِيبَةُ بَنِي أَسَدٍ',
          troopType: 'infantry',
          soldierCount: 400,
          commander: 'طُلَيْحَةُ بنُ خُوَيْلِدٍ الأَسَدِيُّ',
          startPosition: { x: 1180, y: 200 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 6, speed: 5, morale: 6 },
        },
        {
          id: 'banu-ashja',
          name: 'Banu Ashja',
          nameAr: 'كَتِيبَةُ بَنِي أَشْجَعَ',
          troopType: 'infantry',
          soldierCount: 700,
          commander: 'مِسْعَرُ بنُ رُخَيْلَةَ الأَشْجَعِيُّ',
          startPosition: { x: 1340, y: 230 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 6, speed: 5, morale: 6 },
        },
        {
          // Huyayy ibn Akhtab — Banu al-Nadir delegation that built the
          // coalition and broke Qurayza's treaty
          id: 'huyayy-nadir-instigator',
          name: "Huyayy ibn Akhtab's Delegation",
          nameAr: 'وَفْدُ حُيَيِّ بنِ أَخْطَبَ',
          troopType: 'command',
          soldierCount: 8,
          commander: 'حُيَيُّ بنُ أَخْطَبَ',
          startPosition: { x: 380, y: 150 },
          startFormation: 'scattered',
          startFacing: Math.PI / 2,
          stats: { attack: 4, defense: 5, speed: 6, morale: 7 },
        },
        {
          // Banu Qurayza after the treaty-breach — the rear front
          id: 'qurayza-defectors',
          name: 'Banu Qurayza (Treaty-Breakers)',
          nameAr: 'بَنُو قُرَيْظَةَ النَّاقِضُونَ لِلْعَهْدِ',
          troopType: 'infantry',
          soldierCount: 600,
          commander: 'كَعْبُ بنُ أَسَدٍ',
          startPosition: { x: 1300, y: 880 },
          startFormation: 'defensive_circle',
          startFacing: -Math.PI / 2, // facing north back toward the city
          stats: { attack: 7, defense: 8, speed: 4, morale: 6 },
        },
        {
          // Nu'aym ibn Mas'ud — secret convert; the disinformation operation
          id: 'nuaym-defector',
          name: "Nu'aym ibn Mas'ud (Covert)",
          nameAr: 'كَتِيبَةُ نُعَيْمِ بنِ مَسْعُودٍ السِّرِّيَّةُ',
          troopType: 'command',
          soldierCount: 1,
          commander: 'نُعَيْمُ بنُ مَسْعُودٍ الغَطَفَانِيُّ',
          startPosition: { x: 1290, y: 230 },
          startFormation: 'scattered',
          startFacing: Math.PI / 2,
          stats: { attack: 4, defense: 4, speed: 8, morale: 9 },
        },
      ],
    },
  ],

  // ─── Phases (68 simulation seconds compressing 27 days) ──────────────────
  phases: [
    // Phase 1 (0–7s): Salman's counsel + the dig.
    {
      id: 'phase-01-salman-counsel',
      name: "Salman's Counsel & the Digging of the Trench",
      nameAr: 'مَشُورَةُ سَلْمَانَ وَحَفْرُ الخَنْدَقِ',
      startTime: 0,
      duration: 7,
      description:
        "Six days before the Confederates arrive: Salman al-Farisi proposes the Persian-style trench across Medina's only exposed flank. Every ten Companions are assigned forty cubits; the Prophet ﷺ digs alongside them, his belly covered in dust, reciting Ibn Rawaha's rajaz (Bukhari 4106).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 550, zoom: 0.45, duration: 4 }, delay: 0 },
        // Salman's engineers work west-to-east along the trench
        { type: 'move_unit', targetUnitId: 'salman-engineer', params: { position: { x: 600, y: 470 }, speed: 35 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'salman-engineer', params: { position: { x: 1000, y: 470 }, speed: 35 }, delay: 4 },
        // Defensive line settles south of the embankment
        { type: 'change_formation', targetUnitId: 'muhajirun-trench-line', params: { formation: 'line' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'ansar-aws-sad-muadh', params: { formation: 'line' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'ansar-khazraj-sad-ubada', params: { formation: 'line' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'archers-embankment', params: { formation: 'line' }, delay: 1.5 },
      ],
      triggers: [],
    },

    // Phase 2 (7–13s): The rock and the three flashes.
    {
      id: 'phase-02-rock-and-prophecy',
      name: 'The Rock and the Three Flashes',
      nameAr: 'الصَّخْرَةُ وَوَمَضَاتُ الفَتْحِ',
      startTime: 7,
      duration: 6,
      description:
        "A stubborn rock blocks the dig. The Prophet ﷺ takes the pickaxe — Bukhari 4101: it crumbles to soft sand (kathiban ahyal). The al-Bara' chain adds the three flashes: the keys of Sham (north), of Persia at al-Mada'in (east), and of Yemen at San'a' (south).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 280, zoom: 0.85, duration: 3 }, delay: 0 },
        // Three flash effects — north (Sham), east (Persia), south (Yemen)
        { type: 'play_effect', params: { effect: 'flash', position: { x: 800, y: 80 }, color: 0xfff2a8, label: 'مَفَاتِحُ الشَّامِ' }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'flash', position: { x: 1500, y: 420 }, color: 0xfff2a8, label: 'قَصْرُ المَدَائِنِ' }, delay: 3 },
        { type: 'play_effect', params: { effect: 'flash', position: { x: 800, y: 1050 }, color: 0xfff2a8, label: 'أَبْوَابُ صَنْعَاءَ' }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 3 (13–19s): The Confederates arrive.
    {
      id: 'phase-03-ahzab-arrive',
      name: 'The Confederates Arrive',
      nameAr: 'وُصُولُ الأَحْزَابِ',
      startTime: 13,
      duration: 6,
      description:
        "Two columns converge: Quraysh + Ahabish (~4,000) from the coastal road under Abu Sufyan, encamping at Rumat / al-Jurf in the north-west; Ghatafan + Najdi allies (~6,000) from the eastern Najd road under 'Uyayna ibn Hisn, encamping near Uhud. Total ~10,000 with ~600 horse facing ~3,000 Muslims behind the trench.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 550, zoom: 0.4, duration: 3 }, delay: 0 },
        // Quraysh column tightens at its camp; cavalry move forward toward the trench
        { type: 'move_unit', targetUnitId: 'quraysh-main', params: { position: { x: 320, y: 150 }, speed: 40 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry', params: { position: { x: 400, y: 300 }, speed: 70 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'amr-champion-party', params: { position: { x: 770, y: 320 }, speed: 90 }, delay: 1.5 },
        // Ghatafan + allies consolidate at their camp
        { type: 'move_unit', targetUnitId: 'ghatafan-fazara', params: { position: { x: 1280, y: 150 }, speed: 40 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'ghatafan-cavalry', params: { position: { x: 1200, y: 300 }, speed: 70 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'banu-murra', params: { position: { x: 1380, y: 200 }, speed: 40 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'banu-sulaym', params: { position: { x: 1100, y: 150 }, speed: 40 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'banu-asad-tulayha', params: { position: { x: 1180, y: 200 }, speed: 40 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'banu-ashja', params: { position: { x: 1340, y: 230 }, speed: 40 }, delay: 0.5 },
        // The line on the trench tightens
        { type: 'set_behavior', targetUnitId: 'muhajirun-trench-line', params: { behavior: 'holding' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'ansar-aws-sad-muadh', params: { behavior: 'holding' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'ansar-khazraj-sad-ubada', params: { behavior: 'holding' }, delay: 2 },
      ],
      triggers: [],
    },

    // Phase 4 (19–24s): Banu Qurayza tear up the treaty.
    {
      id: 'phase-04-qurayza-breach',
      name: 'Banu Qurayza Tear Up the Treaty',
      nameAr: 'نَقْضُ بَنِي قُرَيْظَةَ لِلْعَهْدِ',
      startTime: 19,
      duration: 5,
      description:
        "Huyayy ibn Akhtab of Banu al-Nadir enters Ka'b ibn Asad's fortress and tears up the Sahifa (al-Waqidi 2/454–460). The threat now comes from north and south — Q 33:10. The Prophet ﷺ verifies via the two Sa'ds, then detaches Salama ibn Aslam and Zayd's mounted patrol to the inner city.",
      actions: [
        { type: 'camera_move', params: { x: 1200, y: 850, zoom: 0.7, duration: 3 }, delay: 0 },
        // Huyayy traverses from Quraysh camp to Qurayza fortress
        { type: 'move_unit', targetUnitId: 'huyayy-nadir-instigator', params: { position: { x: 1300, y: 880 }, speed: 110 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'treaty-torn', position: { x: 1300, y: 880 } }, delay: 3 },
        // Qurayza shifts visibly as a rear threat
        { type: 'set_behavior', targetUnitId: 'qurayza-defectors', params: { behavior: 'advancing' }, delay: 3 },
        { type: 'change_formation', targetUnitId: 'qurayza-defectors', params: { formation: 'line' }, delay: 3 },
        // Salama and Zayd take their interior posts
        { type: 'move_unit', targetUnitId: 'salama-fortress-guard', params: { position: { x: 445, y: 865 }, speed: 50 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'inner-city-patrol', params: { position: { x: 950, y: 920 }, speed: 95 }, delay: 1.5 },
      ],
      triggers: [],
    },

    // Phase 5 (24–29s): The Ghatafan date-bribe refused.
    {
      id: 'phase-05-ghatafan-bribe-refused',
      name: 'The Two Sa\'ds Refuse the Ghatafan Bribe',
      nameAr: 'رَدُّ الأَنْصَارِ صُلْحَ غَطَفَانَ',
      startTime: 24,
      duration: 5,
      description:
        "The Prophet ﷺ explores offering Ghatafan a third of Medina's date harvest to peel them off the coalition. He consults the two Sa'ds — Sa'd ibn Mu'adh and Sa'd ibn 'Ubada. They refuse: 'we never gave them a single date except by purchase or hospitality — how then now that Allah has honoured us with Islam?' The Prophet ﷺ tears up the draft.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 480, zoom: 0.85, duration: 3 }, delay: 0 },
        // The two Sa'ds approach the qubba briefly and return
        { type: 'move_unit', targetUnitId: 'ansar-aws-sad-muadh', params: { position: { x: 900, y: 600 }, speed: 50 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ansar-khazraj-sad-ubada', params: { position: { x: 700, y: 600 }, speed: 50 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'parchment-torn', position: { x: 800, y: 720 } }, delay: 3.5 },
        // Then return to their sectors
        { type: 'move_unit', targetUnitId: 'ansar-aws-sad-muadh', params: { position: { x: 1000, y: 480 }, speed: 50 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'ansar-khazraj-sad-ubada', params: { position: { x: 450, y: 480 }, speed: 50 }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 6 (29–35s): Trench probes; Sa'd ibn Mu'adh wounded.
    {
      id: 'phase-06-cavalry-probes',
      name: 'Probes Against the Trench',
      nameAr: 'مُحَاوَلَاتُ اقْتِحَامِ الخَنْدَقِ',
      startTime: 29,
      duration: 6,
      description:
        "Day after day of Confederate probes. Archery exchanges across the ditch. Hibban ibn al-'Ariqa shoots Sa'd ibn Mu'adh in the akhal (median vein) — Bukhari 463, 4122 — a wound that will claim him after he passes judgement on Banu Qurayza. The trench holds.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 320, zoom: 0.65, duration: 3 }, delay: 0 },
        // Quraysh cavalry charges and recoils
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry', params: { position: { x: 500, y: 380 }, speed: 130 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry', params: { position: { x: 360, y: 280 }, speed: 130 }, delay: 2 },
        // Ghatafan cavalry the same against the eastern sector
        { type: 'set_behavior', targetUnitId: 'ghatafan-cavalry', params: { behavior: 'attacking' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'ghatafan-cavalry', params: { position: { x: 1120, y: 380 }, speed: 130 }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'ghatafan-cavalry', params: { behavior: 'retreating' }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'ghatafan-cavalry', params: { position: { x: 1240, y: 280 }, speed: 130 }, delay: 2.5 },
        // Archery exchange: archers vs the cavalry; cavalry shoot back
        { type: 'attack_unit', targetUnitId: 'archers-embankment', params: { targetId: 'quraysh-cavalry' }, delay: 1.2 },
        { type: 'attack_unit', targetUnitId: 'archers-embankment', params: { targetId: 'ghatafan-cavalry' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'quraysh-cavalry', params: { targetId: 'ansar-aws-sad-muadh' }, delay: 3.5 },
        // Sa'd ibn Mu'adh struck — the akhal wound
        { type: 'play_effect', params: { effect: 'arrow-strike', targetUnitId: 'ansar-aws-sad-muadh', label: "أَكْحَلُ سَعْدٍ" }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 7 (35–43s): 'Amr leaps the trench; 'Ali kills him.
    {
      id: 'phase-07-amr-leap-and-duel',
      name: "'Amr's Leap and 'Ali's Duel",
      nameAr: 'عَبْرُ عَمْرٍو وَمُبَارَزَةُ عَلِيٍّ',
      startTime: 35,
      duration: 8,
      description:
        "'Amr ibn 'Abd Wudd al-'Amiri leaps the narrow crossing with four riders ('Ikrima, Hubayra, Nawfal, Dirar) and calls for a champion. 'Ali ibn Abi Talib rises three times; the Prophet ﷺ girds him with his own sword and prays for him. 'Ali kills 'Amr in single combat; Nawfal falls into the trench; the rest flee. (Ibn Hisham; al-Tabari, year 5 AH).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 320, zoom: 0.92, duration: 3 }, delay: 0 },
        // 'Amr's party gallops to the narrow and leaps
        { type: 'set_behavior', targetUnitId: 'amr-champion-party', params: { behavior: 'attacking' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'amr-champion-party', params: { position: { x: 800, y: 380 }, speed: 160 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'amr-champion-party', params: { position: { x: 800, y: 470 }, speed: 110 }, delay: 1.5 },
        // 'Ali advances to meet him
        { type: 'set_behavior', targetUnitId: 'ali-champion-reserve', params: { behavior: 'advancing' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'ali-champion-reserve', params: { position: { x: 800, y: 510 }, speed: 110 }, delay: 1.5 },
        // Dust cloud / takbir
        { type: 'play_effect', params: { effect: 'dust-cloud', position: { x: 800, y: 490 } }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'ali-champion-reserve', params: { targetId: 'amr-champion-party' }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'takbir-burst', position: { x: 800, y: 490 } }, delay: 5 },
        // 'Amr killed; the rest flee back north
        { type: 'destroy_unit', targetUnitId: 'amr-champion-party', params: { cause: 'killed_in_single_combat' }, delay: 5.5 },
        // 'Ali returns to reserve position
        { type: 'move_unit', targetUnitId: 'ali-champion-reserve', params: { position: { x: 800, y: 540 }, speed: 90 }, delay: 6 },
      ],
      triggers: [],
    },

    // Phase 8 (43–48s): Missed 'Asr prayer and the imprecation.
    {
      id: 'phase-08-missed-asr-imprecation',
      name: 'The Missed Asr & the Imprecation',
      nameAr: 'فَوَاتُ العَصْرِ وَدُعَاءُ النَّبِيِّ ﷺ',
      startTime: 43,
      duration: 5,
      description:
        "The Confederates' continual pressure prevents the 'Asr prayer until after sunset. The Prophet ﷺ raises the famous imprecation (Bukhari 4111, 4533, narrated by 'Ali): 'May Allah fill their houses and their graves with fire, as they distracted us from the middle prayer until the sun set.'",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 480, zoom: 0.85, duration: 3 }, delay: 0 },
        // The line faces qibla in the dimming light
        { type: 'change_formation', targetUnitId: 'prophet-command-sal', params: { formation: 'line' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'raised-hands', targetUnitId: 'prophet-command-sal' }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 9 (48–53s): Nu'aym's covert disinformation.
    {
      id: 'phase-09-nuaym-disinformation',
      name: "Nu'aym ibn Mas'ud's Covert Mission",
      nameAr: 'خِدْعَةُ نُعَيْمِ بنِ مَسْعُودٍ',
      startTime: 48,
      duration: 5,
      description:
        "Nu'aym ibn Mas'ud al-Ghatafani secretly converts. The Prophet ﷺ tells him: 'al-harb khud'a' — war is deception (Bukhari 3030; Muslim 1740). Nu'aym tells Banu Qurayza to demand Qurayshi noble-hostages before any joint attack; he then warns Quraysh and Ghatafan that Qurayza intend to seize their nobles to hand to Muhammad ﷺ. Coordination collapses.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 600, zoom: 0.5, duration: 3 }, delay: 0 },
        // Nu'aym traces the triangle: ghatafan → qurayza → quraysh → ghatafan
        { type: 'move_unit', targetUnitId: 'nuaym-defector', params: { position: { x: 1300, y: 880 }, speed: 180 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'severance-line', from: { x: 1290, y: 230 }, to: { x: 1300, y: 880 } }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'nuaym-defector', params: { position: { x: 320, y: 150 }, speed: 200 }, delay: 2 },
        { type: 'play_effect', params: { effect: 'severance-line', from: { x: 1300, y: 880 }, to: { x: 320, y: 150 } }, delay: 3 },
        { type: 'move_unit', targetUnitId: 'nuaym-defector', params: { position: { x: 1290, y: 230 }, speed: 200 }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'severance-line', from: { x: 320, y: 150 }, to: { x: 1290, y: 230 } }, delay: 4.5 },
        // Qurayza pull back into their fortresses
        { type: 'set_behavior', targetUnitId: 'qurayza-defectors', params: { behavior: 'holding' }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 10 (53–61s): The saba wind & Hudhayfa's night-scout.
    {
      id: 'phase-10-storm-and-hudhayfa',
      name: "The Saba Wind & Hudhayfa's Mission",
      nameAr: 'رِيحُ الصَّبَا وَاسْتِطْلَاعُ حُذَيْفَةَ',
      startTime: 53,
      duration: 8,
      description:
        "A violent cold east-wind (al-saba) on a freezing night overturns Confederate tents and extinguishes their fires. Q 33:9: 'we sent against them a wind and forces you did not see.' The Prophet ﷺ calls three times for a scout and only Hudhayfa ibn al-Yaman answers (Sahih Muslim 1788): 'Rise, O Hudhayfa; bring me news of the people, and do not alarm them against me.'",
      actions: [
        { type: 'camera_move', params: { x: 950, y: 200, zoom: 0.7, duration: 3 }, delay: 0 },
        // Wind effect across the Confederate camps
        { type: 'play_effect', params: { effect: 'wind-streak', position: { x: 800, y: 150 }, intensity: 1.0 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'fires-extinguished', position: { x: 320, y: 150 } }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'fires-extinguished', position: { x: 1280, y: 150 } }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'tents-overturned', position: { x: 320, y: 150 } }, delay: 2 },
        { type: 'play_effect', params: { effect: 'tents-overturned', position: { x: 1280, y: 150 } }, delay: 2 },
        // Confederate units scatter slightly under the wind
        { type: 'change_formation', targetUnitId: 'quraysh-main', params: { formation: 'scattered' }, delay: 2.5 },
        { type: 'change_formation', targetUnitId: 'ghatafan-fazara', params: { formation: 'scattered' }, delay: 2.5 },
        // Hudhayfa moves from Mount Sal' to the perimeter of Quraysh camp
        { type: 'camera_move', params: { x: 600, y: 200, zoom: 0.9, duration: 3 }, delay: 4 },
        { type: 'set_behavior', targetUnitId: 'hudhayfa-night-scout', params: { behavior: 'advancing' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'hudhayfa-night-scout', params: { position: { x: 600, y: 470 }, speed: 110 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'hudhayfa-night-scout', params: { position: { x: 420, y: 230 }, speed: 110 }, delay: 5.5 },
      ],
      triggers: [],
    },

    // Phase 11 (61–65s): The Confederates disperse.
    {
      id: 'phase-11-confederates-disperse',
      name: 'The Confederates Disperse',
      nameAr: 'تَفَرُّقُ الأَحْزَابِ',
      startTime: 61,
      duration: 4,
      description:
        "Abu Sufyan addresses the Quraysh: 'O people of Quraysh, by Allah you are not in a place of stay … horses and camels have perished, Banu Qurayza has betrayed us, and we have suffered from this wind what you see — let every man depart' (Ibn Hisham; cf. Muslim 1788). Quraysh withdraw west toward the coast; Ghatafan east toward Najd. The trench has held; ~6 Muslim martyrs and ~3 named Confederate dead.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 550, zoom: 0.42, duration: 3 }, delay: 0 },
        // Hudhayfa returns to Mount Sal'
        { type: 'set_behavior', targetUnitId: 'hudhayfa-night-scout', params: { behavior: 'retreating' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'hudhayfa-night-scout', params: { position: { x: 820, y: 730 }, speed: 130 }, delay: 0 },
        // Quraysh stream west off-map
        { type: 'set_behavior', targetUnitId: 'quraysh-main', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-main', params: { position: { x: 50, y: 80 }, speed: 110 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'quraysh-cavalry', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'quraysh-cavalry', params: { position: { x: 50, y: 200 }, speed: 140 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'huyayy-nadir-instigator', params: { position: { x: 50, y: 80 }, speed: 110 }, delay: 1 },
        // Ghatafan + allies stream east off-map
        { type: 'set_behavior', targetUnitId: 'ghatafan-fazara', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ghatafan-fazara', params: { position: { x: 1550, y: 80 }, speed: 110 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'ghatafan-cavalry', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ghatafan-cavalry', params: { position: { x: 1550, y: 200 }, speed: 140 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'banu-murra', params: { position: { x: 1550, y: 200 }, speed: 100 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'banu-sulaym', params: { position: { x: 1550, y: 150 }, speed: 100 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'banu-asad-tulayha', params: { position: { x: 1550, y: 200 }, speed: 100 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'banu-ashja', params: { position: { x: 1550, y: 230 }, speed: 100 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'nuaym-defector', params: { position: { x: 1550, y: 230 }, speed: 130 }, delay: 0.5 },
        // Qurayza pull back inside the fortresses
        { type: 'change_formation', targetUnitId: 'qurayza-defectors', params: { formation: 'defensive_circle' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'qurayza-defectors', params: { behavior: 'holding' }, delay: 1 },
      ],
      triggers: [],
    },

    // Phase 12 (65–68s): "Now we shall raid them, and they shall not raid us."
    {
      id: 'phase-12-now-we-raid-them',
      name: 'Now We Shall Raid Them',
      nameAr: 'الآنَ نَغْزُوهُمْ وَلَا يَغْزُونَنَا',
      startTime: 65,
      duration: 3,
      description:
        "Sulayman ibn Surad al-Khuza'i (Bukhari 4109–4110): the Prophet ﷺ said on the day the Ahzab were driven away: 'naghzuhum wa la yaghzunana' — 'we shall raid them and they shall not raid us.' Quraysh never besieged Medina again.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 480, zoom: 0.95, duration: 2.5 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'banner-raise', targetUnitId: 'prophet-command-sal' }, delay: 1 },
      ],
      triggers: [],
    },
  ],

  // ─── Narration ─────────────────────────────────────────────────────────────
  narration: [
    {
      id: 'narr-01-salman-counsel',
      time: 1.5,
      duration: 5,
      text: 'In Shawwal of the fifth year of the Hijra the Confederates advanced. Salman al-Farisi counselled digging a trench across the northern flank — the only face of Medina open to cavalry — while the two harras, the palm-groves, and the stone fortresses screened the rest.',
      textAr:
        'فِي شَوَّالٍ مِنَ السَّنَةِ الْخَامِسَةِ لِلْهِجْرَةِ، أَقْبَلَتِ الْأَحْزَابُ. أَشَارَ سَلْمَانُ الْفَارِسِيُّ بِحَفْرِ الْخَنْدَقِ عَلَى الْجَبْهَةِ الشَّمَالِيَّةِ — الْوَجْهِ الْوَحِيدِ الْمَكْشُوفِ لِلْمَدِينَةِ — وَتَحَصَّنَتْ سَائِرُ الْجِهَاتِ بِالْحَرَّتَيْنِ وَالنَّخِيلِ وَالْآطَامِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-02-ibn-rawaha-rajaz',
      time: 7.5,
      duration: 4.5,
      text: "The Prophet ﷺ carried earth himself until dust covered the skin of his belly, chanting with the Companions Ibn Rawaha's verses: 'O Allah, but for You we would not be guided, nor would we give charity nor pray; send down tranquillity upon us, and steady our feet when we meet the foe.' (Bukhari 4106)",
      textAr:
        'حَمَلَ النَّبِيُّ ﷺ التُّرَابَ بِنَفْسِهِ حَتَّى وَارَى التُّرَابُ جِلْدَةَ بَطْنِهِ، يُرَدِّدُ مَعَ الصَّحَابَةِ: «اللَّهُمَّ لَوْلَا أَنْتَ مَا اهْتَدَيْنَا، وَلَا تَصَدَّقْنَا وَلَا صَلَّيْنَا، فَأَنْزِلَنْ سَكِينَةً عَلَيْنَا، وَثَبِّتِ الْأَقْدَامَ إِنْ لَاقَيْنَا».',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-03-rock-prophecy',
      time: 9.5,
      duration: 3.5,
      text: "A hard rock obstructed them; the Prophet ﷺ took the pickaxe and struck — and it crumbled to soft sand. At the first strike: 'I have been given the keys of Sham.' At the second: 'I have been given the keys of Persia, and I see the white palace of al-Mada'in.' At the third: 'I have been given the keys of Yemen, and I see the gates of San'a'.' (Bukhari 4101)",
      textAr:
        'وَاعْتَرَضَتْهُمْ كُدْيَةٌ شَدِيدَةٌ، فَأَخَذَ النَّبِيُّ ﷺ الْمِعْوَلَ فَضَرَبَ، فَعَادَتْ كَثِيبًا أَهْيَلَ. وَفِي الضَّرْبَةِ الْأُولَى: «أُعْطِيتُ مَفَاتِحَ الشَّامِ»، وَفِي الثَّانِيَةِ: «أُعْطِيتُ مَفَاتِحَ فَارِسَ، وَإِنِّي لَأُبْصِرُ قَصْرَ الْمَدَائِنِ الْأَبْيَضَ»، وَفِي الثَّالِثَةِ: «أُعْطِيتُ مَفَاتِحَ الْيَمَنِ، وَإِنِّي لَأُبْصِرُ أَبْوَابَ صَنْعَاءَ».',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-04-ahzab-arrival',
      time: 14,
      duration: 4.5,
      text: "The Confederates advanced — some ten thousand strong: Quraysh and the Ahabish under Abu Sufyan ibn Harb by the coastal road, and Ghatafan and her Najdi allies under 'Uyayna ibn Hisn by the eastern road, with six hundred horse among them — facing some three thousand Muslims behind the trench.",
      textAr:
        'أَقْبَلَتِ الْأَحْزَابُ نَحْوَ عَشَرَةِ آلَافٍ: قُرَيْشٌ وَأَحَابِيشُهَا تَحْتَ رَايَةِ أَبِي سُفْيَانَ بْنِ حَرْبٍ مِنْ طَرِيقِ السَّاحِلِ، وَغَطَفَانُ وَحُلَفَاؤُهَا تَحْتَ رَايَةِ عُيَيْنَةَ بْنِ حِصْنٍ مِنْ طَرِيقِ نَجْدٍ، وَفِيهِمْ سِتُّ مِئَةِ فَارِسٍ. وَالْمُسْلِمُونَ نَحْوَ ثَلَاثَةِ آلَافٍ خَلْفَ الْخَنْدَقِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-05-qurayza-breach',
      time: 19.5,
      duration: 4,
      text: "Huyayy ibn Akhtab entered the fortress of Ka'b ibn Asad, and Banu Qurayza tore up the treaty from behind the city. The threat now came from north and south together.",
      textAr:
        'وَدَخَلَ حُيَيُّ بْنُ أَخْطَبَ حِصْنَ كَعْبِ بْنِ أَسَدٍ، فَنَقَضَ بَنُو قُرَيْظَةَ الْعَهْدَ مِنْ خَلْفِ الْمَدِينَةِ. فَكَانَتِ الْجَبْهَةُ مِنَ الشَّمَالِ وَالْجَنُوبِ مَعًا.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-06-quran-33-10',
      time: 23.5,
      duration: 5.5,
      text: "'When they came upon you from above you and from below you, and when eyes shifted and hearts reached the throats, and you began to think strange thoughts about Allah — there the believers were tested, and shaken with a violent shaking.' (Q 33:10–11)",
      textAr:
        '﴿إِذْ جَاءُوكُم مِّن فَوْقِكُمْ وَمِنْ أَسْفَلَ مِنكُمْ وَإِذْ زَاغَتِ الْأَبْصَارُ وَبَلَغَتِ الْقُلُوبُ الْحَنَاجِرَ وَتَظُنُّونَ بِاللَّهِ الظُّنُونَا ۚ هُنَالِكَ ابْتُلِيَ الْمُؤْمِنُونَ وَزُلْزِلُوا زِلْزَالًا شَدِيدًا﴾',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-07-ghatafan-bribe-refused',
      time: 25,
      duration: 4,
      text: "The Prophet ﷺ considered offering Ghatafan a third of Medina's date harvest to withdraw. The two Sa'ds — Sa'd ibn Mu'adh and Sa'd ibn 'Ubada — refused: 'By Allah, they could not hope to have a single date from us in jahiliyya except by hospitality or purchase — how then now that Allah has honoured us with Islam?' He ﷺ tore up the draft. (Ibn Hisham; al-Waqidi 2/477)",
      textAr:
        'وَهَمَّ النَّبِيُّ ﷺ أَنْ يُعْطِيَ غَطَفَانَ ثُلُثَ ثِمَارِ الْمَدِينَةِ لِيَنْصَرِفُوا، فَأَبَى السَّعْدَانِ — سَعْدُ بْنُ مُعَاذٍ وَسَعْدُ بْنُ عُبَادَةَ — وَقَالَا: «وَاللَّهِ مَا كَانُوا يَطْمَعُونَ مِنَّا فِي الْجَاهِلِيَّةِ بِتَمْرَةٍ إِلَّا قِرًى أَوْ بَيْعًا، فَكَيْفَ وَقَدْ أَكْرَمَنَا اللَّهُ بِالْإِسْلَامِ؟»، فَمَزَّقَ ﷺ الصَّحِيفَةَ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-08-trench-holds',
      time: 30,
      duration: 4,
      text: "The breach attempts continued for some twenty nights — arrows clashing across the ditch, every horseman who tried to cross thrown back. The trench held.",
      textAr:
        'وَدَامَتْ مُحَاوَلَاتُ الِاقْتِحَامِ نَحْوًا مِنْ عِشْرِينَ لَيْلَةً، تَصْطَكُّ النِّبَالُ فَوْقَ الْخَنْدَقِ، وَيَرْتَدُّ كُلُّ فَارِسٍ هَمَّ بِالْعُبُورِ. صَمَدَ الْحَفِيرُ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-09-sad-muadh-wounded',
      time: 33.5,
      duration: 3,
      text: "Hibban ibn al-'Ariqa shot Sa'd ibn Mu'adh, severing the median vein of his arm — a wound that would claim him after he passed judgment on Banu Qurayza. (Bukhari 463, 4122)",
      textAr:
        'وَرَمَى حِبَّانُ بْنُ الْعَرِقَةِ سَعْدَ بْنَ مُعَاذٍ بِسَهْمٍ، فَقَطَعَ أَكْحَلَهُ — جُرْحٌ سَيُدْرِكُهُ بَعْدَ قَضَائِهِ فِي بَنِي قُرَيْظَةَ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-10-ali-vs-amr',
      time: 36,
      duration: 6.5,
      text: "'Amr ibn 'Abd Wudd al-'Amiri leapt the narrow crossing with five horsemen and called for a champion. 'Ali ibn Abi Talib rose; the Prophet ﷺ girded him with his own sword and prayed for him. From beneath the dust the takbir rang out — 'Amr was killed, Nawfal fell into the trench, and the rest fled. (Ibn Hisham; al-Tabari, year 5 AH)",
      textAr:
        'وَوَثَبَ عَمْرُو بْنُ عَبْدِ وُدٍّ الْعَامِرِيُّ بِفَرَسِهِ مِنْ مَضِيقِ الْخَنْدَقِ فِي خَمْسَةِ فُرْسَانٍ، فَنَادَى لِلْمُبَارَزَةِ. فَقَامَ عَلِيُّ بْنُ أَبِي طَالِبٍ، فَقَلَّدَهُ النَّبِيُّ ﷺ سَيْفَهُ وَدَعَا لَهُ. وَتَحْتَ الْغُبَارِ عَلَا التَّكْبِيرُ — قُتِلَ عَمْرٌو، وَسَقَطَ نَوْفَلٌ فِي الْخَنْدَقِ، وَفَرَّ مَنْ بَقِيَ.',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-11-missed-asr-dua',
      time: 44,
      duration: 4.5,
      text: "The Confederates kept them from the 'Asr prayer until the sun had set. The Prophet ﷺ said: 'May Allah fill their houses and their graves with fire, as they distracted us from the middle prayer until the sun set.' (Bukhari 4111, 4533)",
      textAr:
        'وَشَغَلَتْهُمُ الْأَحْزَابُ عَنْ صَلَاةِ الْعَصْرِ حَتَّى غَابَتِ الشَّمْسُ. فَقَالَ النَّبِيُّ ﷺ: «مَلَأَ اللَّهُ عَلَيْهِمْ بُيُوتَهُمْ وَقُبُورَهُمْ نَارًا، كَمَا شَغَلُونَا عَنِ الصَّلَاةِ الْوُسْطَى حَتَّى غَابَتِ الشَّمْسُ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-12-nuaym-deception',
      time: 49,
      duration: 4,
      text: "Nu'aym ibn Mas'ud secretly accepted Islam. The Prophet ﷺ said to him: 'You are but one man among us; weaken them on our behalf if you can, for war is deception.' He sowed distrust between Quraysh, Ghatafan, and Qurayza, and their unity unravelled. (Ibn Hisham; Bukhari 3030; Muslim 1740)",
      textAr:
        'وَأَسْلَمَ نُعَيْمُ بْنُ مَسْعُودٍ سِرًّا، فَقَالَ لَهُ النَّبِيُّ ﷺ: «إِنَّمَا أَنْتَ فِينَا رَجُلٌ وَاحِدٌ، فَخَذِّلْ عَنَّا إِنِ اسْتَطَعْتَ، فَإِنَّ الْحَرْبَ خُدْعَةٌ». فَأَفْسَدَ بَيْنَ قُرَيْشٍ وَغَطَفَانَ وَقُرَيْظَةَ، فَتَفَكَّكَتْ كَلِمَتُهُمْ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-13-quran-33-9',
      time: 53.5,
      duration: 5,
      text: "'O you who believe, remember Allah's favour upon you when armies came against you, and We sent against them a wind and forces you did not see.' (Q 33:9). And the Prophet ﷺ said: 'I was given victory by the saba (east-wind), and 'Ad was destroyed by the dabur (west-wind).' (Bukhari 1035; Muslim 900)",
      textAr:
        '﴿يَا أَيُّهَا الَّذِينَ آمَنُوا اذْكُرُوا نِعْمَةَ اللَّهِ عَلَيْكُمْ إِذْ جَاءَتْكُمْ جُنُودٌ فَأَرْسَلْنَا عَلَيْهِمْ رِيحًا وَجُنُودًا لَّمْ تَرَوْهَا﴾ — وَقَالَ ﷺ: «نُصِرْتُ بِالصَّبَا، وَأُهْلِكَتْ عَادٌ بِالدَّبُورِ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-14-hudhayfa-mission',
      time: 56.5,
      duration: 4,
      text: "On that night — the night of the wind and the bitter cold — the Prophet ﷺ called three times and no one answered, then said: 'Rise, O Hudhayfa; bring me news of the people, and do not alarm them against me.' Hudhayfa slipped into Abu Sufyan's camp as if he were walking in a bathhouse. (Sahih Muslim 1788)",
      textAr:
        'فِي تِلْكَ اللَّيْلَةِ — لَيْلَةِ الرِّيحِ وَالْقُرِّ — قَالَ النَّبِيُّ ﷺ ثَلَاثًا فَلَمْ يَقُمْ أَحَدٌ، ثُمَّ قَالَ: «قُمْ يَا حُذَيْفَةُ، فَأْتِنَا بِخَبَرِ الْقَوْمِ، وَلَا تَذْعَرْهُمْ عَلَيَّ». فَدَخَلَ مُعَسْكَرَ أَبِي سُفْيَانَ كَأَنَّهُ يَمْشِي فِي حَمَّامٍ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-15-abu-sufyan-found',
      time: 60.5,
      duration: 3,
      text: "He found Abu Sufyan warming his back at the fire — the horses and camels perished, Qurayza had failed them, and the wind had quenched their fires.",
      textAr:
        'وَوَجَدَ أَبَا سُفْيَانَ يَصْلِي ظَهْرَهُ بِالنَّارِ، وَقَدْ هَلَكَتِ الْخَيْلُ وَالْإِبِلُ، وَأَخْلَفَتْهُمْ قُرَيْظَةُ، وَأَطْفَأَتِ الرِّيحُ نِيرَانَهُمْ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-16-abu-sufyan-retreat-quote',
      time: 63,
      duration: 2,
      text: "Abu Sufyan rose and called out: 'O people of Quraysh, by Allah you are not in a place of stay … depart, for I am departing.' The Confederates dispersed — Quraysh westward toward the coast, Ghatafan eastward toward Najd. (Ibn Hisham; cf. Muslim 1788)",
      textAr:
        'فَقَامَ أَبُو سُفْيَانَ يُنَادِي: «يَا مَعْشَرَ قُرَيْشٍ، إِنَّكُمْ — وَاللَّهِ — مَا أَصْبَحْتُمْ بِدَارِ مُقَامٍ… فَارْتَحِلُوا، فَإِنِّي مُرْتَحِلٌ». وَتَفَرَّقَتِ الْأَحْزَابُ — قُرَيْشٌ نَحْوَ السَّاحِلِ، وَغَطَفَانُ نَحْوَ نَجْدٍ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-17-final-doctrine-shift',
      time: 65.5,
      duration: 2.5,
      text: "On the day the Confederates withdrew, the Prophet ﷺ said: 'We shall raid them, and they shall not raid us.' (Bukhari 4109) The Trench was the last time Quraysh ever marched on Medina.",
      textAr:
        'وَقَالَ ﷺ يَوْمَ انْصَرَفَتِ الْأَحْزَابُ: «نَغْزُوهُمْ وَلَا يَغْزُونَنَا». فَكَانَتِ الْخَنْدَقُ آخِرَ غَزْوٍ لِقُرَيْشٍ عَلَى الْمَدِينَةِ.',
      style: 'dramatic',
      position: 'center',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    // Wide overview of Medina at dusk
    { time: 0, position: { x: 800, y: 550 }, zoom: 0.45, duration: 7, easing: 'power2.inOut', type: 'overview' },
    // Push in tight on the trench narrow as the rock is struck — flashes
    { time: 7, position: { x: 800, y: 280 }, zoom: 0.85, duration: 6, easing: 'power2.inOut', type: 'focus' },
    // Pull back to maximum overview — Confederate columns marching in
    { time: 13, position: { x: 800, y: 550 }, zoom: 0.4, duration: 6, easing: 'power2.out', type: 'overview' },
    // Pan south-east to Banu Qurayza's fortresses for the treaty-breach
    { time: 19, position: { x: 1200, y: 850 }, zoom: 0.7, duration: 5, easing: 'power2.inOut', type: 'pan' },
    // Tighten on the qubba for the Ghatafan-bribe consultation
    { time: 24, position: { x: 800, y: 480 }, zoom: 0.85, duration: 5, easing: 'power2.inOut', type: 'focus', followEntityId: 'prophet-command-sal' },
    // Slide along the trench-line during the multi-day probes
    { time: 29, position: { x: 800, y: 320 }, zoom: 0.65, duration: 6, easing: 'power2.inOut', type: 'pan' },
    // Maximum zoom on the duel — 'Amr's leap, the dust, the takbir
    { time: 35, position: { x: 800, y: 320 }, zoom: 0.92, duration: 8, easing: 'power2.out', type: 'focus' },
    // Hold on the Prophet's qubba as dusk falls and the imprecation is raised
    { time: 43, position: { x: 800, y: 480 }, zoom: 0.85, duration: 5, easing: 'power2.inOut', type: 'focus', followEntityId: 'prophet-command-sal' },
    // Wide triangular framing of the three coalition camps for Nu'aym's path
    { time: 48, position: { x: 800, y: 600 }, zoom: 0.5, duration: 5, easing: 'power2.inOut', type: 'overview' },
    // Sweep east across the storm-battered Confederate camps
    { time: 53, position: { x: 950, y: 200 }, zoom: 0.7, duration: 4, easing: 'power2.inOut', type: 'pan' },
    // Tight low-angle follow on Hudhayfa as he slips into Abu Sufyan's camp
    { time: 57, position: { x: 600, y: 200 }, zoom: 0.9, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'hudhayfa-night-scout' },
    // Pull back to overview as the Confederates stream away at first light
    { time: 61, position: { x: 800, y: 550 }, zoom: 0.42, duration: 4, easing: 'power2.out', type: 'overview' },
    // Final slow-zoom into the Prophet's banner at Mount Sal'
    { time: 65, position: { x: 800, y: 480 }, zoom: 0.95, duration: 3, easing: 'power2.in', type: 'zoom', followEntityId: 'prophet-command-sal' },
  ],

  // ─── Outcome ───────────────────────────────────────────────────────────────
  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 6,
    enemyCasualties: 3,
    summary:
      "The trench held for some twenty nights and the Confederates failed to force Medina. 'Ali killed 'Amr ibn 'Abd Wudd in single combat; Nu'aym ibn Mas'ud's covert mission shattered the coalition's coordination; and Allah sent the saba wind that quenched the besiegers' fires and overturned their tents — they dispersed without a decisive engagement. Six Muslims were martyred (including Sa'd ibn Mu'adh, who later died of his wound after judging Banu Qurayza); three named Confederates fell, most prominently 'Amr ibn 'Abd Wudd al-'Amiri.",
    summaryAr:
      'ثَبَتَ الْخَنْدَقُ نَحْوًا مِنْ عِشْرِينَ لَيْلَةً، فَأَخْفَقَ الْأَحْزَابُ فِي اقْتِحَامِ الْمَدِينَةِ. قَتَلَ عَلِيٌّ عَمْرَو بْنَ عَبْدِ وُدٍّ فِي الْمُبَارَزَةِ، وَكَسَرَتْ خِدْعَةُ نُعَيْمٍ تَحَالُفَهُمْ، وَأَرْسَلَ اللَّهُ عَلَيْهِمْ رِيحَ الصَّبَا فَأَطْفَأَتْ نِيرَانَهُمْ وَقَلَبَتْ خِيَامَهُمْ، فَتَفَرَّقُوا دُونَ مَعْرَكَةٍ فَاصِلَةٍ. اسْتُشْهِدَ مِنَ الْمُسْلِمِينَ سِتَّةٌ — مِنْهُمْ سَعْدُ بْنُ مُعَاذٍ مِنْ جُرْحِهِ بَعْدَ الْقَضَاءِ فِي بَنِي قُرَيْظَةَ — وَقُتِلَ مِنَ الْأَحْزَابِ ثَلَاثَةٌ، أَشْهَرُهُمْ عَمْرُو بْنُ عَبْدِ وُدٍّ.',
    significance:
      "The Trench was the last time Quraysh ever besieged Medina, and the strategic hinge of the entire Sira — the Prophet ﷺ declared (Bukhari 4109): 'We shall raid them, and they shall not raid us.' Surat al-Ahzab was revealed about it, and the Qur'an confirmed: 'Allah sufficed the believers in fighting' (33:25). Its outcomes opened the way to the removal of Banu Qurayza, then Hudaybiyya, then Khaybar, then the Conquest of Mecca.",
    significanceAr:
      'كَانَتْ غَزْوَةُ الْخَنْدَقِ آخِرَ غَزْوٍ لِقُرَيْشٍ عَلَى الْمَدِينَةِ، وَنُقْطَةَ التَّحَوُّلِ الْاسْتِرَاتِيجِيَّةِ فِي السِّيرَةِ — قَالَ ﷺ: «نَغْزُوهُمْ وَلَا يَغْزُونَنَا». نَزَلَتْ سُورَةُ الْأَحْزَابِ تَأْرِيخًا لَهَا، وَأَقَرَّ الْقُرْآنُ: ﴿وَكَفَى اللَّهُ الْمُؤْمِنِينَ الْقِتَالَ﴾. وَفَتَحَتْ بِنَتَائِجِهَا الْبَابَ لِإِجْلَاءِ بَنِي قُرَيْظَةَ، ثُمَّ صُلْحِ الْحُدَيْبِيَةِ، فَفَتْحِ خَيْبَرَ، فَفَتْحِ مَكَّةَ.',
  },

  totalDuration: 68,
};
