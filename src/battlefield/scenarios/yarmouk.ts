import type { BattleScenario } from '../types/scenario';

/**
 * مَعْرَكَةُ اليَرْمُوكِ — يَوْمٌ مِنْ أَيَّامِ اللَّهِ
 * The Battle of Yarmouk — One of the Days of God
 *
 * 5–12 Rajab 15 AH / 15–20 August 636 CE — six days of continuous
 * combat on the Yarmouk plateau of the Hauran plain (modern Jordan-
 * Syria-Israel tripoint). The killing-ground was hemmed by three
 * ravines: Wadi al-Yarmouk to the south, Wadi al-Ruqqad to the west,
 * and Wadi Allan to the north-east. Tel al-Jumm'a anchored the Muslim
 * right; the Hauran lava harra screened the Muslim rear.
 *
 * After the fall of Damascus (14 AH), Heraclius mustered the largest
 * field army Byzantium had assembled in a generation — Greek imperial
 * regulars under Theodore Trithyrius the sakellarios, Armenian foot
 * under Vahan/Bahan the magister militum per Orientem, Slav levies
 * under Buccinator/Qanatir, Gregory's Armenians on the right (Sayf
 * via al-Tabari reports rank-to-rank chaining as a vow against
 * retreat — frame as transmitted tradition), cataphract heavy horse,
 * 8,000 archers, and ~12,000 Christian Arab Ghassanid horse-archers
 * under Jabala ibn al-Ayham, the last Ghassanid king (al-Baladhuri,
 * Futuh al-Buldan). Total: ~110,000 in classical Arabic sources;
 * ~70-80,000 in modern reconstructions (Kaegi 1992; Donner 1981).
 *
 * The Muslims fielded ~36,000 — the four field armies of Sham unified
 * by 'Umar's decree on the eve of battle. In the war council, Abu
 * 'Ubayda ibn al-Jarrah, the Caliph's nominal commander-in-chief,
 * voluntarily ceded tactical command to Khalid ibn al-Walid. Khalid
 * reorganised the host into 36 small infantry kuradis along a 12 km
 * tabi'a, four cavalry regiments behind the wings, and the al-tali'a
 * al-mutaharrika — his signature centralised mobile guard cavalry
 * reserve. The wings: Yazid ibn Abi Sufyan on the left anchored on
 * the Yarmouk gorge; 'Amr ibn al-'As on the right anchored on Tel
 * al-Jumm'a and the Jabiyah road; Abu 'Ubayda left-centre, Shurahbil
 * ibn Hasanah right-centre. Khalid addressed the host: «إِنَّ هَذَا
 * يَوْمٌ مِنْ أَيَّامِ اللَّهِ، لَا يَنْبَغِي فِيهِ الفَخْرُ وَلَا
 * البَغْيُ، أَخْلِصُوا جِهَادَكُمْ وَأَرِيدُوا اللَّهَ بِعَمَلِكُمْ»
 * (al-Tabari via the Sayf b. 'Umar transmission).
 *
 * Day 1 — yawm al-Imdad. The mubarizun opened the day: al-Zubayr,
 * al-Qa'qa', and Abdul-Rahman ibn Abi Bakr picked off Byzantine
 * officers in single combat. Vahan's midday probing attack was
 * repulsed. Day 2 — yawm al-Tasawi. Vahan launched a coordinated
 * dawn assault; Yazid's left wing was driven back toward the camp.
 * The women of Quraysh, led by Hind bint 'Utbah with Asma bint Yazid
 * al-Ansariyya, dismantled tents, seized the tent-poles, and shamed
 * fleeing men back into the line — «إِلَى أَيْنَ؟ إِلَى النَّارِ
 * تَفِرُّونَ؟» Khalid's mobile guard wheeled left to stabilise.
 * Dairjan, the Byzantine left-centre commander, was killed in the
 * press, collapsing Roman morale.
 *
 * Day 3 — yawm al-Jamajim, the Day of Skulls. Vahan shifted the
 * weight of his attack onto the Muslim right under 'Amr and
 * Shurahbil. The mobile guard sprinted laterally behind the line and
 * counter-charged the Slav left, halting the Byzantine push. Day 4 —
 * yawm al-Aghwath, the Day of Cries-for-Help, also called the Day
 * of Lost Eyes. Byzantine archers darkened the sky with arrow-
 * volleys; some seven hundred Muslims were blinded in the eye, Abu
 * Sufyan ibn Harb among them (Ibn Kathir, al-Bidaya wa al-Nihaya).
 * 'Ikrima ibn Abi Jahl rose in his stirrups, gathered ~400 Quraysh
 * nobles in the bay'at al-mawt — the pledge of death — and charged
 * in one wave. Most did not return; 'Ikrima died of his wounds that
 * night. The women re-entered the line.
 *
 * Day 5 — Vahan's emissary (Jurja/George) crossed under a green
 * branch offering tribute and dinars for Muslim withdrawal. Khalid
 * refused with the famous reply preserved by al-Azdi (Futuh al-Sham,
 * transmitted): «لَيْسَ الَّذِي أَخْرَجَنَا حَاجَةَ الدُّنْيَا،
 * وَإِنَّمَا أَخْرَجَنَا أَنْ نُشْرِبَ دِمَاءَكُمْ». By night
 * Khalid sent Dhirar ibn al-Azwar with 500 horse on the longest
 * march of the campaign — north-west across the upper plateau,
 * skirting the Byzantine right under starlight, to seize Jisr 'Ayn
 * Dhakar over Wadi al-Ruqqad. The sole crossing was taken before
 * dawn. The Byzantine retreat route was already cut.
 *
 * Day 6 — God brought the dawn over them, and a strong khamsin wind
 * from the south-east blew dust into the Romans' faces. Khalid
 * massed all Muslim cavalry — ~8,000 horse — into one fist and
 * executed his four-phase envelopment: separated the Byzantine
 * cavalry from the foot and swept the Roman left horse from the
 * field; wheeled around behind the Roman left and struck the centre
 * from the rear; Theodore Trithyrius fell slain. The Byzantine line
 * dissolved westward toward what they thought was escape. The seized
 * bridge was revealed. The press funneled into the cliffs of Wadi
 * al-Ruqqad and Wadi Allan; tens of thousands fell into the depths
 * and were broken on the rocks below (al-Tabari). The terrain — not
 * Muslim swords — killed most of the Byzantine army. Vahan escaped
 * with a remnant; he was caught and killed near Damascus.
 *
 * Aftermath. Heraclius received the news at Antioch and withdrew to
 * Constantinople with the True Cross, never to mount a serious
 * reconquest. Tradition preserves his farewell to Syria (al-Tabari
 * and al-Baladhuri, treated as a literary topos by modern historians,
 * e.g. Kaegi 1992): «سَلَامٌ عَلَيْكِ يَا سُورِيَةُ سَلَامًا لَا
 * اِجْتِمَاعَ بَعْدَهُ». Damascus was retaken; within a decade,
 * Sham, Armenia, and Egypt fell to the Rashidun. Casualties:
 * ~4,000 Muslim martyrs (including 'Ikrima ibn Abi Jahl and his
 * death-pledge band); Byzantine losses ranged from ~10-50,000
 * (modern) to 70-120,000 (classical Arabic sources). Together with
 * Qadisiyyah and Yamama, Yarmouk forms the strategic triangle on
 * which the Rashidun state was built.
 *
 * Sources: al-Tabari, Tarikh al-Rusul wa-l-Muluk (year 15 AH, Sayf
 *          b. 'Umar transmission); al-Baladhuri, Futuh al-Buldan;
 *          al-Azdi, Futuh al-Sham (transmitted); Ibn Kathir,
 *          al-Bidaya wa al-Nihaya 7/4–18; Ibn al-Athir, al-Kamil;
 *          Theophanes, Chronographia AM 6126; Akram, The Sword of
 *          Allah Ch. 35–36; Nicolle, Yarmuk 636 AD (Osprey 1994);
 *          Kaegi, Byzantium and the Early Islamic Conquests (1992);
 *          Donner, The Early Islamic Conquests (1981).
 */
export const battleOfYarmouk: BattleScenario = {
  id: 'battle-of-yarmouk',
  name: 'Battle of Yarmouk',
  nameAr: 'معركة اليرموك',
  date: '5–12 Rajab 15 AH (15–20 August 636 CE)',
  location: 'Yarmouk plateau on the Hauran plain — modern Jordan-Syria-Israel tripoint',
  description:
    "Six days of continuous combat (15-20 August 636 CE) on the Yarmouk plateau, hemmed by three ravines — Wadi al-Yarmouk to the south, Wadi al-Ruqqad to the west, and Wadi Allan to the north-east. The four field armies of Sham unified under 'Umar's decree; Abu 'Ubayda ibn al-Jarrah ceded tactical command to Khalid ibn al-Walid in the war council. Khalid reorganised ~36,000 Muslims into 36 small infantry kuradis along a 12 km tabi'a, four cavalry regiments behind the wings, and his signature centralised mobile guard (al-tali'a al-mutaharrika). Facing them, ~110,000 Byzantines and allies (classical figures; ~70-80k modern) under Vahan/Bahan the Armenian magister militum, Theodore Trithyrius the sakellarios, the Slav prince Buccinator/Qanatir, Gregory's Armenians (Sayf via al-Tabari reports rank-chaining as a transmitted vow), cataphracts, 8,000 archers, and ~12,000 Ghassanid horse-archers under Jabala ibn al-Ayham (al-Baladhuri). Khalid opened with the 'one of the days of God' khutba (al-Tabari via Sayf). Day 1 (yawm al-Imdad): mubarizun duels and a repulsed Byzantine probe. Day 2 (yawm al-Tasawi): Vahan's dawn assault drove Yazid's left wing back to the camp; the women of Quraysh under Hind bint 'Utbah seized tent-poles and shamed fleeing men back into the line; Dairjan, the Byzantine left-centre commander, was killed. Day 3 (yawm al-Jamajim, the Day of Skulls): the mobile guard sprinted laterally and counter-charged the Slav left. Day 4 (yawm al-Aghwath, the Day of Lost Eyes): Byzantine archers blinded ~700 Muslims in the eye, Abu Sufyan among them (Ibn Kathir); 'Ikrima ibn Abi Jahl led the bay'at al-mawt of ~400 Quraysh nobles and was mortally wounded. Day 5: Vahan's emissary offered tribute; Khalid refused with «لَيْسَ الَّذِي أَخْرَجَنَا حَاجَةَ الدُّنْيَا...» (al-Azdi, Futuh al-Sham, transmitted). By night, Dhirar ibn al-Azwar with 500 horse seized Jisr 'Ayn Dhakar over Wadi al-Ruqqad — the sole Byzantine retreat route. Day 6: a khamsin wind from the south-east drove dust into Roman faces; Khalid massed ~8,000 horse and executed his four-phase envelopment — separated cavalry from foot, swept the Roman left horse from the field, wheeled behind the line and struck the centre from the rear (Theodore fell). The Byzantine line dissolved westward; the seized bridge was revealed; the press funneled into the cliffs of Wadi al-Ruqqad and Wadi Allan, where tens of thousands fell into the depths and were broken on the rocks (al-Tabari). Vahan escaped with a remnant and was killed near Damascus. Casualties: ~4,000 Muslim martyrs, including 'Ikrima and his death-pledge band; Byzantine losses ranged from ~10-50,000 (modern) to 70-120,000 (classical). Heraclius at Antioch turned away to Constantinople, his farewell preserved as literary tradition: «سَلَامٌ عَلَيْكِ يَا سُورِيَةُ سَلَامًا لَا اِجْتِمَاعَ بَعْدَهُ» (al-Tabari).",
  descriptionAr:
    'فِي رَجَبٍ مِنْ سَنَةِ خَمْسَ عَشْرَةَ لِلْهِجْرَةِ، اِلْتَقَى الجَمْعَانِ عَلَى سَهْلِ اليَرْمُوكِ في حَوْرَانَ بَيْنَ ثَلَاثَةِ أَوْدِيَةٍ سَحِيقَةٍ: وَادِي اليَرْمُوكِ جَنُوبًا، وَوَادِي الرُّقَّادِ غَرْبًا، وَوَادِي العَلَّانِ شَمَالًا شَرْقِيًّا. وَحَّدَ عُمَرُ بنُ الخَطَّابِ أُمَرَاءَ الشَّامِ تَحْتَ رَايَةٍ وَاحِدَةٍ، وَتَنَازَلَ أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ — أَمِيرُ الجَيْشِ بِكِتَابِ الخَلِيفَةِ — عَنِ القِيَادَةِ المَيْدَانِيَّةِ لِخَالِدِ بنِ الوَلِيدِ في مَجْلِسِ الحَرْبِ. فَنَظَّمَ خَالِدٌ سِتَّةً وَثَلَاثِينَ كُرْدُوسًا مِنَ المُشَاةِ في تَعْبِئَةٍ طُولُهَا اِثْنَا عَشَرَ كِيلُومِتْرًا، وَأَرْبَعَ كَتَائِبِ فُرْسَانٍ خَلْفَ الجَنَاحَيْنِ، وَالحَرَسَ المُتَحَرِّكَ فِي القَلْبِ — وَهُوَ اِبْتِكَارُهُ العَسْكَرِيُّ. كَانَ المُسْلِمُونَ نَحْوَ سِتَّةٍ وَثَلَاثِينَ أَلْفًا، وَكَانَ الرُّومُ وَأَحْلَافُهُمْ فِي الرِّوَايَاتِ الكَلَاسِيكِيَّةِ نَحْوَ مِائَةٍ وَعَشَرَةِ آلَافٍ بِقِيَادَةِ بَاهَانَ الأَرْمَنِيِّ وَتَدَارُقَ السَّكَلَّارِيِّ، وَمَعَهُمُ الصَّقَالِبَةُ وَالأَرْمَنُ وَالمُدَجَّجُونَ وَرُمَاةُ الرُّومِ وَغَسَّانُ بِقِيَادَةِ جَبَلَةَ بنِ الأَيْهَمِ. خَطَبَ خَالِدٌ فِي النَّاسِ: «إِنَّ هَذَا يَوْمٌ مِنْ أَيَّامِ اللَّهِ، لَا يَنْبَغِي فِيهِ الفَخْرُ وَلَا البَغْيُ». فَكَانَ اليَوْمُ الأَوَّلُ يَوْمَ الإِمْدَادِ بِالمُبَارَزَاتِ وَزَحْفَةِ بَاهَانَ الَّتِي رُدَّتْ. ثُمَّ يَوْمُ التَّسَاوِي إِذْ كَسَرَ الرُّومُ المَيْسَرَةَ إِلَى المُعَسْكَرِ، فَخَرَجَتْ نِسَاءُ قُرَيْشٍ بِأَعْمِدَةِ الخِيَامِ تَقُودُهُنَّ هِنْدُ بِنْتُ عُتْبَةَ يَصِحْنَ بِالفَارِّينَ: «إِلَى أَيْنَ؟ إِلَى النَّارِ تَفِرُّونَ؟»، وَسَقَطَ الدَّرَاقِسُ صَاحِبُ القَلْبِ الأَيْسَرِ قَتِيلًا. ثُمَّ يَوْمُ الجَمَاجِمِ حَيْثُ زَحَفَ الحَرَسُ المُتَحَرِّكُ مِنَ القَلْبِ إِلَى المَيْمَنَةِ فَرَدَّ هَجْمَةَ الصَّقَالِبَةِ. ثُمَّ يَوْمُ الأَغْوَاثِ — يَوْمُ فَقْءِ العُيُونِ — أَمْطَرَ رُمَاةُ الرُّومِ السَّمَاءَ نِبَالًا فَأُصِيبَ نَحْوُ سَبْعِمِائَةِ مُسْلِمٍ فِي أَعْيُنِهِمْ، وَفُقِئَتْ يَوْمَئِذٍ عَيْنُ أَبِي سُفْيَانَ بنِ حَرْبٍ، فَتَقَدَّمَ عِكْرِمَةُ بنُ أَبِي جَهْلٍ بِأَرْبَعِمِائَةٍ مِنْ سَادَاتِ قُرَيْشٍ تَبَايَعُوا عَلَى المَوْتِ فَحَمَلُوا حَمْلَةً وَاحِدَةً، فَلَمْ يَرْجِعْ أَكْثَرُهُمْ، وَمَاتَ عِكْرِمَةُ مِنْ جِرَاحِهِ تِلْكَ اللَّيْلَةَ. وَفِي اليَوْمِ الخَامِسِ بَعَثَ بَاهَانُ يَعْرِضُ الذَّهَبَ وَالاِنْصِرَافَ، فَأَجَابَ خَالِدٌ: «لَيْسَ الَّذِي أَخْرَجَنَا حَاجَةَ الدُّنْيَا، وَإِنَّمَا أَخْرَجَنَا أَنْ نُشْرِبَ دِمَاءَكُمْ». وَفِي جَوْفِ تِلْكَ اللَّيْلَةِ بَعَثَ ضِرَارَ بنَ الأَزْوَرِ في خَمْسِمِائَةِ فَارِسٍ، فَاسْتَوْلَوْا عَلَى جِسْرِ عَيْنِ ذَكَرَ عَلَى وَادِي الرُّقَّادِ. وَفِي اليَوْمِ السَّادِسِ هَبَّتْ رِيحٌ شَدِيدَةٌ مِنَ الجَنُوبِ الشَّرْقِيِّ فِي وُجُوهِ الرُّومِ، فَسَاقَ خَالِدٌ فُرْسَانَهُ كُتْلَةً وَاحِدَةً فَفَصَلَ الفُرْسَانَ عَنِ المُشَاةِ، ثُمَّ دَارَ مِنْ خَلْفِ المَيْسَرَةِ فَضَرَبَ القَلْبَ مِنْ وَرَائِهِ، وَسَقَطَ تَدَارُقُ صَرِيعًا. وَوَلَّى الرُّومُ مُنْهَزِمِينَ نَحْوَ الجِسْرِ، فَإِذَا الجِسْرُ مَأْخُوذٌ، فَتَدَافَعُوا عَلَى شِفَاهِ وَادِي الرُّقَّادِ وَوَادِي العَلَّانِ، فَتَهَاوَوْا فِي الأَعْمَاقِ وَتَكَسَّرُوا عَلَى الصُّخُورِ. اِسْتُشْهِدَ مِنَ المُسْلِمِينَ نَحْوُ أَرْبَعَةِ آلَافٍ، وَهَلَكَ مِنَ الرُّومِ خَلْقٌ كَثِيرٌ. وَلَمَّا بَلَغَ هِرَقْلَ الخَبَرُ بِأَنْطَاكِيَةَ، اِنْصَرَفَ إِلَى القُسْطَنْطِينِيَّةِ، وَيُرْوَى أَنَّهُ قَالَ: «سَلَامٌ عَلَيْكِ يَا سُورِيَةُ سَلَامًا لَا اِجْتِمَاعَ بَعْدَهُ».',

  // Pre-dawn opens the campaign; the providential khamsin wind on Day 6 darkens the sky with dust.
  dayPhase: 'dawn',
  weather: 'dust',
  // Six days of continuous combat (15–20 August 636 CE), plus one day of aftermath.
  actualDayCount: 6,

  map: {
    width: 1600,
    height: 1100,
    terrain: [
      // Base Hauran plateau — the central killing ground
      {
        id: 'hauran-plateau',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x6b5430,
        label: 'سَهْلُ حَوْرَان',
      },
      // Wadi al-Yarmouk — southern gorge anchoring the Muslim left
      {
        id: 'wadi-al-yarmouk',
        type: 'gorge',
        polygon: [
          { x: 0, y: 950 },
          { x: 1600, y: 950 },
          { x: 1600, y: 1100 },
          { x: 0, y: 1100 },
        ],
        color: 0x140c06,
        label: 'وَادِي اليَرْمُوك',
      },
      // Wadi Allan — north-eastern tributary forming the third cliff barrier
      {
        id: 'wadi-allan',
        type: 'gorge',
        polygon: [
          { x: 600, y: 50 },
          { x: 1500, y: 50 },
          { x: 1500, y: 200 },
          { x: 600, y: 200 },
        ],
        color: 0x140c06,
        label: 'وَادِي العَلَّان',
      },
      // Wadi al-Ruqqad — western ravine, the death-trap for routed Byzantines
      {
        id: 'wadi-al-ruqqad',
        type: 'gorge',
        polygon: [
          { x: 100, y: 100 },
          { x: 250, y: 100 },
          { x: 250, y: 1000 },
          { x: 100, y: 1000 },
        ],
        color: 0x140c06,
        label: 'وَادِي الرُّقَّاد',
      },
      // Tel al-Jumm'a — low rise on the Muslim right, Khalid's command vantage
      {
        id: 'tel-al-jummaa',
        type: 'elevated',
        polygon: [
          { x: 900, y: 220 },
          { x: 1100, y: 220 },
          { x: 1100, y: 360 },
          { x: 900, y: 360 },
        ],
        color: 0x6e5a44,
        label: "تَلُّ الجُمْعَة",
      },
      // Hauran lava harra — broken rocky margin east of the Muslim camp
      {
        id: 'hauran-harra',
        type: 'rocky',
        polygon: [
          { x: 1430, y: 200 },
          { x: 1600, y: 200 },
          { x: 1600, y: 950 },
          { x: 1430, y: 950 },
        ],
        color: 0x33241a,
        label: 'حَرَّةُ حَوْرَان',
      },
      // Jabiyah road — northern Roman highway crossing the Muslim right
      {
        id: 'jabiyah-road',
        type: 'sand',
        polygon: [
          { x: 280, y: 200 },
          { x: 1430, y: 200 },
          { x: 1430, y: 260 },
          { x: 280, y: 260 },
        ],
        color: 0x7a6440,
        label: 'طَرِيقُ الجَابِيَة',
      },
      // Muslim camp east of the line — the women's rallying point
      {
        id: 'muslim-camp',
        type: 'sand',
        polygon: [
          { x: 1180, y: 500 },
          { x: 1420, y: 500 },
          { x: 1420, y: 720 },
          { x: 1180, y: 720 },
        ],
        color: 0x8c6f3f,
        label: 'مُعَسْكَرُ المُسْلِمِينَ',
      },
      // Byzantine camp just east of Wadi al-Ruqqad — Vahan's command tent
      {
        id: 'byzantine-camp',
        type: 'sand',
        polygon: [
          { x: 280, y: 280 },
          { x: 480, y: 280 },
          { x: 480, y: 480 },
          { x: 280, y: 480 },
        ],
        color: 0x7a6440,
        label: 'مُعَسْكَرُ الرُّوم',
      },
      // The bridge of Ayn Dhakar — sole crossing over Wadi al-Ruqqad
      {
        id: 'ayn-dhakar-bridge',
        type: 'flat',
        polygon: [
          { x: 250, y: 460 },
          { x: 320, y: 460 },
          { x: 320, y: 510 },
          { x: 250, y: 510 },
        ],
        color: 0x9a7a40,
        label: "جِسْرُ عَيْنِ ذَكَر",
      },
      // No-man's-land between the two armies
      {
        id: 'no-mans-land',
        type: 'flat',
        polygon: [
          { x: 600, y: 360 },
          { x: 1000, y: 360 },
          { x: 1000, y: 850 },
          { x: 600, y: 850 },
        ],
        color: 0x5c4b2c,
      },
    ],
    landmarks: [
      {
        id: 'wadi-al-ruqqad-marker',
        position: { x: 175, y: 550 },
        type: 'mountain_pass',
        label: 'Wadi al-Ruqqad — Death-Trap Ravine',
        labelAr: 'وَادِي الرُّقَّاد',
      },
      {
        id: 'ayn-dhakar-bridge-marker',
        position: { x: 285, y: 485 },
        type: 'marker',
        label: 'Jisr Ayn Dhakar — The Sealed Bridge',
        labelAr: "جِسْرُ عَيْنِ ذَكَر",
      },
      {
        id: 'wadi-al-yarmouk-marker',
        position: { x: 800, y: 1025 },
        type: 'mountain_pass',
        label: 'Wadi al-Yarmouk — Southern Gorge',
        labelAr: 'وَادِي اليَرْمُوك',
      },
      {
        id: 'wadi-allan-marker',
        position: { x: 1050, y: 125 },
        type: 'mountain_pass',
        label: 'Wadi Allan — North-Eastern Cliff',
        labelAr: 'وَادِي العَلَّان',
      },
      {
        id: 'tel-al-jummaa-marker',
        position: { x: 1000, y: 290 },
        type: 'hill',
        label: "Tel al-Jumm'a — Khalid's Vantage",
        labelAr: "تَلُّ الجُمْعَة",
      },
      {
        id: 'muslim-camp-marker',
        position: { x: 1300, y: 610 },
        type: 'camp',
        label: "Muslim Camp — Where the Women Stood",
        labelAr: 'مُعَسْكَرُ المُسْلِمِينَ',
      },
      {
        id: 'byzantine-camp-marker',
        position: { x: 380, y: 380 },
        type: 'camp',
        label: "Byzantine Camp — Vahan's Command",
        labelAr: 'مُعَسْكَرُ الرُّوم',
      },
      {
        id: 'jabiyah-road-marker',
        position: { x: 800, y: 230 },
        type: 'mountain_pass',
        label: 'Jabiyah Road',
        labelAr: 'طَرِيقُ الجَابِيَة',
      },
      {
        id: 'hauran-harra-marker',
        position: { x: 1515, y: 575 },
        type: 'mountain_pass',
        label: 'Hauran Lava Harra',
        labelAr: 'حَرَّةُ حَوْرَان',
      },
    ],
    backgroundColor: 0x1a1208,
  },

  forces: [
    // ─── Muslim Forces (~36,000 — four field armies unified under Khalid) ──
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 36400,
      units: [
        {
          // Khalid's signature centralised heavy cavalry reserve — the kuradis innovation
          id: 'khalid-mobile-guard',
          name: "Khalid's Mobile Guard",
          nameAr: 'كَتِيبَةُ الحَرَسِ المُتَحَرِّكِ بِقِيَادَةِ خَالِدٍ',
          troopType: 'heavy_cavalry',
          soldierCount: 4000,
          commander: 'خَالِدُ بنُ الوَلِيدِ',
          startPosition: { x: 1100, y: 550 },
          startFormation: 'wedge',
          startFacing: Math.PI, // facing west toward the Byzantines
          stats: { attack: 10, defense: 9, speed: 9, morale: 10 },
        },
        {
          // Abu Ubayda — the Caliph's nominal commander-in-chief, ceded tactical command
          id: 'abu-ubayda-left-center',
          name: "Abu Ubayda's Left-Centre",
          nameAr: 'كَتِيبَةُ القَلْبِ الأَيْسَرِ بِقِيَادَةِ أَبِي عُبَيْدَة',
          troopType: 'infantry',
          soldierCount: 7500,
          commander: 'أَبُو عُبَيْدَةَ بنُ الجَرَّاحِ',
          startPosition: { x: 950, y: 600 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 9, speed: 5, morale: 10 },
        },
        {
          // Shurahbil ibn Hasanah — right-centre infantry of the kuradis line
          id: 'shurahbil-right-center',
          name: "Shurahbil's Right-Centre",
          nameAr: 'كَتِيبَةُ القَلْبِ الأَيْمَنِ بِقِيَادَةِ شُرَحْبِيل',
          troopType: 'infantry',
          soldierCount: 7000,
          commander: 'شُرَحْبِيلُ بنُ حَسَنَةَ',
          startPosition: { x: 950, y: 480 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 9, speed: 5, morale: 10 },
        },
        {
          // Yazid ibn Abi Sufyan — left wing anchored on Wadi al-Yarmouk gorge (south)
          id: 'yazid-left-wing',
          name: "Yazid's Left Wing",
          nameAr: 'كَتِيبَةُ المَيْسَرَةِ بِقِيَادَةِ يَزِيد',
          troopType: 'infantry',
          soldierCount: 6000,
          commander: 'يَزِيدُ بنُ أَبِي سُفْيَانَ',
          startPosition: { x: 920, y: 800 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // 'Amr ibn al-'As — right wing anchored on Tel al-Jumm'a (north)
          id: 'amr-right-wing',
          name: "'Amr's Right Wing",
          nameAr: 'كَتِيبَةُ المَيْمَنَةِ بِقِيَادَةِ عَمْرٍو',
          troopType: 'infantry',
          soldierCount: 6000,
          commander: 'عَمْرُو بنُ العَاصِ',
          startPosition: { x: 920, y: 320 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 6, morale: 10 },
        },
        {
          // Composite-bow archers interspersed in the front of the tabi'a
          id: 'muslim-archers',
          name: 'Muslim Archers',
          nameAr: 'كَتِيبَةُ الرُّمَاةِ المُسْلِمِين',
          troopType: 'archers',
          soldierCount: 2500,
          commander: 'قِيَادَةُ الرُّمَاةِ',
          startPosition: { x: 1000, y: 540 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 5, speed: 5, morale: 10 },
        },
        {
          // 'Ikrima ibn Abi Jahl — leads the bay'at al-mawt of ~400 Quraysh nobles on Day 4
          id: 'ikrima-rearguard',
          name: "'Ikrima's Rearguard",
          nameAr: 'كَتِيبَةُ السَّاقَةِ بِقِيَادَةِ عِكْرِمَة',
          troopType: 'cavalry',
          soldierCount: 1500,
          commander: 'عِكْرِمَةُ بنُ أَبِي جَهْلٍ',
          startPosition: { x: 1200, y: 700 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 10, defense: 8, speed: 9, morale: 10 },
        },
        {
          // Dhirar ibn al-Azwar — Khalid's deputy, seizes the Ayn Dhakar bridge by night
          id: 'dhirar-detachment',
          name: "Dhirar's Detachment",
          nameAr: 'كَتِيبَةُ ضِرَارٍ السَّارِيَة',
          troopType: 'cavalry',
          soldierCount: 500,
          commander: 'ضِرَارُ بنُ الأَزْوَرِ',
          startPosition: { x: 1100, y: 700 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 10, defense: 7, speed: 10, morale: 10 },
        },
        {
          // Quraysh women under Hind bint 'Utbah — Day 4 tent-pole rally
          id: 'muslim-women-camp',
          name: 'The Women of the Camp',
          nameAr: 'كَتِيبَةُ نِسَاءِ المُعَسْكَر',
          troopType: 'reserves',
          soldierCount: 300,
          commander: 'هِنْدُ بِنْتُ عُتْبَةَ',
          startPosition: { x: 1300, y: 620 },
          startFormation: 'scattered',
          startFacing: Math.PI,
          stats: { attack: 4, defense: 6, speed: 6, morale: 10 },
        },
        {
          // Senior command tent — Abu Sufyan (in his seventies, eye lost on Day 4) and exhorters
          id: 'muslim-command',
          name: "Senior Command Tent",
          nameAr: 'كَتِيبَةُ القِيَادَةِ العُلْيَا',
          troopType: 'command',
          soldierCount: 100,
          commander: 'أَبُو سُفْيَانَ بنُ حَرْبٍ',
          startPosition: { x: 1280, y: 580 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 9, speed: 5, morale: 10 },
        },
      ],
    },

    // ─── Byzantine Coalition (~110,000 in classical totals; ~70-80k modern) ──
    {
      faction: 'byzantine',
      label: 'Byzantine & Allied Forces',
      labelAr: 'جَيْشُ الرُّومِ',
      totalStrength: 110000,
      units: [
        {
          // Vahan/Bahan — Armenian magister militum, overall field commander
          id: 'vahan-center',
          name: 'Vahan — Roman Centre',
          nameAr: 'كَتِيبَةُ القَلْبِ الرُّومِيِّ بِقِيَادَةِ بَاهَان',
          troopType: 'infantry',
          soldierCount: 25000,
          commander: 'بَاهَانُ الأَرْمَنِيُّ',
          startPosition: { x: 600, y: 540 },
          startFormation: 'line',
          startFacing: 0, // facing east toward the Muslims
          stats: { attack: 9, defense: 9, speed: 5, morale: 8 },
        },
        {
          // Theodore Trithyrius — sakellarios, killed on Day 6
          id: 'theodore-imperial',
          name: 'Theodore Trithyrius',
          nameAr: 'كَتِيبَةُ الجُنْدِ الإِمْبِرَاطُورِيِّ بِقِيَادَةِ تَدَارُق',
          troopType: 'infantry',
          soldierCount: 15000,
          commander: 'تَدَارُقُ السَّكَلَّارِيُّ',
          startPosition: { x: 550, y: 500 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 10, speed: 5, morale: 9 },
        },
        {
          // Buccinator/Qanatir — Slav left wing
          id: 'qanatir-slavs-left',
          name: "Qanatir's Slav Left Wing",
          nameAr: 'كَتِيبَةُ المَيْسَرَةِ مِنَ الصَّقَالِبَةِ بِقِيَادَةِ القَنَاطِير',
          troopType: 'infantry',
          soldierCount: 15000,
          commander: 'القَنَاطِيرُ',
          startPosition: { x: 580, y: 280 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 7 },
        },
        {
          // Gregory's Armenians on the Byzantine right — tradition reports rank-chaining vow
          id: 'gregory-chained-right',
          name: "Gregory's Chained Armenian Right",
          nameAr: 'كَتِيبَةُ المَيْمَنَةِ المُسَلْسَلَةُ بِقِيَادَةِ جَرَجَة',
          troopType: 'infantry',
          soldierCount: 14000,
          commander: 'جَرَجَةُ الأَرْمَنِيُّ',
          startPosition: { x: 580, y: 800 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 10, speed: 3, morale: 8 },
        },
        {
          // Dairjan — left-centre commander, killed on Day 2
          id: 'dairjan-left-center',
          name: 'Dairjan — Left-Centre',
          nameAr: 'كَتِيبَةُ القَلْبِ الأَيْسَرِ الرُّومِيِّ بِقِيَادَةِ الدَّرَاقِس',
          troopType: 'infantry',
          soldierCount: 12000,
          commander: 'الدَّرَاقِسُ',
          startPosition: { x: 580, y: 380 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 7 },
        },
        {
          // Cataphract reserve behind the line; Niketas son of Shahrbaraz subordinate
          id: 'byzantine-cataphracts',
          name: 'Byzantine Cataphracts',
          nameAr: 'كَتِيبَةُ الفُرْسَانِ المُدَجَّجِين',
          troopType: 'heavy_cavalry',
          soldierCount: 12000,
          commander: 'نَيْقِيتَاسُ الفَارِسِيُّ',
          startPosition: { x: 450, y: 540 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 9, defense: 10, speed: 7, morale: 8 },
        },
        {
          // Roman archers — blind 700 Muslims in the eye on Day 4
          id: 'byzantine-archers',
          name: 'Byzantine Archers',
          nameAr: 'كَتِيبَةُ رُمَاةِ الرُّوم',
          troopType: 'archers',
          soldierCount: 8000,
          commander: 'قِيَادَةُ رُمَاةِ الرُّومِ',
          startPosition: { x: 650, y: 500 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 5, speed: 4, morale: 8 },
        },
        {
          // Jabalah ibn al-Ayham — last Ghassanid king, defects mid-battle
          id: 'jabala-ghassanids',
          name: "Jabalah's Ghassanids",
          nameAr: 'كَتِيبَةُ غَسَّانَ بِقِيَادَةِ جَبَلَة',
          troopType: 'horse_archer',
          soldierCount: 12000,
          commander: 'جَبَلَةُ بنُ الأَيْهَمِ',
          startPosition: { x: 650, y: 380 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 8, defense: 6, speed: 9, morale: 6 },
        },
        {
          // Reserve infantry held behind the cataphracts; routs on Day 6
          id: 'byzantine-reserves',
          name: 'Byzantine Reserves',
          nameAr: 'كَتِيبَةُ الاِحْتِيَاطِ الرُّومِيّ',
          troopType: 'reserves',
          soldierCount: 7000,
          commander: 'قِيَادَةُ الاِحْتِيَاطِ',
          startPosition: { x: 400, y: 540 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 8, speed: 4, morale: 7 },
        },
      ],
    },
  ],

  phases: [
    // Phase 1 (0–6s): Pre-battle war council and Khalid's khutba.
    {
      id: 'phase-prelude',
      name: 'Unification of Command and Khalid\'s Khutba',
      nameAr: 'تَوْحِيدُ القِيَادَةِ وَكَلِمَةُ خَالِد',
      startTime: 0,
      duration: 6,
      description:
        "Pre-battle war council on the Yarmouk plain (Rajab 15 AH / mid-August 636 CE). Abu 'Ubayda, the Caliph's nominal commander, yields tactical field command to Khalid. Khalid reorganises the four armies into 36 kuradis plus four cavalry regiments and the mobile guard, and delivers his 'one of the days of God' exhortation (al-Tabari via Sayf b. 'Umar; Ibn Kathir).",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 550, zoom: 0.42, duration: 4 }, delay: 0 },
        { type: 'camera_move', params: { x: 1300, y: 600, zoom: 0.65, duration: 2 }, delay: 4 },
        { type: 'play_effect', params: { effect: 'banner-rise', position: { x: 1280, y: 580 }, label: 'تَوْحِيدُ القِيَادَة' }, delay: 1 },
        // The kuradis form along the 12 km line
        { type: 'change_formation', targetUnitId: 'abu-ubayda-left-center', params: { formation: 'line' }, delay: 1.5 },
        { type: 'change_formation', targetUnitId: 'shurahbil-right-center', params: { formation: 'line' }, delay: 1.5 },
        { type: 'change_formation', targetUnitId: 'yazid-left-wing', params: { formation: 'line' }, delay: 1.5 },
        { type: 'change_formation', targetUnitId: 'amr-right-wing', params: { formation: 'line' }, delay: 1.5 },
        // Mobile guard concentrated behind the centre
        { type: 'change_formation', targetUnitId: 'khalid-mobile-guard', params: { formation: 'wedge' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'khutba-overlay', text: 'إِنَّ هَذَا يَوْمٌ مِنْ أَيَّامِ اللَّهِ' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 2 (6–13s): Day 1 — yawm al-Imdad, mubarizun and Vahan's probe.
    {
      id: 'phase-day1-imdad',
      name: 'Day 1 — Day of Reinforcements',
      nameAr: 'اليَوْمُ الأَوَّلُ — يَوْمُ الإِمْدَاد',
      startTime: 6,
      duration: 7,
      description:
        "Day 1, 15 August 636 CE. Mubarizun single combats — al-Zubayr, al-Qa'qa', and Abdul-Rahman ibn Abi Bakr pick off Byzantine officers one by one. Vahan's first probing attack at midday is repulsed.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 550, zoom: 0.7, duration: 3 }, delay: 0 },
        { type: 'camera_move', params: { x: 760, y: 540, zoom: 0.9, duration: 3 }, delay: 3 },
        // Mubarizun emerge into no-man's-land at six points
        { type: 'play_effect', params: { effect: 'mubarizun-duels', position: { x: 800, y: 540 }, count: 6 }, delay: 1 },
        // Vahan's probe
        { type: 'set_behavior', targetUnitId: 'vahan-center', params: { behavior: 'advancing' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'vahan-center', params: { position: { x: 700, y: 540 }, speed: 50 }, delay: 4 },
        { type: 'attack_unit', targetUnitId: 'vahan-center', params: { targetId: 'abu-ubayda-left-center' }, delay: 5 },
        // Repulsed — falls back
        { type: 'set_behavior', targetUnitId: 'vahan-center', params: { behavior: 'retreating' }, delay: 6 },
        { type: 'move_unit', targetUnitId: 'vahan-center', params: { position: { x: 600, y: 540 }, speed: 60 }, delay: 6 },
      ],
      triggers: [],
    },

    // Phase 3 (13–20s): Day 2 — yawm al-Tasawi, women's tent-pole rally, Dairjan killed.
    {
      id: 'phase-day2-tasawi',
      name: 'Day 2 — Day of Equilibrium and the Death of Dairjan',
      nameAr: 'اليَوْمُ الثَّانِي — يَوْمُ التَّسَاوِي وَمَقْتَلُ الدَّرَاقِس',
      startTime: 13,
      duration: 7,
      description:
        "Day 2, 16 August 636 CE. Vahan launches a coordinated dawn assault. Yazid's left wing buckles back toward the camp. The women of Quraysh under Hind bint 'Utbah, with Asma bint Yazid al-Ansariyya, dismantle tents and shame fleeing men back into the line. Khalid's mobile guard wheels to stabilise. Dairjan, the Byzantine left-centre commander, is killed.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 560, zoom: 0.55, duration: 3 }, delay: 0 },
        // Byzantine line surges forward
        { type: 'set_behavior', targetUnitId: 'qanatir-slavs-left', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'gregory-chained-right', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'dairjan-left-center', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'gregory-chained-right', params: { position: { x: 750, y: 800 }, speed: 50 }, delay: 1 },
        // Yazid's left wing pushed back
        { type: 'move_unit', targetUnitId: 'yazid-left-wing', params: { position: { x: 1080, y: 800 }, speed: 60 }, delay: 1.5 },
        // Camera cuts to the camp — women emerge with tent-poles
        { type: 'camera_move', params: { x: 1200, y: 620, zoom: 0.8, duration: 4 }, delay: 3 },
        { type: 'set_behavior', targetUnitId: 'muslim-women-camp', params: { behavior: 'advancing' }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'muslim-women-camp', params: { position: { x: 1100, y: 750 }, speed: 60 }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'tent-pole-rally', position: { x: 1150, y: 720 }, text: 'إِلَى أَيْنَ؟ إِلَى النَّارِ تَفِرُّونَ؟' }, delay: 4 },
        // Mobile guard wheels left
        { type: 'move_unit', targetUnitId: 'khalid-mobile-guard', params: { position: { x: 1000, y: 780 }, speed: 130 }, delay: 4.5 },
        // Cut to Dairjan's death
        { type: 'camera_move', params: { x: 700, y: 540, zoom: 0.85, duration: 3 }, delay: 5 },
        { type: 'attack_unit', targetUnitId: 'shurahbil-right-center', params: { targetId: 'dairjan-left-center' }, delay: 5.5 },
        { type: 'play_effect', params: { effect: 'commander-falls', targetUnitId: 'dairjan-left-center', label: 'الدَّرَاقِس' }, delay: 6 },
        { type: 'destroy_unit', targetUnitId: 'dairjan-left-center', params: { cause: 'commander-killed' }, delay: 6.5 },
      ],
      triggers: [],
    },

    // Phase 4 (20–26s): Day 3 — yawm al-Jamajim, mobile guard rotates right.
    {
      id: 'phase-day3-jamajim',
      name: 'Day 3 — Day of Skulls',
      nameAr: 'اليَوْمُ الثَّالِثُ — يَوْمُ الجَمَاجِم',
      startTime: 20,
      duration: 6,
      description:
        "Day 3, 17 August 636 CE. Vahan shifts emphasis to the Muslim right under 'Amr ibn al-'As and Shurahbil. Heavy infantry grinding produces the day-name yawm al-Jamajim — the Day of Skulls. Khalid's mobile guard sprints laterally behind the line and counter-charges the Slav left.",
      actions: [
        { type: 'camera_move', params: { x: 900, y: 530, zoom: 0.6, duration: 2.5 }, delay: 0 },
        // Slav left and centre attack the Muslim right
        { type: 'set_behavior', targetUnitId: 'qanatir-slavs-left', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'qanatir-slavs-left', params: { position: { x: 800, y: 320 }, speed: 50 }, delay: 0.5 },
        { type: 'attack_unit', targetUnitId: 'qanatir-slavs-left', params: { targetId: 'amr-right-wing' }, delay: 1.5 },
        // Mobile guard sprints behind the line to the right
        { type: 'camera_move', params: { x: 950, y: 540, zoom: 0.75, duration: 4 }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'khalid-mobile-guard', params: { position: { x: 1050, y: 350 }, speed: 200 }, delay: 2.5 },
        { type: 'change_formation', targetUnitId: 'khalid-mobile-guard', params: { formation: 'wedge' }, delay: 4 },
        // Counter-charge into the Slav flank
        { type: 'set_behavior', targetUnitId: 'khalid-mobile-guard', params: { behavior: 'attacking' }, delay: 4.5 },
        { type: 'attack_unit', targetUnitId: 'khalid-mobile-guard', params: { targetId: 'qanatir-slavs-left' }, delay: 5 },
        { type: 'set_behavior', targetUnitId: 'qanatir-slavs-left', params: { behavior: 'retreating' }, delay: 5.5 },
        { type: 'move_unit', targetUnitId: 'qanatir-slavs-left', params: { position: { x: 580, y: 280 }, speed: 80 }, delay: 5.5 },
      ],
      triggers: [],
    },

    // Phase 5 (26–34s): Day 4 — yawm al-Aghwath, the Day of Lost Eyes; Ikrima's death-pledge.
    {
      id: 'phase-day4-aghwath',
      name: 'Day 4 — Day of Cries-for-Help and the Lost Eyes',
      nameAr: 'اليَوْمُ الرَّابِعُ — يَوْمُ الأَغْوَاثِ وَفِقْءُ العُيُون',
      startTime: 26,
      duration: 8,
      description:
        "Day 4, 18 August 636 CE — yawm al-Aghwath, the Day of Cries-for-Help, also called the Day of Lost Eyes. Byzantine archers blind ~700 Muslims in the eye, Abu Sufyan among them (Ibn Kathir, al-Bidaya wa al-Nihaya). 'Ikrima ibn Abi Jahl leads the bay'at al-mawt of ~400 Quraysh nobles; most do not return. The women re-enter the line.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 540, zoom: 0.5, duration: 2 }, delay: 0 },
        // Arrow-volleys darken the sky
        { type: 'play_effect', params: { effect: 'arrow-volley-mass', position: { x: 800, y: 480 }, count: 8000 }, delay: 0.5 },
        { type: 'attack_unit', targetUnitId: 'byzantine-archers', params: { targetId: 'abu-ubayda-left-center' }, delay: 1 },
        // Eye-strikes — close on Abu Sufyan in the line
        { type: 'play_effect', params: { effect: 'eye-strikes', position: { x: 1000, y: 540 }, count: 700 }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'casualty-marker', targetUnitId: 'muslim-command', label: 'فُقِئَتْ عَيْنُ أَبِي سُفْيَانَ' }, delay: 2 },
        // Wings buckle inward
        { type: 'move_unit', targetUnitId: 'amr-right-wing', params: { position: { x: 1000, y: 360 }, speed: 50 }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'yazid-left-wing', params: { position: { x: 1000, y: 760 }, speed: 50 }, delay: 2 },
        // Ikrima gathers the death-pledge band
        { type: 'camera_move', params: { x: 720, y: 530, zoom: 0.92, duration: 5 }, delay: 2.5 },
        { type: 'change_formation', targetUnitId: 'ikrima-rearguard', params: { formation: 'wedge' }, delay: 3 },
        { type: 'play_effect', params: { effect: 'bayat-al-mawt', position: { x: 1200, y: 700 }, count: 400 }, delay: 3.5 },
        { type: 'set_behavior', targetUnitId: 'ikrima-rearguard', params: { behavior: 'attacking' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'ikrima-rearguard', params: { position: { x: 700, y: 540 }, speed: 200 }, delay: 4 },
        { type: 'attack_unit', targetUnitId: 'ikrima-rearguard', params: { targetId: 'vahan-center' }, delay: 5.5 },
        // Most do not return; Ikrima falls
        { type: 'play_effect', params: { effect: 'commander-falls', targetUnitId: 'ikrima-rearguard', label: 'عِكْرِمَةُ بنُ أَبِي جَهْلٍ' }, delay: 6.5 },
        // Women's tent-pole rally — Hind bint 'Utbah strikes a fleeing rider
        { type: 'camera_move', params: { x: 1180, y: 600, zoom: 0.78, duration: 2.5 }, delay: 5.5 },
        { type: 'play_effect', params: { effect: 'tent-pole-strike', position: { x: 1180, y: 620 } }, delay: 6 },
        // Mobile guard sweeps in to stabilise
        { type: 'move_unit', targetUnitId: 'khalid-mobile-guard', params: { position: { x: 1000, y: 540 }, speed: 180 }, delay: 7 },
      ],
      triggers: [],
    },

    // Phase 6 (34–41s): Day 5 — Khalid refuses the truce; Dhirar rides for the bridge.
    {
      id: 'phase-day5-truce-refused',
      name: 'Day 5 — The Truce Refused and Dhirar\'s Night Ride',
      nameAr: 'اليَوْمُ الخَامِسُ — رَفْضُ الهُدْنَةِ وَلَيْلُ ضِرَار',
      startTime: 34,
      duration: 7,
      description:
        "Day 5, 19 August 636 CE. Vahan sends Jurja (George) under a green branch offering tribute and dinars for Muslim withdrawal. Khalid refuses with the famous reply preserved by al-Azdi (Futuh al-Sham, transmitted): «لَيْسَ الَّذِي أَخْرَجَنَا حَاجَةَ الدُّنْيَا، وَإِنَّمَا أَخْرَجَنَا أَنْ نُشْرِبَ دِمَاءَكُمْ». By night Khalid sends Dhirar ibn al-Azwar with 500 horse to seize Jisr 'Ayn Dhakar over Wadi al-Ruqqad — the only Byzantine retreat route.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 540, zoom: 0.6, duration: 3 }, delay: 0 },
        // Byzantine emissary crosses no-man's-land
        { type: 'play_effect', params: { effect: 'emissary-green-branch', position: { x: 700, y: 540 } }, delay: 1 },
        // Tight on Khalid's reply
        { type: 'camera_move', params: { x: 800, y: 540, zoom: 0.85, duration: 2.5 }, delay: 3 },
        { type: 'play_effect', params: { effect: 'truce-refused-quote', text: 'لَيْسَ الَّذِي أَخْرَجَنَا حَاجَةَ الدُّنْيَا' }, delay: 3.5 },
        // Day-to-night transition
        { type: 'play_effect', params: { effect: 'day-to-night-shift' }, delay: 5 },
        // Dhirar's column rides north-west under starlight
        { type: 'camera_move', params: { x: 400, y: 400, zoom: 0.65, duration: 4 }, delay: 5.5 },
        { type: 'change_formation', targetUnitId: 'dhirar-detachment', params: { formation: 'column' }, delay: 5.5 },
        { type: 'set_behavior', targetUnitId: 'dhirar-detachment', params: { behavior: 'advancing' }, delay: 5.5 },
        { type: 'move_unit', targetUnitId: 'dhirar-detachment', params: { position: { x: 800, y: 250 }, speed: 250 }, delay: 5.5 },
        { type: 'move_unit', targetUnitId: 'dhirar-detachment', params: { position: { x: 400, y: 350 }, speed: 250 }, delay: 6.2 },
      ],
      triggers: [],
    },

    // Phase 7 (41–48s): Day 6, phase one — separation of cavalry from foot.
    {
      id: 'phase-day6-cavalry-separation',
      name: 'Day 6 — Separation of Cavalry from Foot',
      nameAr: 'اليَوْمُ السَّادِسُ — فَصْلُ الفُرْسَانِ عَنِ المُشَاة',
      startTime: 41,
      duration: 7,
      description:
        "Day 6, 20 August 636 CE — first phase of Khalid's four-phase envelopment. The Ayn Dhakar bridge is in Muslim hands. A khamsin wind from the south-east drives dust into Roman faces. Khalid masses ~8,000 cavalry into a single fist and sweeps the Roman left-wing horse from the field (Akram Ch.36; Nicolle 1994). Dhirar's detachment now visibly holds the bridge.",
      actions: [
        // Bridge seized at dawn
        { type: 'camera_move', params: { x: 280, y: 480, zoom: 0.88, duration: 2.5 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'dhirar-detachment', params: { position: { x: 285, y: 485 }, speed: 200 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'bridge-seized', position: { x: 285, y: 485 }, label: 'جِسْرُ عَيْنِ ذَكَر' }, delay: 1 },
        // Dawn opens; wide overview as the wind rises
        { type: 'camera_move', params: { x: 800, y: 550, zoom: 0.45, duration: 3 }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'khamsin-wind', position: { x: 800, y: 540 }, direction: 'east-to-west' }, delay: 3 },
        // Cavalry concentrate behind the centre
        { type: 'camera_move', params: { x: 750, y: 530, zoom: 0.7, duration: 3 }, delay: 4 },
        { type: 'change_formation', targetUnitId: 'khalid-mobile-guard', params: { formation: 'wedge' }, delay: 4 },
        { type: 'set_behavior', targetUnitId: 'khalid-mobile-guard', params: { behavior: 'attacking' }, delay: 4.5 },
        // Sweep northward along the Byzantine front
        { type: 'move_unit', targetUnitId: 'khalid-mobile-guard', params: { position: { x: 700, y: 350 }, speed: 220 }, delay: 5 },
        { type: 'attack_unit', targetUnitId: 'khalid-mobile-guard', params: { targetId: 'byzantine-cataphracts' }, delay: 5.5 },
        { type: 'set_behavior', targetUnitId: 'byzantine-cataphracts', params: { behavior: 'retreating' }, delay: 6 },
        { type: 'move_unit', targetUnitId: 'byzantine-cataphracts', params: { position: { x: 380, y: 300 }, speed: 100 }, delay: 6 },
        // Ghassanids withdraw with the collapsing left
        { type: 'set_behavior', targetUnitId: 'jabala-ghassanids', params: { behavior: 'retreating' }, delay: 6.2 },
        { type: 'move_unit', targetUnitId: 'jabala-ghassanids', params: { position: { x: 450, y: 320 }, speed: 120 }, delay: 6.2 },
      ],
      triggers: [],
    },

    // Phase 8 (48–55s): Day 6, phase two — strike from the rear; Theodore falls.
    {
      id: 'phase-day6-rear-attack',
      name: 'Day 6 — The Strike from Behind',
      nameAr: 'اليَوْمُ السَّادِسُ — الضَّرْبَةُ مِنَ الخَلْف',
      startTime: 48,
      duration: 7,
      description:
        "Day 6, second phase. Khalid's cavalry, having stripped the Roman horse, sweeps behind the Byzantine left and strikes the centre from the rear. Theodore Trithyrius is killed on the field; the Slav left collapses; the Byzantine reserves are committed but caught in the crush.",
      actions: [
        { type: 'camera_move', params: { x: 600, y: 480, zoom: 0.6, duration: 3 }, delay: 0 },
        // Mobile guard sweeps behind the Roman line
        { type: 'move_unit', targetUnitId: 'khalid-mobile-guard', params: { position: { x: 450, y: 400 }, speed: 200 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'khalid-mobile-guard', params: { position: { x: 500, y: 540 }, speed: 200 }, delay: 2 },
        // Strike the centre from the rear
        { type: 'set_behavior', targetUnitId: 'khalid-mobile-guard', params: { behavior: 'attacking' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'khalid-mobile-guard', params: { targetId: 'theodore-imperial' }, delay: 3.5 },
        { type: 'attack_unit', targetUnitId: 'khalid-mobile-guard', params: { targetId: 'vahan-center' }, delay: 4 },
        // Theodore Trithyrius unhorsed and killed
        { type: 'play_effect', params: { effect: 'commander-falls', targetUnitId: 'theodore-imperial', label: 'تَدَارُقُ السَّكَلَّارِيّ' }, delay: 4.5 },
        { type: 'destroy_unit', targetUnitId: 'theodore-imperial', params: { cause: 'commander-killed' }, delay: 5 },
        // Slav left collapses first
        { type: 'destroy_unit', targetUnitId: 'qanatir-slavs-left', params: { cause: 'rout' }, delay: 5.5 },
        // Byzantine reserves committed but caught
        { type: 'set_behavior', targetUnitId: 'byzantine-reserves', params: { behavior: 'advancing' }, delay: 5.5 },
        { type: 'move_unit', targetUnitId: 'byzantine-reserves', params: { position: { x: 500, y: 540 }, speed: 60 }, delay: 5.5 },
        { type: 'attack_unit', targetUnitId: 'abu-ubayda-left-center', params: { targetId: 'byzantine-reserves' }, delay: 6 },
        { type: 'play_effect', params: { effect: 'command-tent-disarray', position: { x: 380, y: 380 } }, delay: 6.5 },
      ],
      triggers: [],
    },

    // Phase 9 (55–63s): The catastrophe — rout into the ravines.
    {
      id: 'phase-rout-ravines',
      name: 'The Catastrophe — Cast Into the Ravines',
      nameAr: 'الكَارِثَةُ — الرَّمْيُ فِي الوِدْيَان',
      startTime: 55,
      duration: 8,
      description:
        "Day 6, final phase. The Byzantine line breaks into rout. With the Ayn Dhakar bridge held by Dhirar's detachment, retreating Byzantines are funneled into the cliffs of Wadi al-Ruqqad and Wadi Allan. Per al-Tabari: 'some fell into the deep ravines off the steep slopes, others were smashed on the rocks below.' This terrain — not Muslim swords — kills most of the Byzantine army.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 540, zoom: 0.4, duration: 3 }, delay: 0 },
        // Byzantine line breaks
        { type: 'change_formation', targetUnitId: 'gregory-chained-right', params: { formation: 'scattered' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'vahan-center', params: { formation: 'scattered' }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'byzantine-archers', params: { formation: 'scattered' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'gregory-chained-right', params: { behavior: 'retreating' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'vahan-center', params: { behavior: 'retreating' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'byzantine-archers', params: { behavior: 'retreating' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'byzantine-reserves', params: { behavior: 'retreating' }, delay: 1 },
        // Mass westward retreat toward the bridge
        { type: 'move_unit', targetUnitId: 'gregory-chained-right', params: { position: { x: 350, y: 800 }, speed: 100 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'byzantine-archers', params: { position: { x: 350, y: 500 }, speed: 100 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'byzantine-reserves', params: { position: { x: 320, y: 540 }, speed: 100 }, delay: 1.5 },
        // Reveal: bridge already taken
        { type: 'camera_move', params: { x: 320, y: 500, zoom: 0.85, duration: 3 }, delay: 3 },
        { type: 'play_effect', params: { effect: 'bridge-blocked-reveal', position: { x: 285, y: 485 } }, delay: 3.5 },
        // Funnel into the cliffs — Wadi al-Ruqqad
        { type: 'play_effect', params: { effect: 'cliff-fall-mass', position: { x: 175, y: 600 }, count: 30000 }, delay: 4 },
        // Wadi Allan sealed in the north
        { type: 'play_effect', params: { effect: 'cliff-fall-mass', position: { x: 1050, y: 125 }, count: 8000 }, delay: 5 },
        // Wide pan along the ravine system
        { type: 'camera_move', params: { x: 600, y: 400, zoom: 0.45, duration: 3 }, delay: 5.5 },
        // Vahan and a remnant escape northward
        { type: 'destroy_unit', targetUnitId: 'gregory-chained-right', params: { cause: 'fell-into-ravine' }, delay: 6.5 },
        { type: 'destroy_unit', targetUnitId: 'byzantine-archers', params: { cause: 'fell-into-ravine' }, delay: 6.5 },
        { type: 'destroy_unit', targetUnitId: 'byzantine-cataphracts', params: { cause: 'rout' }, delay: 6.5 },
        { type: 'destroy_unit', targetUnitId: 'byzantine-reserves', params: { cause: 'fell-into-ravine' }, delay: 6.5 },
        { type: 'move_unit', targetUnitId: 'vahan-center', params: { position: { x: 350, y: 100 }, speed: 200 }, delay: 7 },
      ],
      triggers: [],
    },

    // Phase 10 (63–78s): Aftermath — Heraclius's farewell to Sham.
    {
      id: 'phase-aftermath',
      name: 'The Farewell of Heraclius to Syria',
      nameAr: 'وَدَاعُ هِرَقْلَ لِلشَّامِ',
      startTime: 63,
      duration: 15,
      description:
        "Aftermath, late August 636 CE. Heraclius at Antioch receives word of the catastrophe. He withdraws to Constantinople with the True Cross, never to mount a serious reconquest. Tradition preserves his farewell to Syria in al-Tabari and al-Baladhuri (treated as a literary topos by modern historians, e.g. Kaegi 1992). Damascus is retaken; within a decade, Sham, Armenia, and Egypt fall.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 540, zoom: 0.42, duration: 3 }, delay: 0 },
        // Slow drift westward over the Ruqqad ravine
        { type: 'camera_move', params: { x: 400, y: 500, zoom: 0.5, duration: 4 }, delay: 3 },
        // Symbolic horizon shot — Heraclius's withdrawal
        { type: 'play_effect', params: { effect: 'horizon-withdrawal', label: 'هِرَقْلُ بِأَنْطَاكِيَة' }, delay: 5 },
        // Heraclius's farewell overlay
        { type: 'play_effect', params: { effect: 'farewell-quote', text: 'سَلَامٌ عَلَيْكِ يَا سُورِيَةُ سَلَامًا لَا اِجْتِمَاعَ بَعْدَهُ' }, delay: 7 },
        // Final overview pan east as dawn-light returns
        { type: 'camera_move', params: { x: 800, y: 540, zoom: 0.4, duration: 4 }, delay: 9 },
        { type: 'play_effect', params: { effect: 'closing-card', text: 'فَتَحَ اللَّهُ الشَّامَ' }, delay: 12 },
      ],
      triggers: [],
    },
  ],

  narration: [
    {
      id: 'narr-opening',
      time: 0.5,
      duration: 5.5,
      text: 'In Rajab of the year fifteen after the Hijra, the armies of Rome gathered upon the plain of Yarmouk between three ravines, and the Muslims drew up their ranks under the command of Khalid ibn al-Walid.',
      textAr:
        'فِي رَجَبٍ مِنْ سَنَةِ خَمْسَ عَشْرَةَ لِلْهِجْرَةِ، اِجْتَمَعَتْ جُيُوشُ الرُّومِ عَلَى سَهْلِ اليَرْمُوكِ بَيْنَ ثَلَاثَةِ أَوْدِيَةٍ، وَجَمَعَ المُسْلِمُونَ صُفُوفَهُمْ عَلَى أَمْرِ خَالِدِ بْنِ الوَلِيد.',
      style: 'dramatic',
      position: 'top',
    },
    {
      id: 'narr-khutba',
      time: 6.5,
      duration: 6,
      text: "Khalid addressed the host saying: 'This is one of the days of God; let there be no boasting in it nor injustice. Make your jihad sincere, and seek by your deeds God alone.' (Reported by al-Tabari via the Sayf b. Umar transmission.)",
      textAr:
        'خَطَبَ خَالِدٌ فِي النَّاسِ فَقَالَ: «إِنَّ هَذَا يَوْمٌ مِنْ أَيَّامِ اللَّهِ، لَا يَنْبَغِي فِيهِ الفَخْرُ وَلَا البَغْيُ، أَخْلِصُوا جِهَادَكُمْ وَأَرِيدُوا اللَّهَ بِعَمَلِكُمْ». [أَخْرَجَهُ الطَّبَرِيُّ بِسَنَدِ سَيْفِ بْنِ عُمَر].',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-mubarizun',
      time: 13.5,
      duration: 5,
      text: 'The fighting opened with single combats; the Muslim champions singled out Byzantine officers one by one, and when noon came Vahan led a probing advance with his troops, but they were repulsed.',
      textAr:
        'بَدَأَ القِتَالُ بِالمُبَارَزَاتِ؛ بَرَزَ فُرْسَانُ المُسْلِمِينَ يَنْتَقُونَ ضُبَّاطَ الرُّومِ وَاحِدًا وَاحِدًا، فَلَمَّا اِنْتَصَفَ النَّهَارُ زَحَفَ بَاهَانُ بِجُنْدِهِ زَحْفَةَ اِخْتِبَارٍ فَرُدُّوا.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-day2-women',
      time: 21,
      duration: 6,
      text: "On the second day the Romans drove the Muslim left back to the camp, and the women of Quraysh came out with the tent-poles, led by Hind bint Utbah, crying to those who fled: 'To where? Is it to the Fire that you flee?'",
      textAr:
        'فِي اليَوْمِ الثَّانِي رَدَّ الرُّومُ المَيْسَرَةَ إِلَى المُعَسْكَرِ، فَخَرَجَتْ نِسَاءُ قُرَيْشٍ بِأَعْمِدَةِ الخِيَامِ تَقُودُهُنَّ هِنْدُ بِنْتُ عُتْبَةَ يَصِحْنَ بِالفَارِّينَ: «إِلَى أَيْنَ؟ إِلَى النَّارِ تَفِرُّونَ؟»',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-dairjan-falls',
      time: 27.5,
      duration: 4.5,
      text: 'On that day Dairjan, commander of the Byzantine left-centre, fell slain in the dust of the battle, and the morale of his people was broken.',
      textAr:
        'فِي ذَلِكَ اليَوْمِ سَقَطَ الدَّرَاقِسُ صَاحِبُ القَلْبِ الأَيْسَرِ مِنَ الرُّومِ قَتِيلًا فِي غُبَارِ المَعْرَكَةِ، فَوَهَنَتْ مَعْنَوِيَّةُ القَوْمِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-aghwath-eyes',
      time: 32,
      duration: 6,
      text: 'Then came the Day of Cries, the Day of Lost Eyes: the Byzantine archers rained the sky with arrows and hundreds of eyes were struck; on that day the eye of Abu Sufyan ibn Harb was put out. (Ibn Kathir, al-Bidaya wa al-Nihaya.)',
      textAr:
        'ثُمَّ كَانَ يَوْمُ الأَغْوَاثِ، وَهُوَ يَوْمُ فَقْءِ العُيُونِ؛ أَمْطَرَ رُمَاةُ الرُّومِ السَّمَاءَ نِبَالًا فَأُصِيبَتْ مِئَاتُ العُيُونِ، وَفُقِئَتْ يَوْمَئِذٍ عَيْنُ أَبِي سُفْيَانَ بْنِ حَرْبٍ. [اِبْنُ كَثِيرٍ، البِدَايَةُ وَالنِّهَايَة].',
      style: 'dramatic',
      position: 'top',
    },
    {
      id: 'narr-ikrima-mawt',
      time: 38,
      duration: 6,
      text: 'Then Ikrima ibn Abi Jahl came forward with four hundred of the nobles of Quraysh; they pledged themselves to death and charged in one wave. Most of them did not return, and Ikrima died of his wounds that night.',
      textAr:
        'فَتَقَدَّمَ عِكْرِمَةُ بْنُ أَبِي جَهْلٍ بِأَرْبَعِمِائَةٍ مِنْ سَادَاتِ قُرَيْشٍ، فَتَبَايَعُوا عَلَى المَوْتِ، وَحَمَلُوا حَمْلَةً وَاحِدَةً، فَلَمْ يَرْجِعْ أَكْثَرُهُمْ، وَمَاتَ عِكْرِمَةُ مِنْ جِرَاحِهِ تِلْكَ اللَّيْلَة.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-truce-refused',
      time: 44.5,
      duration: 5.5,
      text: "Vahan sent offering gold and a withdrawal. Khalid replied: 'It is not need of this world that has brought us out; we have only come out to drink your blood.' (Al-Azdi, Futuh al-Sham, transmitted tradition.)",
      textAr:
        'بَعَثَ بَاهَانُ يَعْرِضُ الذَّهَبَ وَالاِنْصِرَافَ، فَقَالَ خَالِدٌ: «لَيْسَ الَّذِي أَخْرَجَنَا حَاجَةَ الدُّنْيَا، وَإِنَّمَا أَخْرَجَنَا أَنْ نُشْرِبَ دِمَاءَكُمْ». [الأَزْدِيُّ، فُتُوحُ الشَّام، رِوَايَةً].',
      style: 'quote',
      position: 'bottom',
    },
    {
      id: 'narr-dhirar-bridge',
      time: 50.5,
      duration: 5,
      text: 'And in the heart of the night Khalid sent Dhirar ibn al-Azwar with five hundred horsemen; they seized the bridge of Ayn Dhakar over Wadi al-Ruqqad, and the road of escape was cut off from the Romans.',
      textAr:
        'وَفِي جَوْفِ اللَّيْلِ بَعَثَ خَالِدٌ ضِرَارَ بْنَ الأَزْوَرِ فِي خَمْسِمِائَةِ فَارِسٍ، فَاسْتَوْلَوْا عَلَى جِسْرِ عَيْنِ ذَكَرَ عَلَى وَادِي الرُّقَّادِ، وَقُطِعَ عَنِ الرُّومِ طَرِيقُ الفِرَار.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-wind',
      time: 56,
      duration: 5,
      text: 'Then God brought the dawn over them, and a strong wind blew from the south-east into the faces of the Romans; it was against them and for the Muslims.',
      textAr:
        'ثُمَّ أَطْلَعَ اللَّهُ عَلَيْهِمُ الفَجْرَ، وَهَبَّتْ رِيحٌ شَدِيدَةٌ مِنَ الجَنُوبِ الشَّرْقِيِّ فِي وُجُوهِ الرُّومِ، فَكَانَتْ عَلَيْهِمْ، وَكَانَتْ لِلْمُسْلِمِين.',
      style: 'dramatic',
      position: 'top',
    },
    {
      id: 'narr-rear-attack',
      time: 61,
      duration: 5,
      text: 'Khalid drove his cavalry as one mass, separated the horse from the foot, then wheeled around behind the left wing and struck the centre from the rear; Theodore Trithyrius fell slain in the centre.',
      textAr:
        'فَسَاقَ خَالِدٌ فُرْسَانَهُ كُتْلَةً وَاحِدَةً، فَفَصَلَ الفُرْسَانَ عَنِ المُشَاةِ، ثُمَّ دَارَ مِنْ خَلْفِ المَيْسَرَةِ، فَضَرَبَ القَلْبَ مِنْ وَرَائِهِ، وَسَقَطَ تَدَارُقُ صَرِيعًا فِي القَلْب.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-ravines',
      time: 66.5,
      duration: 6,
      text: 'The Romans turned in flight toward the bridge, but the bridge was already taken; they pressed against the lips of Wadi al-Ruqqad and Wadi Allan, and tumbled into the depths and were broken upon the rocks.',
      textAr:
        'وَوَلَّى الرُّومُ مُنْهَزِمِينَ نَحْوَ الجِسْرِ، فَإِذَا الجِسْرُ مَأْخُوذٌ، فَتَدَافَعُوا عَلَى شِفَاهِ وَادِي الرُّقَّادِ وَوَادِي العَلَّانِ، فَتَهَاوَوْا فِي الأَعْمَاقِ وَتَكَسَّرُوا عَلَى الصُّخُور.',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-heraclius',
      time: 73,
      duration: 4.5,
      text: "When the news reached Heraclius at Antioch, he turned away to Constantinople, and it is related that he said: 'Peace upon you, Syria — a peace with no reunion after it.' (Al-Tabari, transmitted as a literary tradition.)",
      textAr:
        'وَلَمَّا بَلَغَ هِرَقْلَ الخَبَرُ بِأَنْطَاكِيَةَ، اِنْصَرَفَ إِلَى القُسْطَنْطِينِيَّةِ، وَيُرْوَى أَنَّهُ قَالَ: «سَلَامٌ عَلَيْكِ يَا سُورِيَةُ سَلَامًا لَا اِجْتِمَاعَ بَعْدَهُ». [الطَّبَرِيُّ، رِوَايَةً أَدَبِيَّة].',
      style: 'quote',
      position: 'bottom',
    },
  ],

  cameraScript: [
    // Open with the widest possible view: full plateau, all three ravines as silent third commander
    { time: 0, position: { x: 800, y: 550 }, zoom: 0.42, duration: 4, easing: 'power2.out', type: 'overview' },
    // Drift east toward the Muslim camp and command tent for Khalid's khutba
    { time: 4, position: { x: 1300, y: 600 }, zoom: 0.65, duration: 2.5, easing: 'power2.inOut', type: 'pan' },
    // Tight on Khalid as he speaks; the camera lingers on the mobile guard banner
    { time: 6.5, position: { x: 1280, y: 580 }, zoom: 0.8, duration: 5.5, easing: 'power2.inOut', type: 'focus', followEntityId: 'khalid-mobile-guard' },
    // Pull to centre at mid-zoom for the mubarizun duels in no-man's-land
    { time: 13, position: { x: 800, y: 550 }, zoom: 0.7, duration: 3, easing: 'power2.out', type: 'zoom' },
    // Close on the single combats — most cinematic moment of Day 1
    { time: 16, position: { x: 760, y: 540 }, zoom: 0.9, duration: 3, easing: 'power2.inOut', type: 'focus' },
    // Day 2 dawn shift — pull back to see the full Byzantine line lurch forward
    { time: 20, position: { x: 800, y: 560 }, zoom: 0.55, duration: 3, easing: 'power2.out', type: 'zoom' },
    // Follow the women streaming from the camp into the breaking line
    { time: 23, position: { x: 1200, y: 620 }, zoom: 0.8, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-women-camp' },
    // Cut to Dairjan as he falls in the press
    { time: 27, position: { x: 700, y: 540 }, zoom: 0.85, duration: 3, easing: 'power2.inOut', type: 'focus', followEntityId: 'dairjan-left-center' },
    // Lift for Day 3 transition — yawm al-Jamajim opens with infantry grinding
    { time: 30, position: { x: 900, y: 530 }, zoom: 0.6, duration: 2.5, easing: 'power2.out', type: 'zoom' },
    // Track the mobile guard's lateral sprint behind the line to the right wing
    { time: 32.5, position: { x: 950, y: 540 }, zoom: 0.75, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'khalid-mobile-guard' },
    // Overview as Day 4 begins — yawm al-Aghwath, the most catastrophic day
    { time: 36.5, position: { x: 800, y: 540 }, zoom: 0.5, duration: 2, easing: 'power2.out', type: 'overview' },
    // Closest cinematic shot of the run: follow Ikrima's death-pledge charge
    { time: 38.5, position: { x: 720, y: 530 }, zoom: 0.92, duration: 5, easing: 'power2.inOut', type: 'follow', followEntityId: 'ikrima-rearguard' },
    // Cut to Hind bint Utbah striking with a tent-pole
    { time: 43.5, position: { x: 1180, y: 600 }, zoom: 0.78, duration: 2.5, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-women-camp' },
    // Lull for Day 5 — emissary scene at mid-zoom over the centre
    { time: 46, position: { x: 800, y: 540 }, zoom: 0.6, duration: 3, easing: 'power2.inOut', type: 'zoom' },
    // Tight on Khalid as he refuses the truce
    { time: 49, position: { x: 800, y: 540 }, zoom: 0.85, duration: 2.5, easing: 'power2.inOut', type: 'focus', followEntityId: 'khalid-mobile-guard' },
    // Night-ride: follow Dhirar's 500 horse west across the upper plateau toward the Ruqqad bridge
    { time: 51.5, position: { x: 400, y: 400 }, zoom: 0.65, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'dhirar-detachment' },
    // Close on Jisr Ayn Dhakar as it is seized
    { time: 55.5, position: { x: 280, y: 480 }, zoom: 0.88, duration: 2.5, easing: 'power2.out', type: 'focus' },
    // Day 6 opens with the wind. Wide overview shows dust streaming east-to-west into Roman faces
    { time: 58, position: { x: 800, y: 550 }, zoom: 0.45, duration: 3, easing: 'power2.out', type: 'overview' },
    // Track the cavalry mass in the separation phase
    { time: 61, position: { x: 750, y: 530 }, zoom: 0.7, duration: 3, easing: 'power2.inOut', type: 'follow', followEntityId: 'khalid-mobile-guard' },
    // Sweep behind the Byzantine line for the rear attack
    { time: 64, position: { x: 600, y: 480 }, zoom: 0.6, duration: 3, easing: 'power2.inOut', type: 'follow' },
    // Pull back to the widest view to show tens of thousands funneling toward the cliffs
    { time: 67, position: { x: 800, y: 540 }, zoom: 0.4, duration: 3, easing: 'power2.out', type: 'overview' },
    // Cliff-edge close shot of the catastrophe at Wadi al-Ruqqad
    { time: 70, position: { x: 320, y: 500 }, zoom: 0.85, duration: 3, easing: 'power2.inOut', type: 'focus' },
    // Final overview — the silent battlefield, dawn returning. Heraclius's farewell overlays.
    { time: 73, position: { x: 800, y: 540 }, zoom: 0.42, duration: 3, easing: 'power2.out', type: 'overview' },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 4000,
    enemyCasualties: 45000,
    summary:
      "After six days of continuous combat (15-20 August 636 CE), the Muslims won a decisive victory at Yarmouk; Heraclius's field army was destroyed. Theodore Trithyrius and Dairjan were killed; Vahan escaped only to be slain near Damascus. The Muslims lost roughly 4,000 — including Ikrima ibn Abi Jahl and his death-pledge band — while Byzantine losses, magnified by the rout into the cliffs of Wadi al-Ruqqad and Wadi Allan once Khalid's detachment seized the Ayn Dhakar bridge, ranged from 10,000-50,000 (modern estimates) up to 70,000-120,000 (classical Arabic sources).",
    summaryAr:
      'اِنْتَصَرَ المُسْلِمُونَ فِي اليَرْمُوكِ نَصْرًا سَاحِقًا بَعْدَ سِتَّةِ أَيَّامٍ مِنَ القِتَالِ المُتَوَاصِلِ، فَفَنِيَ جَيْشُ هِرَقْلَ المَيْدَانِيُّ، وَقُتِلَ تَدَارُقُ السَّكَلَّارِيُّ وَالدَّرَاقِسُ، وَفَرَّ بَاهَانُ لِيُقْتَلَ قُرْبَ دِمَشْقَ. اِسْتُشْهِدَ مِنَ المُسْلِمِينَ نَحْوُ أَرْبَعَةِ آلَافٍ، عَلَى رَأْسِهِمْ عِكْرِمَةُ بْنُ أَبِي جَهْلٍ وَأَصْحَابُ بَيْعَةِ المَوْتِ، وَهَلَكَ مِنَ الرُّومِ خَلْقٌ كَثِيرٌ تَهَاوَى أَكْثَرُهُمْ فِي وَادِي الرُّقَّادِ وَوَادِي العَلَّانِ بَعْدَ أَنْ قُطِعَ عَلَيْهِمْ جِسْرُ عَيْنِ ذَكَر.',
    significance:
      "Yarmouk permanently ended Byzantine rule in Syria and opened the road to the conquest of Jerusalem (16 AH), then Armenia and Egypt within Umar's caliphate. It showcased Khalid's military genius — the kuradis system, the centralised mobile guard, and his exploitation of geography until the ravines themselves became the third, crushing commander of the field. Together with Qadisiyyah and Yamama, Yarmouk forms the strategic triangle on which the Rashidun state was built and within which the Mushaf was codified.",
    significanceAr:
      'أَنْهَتْ مَعْرَكَةُ اليَرْمُوكِ الحُكْمَ الرُّومِيَّ فِي الشَّامِ نِهَايَةً لَا رَجْعَةَ بَعْدَهَا، وَفَتَحَتِ الطَّرِيقَ لِفَتْحِ بَيْتِ المَقْدِسِ سَنَةَ سِتَّ عَشْرَةَ لِلْهِجْرَةِ، ثُمَّ أَرْمِينِيَةَ ثُمَّ مِصْرَ فِي خِلَافَةِ عُمَرَ. وَقَدْ أَظْهَرَتْ عَبْقَرِيَّةَ خَالِدٍ العَسْكَرِيَّةَ فِي نِظَامِ الكَرَادِيسِ وَالحَرَسِ المُتَحَرِّكِ، وَاِسْتِغْلَالِ الجُغْرَافِيَا حَتَّى صَارَتِ الأَوْدِيَةُ هِيَ القَائِدَ الثَّالِثَ السَّاحِقَ. وَهِيَ مَعَ القَادِسِيَّةِ وَاليَمَامَةِ المُثَلَّثُ الَّذِي تَأَسَّسَتْ بِهِ دَوْلَةُ الخِلَافَةِ الرَّاشِدَةِ وَتَدَوَّنَ بِهِ المُصْحَف.',
  },

  totalDuration: 78,
};
