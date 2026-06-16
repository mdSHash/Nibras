import type { BattleScenario } from '../types/scenario';

/**
 * غَزْوَةُ تَبُوكَ — جَيْشُ الْعُسْرَةِ
 * The Expedition of Tabuk — The Army of Hardship
 *
 * Rajab 9 AH / ~October 630 CE — eight months after Fath Makkah,
 * three months after Hunayn and the siege of al-Ta'if. The last
 * military expedition the Prophet ﷺ ever led, and the only one for
 * which he openly announced the destination beforehand (Bukhari 4418):
 * a 700 km march from Madinah north through the Hijaz to the oasis
 * of Tabuk, where the great Caesarean field army of Heraclius was
 * said to be massing in al-Balqa to strike the new Muslim polity.
 *
 * The summer of 9 AH was an unprecedented heat: the date harvest
 * stood ripe on the trees, water was scarce, and the desert from
 * Wadi al-Qura to Tabuk was almost waterless for stretches. Hence
 * the Qur'anic title — جَيْشُ الْعُسْرَةِ, the Army of Hardship —
 * and the address in Surah al-Tawbah condemning those who held back:
 * «انْفِرُوا خِفَافًا وَثِقَالًا وَجَاهِدُوا بِأَمْوَالِكُمْ وَأَنْفُسِكُمْ
 * فِي سَبِيلِ اللَّهِ» (al-Tawbah 9:41).
 *
 * The Prophet ﷺ called for charity in unprecedented fashion. 'Uthman
 * ibn 'Affan equipped fully one third of the army — by tradition 950
 * camels and 50 horses with their saddles, gear and provisions, plus
 * a thousand gold dinars poured into the Prophet's lap; and the
 * Prophet ﷺ said: «مَا ضَرَّ عُثْمَانَ مَا عَمِلَ بَعْدَ هَذِهِ»
 * (Tirmidhi 3701, hasan). Abu Bakr brought all his wealth, every
 * dirham; 'Umar brought half. The poor of the Companions, the
 * Bakka'un — those who wept — came begging mounts and were turned
 * back for lack of any (al-Tawbah 9:92), and the Prophet ﷺ comforted
 * them. Abu Khaythamah and Abu Dharr al-Ghifari each set out alone
 * on foot after the army had departed, and Abu Dharr's camel having
 * died beneath him, he carried his pack on his own back across the
 * desert until he caught up — and the Prophet ﷺ said: «رَحِمَ اللَّهُ
 * أَبَا ذَرٍّ، يَمْشِي وَحْدَهُ، وَيَمُوتُ وَحْدَهُ، وَيُبْعَثُ وَحْدَهُ»
 * (Ibn Hisham; al-Hakim, sahih).
 *
 * The hypocrites under 'Abdullah ibn Ubayy ibn Salul pitched a rival
 * camp at Dhu Jadd, just north of Madinah, then peeled away as the
 * Prophet ﷺ moved north through Thaniyyat al-Wada — al-Tawbah 9:81
 * descended on them. At al-Jurf on the outskirts of Madinah the
 * Prophet ﷺ left 'Ali ibn Abi Talib in charge of the city and his
 * household — and when the hypocrites whispered that the Prophet ﷺ
 * had abandoned him, 'Ali rode out to him; the Prophet ﷺ replied
 * with the words now known as Hadith al-Manzilah: «أَمَا تَرْضَى أَنْ
 * تَكُونَ مِنِّي بِمَنْزِلَةِ هَارُونَ مِنْ مُوسَى، إِلَّا أَنَّهُ لَا نَبِيَّ
 * بَعْدِي» (Bukhari 4416; Muslim 2404).
 *
 * The army — by the largest figures in tradition 30,000 men with
 * 10,000 horse, the largest field force the Prophet ﷺ ever led —
 * marched through Wadi al-Qura into the deep north. Passing al-Hijr,
 * the cursed sandstone outcrops of the people of Salih (Madain Salih
 * today), the Prophet ﷺ commanded the men to draw their cloaks over
 * their faces and not to drink the water of the well of Thamud and
 * not to enter the dwellings — «إِلَّا أَنْ تَكُونُوا بَاكِينَ»
 * (Bukhari 433; Muslim 2980). At one stage the army's water ran out;
 * the Prophet ﷺ prayed and a cloud rained over them — a small
 * Tabuki echo of the great miracles of the early years.
 *
 * They reached Tabuk and camped at Ayn Sukkrah. The Prophet ﷺ
 * bound a hand-cloth around the trickling spring; it broke open
 * into a flow that watered the entire army (al-Waqidi; Muslim 706).
 * He stayed twenty nights at Tabuk. The phantom Roman army never
 * appeared — Heraclius had no field force massed at al-Balqa, and
 * tradition is unanimous that no major engagement occurred.
 *
 * What occurred instead were the diplomatic strikes that consummated
 * the expedition. From Tabuk the Prophet ﷺ dispatched Khalid ibn
 * al-Walid east with a flying column of 420 horsemen to Dumat
 * al-Jandal, where Khalid surprised the Christian-Arab king Ukaydir
 * ibn 'Abd al-Malik al-Kindi outside his fortress on a wild-cow
 * hunt, captured him alive, and brought him back; the Prophet ﷺ
 * spared his life and accepted a treaty of jizyah (Ibn Hisham; Ibn
 * Sa'd; al-Tabari). Yuhanna ibn Ru'ba, the Christian patriarch of
 * Aylah on the Gulf of Aqaba, came in person bearing the first
 * recorded jizyah-treaty in Islamic history (Ibn Hisham; al-Bidayah
 * wa-al-Nihayah). The towns of Jarba and Adhruh sent comparable
 * delegations. The northern Hijaz had been brought under the writ
 * of Madinah without a battle.
 *
 * On the return leg the Prophet ﷺ sent Malik ibn al-Dukhshum and
 * Ma'an ibn 'Adi, both Ansar, to burn down Masjid al-Dirar at Dhu
 * Awan — the rival mosque the hypocrites had built in his absence
 * intending it as a base of mischief; al-Tawbah 9:107–110 was
 * revealed condemning it (Ibn Hisham; al-Tabari).
 *
 * Tabuk was the watershed of the Surah al-Tawbah revelations. The
 * famous case of the Three Who Stayed Behind — Ka'b ibn Malik,
 * Hilal ibn Umayyah, and Murarah ibn al-Rabi' — was concluded at
 * Tabuk's return, fifty days of social shunning followed by the
 * descent of «وَعَلَى الثَّلَاثَةِ الَّذِينَ خُلِّفُوا حَتَّى إِذَا ضَاقَتْ
 * عَلَيْهِمُ الْأَرْضُ بِمَا رَحُبَتْ» (al-Tawbah 9:118; Bukhari 4418).
 * Ka'b's narration is the longest single hadith of repentance in
 * the Sahih, and Mount Sala' near Madinah is where his shout of
 * forgiveness was answered.
 *
 * No fighting. No casualties on either side. The largest army the
 * Prophet ﷺ ever led, raised in the harshest summer he ever saw,
 * marched seven hundred kilometres into the desert to confront a
 * Roman concentration that did not exist — and returned having
 * extended Madinah's authority to the very threshold of Sham
 * without unsheathing a single blade in pitched battle. The
 * expedition reads as a moral and political conquest more than a
 * military one: a demonstration that the new polity could field
 * thirty thousand men in any season, against any rumour of a
 * gathering enemy, on the Prophet's word alone.
 *
 * Sources cross-referenced for this scenario: Bukhari 4416–4418
 * (Hadith al-Manzilah, Ka'b ibn Malik); Muslim 706 (the spring
 * miracle), 2404 (al-Manzilah), 2980 (al-Hijr); Tirmidhi 3701
 * ('Uthman); Ibn Hisham, al-Sirah al-Nabawiyyah (the march, the
 * Aylah treaty, the burning of Masjid al-Dirar); al-Waqidi, Kitab
 * al-Maghazi (numbers, route, the Khalid raid); al-Tabari, Tarikh
 * (chronology); Ibn Sa'd, al-Tabaqat al-Kubra (Khalid and Ukaydir);
 * Ibn Kathir, al-Bidayah wa-al-Nihayah V/13–22 (synthesis);
 * Surah al-Tawbah, especially 9:38–129 — the densest cluster of
 * Qur'anic verses bound to a single expedition in the Sirah.
 */
export const expeditionOfTabuk: BattleScenario = {
  id: 'battle-of-tabuk',
  name: 'Expedition of Tabuk',
  nameAr: 'غزوة تبوك',
  date: 'Rajab 9 AH (~October 630 CE)',
  location: 'The 700 km caravan corridor from Madinah north to Tabuk oasis (Ayn Sukkrah), with auxiliary operations at Aylah on the Gulf of Aqaba and Dumat al-Jandal in the eastern desert.',
  description:
    "Rajab 9 AH / October 630 CE — the last expedition the Prophet ﷺ ever led, and the only one whose destination he announced openly beforehand (Bukhari 4418). Roused by reports that Heraclius was massing a field army at al-Balqa, the Prophet ﷺ called every Muslim to march at the height of a brutal summer, with the date harvest standing ripe on the trees and water scarce on the route. 'Uthman ibn 'Affan equipped fully a third of the army; Abu Bakr brought the whole of his wealth. Thirty thousand men with ten thousand horse — the largest force the Prophet ﷺ ever fielded — set out on the 700 km road north to the oasis of Tabuk. The hypocrites under Ibn Ubayy peeled away at Dhu Jadd; the Three Who Stayed Behind (Ka'b ibn Malik and his two companions) became the subject of one of the longest hadiths of repentance in the Sahih. The army passed al-Hijr — the cursed dwellings of Thamud — under cloak, drank from a miraculous trickle at Ayn Sukkrah, and waited twenty nights at Tabuk. The Roman army never appeared. Khalid ibn al-Walid was detached east with a flying column to Dumat al-Jandal where he captured King Ukaydir alive; Yuhanna ibn Ru'ba of Aylah came south bearing the first jizyah-treaty in Islamic history; Jarba and Adhruh sued for terms. On the return Masjid al-Dirar was burned at Dhu Awan and Surah al-Tawbah revealed in its great Tabuki cluster. No pitched battle was fought, no casualties on either side — yet the writ of Madinah now reached the very threshold of Sham.",
  descriptionAr:
    'فِي رَجَبَ مِنَ السَّنَةِ التَّاسِعَةِ لِلْهِجْرَةِ — تِشْرِينَ الأَوَّلِ ٦٣٠م — كَانَتْ آخِرَ غَزْوَةٍ قَادَهَا رَسُولُ اللَّهِ ﷺ، وَالوَحِيدَةَ الَّتِي صَرَّحَ فِيهَا بِالوَجْهَةِ قَبْلَ الخُرُوجِ (البُخَارِيُّ ٤٤١٨). بَلَغَ النَّبِيَّ ﷺ أَنَّ هِرَقْلَ يَجْمَعُ بِالبَلْقَاءِ جَمْعًا عَظِيمًا لِغَزْوِ المَدِينَةِ، فَنَدَبَ النَّاسَ فِي حَرٍّ شَدِيدٍ، وَالثِّمَارُ قَدْ طَابَتْ، وَالظِّلَالُ مَطْلُوبَةٌ، وَالمَاءُ قَلِيلٌ. جَهَّزَ عُثْمَانُ بنُ عَفَّانَ ثُلُثَ الجَيْشِ، وَأَتَى أَبُو بَكْرٍ بِمَالِهِ كُلِّهِ. ثَلَاثُونَ أَلْفًا فِيهِمْ عَشَرَةُ آلَافِ فَرَسٍ — أَكْبَرُ جَيْشٍ خَرَجَ بِهِ النَّبِيُّ ﷺ قَطُّ — قَطَعُوا سَبْعَمِائَةَ كِيلُومِتْرٍ شَمَالًا إِلَى وَاحَةِ تَبُوكَ. تَخَلَّفَ المُنَافِقُونَ عِنْدَ ذِي جَدٍّ مَعَ ابْنِ أُبَيٍّ، وَتَخَلَّفَ الثَّلَاثَةُ الَّذِينَ خُلِّفُوا — كَعْبُ بنُ مَالِكٍ وَصَاحِبَاهُ — فِي أَطْوَلِ حَدِيثِ تَوْبَةٍ فِي الصَّحِيحِ. مَرَّ الجَيْشُ بِالحِجْرِ — مَدَائِنِ ثَمُودَ — مُتَقَنِّعِينَ، وَنَزَلُوا بِعَيْنِ السُّكَّرِ بِتَبُوكَ فَفَاضَتْ بِبَرَكَتِهِ ﷺ، وَأَقَامُوا عِشْرِينَ لَيْلَةً. لَمْ يَأْتِ الرُّومُ. بَعَثَ النَّبِيُّ ﷺ خَالِدَ بنَ الوَلِيدِ بِسَرِيَّةٍ إِلَى دُومَةِ الجَنْدَلِ فَأَسَرَ مَلِكَهَا أُكَيْدِرًا، وَجَاءَ يُوحَنَّا بنُ رُؤْبَةَ صَاحِبُ أَيْلَةَ بِأَوَّلِ مُعَاهَدَةِ جِزْيَةٍ فِي الإِسْلَامِ، وَصَالَحَ أَهْلُ جَرْبَاءَ وَأَذْرُحَ. وَفِي طَرِيقِ العَوْدَةِ هُدِمَ مَسْجِدُ الضِّرَارِ بِذِي أَوَانَ وَنَزَلَتْ سُورَةُ التَّوْبَةِ بِعُنْقُودِهَا التَّبُوكِيِّ. لَمْ يَكُنْ قِتَالٌ، وَلَا قَتِيلٌ مِنَ الفَرِيقَيْنِ — وَمَعَ ذَلِكَ بَلَغَ سُلْطَانُ المَدِينَةِ تُخُومَ الشَّامِ.',
  dayPhase: 'day',
  weather: 'clear',
  actualDayCount: 50,
  map: {
    width: 1600,
    height: 1100,
    terrain: [
      // The vast desert plain — base layer of the long corridor
      {
        id: 'arabian-corridor',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x6b552f,
      },
      // Western Hijaz mountain spine flanking the caravan route
      {
        id: 'hijaz-spine-west',
        type: 'mountain',
        polygon: [
          { x: 0, y: 200 },
          { x: 220, y: 200 },
          { x: 260, y: 700 },
          { x: 220, y: 950 },
          { x: 0, y: 950 },
        ],
        color: 0x33241a,
        label: 'سَلْسِلَةُ الْحِجَازِ',
      },
      // Eastern Hisma / Midian highlands flanking the corridor
      {
        id: 'hisma-spine-east',
        type: 'mountain',
        polygon: [
          { x: 1380, y: 200 },
          { x: 1600, y: 200 },
          { x: 1600, y: 950 },
          { x: 1340, y: 950 },
          { x: 1380, y: 700 },
        ],
        color: 0x33241a,
        label: 'مُرْتَفَعَاتُ حِسْمَى',
      },
      // Madinah oasis — the green starting anchor at the south
      {
        id: 'madinah-oasis',
        type: 'oasis',
        polygon: [
          { x: 700, y: 940 },
          { x: 920, y: 940 },
          { x: 920, y: 1060 },
          { x: 700, y: 1060 },
        ],
        color: 0x3e5230,
        label: 'الْمَدِينَةُ الْمُنَوَّرَةُ',
      },
      // Mount Uhud — anchor north-east of Madinah
      {
        id: 'mount-uhud',
        type: 'mountain',
        polygon: [
          { x: 920, y: 920 },
          { x: 1010, y: 920 },
          { x: 1010, y: 990 },
          { x: 920, y: 990 },
        ],
        color: 0x2c1f14,
        label: 'جَبَلُ أُحُدٍ',
      },
      // Thaniyyat al-Wada — the pass of farewell, just north of Madinah
      {
        id: 'thaniyyat-al-wada',
        type: 'gorge',
        polygon: [
          { x: 760, y: 870 },
          { x: 860, y: 870 },
          { x: 860, y: 940 },
          { x: 760, y: 940 },
        ],
        color: 0x4a3826,
        label: 'ثَنِيَّةُ الْوَدَاعِ',
      },
      // Mount Sala — west of Madinah, where the cry of Kab's repentance was made
      {
        id: 'mount-sala',
        type: 'elevated',
        polygon: [
          { x: 620, y: 950 },
          { x: 700, y: 950 },
          { x: 700, y: 1020 },
          { x: 620, y: 1020 },
        ],
        color: 0x5a4836,
        label: 'جَبَلُ سَلْعٍ',
      },
      // Wadi al-Qura — northern oasis halt midway up the route
      {
        id: 'wadi-al-qura',
        type: 'oasis',
        polygon: [
          { x: 740, y: 580 },
          { x: 860, y: 580 },
          { x: 860, y: 660 },
          { x: 740, y: 660 },
        ],
        color: 0x3e5230,
        label: 'وَادِي الْقُرَى',
      },
      // Al-Hijr / Madain Salih — the cursed sandstone outcrops of Thamud
      {
        id: 'al-hijr-rocky',
        type: 'rocky',
        polygon: [
          { x: 700, y: 380 },
          { x: 900, y: 380 },
          { x: 900, y: 500 },
          { x: 700, y: 500 },
        ],
        color: 0x4a3826,
        label: 'الْحِجْرُ — مَدَائِنُ صَالِحٍ',
      },
      // Tabuk oasis — destination, with date palms and Ayn Sukkrah
      {
        id: 'tabuk-oasis',
        type: 'oasis',
        polygon: [
          { x: 720, y: 200 },
          { x: 880, y: 200 },
          { x: 880, y: 300 },
          { x: 720, y: 300 },
        ],
        color: 0x3e5230,
        label: 'وَاحَةُ تَبُوكَ',
      },
      // Aylah — Christian port on the Gulf of Aqaba (far north-west)
      {
        id: 'aylah-port',
        type: 'oasis',
        polygon: [
          { x: 280, y: 100 },
          { x: 380, y: 100 },
          { x: 380, y: 180 },
          { x: 280, y: 180 },
        ],
        color: 0x2e4838,
        label: 'أَيْلَةُ',
      },
      // Jarba and Adhruh — frontier towns north-east of Tabuk
      {
        id: 'jarba-adhruh',
        type: 'flat',
        polygon: [
          { x: 920, y: 100 },
          { x: 1080, y: 100 },
          { x: 1080, y: 180 },
          { x: 920, y: 180 },
        ],
        color: 0x6a5036,
        label: 'جَرْبَاءُ وَأَذْرُحُ',
      },
      // Dumat al-Jandal — eastern fortress-oasis, target of Khalid's flying column
      {
        id: 'dumat-al-jandal',
        type: 'rocky',
        polygon: [
          { x: 1180, y: 220 },
          { x: 1320, y: 220 },
          { x: 1320, y: 320 },
          { x: 1180, y: 320 },
        ],
        color: 0x55402a,
        label: 'دُومَةُ الْجَنْدَلِ',
      },
      // Al-Balqa — phantom Byzantine concentration zone, far north
      {
        id: 'al-balqa-phantom',
        type: 'flat',
        polygon: [
          { x: 600, y: 20 },
          { x: 1000, y: 20 },
          { x: 1000, y: 100 },
          { x: 600, y: 100 },
        ],
        color: 0x4a4858,
        label: 'الْبَلْقَاءُ — جَمْعُ الرُّومِ الْمَزْعُومُ',
      },
      // Dhu Awan — return-leg site of Masjid al-Dirar
      {
        id: 'dhu-awan',
        type: 'flat',
        polygon: [
          { x: 700, y: 800 },
          { x: 760, y: 800 },
          { x: 760, y: 850 },
          { x: 700, y: 850 },
        ],
        color: 0x55402a,
        label: 'ذُو أَوَانَ',
      },
      // Al-Jurf — outskirts of Madinah, site of Hadith al-Manzilah
      {
        id: 'al-jurf',
        type: 'flat',
        polygon: [
          { x: 770, y: 820 },
          { x: 840, y: 820 },
          { x: 840, y: 870 },
          { x: 770, y: 870 },
        ],
        color: 0x6a5036,
        label: 'الْجُرْفُ',
      },
    ],
    landmarks: [
      {
        id: 'madinah',
        position: { x: 810, y: 1000 },
        type: 'oasis',
        label: 'Madinah al-Munawwarah',
        labelAr: 'الْمَدِينَةُ الْمُنَوَّرَةُ',
      },
      {
        id: 'thaniyyat-al-wada',
        position: { x: 810, y: 905 },
        type: 'mountain_pass',
        label: 'Thaniyyat al-Wada — The Pass of Farewell',
        labelAr: 'ثَنِيَّةُ الْوَدَاعِ',
      },
      {
        id: 'mount-uhud',
        position: { x: 965, y: 955 },
        type: 'mountain_pass',
        label: 'Mount Uhud',
        labelAr: 'جَبَلُ أُحُدٍ',
      },
      {
        id: 'mount-sala',
        position: { x: 660, y: 985 },
        type: 'hill',
        label: "Mount Sala — Cry of Kab's Repentance",
        labelAr: 'جَبَلُ سَلْعٍ',
      },
      {
        id: 'al-jurf',
        position: { x: 805, y: 845 },
        type: 'marker',
        label: 'al-Jurf — Hadith al-Manzilah',
        labelAr: 'الْجُرْفُ',
      },
      {
        id: 'wadi-al-qura',
        position: { x: 800, y: 620 },
        type: 'oasis',
        label: 'Wadi al-Qura — Northern Oasis Halt',
        labelAr: 'وَادِي الْقُرَى',
      },
      {
        id: 'al-hijr',
        position: { x: 800, y: 440 },
        type: 'marker',
        label: 'al-Hijr — Madain Salih, Dwellings of Thamud',
        labelAr: 'الْحِجْرُ — مَدَائِنُ صَالِحٍ',
      },
      {
        id: 'tabuk-oasis',
        position: { x: 800, y: 250 },
        type: 'oasis',
        label: 'Tabuk Oasis — Ayn Sukkrah',
        labelAr: 'تَبُوكُ — عَيْنُ السُّكَّرِ',
      },
      {
        id: 'aylah',
        position: { x: 330, y: 140 },
        type: 'marker',
        label: 'Aylah — First Jizyah Treaty',
        labelAr: 'أَيْلَةُ',
      },
      {
        id: 'jarba',
        position: { x: 950, y: 140 },
        type: 'marker',
        label: 'Jarba — Treaty Signatory',
        labelAr: 'جَرْبَاءُ',
      },
      {
        id: 'adhruh',
        position: { x: 1050, y: 140 },
        type: 'marker',
        label: 'Adhruh — Treaty Signatory',
        labelAr: 'أَذْرُحُ',
      },
      {
        id: 'dumat-al-jandal',
        position: { x: 1250, y: 270 },
        type: 'marker',
        label: 'Dumat al-Jandal — Khalid Captured Ukaydir',
        labelAr: 'دُومَةُ الْجَنْدَلِ',
      },
      {
        id: 'al-balqa',
        position: { x: 800, y: 60 },
        type: 'marker',
        label: 'al-Balqa — The Phantom Roman Concentration',
        labelAr: 'الْبَلْقَاءُ',
      },
      {
        id: 'dhu-awan',
        position: { x: 730, y: 825 },
        type: 'marker',
        label: 'Dhu Awan — Site of Masjid al-Dirar',
        labelAr: 'ذُو أَوَانَ — مَسْجِدُ الضِّرَارِ',
      },
      {
        id: 'dhu-jadd',
        position: { x: 760, y: 870 },
        type: 'camp',
        label: "Dhu Jadd — Ibn Ubayy's Rival Camp",
        labelAr: 'ذُو جَدٍّ — مُعَسْكَرُ ابْنِ أُبَيٍّ',
      },
    ],
    backgroundColor: 0x1a1208,
  },
  forces: [
    // ─── Muslim Forces — jaysh al-'usrah, ~30,000 men with 10,000 horse ─────
    {
      faction: 'muslim',
      label: 'The Army of Hardship (jaysh al-usrah)',
      labelAr: 'جَيْشُ الْعُسْرَةِ',
      totalStrength: 30000,
      units: [
        {
          // The Prophet's command staff — Tabuk was uniquely announced openly
          id: 'muslim-prophet-command',
          name: "The Prophet's Command Staff",
          nameAr: 'كَتِيبَةُ رَسُولِ اللَّهِ ﷺ — قَلْبُ الْجَيْشِ',
          troopType: 'command',
          soldierCount: 800,
          commander: 'رَسُولُ اللَّهِ ﷺ',
          startPosition: { x: 810, y: 990 },
          startFormation: 'column',
          startFacing: -Math.PI / 2, // facing north toward Tabuk
          stats: { attack: 8, defense: 10, speed: 6, morale: 10 },
        },
        {
          // Abu Bakr's Muhajirun vanguard — he gave all his wealth
          id: 'muslim-vanguard-infantry',
          name: "Abu Bakr's Vanguard of Muhajirun",
          nameAr: 'كَتِيبَةُ الْمُهَاجِرِينَ — مُقَدِّمَةُ الْجَيْشِ',
          troopType: 'infantry',
          soldierCount: 7000,
          commander: 'أَبُو بَكْرٍ الصِّدِّيقُ',
          startPosition: { x: 810, y: 920 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 6, morale: 10 },
        },
        {
          // The Ansar foot column under Sa'd ibn Ubadah
          id: 'muslim-ansar-infantry',
          name: 'Ansar Infantry Column',
          nameAr: 'كَتِيبَةُ الْأَنْصَارِ — مَيْمَنَةُ السَّاقَةِ',
          troopType: 'infantry',
          soldierCount: 9000,
          commander: 'سَعْدُ بْنُ عُبَادَةَ',
          startPosition: { x: 760, y: 950 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 6, morale: 10 },
        },
        {
          // Allied tribal levies — Abu Dharr famously caught up alone on foot
          id: 'muslim-tribal-infantry',
          name: 'Tribal Levies of the Arabs',
          nameAr: 'كَتِيبَةُ الْقَبَائِلِ — مُجَنِّدَةُ الْعَرَبِ',
          troopType: 'infantry',
          soldierCount: 6200,
          commander: 'أَبُو ذَرٍّ الْغِفَارِيُّ',
          startPosition: { x: 860, y: 950 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 6, morale: 9 },
        },
        {
          // Bulk of the cavalry — the largest the Prophet ever fielded
          id: 'muslim-cavalry-main',
          name: 'Main Cavalry Wing',
          nameAr: 'كَتِيبَةُ خَيْلِ الْمُؤْمِنِينَ',
          troopType: 'cavalry',
          soldierCount: 6000,
          commander: 'الزُّبَيْرُ بْنُ الْعَوَّامِ',
          startPosition: { x: 720, y: 920 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 8, speed: 9, morale: 10 },
        },
        {
          // Second cavalry wing under al-Miqdad screening the column flanks
          id: 'muslim-cavalry-flank',
          name: 'Flank Cavalry Screen',
          nameAr: 'كَتِيبَةُ الْفُرْسَانِ — مَيْسَرَةُ الْخَيْلِ',
          troopType: 'cavalry',
          soldierCount: 3580,
          commander: 'الْمِقْدَادُ بْنُ عَمْرٍو',
          startPosition: { x: 900, y: 920 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 9, morale: 9 },
        },
        {
          // Khalid's flying column — detached east to Dumat al-Jandal
          id: 'muslim-khalid-flying-column',
          name: "Khalid's Flying Column to Dumat al-Jandal",
          nameAr: 'كَتِيبَةُ خَالِدٍ — سَرِيَّةُ دُومَةِ الْجَنْدَلِ',
          troopType: 'heavy_cavalry',
          soldierCount: 420,
          commander: 'خَالِدُ بْنُ الْوَلِيدِ',
          startPosition: { x: 880, y: 970 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 10, defense: 9, speed: 10, morale: 10 },
        },
        {
          // Archer screen for the rear of the marching column
          id: 'muslim-rear-archers',
          name: 'Rear Archer Screen',
          nameAr: 'كَتِيبَةُ الرُّمَاةِ — حُمَاةُ السَّاقَةِ',
          troopType: 'archers',
          soldierCount: 1500,
          commander: 'سَعْدُ بْنُ أَبِي وَقَّاصٍ',
          startPosition: { x: 810, y: 1020 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 6, morale: 9 },
        },
        {
          // Uthman's logistical camel corps — he equipped a third of the army
          id: 'muslim-camel-train',
          name: "Uthman's Camel Logistical Corps",
          nameAr: 'قَافِلَةُ جَيْشِ الْعُسْرَةِ',
          troopType: 'camel_riders',
          soldierCount: 4500,
          commander: 'عُثْمَانُ بْنُ عَفَّانَ',
          startPosition: { x: 770, y: 990 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 6, defense: 7, speed: 7, morale: 10 },
        },
        {
          // Garrison of Madinah under Ali — context of Hadith al-Manzilah
          id: 'muslim-medina-garrison',
          name: "Madinah Garrison under Ali",
          nameAr: 'حَامِيَةُ الْمَدِينَةِ — وِلَايَةُ عَلِيٍّ',
          troopType: 'reserves',
          soldierCount: 1000,
          commander: 'عَلِيُّ بْنُ أَبِي طَالِبٍ',
          startPosition: { x: 810, y: 1010 },
          startFormation: 'defensive_circle',
          startFacing: 0,
          stats: { attack: 9, defense: 9, speed: 7, morale: 10 },
        },
      ],
    },

    // ─── Byzantine / Frontier Forces (mostly symbolic — no battle was fought) ─
    {
      faction: 'byzantine',
      label: 'Roman and Frontier Powers',
      labelAr: 'الرُّومُ وَأَهْلُ الثَّغْرِ',
      totalStrength: 690,
      units: [
        {
          // The phantom Heraclian massing at al-Balqa that never materialised
          id: 'enemy-balqa-phantom',
          name: 'Phantom Roman Concentration at al-Balqa',
          nameAr: 'جَمْعُ الرُّومِ الْمَزْعُومُ بِالْبَلْقَاءِ',
          troopType: 'infantry',
          soldierCount: 0,
          commander: 'هِرَقْلُ — لَمْ يَحْضُرْ',
          startPosition: { x: 800, y: 60 },
          startFormation: 'scattered',
          startFacing: Math.PI / 2,
          stats: { attack: 1, defense: 1, speed: 1, morale: 1 },
        },
        {
          // Ukaydir's garrison at Dumat al-Jandal — captured by Khalid
          id: 'enemy-ukaydir-dumah',
          name: "Ukaydir's Garrison at Dumat al-Jandal",
          nameAr: 'حَامِيَةُ أُكَيْدِرٍ — حِصْنُ دُومَةَ',
          troopType: 'cavalry',
          soldierCount: 600,
          commander: 'أُكَيْدِرُ بْنُ عَبْدِ الْمَلِكِ الْكِنْدِيُّ',
          startPosition: { x: 1250, y: 270 },
          startFormation: 'defensive_circle',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 7, morale: 6 },
        },
        {
          // Yuhanna ibn Ru'ba of Aylah — bearer of the first jizyah treaty
          id: 'enemy-aylah-delegation',
          name: "Yuhanna ibn Ruba's Delegation from Aylah",
          nameAr: 'وَفْدُ يُوحَنَّا بْنِ رُؤْبَةَ — أَيْلَةُ',
          troopType: 'command',
          soldierCount: 50,
          commander: 'يُوحَنَّا بْنُ رُؤْبَةَ',
          startPosition: { x: 330, y: 140 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 2, defense: 4, speed: 6, morale: 8 },
        },
        {
          // Frontier delegations from Jarba and Adhruh
          id: 'enemy-jarba-adhruh',
          name: 'Delegations of Jarba and Adhruh',
          nameAr: 'وَفْدَا جَرْبَاءَ وَأَذْرُحَ',
          troopType: 'command',
          soldierCount: 40,
          commander: 'شُيُوخُ جَرْبَاءَ وَأَذْرُحَ',
          startPosition: { x: 1000, y: 140 },
          startFormation: 'column',
          startFacing: Math.PI,
          stats: { attack: 2, defense: 4, speed: 6, morale: 8 },
        },
      ],
    },
  ],
  phases: [
    // Phase 1 (0–6s): The casus belli — rumours of Heraclius massing at al-Balqa.
    {
      id: 'phase-01-balqa-rumour',
      name: 'The Rumour of Heraclius at al-Balqa',
      nameAr: 'بَلَاغُ تَجَمُّعِ الرُّومِ بِالْبَلْقَاءِ',
      startTime: 0,
      duration: 6,
      description:
        "Reports reach Madinah from Nabatean traders that Heraclius is massing a great Roman field army at al-Balqa intending to strike the Muslim polity (Ibn Hisham; al-Waqidi). The Prophet ﷺ — uniquely for Tabuk — announces the destination openly so the Muslims may prepare for the long march in the worst summer they have known (Bukhari 4418).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 60, zoom: 0.4, duration: 5 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'phantom-army-haze', position: { x: 800, y: 60 }, label: 'الْبَلْقَاءُ — جَمْعُ الرُّومِ الْمَزْعُومُ' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'open-declaration-banner', text: 'صَرَّحَ النَّبِيُّ ﷺ بِالوَجْهَةِ' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 2 (6–12s): The call to charity — 'Uthman, Abu Bakr, 'Umar, the Bakka'un.
    {
      id: 'phase-02-jaysh-usrah',
      name: "Equipping the Army of Hardship",
      nameAr: 'تَجْهِيزُ جَيْشِ الْعُسْرَةِ',
      startTime: 6,
      duration: 6,
      description:
        "The Prophet ﷺ calls for unprecedented charity. 'Uthman ibn 'Affan equips a third of the army — 950 camels, 50 horses, a thousand dinars — and the Prophet ﷺ says: «مَا ضَرَّ عُثْمَانَ مَا عَمِلَ بَعْدَ هَذِهِ» (Tirmidhi 3701). Abu Bakr brings all his wealth, 'Umar brings half. The Bakka'un — those who weep — come begging mounts and are turned back for lack (al-Tawbah 9:92).",
      actions: [
        { type: 'camera_move', params: { x: 810, y: 990, zoom: 0.85, duration: 4 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'uthman-camel-train', targetUnitId: 'muslim-camel-train', label: 'تَجْهِيزُ عُثْمَانَ — ٩٥٠ بَعِيرًا وَ٥٠ فَرَسًا' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'abu-bakr-all-wealth', targetUnitId: 'muslim-vanguard-infantry' }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'bakkaun-tears', position: { x: 770, y: 1000 }, label: 'الْبَكَّاؤُونَ' }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 3 (12–18s): Hadith al-Manzilah at al-Jurf; the hypocrites peel away at Dhu Jadd.
    {
      id: 'phase-03-jurf-manzilah',
      name: "Hadith al-Manzilah & the Hypocrites at Dhu Jadd",
      nameAr: 'حَدِيثُ المَنْزِلَةِ وَتَخَلُّفُ المُنَافِقِينَ',
      startTime: 12,
      duration: 6,
      description:
        "At al-Jurf the Prophet ﷺ leaves 'Ali ibn Abi Talib in command of Madinah and his household. The hypocrites whisper that he has been abandoned; 'Ali rides out, the Prophet ﷺ replies: «أَمَا تَرْضَى أَنْ تَكُونَ مِنِّي بِمَنْزِلَةِ هَارُونَ مِنْ مُوسَى، إِلَّا أَنَّهُ لَا نَبِيَّ بَعْدِي» (Bukhari 4416; Muslim 2404). Meanwhile 'Abdullah ibn Ubayy's rival camp at Dhu Jadd peels away — al-Tawbah 9:81 descends on them.",
      actions: [
        { type: 'camera_move', params: { x: 805, y: 845, zoom: 0.95, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'manzilah-hadith', position: { x: 805, y: 845 }, text: 'بِمَنْزِلَةِ هَارُونَ مِنْ مُوسَى' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'muslim-medina-garrison', params: { behavior: 'holding' }, delay: 2 },
        { type: 'camera_move', params: { x: 810, y: 905, zoom: 0.9, duration: 2 }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'hypocrites-peel-away', position: { x: 810, y: 905 }, label: 'مُعَسْكَرُ ابْنِ أُبَيٍّ بِذِي جَدٍّ' }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 4 (18–26s): The departure through Thaniyyat al-Wada.
    {
      id: 'phase-04-thaniyyat-wada',
      name: 'Departure through the Pass of Farewell',
      nameAr: 'الخُرُوجُ مِنْ ثَنِيَّةِ الوَدَاعِ',
      startTime: 18,
      duration: 8,
      description:
        "Thirty thousand men — the largest field force the Prophet ﷺ ever commanded — march out of Madinah northward through Thaniyyat al-Wada in column. Abu Khaythamah and Abu Dharr al-Ghifari each set out alone on foot after the army had gone (Ibn Hisham; al-Hakim). The Prophet ﷺ on Abu Dharr: «رَحِمَ اللَّهُ أَبَا ذَرٍّ، يَمْشِي وَحْدَهُ، وَيَمُوتُ وَحْدَهُ، وَيُبْعَثُ وَحْدَهُ».",
      actions: [
        { type: 'camera_move', params: { x: 810, y: 905, zoom: 0.65, duration: 4 }, delay: 0 },
        { type: 'change_formation', targetUnitId: 'muslim-prophet-command', params: { formation: 'column' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-vanguard-infantry', params: { formation: 'column' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-ansar-infantry', params: { formation: 'column' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-tribal-infantry', params: { formation: 'column' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-cavalry-main', params: { formation: 'column' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-cavalry-flank', params: { formation: 'column' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-camel-train', params: { formation: 'column' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-rear-archers', params: { formation: 'column' }, delay: 0.5 },
        // Move the column up through the pass toward the Wadi al-Qura halt
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-infantry', params: { position: { x: 810, y: 800 }, speed: 60 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-main', params: { position: { x: 760, y: 800 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-prophet-command', params: { position: { x: 810, y: 870 }, speed: 60 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-infantry', params: { position: { x: 770, y: 870 }, speed: 60 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-tribal-infantry', params: { position: { x: 850, y: 870 }, speed: 60 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-camel-train', params: { position: { x: 780, y: 920 }, speed: 50 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-rear-archers', params: { position: { x: 810, y: 950 }, speed: 60 }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'abu-dharr-alone-on-foot', position: { x: 870, y: 1000 } }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 5 (26–34s): Wadi al-Qura halt, the heat, and the cloud-rain miracle.
    {
      id: 'phase-05-wadi-al-qura',
      name: "Wadi al-Qura Halt & the Cloud's Rain",
      nameAr: 'النُّزُولُ بِوَادِي الْقُرَى وَسُقْيَا الْغَمَامَة',
      startTime: 26,
      duration: 8,
      description:
        "The army halts at Wadi al-Qura — a midway oasis on the route. The water runs short under the blazing heat; the Prophet ﷺ raises his hands in prayer and a cloud rains over the army (al-Waqidi; Muslim 706 — narrations of the Tabuk water-miracles). Each man drinks until he is full and the gourds are filled.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 620, zoom: 0.7, duration: 4 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-infantry', params: { position: { x: 800, y: 620 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-prophet-command', params: { position: { x: 800, y: 660 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-infantry', params: { position: { x: 760, y: 660 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-tribal-infantry', params: { position: { x: 840, y: 660 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-main', params: { position: { x: 720, y: 620 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-flank', params: { position: { x: 880, y: 620 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-camel-train', params: { position: { x: 780, y: 700 }, speed: 60 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-rear-archers', params: { position: { x: 810, y: 720 }, speed: 70 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'desert-heat-haze', position: { x: 800, y: 620 } }, delay: 2 },
        { type: 'play_effect', params: { effect: 'rain-cloud-miracle', position: { x: 800, y: 600 }, label: 'سُقْيَا الْغَمَامَة' }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 6 (34–40s): Passing al-Hijr — the cursed dwellings of Thamud.
    {
      id: 'phase-06-al-hijr',
      name: "Passing al-Hijr — Madain Salih",
      nameAr: 'المُرُورُ بِالْحِجْرِ — مَدَائِنِ ثَمُود',
      startTime: 34,
      duration: 6,
      description:
        "The army passes al-Hijr — the cursed sandstone outcrops of the people of Salih (Madain Salih today). The Prophet ﷺ commands the men to draw their cloaks over their faces, not to drink the water of Thamud's well, and not to enter the dwellings «إِلَّا أَنْ تَكُونُوا بَاكِينَ» (Bukhari 433; Muslim 2980). The army hurries through.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 440, zoom: 0.85, duration: 3 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-infantry', params: { position: { x: 800, y: 440 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-prophet-command', params: { position: { x: 800, y: 470 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-infantry', params: { position: { x: 770, y: 470 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-tribal-infantry', params: { position: { x: 830, y: 470 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-main', params: { position: { x: 730, y: 440 }, speed: 110 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-flank', params: { position: { x: 870, y: 440 }, speed: 110 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-camel-train', params: { position: { x: 800, y: 510 }, speed: 80 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-rear-archers', params: { position: { x: 810, y: 530 }, speed: 90 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'cloaks-drawn-over-faces', position: { x: 800, y: 440 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'thamud-warning', position: { x: 800, y: 440 }, label: 'لَا تَدْخُلُوا إِلَّا بَاكِينَ' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 7 (40–48s): Arrival at Tabuk — Ayn Sukkrah miracle, twenty-night halt begins.
    {
      id: 'phase-07-tabuk-ayn-sukkrah',
      name: 'Arrival at Tabuk & the Spring of Sukkrah',
      nameAr: 'النُّزُولُ بِتَبُوكَ وَفَيْضُ عَيْنِ السُّكَّرِ',
      startTime: 40,
      duration: 8,
      description:
        "The army reaches the oasis of Tabuk and camps. The trickling spring of Sukkrah is barely a drip; the Prophet ﷺ binds a hand-cloth around it and prays — and it breaks open into a flow that waters the entire army (al-Waqidi; Muslim 706). Camp is pitched for a twenty-night halt.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 250, zoom: 0.85, duration: 4 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-infantry', params: { position: { x: 780, y: 250 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-prophet-command', params: { position: { x: 800, y: 250 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-infantry', params: { position: { x: 760, y: 280 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-tribal-infantry', params: { position: { x: 840, y: 280 }, speed: 70 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-main', params: { position: { x: 720, y: 250 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-flank', params: { position: { x: 880, y: 250 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-camel-train', params: { position: { x: 780, y: 320 }, speed: 60 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-rear-archers', params: { position: { x: 820, y: 320 }, speed: 70 }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-prophet-command', params: { formation: 'defensive_circle' }, delay: 4 },
        { type: 'play_effect', params: { effect: 'spring-miracle-flow', position: { x: 800, y: 250 }, label: 'عَيْنُ السُّكَّرِ' }, delay: 5 },
        { type: 'play_effect', params: { effect: 'twenty-night-camp', position: { x: 800, y: 250 } }, delay: 6.5 },
      ],
      triggers: [],
    },

    // Phase 8 (48–56s): Khalid's flying column eastward — the capture of Ukaydir at Dumah.
    {
      id: 'phase-08-khalid-ukaydir',
      name: "Khalid's Flying Column to Dumat al-Jandal",
      nameAr: 'سَرِيَّةُ خَالِدٍ إِلَى دُومَةِ الجَنْدَل',
      startTime: 48,
      duration: 8,
      description:
        "The Prophet ﷺ detaches Khalid ibn al-Walid east with 420 horsemen to Dumat al-Jandal (Ibn Hisham; Ibn Sa'd; al-Tabari). Khalid surprises the Christian-Arab king Ukaydir ibn 'Abd al-Malik al-Kindi outside his fortress on a wild-cow hunt, captures him alive, kills his brother Hassan, and brings him back to the Prophet ﷺ in his prized brocade — the first time the Companions saw such a garment, marvelling that what was in Paradise was finer.",
      actions: [
        { type: 'camera_move', params: { x: 1000, y: 290, zoom: 0.55, duration: 4 }, delay: 0 },
        { type: 'change_formation', targetUnitId: 'muslim-khalid-flying-column', params: { formation: 'wedge' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-khalid-flying-column', params: { behavior: 'advancing' }, delay: 0.5 },
        // Ride east toward Dumah
        { type: 'move_unit', targetUnitId: 'muslim-khalid-flying-column', params: { position: { x: 1100, y: 280 }, speed: 140 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-khalid-flying-column', params: { position: { x: 1230, y: 290 }, speed: 140 }, delay: 2.5 },
        // Ukaydir's outing on the wild-cow hunt
        { type: 'play_effect', params: { effect: 'wild-cow-hunt-ambush', position: { x: 1250, y: 270 }, label: 'صَيْدُ بَقَرَةِ الوَحْشِ' }, delay: 3.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-khalid-flying-column', params: { behavior: 'attacking' }, delay: 4 },
        { type: 'attack_unit', targetUnitId: 'muslim-khalid-flying-column', params: { targetId: 'enemy-ukaydir-dumah' }, delay: 4.5 },
        { type: 'set_behavior', targetUnitId: 'enemy-ukaydir-dumah', params: { behavior: 'routed' }, delay: 5.5 },
        { type: 'play_effect', params: { effect: 'ukaydir-captured-alive', position: { x: 1250, y: 270 }, label: 'أَسْرُ أُكَيْدِرٍ' }, delay: 6 },
        { type: 'play_effect', params: { effect: 'brocade-of-ukaydir', position: { x: 800, y: 250 }, text: 'مَنَادِيلُ سَعْدٍ فِي الجَنَّةِ خَيْرٌ مِنْ هَذَا' }, delay: 7 },
      ],
      triggers: [],
    },

    // Phase 9 (56–62s): The Aylah, Jarba, and Adhruh treaties — first jizyah in Islamic history.
    {
      id: 'phase-09-jizyah-treaties',
      name: 'The Jizyah Treaties of Aylah, Jarba, and Adhruh',
      nameAr: 'مُعَاهَدَاتُ الجِزْيَةِ — أَيْلَةُ وَجَرْبَاءُ وَأَذْرُحُ',
      startTime: 56,
      duration: 6,
      description:
        "Yuhanna ibn Ru'ba, the Christian patriarch of Aylah on the Gulf of Aqaba, comes south in person bearing the first recorded jizyah-treaty in Islamic history (Ibn Hisham; al-Bidayah wa-al-Nihayah). The frontier towns of Jarba and Adhruh send comparable delegations. The northern Hijaz is brought under the writ of Madinah without a battle.",
      actions: [
        { type: 'camera_move', params: { x: 700, y: 200, zoom: 0.45, duration: 3 }, delay: 0 },
        // Aylah delegation rides south to Tabuk
        { type: 'set_behavior', targetUnitId: 'enemy-aylah-delegation', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'enemy-aylah-delegation', params: { position: { x: 770, y: 250 }, speed: 80 }, delay: 1 },
        { type: 'play_effect', params: { effect: 'first-jizyah-treaty', position: { x: 800, y: 250 }, label: 'كِتَابُ يُوحَنَّا بنِ رُؤْبَةَ' }, delay: 3 },
        // Jarba and Adhruh ride west to Tabuk
        { type: 'set_behavior', targetUnitId: 'enemy-jarba-adhruh', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'enemy-jarba-adhruh', params: { position: { x: 830, y: 250 }, speed: 80 }, delay: 1 },
        { type: 'play_effect', params: { effect: 'frontier-treaty-seal', position: { x: 830, y: 250 }, label: 'صُلْحُ جَرْبَاءَ وَأَذْرُحَ' }, delay: 4 },
        // The phantom Roman army never appears
        { type: 'play_effect', params: { effect: 'phantom-no-show', position: { x: 800, y: 60 }, text: 'لَمْ يَأْتِ الرُّومُ' }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 10 (62–68s): The return — Masjid al-Dirar burned at Dhu Awan.
    {
      id: 'phase-10-masjid-dirar',
      name: 'The Return & the Burning of Masjid al-Dirar',
      nameAr: 'الرُّجُوعُ وَإِحْرَاقُ مَسْجِدِ الضِّرَار',
      startTime: 62,
      duration: 6,
      description:
        "The army turns south for Madinah. Approaching Dhu Awan, the Prophet ﷺ dispatches Malik ibn al-Dukhshum and Ma'an ibn 'Adi al-Ansari ahead to burn down Masjid al-Dirar — the rival mosque the hypocrites built in his absence intending it as a base of mischief; al-Tawbah 9:107–110 was revealed condemning it (Ibn Hisham; al-Tabari).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 600, zoom: 0.4, duration: 4 }, delay: 0 },
        // Bulk of the army withdraws south
        { type: 'set_behavior', targetUnitId: 'muslim-vanguard-infantry', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-infantry', params: { position: { x: 810, y: 920 }, speed: 100 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-prophet-command', params: { position: { x: 810, y: 990 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-infantry', params: { position: { x: 760, y: 950 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-tribal-infantry', params: { position: { x: 860, y: 950 }, speed: 90 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-main', params: { position: { x: 720, y: 920 }, speed: 110 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry-flank', params: { position: { x: 900, y: 920 }, speed: 110 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-camel-train', params: { position: { x: 770, y: 990 }, speed: 80 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-rear-archers', params: { position: { x: 810, y: 1020 }, speed: 90 }, delay: 0.5 },
        // Khalid's column rejoins the main body
        { type: 'move_unit', targetUnitId: 'muslim-khalid-flying-column', params: { position: { x: 880, y: 970 }, speed: 130 }, delay: 0.5 },
        // The two Ansar burn Masjid al-Dirar at Dhu Awan
        { type: 'camera_move', params: { x: 730, y: 825, zoom: 1.05, duration: 2 }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'masjid-dirar-burning', position: { x: 730, y: 825 }, label: 'مَسْجِدُ الضِّرَارِ يُحْرَقُ' }, delay: 4 },
        { type: 'play_effect', params: { effect: 'tawbah-verses-revealed', text: 'وَالَّذِينَ اتَّخَذُوا مَسْجِدًا ضِرَارًا' }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 11 (68–72s): Triumphal return; Mount Sala and the Three Who Stayed Behind.
    {
      id: 'phase-11-three-who-stayed',
      name: 'Return to Madinah & the Three Who Stayed Behind',
      nameAr: 'العَوْدَةُ إِلَى المَدِينَةِ وَتَوْبَةُ الثَّلَاثَة',
      startTime: 68,
      duration: 4,
      description:
        "The army re-enters Madinah through Thaniyyat al-Wada to a welcome of singing girls. After fifty days of social shunning, Ka'b ibn Malik, Hilal ibn Umayyah, and Murarah ibn al-Rabi' — the Three Who Stayed Behind — receive their forgiveness in the verse «وَعَلَى الثَّلَاثَةِ الَّذِينَ خُلِّفُوا» (al-Tawbah 9:118; Bukhari 4418). Ka'b's shout of joy is answered from Mount Sala'.",
      actions: [
        { type: 'camera_move', params: { x: 810, y: 1000, zoom: 0.95, duration: 3 }, delay: 0 },
        // Madinah garrison rejoins the main body in welcome
        { type: 'set_behavior', targetUnitId: 'muslim-medina-garrison', params: { behavior: 'idle' }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'thaniyyat-welcome-song', position: { x: 810, y: 905 }, text: 'طَلَعَ الْبَدْرُ عَلَيْنَا' }, delay: 1 },
        // Cry from Mount Sala
        { type: 'camera_move', params: { x: 660, y: 985, zoom: 1.1, duration: 1.5 }, delay: 2 },
        { type: 'play_effect', params: { effect: 'kab-shout-from-sala', position: { x: 660, y: 985 }, label: 'صَيْحَةُ كَعْبٍ مِنْ سَلْعٍ' }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'tawbah-three-revealed', text: 'وَعَلَى الثَّلَاثَةِ الَّذِينَ خُلِّفُوا حَتَّى إِذَا ضَاقَتْ عَلَيْهِمُ الْأَرْضُ بِمَا رَحُبَتْ' }, delay: 3 },
      ],
      triggers: [],
    },
  ],
  narration: [
    {
      id: 'narr-01-balqa-rumour',
      time: 0,
      duration: 6,
      text: "In Rajab of the ninth year of the Hijra, reports reached Madinah from Nabatean traders that Heraclius was massing a great Roman field army at al-Balqa to strike the new Muslim polity. Tabuk would be the only expedition the Prophet ﷺ ever announced openly beforehand — for the heat was severe, the harvest ripe, and the route long.",
      textAr:
        'فِي رَجَبَ مِنَ السَّنَةِ التَّاسِعَةِ لِلْهِجْرَةِ، بَلَغَتِ المَدِينَةَ أَخْبَارٌ مِنْ تُجَّارِ الأَنْبَاطِ بِأَنَّ هِرَقْلَ يَجْمَعُ بِالْبَلْقَاءِ جَمْعًا عَظِيمًا لِغَزْوِ الإِسْلَامِ. وَكَانَتْ تَبُوكُ الغَزْوَةَ الوَحِيدَةَ الَّتِي صَرَّحَ النَّبِيُّ ﷺ بِوَجْهَتِهَا قَبْلَ الخُرُوجِ، لِشِدَّةِ الحَرِّ وَطِيبِ الثِّمَارِ وَبُعْدِ المَسَافَة.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-02-jaysh-usrah',
      time: 6,
      duration: 6,
      text: "The Prophet ﷺ called for unprecedented charity. 'Uthman ibn 'Affan equipped fully a third of the army — nine hundred and fifty camels with their saddles, fifty horses, a thousand gold dinars poured into the Prophet's lap. The Prophet ﷺ said: 'Nothing 'Uthman does after this day shall harm him' (Tirmidhi 3701, hasan).",
      textAr:
        'دَعَا النَّبِيُّ ﷺ إِلَى الإِنْفَاقِ، فَجَهَّزَ عُثْمَانُ بنُ عَفَّانَ ثُلُثَ الجَيْشِ — تِسْعَ مِائَةِ بَعِيرٍ بِأَرْحُلِهَا وَخَمْسِينَ فَرَسًا وَأَلْفَ دِينَارٍ نَثَرَهَا فِي حِجْرِ رَسُولِ اللَّهِ ﷺ، فَقَالَ: «مَا ضَرَّ عُثْمَانَ مَا عَمِلَ بَعْدَ هَذِهِ» — رَوَاهُ التِّرْمِذِيُّ بِإِسْنَادٍ حَسَن.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-03-manzilah',
      time: 12,
      duration: 6,
      text: "At al-Jurf the Prophet ﷺ left 'Ali ibn Abi Talib in command of Madinah and his household. The hypocrites whispered that he had been abandoned. 'Ali rode out — and the Prophet ﷺ replied with the words now known as Hadith al-Manzilah: 'Are you not content to be to me as Harun was to Musa, save that there is no prophet after me?' (Bukhari 4416; Muslim 2404).",
      textAr:
        'وَخَلَّفَ النَّبِيُّ ﷺ بِالْجُرْفِ عَلِيَّ بْنَ أَبِي طَالِبٍ عَلَى المَدِينَةِ وَأَهْلِهِ، فَتَخَرَّصَ المُنَافِقُونَ بِأَنَّهُ تَخَلَّى عَنْهُ، فَلَحِقَ بِهِ عَلِيٌّ، فَقَالَ ﷺ كَلِمَتَهُ المَشْهُورَةَ بِحَدِيثِ المَنْزِلَةِ: «أَمَا تَرْضَى أَنْ تَكُونَ مِنِّي بِمَنْزِلَةِ هَارُونَ مِنْ مُوسَى، إِلَّا أَنَّهُ لَا نَبِيَّ بَعْدِي» — البُخَارِيُّ ٤٤١٦ وَمُسْلِمٌ ٢٤٠٤.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-04-thaniyyat-departure',
      time: 18,
      duration: 8,
      text: "Thirty thousand men — the largest force the Prophet ﷺ ever fielded, with ten thousand horse — marched out through Thaniyyat al-Wada. Abu Khaythamah set out alone after them; Abu Dharr al-Ghifari, his camel dead beneath him, carried his pack on his own back across the desert until he caught up. The Prophet ﷺ said of him: 'May Allah have mercy on Abu Dharr — he walks alone, dies alone, and shall be raised alone.'",
      textAr:
        'خَرَجَ ثَلَاثُونَ أَلْفًا — أَكْبَرُ جَيْشٍ خَرَجَ بِهِ النَّبِيُّ ﷺ قَطُّ — وَفِيهِمْ عَشَرَةُ آلَافِ فَرَسٍ، عَبْرَ ثَنِيَّةِ الوَدَاعِ. فَلَحِقَ بِهِمْ أَبُو خَيْثَمَةَ وَحْدَهُ، وَلَحِقَ أَبُو ذَرٍّ الغِفَارِيُّ مَاشِيًا حَامِلًا مَتَاعَهُ بَعْدَ مَوْتِ بَعِيرِهِ، فَقَالَ ﷺ: «رَحِمَ اللَّهُ أَبَا ذَرٍّ، يَمْشِي وَحْدَهُ، وَيَمُوتُ وَحْدَهُ، وَيُبْعَثُ وَحْدَهُ».',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-05-wadi-al-qura',
      time: 26,
      duration: 8,
      text: "At Wadi al-Qura the army's water ran short under a blazing summer sun. The Prophet ﷺ raised his hands in prayer; a cloud rose, settled, and rained over the army. Each man drank his fill; every gourd was sealed full again — a small Tabuki echo of the great miracles of the early Madinan years (al-Waqidi).",
      textAr:
        'فَلَمَّا نَزَلُوا وَادِيَ القُرَى، عَطِشَ الجَيْشُ تَحْتَ شَمْسِ الصَّيْفِ، فَرَفَعَ النَّبِيُّ ﷺ يَدَيْهِ، فَأَقْبَلَتْ سَحَابَةٌ فَهَطَلَتْ عَلَى الجَيْشِ، فَشَرِبَ كُلُّ امْرِئٍ حَتَّى رَوِيَ وَمَلَأُوا أَسْقِيَتَهُمْ — صَدًى يَسِيرٌ مِنْ مُعْجِزَاتِ المَدِينَةِ الكَبِيرَةِ، رَوَاهُ الوَاقِدِيُّ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-06-al-hijr',
      time: 34,
      duration: 6,
      text: "The army passed al-Hijr — the cursed sandstone outcrops of the people of Salih. The Prophet ﷺ commanded the men to draw their cloaks over their faces, not to drink the water of Thamud's well, and not to enter their dwellings 'except in tears' (Bukhari 433; Muslim 2980). The army hurried through.",
      textAr:
        'وَمَرُّوا بِالحِجْرِ — مَنَازِلِ ثَمُودَ — فَأَمَرَهُمُ النَّبِيُّ ﷺ أَنْ يَتَقَنَّعُوا وَلَا يَشْرَبُوا مِنْ بِئْرِهِمْ وَلَا يَدْخُلُوا مَنَازِلَهُمْ «إِلَّا أَنْ تَكُونُوا بَاكِينَ» — البُخَارِيُّ ٤٣٣ وَمُسْلِمٌ ٢٩٨٠، فَأَسْرَعَ الجَيْشُ المُرُورَ.',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-07-tabuk-arrival',
      time: 40,
      duration: 8,
      text: "They reached Tabuk and camped at the trickling spring of Sukkrah. It was barely a drip. The Prophet ﷺ bound a hand-cloth around it and prayed — and it broke open into a flow that watered the entire army. He stayed twenty nights at Tabuk. The phantom Roman army never appeared.",
      textAr:
        'وَنَزَلُوا تَبُوكَ بِعَيْنِ السُّكَّرِ، وَكَانَتْ كَالشِّرَاكِ تَنْبُضُ، فَعَصَبَ النَّبِيُّ ﷺ عَلَيْهَا مِنْدِيلًا وَدَعَا، فَفَاضَتْ تَسْقِي الجَيْشَ كُلَّهُ. وَأَقَامَ بِتَبُوكَ عِشْرِينَ لَيْلَةً — فَلَمْ يَأْتِ الرُّومُ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-08-khalid-ukaydir',
      time: 48,
      duration: 8,
      text: "From Tabuk, the Prophet ﷺ sent Khalid ibn al-Walid east with four hundred and twenty horsemen to Dumat al-Jandal. Khalid surprised the Christian-Arab king Ukaydir on a wild-cow hunt outside his fortress, captured him alive, and brought him back in his prized brocade. The Companions marvelled. The Prophet ﷺ said: Sa'd's handkerchiefs in Paradise are finer than this.",
      textAr:
        'وَبَعَثَ النَّبِيُّ ﷺ مِنْ تَبُوكَ خَالِدَ بنَ الوَلِيدِ بِأَرْبَعِ مِائَةٍ وَعِشْرِينَ فَارِسًا إِلَى دُومَةِ الجَنْدَلِ، فَفَاجَأَ خَالِدٌ المَلِكَ النَّصْرَانِيَّ أُكَيْدِرَ بنَ عَبْدِ المَلِكِ خَارِجَ حِصْنِهِ يَطْلُبُ بَقَرَةَ وَحْشٍ، فَأَسَرَهُ، فَأَتَى بِهِ النَّبِيَّ ﷺ فِي قَبَائِهِ المَنْسُوجِ، فَتَعَجَّبَ الصَّحَابَةُ، فَقَالَ ﷺ: «لَمَنَادِيلُ سَعْدٍ فِي الجَنَّةِ خَيْرٌ مِنْ هَذَا».',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-09-aylah-treaty',
      time: 56,
      duration: 6,
      text: "Yuhanna ibn Ru'ba, the Christian patriarch of Aylah on the Gulf of Aqaba, came south in person and concluded the first jizyah-treaty in Islamic history. The frontier towns of Jarba and Adhruh sent comparable delegations. The northern Hijaz had been brought under the writ of Madinah without unsheathing a single blade.",
      textAr:
        'وَجَاءَ يُوحَنَّا بنُ رُؤْبَةَ صَاحِبُ أَيْلَةَ بِنَفْسِهِ مِنْ جَوْنِ العَقَبَةِ، فَعَقَدَ مَعَ النَّبِيِّ ﷺ أَوَّلَ مُعَاهَدَةِ جِزْيَةٍ فِي الإِسْلَامِ، وَجَاءَتْ وُفُودُ جَرْبَاءَ وَأَذْرُحَ بِمِثْلِهَا. فَدَانَتْ تُخُومُ الشَّامِ لِسُلْطَانِ المَدِينَةِ بِغَيْرِ سَيْفٍ يُسَلُّ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-10-masjid-dirar',
      time: 62,
      duration: 6,
      text: "On the return at Dhu Awan, the Prophet ﷺ sent Malik ibn al-Dukhshum and Ma'an ibn 'Adi al-Ansari ahead with torches to burn down Masjid al-Dirar — the rival mosque the hypocrites had built in his absence intending it as a base of mischief. The verses of al-Tawbah 9:107–110 were revealed condemning it.",
      textAr:
        'وَفِي العَوْدَةِ بَعَثَ النَّبِيُّ ﷺ عِنْدَ ذِي أَوَانَ مَالِكَ بنَ الدُّخْشُمِ وَمَعْنَ بنَ عَدِيٍّ الأَنْصَارِيَّ بِشُعْلَتَيْنِ، فَأَحْرَقَا مَسْجِدَ الضِّرَارِ — المَسْجِدَ الَّذِي بَنَاهُ المُنَافِقُونَ فِي غِيَابِهِ مَكِيدَةً، فَنَزَلَتْ آيَاتُ التَّوْبَةِ ١٠٧–١١٠ تَنْعَاهُ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-11-three-who-stayed',
      time: 68,
      duration: 4,
      text: "Madinah received them with singing girls at Thaniyyat al-Wada. Fifty days later — after the Three Who Stayed Behind, Ka'b ibn Malik and his two companions, had been shunned by every soul in the city — Allah's forgiveness descended in al-Tawbah 9:118: 'And on the three who were left behind, until the earth in all its breadth grew narrow upon them.' Ka'b's shout was heard from Mount Sala'.",
      textAr:
        'فَاسْتَقْبَلَتْهُمُ المَدِينَةُ بِالجَوَارِي يُغَنِّينَ عَلَى ثَنِيَّةِ الوَدَاعِ. وَبَعْدَ خَمْسِينَ لَيْلَةً — وَقَدْ هَجَرَ أَهْلُ المَدِينَةِ الثَّلَاثَةَ الَّذِينَ خُلِّفُوا — كَعْبَ بنَ مَالِكٍ وَصَاحِبَيْهِ — نَزَلَتْ تَوْبَتُهُمْ فِي قَوْلِهِ تَعَالَى: «وَعَلَى الثَّلَاثَةِ الَّذِينَ خُلِّفُوا حَتَّى إِذَا ضَاقَتْ عَلَيْهِمُ الْأَرْضُ بِمَا رَحُبَتْ» — التَّوْبَةُ ١١٨. فَصَاحَ كَعْبٌ مِنْ سَلْعٍ صَيْحَةً سَمِعَهَا أَهْلُ المَدِينَة.',
      style: 'dramatic',
      position: 'bottom',
    },
  ],
  cameraScript: [
    // Open on the phantom Roman gathering at al-Balqa
    { time: 0, position: { x: 800, y: 60 }, zoom: 0.4, duration: 6, easing: 'power2.out', type: 'overview' },
    // Slide south to Madinah for the equipping of the Army of Hardship
    { time: 6, position: { x: 810, y: 990 }, zoom: 0.85, duration: 6, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-camel-train' },
    // Tighten on al-Jurf for Hadith al-Manzilah, then on Dhu Jadd for the hypocrites
    { time: 12, position: { x: 805, y: 875 }, zoom: 0.95, duration: 6, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-medina-garrison' },
    // Pull back for the great northward march out of Thaniyyat al-Wada
    { time: 18, position: { x: 810, y: 870 }, zoom: 0.55, duration: 8, easing: 'power2.out', type: 'pan', followEntityId: 'muslim-prophet-command' },
    // Hold over Wadi al-Qura for the cloud-rain miracle
    { time: 26, position: { x: 800, y: 620 }, zoom: 0.7, duration: 8, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-prophet-command' },
    // Tighten through al-Hijr — the Thamud passage
    { time: 34, position: { x: 800, y: 460 }, zoom: 0.85, duration: 6, easing: 'power2.in', type: 'follow', followEntityId: 'muslim-prophet-command' },
    // Settle over Tabuk for the spring miracle and the twenty-night halt
    { time: 40, position: { x: 800, y: 270 }, zoom: 0.85, duration: 8, easing: 'power2.out', type: 'focus', followEntityId: 'muslim-prophet-command' },
    // Eastward sweep to Dumat al-Jandal for Khalid's flying column
    { time: 48, position: { x: 1050, y: 285 }, zoom: 0.55, duration: 8, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-khalid-flying-column' },
    // Wide shot bringing in Aylah, Jarba, and Adhruh — the diplomatic strikes
    { time: 56, position: { x: 700, y: 200 }, zoom: 0.45, duration: 6, easing: 'power2.inOut', type: 'overview' },
    // Long pan southward as the army returns; tighten on Dhu Awan for the burning
    { time: 62, position: { x: 800, y: 600 }, zoom: 0.42, duration: 6, easing: 'power2.out', type: 'pan' },
    // Final close on Madinah for the Three Who Stayed Behind and the cry from Sala
    { time: 68, position: { x: 740, y: 990 }, zoom: 1.0, duration: 4, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-prophet-command' },
  ],
  outcome: {
    verdict: 'unfought_expedition',
    muslimCasualties: 0,
    enemyCasualties: 0,
    summary:
      "The Expedition of Tabuk, Rajab–Ramadan 9 AH / October–November 630 CE: thirty thousand men with ten thousand horse — the largest force the Prophet ﷺ ever fielded — marched seven hundred kilometres north from Madinah at the height of a brutal summer to confront a reported Roman concentration at al-Balqa that never materialised. The Prophet ﷺ camped twenty nights at Tabuk; no battle was fought; no man fell on either side. From Tabuk he detached Khalid ibn al-Walid east to Dumat al-Jandal where Khalid captured the Christian-Arab king Ukaydir alive and brought him back. Yuhanna ibn Ru'ba of Aylah came south with the first jizyah-treaty in Islamic history; Jarba and Adhruh sued for terms. On the return Masjid al-Dirar was burned at Dhu Awan and the great Tabuki cluster of Surah al-Tawbah revealed. The case of the Three Who Stayed Behind closed fifty days later with their public forgiveness in al-Tawbah 9:118 — Ka'b ibn Malik's shout of joy heard across Madinah from Mount Sala'.",
    summaryAr:
      'غَزْوَةُ تَبُوكَ فِي رَجَبَ–رَمَضَانَ مِنَ السَّنَةِ التَّاسِعَةِ لِلْهِجْرَةِ (تِشْرِينَ الأَوَّلِ–تِشْرِينَ الثَّانِي ٦٣٠م): ثَلَاثُونَ أَلْفًا فِيهِمْ عَشَرَةُ آلَافِ فَرَسٍ — أَكْبَرُ جَيْشٍ خَرَجَ بِهِ النَّبِيُّ ﷺ — قَطَعُوا سَبْعَمِائَةَ كِيلُومِتْرٍ شَمَالًا فِي شِدَّةِ الحَرِّ لِمُوَاجَهَةِ جَمْعٍ رُومِيٍّ مَزْعُومٍ بِالْبَلْقَاءِ لَمْ يَأْتِ. أَقَامَ النَّبِيُّ ﷺ بِتَبُوكَ عِشْرِينَ لَيْلَةً، فَلَمْ يَقَعْ قِتَالٌ وَلَا قَتِيلٌ مِنَ الفَرِيقَيْنِ. وَأَرْسَلَ مِنْ تَبُوكَ خَالِدَ بنَ الوَلِيدِ إِلَى دُومَةِ الجَنْدَلِ، فَأَسَرَ مَلِكَهَا النَّصْرَانِيَّ أُكَيْدِرًا حَيًّا. وَجَاءَ يُوحَنَّا بنُ رُؤْبَةَ صَاحِبُ أَيْلَةَ بِأَوَّلِ كِتَابِ جِزْيَةٍ فِي الإِسْلَامِ، وَصَالَحَ أَهْلُ جَرْبَاءَ وَأَذْرُحَ. وَفِي طَرِيقِ العَوْدَةِ هُدِمَ مَسْجِدُ الضِّرَارِ بِذِي أَوَانَ، وَنَزَلَ عُنْقُودُ سُورَةِ التَّوْبَةِ التَّبُوكِيُّ. وَخُتِمَ أَمْرُ الثَّلَاثَةِ الَّذِينَ خُلِّفُوا بَعْدَ خَمْسِينَ لَيْلَةً بِنُزُولِ تَوْبَتِهِمْ فِي الآيَةِ ١١٨ مِنَ التَّوْبَةِ، وَصَيْحَةُ كَعْبِ بنِ مَالِكٍ مِنْ جَبَلِ سَلْعٍ سَمِعَهَا أَهْلُ المَدِينَة.',
    significance:
      "Tabuk closed the Prophet's military life with a paradox the Sirah pauses on: the largest mobilisation, the longest march, the most punishing season — and not one blow struck. The Roman aura was broken without battle; the writ of Madinah extended to the very threshold of Sham; the first jizyah-treaty was signed at Aylah; the Christian-Arab principalities of Dumat al-Jandal, Jarba, and Adhruh entered the Muslim political order. Internally, Tabuk surfaced and judged the hypocrites once and for all: the rival camp at Dhu Jadd, Masjid al-Dirar burned at Dhu Awan, the Three Who Stayed Behind shunned and then publicly forgiven. Hadith al-Manzilah at al-Jurf set the place of 'Ali in the Prophetic household. The vast Tabuki cluster of Surah al-Tawbah — verses 38, 41, 81, 92, 107–110, 117–118, 128–129 — formed the densest body of revelation tied to a single expedition in the Sirah. The expedition's title — جَيْشُ الْعُسْرَةِ, the Army of Hardship — entered the Qur'an itself, and 'Uthman's third-of-the-army equipping (hadith al-Tirmidhi: 'Nothing 'Uthman does after this day shall harm him') passed into the canonical fada'il of the Companions. By the time of the Prophet's death three months after his return, the entire Arabian Peninsula north of Yemen lay under his treaty — with no battle on the Tabuk road to mark the fact.",
    significanceAr:
      'خَتَمَتْ تَبُوكُ سِيرَةَ النَّبِيِّ ﷺ العَسْكَرِيَّةَ بِمُفَارَقَةٍ يَقِفُ عِنْدَهَا أَهْلُ السِّيَرِ: أَكْبَرُ نَفِيرٍ، وَأَطْوَلُ مَسِيرٍ، وَأَشَدُّ مَوْسِمٍ — وَلَمْ تُسَلَّ فِيهَا سَيْفٌ فِي مُلْتَقَى جَيْشَيْنِ. كُسِرَتِ الهَيْبَةُ الرُّومِيَّةُ بِغَيْرِ مَعْرَكَةٍ، وَامْتَدَّ سُلْطَانُ المَدِينَةِ إِلَى تُخُومِ الشَّامِ، وَوُقِّعَتْ أَوَّلُ مُعَاهَدَةِ جِزْيَةٍ بِأَيْلَةَ، وَدَخَلَتْ إِمَارَاتُ النَّصَارَى العَرَبِ فِي دُومَةِ الجَنْدَلِ وَجَرْبَاءَ وَأَذْرُحَ فِي النِّظَامِ السِّيَاسِيِّ المُسْلِمِ. وَدَاخِلِيًّا فَضَحَتْ تَبُوكُ المُنَافِقِينَ مَرَّةً وَإِلَى الأَبَدِ: مُعَسْكَرُ ابْنِ أُبَيٍّ بِذِي جَدٍّ، وَإِحْرَاقُ مَسْجِدِ الضِّرَارِ بِذِي أَوَانَ، وَهَجْرُ الثَّلَاثَةِ الَّذِينَ خُلِّفُوا ثُمَّ تَوْبَتُهُمْ فِي القُرْآنِ. وَفِي الْجُرْفِ كَانَ حَدِيثُ المَنْزِلَةِ — مَنْزِلَةُ عَلِيٍّ مِنْ بَيْتِ النُّبُوَّةِ. وَنَزَلَ عُنْقُودُ سُورَةِ التَّوْبَةِ التَّبُوكِيُّ — الآيَاتُ ٣٨ وَ٤١ وَ٨١ وَ٩٢ وَ١٠٧–١١٠ وَ١١٧–١١٨ وَ١٢٨–١٢٩ — أَكْثَفَ تَنْزِيلٍ يَتَعَلَّقُ بِغَزْوَةٍ وَاحِدَةٍ فِي السِّيرَةِ. وَدَخَلَ اسْمُ «جَيْشِ الْعُسْرَةِ» القُرْآنَ نَفْسَهُ، وَدَخَلَ تَجْهِيزُ عُثْمَانَ ثُلُثَ الجَيْشِ — وَقَوْلُ النَّبِيِّ ﷺ «مَا ضَرَّ عُثْمَانَ مَا عَمِلَ بَعْدَ هَذِهِ» — فَضَائِلَ الصَّحَابَةِ. وَلَمَّا تُوُفِّيَ ﷺ بَعْدَ ثَلَاثَةِ أَشْهُرٍ مِنْ عَوْدَتِهِ، كَانَتْ جَزِيرَةُ العَرَبِ شَمَالَ اليَمَنِ كُلُّهَا تَحْتَ عَهْدِهِ — بِغَيْرِ مَعْرَكَةٍ عَلَى طَرِيقِ تَبُوكَ تَشْهَدُ بِذَلِكَ.',
  },
  totalDuration: 72,
};
