import type { BattleScenario } from '../types/scenario';

/**
 * غَزْوَةُ حُنَيْنٍ — اليَوْمُ الَّذِي سَمَّاهُ القُرْآنُ
 * Battle of Hunayn — The Day Named in the Qur'an
 *
 * 10 Shawwal 8 AH / ~31 January 630 CE — two weeks after Fath Makkah
 * and before the Siege of al-Ta'if. Wadi Hunayn, in the Sarawat
 * highlands ~16 miles east-southeast of Makkah on the road to al-Ta'if:
 * a wide arid wadi running west-to-east, narrowing into a defile at
 * the eastern third where flanking rocky ridges (shi'ab) close in on
 * both north and south. No fortifications, no palms, no river — bare
 * ochre dust and dark basalt outcrops in the cold pre-dawn of the
 * Hijazi winter.
 *
 * Hawazin and Thaqif had massed against the Prophet ﷺ as soon as
 * Fath Makkah was sealed. Their war-chief Malik ibn 'Awf an-Nasri
 * brought the women, children, and livestock to the rear of the line
 * — a psychological commitment device. The aged poet-warrior Durayd
 * ibn al-Simma, carried in a litter, reportedly past a hundred and
 * nearly sightless from age, heard the camels groan and the donkeys
 * bray, and rebuked Malik: «هَلْ يَرُدُّ المُنْهَزِمَ شَيْءٌ؟ إِنْ
 * كَانَتْ لَكَ لَمْ يَنْفَعْكَ إِلَّا رَجُلٌ بِسَيْفِهِ وَرُمْحِهِ»
 * (Ibn Hisham). Malik dismissed the counsel.
 *
 * The Prophet ﷺ marched from Makkah on 6 Shawwal with 12,000 — the
 * 10,000 of the Madinan veterans who had taken Makkah, and 2,000
 * fresh tulaqa' from Quraysh still in their four-month grace period.
 * He had borrowed 100 coats of mail from Safwan ibn Umayya — still a
 * polytheist within his post-Fath grace — as 'ariya madmuna, a
 * guaranteed loan (Sunan Abi Dawud 3562). On the route past a sidra
 * tree of the polytheists called Dhat Anwat, some recent converts
 * asked for a similar tree to be designated for them. He rebuked
 * them with the saying preserved by al-Tirmidhi 2180: «سُبْحَانَ
 * اللَّهِ! هَذَا كَمَا قَالَ قَوْمُ مُوسَى: ٱجْعَل لَّنَا إِلَٰهًا
 * كَمَا لَهُمْ ءَالِهَةٌ. وَالَّذِي نَفْسِي بِيَدِهِ، لَتَرْكَبُنَّ
 * سُنَّةَ مَنْ كَانَ قَبْلَكُمْ» — a tawhid error corrected before
 * the army made contact.
 *
 * Some among them then said as they neared the wadi: «لَنْ نُغْلَبَ
 * اليَوْمَ مِنْ قِلَّةٍ» — we will not be defeated today from
 * fewness. Tradition narrators differ on the speaker (Salama ibn
 * Salama, Abu Bakr, or unnamed); the Qur'an names the sentiment as
 * collective. Hunayn is the only battle named in the Qur'an by
 * name, and its rebuke is preserved in Q 9:25–26: ﴿لَقَدْ نَصَرَكُمُ
 * اللَّهُ فِي مَوَاطِنَ كَثِيرَةٍ ۙ وَيَوْمَ حُنَيْنٍ ۙ إِذْ
 * أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنكُمْ شَيْئًا
 * وَضَاقَتْ عَلَيْكُمُ الأَرْضُ بِمَا رَحُبَتْ ثُمَّ وَلَّيْتُم
 * مُّدْبِرِينَ﴾.
 *
 * Just before fajr on Wednesday 10 Shawwal, in the dim ghalas, the
 * Muslim vanguard — Banu Sulaym under Khalid ibn al-Walid — descended
 * into the western mouth of the wadi. The narrow defile and rough
 * road forced the column to file in single order. Sahih al-Bukhari
 * 2930 (al-Bara'): «اسْتَقْبَلَنَا رُمَاةُ هَوَازِنَ وَبَنِي
 * نَصْرٍ» — massed archery from the heights, then infantry charge
 * down the slopes from both flanks, Jusham cavalry striking the rear
 * in flank. The vanguard broke first, collapsing backward into the
 * column. The terrain itself became the trap — «وَضَاقَتْ
 * عَلَيْكُمُ الأَرْضُ بِمَا رَحُبَتْ». The collapse rippled, the
 * tulaqa' and rear elements turned back, and most of the 12,000
 * fled.
 *
 * Only the Prophet ﷺ and a small core held — Sahih al-Bukhari 4315:
 * «وَلَكِنْ رَسُولُ اللَّهِ ﷺ لَمْ يَفِرَّ». On his white mule
 * Duldul, with Abu Sufyan ibn al-Harith holding the bridle and
 * al-Abbas at the stirrup, he advanced toward the enemy reciting:
 * «أَنَا النَّبِيُّ لَا كَذِبْ، أَنَا ابْنُ عَبْدِ المُطَّلِبْ» —
 * the single most cited proof-text in classical fiqh al-sira for
 * the Prophet's personal courage.
 *
 * Then he ﷺ said to al-Abbas — رَجُلًا صَيِّتًا, a man of mighty
 * voice (Sahih Muslim 1775): «أَيْ عَبَّاسُ، نَادِ أَصْحَابَ
 * السَّمُرَةِ». Al-Abbas called in three nested escalations:
 * «يَا أَصْحَابَ السَّمُرَةِ» — invoking Bay'at al-Ridwan;
 * «يَا مَعْشَرَ الأَنْصَارِ»; then narrowing to «يَا بَنِي الحَارِثِ
 * بنِ الخَزْرَجِ». The Ansar returned crying لَبَّيْكَ، لَبَّيْكَ —
 * «وَكَأَنَّ عَطْفَتَهُمْ عَلَى رَسُولِ اللَّهِ ﷺ عَطْفَةُ البَقَرِ
 * عَلَى أَوْلَادِهَا». Then the Prophet ﷺ scooped a handful of dust
 * from the wadi floor and threw it toward the enemy lines saying
 * «شَاهَتِ الوُجُوهُ» — and «مَا خَلَقَ اللَّهُ مِنْهُمْ إِنْسَانًا
 * إِلَّا مَلَأَ عَيْنَيْهِ تُرَابًا» (Sahih Muslim 1777, Salama ibn
 * al-Akwa'). He proclaimed «انْهَزَمُوا وَرَبِّ مُحَمَّدٍ»; Q 9:26
 * followed: ﴿ثُمَّ أَنزَلَ اللَّهُ سَكِينَتَهُ عَلَىٰ رَسُولِهِ
 * وَعَلَى المُؤْمِنِينَ وَأَنزَلَ جُنُودًا لَّمْ تَرَوْهَا﴾.
 *
 * As the counter-attack rolled forward — the Muhajirun banner with
 * 'Ali, the Aws and Khazraj banners returning, al-Zubayr's cavalry,
 * the borrowed-armour kataeb under Abu Talha — he ﷺ described the
 * intensifying combat: «الآنَ حَمِيَ الوَطِيسُ» — now the furnace is
 * hot, an idiom no Arab had been heard to utter before him (Sahih
 * Muslim 1775). The salab ruling was established this day via Abu
 * Qatada's single combat (Sahih al-Bukhari 3142).
 *
 * The Hawazin coalition shattered. ~70 Hawazin fell. One body fled
 * east toward Awtas, where Abu 'Amir al-Ash'ari pursued, was killed
 * by an arrow, and command passed to his nephew Abu Musa al-Ash'ari
 * (Sahih al-Bukhari 4323). Another body fled southeast with Malik to
 * fortify in al-Ta'if, triggering the next siege. Durayd ibn al-Simma
 * was overtaken in his litter and killed by Rabi'a ibn Rufay'
 * al-Sulami (al-Tabari). Four Muslims were martyred — among them
 * Ayman ibn 'Ubayd, son of Umm Ayman. The rear camp — women,
 * children, livestock — fell intact: ~6,000 captives, ~22,000–24,000
 * camels, >40,000 sheep, 4,000 uqiyya silver, held at al-Ji'rana.
 *
 * After the brief siege of al-Ta'if the Prophet ﷺ returned. A
 * Hawazin delegation arrived as Muslims; he offered them (Sahih
 * al-Bukhari 4318–4319): «فَاخْتَارُوا إِحْدَى الطَّائِفَتَيْنِ:
 * إِمَّا السَّبْيَ، وَإِمَّا المَالَ». They chose captives. All
 * 6,000 were returned, including his foster-sister Shayma bint
 * al-Harith of Banu Sa'd ibn Bakr — Halima al-Sa'diyya's clan. Then
 * the mu'allafat qulubihim distribution: 100 camels each to Abu
 * Sufyan, Safwan ibn Umayya, 'Uyayna ibn Hisn, al-Aqra' ibn Habis
 * (Sahih Muslim 1060). Safwan said: «فَلَقَدْ أَعْطَانِي مَا
 * أَعْطَانِي وَإِنَّهُ لَأَبْغَضُ النَّاسِ إِلَيَّ، فَمَا زَالَ
 * يُعْطِينِي حَتَّى إِنَّهُ لَأَحَبُّ النَّاسِ إِلَيَّ» (Muslim
 * 2313). The Ansar murmured. The Prophet ﷺ gathered them in a
 * leather-walled qubba and delivered the famous khutba (Sahih
 * al-Bukhari 4337, Anas): «يَا مَعْشَرَ الأَنْصَارِ، أَلَا
 * تَرْضَوْنَ أَنْ يَذْهَبَ النَّاسُ بِالدُّنْيَا، وَتَذْهَبُونَ
 * بِرَسُولِ اللَّهِ ﷺ تَحُوزُونَهُ إِلَى بُيُوتِكُمْ؟» The men
 * wept until their beards were wet, and said: «رَضِينَا بِرَسُولِ
 * اللَّهِ قَسْمًا وَحَظًّا».
 *
 * With Hunayn ended the last organised resistance to Islam in the
 * Hijaz. The Year of Delegations (9 AH) followed, and the salab
 * ruling and the ta'lif al-qulub category of zakat (Q 9:60) entered
 * permanent fiqh.
 *
 * Sources: al-Bukhari, Sahih (Kitab al-Maghazi: 2930, 3142, 4315,
 *          4318–4319, 4323, 4337); Muslim, Sahih (1060, 1775, 1777,
 *          2313); Abu Dawud, Sunan (3562); al-Tirmidhi (2180);
 *          Ibn Hisham, as-Sirah an-Nabawiyyah (Ghazwat Hunayn);
 *          al-Waqidi, Kitab al-Maghazi; at-Tabari, Tarikh year 8 AH;
 *          Ibn Kathir, al-Bidayah wa'n-Nihayah vol. 4. Surat at-Tawbah
 *          25–26 was revealed in connection with this battle.
 */
export const battleOfHunayn: BattleScenario = {
  id: 'battle-of-hunayn',
  name: 'Battle of Hunayn',
  nameAr: 'غزوة حنين',
  date: '10 Shawwal 8 AH (~31 January 630 CE)',
  location: "Wadi Hunayn, Sarawat highlands between Makkah and al-Ta'if",
  description:
    "Hunayn — victory after a near-defeat, the only battle named in the Qur'an by name. Two weeks after Fath Makkah, the Hawazin and Thaqif coalition under Malik ibn 'Awf an-Nasri massed at Wadi Hunayn, ~16 miles east-southeast of Makkah, with women, children, and livestock at the rear as a psychological commitment device that the aged poet Durayd ibn al-Simma had warned against. The Prophet ﷺ marched with 12,000 — 10,000 from Madinah and 2,000 fresh tulaqa' from Quraysh. Some boasted: 'we will not be defeated today from fewness.' Q 9:25 was revealed in rebuke. In the pre-dawn ghalas of Wednesday 10 Shawwal 8 AH, Khalid's Banu Sulaym vanguard descended into the throat of the wadi and was met by archery from both ridges and a downhill charge of spearmen and cavalry. The vanguard collapsed; the column buckled; most of the army fled. The Prophet ﷺ on his white mule Duldul, with Abu Sufyan ibn al-Harith holding the bridle and al-Abbas at the stirrup, did not move — declaring 'I am the Prophet, no lie; I am the son of 'Abd al-Muttalib' (Bukhari 4315). At his command al-Abbas — a man of mighty voice — called out three nested rallies: 'O Companions of the Tree! O Ansar! O Banu al-Harith ibn al-Khazraj!' (Muslim 1775); the Ansar returned crying 'labbayk, labbayk' like cattle to their young. Then the Prophet ﷺ scooped a handful of dust from the wadi floor, threw it toward the enemy saying 'shahat al-wujuh' — and Allah filled every Hawazin's eyes with that single throw (Muslim 1777). 'They are routed, by the Lord of Muhammad.' Q 9:26 followed: sakina and unseen armies. As the counter-attack rolled forward he ﷺ declared 'al-aana hamiya al-watis' — now the furnace is hot. The Hawazin shattered. Durayd was overtaken in his litter and killed by Rabi'a ibn Rufay'. ~70 of Hawazin fell; 4 Muslims, including Ayman ibn 'Ubayd. The 6,000 captives were held at al-Ji'rana over ten nights; when the Hawazin came as Muslims, the Prophet ﷺ offered them captives or property — they chose captives, and all 6,000 were returned including his foster-sister Shayma bint al-Harith. The mu'allafat qulubihim distribution gave 100 camels each to recent Quraysh converts; the Ansar grieved, and the Prophet ﷺ delivered the famous khutba in the leather qubba: 'are you not pleased that the people go off with worldly things while you go off with the Messenger of Allah?' (Bukhari 4337). They wept until their beards were wet.",
  descriptionAr:
    'حُنَيْنٌ — نَصْرٌ بَعْدَ هَزِيمَةٍ كَادَتْ تَكُونُ، وَهِيَ المَعْرَكَةُ الوَحِيدَةُ المُسَمَّاةُ بِاسْمِهَا فِي القُرْآنِ. بَعْدَ أُسْبُوعَيْنِ مِنْ فَتْحِ مَكَّةَ، حَشَدَ مَالِكُ بنُ عَوْفٍ النَّصْرِيُّ هَوَازِنَ وَثَقِيفَ فِي وَادِي حُنَيْنٍ، وَسَاقَ مَعَهُ النِّسَاءَ وَالأَبْنَاءَ وَالأَنْعَامَ — وَأَنْكَرَ عَلَيْهِ الشَّيْخُ دُرَيْدُ بنُ الصِّمَّةِ. خَرَجَ النَّبِيُّ ﷺ فِي اثْنَيْ عَشَرَ أَلْفًا — عَشَرَةُ آلَافٍ مِنْ أَهْلِ المَدِينَةِ، وَأَلْفَانِ مِنَ الطُّلَقَاءِ. قَالَ بَعْضُهُمْ: «لَنْ نُغْلَبَ اليَوْمَ مِنْ قِلَّةٍ»، فَأَنْزَلَ اللَّهُ ﴿وَيَوْمَ حُنَيْنٍ ۙ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ﴾. وَلَمَّا انْحَدَرَتْ مُقَدِّمَةُ خَالِدٍ فِي غَلَسِ الفَجْرِ، انْفَجَرَ الكَمِينُ — سِهَامٌ مِنَ الشِّعَابِ، رِمَاحٌ مِنَ السَّفْحِ، وَوَلَّى أَكْثَرُ النَّاسِ مُدْبِرِينَ. وَثَبَتَ رَسُولُ اللَّهِ ﷺ عَلَى بَغْلَتِهِ البَيْضَاءِ، يَقُولُ: «أَنَا النَّبِيُّ لَا كَذِبْ، أَنَا ابْنُ عَبْدِ المُطَّلِبْ». فَنَادَى العَبَّاسُ — وَكَانَ صَيِّتًا — ثَلَاثَ نِدَاءَاتٍ: «يَا أَصْحَابَ السَّمُرَةِ! يَا مَعْشَرَ الأَنْصَارِ! يَا بَنِي الحَارِثِ بنِ الخَزْرَجِ!» فَأَقْبَلُوا كَعَطْفَةِ البَقَرِ. ثُمَّ أَخَذَ ﷺ كَفًّا مِنْ تُرَابٍ فَرَمَى بِهِ وُجُوهَ المُشْرِكِينَ وَقَالَ «شَاهَتِ الوُجُوهُ»، ثُمَّ قَالَ «انْهَزَمُوا وَرَبِّ مُحَمَّدٍ». وَلَمَّا اشْتَدَّ القِتَالُ قَالَ: «الآنَ حَمِيَ الوَطِيسُ». فَتَشَتَّتَتْ هَوَازِنُ بَيْنَ أَوْطَاسٍ وَالطَّائِفِ، وَقُتِلَ دُرَيْدُ فِي شِجَارِهِ. اسْتُشْهِدَ أَرْبَعَةٌ — مِنْهُمْ أَيْمَنُ بنُ عُبَيْدٍ — وَقُتِلَ مِنْ هَوَازِنَ نَحْوُ سَبْعِينَ. وَأُمْسِكَ السَّبْيُ — سِتَّةُ آلَافٍ — بِالجِعْرَانَةِ بِضْعَ عَشْرَةَ لَيْلَةً، حَتَّى قَدِمَ وَفْدُ هَوَازِنَ مُسْلِمِينَ، فَقَالَ: «فَاخْتَارُوا إِحْدَى الطَّائِفَتَيْنِ: إِمَّا السَّبْيَ، وَإِمَّا المَالَ»، فَاخْتَارُوا السَّبْيَ، فَرَدَّ السِّتَّةَ آلَافٍ، فِيهِمْ أُخْتُهُ مِنَ الرَّضَاعَةِ الشَّيْمَاءُ. ثُمَّ أَعْطَى المُؤَلَّفَةَ قُلُوبُهُمْ مِنْ قُرَيْشٍ مِئَةَ مِئَةٍ، فَوَجَدَ الأَنْصَارُ، فَجَمَعَهُمْ ﷺ فِي قُبَّةٍ وَقَالَ: «أَلَا تَرْضَوْنَ أَنْ يَذْهَبَ النَّاسُ بِالدُّنْيَا، وَتَذْهَبُونَ بِرَسُولِ اللَّهِ؟»، فَبَكَوْا حَتَّى أَخْضَلُوا لِحَاهُمْ.',

  // Pre-dawn ghalas — battle joined just before fajr per Ibn Hisham.
  dayPhase: 'dawn',
  weather: 'clear',
  // Single day of fighting; the al-Ji'rana hold was over ten nights but
  // the engagement itself was Wednesday 10 Shawwal.
  actualDayCount: 1,

  map: {
    width: 2400,
    height: 1600,
    terrain: [
      // Base wadi floor — bare ochre-dust rocky highland
      {
        id: 'wadi-floor',
        type: 'rocky',
        polygon: [
          { x: 0, y: 0 },
          { x: 2400, y: 0 },
          { x: 2400, y: 1600 },
          { x: 0, y: 1600 },
        ],
        color: 0x4a3826,
        label: 'وَادِي حُنَيْنٍ',
      },
      // Northern flanking ridge — Hawazin archers' position
      {
        id: 'north-ridge',
        type: 'mountain',
        polygon: [
          { x: 0, y: 0 },
          { x: 2400, y: 0 },
          { x: 2400, y: 600 },
          { x: 0, y: 600 },
        ],
        color: 0x251a10,
        label: 'الشِّعَابُ الشَّمَالِيَّةُ',
      },
      // Southern flanking ridge — Hawazin spearmen's position
      {
        id: 'south-ridge',
        type: 'mountain',
        polygon: [
          { x: 0, y: 1100 },
          { x: 2400, y: 1100 },
          { x: 2400, y: 1600 },
          { x: 0, y: 1600 },
        ],
        color: 0x251a10,
        label: 'الشِّعَابُ الجَنُوبِيَّةُ',
      },
      // Open wadi entry from the west (Makkah direction)
      {
        id: 'wadi-mouth-west',
        type: 'flat',
        polygon: [
          { x: 0, y: 600 },
          { x: 700, y: 600 },
          { x: 700, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x6b5430,
      },
      // The throat (defile) — narrows where the ridges close in
      {
        id: 'defile-throat',
        type: 'gorge',
        polygon: [
          { x: 1400, y: 700 },
          { x: 1750, y: 700 },
          { x: 1750, y: 1000 },
          { x: 1400, y: 1000 },
        ],
        color: 0x2d1f12,
        label: 'مَضِيقُ حُنَيْنٍ',
      },
      // Rear (eastern) staging area beyond the defile — Hawazin camp
      {
        id: 'hawazin-rear-camp',
        type: 'sand',
        polygon: [
          { x: 1900, y: 700 },
          { x: 2350, y: 700 },
          { x: 2350, y: 1050 },
          { x: 1900, y: 1050 },
        ],
        color: 0x6b552f,
        label: 'مُعَسْكَرُ الظَّعَائِنِ',
      },
      // North-side gully cuts (shi'ab) — concealed paths down for the spearmen
      {
        id: 'shiab-north-cuts',
        type: 'rocky',
        polygon: [
          { x: 1300, y: 600 },
          { x: 1900, y: 600 },
          { x: 1900, y: 720 },
          { x: 1300, y: 720 },
        ],
        color: 0x35251a,
      },
      // South-side gully cuts
      {
        id: 'shiab-south-cuts',
        type: 'rocky',
        polygon: [
          { x: 1300, y: 980 },
          { x: 1900, y: 980 },
          { x: 1900, y: 1100 },
          { x: 1300, y: 1100 },
        ],
        color: 0x35251a,
      },
      // Al-Ji'rana camp — appears in phase 12 (south-west, off the wadi)
      {
        id: 'jirana-camp',
        type: 'oasis',
        polygon: [
          { x: 200, y: 1180 },
          { x: 900, y: 1180 },
          { x: 900, y: 1500 },
          { x: 200, y: 1500 },
        ],
        color: 0x2d4a1d,
        label: 'مُعَسْكَرُ الجِعْرَانَةِ',
      },
    ],
    landmarks: [
      {
        id: 'wadi-mouth-west',
        position: { x: 200, y: 850 },
        type: 'mountain_pass',
        label: 'Western Mouth — From Makkah',
        labelAr: 'مَدْخَلُ الوَادِي الغَرْبِيُّ',
      },
      {
        id: 'defile-throat-marker',
        position: { x: 1500, y: 850 },
        type: 'marker',
        label: 'The Throat of Hunayn',
        labelAr: 'مَضِيقُ حُنَيْنٍ',
      },
      {
        id: 'prophet-stand-marker',
        position: { x: 1300, y: 850 },
        type: 'marker',
        label: "The Prophet's ﷺ Stand",
        labelAr: 'مَوْقِفُ النَّبِيِّ ﷺ',
      },
      {
        id: 'north-ridge-marker',
        position: { x: 1500, y: 540 },
        type: 'mountain_pass',
        label: 'Northern Hawazin Ridge',
        labelAr: 'الشِّعَابُ الشَّمَالِيَّةُ',
      },
      {
        id: 'south-ridge-marker',
        position: { x: 1500, y: 1160 },
        type: 'mountain_pass',
        label: 'Southern Hawazin Ridge',
        labelAr: 'الشِّعَابُ الجَنُوبِيَّةُ',
      },
      {
        id: 'hawazin-rear-camp-marker',
        position: { x: 2120, y: 870 },
        type: 'camp',
        label: "Hawazin Camp — Women, Children, Herds",
        labelAr: 'مُعَسْكَرُ هَوَازِنَ وَالظَّعَائِنُ',
      },
      {
        id: 'awtas-direction',
        position: { x: 2370, y: 850 },
        type: 'mountain_pass',
        label: 'Awtas Direction (East)',
        labelAr: 'اتِّجَاهُ أَوْطَاسٍ',
      },
      {
        id: 'taif-direction',
        position: { x: 2370, y: 1100 },
        type: 'mountain_pass',
        label: "al-Ta'if Direction (Southeast)",
        labelAr: 'اتِّجَاهُ الطَّائِفِ',
      },
      {
        id: 'jirana-camp-marker',
        position: { x: 550, y: 1340 },
        type: 'camp',
        label: "al-Ji'rana — Spoils Camp",
        labelAr: 'الجِعْرَانَةُ',
      },
    ],
    backgroundColor: 0x1a1208,
  },

  forces: [
    // ─── Muslim Forces (~12,000 — 10,000 from Madinah + 2,000 tulaqa') ───
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 12000,
      units: [
        {
          // Banu Sulaym vanguard — Khalid leads, first hit by archery
          id: 'muslim-vanguard-sulaym',
          name: "Banu Sulaym Vanguard under Khalid",
          nameAr: 'كَتِيبَةُ بَنِي سُلَيْمٍ — المُقَدِّمَةُ',
          troopType: 'cavalry',
          soldierCount: 900,
          commander: 'خَالِدُ بنُ الوَلِيدِ',
          startPosition: { x: 1100, y: 850 },
          startFormation: 'column',
          startFacing: 0, // facing east into the wadi
          stats: { attack: 10, defense: 8, speed: 9, morale: 10 },
        },
        {
          // 'Ali — banner of the Muhajirun
          id: 'muslim-muhajirun-banner',
          name: "'Ali's Muhajirun Banner",
          nameAr: 'كَتِيبَةُ المُهَاجِرِينَ — رَايَةُ عَلِيٍّ',
          troopType: 'infantry',
          soldierCount: 700,
          commander: 'عَلِيُّ بنُ أَبِي طَالِبٍ',
          startPosition: { x: 900, y: 850 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 10, defense: 9, speed: 6, morale: 10 },
        },
        {
          // Aws under Usayd ibn Hudayr
          id: 'muslim-aws-banner',
          name: "Aws Banner under Usayd ibn Hudayr",
          nameAr: 'كَتِيبَةُ الأَوْسِ — رَايَةُ أُسَيْدٍ',
          troopType: 'infantry',
          soldierCount: 1500,
          commander: 'أُسَيْدُ بنُ حُضَيْرٍ',
          startPosition: { x: 700, y: 800 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // Khazraj under Sa'd ibn 'Ubada
          id: 'muslim-khazraj-banner',
          name: "Khazraj Banner under Sa'd ibn 'Ubada",
          nameAr: 'كَتِيبَةُ الخَزْرَجِ — رَايَةُ سَعْدٍ',
          troopType: 'infantry',
          soldierCount: 1900,
          commander: 'سَعْدُ بنُ عُبَادَةَ',
          startPosition: { x: 700, y: 900 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // The Prophet's small command core — held when the army fled
          id: 'muslim-prophet-core',
          name: "The Prophet's Core (al-Mustafa ﷺ)",
          nameAr: 'كَتِيبَةُ المُصْطَفَى ﷺ — قَلْبُ الجَيْشِ',
          troopType: 'command',
          soldierCount: 80,
          commander: 'النَّبِيُّ مُحَمَّدٌ ﷺ عَلَى بَغْلَتِهِ البَيْضَاءِ',
          startPosition: { x: 800, y: 850 },
          startFormation: 'defensive_circle',
          startFacing: 0,
          stats: { attack: 9, defense: 10, speed: 6, morale: 10 },
        },
        {
          // The 2,000 newly-converted Makkans (al-tulaqa') — Abu Sufyan
          id: 'muslim-tulaqa-quraysh',
          name: "Quraysh Tulaqa'",
          nameAr: 'كَتِيبَةُ الطُّلَقَاءِ مِنْ قُرَيْشٍ',
          troopType: 'infantry',
          soldierCount: 2000,
          commander: 'أَبُو سُفْيَانَ بنُ حَرْبٍ',
          startPosition: { x: 500, y: 870 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 7 },
        },
        {
          // Ansari archers — Abu Qatada (salab ruling) and Salama ibn al-Akwa'
          id: 'muslim-ansar-archers',
          name: "Ansari Archers — Abu Qatada",
          nameAr: 'رُمَاةُ الأَنْصَارِ',
          troopType: 'archers',
          soldierCount: 600,
          commander: 'أَبُو قَتَادَةَ الأَنْصَارِيُّ',
          startPosition: { x: 700, y: 950 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 5, speed: 5, morale: 10 },
        },
        {
          // al-Zubayr's cavalry — part of the counter-attack after the dust-throw
          id: 'muslim-zubayr-cavalry',
          name: "al-Zubayr's Cavalry",
          nameAr: 'خَيْلُ الزُّبَيْرِ بنِ العَوَّامِ',
          troopType: 'cavalry',
          soldierCount: 800,
          commander: 'الزُّبَيْرُ بنُ العَوَّامِ',
          startPosition: { x: 600, y: 800 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 9, defense: 7, speed: 9, morale: 10 },
        },
        {
          // The 100 borrowed coats of mail from Safwan — 'ariya madmuna
          id: 'muslim-borrowed-armour',
          name: "The Borrowed-Armour Detachment ('Ariya Madmuna)",
          nameAr: 'كَتِيبَةُ الدُّرُوعِ المُسْتَعَارَةِ',
          troopType: 'heavy_cavalry',
          soldierCount: 100,
          commander: 'أَبُو طَلْحَةَ الأَنْصَارِيُّ',
          startPosition: { x: 650, y: 850 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 9, defense: 10, speed: 8, morale: 10 },
        },
        {
          // Rear elements of the 12,000-strong force — saqa
          id: 'muslim-rear-reserves',
          name: 'Rear Elements (al-Saqa)',
          nameAr: 'السَّاقَةُ — مُؤَخِّرَةُ الجَيْشِ',
          troopType: 'reserves',
          soldierCount: 5500,
          commander: 'قِيَادَةُ الجَيْشِ المُشْتَرَكَةُ',
          startPosition: { x: 300, y: 850 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 8 },
        },
      ],
    },

    // ─── Hawazin Forces (~6,000 with women + herds in the rear) ───────────
    {
      faction: 'hawazin',
      label: 'Hawazin & Thaqif Coalition',
      labelAr: 'جَيْشُ هَوَازِنَ وَثَقِيفَ',
      totalStrength: 6000,
      units: [
        {
          // Hawazin archers on the north ridge — open the battle
          id: 'hawazin-archers-north',
          name: 'Hawazin Archers — Northern Ridge',
          nameAr: 'كَتِيبَةُ رُمَاةِ هَوَازِنَ — الشِّعْبُ الشَّمَالِيُّ',
          troopType: 'archers',
          soldierCount: 800,
          commander: 'مَالِكُ بنُ عَوْفٍ النَّصْرِيُّ',
          startPosition: { x: 1500, y: 540 },
          startFormation: 'line',
          startFacing: Math.PI / 2, // facing south down into the wadi
          stats: { attack: 9, defense: 6, speed: 5, morale: 9 },
        },
        {
          // Banu Nasr spearmen on the south ridge — the second jaw
          id: 'hawazin-spearmen-south',
          name: 'Banu Nasr Spearmen — Southern Ridge',
          nameAr: 'كَتِيبَةُ بَنِي نَصْرٍ — الشِّعْبُ الجَنُوبِيُّ',
          troopType: 'infantry',
          soldierCount: 900,
          commander: 'قَائِدُ بَنِي نَصْرٍ',
          startPosition: { x: 1500, y: 1160 },
          startFormation: 'scattered',
          startFacing: -Math.PI / 2, // facing north
          stats: { attack: 8, defense: 7, speed: 6, morale: 8 },
        },
        {
          // Banu Jusham cavalry — Durayd's tribe; he advised against the women-rearing
          id: 'hawazin-jusham-cavalry',
          name: "Banu Jusham Cavalry (Durayd's tribe)",
          nameAr: 'خَيْلُ بَنِي جُشَمَ',
          troopType: 'cavalry',
          soldierCount: 600,
          commander: 'دُرَيْدُ بنُ الصِّمَّةِ (مُسْتَشَارٌ)',
          startPosition: { x: 1700, y: 850 },
          startFormation: 'wedge',
          startFacing: Math.PI, // facing west toward incoming Muslims
          stats: { attack: 8, defense: 7, speed: 9, morale: 8 },
        },
        {
          // Thaqif of al-Ta'if joined the coalition (except Banu Mu'attib)
          id: 'hawazin-thaqif',
          name: 'Thaqif of al-Ta\'if',
          nameAr: 'كَتِيبَةُ ثَقِيفَ مِنَ الطَّائِفِ',
          troopType: 'infantry',
          soldierCount: 1000,
          commander: 'قَارِبُ بنُ الأَسْوَدِ، وَذُو الخِمَارِ',
          startPosition: { x: 1800, y: 900 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 7, speed: 5, morale: 8 },
        },
        {
          // Banu Sa'd ibn Bakr — the Prophet's foster-tribe
          id: 'hawazin-saad-ibn-bakr',
          name: "Banu Sa'd ibn Bakr (the Prophet's foster-tribe)",
          nameAr: 'كَتِيبَةُ بَنِي سَعْدِ بنِ بَكْرٍ',
          troopType: 'infantry',
          soldierCount: 400,
          commander: 'قَائِدُ بَنِي سَعْدٍ',
          startPosition: { x: 1700, y: 780 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 7 },
        },
        {
          // The rear camp — women, children, livestock
          id: 'hawazin-rear-camp',
          name: 'The Rear Camp — Captives, Camels, Sheep',
          nameAr: 'الظَّعَائِنُ وَالأَنْعَامُ — مُعَسْكَرُ المُؤَخِّرَةِ',
          troopType: 'reserves',
          soldierCount: 300,
          commander: 'حُرَّاسُ المُعَسْكَرِ',
          startPosition: { x: 2120, y: 870 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI,
          stats: { attack: 4, defense: 5, speed: 4, morale: 5 },
        },
      ],
    },
  ],

  phases: [
    // Phase 1 (0–6s): March from Makkah; Dhat Anwat rebuke.
    {
      id: 'phase-01-march-dhat-anwat',
      name: 'March from Makkah & Dhat Anwat',
      nameAr: 'المَسِيرُ مِنْ مَكَّةَ وَحَدِيثُ ذَاتِ أَنْوَاطٍ',
      startTime: 0,
      duration: 6,
      description:
        "6 Shawwal 8 AH — the Muslim army marches east-southeast from Makkah toward Hunayn (~16 miles). Some recent converts ask the Prophet ﷺ to designate a sidra tree like Dhat Anwat for them; he rebukes them with the Tirmidhi 2180 saying — 'Subhan Allah! This is as the people of Musa said: Make for us a god as they have gods.'",
      actions: [
        { type: 'camera_move', params: { x: 1200, y: 800, zoom: 0.45, duration: 4 }, delay: 0 },
        // The 12,000-strong column tightens into march formation
        { type: 'change_formation', targetUnitId: 'muslim-vanguard-sulaym', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'muslim-muhajirun-banner', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'muslim-aws-banner', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'muslim-khazraj-banner', params: { formation: 'column' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'sidra-tree-marker', position: { x: 600, y: 850 }, label: 'ذَاتُ أَنْوَاطٍ' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 2 (6–11s): The boast over numbers.
    {
      id: 'phase-02-confidence-and-boast',
      name: 'The Boast over Numbers',
      nameAr: 'الإِعْجَابُ بِالكَثْرَةِ',
      startTime: 6,
      duration: 5,
      description:
        "On approach to Hunayn, some boast 'lan nughlaba al-yawma min qillatin' (we will not be defeated today from fewness). Q 9:25 explicitly rebukes this self-admiration over numbers — Hunayn is named in the Qur'an by name.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 700, zoom: 0.7, duration: 3 }, delay: 0 },
        // Slow chest-height tracking pan along the column
        { type: 'play_effect', params: { effect: 'banner-flutter', position: { x: 800, y: 850 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'quran-recitation', text: 'إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ' }, delay: 2 },
      ],
      triggers: [],
    },

    // Phase 3 (11–17s): Malik ibn 'Awf's ambush prepared the night before.
    {
      id: 'phase-03-malik-ambush-prep',
      name: "Malik ibn 'Awf's Ambush — Wednesday Night",
      nameAr: 'كَمِينُ مَالِكِ بْنِ عَوْفٍ — لَيْلَةَ الأَرْبِعَاءِ',
      startTime: 11,
      duration: 6,
      description:
        "Night of Wednesday 10 Shawwal: Malik moves his force into Wadi Hunayn under cover of darkness, stations archers and spearmen in the gullies on both ridges, and places women, children, and livestock at the rear. Durayd ibn al-Simma — carried in a litter, reportedly over 100 — warns: 'Does anything turn back a man in flight?' Malik dismisses the counsel.",
      actions: [
        { type: 'camera_move', params: { x: 1900, y: 600, zoom: 0.6, duration: 3 }, delay: 0 },
        // Hawazin archers move into ambush positions on north ridge
        { type: 'set_behavior', targetUnitId: 'hawazin-archers-north', params: { behavior: 'holding' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'hawazin-archers-north', params: { formation: 'line' }, delay: 0.5 },
        // Spearmen on south ridge
        { type: 'set_behavior', targetUnitId: 'hawazin-spearmen-south', params: { behavior: 'holding' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'hawazin-spearmen-south', params: { formation: 'scattered' }, delay: 0.5 },
        // Jusham cavalry in concealed position; Durayd in litter
        { type: 'change_formation', targetUnitId: 'hawazin-jusham-cavalry', params: { formation: 'wedge' }, delay: 1 },
        // Rear camp visible
        { type: 'play_effect', params: { effect: 'rear-camp-zaaain', position: { x: 2120, y: 870 } }, delay: 2 },
        { type: 'play_effect', params: { effect: 'durayd-litter', position: { x: 1700, y: 850 } }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 4 (17–23s): Vanguard descent at first light.
    {
      id: 'phase-04-vanguard-descent',
      name: "Khalid's Vanguard Descends in the Ghalas",
      nameAr: 'نُزُولُ مُقَدِّمَةِ خَالِدٍ فِي الغَلَسِ',
      startTime: 17,
      duration: 6,
      description:
        "Just before fajr on Wednesday 10 Shawwal. The Muslim vanguard — Banu Sulaym under Khalid ibn al-Walid — descends into the western mouth of Wadi Hunayn in the dim ghalas, the dawn still grey, the sky overcast. The narrow defile and rough road force the column to file in single order.",
      actions: [
        { type: 'camera_move', params: { x: 1100, y: 750, zoom: 0.75, duration: 3 }, delay: 0 },
        // Vanguard moves deeper into the throat
        { type: 'set_behavior', targetUnitId: 'muslim-vanguard-sulaym', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-sulaym', params: { position: { x: 1400, y: 850 }, speed: 90 }, delay: 0.5 },
        // The other columns follow into the wadi
        { type: 'set_behavior', targetUnitId: 'muslim-muhajirun-banner', params: { behavior: 'advancing' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-muhajirun-banner', params: { position: { x: 1100, y: 850 }, speed: 70 }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'muslim-aws-banner', params: { behavior: 'advancing' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-aws-banner', params: { position: { x: 900, y: 800 }, speed: 60 }, delay: 1.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-khazraj-banner', params: { behavior: 'advancing' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-khazraj-banner', params: { position: { x: 900, y: 900 }, speed: 60 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-prophet-core', params: { position: { x: 1000, y: 850 }, speed: 70 }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'muslim-tulaqa-quraysh', params: { position: { x: 700, y: 870 }, speed: 60 }, delay: 2 },
        { type: 'play_effect', params: { effect: 'pre-dawn-cold', position: { x: 1200, y: 800 } }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 5 (23–28s): The ambush detonates.
    {
      id: 'phase-05-the-ambush',
      name: "The Ambush Detonates — Rain of Arrows",
      nameAr: 'انْفِجَارُ الكَمِينِ — مَطَرُ السِّهَامِ',
      startTime: 23,
      duration: 5,
      description:
        "Sahih al-Bukhari 2930 — al-Bara: 'we were confronted by archers of Hawazin and Banu Nasr.' Massed archery from both heights followed by infantry charge down the slopes. The Banu Sulaym vanguard breaks first, collapsing backward. Q 9:25: 'wa-daqat 'alaykumu al-ardu bi-ma rahubat' — and the earth was straitened upon you despite its vastness.",
      actions: [
        { type: 'camera_move', params: { x: 1400, y: 700, zoom: 0.85, duration: 2 }, delay: 0 },
        // North ridge archers volley
        { type: 'set_behavior', targetUnitId: 'hawazin-archers-north', params: { behavior: 'attacking' }, delay: 0 },
        { type: 'attack_unit', targetUnitId: 'hawazin-archers-north', params: { targetId: 'muslim-vanguard-sulaym' }, delay: 0.5 },
        // South ridge spearmen charge down
        { type: 'set_behavior', targetUnitId: 'hawazin-spearmen-south', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'hawazin-spearmen-south', params: { position: { x: 1500, y: 950 }, speed: 130 }, delay: 0.5 },
        { type: 'attack_unit', targetUnitId: 'hawazin-spearmen-south', params: { targetId: 'muslim-vanguard-sulaym' }, delay: 1.5 },
        // Jusham cavalry flank attack
        { type: 'set_behavior', targetUnitId: 'hawazin-jusham-cavalry', params: { behavior: 'attacking' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hawazin-jusham-cavalry', params: { position: { x: 1500, y: 850 }, speed: 130 }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'hawazin-jusham-cavalry', params: { targetId: 'muslim-vanguard-sulaym' }, delay: 2 },
        // Vanguard breaks
        { type: 'set_behavior', targetUnitId: 'muslim-vanguard-sulaym', params: { behavior: 'retreating' }, delay: 2.5 },
        { type: 'change_formation', targetUnitId: 'muslim-vanguard-sulaym', params: { formation: 'scattered' }, delay: 3 },
        { type: 'play_effect', params: { effect: 'camera-shake', intensity: 1.0 }, delay: 1.5 },
      ],
      triggers: [],
    },

    // Phase 6 (28–34s): The first rout — most of the army flees.
    {
      id: 'phase-06-the-rout',
      name: "The Rout — 'You Turned Back, Fleeing'",
      nameAr: 'الهَزِيمَةُ الأُولَى — وَلَّيْتُمْ مُدْبِرِينَ',
      startTime: 28,
      duration: 6,
      description:
        "The collapse of the vanguard ripples through the column. The tulaqa' and rear elements turn back. Q 9:25 closes: 'thumma wallaytum mudbirin'. Most of the 12,000 break. Only the Prophet ﷺ and a small core hold their ground in the wadi floor.",
      actions: [
        { type: 'camera_move', params: { x: 1200, y: 800, zoom: 0.4, duration: 3 }, delay: 0 },
        // The vanguard recoils backward into the column
        { type: 'move_unit', targetUnitId: 'muslim-vanguard-sulaym', params: { position: { x: 800, y: 850 }, speed: 130 }, delay: 0 },
        // Tulaqa' flee west
        { type: 'set_behavior', targetUnitId: 'muslim-tulaqa-quraysh', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-tulaqa-quraysh', params: { formation: 'scattered' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-tulaqa-quraysh', params: { position: { x: 200, y: 870 }, speed: 130 }, delay: 1 },
        // Rear reserves flee west
        { type: 'set_behavior', targetUnitId: 'muslim-rear-reserves', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muslim-rear-reserves', params: { formation: 'scattered' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-rear-reserves', params: { position: { x: 100, y: 850 }, speed: 110 }, delay: 1 },
        // Aws and Khazraj banners recoil
        { type: 'set_behavior', targetUnitId: 'muslim-aws-banner', params: { behavior: 'retreating' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-aws-banner', params: { position: { x: 400, y: 800 }, speed: 100 }, delay: 1.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-khazraj-banner', params: { behavior: 'retreating' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-khazraj-banner', params: { position: { x: 400, y: 900 }, speed: 100 }, delay: 1.5 },
        // Prophet's core holds at center
        { type: 'set_behavior', targetUnitId: 'muslim-prophet-core', params: { behavior: 'holding' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'muslim-prophet-core', params: { formation: 'defensive_circle' }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 7 (34–40s): The Prophet ﷺ stands firm.
    {
      id: 'phase-07-prophet-stand',
      name: "The Prophet ﷺ Stands Firm — 'I am the Prophet, no lie'",
      nameAr: 'ثُبُوتُ النَّبِيِّ ﷺ — أَنَا النَّبِيُّ لَا كَذِبْ',
      startTime: 34,
      duration: 6,
      description:
        "Sahih al-Bukhari 4315 (al-Bara): 'but the Messenger of Allah ﷺ did not flee.' He on his white mule Duldul, with Abu Sufyan ibn al-Harith holding the bridle and al-Abbas at the stirrup, advances toward the enemy reciting the rajaz: 'أَنَا النَّبِيُّ لَا كَذِبْ، أَنَا ابْنُ عَبْدِ المُطَّلِبْ'.",
      actions: [
        { type: 'camera_move', params: { x: 1300, y: 800, zoom: 0.95, duration: 3 }, delay: 0 },
        // Prophet's core advances toward the enemy
        { type: 'set_behavior', targetUnitId: 'muslim-prophet-core', params: { behavior: 'advancing' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-prophet-core', params: { position: { x: 1200, y: 850 }, speed: 50 }, delay: 1 },
        { type: 'play_effect', params: { effect: 'rajaz-calligraphy', text: 'أَنَا النَّبِيُّ لَا كَذِبْ — أَنَا ابْنُ عَبْدِ المُطَّلِبْ' }, delay: 2 },
      ],
      triggers: [],
    },

    // Phase 8 (40–46s): al-Abbas's three nested rally calls.
    {
      id: 'phase-08-abbas-rally-call',
      name: "al-Abbas's Rally — 'O Companions of the Tree'",
      nameAr: 'نِدَاءُ العَبَّاسِ — يَا أَصْحَابَ السَّمُرَةِ',
      startTime: 40,
      duration: 6,
      description:
        "Sahih Muslim 1775 — al-Abbas's own narration. The Prophet ﷺ instructs: 'O 'Abbas, call out to the Companions of the Tree.' Al-Abbas — a man of mighty voice — calls in three nested escalations: (1) 'O Companions of the Tree!' invoking Bay'at al-Ridwan; (2) 'O company of the Ansar!'; (3) narrowing to 'O Banu al-Harith ibn al-Khazraj!'. The Ansar return crying 'labbayk, labbayk'.",
      actions: [
        { type: 'camera_move', params: { x: 1280, y: 800, zoom: 0.85, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'rally-call-1', label: 'يَا أَصْحَابَ السَّمُرَةِ' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'rally-call-2', label: 'يَا مَعْشَرَ الأَنْصَارِ' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'rally-call-3', label: 'يَا بَنِي الحَارِثِ بنِ الخَزْرَجِ' }, delay: 3 },
        // Aws and Khazraj banners halt and turn back
        { type: 'set_behavior', targetUnitId: 'muslim-aws-banner', params: { behavior: 'advancing' }, delay: 3.5 },
        { type: 'change_formation', targetUnitId: 'muslim-aws-banner', params: { formation: 'line' }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'muslim-aws-banner', params: { position: { x: 1100, y: 800 }, speed: 100 }, delay: 4 },
        { type: 'set_behavior', targetUnitId: 'muslim-khazraj-banner', params: { behavior: 'advancing' }, delay: 3.5 },
        { type: 'change_formation', targetUnitId: 'muslim-khazraj-banner', params: { formation: 'line' }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'muslim-khazraj-banner', params: { position: { x: 1100, y: 900 }, speed: 100 }, delay: 4 },
        // Archers rejoin the line
        { type: 'set_behavior', targetUnitId: 'muslim-ansar-archers', params: { behavior: 'advancing' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'muslim-ansar-archers', params: { position: { x: 1100, y: 950 }, speed: 90 }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 9 (46–51s): The handful of dust — 'shahat al-wujuh'.
    {
      id: 'phase-09-handful-of-dust',
      name: "The Handful of Dust — 'Shahat al-Wujuh'",
      nameAr: 'قَبْضَةُ التُّرَابِ — شَاهَتِ الوُجُوهُ',
      startTime: 46,
      duration: 5,
      description:
        "Sahih Muslim 1777 (Salama ibn al-Akwa'): the Prophet ﷺ scoops a handful of dust from the wadi floor, throws it toward the Hawazin lines saying 'shahat al-wujuh' — every man on the enemy side has his eyes filled with dust from that single throw. Q 9:26: 'Then Allah sent down His tranquillity upon His Messenger and the believers, and sent down armies you did not see.' Then the Prophet's words: 'inhazamu wa-Rabbi Muhammadin' — they are routed, by the Lord of Muhammad.",
      actions: [
        { type: 'camera_move', params: { x: 1500, y: 750, zoom: 0.9, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'slow-motion', position: { x: 1300, y: 850 } }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'dust-throw', from: { x: 1300, y: 850 }, to: { x: 1500, y: 800 } }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'shahat-al-wujuh' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'quran-recitation', text: 'وَأَنزَلَ جُنُودًا لَّمْ تَرَوْهَا' }, delay: 3 },
        // Hawazin recoil — blinded
        { type: 'set_behavior', targetUnitId: 'hawazin-archers-north', params: { behavior: 'retreating' }, delay: 3.5 },
        { type: 'set_behavior', targetUnitId: 'hawazin-spearmen-south', params: { behavior: 'retreating' }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'inhazamu-wa-rabbi-muhammad' }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 10 (51–57s): "Now the furnace is hot" — counter-attack.
    {
      id: 'phase-10-now-the-furnace-is-hot',
      name: "'Now the Furnace is Hot'",
      nameAr: 'الآنَ حَمِيَ الوَطِيسُ',
      startTime: 51,
      duration: 6,
      description:
        "Sahih Muslim 1775. The Prophet ﷺ declares: 'al-aana hamiya al-watis' — now the furnace is hot, an idiom no Arab had been heard to utter before. The counter-attack rolls forward; Khalid is wounded; Banu Sulaym recover. The salab ruling is established this day via Abu Qatada (Sahih al-Bukhari 3142).",
      actions: [
        { type: 'camera_move', params: { x: 1600, y: 800, zoom: 0.6, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'lighting-warm-shift' }, delay: 0.5 },
        // Muhajirun banner with 'Ali charges forward
        { type: 'change_formation', targetUnitId: 'muslim-muhajirun-banner', params: { formation: 'wedge' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-muhajirun-banner', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-muhajirun-banner', params: { position: { x: 1500, y: 850 }, speed: 110 }, delay: 0.5 },
        // Zubayr's cavalry flank charge
        { type: 'change_formation', targetUnitId: 'muslim-zubayr-cavalry', params: { formation: 'flank_right' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'muslim-zubayr-cavalry', params: { behavior: 'attacking' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muslim-zubayr-cavalry', params: { position: { x: 1600, y: 800 }, speed: 140 }, delay: 1 },
        // Borrowed-armour shock charge
        { type: 'change_formation', targetUnitId: 'muslim-borrowed-armour', params: { formation: 'wedge' }, delay: 1.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-borrowed-armour', params: { behavior: 'attacking' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'muslim-borrowed-armour', params: { position: { x: 1550, y: 850 }, speed: 130 }, delay: 1.5 },
        // Engagements
        { type: 'attack_unit', targetUnitId: 'muslim-muhajirun-banner', params: { targetId: 'hawazin-jusham-cavalry' }, delay: 2.5 },
        { type: 'attack_unit', targetUnitId: 'muslim-zubayr-cavalry', params: { targetId: 'hawazin-thaqif' }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'al-aana-hamiya-al-watis' }, delay: 3 },
        // Salab ruling — Abu Qatada single combat
        { type: 'play_effect', params: { effect: 'abu-qatada-salab', position: { x: 1500, y: 950 } }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 11 (57–63s): Hawazin shatter — Awtas and al-Ta'if pursuits.
    {
      id: 'phase-11-hawazin-shatter',
      name: "Hawazin Shatter — Awtas and al-Ta'if",
      nameAr: 'تَشَتُّتُ هَوَازِنَ — أَوْطَاسٌ وَالطَّائِفُ',
      startTime: 57,
      duration: 6,
      description:
        "The Hawazin coalition shatters. ~70 Hawazin killed. One body flees east to Awtas — Abu Amir al-Ash'ari pursues, is killed by an arrow, command passes to his nephew Abu Musa al-Ash'ari (Bukhari 4323). Another body flees southeast with Malik to fortify in al-Ta'if. Durayd ibn al-Simma is overtaken in his litter and killed by Rabi'a ibn Rafi' al-Sulami. The rear camp falls intact as spoils.",
      actions: [
        { type: 'camera_move', params: { x: 1800, y: 700, zoom: 0.5, duration: 3 }, delay: 0 },
        // Hawazin units scatter and rout
        { type: 'change_formation', targetUnitId: 'hawazin-archers-north', params: { formation: 'scattered' }, delay: 0 },
        { type: 'change_formation', targetUnitId: 'hawazin-spearmen-south', params: { formation: 'scattered' }, delay: 0 },
        { type: 'change_formation', targetUnitId: 'hawazin-jusham-cavalry', params: { formation: 'scattered' }, delay: 0.5 },
        // Thaqif flee southeast toward al-Ta'if
        { type: 'set_behavior', targetUnitId: 'hawazin-thaqif', params: { behavior: 'retreating' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hawazin-thaqif', params: { position: { x: 2370, y: 1100 }, speed: 130 }, delay: 1 },
        // Banu Sa'd flee east toward Awtas
        { type: 'set_behavior', targetUnitId: 'hawazin-saad-ibn-bakr', params: { behavior: 'retreating' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hawazin-saad-ibn-bakr', params: { position: { x: 2370, y: 850 }, speed: 130 }, delay: 1 },
        // Durayd's litter overtaken — killed
        { type: 'destroy_unit', targetUnitId: 'hawazin-jusham-cavalry', params: { cause: 'durayd-killed' }, delay: 3 },
        { type: 'play_effect', params: { effect: 'casualty-marker', position: { x: 1700, y: 850 }, label: 'دُرَيْدُ بنُ الصِّمَّةِ' }, delay: 3.5 },
        // Other units destroyed/scattered
        { type: 'destroy_unit', targetUnitId: 'hawazin-archers-north', params: { cause: 'shattered' }, delay: 4 },
        { type: 'destroy_unit', targetUnitId: 'hawazin-spearmen-south', params: { cause: 'shattered' }, delay: 4 },
        // Rear camp captured intact
        { type: 'set_behavior', targetUnitId: 'hawazin-rear-camp', params: { behavior: 'holding' }, delay: 4.5 },
        { type: 'play_effect', params: { effect: 'rear-camp-captured', position: { x: 2120, y: 870 } }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 12 (63–68s): al-Ji'rana — captives returned, Ansar khutba.
    {
      id: 'phase-12-jirana-and-ansar-khutba',
      name: "al-Ji'rana — Captives Returned & the Ansar Khutba",
      nameAr: 'الجِعْرَانَةُ — رَدُّ السَّبْيِ وَخُطْبَةُ الأَنْصَارِ',
      startTime: 63,
      duration: 5,
      description:
        "After the brief siege of al-Ta'if, the Prophet ﷺ returns to al-Ji'rana. The spoils have been held over ten nights: ~6,000 captives, ~22,000-24,000 camels, >40,000 sheep, 4,000 uqiyya silver. The Hawazin delegation comes as Muslims; the Prophet ﷺ offers them: 'Choose one of the two parties: either the captives or the property.' They choose captives. All 6,000 are returned, including his foster-sister Shayma bint al-Harith. Then mu'allafat qulubihim distribution: 100 camels each to Abu Sufyan, Safwan, Uyayna, al-Aqra'. The Ansar murmur. He gathers them in a leather qubba (Bukhari 4337): 'Are you not pleased that the people go off with worldly things while you go off with the Messenger of Allah?' They weep until their beards are wet.",
      actions: [
        { type: 'camera_move', params: { x: 600, y: 1100, zoom: 0.55, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'fade-to-jirana' }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'spoils-tally', position: { x: 550, y: 1340 }, label: '٦٠٠٠ سَبْيٌ، ٢٤٠٠٠ بَعِيرٌ، ٤٠٠٠٠ شَاةٍ' }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'hawazin-delegation-bayah', position: { x: 600, y: 1340 } }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'captives-released', count: 6000 }, delay: 3 },
        { type: 'play_effect', params: { effect: 'ansar-leather-qubba', position: { x: 700, y: 1350 } }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'ansar-khutba-tears' }, delay: 4 },
      ],
      triggers: [],
    },
  ],

  narration: [
    {
      id: 'narr-01-march',
      time: 1,
      duration: 5,
      text: "On the sixth of Shawwal, in the eighth year of the Hijra, the Messenger of Allah ﷺ departed Makkah with twelve thousand men — ten thousand veterans of Madinah, and two thousand newly converted Makkans, the tulaqa'.",
      textAr:
        'فِي السَّادِسِ مِنْ شَوَّالٍ، سَنَةَ ثَمَانٍ لِلْهِجْرَةِ، خَرَجَ رَسُولُ اللَّهِ ﷺ مِنْ مَكَّةَ فِي اثْنَيْ عَشَرَ أَلْفًا — عَشَرَةُ آلَافٍ مِنْ أَهْلِ المَدِينَةِ، وَأَلْفَانِ مِنْ مُسْلِمَةِ الفَتْحِ، الطُّلَقَاءِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-02-dhat-anwat',
      time: 6.5,
      duration: 4.5,
      text: "The army passed a lote-tree called Dhat Anwat. Some new converts said: 'O Messenger of Allah, designate for us a Dhat Anwat as they have one.' He said: 'Glory be to Allah — this is as the people of Musa said: Make for us a god as they have gods. By the One in whose hand is my soul, you will follow the ways of those before you.' (Tirmidhi 2180)",
      textAr:
        'وَمَرَّ الجَيْشُ بِسِدْرَةٍ يُقَالُ لَهَا «ذَاتُ أَنْوَاطٍ»، فَقَالَ نَفَرٌ مِنْ حُدَثَاءِ العَهْدِ بِالإِسْلَامِ: يَا رَسُولَ اللَّهِ، اجْعَلْ لَنَا ذَاتَ أَنْوَاطٍ كَمَا لَهُمْ ذَاتُ أَنْوَاطٍ. فَقَالَ ﷺ: «سُبْحَانَ اللَّهِ! هَذَا كَمَا قَالَ قَوْمُ مُوسَى: ٱجْعَل لَّنَآ إِلَٰهًا كَمَا لَهُمْ ءَالِهَةٌ. وَالَّذِي نَفْسِي بِيَدِهِ، لَتَرْكَبُنَّ سُنَّةَ مَنْ كَانَ قَبْلَكُمْ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-03-quran-9-25',
      time: 11.5,
      duration: 6,
      text: "Some among them said that day: 'We shall not be defeated today from fewness.' So Allah revealed: 'Allah has already granted you victory in many regions, and on the day of Hunayn — when your great number pleased you, but it availed you nothing; and the earth, vast as it is, was straitened upon you, then you turned back, fleeing.' (Q 9:25)",
      textAr:
        'وَقَالَ بَعْضُهُمْ يَوْمَئِذٍ: لَنْ نُغْلَبَ اليَوْمَ مِنْ قِلَّةٍ. فَأَنْزَلَ اللَّهُ تَعَالَى: ﴿لَقَدْ نَصَرَكُمُ اللَّهُ فِي مَوَاطِنَ كَثِيرَةٍ ۙ وَيَوْمَ حُنَيْنٍ ۙ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنكُمْ شَيْئًا وَضَاقَتْ عَلَيْكُمُ الْأَرْضُ بِمَا رَحُبَتْ ثُمَّ وَلَّيْتُم مُّدْبِرِينَ﴾.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-04-durayd',
      time: 18,
      duration: 5,
      text: "Malik ibn 'Awf an-Nasri had brought the women, children, and livestock — so that men would fight for their families and possessions. The aged Durayd ibn al-Simma — carried in a litter, reportedly over a hundred years old — rebuked him: 'Does anything turn back a man in flight?' (Ibn Hisham, Sira)",
      textAr:
        'وَكَانَ مَالِكُ بْنُ عَوْفٍ النَّصْرِيُّ قَدْ سَاقَ مَعَهُ النِّسَاءَ وَالأَبْنَاءَ وَالأَنْعَامَ — لِيَقْتَتِلَ النَّاسُ عَنْ أَهْلِيهِمْ وَأَمْوَالِهِمْ. فَأَنْكَرَ عَلَيْهِ الشَّيْخُ الكَبِيرُ دُرَيْدُ بْنُ الصِّمَّةِ، وَهُوَ يُحْمَلُ فِي شِجَارٍ، فَقَالَ: «هَلْ يَرُدُّ المُنْهَزِمَ شَيْءٌ؟».',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-05-ambush',
      time: 24,
      duration: 4,
      text: "When the vanguard of Banu Sulaym, under Khalid ibn al-Walid, descended in the grey of dawn — arrows burst from the gullies like locusts, and horsemen and spearmen poured down from the heights. (Sahih al-Bukhari 2930)",
      textAr:
        'وَلَمَّا انْحَدَرَتْ مُقَدِّمَةُ بَنِي سُلَيْمٍ، بِقِيَادَةِ خَالِدِ بْنِ الوَلِيدِ، فِي غَلَسِ الفَجْرِ — انْفَجَرَتِ السِّهَامُ مِنَ الشِّعَابِ كَأَنَّهَا الجَرَادُ، وَانْحَدَرَ الفُرْسَانُ وَالرِّمَاحُ مِنَ الشَّوَاهِقِ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-06-rout',
      time: 28.5,
      duration: 5,
      text: "The army was thrown into disorder, the vanguard collapsed back upon those behind it, and most of the people turned in flight — and the earth, vast as it was, was straitened upon them, as Allah said.",
      textAr:
        'فَاضْطَرَبَ الجَيْشُ، وَانْكَفَأَتِ المُقَدِّمَةُ عَلَى مَنْ خَلْفَهَا، وَوَلَّى أَكْثَرُ النَّاسِ مُدْبِرِينَ — وَضَاقَتْ عَلَيْهِمُ الأَرْضُ بِمَا رَحُبَتْ، كَمَا قَالَ اللَّهُ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-07-prophet-stand',
      time: 34.5,
      duration: 5,
      text: "The Messenger of Allah ﷺ stood firm on his white mule, with Abu Sufyan ibn al-Harith holding its head and al-Abbas holding its stirrup, urging it toward the disbelievers and saying: 'I am the Prophet — no lie; I am the son of 'Abd al-Muttalib.' (Sahih al-Bukhari 4315)",
      textAr:
        'وَثَبَتَ رَسُولُ اللَّهِ ﷺ عَلَى بَغْلَتِهِ البَيْضَاءِ، وَأَبُو سُفْيَانَ بْنُ الحَارِثِ آخِذٌ بِرَأْسِهَا، وَالعَبَّاسُ آخِذٌ بِرِكَابِهَا، وَهُوَ يَرْكُضُهَا قِبَلَ الكُفَّارِ وَيَقُولُ: «أَنَا النَّبِيُّ لَا كَذِبْ، أَنَا ابْنُ عَبْدِ المُطَّلِبْ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-08-abbas-call',
      time: 40.5,
      duration: 5.5,
      text: "Then he ﷺ said to al-Abbas — a man of mighty voice: 'O 'Abbas, call out to the Companions of the Tree.' He cried at the top of his voice: 'O Companions of the Tree! O company of the Ansar! O Banu al-Harith ibn al-Khazraj!' They answered: 'Here we are, here we are' — and their turning to the Messenger was like the turning of cattle to their young. (Sahih Muslim 1775)",
      textAr:
        'ثُمَّ قَالَ ﷺ لِلْعَبَّاسِ — وَكَانَ رَجُلًا صَيِّتًا: «أَيْ عَبَّاسُ، نَادِ أَصْحَابَ السَّمُرَةِ». فَنَادَى بِأَعْلَى صَوْتِهِ: «يَا أَصْحَابَ السَّمُرَةِ! يَا مَعْشَرَ الأَنْصَارِ! يَا بَنِي الحَارِثِ بْنِ الخَزْرَجِ!». فَقَالُوا: لَبَّيْكَ، لَبَّيْكَ — وَكَأَنَّ عَطْفَتَهُمْ عَلَى رَسُولِ اللَّهِ ﷺ عَطْفَةُ البَقَرِ عَلَى أَوْلَادِهَا.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-09-dust-and-sakina',
      time: 46,
      duration: 5,
      text: "Then the Prophet ﷺ took a handful of dust and threw it in the faces of the polytheists, saying: 'May the faces be disfigured' — and Allah did not leave a man of them but filled his eyes with dust. Then he said: 'They are routed, by the Lord of Muhammad!' 'Then Allah sent down His tranquillity upon His Messenger and upon the believers, and sent down armies you did not see.' (Sahih Muslim 1777; Q 9:26)",
      textAr:
        'ثُمَّ أَخَذَ النَّبِيُّ ﷺ كَفًّا مِنْ تُرَابٍ، فَرَمَى بِهِ وُجُوهَ المُشْرِكِينَ، وَقَالَ: «شَاهَتِ الوُجُوهُ» — فَمَا خَلَقَ اللَّهُ مِنْهُمْ إِنْسَانًا إِلَّا مَلَأَ عَيْنَيْهِ تُرَابًا. ثُمَّ قَالَ: «انْهَزَمُوا وَرَبِّ مُحَمَّدٍ». ﴿ثُمَّ أَنزَلَ اللَّهُ سَكِينَتَهُ عَلَىٰ رَسُولِهِ وَعَلَى الْمُؤْمِنِينَ وَأَنزَلَ جُنُودًا لَّمْ تَرَوْهَا﴾.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-10-watis',
      time: 51.5,
      duration: 4,
      text: "When the fighting reached its height he ﷺ said: 'Now the furnace is hot' — a phrase no Arab had been heard to say before him. The Muslims charged as one: the banner of the Muhajirun with 'Ali, the banners of the Ansar, and the cavalry of al-Zubayr. (Sahih Muslim 1775)",
      textAr:
        'وَلَمَّا اشْتَدَّ القِتَالُ، قَالَ ﷺ: «الآنَ حَمِيَ الوَطِيسُ» — وَهِيَ كَلِمَةٌ لَمْ تُسْمَعْ مِنْ عَرَبِيٍّ قَبْلَهُ. فَكَرَّ المُسْلِمُونَ كَرَّةً وَاحِدَةً، وَتَقَدَّمَتْ رَايَةُ المُهَاجِرِينَ مَعَ عَلِيٍّ، وَرَايَاتُ الأَنْصَارِ، وَخَيْلُ الزُّبَيْرِ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-11-shatter',
      time: 56,
      duration: 4.5,
      text: "Hawazin scattered: one body fled to Awtas — where Abu 'Amir al-Ash'ari was martyred, and his nephew Abu Musa took the banner and completed the victory. Another body fled with Malik to al-Ta'if. And Durayd ibn al-Simma was overtaken in his litter, and Rabi'a ibn Rufay' al-Sulami killed him. (Sahih al-Bukhari 4323; al-Tabari)",
      textAr:
        'وَتَشَتَّتَتْ هَوَازِنُ: فَفِرْقَةٌ إِلَى أَوْطَاسٍ — وَهُنَاكَ اسْتُشْهِدَ أَبُو عَامِرٍ الأَشْعَرِيُّ، فَأَخَذَ الرَّايَةَ ابْنُ أَخِيهِ أَبُو مُوسَى وَأَتَمَّ الفَتْحَ. وَفِرْقَةٌ إِلَى الطَّائِفِ مَعَ مَالِكٍ. وَأُدْرِكَ دُرَيْدُ بْنُ الصِّمَّةِ فِي شِجَارِهِ، فَقَتَلَهُ رَبِيعَةُ بْنُ رُفَيْعٍ السُّلَمِيُّ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-12-jirana-choice',
      time: 60.5,
      duration: 4.5,
      text: "Then he ﷺ returned to al-Ji'rana, and held the captives for more than ten nights. The delegation of Hawazin came as Muslims, and he said: 'Choose one of the two parties: either the captives or the property.' They chose their captives — and he returned to them six thousand of their women and children, including his foster-sister Shayma bint al-Harith. (Sahih al-Bukhari 4318–4319; Ibn Hisham)",
      textAr:
        'ثُمَّ رَجَعَ ﷺ إِلَى الجِعْرَانَةِ، وَأَمْسَكَ السَّبْيَ بِضْعَ عَشْرَةَ لَيْلَةً، فَقَدِمَ وَفْدُ هَوَازِنَ مُسْلِمِينَ، فَقَالَ ﷺ: «فَاخْتَارُوا إِحْدَى الطَّائِفَتَيْنِ: إِمَّا السَّبْيَ، وَإِمَّا المَالَ». فَاخْتَارُوا سَبْيَهُمْ — فَرَدَّ عَلَيْهِمْ سِتَّةَ آلَافٍ مِنَ الذَّرَارِيِّ وَالنِّسَاءِ، وَفِيهِمْ أُخْتُهُ مِنَ الرَّضَاعَةِ الشَّيْمَاءُ بِنْتُ الحَارِثِ.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-13-ansar-khutba',
      time: 65,
      duration: 3,
      text: "When he ﷺ gave the recent Quraysh converts a hundred camels each, the Ansar were grieved. He gathered them in a leather pavilion and said: 'O company of the Ansar — are you not pleased that the people go off with worldly things while you go off with the Messenger of Allah, taking him to your homes?' They wept until their beards were wet. (Sahih al-Bukhari 4337)",
      textAr:
        'وَلَمَّا أَعْطَى المُؤَلَّفَةَ قُلُوبُهُمْ مِنْ قُرَيْشٍ مِئَةَ مِئَةٍ مِنَ الإِبِلِ، وَجَدَ الأَنْصَارُ فِي أَنْفُسِهِمْ. فَجَمَعَهُمْ ﷺ فِي قُبَّةٍ مِنْ أَدَمٍ وَقَالَ: «يَا مَعْشَرَ الأَنْصَارِ، أَلَا تَرْضَوْنَ أَنْ يَذْهَبَ النَّاسُ بِالدُّنْيَا، وَتَذْهَبُونَ بِرَسُولِ اللَّهِ ﷺ تَحُوزُونَهُ إِلَى بُيُوتِكُمْ؟». فَبَكَوْا حَتَّى أَخْضَلُوا لِحَاهُمْ، وَقَالُوا: رَضِينَا بِرَسُولِ اللَّهِ قَسْمًا وَحَظًّا.',
      style: 'quote',
      position: 'center',
    },
  ],

  cameraScript: [
    // Wide establishing overview of the 12,000-strong column on the march
    { time: 0, position: { x: 1200, y: 800 }, zoom: 0.45, duration: 6, easing: 'power2.inOut', type: 'overview' },
    // Glide along the column at chest-height to highlight the polished mail
    { time: 6, position: { x: 800, y: 700 }, zoom: 0.7, duration: 5, easing: 'power2.inOut', type: 'pan' },
    // Cut to the enemy side: pan across the dark ridges to reveal Hawazin ambush
    { time: 11, position: { x: 1900, y: 600 }, zoom: 0.6, duration: 6, easing: 'power2.inOut', type: 'pan' },
    // Follow Khalid's vanguard descending into the throat in the grey ghalas
    { time: 17, position: { x: 1100, y: 750 }, zoom: 0.75, duration: 6, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-vanguard-sulaym' },
    // Snap into the ambush — arrows from north, charge from south, vanguard buckling
    { time: 23, position: { x: 1400, y: 700 }, zoom: 0.85, duration: 5, easing: 'power2.inOut', type: 'focus' },
    // Zoom out to overview to show the entire host disintegrating
    { time: 28, position: { x: 1200, y: 800 }, zoom: 0.4, duration: 6, easing: 'power2.inOut', type: 'zoom' },
    // Tightest zoom of the scenario — onto the Prophet ﷺ on Duldul
    { time: 34, position: { x: 1300, y: 800 }, zoom: 0.95, duration: 6, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-prophet-core' },
    // Hold close on al-Abbas as he delivers the three nested rally calls
    { time: 40, position: { x: 1280, y: 800 }, zoom: 0.85, duration: 6, easing: 'power2.inOut', type: 'focus' },
    // Slow-motion focus on the handful-of-dust moment
    { time: 46, position: { x: 1500, y: 750 }, zoom: 0.9, duration: 5, easing: 'power2.inOut', type: 'focus' },
    // Widen to a battle-wide pan as the Muslim banners wheel forward together
    { time: 51, position: { x: 1600, y: 800 }, zoom: 0.6, duration: 6, easing: 'power2.inOut', type: 'pan' },
    // High overhead showing the two pursuit axes — Awtas east, al-Ta'if southeast
    { time: 57, position: { x: 1800, y: 700 }, zoom: 0.5, duration: 6, easing: 'power2.inOut', type: 'overview' },
    // Final transition — fade from the wadi to the al-Ji'rana staging camp
    { time: 63, position: { x: 600, y: 1100 }, zoom: 0.55, duration: 5, easing: 'power2.inOut', type: 'pan' },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 4,
    enemyCasualties: 70,
    summary:
      "Victory after a near-defeat. Twelve thousand were drawn into the throat of Wadi Hunayn at first light; most fled. The Prophet ﷺ stood firm on his white mule declaring 'I am the Prophet — no lie.' Al-Abbas's voice — three nested calls — recalled the Companions of the Tree, and the Prophet ﷺ threw a handful of dust saying 'May the faces be disfigured': not a man of them remained but Allah filled his eyes with dust. Four Muslims fell — among them Ayman ibn 'Ubayd — about seventy of Hawazin were killed, and the rest scattered between Awtas and al-Ta'if. The captives — six thousand — and the herds were held at al-Ji'rana until the Hawazin came as Muslims, and all the captives were returned.",
    summaryAr:
      'نَصْرٌ بَعْدَ هَزِيمَةٍ كَادَتْ تَكُونُ. اسْتُدْرِجَ اثْنَا عَشَرَ أَلْفًا فِي مَضِيقِ حُنَيْنٍ فِي غَلَسِ الفَجْرِ، فَوَلَّى أَكْثَرُهُمْ، وَثَبَتَ النَّبِيُّ ﷺ عَلَى بَغْلَتِهِ البَيْضَاءِ مُعْلِنًا: «أَنَا النَّبِيُّ لَا كَذِبْ». فَنَادَى العَبَّاسُ أَصْحَابَ السَّمُرَةِ، وَرَمَى ﷺ بِقَبْضَةٍ مِنْ تُرَابٍ قَائِلًا: «شَاهَتِ الوُجُوهُ»، فَمَا بَقِيَ مِنْهُمْ أَحَدٌ إِلَّا مَلَأَ اللَّهُ عَيْنَيْهِ تُرَابًا. اسْتُشْهِدَ أَرْبَعَةٌ — فِيهِمْ أَيْمَنُ بْنُ عُبَيْدٍ — وَقُتِلَ مِنْ هَوَازِنَ نَحْوُ سَبْعِينَ، وَتَفَرَّقَ سَائِرُهُمْ بَيْنَ أَوْطَاسٍ وَالطَّائِفِ. وَسِيقَ السَّبْيُ — سِتَّةُ آلَافٍ — وَالأَنْعَامُ إِلَى الجِعْرَانَةِ، حَتَّى قَدِمَ وَفْدُ هَوَازِنَ مُسْلِمِينَ فَرُدَّ السَّبْيُ كُلُّهُ.',
    significance:
      "Allah revealed two verses of Surat al-Tawba about the day of Hunayn — a chastisement for self-admiration over numbers, and a glad tiding of sakina and unseen armies. With it ended the last organized resistance to Islam in the Hijaz, opening the Year of Delegations. The salab ruling — the slain combatant's effects to his killer with proof — was promulgated this day (Bukhari 3142), and ta'lif al-qulub became a permanent zakat category (Q 9:60). The Prophet ﷺ delivered his famous khutba to the Ansar — that the people go off with worldly goods while the Ansar go off with the Messenger of Allah — sealing their bond to prophethood forever.",
    significanceAr:
      'أَنْزَلَ اللَّهُ فِي يَوْمِ حُنَيْنٍ آيَتَيْنِ مِنْ سُورَةِ التَّوْبَةِ — تَأْدِيبٌ عَلَى الإِعْجَابِ بِالكَثْرَةِ، وَتَبْشِيرٌ بِالسَّكِينَةِ وَالجُنُودِ الَّتِي لَمْ تُرَ. وَبِهَا انْتَهَتْ آخِرُ مُقَاوَمَةٍ مُنَظَّمَةٍ لِلْإِسْلَامِ فِي الحِجَازِ، وَفُتِحَ بَابُ «عَامِ الوُفُودِ». وَأُسِّسَ يَوْمَئِذٍ حُكْمُ السَّلَبِ لِلْقَاتِلِ بِالبَيِّنَةِ (البخاري ٣١٤٢)، وَتَأْلِيفُ القُلُوبِ كَأَصْلٍ مِنْ مَصَارِفِ الزَّكَاةِ (التوبة ٩:٦٠). وَخَطَبَ ﷺ الأَنْصَارَ خُطْبَتَهُ المَشْهُورَةَ — أَنْ يَذْهَبَ النَّاسُ بِالدُّنْيَا، وَيَذْهَبُوا بِرَسُولِ اللَّهِ — فَخَتَمَ بِهَا حَمِيمِيَّةَ الأَنْصَارِ بِالنُّبُوَّةِ خَتْمًا أَبَدِيًّا.',
  },

  totalDuration: 68,
};
