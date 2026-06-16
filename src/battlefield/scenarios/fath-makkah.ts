import type { BattleScenario } from '../types/scenario';

/**
 * فَتْحُ مَكَّةَ — الفَتْحُ الأَعْظَمُ
 * The Conquest of Mecca — The Greatest Opening
 *
 * 20 Ramadan 8 AH / ~11 January 630 CE — eighteen months after the
 * Treaty of Hudaybiyya, two years after the Conquest of Khaybar.
 * Mecca, the basin valley ringed by Jabal Abu Qubays (E),
 * Jabal Qu'ayqi'an (W), Jabal al-Hajun (NW) and Jabal Khandama (S),
 * with the Ka'ba at its centre and four passes — Kada (NE), Kuda (SW),
 * Adhakhir (N) and the central Wadi route — funnelling into it.
 *
 * Quraysh's breach of the Hudaybiyya truce — supplying Banu Bakr
 * against Khuza'a, the Prophet's allies — gave the casus belli. Abu
 * Sufyan rode to Madinah to attempt renewal; he failed. The Prophet ﷺ
 * announced the march in secret, even Aisha not knowing the
 * destination, and prayed: «اللَّهُمَّ خُذِ العُيُونَ وَالأَخْبَارَ
 * عَنْ قُرَيْشٍ، حَتَّى نَبْغَتَهَا في بِلَادِهَا». Hatib ibn Abi
 * Balta's letter of warning was intercepted by 'Ali, al-Zubayr and
 * al-Miqdad at Rawdat Khakh; Q 60:1 was revealed about him.
 *
 * The army of 10,000 — the largest the Prophet ﷺ had yet led —
 * encamped at Marr al-Zahran ~22 km north of Mecca. He ordered every
 * man to light his own fire. The valley shone with ten thousand nirān
 * «like the night of Arafat» (Bukhari 4280, Urwa narration). Al-Abbas
 * ibn Abd al-Muttalib, riding the Prophet's white mule Duldul, met
 * Abu Sufyan, Hakim ibn Hizam and Budayl ibn Warqa scouting the fires
 * at al-Arak. He brought Abu Sufyan to the Prophet ﷺ under jiwar.
 * 'Umar drew his sword. The Prophet ﷺ pardoned, and at dawn Abu
 * Sufyan uttered the shahada.
 *
 * The Prophet ﷺ proclaimed the threefold amnesty (Sahih Muslim 1780;
 * Ibn Hisham 4/46): «مَنْ دَخَلَ دَارَ أَبِي سُفْيَانَ فَهُوَ آمِنٌ،
 * وَمَنْ أَغْلَقَ بَابَهُ فَهُوَ آمِنٌ، وَمَنْ دَخَلَ المَسْجِدَ
 * الحَرَامَ فَهُوَ آمِنٌ». Al-Abbas held Abu Sufyan at the wadi
 * narrows to watch the columns file past — the iron parade of the
 * new order. When the Ansar's Green Squadron approached, Sa'd ibn
 * 'Ubada called out: «اليَوْمَ يَوْمُ المَلْحَمَةِ، اليَوْمَ
 * تُسْتَحَلُّ الكَعْبَةُ». The Prophet ﷺ corrected him: «كَذَبَ
 * سَعْدٌ، بَلِ اليَوْمَ يَوْمٌ يُعَظِّمُ اللَّهُ فِيهِ الكَعْبَةَ»
 * (Bukhari 4280) and the banner passed.
 *
 * The army was divided into four columns. Al-Zubayr ibn al-'Awwam
 * carried the main banner on the left wing, planting it at al-Hajun.
 * Khalid ibn al-Walid took the right wing through Kuda from lower
 * Mecca. Abu 'Ubayda ibn al-Jarrah led the al-hussar — the unarmed
 * core, deliberately stripped of armor — through Batn al-Wadi. The
 * Prophet ﷺ entered through Kada on al-Qaswa with Usama ibn Zayd
 * mounted behind him, his head bowed in tawadu' so low that his
 * beard nearly touched the saddle (Ibn Hisham), reciting Surat
 * al-Fath with vibrato — tarji' (Bukhari 4281, 'Abdullah ibn Mughaffal).
 *
 * Only Khalid's column met fighting. At al-Khandama, 'Ikrima ibn
 * Abi Jahl, Safwan ibn Umayya and Suhayl ibn 'Amr had massed Banu
 * Bakr fighters on the rocky hill. Khalid routed them: roughly
 * twelve Quraysh fell, the Muslims lost two — Kurz ibn Jabir
 * al-Fihri and Khunays ibn Khalid (Hubaysh) ibn al-Ash'ar (Sahih
 * Muslim 1780; Ibn Hisham 4/49–50). 'Ikrima fled toward Yemen;
 * Safwan toward Jeddah; Suhayl barricaded.
 *
 * At the Sacred House the Prophet ﷺ struck the 360 idols in
 * succession with a stick in his hand, reciting at each blow:
 * ﴿وَقُلْ جَاءَ الحَقُّ وَزَهَقَ البَاطِلُ ۚ إِنَّ البَاطِلَ كَانَ
 * زَهُوقًا﴾ (al-Isra 17:81; Bukhari 4287, Ibn Mas'ud). He refused
 * to enter the Ka'ba until the images of Ibrahim and Isma'il holding
 * divination arrows were erased: «قَاتَلَهُمُ اللَّهُ، لَقَدْ
 * عَلِمُوا مَا اسْتَقْسَمَا بِهَا قَطُّ» (Bukhari 3352). Hubal was
 * toppled with 'Ali on the Prophet's shoulders (Musnad Ahmad).
 *
 * Then Bilal ibn Rabah — tortured in this very city only yesterday —
 * climbed the roof of the Ka'ba and called the adhan. The voice of
 * tawhid rose from atop the House for the first time, over the whole
 * of Mecca. The Quraysh nobles on Jabal Abu Qubays watched in shock;
 * the Prophet ﷺ, informed by Jibril of their words, addressed each
 * verbatim (Ibn Hisham; al-Waqidi).
 *
 * Standing at the door of the Ka'ba gripping the lintel, the Prophet ﷺ
 * delivered the khutba al-fath. He abolished every claim of jahili
 * privilege and recited Q 49:13. Then he asked Quraysh: «يَا مَعْشَرَ
 * قُرَيْشٍ، مَا تَرَوْنَ أَنِّي فَاعِلٌ بِكُمْ؟» They answered:
 * «خَيْرًا، أَخٌ كَرِيمٌ وَابْنُ أَخٍ كَرِيمٍ». He replied: «اذْهَبُوا
 * فَأَنْتُمُ الطُّلَقَاءُ» (Ibn Hisham al-Sira; al-Bayhaqi al-Sunan
 * al-Kubra 16809). Men's bay'a 'ala al-sam' wa al-ta'a' was taken on
 * al-Safa, then women's bay'a per Q 60:12 — Hind bint 'Utba, Hamza's
 * mutilator, among them. Custodianship of the Ka'ba was returned to
 * 'Uthman ibn Talha of Banu Shayba per Q 4:58 — a perpetual trust.
 * He declared: «لَا هِجْرَةَ بَعْدَ الفَتْحِ، وَلَكِنْ جِهَادٌ
 * وَنِيَّةٌ» (Bukhari 2783) and the eternal sanctity of Mecca:
 * «إِنَّ هَذَا البَلَدَ حَرَّمَهُ اللَّهُ يَوْمَ خَلَقَ السَّمَاوَاتِ
 * وَالأَرْضَ، فَهُوَ حَرَامٌ بِحُرْمَةِ اللَّهِ إِلَى يَوْمِ
 * القِيَامَةِ» (Bukhari 1834, 3189).
 *
 * Two Muslim martyrs; ~12 Quraysh dead. Mecca fell with the smallest
 * bloodshed in the history of conquests. Surat al-Nasr was revealed
 * in connection. The Year of Delegations (9 AH) followed, with the
 * tribes of Arabia coming in waves to enter Allah's religion. The
 * model — bloodless entry, universal amnesty, restoration of trusts
 * — became the template for the Rashidun conquests of Damascus,
 * Jerusalem and Egypt.
 *
 * Sources: al-Bukhari, Sahih (Kitab al-Maghazi: 1834, 1846, 2783,
 *          3189, 3352, 4280, 4281, 4287, 4891); Muslim, Sahih (1780);
 *          Ibn Hisham, as-Sirah an-Nabawiyyah 4/41–60; al-Waqidi,
 *          Kitab al-Maghazi (Ghazwat Fath Makkah); at-Tabari, Tarikh
 *          year 8 AH; al-Bayhaqi, as-Sunan al-Kubra 16809;
 *          al-Baladhuri, Futuh al-Buldan. Surat al-Fath, Surat
 *          al-Nasr, and al-Hujurat 49:13 / al-Nisa 4:58 / al-Mumtahana
 *          60:12 are revealed in connection with this campaign.
 */
export const conquestOfMecca: BattleScenario = {
  id: 'conquest-of-mecca',
  name: 'Conquest of Mecca',
  nameAr: 'فتح مكة',
  date: '20 Ramadan 8 AH (11 January 630 CE)',
  location: "Mecca and the staging valley of Marr al-Zahran, ~22 km north of the basin",
  description:
    "The conquest of Mecca — the greatest opening in the Sira. Quraysh's breach of Hudaybiyya through Banu Bakr against Khuza'a brought the Prophet ﷺ marching with 10,000 men, the largest army he had yet led. He encamped at Marr al-Zahran (~22 km north) and ordered every man to light his own fire — the famous ten thousand nirān like the night of Arafat (Bukhari 4280). Al-Abbas intercepted Abu Sufyan on the Prophet's mule at al-Arak; Abu Sufyan accepted Islam at dawn under jiwar from 'Umar's drawn sword. The Prophet ﷺ proclaimed the threefold amnesty: 'Whoever enters the house of Abu Sufyan is safe; whoever closes his door is safe; whoever enters the Sacred Mosque is safe' (Sahih Muslim 1780). The army was divided into four columns — al-Zubayr on the left wing toward al-Hajun (where the banner was planted), Khalid on the right through Kuda from lower Mecca (the only column to fight, at al-Khandama against Ikrima/Safwan/Suhayl — 12 Quraysh dead, Kurz ibn Jabir and Khunays ibn Khalid martyred), Abu 'Ubayda leading the foot through Batn al-Wadi, and the Prophet ﷺ entering through Kada on al-Qaswa with Usama mounted behind, his head bowed in tawadu' almost to the saddle, reciting Surat al-Fath with vibrato (Bukhari 4281). At the Ka'ba he struck down the 360 idols reciting 'jaa'a al-haqqu wa zahaqa al-batil' (Q 17:81; Bukhari 4287); the images of Ibrahim and Isma'il with divination arrows were erased. Bilal — tortured in this very city — climbed the roof of the Ka'ba and called the first adhan from atop the House. Standing at the door gripping the lintel, the Prophet ﷺ asked Quraysh: 'What do you think I will do with you?' — they answered 'akhun karim' — and he replied: 'Go, you are the freed ones.' He recited Q 49:13, returned the key to 'Uthman ibn Talha of Banu Shayba per Q 4:58, and declared 'la hijrata ba'd al-fath' (Bukhari 2783) and the eternal sanctity of Mecca (Bukhari 1834). Two Muslim martyrs; ~12 Quraysh dead. Surat al-Nasr was revealed in connection. The Year of Delegations followed.",
  descriptionAr:
    'فَتْحُ مَكَّةَ — أَعْظَمُ فَتْحٍ فِي السِّيرَةِ. لَمَّا نَقَضَتْ قُرَيْشٌ صُلْحَ الحُدَيْبِيَةِ بِإِعَانَتِهَا بَنِي بَكْرٍ عَلَى خُزَاعَةَ، خَرَجَ النَّبِيُّ ﷺ في عَشَرَةِ آلَافٍ — أَكْبَرُ جَيْشٍ قَادَهُ. نَزَلَ بِمَرِّ الظَّهْرَانِ وَأَمَرَ كُلَّ رَجُلٍ أَنْ يُوقِدَ نَارَهُ، فَكَانَتْ كَنِيرَانِ عَرَفَةَ. اعْتَرَضَ العَبَّاسُ أَبَا سُفْيَانَ عَلَى بَغْلَةِ النَّبِيِّ ﷺ بِالأَرَاكِ، فَأَسْلَمَ في الفَجْرِ بِجِوَارٍ مِنْ سَيْفِ عُمَرَ. أَعْلَنَ ﷺ الأَمَانَ ثَلَاثًا: «مَنْ دَخَلَ دَارَ أَبِي سُفْيَانَ فَهُوَ آمِنٌ، وَمَنْ أَغْلَقَ بَابَهُ فَهُوَ آمِنٌ، وَمَنْ دَخَلَ المَسْجِدَ الحَرَامَ فَهُوَ آمِنٌ». فَرَّقَ الجَيْشَ أَرْبَعَ كَتَائِبَ: الزُّبَيْرُ عَلَى المُجَنِّبَةِ اليُسْرَى إِلَى الحَجُونِ، وَخَالِدٌ عَلَى اليُمْنَى مِنْ كُدًى مِنْ أَسْفَلِ مَكَّةَ — وَهِيَ الكَتِيبَةُ الوَحِيدَةُ الَّتِي قَاتَلَتْ بِالخَنْدَمَةِ ضِدَّ عِكْرِمَةَ وَصَفْوَانَ وَسُهَيْلٍ، فَقُتِلَ مِنْ قُرَيْشٍ نَحْوُ اثْنَيْ عَشَرَ وَاسْتُشْهِدَ كُرْزُ بنُ جَابِرٍ وَخُنَيْسُ بنُ خَالِدٍ — وَأَبُو عُبَيْدَةَ عَلَى الحُسَّرِ في بَطْنِ الوَادِي، وَدَخَلَ هُوَ ﷺ مِنْ كَدَاءَ عَلَى القَصْوَاءِ وَخَلْفَهُ أُسَامَةُ، طَأْطَأَ رَأْسَهُ تَوَاضُعًا حَتَّى كَادَتْ لِحْيَتُهُ تَمَسُّ وَاسِطَةَ الرَّحْلِ، يُرَجِّعُ سُورَةَ الفَتْحِ. كَسَّرَ السِّتِّينَ وَالثَّلَاثَمِائَةِ صَنَمٍ تَالِيًا ﴿وَقُلْ جَاءَ الحَقُّ وَزَهَقَ البَاطِلُ﴾، وَأَمَرَ بِمَحْوِ صُوَرِ إِبْرَاهِيمَ وَإِسْمَاعِيلَ. ثُمَّ صَعِدَ بِلَالٌ — الَّذِي عُذِّبَ بِالأَمْسِ في هَذِهِ المَدِينَةِ — ظَهْرَ الكَعْبَةِ وَأَذَّنَ. وَقَامَ ﷺ بِبَابِ الكَعْبَةِ آخِذًا بِعِضَادَتَيْهِ فَقَالَ لِقُرَيْشٍ: «مَا تَرَوْنَ أَنِّي فَاعِلٌ بِكُمْ؟» قَالُوا: «خَيْرًا، أَخٌ كَرِيمٌ»، فَقَالَ: «اذْهَبُوا فَأَنْتُمُ الطُّلَقَاءُ». وَتَلَا ﴿إِنَّ أَكْرَمَكُمْ عِنْدَ اللَّهِ أَتْقَاكُمْ﴾، وَرَدَّ المِفْتَاحَ إِلَى عُثْمَانَ بْنِ طَلْحَةَ، وَقَالَ: «لَا هِجْرَةَ بَعْدَ الفَتْحِ». اسْتُشْهِدَ مِنَ المُسْلِمِينَ اثْنَانِ، وَقُتِلَ مِنْ قُرَيْشٍ نَحْوُ اثْنَيْ عَشَرَ. وَنَزَلَتْ سُورَةُ النَّصْرِ في شَأْنِ الفَتْحِ، وَأَعْقَبَهُ عَامُ الوُفُودِ.',

  dayPhase: 'dawn',
  weather: 'clear',
  actualDayCount: 11,

  map: {
    width: 1600,
    height: 1100,
    terrain: [
      // Base sandy basin floor
      {
        id: 'mecca-basin',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x6b552f,
        label: 'وَادِي مَكَّةَ',
      },
      // Marr al-Zahran — staging valley north of the basin
      {
        id: 'marr-zahran-valley',
        type: 'sand',
        polygon: [
          { x: 200, y: 80 },
          { x: 1400, y: 80 },
          { x: 1400, y: 280 },
          { x: 200, y: 280 },
        ],
        color: 0x7a6440,
        label: 'مَرُّ الظَّهْرَانِ',
      },
      // Northern ridge separating Marr al-Zahran from Mecca basin
      {
        id: 'northern-ridge',
        type: 'rocky',
        polygon: [
          { x: 100, y: 280 },
          { x: 1500, y: 280 },
          { x: 1500, y: 380 },
          { x: 100, y: 380 },
        ],
        color: 0x4a3826,
      },
      // Jabal Abu Qubays — eastern ridge framing the basin
      {
        id: 'jabal-abu-qubays',
        type: 'mountain',
        polygon: [
          { x: 1320, y: 380 },
          { x: 1500, y: 380 },
          { x: 1500, y: 850 },
          { x: 1320, y: 850 },
        ],
        color: 0x33241a,
        label: 'جَبَلُ أَبِي قُبَيْسٍ',
      },
      // Jabal Qu'ayqi'an — western ridge
      {
        id: 'jabal-quayqian',
        type: 'mountain',
        polygon: [
          { x: 100, y: 380 },
          { x: 280, y: 380 },
          { x: 280, y: 850 },
          { x: 100, y: 850 },
        ],
        color: 0x33241a,
        label: 'جَبَلُ قُعَيْقِعَانَ',
      },
      // Jabal al-Hajun — north-west ridge where al-Zubayr planted the banner
      {
        id: 'jabal-hajun',
        type: 'elevated',
        polygon: [
          { x: 300, y: 380 },
          { x: 500, y: 380 },
          { x: 500, y: 500 },
          { x: 300, y: 500 },
        ],
        color: 0x5a4836,
        label: 'جَبَلُ الحَجُونِ',
      },
      // Jabal Khandama — southern hill, the only blade-clash of the day
      {
        id: 'jabal-khandama',
        type: 'rocky',
        polygon: [
          { x: 600, y: 800 },
          { x: 950, y: 800 },
          { x: 950, y: 970 },
          { x: 600, y: 970 },
        ],
        color: 0x4a3826,
        label: 'ثَنِيَّةُ الخَنْدَمَةِ',
      },
      // Kada (upper, NE) — pass the Prophet ﷺ entered through
      {
        id: 'kada-pass',
        type: 'gorge',
        polygon: [
          { x: 980, y: 280 },
          { x: 1080, y: 280 },
          { x: 1080, y: 400 },
          { x: 980, y: 400 },
        ],
        color: 0x2c1f14,
        label: 'ثَنِيَّةُ كَدَاءَ',
      },
      // Adhakhir (N) — central northern pass
      {
        id: 'adhakhir-pass',
        type: 'gorge',
        polygon: [
          { x: 760, y: 280 },
          { x: 860, y: 280 },
          { x: 860, y: 400 },
          { x: 760, y: 400 },
        ],
        color: 0x2c1f14,
        label: 'أَذَاخِرُ',
      },
      // Kuda (lower, SW) — Khalid's entry route from the south
      {
        id: 'kuda-pass',
        type: 'gorge',
        polygon: [
          { x: 480, y: 800 },
          { x: 580, y: 800 },
          { x: 580, y: 920 },
          { x: 480, y: 920 },
        ],
        color: 0x2c1f14,
        label: 'ثَنِيَّةُ كُدًى',
      },
      // The Sacred Mosque precinct (al-Masjid al-Haram) — the operational objective
      {
        id: 'sacred-mosque',
        type: 'oasis',
        polygon: [
          { x: 720, y: 540 },
          { x: 880, y: 540 },
          { x: 880, y: 660 },
          { x: 720, y: 660 },
        ],
        color: 0x3e5230,
        label: 'المَسْجِدُ الحَرَامُ',
      },
      // The Ka'ba — at the centre of the precinct
      {
        id: 'kaaba',
        type: 'fortress_wall',
        polygon: [
          { x: 785, y: 575 },
          { x: 815, y: 575 },
          { x: 815, y: 615 },
          { x: 785, y: 615 },
        ],
        color: 0x1c1410,
        label: 'الكَعْبَةُ المُشَرَّفَةُ',
      },
      // Al-Safa hill — beside the Ka'ba where the bay'a was taken
      {
        id: 'al-safa',
        type: 'elevated',
        polygon: [
          { x: 880, y: 600 },
          { x: 940, y: 600 },
          { x: 940, y: 650 },
          { x: 880, y: 650 },
        ],
        color: 0x6a5036,
        label: 'الصَّفَا',
      },
      // Batn al-Wadi — central wadi route Abu Ubayda's column took
      {
        id: 'batn-al-wadi',
        type: 'flat',
        polygon: [
          { x: 700, y: 400 },
          { x: 900, y: 400 },
          { x: 900, y: 540 },
          { x: 700, y: 540 },
        ],
        color: 0x7a6238,
      },
    ],
    landmarks: [
      {
        id: 'kaaba',
        position: { x: 800, y: 595 },
        type: 'marker',
        label: 'The Sacred Ka\'ba',
        labelAr: 'الكَعْبَةُ المُشَرَّفَةُ',
      },
      {
        id: 'marr-zahran',
        position: { x: 800, y: 180 },
        type: 'camp',
        label: 'Marr al-Zahran — Staging Valley',
        labelAr: 'مَرُّ الظَّهْرَانِ',
      },
      {
        id: 'al-arak',
        position: { x: 720, y: 280 },
        type: 'marker',
        label: "Al-Arak — Where al-Abbas Met Abu Sufyan",
        labelAr: 'الأَرَاكُ',
      },
      {
        id: 'jabal-hajun-marker',
        position: { x: 400, y: 440 },
        type: 'hill',
        label: "Jabal al-Hajun — al-Zubayr's Banner",
        labelAr: 'جَبَلُ الحَجُونِ',
      },
      {
        id: 'kada-pass-marker',
        position: { x: 1030, y: 340 },
        type: 'mountain_pass',
        label: "Thaniyyat Kada — The Prophet's Entry",
        labelAr: 'ثَنِيَّةُ كَدَاءَ',
      },
      {
        id: 'kuda-pass-marker',
        position: { x: 530, y: 860 },
        type: 'mountain_pass',
        label: "Thaniyyat Kuda — Khalid's Entry",
        labelAr: 'ثَنِيَّةُ كُدًى',
      },
      {
        id: 'adhakhir-marker',
        position: { x: 810, y: 340 },
        type: 'mountain_pass',
        label: 'Adhakhir Pass',
        labelAr: 'أَذَاخِرُ',
      },
      {
        id: 'al-safa-marker',
        position: { x: 910, y: 625 },
        type: 'hill',
        label: "Al-Safa — Site of the Bay'a",
        labelAr: 'الصَّفَا',
      },
      {
        id: 'khandama-marker',
        position: { x: 770, y: 880 },
        type: 'marker',
        label: "al-Khandama — Khalid's Skirmish",
        labelAr: 'ثَنِيَّةُ الخَنْدَمَةِ',
      },
      {
        id: 'umm-hani-house',
        position: { x: 870, y: 680 },
        type: 'marker',
        label: "Umm Hani's House",
        labelAr: 'دَارُ أُمِّ هَانِئٍ',
      },
      {
        id: 'abu-sufyan-house',
        position: { x: 690, y: 680 },
        type: 'marker',
        label: "Abu Sufyan's House",
        labelAr: 'دَارُ أَبِي سُفْيَانَ',
      },
      {
        id: 'jabal-abu-qubays-marker',
        position: { x: 1410, y: 600 },
        type: 'mountain_pass',
        label: 'Jabal Abu Qubays',
        labelAr: 'جَبَلُ أَبِي قُبَيْسٍ',
      },
    ],
    backgroundColor: 0x1a1208,
  },

  forces: [
    // ─── Muslim Forces (~10,000 from Madinah and the Bedouin allies) ─────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ الفَتْحِ',
      totalStrength: 10000,
      units: [
        {
          // The Prophet's central column on al-Qaswa, Usama mounted behind
          id: 'prophet-column',
          name: "The Prophet's Column",
          nameAr: 'كَتِيبَةُ رَسُولِ اللَّهِ ﷺ',
          troopType: 'command',
          soldierCount: 700,
          commander: 'النَّبِيُّ مُحَمَّدٌ ﷺ عَلَى نَاقَتِهِ القَصْوَاءِ',
          startPosition: { x: 800, y: 200 },
          startFormation: 'column',
          startFacing: Math.PI / 2, // facing south toward Mecca
          stats: { attack: 8, defense: 10, speed: 6, morale: 10 },
        },
        {
          // Khalid's right wing — Bedouin allies, the only column to fight at al-Khandama
          id: 'khalid-right-wing',
          name: "Khalid's Right Wing",
          nameAr: 'كَتِيبَةُ خَالِدِ بنِ الوَلِيدِ',
          troopType: 'cavalry',
          soldierCount: 2000,
          commander: 'خَالِدُ بنُ الوَلِيدِ',
          startPosition: { x: 970, y: 200 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 8, speed: 9, morale: 10 },
        },
        {
          // Al-Zubayr's left wing — carrying the main banner, planted at al-Hajun
          id: 'zubayr-left-wing',
          name: "al-Zubayr's Left Wing",
          nameAr: 'كَتِيبَةُ الزُّبَيْرِ بنِ العَوَّامِ',
          troopType: 'cavalry',
          soldierCount: 1500,
          commander: 'الزُّبَيْرُ بنُ العَوَّامِ',
          startPosition: { x: 630, y: 200 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 8, speed: 9, morale: 10 },
        },
        {
          // Abu Ubayda's centre — the al-hussar, advancing through Batn al-Wadi
          id: 'abu-ubayda-center',
          name: "Abu Ubayda's Centre (al-Hussar)",
          nameAr: 'كَتِيبَةُ أَبِي عُبَيْدَةَ بنِ الجَرَّاحِ — الحُسَّرُ',
          troopType: 'infantry',
          soldierCount: 3000,
          commander: 'أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ',
          startPosition: { x: 800, y: 240 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // The Ansar's Green Squadron — al-khadra' in full mail
          id: 'ansar-column',
          name: "The Green Squadron of the Ansar",
          nameAr: 'كَتِيبَةُ الأَنْصَارِ الخَضْرَاءُ',
          troopType: 'heavy_cavalry',
          soldierCount: 2000,
          commander: 'سَعْدُ بنُ عُبَادَةَ ثُمَّ قَيْسُ بنُ سَعْدٍ',
          startPosition: { x: 730, y: 240 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 10, speed: 7, morale: 10 },
        },
        {
          // Abu Qatada's scout-screen — diversionary toward Idam
          id: 'scouts-detachment',
          name: "Abu Qatada's Scout Detachment",
          nameAr: 'سَرِيَّةُ أَبِي قَتَادَةَ',
          troopType: 'horse_archer',
          soldierCount: 100,
          commander: 'أَبُو قَتَادَةَ الأَنْصَارِيُّ',
          startPosition: { x: 1200, y: 200 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 8, defense: 6, speed: 10, morale: 10 },
        },
        {
          // 'Ali — caught Hatib's courier; with the Prophet at the Ka'ba
          id: 'ali-banner',
          name: "'Ali ibn Abi Talib's Detachment",
          nameAr: 'كَتِيبَةُ عَلِيِّ بنِ أَبِي طَالِبٍ',
          troopType: 'command',
          soldierCount: 400,
          commander: 'عَلِيُّ بنُ أَبِي طَالِبٍ',
          startPosition: { x: 850, y: 200 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 9, speed: 8, morale: 10 },
        },
        {
          // The senior Muhajirun reserve — Abdurrahman ibn 'Awf
          id: 'muhajirun-reserve',
          name: 'Senior Muhajirun Reserve',
          nameAr: 'كَتِيبَةُ المُهَاجِرِينَ',
          troopType: 'reserves',
          soldierCount: 300,
          commander: 'عَبْدُ الرَّحْمَنِ بنُ عَوْفٍ',
          startPosition: { x: 770, y: 250 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 5, morale: 10 },
        },
      ],
    },

    // ─── Quraysh Forces (only ~200 took up arms; the city did not fight) ──
    {
      faction: 'quraysh',
      label: 'Quraysh of Makkah',
      labelAr: 'قُرَيْشُ مَكَّةَ',
      totalStrength: 1200,
      units: [
        {
          // The only Quraysh force to take up arms — al-Khandama under Ikrima/Safwan/Suhayl
          id: 'quraysh-khandama-resisters',
          name: "Quraysh Resisters at al-Khandama",
          nameAr: 'كَتِيبَةُ الخَنْدَمَةِ',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'عِكْرِمَةُ بنُ أَبِي جَهْلٍ، صَفْوَانُ بنُ أُمَيَّةَ، سُهَيْلُ بنُ عَمْرٍو',
          startPosition: { x: 770, y: 870 },
          startFormation: 'scattered',
          startFacing: -Math.PI / 2, // facing north toward incoming Khalid
          stats: { attack: 7, defense: 6, speed: 5, morale: 5 },
        },
        {
          // Abu Sufyan's delegation — captured at al-Arak, accepted Islam
          id: 'abu-sufyan-delegation',
          name: "Abu Sufyan's Delegation",
          nameAr: 'وَفْدُ أَبِي سُفْيَانَ',
          troopType: 'command',
          soldierCount: 3,
          commander: 'أَبُو سُفْيَانَ بنُ حَرْبٍ، حَكِيمُ بنُ حِزَامٍ، بُدَيْلُ بنُ وَرْقَاءَ',
          startPosition: { x: 720, y: 280 },
          startFormation: 'scattered',
          startFacing: -Math.PI / 2,
          stats: { attack: 4, defense: 4, speed: 7, morale: 7 },
        },
        {
          // The civilian population sheltering per the safe-conduct decree
          id: 'quraysh-population',
          name: 'Meccans in Their Homes',
          nameAr: 'أَهْلُ مَكَّةَ المُتَحَصِّنُونَ',
          troopType: 'infantry',
          soldierCount: 1000,
          commander: 'أَهْلُ مَكَّةَ (غَيْرُ مُقَاتِلِينَ)',
          startPosition: { x: 800, y: 700 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 2, defense: 4, speed: 4, morale: 4 },
        },
      ],
    },
  ],

  phases: [
    // Phase 1 (0–7s): Marr al-Zahran — 10,000 fires.
    {
      id: 'phase-01-marr-al-zahran-fires',
      name: 'The Fires of Marr al-Zahran',
      nameAr: 'نِيرَانُ مَرِّ الظَّهْرَانِ',
      startTime: 0,
      duration: 7,
      description:
        "Night of 19 Ramadan 8 AH: the army of 10,000 camps at Marr al-Zahran ~22 km north of Mecca. The Prophet ﷺ orders every man to light a separate fire — the famous ten-thousand nirān 'like the fires of Arafat' (Bukhari 4280, Urwa narration).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 200, zoom: 0.45, duration: 4 }, delay: 0 },
        { type: 'camera_move', params: { x: 800, y: 220, zoom: 0.5, duration: 3 }, delay: 4 },
        // Cascading fire ignition across the staging valley
        { type: 'play_effect', params: { effect: 'campfires-cascade', position: { x: 800, y: 180 }, count: 10000 }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'prophet-column', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'khalid-right-wing', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'zubayr-left-wing', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'abu-ubayda-center', params: { formation: 'column' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'ansar-column', params: { formation: 'column' }, delay: 1 },
      ],
      triggers: [],
    },

    // Phase 2 (7–14s): al-Abbas intercepts Abu Sufyan; the shahada at dawn.
    {
      id: 'phase-02-abbas-intercepts-abu-sufyan',
      name: "al-Abbas Intercepts Abu Sufyan",
      nameAr: 'العَبَّاسُ يَعْتَرِضُ أَبَا سُفْيَانَ',
      startTime: 7,
      duration: 7,
      description:
        "Al-Abbas ibn Abd al-Muttalib, riding the Prophet's white mule (Duldul), encounters Abu Sufyan, Hakim ibn Hizam, and Budayl ibn Warqa scouting the fires. He brings Abu Sufyan to the Prophet under jiwar; 'Umar demands execution; the Prophet ﷺ pardons. Abu Sufyan utters the shahada at dawn.",
      actions: [
        { type: 'camera_move', params: { x: 720, y: 280, zoom: 0.7, duration: 3 }, delay: 0 },
        // Abbas rides out from the camp toward al-Arak
        { type: 'play_effect', params: { effect: 'lone-rider-track', from: { x: 800, y: 220 }, to: { x: 720, y: 280 } }, delay: 1 },
        // Abu Sufyan delegation appears at al-Arak
        { type: 'set_behavior', targetUnitId: 'abu-sufyan-delegation', params: { behavior: 'holding' }, delay: 2 },
        // Return to the Prophet's tent
        { type: 'camera_move', params: { x: 800, y: 240, zoom: 0.85, duration: 3 }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'abu-sufyan-delegation', params: { position: { x: 800, y: 220 }, speed: 80 }, delay: 4 },
        // Dawn light begins
        { type: 'play_effect', params: { effect: 'dawn-creep', position: { x: 1400, y: 280 } }, delay: 5 },
        { type: 'play_effect', params: { effect: 'shahada-utterance', targetUnitId: 'abu-sufyan-delegation' }, delay: 5.5 },
      ],
      triggers: [],
    },

    // Phase 3 (14–20s): The threefold amnesty proclamation.
    {
      id: 'phase-03-amnesty-proclamation',
      name: 'The Amnesty Proclamation',
      nameAr: 'إِعْلَانُ الأَمَانِ',
      startTime: 14,
      duration: 6,
      description:
        "The Prophet's threefold safety decree (Sahih Muslim 1780; Ibn Hisham 4/46): 'Whoever enters Abu Sufyan's house is safe; whoever closes his door is safe; whoever enters the Sacred Mosque is safe.' Al-Abbas asks for honor for Abu Sufyan; the pass-procession is ordered.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 250, zoom: 0.5, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'proclamation-echo', position: { x: 800, y: 220 } }, delay: 1 },
        // The columns shift from rest to march formation
        { type: 'change_formation', targetUnitId: 'prophet-column', params: { formation: 'column' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'khalid-right-wing', params: { formation: 'wedge' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'zubayr-left-wing', params: { formation: 'wedge' }, delay: 2 },
        // Wadi narrows pan as columns parade past Abu Sufyan
        { type: 'camera_move', params: { x: 760, y: 320, zoom: 0.65, duration: 2 }, delay: 3.5 },
      ],
      triggers: [],
    },

    // Phase 4 (20–28s): The four columns march.
    {
      id: 'phase-04-march-of-columns',
      name: 'The March of the Four Columns',
      nameAr: 'مَسِيرُ الكَتَائِبِ الأَرْبَعِ',
      startTime: 20,
      duration: 8,
      description:
        "Per Sahih Muslim 1780 and Bukhari 4280: al-Zubayr on one wing, Khalid on the other, Abu Ubayda leading al-hussar through Batn al-Wadi; the Prophet ﷺ entering from Kada (upper pass), Khalid from Kuda (lower). Sa'd ibn Ubadah's slogan rebuked, banner transferred.",
      actions: [
        { type: 'camera_move', params: { x: 780, y: 350, zoom: 0.7, duration: 2 }, delay: 0 },
        // The Green Squadron passes Abu Sufyan in iron
        { type: 'set_behavior', targetUnitId: 'ansar-column', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ansar-column', params: { position: { x: 780, y: 380 }, speed: 80 }, delay: 0.5 },
        // Camera pulls to high overview as four arrows converge
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.4, duration: 3 }, delay: 2 },
        // Prophet-column heads toward Kada (NE)
        { type: 'set_behavior', targetUnitId: 'prophet-column', params: { behavior: 'advancing' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'prophet-column', params: { position: { x: 1030, y: 340 }, speed: 70 }, delay: 2 },
        // Khalid heads toward Kuda (SW) via the longer southern route
        { type: 'set_behavior', targetUnitId: 'khalid-right-wing', params: { behavior: 'advancing' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'khalid-right-wing', params: { position: { x: 530, y: 860 }, speed: 90 }, delay: 2 },
        // Zubayr heads toward al-Hajun (NW)
        { type: 'set_behavior', targetUnitId: 'zubayr-left-wing', params: { behavior: 'advancing' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'zubayr-left-wing', params: { position: { x: 400, y: 440 }, speed: 90 }, delay: 2 },
        // Abu Ubayda along Batn al-Wadi
        { type: 'set_behavior', targetUnitId: 'abu-ubayda-center', params: { behavior: 'advancing' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'abu-ubayda-center', params: { position: { x: 800, y: 470 }, speed: 60 }, delay: 2 },
        // Ansar with Prophet-column
        { type: 'move_unit', targetUnitId: 'ansar-column', params: { position: { x: 950, y: 380 }, speed: 70 }, delay: 3 },
        // 'Ali and Muhajirun reserve advancing
        { type: 'move_unit', targetUnitId: 'ali-banner', params: { position: { x: 850, y: 380 }, speed: 80 }, delay: 3 },
        { type: 'move_unit', targetUnitId: 'muhajirun-reserve', params: { position: { x: 800, y: 350 }, speed: 60 }, delay: 3 },
        // Scout screen toward Idam east
        { type: 'move_unit', targetUnitId: 'scouts-detachment', params: { position: { x: 1450, y: 300 }, speed: 130 }, delay: 1 },
        // Dawn breaks fully over Jabal Abu Qubays
        { type: 'play_effect', params: { effect: 'dawn-full', position: { x: 1410, y: 600 } }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 5 (28–35s): The Prophet ﷺ enters on al-Qaswa reciting Surat al-Fath.
    {
      id: 'phase-05-prophet-enters-on-qaswa',
      name: "The Prophet ﷺ Enters on al-Qaswa",
      nameAr: 'دُخُولُ النَّبِيِّ ﷺ عَلَى القَصْوَاءِ',
      startTime: 28,
      duration: 7,
      description:
        "Bukhari 4281 (Abdullah ibn Mughaffal): the Prophet ﷺ entered reciting Surat al-Fath with vibrato (tarji'). His head bowed so low in tawadu' his beard nearly touched the saddle (Ibn Hisham). Helmet on entry per Anas (Bukhari 1846).",
      actions: [
        { type: 'camera_move', params: { x: 880, y: 540, zoom: 0.6, duration: 3 }, delay: 0 },
        { type: 'camera_move', params: { x: 900, y: 560, zoom: 0.85, duration: 4 }, delay: 3 },
        // Prophet-column descends into the basin through Kada
        { type: 'move_unit', targetUnitId: 'prophet-column', params: { position: { x: 950, y: 480 }, speed: 50 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'prophet-column', params: { position: { x: 850, y: 540 }, speed: 50 }, delay: 4 },
        { type: 'play_effect', params: { effect: 'tarji-recitation', targetUnitId: 'prophet-column' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'golden-haloing', targetUnitId: 'prophet-column' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 6 (35–41s): The Khandama skirmish.
    {
      id: 'phase-06-khandama-skirmish',
      name: 'The Khandama Skirmish',
      nameAr: 'وَقْعَةُ الخَنْدَمَةِ',
      startTime: 35,
      duration: 6,
      description:
        "Khalid's column ambushed at al-Khandama by Ikrima ibn Abi Jahl, Safwan ibn Umayya, Suhayl ibn Amr with Banu Bakr fighters. ~12-13 Quraysh killed; 2 Muslim martyrs: Kurz ibn Jabir al-Fihri and Khunays ibn Khalid (Hubaysh) ibn al-Ash'ar (Sahih Muslim 1780). Ikrima flees toward Yemen; Safwan toward Jeddah.",
      actions: [
        { type: 'camera_move', params: { x: 600, y: 760, zoom: 0.75, duration: 2 }, delay: 0 },
        // Khalid's wing reaches the Khandama line
        { type: 'move_unit', targetUnitId: 'khalid-right-wing', params: { position: { x: 700, y: 870 }, speed: 110 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'khalid-right-wing', params: { behavior: 'attacking' }, delay: 1 },
        // The skirmish — brief, then over
        { type: 'set_behavior', targetUnitId: 'quraysh-khandama-resisters', params: { behavior: 'attacking' }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'khalid-right-wing', params: { targetId: 'quraysh-khandama-resisters' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'casualty-marker', targetUnitId: 'khalid-right-wing', label: 'كُرْزُ بنُ جَابِرٍ، خُنَيْسُ بنُ خَالِدٍ' }, delay: 2.5 },
        // Resisters routed
        { type: 'set_behavior', targetUnitId: 'quraysh-khandama-resisters', params: { behavior: 'retreating' }, delay: 3.5 },
        { type: 'change_formation', targetUnitId: 'quraysh-khandama-resisters', params: { formation: 'scattered' }, delay: 4 },
        { type: 'destroy_unit', targetUnitId: 'quraysh-khandama-resisters', params: { cause: 'routed-at-khandama' }, delay: 4.5 },
        // Khalid's column moves on toward the basin
        { type: 'move_unit', targetUnitId: 'khalid-right-wing', params: { position: { x: 700, y: 700 }, speed: 100 }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 7 (41–48s): Purification of the Ka'ba.
    {
      id: 'phase-07-purification-of-the-kaaba',
      name: 'Purification of the Ka\'ba',
      nameAr: 'تَطْهِيرُ الكَعْبَةِ مِنَ الأَصْنَامِ',
      startTime: 41,
      duration: 7,
      description:
        "Bukhari 4287 (Ibn Mas'ud): 360 idols around the House struck with a stick while reciting Q 17:81. Inside: images of Ibrahim and Isma'il with divination arrows ordered erased — Bukhari 3352: 'qatalahum Allah, laqad alimu ma istaqsama biha qatt.' Hubal toppled with 'Ali on the Prophet's shoulders (Musnad Ahmad).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 580, zoom: 0.9, duration: 3 }, delay: 0 },
        // The Prophet's column converges on the precinct
        { type: 'move_unit', targetUnitId: 'prophet-column', params: { position: { x: 800, y: 595 }, speed: 50 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ali-banner', params: { position: { x: 800, y: 595 }, speed: 60 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muhajirun-reserve', params: { position: { x: 770, y: 600 }, speed: 50 }, delay: 1 },
        // The 360 idols struck in succession
        { type: 'play_effect', params: { effect: 'idols-fall-cascade', position: { x: 800, y: 595 }, count: 360 }, delay: 2 },
        { type: 'play_effect', params: { effect: 'quran-recitation', text: 'جَاءَ الحَقُّ وَزَهَقَ البَاطِلُ' }, delay: 2.5 },
        // Camera holds close on the Ka'ba interior
        { type: 'camera_move', params: { x: 800, y: 580, zoom: 0.8, duration: 3 }, delay: 4 },
        { type: 'play_effect', params: { effect: 'image-erasure', position: { x: 800, y: 595 } }, delay: 4.5 },
        { type: 'play_effect', params: { effect: 'takbir-corners', position: { x: 800, y: 595 } }, delay: 5.5 },
      ],
      triggers: [],
    },

    // Phase 8 (48–54s): Bilal's adhan from atop the Ka'ba.
    {
      id: 'phase-08-bilal-adhan',
      name: "Bilal's Adhan from atop the Ka'ba",
      nameAr: 'أَذَانُ بِلَالٍ فَوْقَ الكَعْبَةِ',
      startTime: 48,
      duration: 6,
      description:
        "Bilal ibn Rabah — formerly tortured in this very city — climbs atop the Ka'ba and calls the adhan. Quraysh nobles (al-Harith ibn Hisham, Khalid ibn Asid, Attab) watch in shock; the Prophet ﷺ, informed by Jibril of their words, addresses each verbatim (Ibn Hisham; al-Waqidi).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 560, zoom: 0.7, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'bilal-ascend', position: { x: 800, y: 595 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'adhan-rooftop', position: { x: 800, y: 595 } }, delay: 2 },
        { type: 'camera_move', params: { x: 800, y: 540, zoom: 0.6, duration: 3 }, delay: 3 },
        { type: 'play_effect', params: { effect: 'reaction-shot', position: { x: 1410, y: 600 } }, delay: 4 },
      ],
      triggers: [],
    },

    // Phase 9 (54–61s): The khutba at the Ka'ba's door.
    {
      id: 'phase-09-khutbat-al-fath',
      name: "The Khutba at the Door of the Ka'ba",
      nameAr: 'خُطْبَةُ الفَتْحِ عِنْدَ بَابِ الكَعْبَةِ',
      startTime: 54,
      duration: 7,
      description:
        "Standing at the door of the Ka'ba holding the lintel, the Prophet ﷺ declared the abolition of jahili blood-claims and tribal pride, recited Q 49:13, and asked Quraysh: 'ma tarawna anni fa'ilun bikum?' They answered: 'akhun karim.' He replied with Yusuf 12:92 and 'idhhabu fa-antum al-tulaqa' (Ibn Hisham; al-Bayhaqi).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 580, zoom: 0.55, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'lintel-grip', targetUnitId: 'prophet-column' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'quran-recitation', text: 'يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَى' }, delay: 2 },
        { type: 'camera_move', params: { x: 800, y: 580, zoom: 0.65, duration: 3 }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'tulaqa-amnesty' }, delay: 4.5 },
        // Quraysh population kneels in waves of bay'a
        { type: 'change_formation', targetUnitId: 'quraysh-population', params: { formation: 'scattered' }, delay: 5 },
        { type: 'set_behavior', targetUnitId: 'quraysh-population', params: { behavior: 'holding' }, delay: 5.5 },
      ],
      triggers: [],
    },

    // Phase 10 (61–67s): The bay'a at al-Safa.
    {
      id: 'phase-10-bayah-at-safa',
      name: "The Bay'a at al-Safa",
      nameAr: 'البَيْعَةُ عَلَى الصَّفَا',
      startTime: 61,
      duration: 6,
      description:
        "Men's bay'a 'ala al-sam' wa al-ta'a' on al-Safa, then women's bay'a per Q 60:12 (Bukhari 4891). Hind bint Utbah — Hamza's mutilator — pledges. Custodianship of the Ka'ba returned to 'Uthman ibn Talha (Banu Shayba) per Q 4:58. La hijrata ba'd al-fath (Bukhari 2783).",
      actions: [
        { type: 'camera_move', params: { x: 840, y: 600, zoom: 0.6, duration: 3 }, delay: 0 },
        // Move muhajirun reserve and ansar column into bay'a circles around al-Safa
        { type: 'move_unit', targetUnitId: 'muhajirun-reserve', params: { position: { x: 900, y: 625 }, speed: 60 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'ansar-column', params: { position: { x: 920, y: 640 }, speed: 60 }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'muhajirun-reserve', params: { formation: 'defensive_circle' }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'ansar-column', params: { formation: 'defensive_circle' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'key-handover', position: { x: 800, y: 595 }, label: 'مِفْتَاحُ الكَعْبَةِ — بَنُو شَيْبَةَ' }, delay: 3 },
        { type: 'camera_move', params: { x: 820, y: 590, zoom: 0.7, duration: 3 }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'womens-bayah', position: { x: 920, y: 640 } }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 11 (67–72s): The eternal sanctity decree — close.
    {
      id: 'phase-11-haram-eternal',
      name: 'The Eternal Sanctity Decree',
      nameAr: 'حُرْمَةُ مَكَّةَ إِلَى يَوْمِ القِيَامَةِ',
      startTime: 67,
      duration: 5,
      description:
        "Bukhari 1834/3189: 'Allah made this city sacred the day He created the heavens and the earth... fighting in it was not lawful for anyone before me, nor for me except one hour of one day.' The juridical seal of the conquest.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.45, duration: 3 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'haram-decree' }, delay: 1 },
        { type: 'camera_move', params: { x: 800, y: 400, zoom: 0.4, duration: 2 }, delay: 3 },
        { type: 'play_effect', params: { effect: 'surat-al-nasr-faint' }, delay: 3.5 },
      ],
      triggers: [],
    },
  ],

  narration: [
    {
      id: 'narr-01-marr-al-zahran',
      time: 0.5,
      duration: 6.5,
      text: 'In the last ten nights of Ramadan, year 8 of the Hijra, the Messenger of Allah ﷺ encamped at Marr al-Zahran with ten thousand. He ordered every man to light his own fire, and the valley shone like the night of Arafat.',
      textAr:
        'في العَشْرِ الأَوَاخِرِ مِنْ رَمَضَانَ، سَنَةَ ثَمَانٍ لِلْهِجْرَةِ، نَزَلَ رَسُولُ اللَّهِ ﷺ بِمَرِّ الظَّهْرَانِ في عَشَرَةِ آلَافٍ. وَأَمَرَ أَنْ تُوقَدَ النِّيرَانُ في كُلِّ مَنْزِلٍ، فَكَانَتْ كَنِيرَانِ عَرَفَةَ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-02-shahada-of-abu-sufyan',
      time: 9,
      duration: 5,
      text: "Al-Abbas ibn Abd al-Muttalib intercepts Abu Sufyan on the Prophet's mule and grants him protection from 'Umar's drawn sword. Confronted by ten thousand fires, Abu Sufyan utters the shahada at dawn.",
      textAr:
        'يَعْتَرِضُ العَبَّاسُ بْنُ عَبْدِ المُطَّلِبِ أَبَا سُفْيَانَ عَلَى بَغْلَةِ النَّبِيِّ ﷺ، وَيُجِيرُهُ مِنْ سَيْفِ عُمَرَ. وَأَمَامَ النِّيرَانِ العَشَرَةِ آلَافٍ، نَطَقَ أَبُو سُفْيَانَ بِالشَّهَادَةِ في فَجْرِ ذَلِكَ اليَوْمِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-03-aman-proclamation',
      time: 14.5,
      duration: 5.5,
      text: "The Prophet ﷺ proclaimed: 'Whoever enters the house of Abu Sufyan is safe; whoever closes his door is safe; whoever enters the Sacred Mosque is safe.' (Sahih Muslim 1780; Ibn Hisham 4/46)",
      textAr:
        'فَأَعْلَنَ النَّبِيُّ ﷺ: «مَنْ دَخَلَ دَارَ أَبِي سُفْيَانَ فَهُوَ آمِنٌ، وَمَنْ أَغْلَقَ بَابَهُ فَهُوَ آمِنٌ، وَمَنْ دَخَلَ المَسْجِدَ الحَرَامَ فَهُوَ آمِنٌ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-04-ansar-pass-by',
      time: 21,
      duration: 6,
      text: "The squadrons filed past Abu Sufyan in turn, until the Ansar's iron-clad Green Squadron came forward under Sa'd ibn 'Ubadah's banner. He called out: 'Today is the day of carnage; today the Ka'ba is made lawful!' The Prophet ﷺ corrected him: 'Sa'd has spoken falsely — today is a day on which Allah magnifies the Ka'ba.' (Bukhari 4280)",
      textAr:
        'وَمَرَّتِ الكَتَائِبُ تِبَاعًا عَلَى أَبِي سُفْيَانَ، حَتَّى أَقْبَلَتْ كَتِيبَةُ الأَنْصَارِ الخَضْرَاءُ في الحَدِيدِ، يَحْمِلُ رَايَتَهَا سَعْدُ بْنُ عُبَادَةَ، فَنَادَى: «اليَوْمَ يَوْمُ المَلْحَمَةِ، اليَوْمَ تُسْتَحَلُّ الكَعْبَةُ». فَرَدَّ النَّبِيُّ ﷺ: «كَذَبَ سَعْدٌ، بَلِ اليَوْمَ يَوْمٌ يُعَظِّمُ اللَّهُ فِيهِ الكَعْبَةَ».',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-05-four-columns',
      time: 28,
      duration: 6,
      text: "The Prophet ﷺ divided the army into four columns: al-Zubayr on the left wing, Khalid on the right from lower Mecca, Abu 'Ubayda leading the foot through Batn al-Wadi, and the Prophet himself entering from Kada in the upper pass. (Sahih Muslim 1780; Bukhari 4280)",
      textAr:
        'وَفَرَّقَ النَّبِيُّ ﷺ الجَيْشَ أَرْبَعَ كَتَائِبَ: الزُّبَيْرُ بْنُ العَوَّامِ عَلَى المُجَنِّبَةِ اليُسْرَى، وَخَالِدُ بْنُ الوَلِيدِ عَلَى المُجَنِّبَةِ اليُمْنَى مِنْ أَسْفَلِ مَكَّةَ، وَأَبُو عُبَيْدَةَ عَلَى الحُسَّرِ في بَطْنِ الوَادِي، وَدَخَلَ هُوَ ﷺ مِنْ كَدَاءَ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-06-surat-al-fath-recitation',
      time: 30.5,
      duration: 5,
      text: "He entered upon his she-camel al-Qaswa, with Usama ibn Zayd mounted behind him, his head bowed in humility almost to the saddle, reciting Surat al-Fath with vibrato: 'Verily, We have granted you a manifest victory.' (Bukhari 4281; al-Fath 48:1)",
      textAr:
        'دَخَلَ ﷺ عَلَى نَاقَتِهِ القَصْوَاءِ، وَخَلْفَهُ أُسَامَةُ بْنُ زَيْدٍ، وَقَدْ طَأْطَأَ رَأْسَهُ تَوَاضُعًا للَّهِ حَتَّى كَادَتْ لِحْيَتُهُ تَمَسُّ وَاسِطَةَ الرَّحْلِ، يَقْرَأُ سُورَةَ الفَتْحِ وَيُرَجِّعُ فِيهَا: ﴿إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا﴾.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-07-khandama-clash',
      time: 36,
      duration: 5,
      text: "No fighting occurred that day except at Khalid's column at al-Khandama, where 'Ikrima ibn Abi Jahl, Safwan ibn Umayya, and Suhayl ibn 'Amr had massed Qurayshi swords. Two Muslims were martyred — Kurz ibn Jabir al-Fihri and Khunays ibn Khalid — and roughly twelve Quraysh; the rest fled. (Sahih Muslim 1780; Ibn Hisham 4/49–50)",
      textAr:
        'وَلَمْ يَكُنْ قِتَالٌ يَوْمَئِذٍ إِلَّا في كَتِيبَةِ خَالِدٍ بِالخَنْدَمَةِ، حَيْثُ تَجَمَّعَ عِكْرِمَةُ بْنُ أَبِي جَهْلٍ وَصَفْوَانُ بْنُ أُمَيَّةَ وَسُهَيْلُ بْنُ عَمْرٍو في نَفَرٍ مِنْ قُرَيْشٍ. فَقُتِلَ مِنَ المُسْلِمِينَ كُرْزُ بْنُ جَابِرٍ الفِهْرِيُّ وَخُنَيْسُ بْنُ خَالِدٍ، وَمِنْ قُرَيْشٍ نَحْوُ اثْنَيْ عَشَرَ، وَفَرَّ الباقُونَ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-08-jaa-al-haqq',
      time: 42,
      duration: 6,
      text: "He entered the Sacred Mosque while three hundred and sixty idols stood around the House. He began striking them with a stick in his hand and reciting: 'Truth has come and falsehood has perished; verily, falsehood is ever bound to perish.' (Sahih al-Bukhari 4287; al-Isra 17:81)",
      textAr:
        'دَخَلَ ﷺ المَسْجِدَ الحَرَامَ، وَحَوْلَ البَيْتِ سِتُّونَ وَثَلَاثُمِائَةِ نُصُبٍ، فَجَعَلَ يَطْعُنُهَا بِعُودٍ في يَدِهِ وَيَقُولُ: ﴿وَقُلْ جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ ۚ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا﴾.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-09-kabah-image-purification',
      time: 46,
      duration: 4,
      text: "He refused to enter the Ka'ba until the images of Ibrahim and Isma'il holding divination arrows were erased, saying: 'May Allah destroy them — they knew well that those two never practiced divination.' (Sahih al-Bukhari 3352)",
      textAr:
        'وَأَبَى أَنْ يَدْخُلَ الكَعْبَةَ حَتَّى مُحِيَتْ صُوَرُ إِبْرَاهِيمَ وَإِسْمَاعِيلَ وَفي أَيْدِيهِمَا الأَزْلَامُ، وَقَالَ: «قَاتَلَهُمُ اللَّهُ، لَقَدْ عَلِمُوا مَا اسْتَقْسَمَا بِهَا قَطُّ».',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-10-bilal-rooftop',
      time: 49,
      duration: 5,
      text: "Then he ﷺ ordered Bilal — who only yesterday had been tortured in this very city — to ascend the roof of the Ka'ba and call the adhan. The voice of tawhid rose from atop the House for the first time, over the whole of Mecca. (Ibn Hisham; al-Waqidi, al-Maghazi)",
      textAr:
        'ثُمَّ أَمَرَ بِلَالًا، الذي عُذِّبَ في هَذِهِ المَدِينَةِ بِالأَمْسِ، أَنْ يَعْلُوَ ظَهْرَ الكَعْبَةِ وَيُؤَذِّنَ. فَارْتَفَعَ صَوْتُ التَّوْحِيدِ مِنْ فَوْقِ البَيْتِ لِأَوَّلِ مَرَّةٍ، فَوْقَ مَكَّةَ كُلِّهَا.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-11-khutba-quraysh-question',
      time: 55,
      duration: 6,
      text: "He stood at the door of the Ka'ba, gripping its lintel, and said to Quraysh: 'O assembly of Quraysh — what do you think I will do with you?' They said: 'Good — a noble brother, son of a noble brother.' He said: 'Go, for you are the freed ones.' (Ibn Hisham, al-Sirah; al-Bayhaqi, Sunan al-Kubra 16809)",
      textAr:
        'وَقَامَ ﷺ بِبَابِ الكَعْبَةِ آخِذًا بِعِضَادَتَيْهِ، فَقَالَ لِقُرَيْشٍ: «يَا مَعْشَرَ قُرَيْشٍ، مَا تَرَوْنَ أَنِّي فَاعِلٌ بِكُمْ؟» قَالُوا: «خَيْرًا، أَخٌ كَرِيمٌ وَابْنُ أَخٍ كَرِيمٍ». قَالَ: «اذْهَبُوا فَأَنْتُمُ الطُّلَقَاءُ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-12-q-49-13',
      time: 60,
      duration: 5,
      text: "He recited: 'O mankind, We have created you from male and female and made you into peoples and tribes that you may know one another; indeed, the noblest of you in the sight of Allah is the most pious.' And he abolished every claim of pre-Islamic privilege. (al-Hujurat 49:13; Ibn Hisham, Sirah 4/51)",
      textAr:
        'وَتَلَا قَوْلَهُ تَعَالَى: ﴿يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا ۚ إِنَّ أَكْرَمَكُمْ عِندَ اللَّهِ أَتْقَاكُمْ﴾، وَهَدَمَ كُلَّ مَأْثَرَةٍ مِنْ مَآثِرِ الجَاهِلِيَّةِ.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-13-la-hijrata-bad-al-fath',
      time: 65,
      duration: 4,
      text: "He returned the key of the Ka'ba to 'Uthman ibn Talha of Banu Shayba, and declared: 'There is no emigration after the Conquest — but jihad and intention.' (Sahih al-Bukhari 2783, 1834; tafsir of Q 4:58 in Tabari and Ibn Kathir)",
      textAr:
        'وَرَدَّ مِفْتَاحَ الكَعْبَةِ إِلَى عُثْمَانَ بْنِ طَلْحَةَ مِنْ بَنِي شَيْبَةَ، وَقَالَ ﷺ: «لَا هِجْرَةَ بَعْدَ الفَتْحِ، وَلَكِنْ جِهَادٌ وَنِيَّةٌ».',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-14-haram-eternal',
      time: 68,
      duration: 4,
      text: "He delivered the sermon: 'Allah made this city sacred the day He created the heavens and the earth; it is sacred by Allah's sanctity until the Day of Judgment. Fighting in it was not lawful for anyone before me, nor was it made lawful for me except one hour of one day.' (Sahih al-Bukhari 1834, 3189)",
      textAr:
        'وَخَطَبَ ﷺ فَقَالَ: «إِنَّ هَذَا البَلَدَ حَرَّمَهُ اللَّهُ يَوْمَ خَلَقَ السَّمَاوَاتِ وَالأَرْضَ، فَهُوَ حَرَامٌ بِحُرْمَةِ اللَّهِ إِلَى يَوْمِ القِيَامَةِ، وَإِنَّهُ لَمْ يَحِلَّ القِتَالُ فِيهِ لِأَحَدٍ قَبْلِي، وَلَمْ يَحِلَّ لِي إِلَّا سَاعَةً مِنْ نَهَارٍ».',
      style: 'quote',
      position: 'center',
    },
  ],

  cameraScript: [
    // Open wide on Marr al-Zahran valley — 10,000 fires igniting in waves
    { time: 0, position: { x: 800, y: 200 }, zoom: 0.45, duration: 4, easing: 'power2.out', type: 'overview' },
    // Slow pan east-to-west across the firelit camp
    { time: 4, position: { x: 800, y: 220 }, zoom: 0.5, duration: 3, easing: 'power2.inOut', type: 'pan' },
    // Tighten on al-Abbas riding the Prophet's white mule out toward al-Arak
    { time: 7, position: { x: 720, y: 280 }, zoom: 0.7, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'abu-sufyan-delegation' },
    // Close on the Prophet's tent — Umar's sword, the pardon, the shahada at dawn
    { time: 11, position: { x: 800, y: 240 }, zoom: 0.85, duration: 3, easing: 'power2.out', type: 'focus' },
    // Pull back as the threefold amnesty proclamation echoes across the camp
    { time: 14, position: { x: 800, y: 250 }, zoom: 0.5, duration: 4, easing: 'power2.inOut', type: 'zoom' },
    // Slide along the wadi narrows where columns parade past Abu Sufyan
    { time: 18, position: { x: 760, y: 320 }, zoom: 0.65, duration: 4, easing: 'power2.inOut', type: 'pan' },
    // Track the Ansar's iron-clad parade — Sa'd's slogan and the Prophet's correction
    { time: 22, position: { x: 780, y: 350 }, zoom: 0.7, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'ansar-column' },
    // Lift to high overview as four columns converge on the Mecca basin
    { time: 26, position: { x: 800, y: 500 }, zoom: 0.4, duration: 4, easing: 'power2.out', type: 'overview' },
    // Pan toward Kada (upper pass) tracking the Prophet's column
    { time: 30, position: { x: 880, y: 540 }, zoom: 0.6, duration: 3, easing: 'power2.inOut', type: 'pan' },
    // Follow al-Qaswa through Kada — bowed head, Surat al-Fath, golden dawn
    { time: 33, position: { x: 900, y: 560 }, zoom: 0.85, duration: 4, easing: 'power2.out', type: 'follow', followEntityId: 'prophet-column' },
    // Snap south to al-Khandama — Khalid's column meeting the only blade-clash of the day
    { time: 37, position: { x: 600, y: 760 }, zoom: 0.75, duration: 4, easing: 'power2.inOut', type: 'pan' },
    // Cinematic descent into the Ka'ba precinct as 360 idols are struck down
    { time: 41, position: { x: 800, y: 580 }, zoom: 0.9, duration: 4, easing: 'power2.out', type: 'focus' },
    // Hold close on the Ka'ba interior as images of Ibrahim and Isma'il are erased
    { time: 45, position: { x: 800, y: 580 }, zoom: 0.8, duration: 3, easing: 'power2.inOut', type: 'focus' },
    // Vertical lift as Bilal climbs the Ka'ba — first adhan from the rooftop
    { time: 48, position: { x: 800, y: 560 }, zoom: 0.7, duration: 3, easing: 'power2.out', type: 'zoom' },
    // Wide reaction shot — adhan rolling across the basin to the encircling ridges
    { time: 51, position: { x: 800, y: 540 }, zoom: 0.6, duration: 3, easing: 'power2.inOut', type: 'pan' },
    // Locked wide on the door of the Ka'ba for the khutba — the Prophet at the lintel
    { time: 54, position: { x: 800, y: 580 }, zoom: 0.55, duration: 4, easing: 'power2.out', type: 'focus' },
    // Slow push as Q 49:13 is recited and jahili pride is buried
    { time: 58, position: { x: 800, y: 580 }, zoom: 0.65, duration: 3, easing: 'power2.inOut', type: 'zoom' },
    // Slide to al-Safa for the men's and women's bay'a — Hind among them
    { time: 61, position: { x: 840, y: 600 }, zoom: 0.6, duration: 4, easing: 'power2.inOut', type: 'pan' },
    // Close on 'Uthman ibn Talha receiving the keys — Banu Shayba's perpetual trust
    { time: 65, position: { x: 820, y: 590 }, zoom: 0.7, duration: 3, easing: 'power2.out', type: 'focus' },
    // Pull back to overview — the basin in full morning light, banners at rest
    { time: 68, position: { x: 800, y: 500 }, zoom: 0.45, duration: 3, easing: 'power2.inOut', type: 'zoom' },
    // Final ridge-overlook for the haram-eternal decree, fade to closing card
    { time: 71, position: { x: 800, y: 400 }, zoom: 0.4, duration: 1, easing: 'power2.out', type: 'overview' },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 2,
    enemyCasualties: 12,
    summary:
      "On 20 Ramadan 8 AH (~11 January 630 CE), the Prophet ﷺ entered Mecca with 10,000, his head bowed in humility on al-Qaswa as he recited Surat al-Fath. The army was divided into four columns entering through Kada, Kuda, Adhakhir, and Batn al-Wadi. The only fighting occurred at al-Khandama, where Kurz ibn Jabir al-Fihri and Khunays ibn Khalid were martyred and roughly twelve Quraysh were killed. The 360 idols were broken, Bilal called the adhan from atop the Ka'ba, the Prophet ﷺ pronounced the general amnesty 'Go, you are the freed ones,' returned the key to Banu Shayba, and Mecca fell with the smallest bloodshed in the history of conquests.",
    summaryAr:
      'في العِشْرِينَ مِنْ رَمَضَانَ سَنَةَ ثَمَانٍ لِلْهِجْرَةِ، دَخَلَ النَّبِيُّ ﷺ مَكَّةَ في عَشَرَةِ آلَافٍ، طَأْطَأَ رَأْسَهُ تَوَاضُعًا عَلَى نَاقَتِهِ القَصْوَاءِ يَقْرَأُ سُورَةَ الفَتْحِ. فُرِّقَ الجَيْشُ أَرْبَعَ كَتَائِبَ مِنْ كَدَاءَ وَكُدًى وَأَذَاخِرَ وَبَطْنِ الوَادِي، فَلَمْ يَكُنْ قِتَالٌ إِلَّا في الخَنْدَمَةِ حَيْثُ اسْتُشْهِدَ كُرْزُ بْنُ جَابِرٍ وَخُنَيْسُ بْنُ خَالِدٍ وَقُتِلَ مِنْ قُرَيْشٍ نَحْوُ اثْنَيْ عَشَرَ. ثُمَّ كُسِّرَتْ الأَصْنَامُ السِّتُّونَ وَالثَّلَاثُمِائَةُ، وَأَذَّنَ بِلَالٌ فَوْقَ الكَعْبَةِ، وَخَطَبَ ﷺ فَأَعْلَنَ العَفْوَ العَامَّ: «اذْهَبُوا فَأَنْتُمُ الطُّلَقَاءُ»، وَرَدَّ المِفْتَاحَ إِلَى بَنِي شَيْبَةَ، فَتَمَّ الفَتْحُ بِأَدْنَى دَمٍ في تَارِيخِ الفُتُوحَاتِ.',
    significance:
      "Fath Makkah is the greatest conquest of the Sirah. The Hijazi polytheist order collapsed; the new community's spiritual and political capitals were unified under the Sacred House. The Prophet ﷺ established permanent juridical norms: Mecca's eternal sanctity (Bukhari 1834), the end of hijra from Mecca, restoration of trusts (Q 4:58) by returning the key to Banu Shayba, and the abolition of jahili tribal pride through Q 49:13. The Year of Delegations (9 AH) followed, with Surat al-Nasr marking the wave-conversions. The model — bloodless entry, universal amnesty, protection of family and property — became the template for the Rashidun conquests of Damascus, Jerusalem, and Egypt.",
    significanceAr:
      'فَتْحُ مَكَّةَ هُوَ الفَتْحُ الأَعْظَمُ في السِّيرَةِ، بِهِ زَالَ نِظَامُ الشِّرْكِ في الحِجَازِ، وَتَوَحَّدَتْ القِيَادَةُ الرُّوحِيَّةُ وَالسِّيَاسِيَّةُ لِلْأُمَّةِ الجَدِيدَةِ في كَنَفِ البَيْتِ الحَرَامِ. أَنْشَأَ النَّبِيُّ ﷺ بِهَذَا الفَتْحِ سُنَنًا فِقْهِيَّةً دَائِمَةً: حُرْمَةُ مَكَّةَ إِلَى يَوْمِ القِيَامَةِ، وَانْقِطَاعُ الهِجْرَةِ مِنْهَا، وَأَدَاءُ الأَمَانَاتِ بِرَدِّ السِّدَانَةِ إِلَى بَنِي شَيْبَةَ، وَإِبْطَالُ مَآثِرِ الجَاهِلِيَّةِ بِتِلَاوَةِ آيَةِ التَّعَارُفِ. وَفي العَامِ التَّالِي دَخَلَ النَّاسُ في دِينِ اللَّهِ أَفْوَاجًا، فَكَانَ عَامَ الوُفُودِ (٩هـ)، وَنَزَلَتْ سُورَةُ النَّصْرِ تُؤَرِّخُ لِهَذَا التَّحَوُّلِ الكَوْنِيِّ. وَصَارَ نَمَطُ الفَتْحِ — الدُّخُولُ بِلَا دَمٍ، وَالعَفْوُ العَامُّ، وَحِفْظُ الأَهْلِ وَالمَالِ — قَالَبًا لِفُتُوحَاتِ الرَّاشِدِينَ في دِمَشْقَ وَالقُدْسِ وَمِصْرَ.',
  },

  totalDuration: 72,
};
