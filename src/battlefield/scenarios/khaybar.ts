import type { BattleScenario } from '../types/scenario';

/**
 * غَزْوَةُ خَيْبَرَ — يَوْمُ الْفَتْحِ
 * Battle of Khaybar — The Day of Conquest
 *
 * Muharram 7 AH / May–June 628 CE — three weeks after the return
 * from Hudaybiyya, with Surat al-Fath's promise of «مَغَانِمَ كَثِيرَةً
 * يَأْخُذُونَهَا» (Q 48:19) freshly revealed. Khaybar oasis, ~150 km
 * north-northwest of Medina, embedded in the volcanic basalt of
 * Harrat Khaybar — a strewn plain of black cinder broken by date-palm
 * groves and stone fortresses on basalt outcrops.
 *
 * The Prophet ﷺ marched with 1,400–1,600 men — the Pledgers of
 * al-Ridwan, eligible for the Khaybar shares per Q 48:18–20 — and
 * about 200 horse. He encamped at the valley of al-Raji', south of
 * al-Natat, deliberately interposing the army between Khaybar and
 * Ghatafan country. The 4,000 of Ghatafan, hearing reports of an
 * attack on their own families behind them, turned back from their
 * reinforcement (al-Tabari, Tarikh vol. 8 p. 116). That was the first
 * opening of the conquest, before a wall had been struck.
 *
 * At dawn the Khaybari farmers came out with their masahi (spades)
 * and saw the army — they cried «مُحَمَّدٌ وَاللَّهِ، مُحَمَّدٌ
 * وَالخَمِيسُ» and fled into their forts. The Prophet ﷺ raised both
 * hands and said: «اللَّهُ أَكْبَرُ، خَرِبَتْ خَيْبَرُ، إِنَّا إِذَا
 * نَزَلْنَا بِسَاحَةِ قَوْمٍ فَسَاءَ صَبَاحُ المُنْذَرِينَ» (Bukhari
 * 2945, 4197).
 *
 * The campaign reduced the eight fortresses district by district:
 * al-Natat first (Hisn Na'im — under whose wall Mahmud ibn Maslama
 * was killed by a millstone, and outside which his brother Muhammad
 * ibn Maslama killed al-Harith brother of Marhab in single combat;
 * then Hisn al-Sa'b ibn Mu'adh — the granary — taken in three days
 * after al-Hubab ibn al-Mundhir advised relocating the camp away
 * from arrow range and the malarial low-ground; then Qal'at al-Zubayr,
 * surrendered after the Muslims traced the qanat tunnels and cut
 * the springs); then the forts of al-Shiqq district (Ubayy and
 * al-Nizar) in succession.
 *
 * Only al-Katiba district remained, and at its head the impregnable
 * al-Qamus — stronghold of Banu Abi al-Huqayq. After Abu Bakr and
 * 'Umar each led an assault that returned without decisive victory,
 * the Prophet ﷺ said on the eve: «لَأُعْطِيَنَّ هَذِهِ الرَّايَةَ
 * غَدًا رَجُلًا يَفْتَحُ اللَّهُ عَلَى يَدَيْهِ، يُحِبُّ اللَّهَ
 * وَرَسُولَهُ، وَيُحِبُّهُ اللَّهُ وَرَسُولُهُ» (Bukhari 4209–4210).
 * At dawn 'Ali ibn Abi Talib was summoned, suffering from acute
 * conjunctivitis (ramad); the Prophet ﷺ spat into his eyes and
 * prayed for him, and he was healed as if he had never had any
 * pain. The banner was given to him with the instruction: «انْفُذْ
 * عَلَى رِسْلِكَ حَتَّى تَنْزِلَ بِسَاحَتِهِمْ، ثُمَّ ادْعُهُمْ إِلَى
 * الإِسْلَامِ».
 *
 * Marhab — the Yemeni Jewish champion — emerged before the gate
 * brandishing his sword and chanting: «قَدْ عَلِمَتْ خَيْبَرُ أَنِّي
 * مَرْحَبُ، شَاكِي السِّلَاحِ بَطَلٌ مُجَرَّبُ». 'Amir ibn al-Akwa'
 * answered with parallel rajaz; in the exchange his short sword
 * recoiled and severed his akhal, and he died. The Prophet ﷺ ruled:
 * «كَذَبَ مَنْ قَالَ ذَلِكَ، بَلْ لَهُ أَجْرُهُ مَرَّتَيْنِ» (Sahih
 * Muslim 1807a). Then 'Ali advanced chanting: «أَنَا الَّذِي سَمَّتْنِي
 * أُمِّي حَيْدَرَهْ، كَلَيْثِ غَابَاتٍ كَرِيهِ المَنْظَرَهْ» — and
 * struck Marhab a blow that split his skull until the sword bit
 * his teeth (al-Tabari 8/121). Al-Zubayr ibn al-'Awwam killed
 * Marhab's brother Yasir. The wall of al-Qamus crumbled and Banu
 * Abi al-Huqayq submitted.
 *
 * Al-Watih and al-Sulalim then surrendered on terms personally
 * negotiated by the Prophet ﷺ with Ibn Abi al-Huqayq: the Khaybari
 * Jews would tend the land for half its produce, with the right of
 * expulsion reserved to the Prophet ﷺ. This was the first muzara'a
 * sharecropping covenant in Islamic jurisprudence (Ibn Hisham via
 * Guillaume pp. 145–146).
 *
 * Three closing events sealed the day. Zaynab bint al-Harith
 * presented a roasted poisoned sheep; the meat itself spoke and the
 * Prophet ﷺ said: «ارْفَعُوا أَيْدِيَكُمْ، فَإِنَّهَا أَخْبَرَتْنِي
 * أَنَّهَا مَسْمُومَةٌ» — Bishr ibn al-Bara' died of his portion
 * (Bukhari 4249; Abu Dawud 4512). The Prophet ﷺ freed Safiyya bint
 * Huyayy and married her, her freedom serving as her mahr; the walima
 * of hais (dates, clarified butter, sawiq) was held at Sadd al-Sahba
 * (Bukhari 371, 2228; Muslim 1365). And on the very day of conquest
 * Ja'far ibn Abi Talib returned from Abyssinia; the Prophet ﷺ embraced
 * him and said: «مَا أَدْرِي بِأَيِّهِمَا أَنَا أَفْرَحُ، بِفَتْحِ
 * خَيْبَرَ أَمْ بِقُدُومِ جَعْفَرٍ» (al-Mustadrak; Bukhari 4230–4233).
 *
 * Khaybar broke the last organised Jewish power in the Hejaz,
 * fulfilled the Surat al-Fath promise, financed the Muhajirun for
 * the first time, and produced fixed fiqh rulings — including the
 * prohibitions of mut'a marriage and the meat of domestic donkeys,
 * both pronounced on the Day of Khaybar. Within eighteen months
 * the road to Mecca was open.
 *
 * Sources: al-Bukhari, Sahih (Kitab al-Maghazi: 2945, 4197, 4209–4210,
 *          4230–4233, 4249, 371, 2228); Muslim, Sahih (1807a, 1365);
 *          Ibn Hisham, as-Sirah an-Nabawiyyah 2/328–352; al-Waqidi,
 *          Kitab al-Maghazi 2/634–699; at-Tabari, Tarikh vol. 8;
 *          Ibn Sa'd, at-Tabaqat. Surat al-Fath 18–21 was revealed
 *          in connection with this campaign.
 */
export const battleOfKhaybar: BattleScenario = {
  id: 'battle-of-khaybar',
  name: 'Battle of Khaybar',
  nameAr: 'غزوة خيبر',
  date: 'Muharram 7 AH (May–June 628 CE)',
  location: 'Khaybar oasis, in the basalt lava field of Harrat Khaybar, ~150 km north-northwest of Medina',
  description:
    "The conquest of Khaybar — the last organised Jewish stronghold in the Hejaz. The Prophet ﷺ marched with ~1,400 of the Pledgers of al-Ridwan and ~200 horse. He encamped at al-Raji', cutting Khaybar from Ghatafan; the 4,000-strong Ghatafan reinforcement turned back. At dawn the farmers fled into their forts and the Prophet ﷺ raised the takbir: 'Allahu Akbar! Khaybar is destroyed.' Eight fortresses fell over twenty-two days in three districts: al-Natat (Na'im — where Mahmud ibn Maslama was killed by a millstone; al-Sa'b ibn Mu'adh after al-Hubab's counsel relocated the camp; Qal'at al-Zubayr after the qanat tunnels were severed); al-Shiqq (Ubayy and al-Nizar in succession); and al-Katiba — climaxing in al-Qamus. After Abu Bakr and 'Umar each returned without decisive victory, the Prophet ﷺ pledged the banner: 'Tomorrow I will give it to a man whom Allah and His Messenger love' (Bukhari 4209–4210). 'Ali was summoned, suffering ramad; the Prophet ﷺ spat into his eyes — instant healing. Marhab the champion fell to 'Ali's cleaving blow after 'Amir ibn al-Akwa' had been killed by his own recoiling sword and granted his reward twice over (Muslim 1807a). Al-Watih and al-Sulalim surrendered on the first muzara'a half-produce treaty. The day closed with three vignettes: the poisoned sheep that informed the Prophet ﷺ before he ate; the freeing and marriage of Safiyya bint Huyayy; and the arrival of Ja'far ibn Abi Talib from Abyssinia, of whom the Prophet ﷺ said: 'I do not know which delights me more — the conquest of Khaybar or the arrival of Ja'far.' 18 Muslim martyrs; ~93 of Khaybar's fighters fell. Khaybar fulfilled Q 48:18–20, financed the Muhajirun for the first time, and opened the road to Mecca within eighteen months.",
  descriptionAr:
    'فَتْحُ خَيْبَرَ — آخِرُ مَعْقِلٍ يَهُودِيٍّ مُنَظَّمٍ فِي الحِجَازِ. خَرَجَ النَّبِيُّ ﷺ بِأَلْفٍ وَأَرْبَعِمِئَةٍ مِنْ أَهْلِ بَيْعَةِ الرِّضْوَانِ وَقَرَابَةِ مِئَتَيْ فَارِسٍ، فَنَزَلَ بِوَادِي الرَّجِيعِ فَجَعَلَ نَفْسَهُ بَيْنَ خَيْبَرَ وَغَطَفَانَ، فَأَحْجَمَتْ غَطَفَانُ عَنْ نَجْدَتِهَا. فَلَمَّا أَصْبَحَ خَرَجَ أَهْلُ خَيْبَرَ بِمَسَاحِيهِمْ يَصْرُخُونَ: «مُحَمَّدٌ وَاللَّهِ، مُحَمَّدٌ وَالخَمِيسُ»، فَرَفَعَ ﷺ يَدَيْهِ وَقَالَ: «اللَّهُ أَكْبَرُ، خَرِبَتْ خَيْبَرُ، إِنَّا إِذَا نَزَلْنَا بِسَاحَةِ قَوْمٍ فَسَاءَ صَبَاحُ المُنْذَرِينَ». تَتَابَعَتِ الحُصُونُ الثَّمَانِيَةُ سُقُوطًا فِي ثَلَاثِ نَوَاحٍ: النَّطَاةُ — فَتْحُ نَاعِمٍ وَاسْتِشْهَادُ مَحْمُودِ بنِ مَسْلَمَةَ تَحْتَ سُورِهِ بِرَحًى أُلْقِيَتْ مِنَ الأَعْلَى، ثُمَّ الصَّعْبُ بنُ مُعَاذٍ بَعْدَ مَشُورَةِ الحُبَابِ بنِ المُنْذِرِ بِنَقْلِ المُعَسْكَرِ، ثُمَّ قَلْعَةُ الزُّبَيْرِ بَعْدَ قَطْعِ مَجَارِي المَاءِ. ثُمَّ الشِّقُّ — أُبَيٌّ وَالنِّزَارُ. ثُمَّ الكَتِيبَةُ، وَفِيهَا القَمُوصُ مَعْقِلُ بَنِي أَبِي الحُقَيْقِ. وَلَمَّا تَأَخَّرَ الفَتْحُ قَالَ ﷺ: «لَأُعْطِيَنَّ هَذِهِ الرَّايَةَ غَدًا رَجُلًا يَفْتَحُ اللَّهُ عَلَى يَدَيْهِ، يُحِبُّ اللَّهَ وَرَسُولَهُ، وَيُحِبُّهُ اللَّهُ وَرَسُولُهُ». فَدُعِيَ عَلِيٌّ وَهُوَ يَشْتَكِي عَيْنَيْهِ، فَبَصَقَ ﷺ فِيهِمَا فَبَرَأَ مِنْ سَاعَتِهِ، فَأَعْطَاهُ الرَّايَةَ. وَخَرَجَ مَرْحَبٌ مُرْتَجِزًا فَقَتَلَ عَامِرَ بنَ الأَكْوَعِ بِسَيْفِهِ المُرْتَدِّ، فَقَالَ ﷺ: «بَلْ لَهُ أَجْرُهُ مَرَّتَيْنِ». ثُمَّ بَرَزَ عَلِيٌّ مُرْتَجِزًا: «أَنَا الَّذِي سَمَّتْنِي أُمِّي حَيْدَرَهْ» فَفَلَقَ هَامَتَهُ، وَقَتَلَ الزُّبَيْرُ يَاسِرًا أَخَاهُ، فَتَدَاعَى القَمُوصُ. ثُمَّ صَالَحَ ﷺ أَهْلَ الوَطِيحِ وَالسُّلَالِمِ عَلَى نِصْفِ ثَمَرِ الأَرْضِ — فَكَانَتْ أَوَّلَ مُزَارَعَةٍ فِي الإِسْلَامِ. وَخُتِمَ اليَوْمُ بِشَاةِ السُّمِّ — أَخْبَرَتْهُ الذِّرَاعُ بِنَفْسِهَا — وَبِعِتْقِ صَفِيَّةَ بِنْتِ حُيَيٍّ وَتَزَوُّجِهَا، وَبِقُدُومِ جَعْفَرِ بنِ أَبِي طَالِبٍ مِنَ الحَبَشَةِ يَوْمَ الفَتْحِ، فَقَالَ ﷺ: «مَا أَدْرِي بِأَيِّهِمَا أَنَا أَفْرَحُ، بِفَتْحِ خَيْبَرَ أَمْ بِقُدُومِ جَعْفَرٍ». اسْتُشْهِدَ ثَمَانِيَةَ عَشَرَ مِنَ المُسْلِمِينَ، وَقُتِلَ مِنْ أَهْلِ خَيْبَرَ نَحْوُ ثَلَاثَةٍ وَتِسْعِينَ. حَقَّقَتْ خَيْبَرُ وَعْدَ سُورَةِ الفَتْحِ، وَأَغْنَتْ المُهَاجِرِينَ لِأَوَّلِ مَرَّةٍ، وَفَتَحَتِ الطَّرِيقَ إِلَى مَكَّةَ.',

  // Dawn arrival per Bukhari 2945. The campaign opens at first light.
  dayPhase: 'dawn',
  weather: 'clear',
  // ~22 days of siege compressed into 68 simulation seconds.
  actualDayCount: 22,

  map: {
    width: 1600,
    height: 1100,
    terrain: [
      // Base plain — broken cinder ground
      {
        id: 'khaybar-plain',
        type: 'rocky',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x3a2c1e,
        label: 'حَرَّةُ خَيْبَرَ',
      },
      // Outer harrat — the volcanic basalt lava field encircling the oasis
      {
        id: 'harrat-north',
        type: 'mountain',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 90 },
          { x: 0, y: 90 },
        ],
        color: 0x1f1610,
      },
      {
        id: 'harrat-south',
        type: 'mountain',
        polygon: [
          { x: 0, y: 1010 },
          { x: 1600, y: 1010 },
          { x: 1600, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x1f1610,
      },
      {
        id: 'harrat-west',
        type: 'mountain',
        polygon: [
          { x: 0, y: 90 },
          { x: 110, y: 90 },
          { x: 110, y: 1010 },
          { x: 0, y: 1010 },
        ],
        color: 0x1f1610,
      },
      {
        id: 'harrat-east',
        type: 'mountain',
        polygon: [
          { x: 1490, y: 90 },
          { x: 1600, y: 90 },
          { x: 1600, y: 1010 },
          { x: 1490, y: 1010 },
        ],
        color: 0x1f1610,
      },
      // Date-palm groves — al-Natat district (north-east)
      {
        id: 'palm-groves-natat',
        type: 'oasis',
        polygon: [
          { x: 870, y: 320 },
          { x: 1240, y: 320 },
          { x: 1240, y: 540 },
          { x: 870, y: 540 },
        ],
        color: 0x2d4a1d,
        label: 'نَخِيلُ النَّطَاةِ',
      },
      // Date-palm groves — al-Katiba district (south-west)
      {
        id: 'palm-groves-katiba',
        type: 'oasis',
        polygon: [
          { x: 230, y: 700 },
          { x: 700, y: 700 },
          { x: 700, y: 880 },
          { x: 230, y: 880 },
        ],
        color: 0x2d4a1d,
        label: 'نَخِيلُ الكَتِيبَةِ',
      },
      // Wadi al-Raji' — Muslim encampment, between Khaybar and Ghatafan
      {
        id: 'wadi-raji',
        type: 'flat',
        polygon: [
          { x: 720, y: 720 },
          { x: 920, y: 720 },
          { x: 920, y: 850 },
          { x: 720, y: 850 },
        ],
        color: 0x6b5430,
        label: 'وَادِي الرَّجِيعِ',
      },
      // Ghatafan road — south-east edge, the path the reinforcement turned back on
      {
        id: 'ghatafan-road',
        type: 'sand',
        polygon: [
          { x: 1300, y: 880 },
          { x: 1490, y: 880 },
          { x: 1490, y: 990 },
          { x: 1300, y: 990 },
        ],
        color: 0x7a6440,
        label: 'طَرِيقُ غَطَفَانَ',
      },
      // ─── al-Natat district forts (NE) ───
      {
        id: 'fortress-naim',
        type: 'fortress_wall',
        polygon: [
          { x: 920, y: 420 },
          { x: 1020, y: 420 },
          { x: 1020, y: 510 },
          { x: 920, y: 510 },
        ],
        color: 0x6e5a44,
        label: 'حِصْنُ نَاعِمٍ',
      },
      {
        id: 'fortress-sab',
        type: 'fortress_wall',
        polygon: [
          { x: 1020, y: 320 },
          { x: 1140, y: 320 },
          { x: 1140, y: 420 },
          { x: 1020, y: 420 },
        ],
        color: 0x6e5a44,
        label: 'حِصْنُ الصَّعْبِ',
      },
      {
        id: 'fortress-zubayr',
        type: 'fortress_wall',
        polygon: [
          { x: 1140, y: 420 },
          { x: 1240, y: 420 },
          { x: 1240, y: 510 },
          { x: 1140, y: 510 },
        ],
        color: 0x6e5a44,
        label: 'قَلْعَةُ الزُّبَيْرِ',
      },
      // ─── al-Shiqq district forts (centre) ───
      {
        id: 'fortress-ubayy',
        type: 'fortress_wall',
        polygon: [
          { x: 770, y: 500 },
          { x: 870, y: 500 },
          { x: 870, y: 580 },
          { x: 770, y: 580 },
        ],
        color: 0x6e5a44,
        label: 'حِصْنُ أُبَيٍّ',
      },
      {
        id: 'fortress-nizar',
        type: 'fortress_wall',
        polygon: [
          { x: 660, y: 580 },
          { x: 760, y: 580 },
          { x: 760, y: 660 },
          { x: 660, y: 660 },
        ],
        color: 0x6e5a44,
        label: 'حِصْنُ النِّزَارِ',
      },
      // ─── al-Katiba district forts (SW) — al-Qamus is the climactic stronghold ───
      {
        id: 'fortress-qamus',
        type: 'fortress_wall',
        polygon: [
          { x: 420, y: 700 },
          { x: 540, y: 700 },
          { x: 540, y: 800 },
          { x: 420, y: 800 },
        ],
        color: 0x5e4d39,
        label: 'حِصْنُ القَمُوصِ',
      },
      {
        id: 'fortress-watih',
        type: 'fortress_wall',
        polygon: [
          { x: 280, y: 770 },
          { x: 380, y: 770 },
          { x: 380, y: 850 },
          { x: 280, y: 850 },
        ],
        color: 0x6e5a44,
        label: 'حِصْنُ الوَطِيحِ',
      },
      {
        id: 'fortress-sulalim',
        type: 'fortress_wall',
        polygon: [
          { x: 510, y: 800 },
          { x: 610, y: 800 },
          { x: 610, y: 870 },
          { x: 510, y: 870 },
        ],
        color: 0x6e5a44,
        label: 'حِصْنُ السُّلَالِمِ',
      },
    ],
    landmarks: [
      {
        id: 'valley-raji',
        position: { x: 820, y: 770 },
        type: 'camp',
        label: "Wadi al-Raji' — Muslim Camp",
        labelAr: 'وَادِي الرَّجِيعِ — مُعَسْكَرُ المُسْلِمِينَ',
      },
      {
        id: 'natat-marker',
        position: { x: 1080, y: 380 },
        type: 'marker',
        label: 'al-Natat District',
        labelAr: 'نَاحِيَةُ النَّطَاةِ',
      },
      {
        id: 'shiqq-marker',
        position: { x: 770, y: 580 },
        type: 'marker',
        label: 'al-Shiqq District',
        labelAr: 'نَاحِيَةُ الشِّقِّ',
      },
      {
        id: 'katiba-marker',
        position: { x: 470, y: 770 },
        type: 'marker',
        label: 'al-Katiba District',
        labelAr: 'نَاحِيَةُ الكَتِيبَةِ',
      },
      {
        id: 'ghatafan-road-marker',
        position: { x: 1400, y: 940 },
        type: 'mountain_pass',
        label: 'Ghatafan Road',
        labelAr: 'طَرِيقُ غَطَفَانَ',
      },
      {
        id: 'qamus-gate',
        position: { x: 480, y: 750 },
        type: 'marker',
        label: 'Gate of al-Qamus',
        labelAr: 'بَابُ القَمُوصِ',
      },
    ],
    backgroundColor: 0x140c08,
  },

  forces: [
    // ─── Muslim Forces (~1,400 plus ~200 horse) ───────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 1600,
      units: [
        {
          // The Prophet's command group with the al-Uqab banner
          id: 'prophet-command',
          name: "The Prophet's Command (al-Uqab)",
          nameAr: 'كَتِيبَةُ رَسُولِ اللَّهِ ﷺ وَرَايَةُ العُقَابِ',
          troopType: 'command',
          soldierCount: 60,
          commander: 'النَّبِيُّ مُحَمَّدٌ ﷺ',
          startPosition: { x: 820, y: 770 },
          startFormation: 'defensive_circle',
          startFacing: 0,
          stats: { attack: 8, defense: 10, speed: 6, morale: 10 },
        },
        {
          // 'Ali — banner-bearer of the climactic assault on al-Qamus
          id: 'ali-banner',
          name: "'Ali's Banner Reserve",
          nameAr: 'كَتِيبَةُ حَامِلِ الرَّايَةِ عَلِيِّ بنِ أَبِي طَالِبٍ',
          troopType: 'heavy_cavalry',
          soldierCount: 80,
          commander: 'عَلِيُّ بنُ أَبِي طَالِبٍ',
          startPosition: { x: 850, y: 770 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 10, defense: 9, speed: 8, morale: 10 },
        },
        {
          // Muhajirun — Abu Bakr's first-day standard
          id: 'muhajirun-vanguard',
          name: 'Muhajirun Vanguard',
          nameAr: 'كَتِيبَةُ المُهَاجِرِينَ',
          troopType: 'infantry',
          soldierCount: 250,
          commander: 'أَبُو بَكْرٍ الصِّدِّيقُ',
          startPosition: { x: 790, y: 740 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // 'Umar's detachment — the second-day standard at al-Qamus
          id: 'umar-detachment',
          name: "'Umar's Detachment",
          nameAr: 'كَتِيبَةُ عُمَرَ بنِ الخَطَّابِ',
          troopType: 'infantry',
          soldierCount: 220,
          commander: 'عُمَرُ بنُ الخَطَّابِ',
          startPosition: { x: 870, y: 740 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 8, speed: 5, morale: 10 },
        },
        {
          // Ansar of the Aws under Usayd ibn Hudayr
          id: 'ansar-aws',
          name: 'Ansar of the Aws',
          nameAr: 'كَتِيبَةُ الأَنْصَارِ مِنَ الأَوْسِ',
          troopType: 'infantry',
          soldierCount: 280,
          commander: 'أُسَيْدُ بنُ حُضَيْرٍ',
          startPosition: { x: 830, y: 720 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // Khazraj under al-Hubab ibn al-Mundhir, the tactician of al-Sa'b
          id: 'ansar-khazraj',
          name: 'Ansar of the Khazraj',
          nameAr: 'كَتِيبَةُ الأَنْصَارِ مِنَ الخَزْرَجِ',
          troopType: 'infantry',
          soldierCount: 280,
          commander: 'الحُبَابُ بنُ المُنْذِرِ',
          startPosition: { x: 800, y: 720 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // The horse — al-Zubayr, who killed Yasir at al-Qamus
          id: 'muslim-cavalry',
          name: 'Muslim Cavalry',
          nameAr: 'كَتِيبَةُ خَيْلِ المُسْلِمِينَ',
          troopType: 'cavalry',
          soldierCount: 200,
          commander: 'الزُّبَيْرُ بنُ العَوَّامِ',
          startPosition: { x: 900, y: 740 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 9, defense: 7, speed: 9, morale: 10 },
        },
        {
          // Banu Aslam skirmishers — Salama narrates the Marhab duel (Muslim 1807a)
          id: 'akwa-skirmishers',
          name: 'Banu Aslam Skirmishers',
          nameAr: 'كَتِيبَةُ بَنِي أَسْلَمَ',
          troopType: 'infantry',
          soldierCount: 120,
          commander: 'سَلَمَةُ بنُ الأَكْوَعِ',
          startPosition: { x: 770, y: 760 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 8, defense: 6, speed: 8, morale: 10 },
        },
        {
          // Banu 'Abd al-Ashhal — Mahmud killed by the millstone at Na'im
          id: 'maslama-clan',
          name: "Banu 'Abd al-Ashhal",
          nameAr: 'كَتِيبَةُ بَنِي عَبْدِ الأَشْهَلِ',
          troopType: 'infantry',
          soldierCount: 110,
          commander: 'مُحَمَّدُ بنُ مَسْلَمَةَ',
          startPosition: { x: 800, y: 750 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // Muslim archers — most fighting was distant arrow exchange
          id: 'muslim-archers',
          name: 'Muslim Archers',
          nameAr: 'كَتِيبَةُ الرُّمَاةِ',
          troopType: 'archers',
          soldierCount: 150,
          commander: 'سَعْدُ بنُ عُبَادَةَ',
          startPosition: { x: 840, y: 720 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 5, speed: 5, morale: 10 },
        },
        {
          // Rear-guard reserves under Abu Dharr
          id: 'rear-reserves',
          name: "Rear Reserves under Abu Dharr",
          nameAr: 'كَتِيبَةُ السَّاقَةِ',
          troopType: 'reserves',
          soldierCount: 100,
          commander: 'أَبُو ذَرٍّ الغِفَارِيُّ',
          startPosition: { x: 820, y: 810 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
      ],
    },

    // ─── Khaybari Forces (~10,000 garrison total, fragmented across 8 forts) ──
    {
      faction: 'jewish_tribes',
      label: 'Khaybari Forces',
      labelAr: 'جَيْشُ خَيْبَرَ',
      totalStrength: 10000,
      units: [
        {
          // Marhab the champion — Yemeni Jewish warrior, killed by 'Ali at al-Qamus
          id: 'marhab-champion',
          name: 'Marhab the Champion',
          nameAr: 'كَتِيبَةُ مَرْحَبٍ اليَهُودِيِّ',
          troopType: 'heavy_cavalry',
          soldierCount: 90,
          commander: 'مَرْحَبُ بنُ الحَارِثِ',
          startPosition: { x: 470, y: 730 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 8, morale: 9 },
        },
        {
          // Kinana ibn al-Rabi' — overall war-chief, treasurer of Banu al-Nadir
          id: 'kinana-katiba',
          name: "Kinana ibn al-Rabi's Command",
          nameAr: 'كَتِيبَةُ كِنَانَةَ بنِ الرَّبِيعِ',
          troopType: 'command',
          soldierCount: 70,
          commander: 'كِنَانَةُ بنُ الرَّبِيعِ بنِ أَبِي الحُقَيْقِ',
          startPosition: { x: 470, y: 760 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 8, speed: 6, morale: 8 },
        },
        {
          // Sallam ibn Mishkam — initial chief, dies of illness early in the siege
          id: 'sallam-mishkam',
          name: "Sallam ibn Mishkam (early chief)",
          nameAr: 'كَتِيبَةُ سَلَّامِ بنِ مِشْكَمٍ',
          troopType: 'command',
          soldierCount: 60,
          commander: 'سَلَّامُ بنُ مِشْكَمٍ',
          startPosition: { x: 1080, y: 380 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 7, speed: 5, morale: 7 },
        },
        {
          // Defenders of Hisn Na'im — first to fall
          id: 'naim-defenders',
          name: "Defenders of Hisn Na'im",
          nameAr: 'كَتِيبَةُ مُدَافِعِي حِصْنِ نَاعِمٍ',
          troopType: 'infantry',
          soldierCount: 320,
          commander: 'الحَارِثُ أَخُو مَرْحَبٍ',
          startPosition: { x: 970, y: 460 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 4, morale: 7 },
        },
        {
          // Defenders of al-Sa'b ibn Mu'adh — the food-store fortress
          id: 'sab-defenders',
          name: "Defenders of al-Sa'b ibn Mu'adh",
          nameAr: 'كَتِيبَةُ مُدَافِعِي حِصْنِ الصَّعْبِ',
          troopType: 'infantry',
          soldierCount: 300,
          commander: 'أُسَيْرُ بنُ رِزَامٍ',
          startPosition: { x: 1080, y: 370 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 4, morale: 7 },
        },
        {
          // Defenders of Qal'at al-Zubayr — water-cut into surrender
          id: 'zubayr-fort-defenders',
          name: "Defenders of Qal'at al-Zubayr",
          nameAr: 'كَتِيبَةُ مُدَافِعِي قَلْعَةِ الزُّبَيْرِ',
          troopType: 'infantry',
          soldierCount: 220,
          commander: 'يَاسِرٌ أَخُو مَرْحَبٍ',
          startPosition: { x: 1190, y: 460 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 4, morale: 7 },
        },
        {
          // Defenders of al-Shiqq district forts (Ubayy and al-Nizar)
          id: 'shiqq-defenders',
          name: "Defenders of al-Shiqq",
          nameAr: 'كَتِيبَةُ مُدَافِعِي حُصُونِ الشِّقِّ',
          troopType: 'infantry',
          soldierCount: 380,
          commander: 'غَزَالُ بنُ سَمَوْءَلَ',
          startPosition: { x: 770, y: 580 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 6 },
        },
        {
          // Garrison of al-Qamus — climactic stronghold, 13–19 days
          id: 'qamus-garrison',
          name: 'al-Qamus Garrison',
          nameAr: 'كَتِيبَةُ حَامِيَةِ القَمُوصِ',
          troopType: 'infantry',
          soldierCount: 450,
          commander: 'كِنَانَةُ بنُ الرَّبِيعِ',
          startPosition: { x: 480, y: 750 },
          startFormation: 'defensive_circle',
          startFacing: 0,
          stats: { attack: 8, defense: 9, speed: 4, morale: 8 },
        },
        {
          // Khaybari archers on the walls
          id: 'jewish-archers',
          name: 'Khaybari Archers',
          nameAr: 'كَتِيبَةُ رُمَاةِ يَهُودَ',
          troopType: 'archers',
          soldierCount: 260,
          commander: 'نَافِعُ بنُ أَبِي الحُقَيْقِ',
          startPosition: { x: 1100, y: 420 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 5, speed: 4, morale: 7 },
        },
        {
          // Khaybari cavalry
          id: 'khaybar-cavalry',
          name: 'Khaybari Cavalry',
          nameAr: 'كَتِيبَةُ خَيْلِ خَيْبَرَ',
          troopType: 'cavalry',
          soldierCount: 180,
          commander: 'رَبِيعُ بنُ أَبِي الحُقَيْقِ',
          startPosition: { x: 1000, y: 380 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 7 },
        },
        {
          // Siege engineers — catapult and mangonel operators (Waqidi)
          id: 'siege-engineers',
          name: 'Khaybari Siege Engineers',
          nameAr: 'كَتِيبَةُ آلَاتِ الحِصَارِ اليَهُودِيَّةِ',
          troopType: 'siege_engineer',
          soldierCount: 90,
          commander: 'هَوْذَةُ بنُ قَيْسٍ',
          startPosition: { x: 1080, y: 470 },
          startFormation: 'scattered',
          startFacing: Math.PI / 2,
          stats: { attack: 5, defense: 5, speed: 3, morale: 6 },
        },
        {
          // Defenders of al-Watih and al-Sulalim — the muzara'a surrender
          id: 'watih-sulalim-defenders',
          name: "Defenders of al-Watih and al-Sulalim",
          nameAr: 'كَتِيبَةُ مُدَافِعِي الوَطِيحِ وَالسُّلَالِمِ',
          troopType: 'reserves',
          soldierCount: 280,
          commander: 'ابْنُ أَبِي الحُقَيْقِ',
          startPosition: { x: 450, y: 810 },
          startFormation: 'defensive_circle',
          startFacing: 0,
          stats: { attack: 6, defense: 8, speed: 4, morale: 6 },
        },
      ],
    },
  ],

  phases: [
    // Phase 1 (0–6s): March from Medina + cutting Ghatafan.
    {
      id: 'phase-01-march-from-medina',
      name: 'March from Medina & Cutting Ghatafan',
      nameAr: 'المَسِيرُ مِنَ المَدِينَةِ وَعَزْلُ غَطَفَانَ',
      startTime: 0,
      duration: 6,
      description:
        "Muharram 7 AH: the Prophet ﷺ marches the ~150 km north-northwest from Medina with 1,400–1,600 men (the Hudaybiyya pledgers per Q 48:18–20) and ~200 horse. He encamps at Wadi al-Raji', deliberately interposing the army between Khaybar and Ghatafan country to sever the 4,000-strong Ghatafan reinforcement (al-Tabari 8/116).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 550, zoom: 0.45, duration: 3 }, delay: 0 },
        { type: 'camera_move', params: { x: 720, y: 760, zoom: 0.7, duration: 3 }, delay: 3 },
        { type: 'change_formation', targetUnitId: 'muhajirun-vanguard', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'umar-detachment', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'ansar-aws', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'ansar-khazraj', params: { formation: 'column' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'glow', position: { x: 1400, y: 940 }, color: 0xff7755 }, delay: 2 },
        { type: 'play_effect', params: { effect: 'glow-dim', position: { x: 1400, y: 940 } }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 2 (6–11s): Dawn over Khaybar; the takbir.
    {
      id: 'phase-02-dawn-takbir',
      name: 'Dawn over Khaybar & the Takbir',
      nameAr: 'الفَجْرُ عَلَى خَيْبَرَ وَتَكْبِيرُ النَّبِيِّ ﷺ',
      startTime: 6,
      duration: 5,
      description:
        "Dawn arrival at the oasis: the Khaybari farmers emerge with their masahi shouting 'Muhammad wal-khamis!' and flee into their forts. The Prophet ﷺ raises both hands in takbir: 'Allahu Akbar! Khaybar is destroyed' (Bukhari 2945, 4197).",
      actions: [
        { type: 'camera_move', params: { x: 850, y: 600, zoom: 0.85, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'sunrise', position: { x: 800, y: 90 } }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'banner-raise', targetUnitId: 'prophet-command', label: 'العُقَابُ' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'prophet-command', params: { formation: 'line' }, delay: 2 },
      ],
      triggers: [],
    },

    // Phase 3 (11–17s): Hisn Na'im falls; Mahmud ibn Maslama martyred.
    {
      id: 'phase-03-naim-fall-mahmud-martyrdom',
      name: "Na'im Falls — Mahmud ibn Maslama's Martyrdom",
      nameAr: 'فَتْحُ حِصْنِ نَاعِمٍ وَاسْتِشْهَادُ مَحْمُودِ بنِ مَسْلَمَةَ',
      startTime: 11,
      duration: 6,
      description:
        "The first fortress of al-Natat reduced. Mahmud ibn Maslama killed by a millstone dropped from the wall. Al-Harith brother of Marhab emerges in a sortie and is slain by Muhammad ibn Maslama in vengeance for his brother (Ibn Hisham 2/331).",
      actions: [
        { type: 'camera_move', params: { x: 970, y: 480, zoom: 0.8, duration: 2 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'maslama-clan', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'maslama-clan', params: { position: { x: 950, y: 540 }, speed: 70 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-archers', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-archers', params: { position: { x: 970, y: 580 }, speed: 60 }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'maslama-clan', params: { formation: 'wedge' }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'millstone-arc', from: { x: 970, y: 460 }, to: { x: 950, y: 540 } }, delay: 2 },
        { type: 'play_effect', params: { effect: 'casualty-marker', targetUnitId: 'maslama-clan', label: 'مَحْمُودُ بنُ مَسْلَمَةَ' }, delay: 2.5 },
        { type: 'set_behavior', targetUnitId: 'naim-defenders', params: { behavior: 'attacking' }, delay: 3 },
        { type: 'move_unit', targetUnitId: 'naim-defenders', params: { position: { x: 970, y: 530 }, speed: 60 }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'maslama-clan', params: { targetId: 'naim-defenders' }, delay: 3.8 },
        { type: 'attack_unit', targetUnitId: 'muslim-archers', params: { targetId: 'naim-defenders' }, delay: 3.8 },
        { type: 'destroy_unit', targetUnitId: 'naim-defenders', params: { cause: 'fortress-fell' }, delay: 5 },
        { type: 'play_effect', params: { effect: 'banner-raise', position: { x: 970, y: 470 } }, delay: 5.3 },
      ],
      triggers: [],
    },

    // Phase 4 (17–22s): al-Hubab's counsel + Hisn al-Sa'b falls.
    {
      id: 'phase-04-sab-camp-relocation',
      name: "Al-Hubab's Counsel & Hisn al-Sa'b",
      nameAr: 'نَصِيحَةُ الحُبَابِ وَفَتْحُ حِصْنِ الصَّعْبِ',
      startTime: 17,
      duration: 5,
      description:
        "Al-Hubab ibn al-Mundhir counsels relocating the camp away from arrow range and the malarial low-ground (al-Waqidi). Hisn al-Sa'b ibn Mu'adh — the granary of the oasis — falls in three days. Sallam ibn Mishkam dies of illness during this stretch.",
      actions: [
        { type: 'camera_move', params: { x: 1050, y: 460, zoom: 0.75, duration: 2 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'ansar-khazraj', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ansar-khazraj', params: { position: { x: 1030, y: 450 }, speed: 60 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'ansar-aws', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ansar-aws', params: { position: { x: 1130, y: 450 }, speed: 60 }, delay: 0.5 },
        { type: 'attack_unit', targetUnitId: 'ansar-khazraj', params: { targetId: 'sab-defenders' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'ansar-aws', params: { targetId: 'sab-defenders' }, delay: 2 },
        { type: 'destroy_unit', targetUnitId: 'sallam-mishkam', params: { cause: 'died-of-illness' }, delay: 3 },
        { type: 'destroy_unit', targetUnitId: 'sab-defenders', params: { cause: 'fortress-fell' }, delay: 4 },
        { type: 'play_effect', params: { effect: 'banner-raise', position: { x: 1080, y: 370 } }, delay: 4.3 },
      ],
      triggers: [],
    },

    // Phase 5 (22–26s): Qal'at al-Zubayr — water cut.
    {
      id: 'phase-05-zubayr-fort-water-cut',
      name: "Qal'at al-Zubayr — The Water Cut",
      nameAr: 'قَلْعَةُ الزُّبَيْرِ وَقَطْعُ المَاءِ',
      startTime: 22,
      duration: 4,
      description:
        "Third fortress of al-Natat. The Muslims trace the qanat tunnels to the springs and sever the water supply, forcing surrender (al-Tabari; Vaglieri).",
      actions: [
        { type: 'camera_move', params: { x: 1190, y: 470, zoom: 0.9, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'qanat-cross-section', position: { x: 1190, y: 470 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'water-cut', position: { x: 1190, y: 470 } }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'zubayr-fort-defenders', params: { formation: 'scattered' }, delay: 2.5 },
        { type: 'destroy_unit', targetUnitId: 'zubayr-fort-defenders', params: { cause: 'water-cut-surrender' }, delay: 3.2 },
        { type: 'play_effect', params: { effect: 'banner-raise', position: { x: 1190, y: 460 } }, delay: 3.5 },
      ],
      triggers: [],
    },

    // Phase 6 (26–30s): al-Shiqq forts fall.
    {
      id: 'phase-06-shiqq-falls',
      name: "al-Shiqq Falls — Ubayy and al-Nizar",
      nameAr: 'سُقُوطُ حُصُونِ الشِّقِّ',
      startTime: 26,
      duration: 4,
      description:
        "After al-Natat, the forts of al-Shiqq district (Ubayy and al-Nizar) fall in succession (al-Tabari 8/117).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 580, zoom: 0.55, duration: 2 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'muslim-cavalry', params: { behavior: 'flanking' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry', params: { position: { x: 800, y: 600 }, speed: 130 }, delay: 0 },
        { type: 'change_formation', targetUnitId: 'muslim-cavalry', params: { formation: 'flank_right' }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'muslim-cavalry', params: { targetId: 'shiqq-defenders' }, delay: 1.5 },
        { type: 'attack_unit', targetUnitId: 'muhajirun-vanguard', params: { targetId: 'shiqq-defenders' }, delay: 1.5 },
        { type: 'destroy_unit', targetUnitId: 'shiqq-defenders', params: { cause: 'fortress-fell' }, delay: 3 },
        { type: 'play_effect', params: { effect: 'banner-raise', position: { x: 820, y: 540 } }, delay: 3.2 },
        { type: 'play_effect', params: { effect: 'banner-raise', position: { x: 710, y: 620 } }, delay: 3.5 },
      ],
      triggers: [],
    },

    // Phase 7 (30–35s): The night the banner is pledged.
    {
      id: 'phase-07-banner-pledge-night',
      name: 'The Night of the Banner Pledge',
      nameAr: 'لَيْلَةُ وَعْدِ الرَّايَةِ',
      startTime: 30,
      duration: 5,
      description:
        "After Abu Bakr and 'Umar each lead an assault on al-Qamus that returns without decisive victory, the Prophet ﷺ pledges: 'Tomorrow I will give the banner to a man whom Allah and His Messenger love, through whose hands Allah will grant victory' (Bukhari 4209–4210).",
      actions: [
        { type: 'camera_move', params: { x: 600, y: 720, zoom: 0.75, duration: 2 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'muhajirun-vanguard', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muhajirun-vanguard', params: { position: { x: 580, y: 720 }, speed: 80 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'muhajirun-vanguard', params: { behavior: 'retreating' }, delay: 1.8 },
        { type: 'move_unit', targetUnitId: 'muhajirun-vanguard', params: { position: { x: 790, y: 740 }, speed: 80 }, delay: 1.8 },
        { type: 'set_behavior', targetUnitId: 'umar-detachment', params: { behavior: 'advancing' }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'umar-detachment', params: { position: { x: 580, y: 740 }, speed: 80 }, delay: 2.5 },
        { type: 'set_behavior', targetUnitId: 'umar-detachment', params: { behavior: 'retreating' }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'umar-detachment', params: { position: { x: 870, y: 740 }, speed: 80 }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'lighting-dusk' }, delay: 4 },
        { type: 'play_effect', params: { effect: 'banner-glow', targetUnitId: 'prophet-command' }, delay: 4.3 },
      ],
      triggers: [],
    },

    // Phase 8 (35–39s): The eye-healing and the banner to 'Ali.
    {
      id: 'phase-08-ali-banner-eye-healing',
      name: "The Eye-Healing & Banner to 'Ali",
      nameAr: 'بَصْقَةُ الشِّفَاءِ وَتَسْلِيمُ الرَّايَةِ لِعَلِيٍّ',
      startTime: 35,
      duration: 4,
      description:
        "At dawn 'Ali ibn Abi Talib is summoned despite suffering ramad (acute conjunctivitis). The Prophet ﷺ spits into his eyes; 'Ali is healed instantly. The Prophet ﷺ gives him the banner: 'Advance calmly until you reach their courtyard, then call them to Islam' (Bukhari 4210).",
      actions: [
        { type: 'camera_move', params: { x: 600, y: 720, zoom: 0.92, duration: 2 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'ali-banner', params: { position: { x: 820, y: 770 }, speed: 90 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'eye-healing-halo', targetUnitId: 'ali-banner' }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'banner-transfer', from: { x: 820, y: 770 }, to: { x: 820, y: 770 } }, delay: 2.5 },
        { type: 'change_formation', targetUnitId: 'ali-banner', params: { formation: 'wedge' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 9 (39–43s): Marhab's rajaz; 'Amir ibn al-Akwa' falls.
    {
      id: 'phase-09-amir-rajaz-double-reward',
      name: "'Amir's Duel & the Double Reward",
      nameAr: 'مُبَارَزَةُ عَامِرٍ وَأَجْرُهُ مَرَّتَيْنِ',
      startTime: 39,
      duration: 4,
      description:
        "Marhab emerges chanting his rajaz. 'Amir ibn al-Akwa' answers with parallel rajaz; in the exchange his short sword recoils and severs his akhal — he dies of his own blow. The Prophet ﷺ rules: 'Whoever said his deed was wasted has lied — rather, he has his reward twice over' (Sahih Muslim 1807a).",
      actions: [
        { type: 'camera_move', params: { x: 500, y: 750, zoom: 0.93, duration: 2 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'ali-banner', params: { behavior: 'advancing' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'ali-banner', params: { position: { x: 600, y: 750 }, speed: 110 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'marhab-champion', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'marhab-champion', params: { position: { x: 555, y: 740 }, speed: 90 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'akwa-skirmishers', params: { behavior: 'advancing' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'akwa-skirmishers', params: { position: { x: 590, y: 750 }, speed: 90 }, delay: 1 },
        { type: 'play_effect', params: { effect: 'rajaz-calligraphy', text: 'قَدْ عَلِمَتْ خَيْبَرُ أَنِّي مَرْحَبُ' }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'sword-recoil', targetUnitId: 'akwa-skirmishers' }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'casualty-marker', targetUnitId: 'akwa-skirmishers', label: 'عَامِرُ بنُ الأَكْوَعِ' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 10 (43–50s): 'Ali kills Marhab; al-Qamus falls.
    {
      id: 'phase-10-ali-marhab-duel',
      name: "'Ali's Duel with Marhab & al-Qamus Falls",
      nameAr: 'مُبَارَزَةُ عَلِيٍّ وَمَرْحَبٍ وَفَتْحُ القَمُوصِ',
      startTime: 43,
      duration: 7,
      description:
        "'Ali advances chanting: 'I am the one my mother named Haydara, like a forest lion of fearsome aspect.' He splits Marhab's helmet and skull with one blow (al-Tabari 8/121; Sahih Muslim 1807a). Al-Zubayr ibn al-'Awwam kills Yasir, Marhab's brother. Al-Qamus falls.",
      actions: [
        { type: 'camera_move', params: { x: 500, y: 750, zoom: 0.94, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'rajaz-calligraphy', text: 'أَنَا الَّذِي سَمَّتْنِي أُمِّي حَيْدَرَهْ' }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'ali-banner', params: { targetId: 'marhab-champion' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'cleaving-strike', position: { x: 555, y: 740 } }, delay: 2.5 },
        { type: 'destroy_unit', targetUnitId: 'marhab-champion', params: { cause: 'killed-by-ali' }, delay: 3 },
        { type: 'set_behavior', targetUnitId: 'muslim-cavalry', params: { behavior: 'flanking' }, delay: 3 },
        { type: 'move_unit', targetUnitId: 'muslim-cavalry', params: { position: { x: 530, y: 720 }, speed: 130 }, delay: 3 },
        { type: 'play_effect', params: { effect: 'casualty-marker', position: { x: 530, y: 720 }, label: 'يَاسِرٌ أَخُو مَرْحَبٍ' }, delay: 4 },
        { type: 'camera_move', params: { x: 520, y: 740, zoom: 0.85, duration: 2 }, delay: 4.5 },
        { type: 'set_behavior', targetUnitId: 'ali-banner', params: { behavior: 'attacking' }, delay: 4.5 },
        { type: 'move_unit', targetUnitId: 'ali-banner', params: { position: { x: 480, y: 750 }, speed: 110 }, delay: 4.5 },
        { type: 'attack_unit', targetUnitId: 'ali-banner', params: { targetId: 'qamus-garrison' }, delay: 5.2 },
        { type: 'attack_unit', targetUnitId: 'muslim-cavalry', params: { targetId: 'qamus-garrison' }, delay: 5.5 },
        { type: 'destroy_unit', targetUnitId: 'qamus-garrison', params: { cause: 'fortress-fell' }, delay: 6.3 },
        { type: 'destroy_unit', targetUnitId: 'kinana-katiba', params: { cause: 'submitted' }, delay: 6.5 },
        { type: 'play_effect', params: { effect: 'banner-raise', position: { x: 480, y: 740 } }, delay: 6.7 },
      ],
      triggers: [],
    },

    // Phase 11 (50–56s): al-Watih and al-Sulalim — the muzara'a covenant.
    {
      id: 'phase-11-watih-sulalim-muzaraa',
      name: "al-Watih and al-Sulalim — The Muzara'a Covenant",
      nameAr: 'صُلْحُ الوَطِيحِ وَالسُّلَالِمِ وَعَهْدُ المُزَارَعَةِ',
      startTime: 50,
      duration: 6,
      description:
        "Al-Watih and al-Sulalim surrender on terms personally negotiated by the Prophet ﷺ with Ibn Abi al-Huqayq: the Khaybari Jews remain on the land for half its produce, with the right of expulsion reserved to the Prophet ﷺ. This is the first muzara'a sharecropping covenant in Islamic jurisprudence (Ibn Hisham via Guillaume pp. 145–146).",
      actions: [
        { type: 'camera_move', params: { x: 600, y: 720, zoom: 0.5, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'white-flag', position: { x: 330, y: 800 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'white-flag', position: { x: 560, y: 830 } }, delay: 1.5 },
        { type: 'change_formation', targetUnitId: 'watih-sulalim-defenders', params: { formation: 'scattered' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'watih-sulalim-defenders', params: { behavior: 'holding' }, delay: 2.5 },
        { type: 'camera_move', params: { x: 700, y: 700, zoom: 0.6, duration: 2 }, delay: 4 },
        { type: 'play_effect', params: { effect: 'palm-grove-glow', position: { x: 470, y: 790 } }, delay: 4 },
        { type: 'play_effect', params: { effect: 'treaty-overlay', label: 'المُزَارَعَةُ بِالنِّصْفِ' }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 12 (56–68s): Three closing vignettes — poisoned sheep, Safiyya's
    // freedom, Ja'far's arrival from Abyssinia.
    {
      id: 'phase-12-poisoned-sheep-safiyya-jafar',
      name: "Poisoned Sheep, Safiyya & Ja'far's Arrival",
      nameAr: 'الشَّاةُ المَسْمُومَةُ وَصَفِيَّةُ وَقُدُومُ جَعْفَرٍ',
      startTime: 56,
      duration: 12,
      description:
        "Three canonical post-conquest events: (1) Zaynab bint al-Harith's poisoned sheep — the meat itself warned the Prophet ﷺ; Bishr ibn al-Bara' died of his portion (Bukhari 4249, Abu Dawud 4512). (2) The freeing and marriage of Safiyya bint Huyayy, her freedom serving as her mahr; the walima of hais (Bukhari 371, 2228; Muslim 1365). (3) Ja'far ibn Abi Talib arrives from Abyssinia on the day of conquest; the Prophet ﷺ embraces him: 'I do not know which makes me happier — the conquest of Khaybar or the arrival of Ja'far' (al-Mustadrak; Bukhari 4230–4233).",
      actions: [
        { type: 'camera_move', params: { x: 580, y: 760, zoom: 0.78, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'gift-tray', position: { x: 560, y: 770 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'halt-gesture', targetUnitId: 'prophet-command' }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'casualty-marker', position: { x: 560, y: 770 }, label: 'بِشْرُ بنُ البَرَاءِ' }, delay: 3.5 },
        { type: 'camera_move', params: { x: 540, y: 740, zoom: 0.78, duration: 2 }, delay: 4 },
        { type: 'play_effect', params: { effect: 'walima-overlay', label: 'وَلِيمَةُ الحَيْسِ — صَدُّ الصَّهْبَاءِ' }, delay: 5 },
        { type: 'camera_move', params: { x: 700, y: 850, zoom: 0.7, duration: 2 }, delay: 7 },
        { type: 'play_effect', params: { effect: 'caravan-arrival', from: { x: 800, y: 1000 }, to: { x: 700, y: 850 }, label: 'قُدُومُ جَعْفَرٍ مِنَ الحَبَشَةِ' }, delay: 7.5 },
        { type: 'play_effect', params: { effect: 'embrace', position: { x: 720, y: 820 } }, delay: 9.5 },
        { type: 'camera_move', params: { x: 800, y: 600, zoom: 0.4, duration: 2.5 }, delay: 9.5 },
        { type: 'play_effect', params: { effect: 'all-banners-raised' }, delay: 10.5 },
      ],
      triggers: [],
    },
  ],

  narration: [
    {
      id: 'narr-01-march',
      time: 0.5,
      duration: 5,
      text: 'In Muharram of the seventh year of the Hijra, the Messenger of Allah ﷺ set out from Medina with one thousand four hundred of the Pledgers of al-Ridwan, bound for the fortresses of Khaybar in the northern Hejaz, threading the black basalt lava fields of Harrat Khaybar.',
      textAr:
        'فِي مُحَرَّمِ السَّنَةِ السَّابِعَةِ مِنَ الْهِجْرَةِ، خَرَجَ رَسُولُ اللَّهِ ﷺ مِنَ الْمَدِينَةِ بِأَلْفٍ وَأَرْبَعِمِائَةٍ مِنْ أَهْلِ بَيْعَةِ الرِّضْوَانِ، قَاصِدًا حُصُونَ خَيْبَرَ شَمَالَ الْحِجَازِ، تَتَخَلَّلُ مَسِيرَهُمْ حِرَارُ الْبَازَلْتِ السَّوْدَاءُ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-02-raji',
      time: 5.5,
      duration: 5,
      text: "He encamped at the valley of al-Raji', interposing himself between Khaybar and Ghatafan; the four thousand of Ghatafan turned back from their reinforcement — and that was the first opening of the conquest.",
      textAr:
        'وَنَزَلَ بِوَادِي الرَّجِيعِ، فَجَعَلَ نَفْسَهُ بَيْنَ خَيْبَرَ وَغَطَفَانَ، فَأَحْجَمَتْ غَطَفَانُ عَنْ نَجْدَتِهَا، وَكَانَ ذَلِكَ أَوَّلَ الْفَتْحِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-03-takbir',
      time: 11,
      duration: 5.5,
      text: "When dawn broke and the people of Khaybar emerged with their spades crying 'Muhammad, by God — Muhammad and the army!', he raised his hands and said: 'Allahu Akbar! Khaybar is destroyed. When we descend upon the courtyard of a people, evil is the morning of those who were warned.' (Bukhari 2945, 4197)",
      textAr:
        'فَلَمَّا أَصْبَحَ وَخَرَجَ أَهْلُ خَيْبَرَ بِمَسَاحِيهِمْ يَصْرُخُونَ: «مُحَمَّدٌ وَاللَّهِ، مُحَمَّدٌ وَالْخَمِيسُ»، رَفَعَ ﷺ يَدَيْهِ وَقَالَ: «اللَّهُ أَكْبَرُ، خَرِبَتْ خَيْبَرُ، إِنَّا إِذَا نَزَلْنَا بِسَاحَةِ قَوْمٍ فَسَاءَ صَبَاحُ الْمُنْذَرِينَ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-04-naim',
      time: 17,
      duration: 5,
      text: "The first of al-Natat to fall was Hisn Na'im, beneath whose wall Mahmud ibn Maslama was martyred by a millstone hurled from above; al-Harith, brother of Marhab, emerged seeking single combat and was slain by Muhammad ibn Maslama in vengeance for his brother. (Ibn Hisham 2/331)",
      textAr:
        'وَأَوَّلُ مَا فُتِحَ مِنَ النَّطَاةِ حِصْنُ نَاعِمٍ، وَاسْتُشْهِدَ تَحْتَ سُورِهِ مَحْمُودُ بْنُ مَسْلَمَةَ بِرَحًى أَلْقِيَتْ مِنَ الْأَعْلَى، فَخَرَجَ الْحَارِثُ أَخُو مَرْحَبٍ يَطْلُبُ الْبَرَازَ، فَقَتَلَهُ مُحَمَّدُ بْنُ مَسْلَمَةَ ثَأْرًا لِأَخِيهِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-05-sab-hubab',
      time: 22.5,
      duration: 4.5,
      text: "Al-Hubab ibn al-Mundhir counselled moving the camp from arrow-range and the fevered marsh; the Prophet ﷺ accepted his counsel, and after three days Hisn al-Sa'b ibn Mu'adh — the granary of the oasis — was taken. (al-Waqidi)",
      textAr:
        'وَأَشَارَ الْحُبَابُ بْنُ الْمُنْذِرِ بِنَقْلِ الْمُعَسْكَرِ مِنْ مَرْمَى السِّهَامِ وَعَفَنِ الْمَنْقَعِ، فَقَبِلَ النَّبِيُّ ﷺ نُصْحَهُ، فَفُتِحَ حِصْنُ الصَّعْبِ بْنِ مُعَاذٍ بَعْدَ ثَلَاثٍ، وَفِيهِ مِيرَةُ الْقَوْمِ وَطَعَامُهُمْ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-06-zubayr-fort',
      time: 27.5,
      duration: 3.5,
      text: "Then Qal'at al-Zubayr — its underground water-channels severed from the springs — surrendered to the sword, and the conquest of al-Natat was complete.",
      textAr:
        'ثُمَّ قَلْعَةُ الزُّبَيْرِ، فَقُطِعَتْ عَنْهُمْ مَجَارِي الْمَاءِ مِنْ تَحْتِ الْأَرْضِ، فَنَزَلُوا عَلَى حُكْمِ السَّيْفِ، وَتَمَّ فَتْحُ النَّطَاةِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-07-shiqq',
      time: 31.5,
      duration: 3,
      text: "The forts of al-Shiqq — Ubayy and al-Nizar — followed in succession like a snapped string of pearls; only al-Katiba remained, with al-Qamus, the redoubt of Banu Abi al-Huqayq.",
      textAr:
        'وَأَعْقَبَتْ حُصُونُ الشِّقِّ، أُبَيٌّ وَالنِّزَارُ، فَتَتَابَعَتْ كَالْعِقْدِ الْمُنْفَرِطِ، وَلَمْ يَبْقَ إِلَّا الْكَتِيبَةُ وَفِيهَا الْقَمُوصُ مَعْقِلُ بَنِي أَبِي الْحُقَيْقِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-08-banner-pledge',
      time: 35.5,
      duration: 5,
      text: "Conquest tarried at al-Qamus; when evening fell, the Messenger of Allah ﷺ said: 'Tomorrow I will give this banner to a man through whose hands Allah will grant victory — he loves Allah and His Messenger, and Allah and His Messenger love him.' The people spent the night turning over among themselves who would receive it. (Bukhari 4209–4210)",
      textAr:
        'وَتَأَخَّرَ الْفَتْحُ عِنْدَ الْقَمُوصِ، فَلَمَّا أَمْسَى رَسُولُ اللَّهِ ﷺ قَالَ: «لَأُعْطِيَنَّ هَذِهِ الرَّايَةَ غَدًا رَجُلًا يَفْتَحُ اللَّهُ عَلَى يَدَيْهِ، يُحِبُّ اللَّهَ وَرَسُولَهُ، وَيُحِبُّهُ اللَّهُ وَرَسُولُهُ»، فَبَاتَ النَّاسُ يَدُوكُونَ لَيْلَتَهُمْ أَيُّهُمْ يُعْطَاهَا.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-09-ali-eye',
      time: 40.5,
      duration: 4.5,
      text: "'Ali was summoned, suffering with his eyes; the Prophet ﷺ spat into them and prayed for him, and he was healed as if he had never had any pain. He gave him the banner and said: 'Advance calmly until you reach their courtyard, then call them to Islam.' (Bukhari 4210)",
      textAr:
        'فَدُعِيَ عَلِيٌّ وَهُوَ يَشْتَكِي عَيْنَيْهِ، فَبَصَقَ ﷺ فِي عَيْنَيْهِ وَدَعَا لَهُ، فَبَرَأَ حَتَّى كَأَنْ لَمْ يَكُنْ بِهِ وَجَعٌ، فَأَعْطَاهُ الرَّايَةَ، وَقَالَ: «انْفُذْ عَلَى رِسْلِكَ حَتَّى تَنْزِلَ بِسَاحَتِهِمْ، ثُمَّ ادْعُهُمْ إِلَى الْإِسْلَامِ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-10-amir',
      time: 45,
      duration: 4.5,
      text: "Their king Marhab strode forth swinging his sword and chanting: 'Khaybar knows that I am Marhab — fully armed, a tested warrior.' 'Amir ibn al-Akwa' answered him; his own sword recoiled and slew him. The Prophet ﷺ said: 'Whoever said his deed is wasted has lied — rather, he has his reward twice over.' (Sahih Muslim 1807a)",
      textAr:
        'وَخَرَجَ مَلِكُهُمْ مَرْحَبٌ يَخْطِرُ بِسَيْفِهِ مُرْتَجِزًا: «قَدْ عَلِمَتْ خَيْبَرُ أَنِّي مَرْحَبُ، شَاكِي السِّلَاحِ بَطَلٌ مُجَرَّبُ»، فَبَرَزَ لَهُ عَامِرُ بْنُ الْأَكْوَعِ، فَرَجَعَ سَيْفُهُ عَلَى نَفْسِهِ فَقُتِلَ، فَقَالَ ﷺ: «كَذَبَ مَنْ قَالَ ذَلِكَ، بَلْ لَهُ أَجْرُهُ مَرَّتَيْنِ».',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-11-ali-rajaz',
      time: 49.5,
      duration: 4.5,
      text: "Then 'Ali advanced chanting: 'I am the one my mother named Haydara, like a forest lion of fearsome aspect.' He struck Marhab's head a blow that split his skull until the sword bit into his teeth — and the conquest came at his hands. (al-Tabari 8/121)",
      textAr:
        'ثُمَّ بَرَزَ عَلِيٌّ مُرْتَجِزًا: «أَنَا الَّذِي سَمَّتْنِي أُمِّي حَيْدَرَهْ، كَلَيْثِ غَابَاتٍ كَرِيهِ الْمَنْظَرَهْ»، فَضَرَبَ رَأْسَ مَرْحَبٍ ضَرْبَةً فَلَقَتْ هَامَتَهُ حَتَّى عَضَّ السَّيْفُ بِأَضْرَاسِهِ، ثُمَّ كَانَ الْفَتْحُ عَلَى يَدَيْهِ.',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-12-qamus',
      time: 54,
      duration: 3.5,
      text: "Al-Zubayr ibn al-'Awwam slew Yasir, brother of Marhab; the wall of al-Qamus crumbled, and Banu Abi al-Huqayq submitted to the judgment of the Messenger of Allah ﷺ.",
      textAr:
        'وَقَتَلَ الزُّبَيْرُ بْنُ الْعَوَّامِ يَاسِرًا أَخَا مَرْحَبٍ، وَتَدَاعَى سُورُ الْقَمُوصِ، وَنَزَلَ بَنُو أَبِي الْحُقَيْقِ عَلَى حُكْمِ رَسُولِ اللَّهِ ﷺ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-13-muzaraa',
      time: 57.5,
      duration: 4,
      text: "He concluded peace with the people of al-Watih and al-Sulalim: they would tend the land with palms and crops, keeping half the produce, while he reserved the right to expel them when he wished — the first muzara'a sharecropping covenant in Islam. (Ibn Hisham via Guillaume pp. 145–146)",
      textAr:
        'وَصَالَحَ ﷺ أَهْلَ الْوَطِيحِ وَالسُّلَالِمِ عَلَى أَنْ يَعْمُرُوا الْأَرْضَ بِالنَّخِيلِ وَالزَّرْعِ، وَلَهُمْ نِصْفُ الثَّمَرِ، وَلَهُ ﷺ أَنْ يُخْرِجَهُمْ إِذَا شَاءَ، فَكَانَتْ أَوَّلَ مُزَارَعَةٍ فِي الْإِسْلَامِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-14-poison-safiyya-jafar',
      time: 62,
      duration: 5.5,
      text: "A Jewish woman gifted a roasted poisoned sheep; the Prophet ﷺ said: 'Lift your hands — it has informed me it is poisoned.' He freed Safiyya bint Huyayy and made her freedom her mahr; and Ja'far returned from Abyssinia, of whom the Prophet ﷺ said: 'I do not know which of the two delights me more — the conquest of Khaybar or the arrival of Ja'far.' (Bukhari 4249, 371, 4230–4233; Muslim 1365)",
      textAr:
        'وَأَهْدَتْ يَهُودِيَّةٌ شَاةً مَصْلِيَّةً سَمَّتْهَا، فَقَالَ ﷺ: «ارْفَعُوا أَيْدِيَكُمْ، فَإِنَّهَا أَخْبَرَتْنِي أَنَّهَا مَسْمُومَةٌ»، وَأَعْتَقَ صَفِيَّةَ بِنْتَ حُيَيٍّ فَجَعَلَ عِتْقَهَا صَدَاقَهَا، وَقَدِمَ جَعْفَرٌ مِنَ الْحَبَشَةِ، فَقَالَ ﷺ: «مَا أَدْرِي بِأَيِّهِمَا أَنَا أَفْرَحُ، بِفَتْحِ خَيْبَرَ أَمْ بِقُدُومِ جَعْفَرٍ».',
      style: 'quote',
      position: 'center',
    },
  ],

  cameraScript: [
    // Wide aerial of the Hejaz — Medina-Khaybar march axis
    { time: 0, position: { x: 800, y: 550 }, zoom: 0.45, duration: 3, easing: 'power2.inOut', type: 'overview' },
    // Pan north-northwest along the marching column toward al-Raji'
    { time: 3, position: { x: 700, y: 800 }, zoom: 0.55, duration: 3, easing: 'power2.inOut', type: 'pan', followEntityId: 'prophet-command' },
    // Zoom into the al-Raji' encampment as Ghatafan turns back
    { time: 6, position: { x: 720, y: 760 }, zoom: 0.7, duration: 3, easing: 'power2.out', type: 'zoom' },
    // Hero shot of dawn over the oasis as the takbir is uttered
    { time: 9, position: { x: 850, y: 600 }, zoom: 0.85, duration: 2, easing: 'power2.in', type: 'focus' },
    // Follow Maslama's contingent into the Naim assault
    { time: 11, position: { x: 950, y: 480 }, zoom: 0.8, duration: 5, easing: 'power2.inOut', type: 'follow', followEntityId: 'maslama-clan' },
    // Pan to al-Sa'b; reveal camp relocation to higher ground
    { time: 17, position: { x: 1050, y: 460 }, zoom: 0.75, duration: 4, easing: 'power2.inOut', type: 'pan' },
    // Tight zoom on al-Zubayr fortress — qanat cross-section
    { time: 22, position: { x: 1150, y: 440 }, zoom: 0.9, duration: 3, easing: 'power2.out', type: 'zoom' },
    // Overview arc from al-Natat across to al-Shiqq district
    { time: 26, position: { x: 950, y: 600 }, zoom: 0.55, duration: 3, easing: 'power2.inOut', type: 'overview' },
    // Dusk into night — settle on the Prophet's tent and the planted banner
    { time: 30, position: { x: 600, y: 700 }, zoom: 0.75, duration: 4, easing: 'power2.inOut', type: 'focus', followEntityId: 'prophet-command' },
    // Hero close-up of the eye-healing and banner transfer to 'Ali
    { time: 35, position: { x: 600, y: 700 }, zoom: 0.92, duration: 3, easing: 'power2.out', type: 'focus', followEntityId: 'ali-banner' },
    // Locked duel-altitude camera on the al-Qamus duel ground for 'Amir's combat
    { time: 39, position: { x: 500, y: 750 }, zoom: 0.93, duration: 3, easing: 'power2.in', type: 'focus' },
    // Sustained close-up on 'Ali's rajaz and the cleaving blow against Marhab
    { time: 43, position: { x: 500, y: 750 }, zoom: 0.94, duration: 5, easing: 'power2.out', type: 'focus' },
    // Follow 'Ali through the breached gate of al-Qamus
    { time: 48, position: { x: 520, y: 740 }, zoom: 0.85, duration: 2, easing: 'power2.inOut', type: 'follow', followEntityId: 'ali-banner' },
    // Lift to overview of al-Katiba district as al-Watih and al-Sulalim surrender
    { time: 50, position: { x: 600, y: 720 }, zoom: 0.5, duration: 4, easing: 'power2.inOut', type: 'overview' },
    // Pan across palm groves — the muzara'a covenant
    { time: 54, position: { x: 700, y: 700 }, zoom: 0.6, duration: 2, easing: 'power2.out', type: 'pan' },
    // Quiet vignette: the offered poisoned sheep and the Prophet's halt-gesture
    { time: 56, position: { x: 580, y: 760 }, zoom: 0.78, duration: 3, easing: 'power2.in', type: 'focus' },
    // Transition to Safiyya freedom and the walima of hais
    { time: 59, position: { x: 540, y: 740 }, zoom: 0.78, duration: 3, easing: 'power2.inOut', type: 'pan' },
    // Pan south to the arrival of Ja'far ibn Abi Talib's caravan from Abyssinia
    { time: 62, position: { x: 700, y: 850 }, zoom: 0.7, duration: 3, easing: 'power2.out', type: 'pan' },
    // Final overview pulling out across all eight fortresses
    { time: 65, position: { x: 800, y: 600 }, zoom: 0.4, duration: 3, easing: 'power2.inOut', type: 'overview' },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 18,
    enemyCasualties: 93,
    summary:
      "Khaybar fell in Muharram 7 AH after a siege of roughly three weeks, in which the fortresses of al-Natat then al-Shiqq then al-Katiba were reduced in succession, climaxing in 'Ali ibn Abi Talib's duel with Marhab and the conquest of al-Qamus after the Prophet ﷺ entrusted him with the banner. The campaign closed with the muzara'a half-produce treaty for al-Watih and al-Sulalim, the poisoned-sheep incident, the freeing and marriage of Safiyya bint Huyayy, and the day-of-conquest arrival of Ja'far ibn Abi Talib from Abyssinia.",
    summaryAr:
      'فُتِحَتْ خَيْبَرُ فِي مُحَرَّمِ السَّنَةِ السَّابِعَةِ مِنَ الْهِجْرَةِ بَعْدَ حِصَارٍ امْتَدَّ نَحْوَ ثَلَاثَةِ أَسَابِيعَ، سَقَطَتْ فِيهِ حُصُونُ النَّطَاةِ ثُمَّ الشِّقِّ ثُمَّ الْكَتِيبَةِ، وَكَانَ ذُرْوَتُهُ مُبَارَزَةَ عَلِيِّ بْنِ أَبِي طَالِبٍ لِمَرْحَبٍ وَفَتْحَهُ حِصْنَ الْقَمُوصِ بَعْدَ أَنْ أَعْطَاهُ النَّبِيُّ ﷺ الرَّايَةَ. وَخَتَمَ الْفَتْحَ صُلْحُ الْوَطِيحِ وَالسُّلَالِمِ عَلَى الْمُزَارَعَةِ بِالنِّصْفِ، وَتَلَتْهُ حَادِثَةُ الشَّاةِ الْمَسْمُومَةِ، وَعِتْقُ صَفِيَّةَ بِنْتِ حُيَيٍّ وَتَزَوُّجُهَا، وَقُدُومُ جَعْفَرِ بْنِ أَبِي طَالِبٍ مِنَ الْحَبَشَةِ يَوْمَ الْفَتْحِ.',
    significance:
      "Khaybar broke the last organised Jewish power in the Hejaz, fulfilled the Surat al-Fath promise of abundant spoils hastened for the Pledgers of al-Ridwan, and instituted the first muzara'a sharecropping and dhimma arrangement in Islamic jurisprudence. Its booty financed the Muhajirun for the first time, opened the road to Mecca within eighteen months, and produced enduring fiqh rulings — including the prohibitions of mut'a marriage and the meat of domestic donkeys, both pronounced on the Day of Khaybar.",
    significanceAr:
      'كَانَتْ خَيْبَرُ كَسْرًا لِآخِرِ قُوَّةٍ يَهُودِيَّةٍ مُنَظَّمَةٍ فِي الْحِجَازِ، وَتَحْقِيقًا لِوَعْدِ اللَّهِ فِي سُورَةِ الْفَتْحِ بِالْمَغَانِمِ الْكَثِيرَةِ الَّتِي عَجَّلَهَا لِأَهْلِ بَيْعَةِ الرِّضْوَانِ، وَأَوَّلَ تَطْبِيقٍ لِنِظَامِ الْمُزَارَعَةِ وَالذِّمَّةِ فِي الْفِقْهِ الْإِسْلَامِيِّ. مَوَّلَتْ غَنَائِمُهَا الْمُهَاجِرِينَ لِأَوَّلِ مَرَّةٍ، وَفَتَحَتِ الطَّرِيقَ نَحْوَ مَكَّةَ بَعْدَ أَقَلَّ مِنْ سَنَةٍ وَنِصْفٍ، وَأَرْسَتْ أَحْكَامًا فِقْهِيَّةً ثَابِتَةً مِنْهَا تَحْرِيمُ نِكَاحِ الْمُتْعَةِ وَلُحُومِ الْحُمُرِ الْأَهْلِيَّةِ يَوْمَ خَيْبَرَ.',
  },

  totalDuration: 68,
};
