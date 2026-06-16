import type { BattleScenario } from '../types/scenario';

/**
 * مَعْرَكَةُ القَادِسِيَّةِ — فَاتِحَةُ فَتْحِ الفُرْسِ
 * The Battle of Qadisiyyah — 16-19 Sha'ban 15 AH / 16-19 November 636 CE
 *
 * Four days of combat on the western edge of the Sawad of Iraq, on the
 * west bank of the Atiq canal — an old Euphrates branch with a single
 * causeway over it. Sa'd ibn Abi Waqqas commanded ~30,000 Muslims facing
 * Rustam Farrokhzad's Sasanian field army of ~60,000 with thirty-three
 * armoured Indian war elephants. Sa'd, struck by sciatica and boils,
 * directed the battle prone upon his chest from atop the palace of
 * Qudays through his deputy Khalid ibn Urfuta al-Udhri. Three Muslim
 * embassies preceded the fight: al-Mughira ibn Shu'ba, al-Nu'man ibn
 * Muqarrin, and finally Rib'i ibn Amir who walked his short mare over
 * the silken carpets of the gilded pavilion, tied her to a cushion,
 * and uttered the formula that would echo down the centuries:
 * «اللَّهُ ابْتَعَثَنَا لِنُخْرِجَ مَنْ شَاءَ مِنْ عِبَادَةِ العِبَادِ
 * إِلَى عِبَادَةِ اللَّهِ، وَمِنْ ضِيقِ الدُّنْيَا إِلَى سَعَتِهَا،
 * وَمِنْ جَوْرِ الأَدْيَانِ إِلَى عَدْلِ الإِسْلَامِ» — three he was
 * offered: Islam, the jizya, or open battle.
 *
 * Day 1 (Yawm Armath, 'the day of disorder'): the fight opened with
 * single combat (al-mubaraza); Sa'd recited Surat al-Anfal to the
 * troops and gave four takbirs — the fourth a signal to charge. Then
 * the thirty-three elephants advanced like walking mountains with
 * howdah-archers atop. The left wing (al-mujannibah al-yusra) trembled
 * and Banu Asad were broken back until Tulayha ibn Khuwaylid al-Asadi
 * — the rehabilitated false-prophet of yesterday's apostasy — rallied
 * them by the sword. That night, called the Night of Stillness
 * (Layla al-Hada'a), Tulayha alone penetrated a parasang (~12 km)
 * into the Persian camp, slew two cataphracts, and returned with
 * their two horses and a captive who later embraced Islam.
 *
 * Day 2 (Yawm Aghwath, 'the day of relief'): Hashim ibn Utba arrived
 * from Yarmouk with the Syrian reinforcements, and on his vanguard
 * al-Qa'qa ibn Amr al-Tamimi. Al-Qa'qa split his column into ten
 * successive waves so that the relief seemed never-ending; he draped
 * camels to look like elephants, panicking the Persian Savaran
 * cavalry whose horses did not know them; and he met Bahman Jadhuyih
 * 'Dhu al-Hajib' — the slayer of the Muslims at the Day of the Bridge
 * — and avenged them with a single stroke. The elephants did not
 * appear that day, their armour being repaired.
 *
 * Day 3 (Yawm Imas, 'the day of blind, harsh war'): Sa'd ordered the
 * army to converge on the elephants. Al-Qa'qa and Asim ibn Amr
 * struck the white elephant — leader of the herd: al-Qa'qa pierced
 * its eye, Asim severed its trunk in a single blow. The wounded
 * bull bellowed an earth-shaking cry, turned, and trampled the
 * Persian ranks behind it; the rest of the herd followed in chaos.
 * Sa'd had drilled this very squadron on a wooden elephant in the
 * months of waiting.
 *
 * Then came the Night of al-Harir — the longest night in the history
 * of the conquests. Combat continued without pause; al-Tabari likens
 * the sound of the field to harir, the low growl of dogs and the
 * buzzing of bees. Sa'd's orders ceased to reach the field, and
 * al-Qa'qa and Hashim took command in person. Al-Qa'qa called to
 * his men: «إِنَّ الدَّبْرَةَ بَعْدَ سَاعَةٍ لِمَنْ بَدَأَ القَوْمَ،
 * فَاصْبِرُوا سَاعَةً وَاحْمِلُوا، فَإِنَّ النَّصْرَ مَعَ الصَّبْرِ».
 * Some 2,500 Muslims fell that night alone.
 *
 * Day 4 (Yawm al-Qadisiyyah): a furious southwest wind rose at dawn,
 * hurling sand into Persian faces with the Muslims at their backs.
 * Battalions could no longer see battalions; cataphracts veiled
 * themselves in their forearms; a corner of the Drafsh-i Kavyani —
 * Khosrau's jewelled banner of buffalo-hide, more than twelve cubits
 * by eight — bent under the gale. The Islamic tradition reads it as
 * nasrun min Allah. Behind the curtain of sand al-Qa'qa and Hashim
 * drove through the Persian centre to the gilded pavilion. Rustam
 * fled toward the river and sheltered under the baggage mules.
 * Hilal ibn Ullafa al-Taymi — also transmitted as ibn Alqama — found
 * him there: he cut the load-rope, the cargo crashed onto Rustam and
 * broke his back; Hilal dragged him out from beneath, struck off his
 * head, leapt onto Khosrau's gilded throne and cried at the top of
 * his voice: «قَتَلْتُ رُسْتُمَ وَرَبِّ الكَعْبَةِ».
 *
 * The Sasanian army collapsed. The fugitives piled upon the single
 * causeway over the Atiq; more drowned in the river than fell on
 * the field. Zuhra ibn al-Hawiyya overtook Jalinus in the pursuit
 * and slew him near al-Sayllihin. The Drafsh-i Kavyani was taken
 * from the pavilion and dispatched to Umar in Medina, who ordered
 * it cut up and its gems distributed — proclaiming that four
 * centuries of Persian sovereignty had unwoven themselves in the
 * breast of the Caliph of the Muslims.
 *
 * Classical sources via al-Tabari report ~8,500 Muslim martyrs
 * across the four days; Sasanian losses were several times higher,
 * with most occurring in the rout across the causeway. Modern
 * academic scholarship (Donner, Morony, Pourshariati) treats
 * specific casualty figures as literary tradition rather than
 * verifiable. Qadisiyyah opened the road to Ctesiphon (which fell
 * in March 637), then Jalula (637), and finally Nahavand (21 AH /
 * 642 CE) — termed by classical Arabic historiography 'Fath
 * al-Futuh', the engagement that truly opened the Iranian plateau,
 * and culminating in the death of Yazdegerd III in 651 CE and the
 * collapse of a four-century-old empire. Sa'd founded Kufa on
 * Umar's orders, which became the political-military capital of
 * Muslim Iraq and a foundational centre of Islamic jurisprudence,
 * Quranic recitation, and Arabic grammar; the veterans gained
 * permanent elite status as 'Ahl al-Qadisiyyah' in the Kufan
 * stipend register.
 *
 * Sources: al-Tabari, Tarikh al-Rusul wa-l-Muluk, year 14 AH and
 *          year 16 AH, on the authority of Sayf ibn Umar; Ibn Kathir,
 *          al-Bidaya wa al-Nihaya; al-Mas'udi, Muruj al-Dhahab II
 *          pp. 328 and 417 (on the Drafsh-i Kavyani); al-Baladhuri,
 *          Futuh al-Buldan; Ibn al-Athir, al-Kamil fi al-Tarikh;
 *          al-Ya'qubi, Tarikh.
 */
export const battleOfQadisiyyah: BattleScenario = {
  id: 'battle-of-qadisiyyah',
  name: 'Battle of Qadisiyyah',
  nameAr: 'مَعْرَكَةُ القَادِسِيَّةِ',
  date: '16-19 Sha\'ban 15 AH (16-19 November 636 CE)',
  location: 'Western edge of the Sawad of Iraq, on the west bank of the Atiq canal (an old Euphrates branch), near the future site of Kufa',
  description:
    "The decisive four-day battle (16-19 Sha'ban 15 AH / 16-19 November 636 CE) that broke Sasanian defences in Iraq. Sa'd ibn Abi Waqqas commanded ~30,000 Muslims facing Rustam Farrokhzad's Sasanian field army of ~60,000 with thirty-three armoured Indian war elephants across the Atiq canal — an old branch of the Euphrates with a single causeway over it. Sa'd, struck by sciatica and boils, directed the battle prone upon his chest from the palace of Qudays through his deputy Khalid ibn Urfuta. Pre-battle embassies from al-Mughira ibn Shu'ba, al-Nu'man ibn Muqarrin and finally Rib'i ibn Amir delivered the formula offering Islam, jizya, or open battle: 'Allah has sent us to bring whoever wishes from the worship of servants to the worship of Allah, from the narrowness of this world to its expanse, and from the injustice of religions to the justice of Islam.' Day 1 (Yawm Armath, the day of disorder): the elephants drove Banu Asad until Tulayha al-Asadi rallied them. Day 2 (Yawm Aghwath, the day of relief): al-Qa'qa ibn Amr arrived from Yarmouk with Hashim ibn Utba's Syrian reinforcements, split his column into successive waves of ten so the relief seemed never-ending, draped camels as elephants to panic Persian Savaran horses, and slew Bahman Jadhuyih 'Dhu al-Hajib' — the slayer of the Muslims at the Day of the Bridge. Day 3 (Yawm Imas, the day of blind war): al-Qa'qa and Asim ibn Amr blinded the lead white elephant and severed its trunk; the elephant turned and trampled the Persian ranks behind it, the rest of the herd following in chaos. The Night of al-Harir (the buzzing of bees, per Tabari) followed without pause until dawn, with al-Qa'qa rallying: 'Victory falls, after one hour, to whoever begins it. Be patient one hour and charge — for victory is with patience.' Day 4 (Yawm al-Qadisiyyah): a providential southwest sandstorm blew sand into Persian faces with the Muslims at their backs; al-Qa'qa and Hashim ibn Utba broke through to Rustam's gilded pavilion. Hilal ibn Ullafa al-Taymi found Rustam sheltering under baggage mules, cut the load-rope so the cargo crushed his back, dragged him out, struck off his head, and leapt onto Khosrau's throne crying 'I have killed Rustam — by the Lord of the Ka'ba!' The Drafsh-i Kavyani — the imperial banner of jewelled buffalo-hide — was captured and dispatched to Umar in Medina, who ordered it cut up and its gems distributed. Persian losses on the single causeway over the Atiq exceeded those on the field. Classical sources via al-Tabari report ~8,500 Muslim martyrs across the four days. Sources: al-Tabari, Tarikh, year 14 AH and year 16 AH, on the authority of Sayf ibn Umar; Ibn Kathir, al-Bidaya wa al-Nihaya; al-Mas'udi, Muruj al-Dhahab II, pp. 328 and 417; al-Baladhuri, Futuh al-Buldan.",
  descriptionAr:
    'مَعْرَكَةُ القَادِسِيَّةِ — أَرْبَعَةُ أَيَّامٍ كَسَرَتْ دِفَاعَ السَّاسَانِيِّينَ في العِرَاقِ كَسْرَةً لَا قِيَامَةَ لَهَا (١٦-١٩ شَعْبَانَ ١٥هـ / ١٦-١٩ نُوفَمْبِر ٦٣٦م). قَادَ سَعْدُ بنُ أَبِي وَقَّاصٍ رضي الله عنه نَحْوَ ثَلَاثِينَ أَلْفَ مُسْلِمٍ في مُوَاجَهَةِ جَيْشِ رُسْتُمَ فَرُّخْزَادَ السَّاسَانِيِّ عَلَى ضَفَّةِ نَهْرِ العَتِيقِ، وَفِي جَيْشِهِ ثَلَاثَةٌ وَثَلَاثُونَ فِيلًا مُدَرَّعًا. أَدَارَ سَعْدٌ المَعْرَكَةَ مُنْبَطِحًا عَلَى صَدْرِهِ مِنْ فَوْقِ قَصْرِ قُدَيْسٍ لِمَا بِهِ مِنَ الدَّمَامِيلِ وَعِرْقِ النَّسَا، وَاسْتَخْلَفَ في المَيْدَانِ خَالِدَ بنَ عُرْفُطَةَ. وَقَبْلَ القِتَالِ بَعَثَ السُّفَرَاءَ إِلَى رُسْتُمَ — المُغِيرَةَ بنَ شُعْبَةَ ثُمَّ النُّعْمَانَ بنَ مُقَرِّنٍ ثُمَّ رِبْعِيَّ بنَ عَامِرٍ — فَقَالَ رِبْعِيٌّ كَلِمَتَهُ الخَالِدَةَ: «اللَّهُ ابْتَعَثَنَا لِنُخْرِجَ مَنْ شَاءَ مِنْ عِبَادَةِ العِبَادِ إِلَى عِبَادَةِ اللَّهِ، وَمِنْ ضِيقِ الدُّنْيَا إِلَى سَعَتِهَا، وَمِنْ جَوْرِ الأَدْيَانِ إِلَى عَدْلِ الإِسْلَامِ»، وَخَيَّرَهُمْ بَيْنَ الإِسْلَامِ أَوِ الجِزْيَةِ أَوِ المُنَاجَزَةِ. وَكَانَتْ أَرْبَعَةَ أَيَّامٍ مَعْلُومَةً بِأَسْمَائِهَا: يَوْمُ أَرْمَاثٍ زَحَفَتْ فِيهِ الفِيَلَةُ عَلَى المُجَنِّبَةِ اليُسْرَى وَثَبَّتَهَا طُلَيْحَةُ الأَسَدِيُّ التَّائِبُ. ثُمَّ يَوْمُ أَغْوَاثٍ جَاءَ فِيهِ المَدَدُ مِنَ الشَّامِ بِقِيَادَةِ هَاشِمِ بنِ عُتْبَةَ ابنِ أَخِي سَعْدٍ وَعَلَى طَلِيعَتِهِ القَعْقَاعُ بنُ عَمْرٍو التَّمِيمِيُّ، فَقَسَّمَ كَتِيبَتَهُ أَرْسَالًا مُتَتَابِعَةً، وَأَلْبَسَ الإِبِلَ كَالفِيَلَةِ فَنَفَرَتْ خُيُولُ السَّوَارِينَ، وَقَتَلَ بَهْمَنَ جَاذُوَيْهِ ذَا الحَاجِبِ قَاتِلَ المُسْلِمِينَ في يَوْمِ الجِسْرِ. ثُمَّ يَوْمُ عَمَاسٍ كَرَّ فِيهِ القَعْقَاعُ وَعَاصِمُ بنُ عَمْرٍو عَلَى الفِيلِ الأَبْيَضِ قَائِدِ القَطِيعِ، فَطَعَنَ القَعْقَاعُ عَيْنَهُ وَقَطَعَ عَاصِمٌ خُرْطُومَهُ، فَاسْتَدَارَ يَدُوسُ صُفُوفَ الفُرْسِ وَتَبِعَتْهُ الفِيَلَةُ في فَوْضَى. ثُمَّ كَانَتْ لَيْلَةُ الهَرِيرِ لَا يَنْقَطِعُ القِتَالُ فِيهَا حَتَّى الفَجْرِ، وَصَاحَ القَعْقَاعُ: «إِنَّ الدَّبْرَةَ بَعْدَ سَاعَةٍ لِمَنْ بَدَأَ القَوْمَ، فَاصْبِرُوا سَاعَةً وَاحْمِلُوا، فَإِنَّ النَّصْرَ مَعَ الصَّبْرِ». وَفي يَوْمِ القَادِسِيَّةِ هَبَّتْ رِيحٌ جَنُوبِيَّةٌ غَرْبِيَّةٌ تَحْمِلُ الرَّمْلَ في وُجُوهِ الفُرْسِ بِظَهْرِ المُسْلِمِينَ، فَاخْتَرَقَ القَعْقَاعُ وَهَاشِمٌ القَلْبَ الفَارِسِيَّ إِلَى السَّرَادِقِ، وَقَتَلَ هِلَالُ بنُ عُلَّفَةَ التَّيْمِيُّ رُسْتُمَ تَحْتَ بِغَالِ المَتَاعِ، وَوَثَبَ عَلَى عَرْشِ كِسْرَى صَائِحًا: «قَتَلْتُ رُسْتُمَ وَرَبِّ الكَعْبَةِ». والْتُقِطَ دِرَفْشُ كَاوِيَانَ — رَايَةُ الإِمْبَرَاطُورِيَّةِ المُرَصَّعَةُ بِالجَوَاهِرِ — فَأُرْسِلَ إِلَى عُمَرَ بنِ الخَطَّابِ في المَدِينَةِ فَأَمَرَ بِقَطْعِهِ وَتَوْزِيعِ جَوَاهِرِهِ. اسْتُشْهِدَ مِنَ المُسْلِمِينَ نَحْوُ ثَمَانِيَةِ آلَافٍ وَخَمْسِمِائَةٍ بِحَسَبِ التُّرَاثِ الكِلَاسِيكِيِّ عَبْرَ الطَّبَرِيِّ، وَقُتِلَ مِنَ الفُرْسِ أَضْعَافُ ذَلِكَ خَاصَّةً في زِحَامِ القَنْطَرَةِ الوَحِيدَةِ عَلَى نَهْرِ العَتِيقِ. المَصَادِرُ: تَارِيخُ الطَّبَرِيِّ سَنَةَ ١٤هـ وَ١٦هـ عَنْ سَيْفِ بنِ عُمَرَ؛ البِدَايَةُ وَالنِّهَايَةُ لِابنِ كَثِيرٍ؛ مُرُوجُ الذَّهَبِ لِلْمَسْعُودِيِّ؛ فُتُوحُ البُلْدَانِ لِلْبَلَاذُرِيِّ.',

  dayPhase: 'day',
  weather: 'sandstorm',
  actualDayCount: 4,

  map: {
    width: 1600,
    height: 1000,
    terrain: [
      // Base sandy desert plain — the western edge of the Sawad
      {
        id: 'main-sawad-plain',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1600, y: 0 },
          { x: 1600, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x6b552f,
        label: 'سَهْلُ القَادِسِيَّةِ',
      },
      // Atiq canal — old Euphrates branch, vertical between the two armies
      {
        id: 'nahr-atiq',
        type: 'river',
        polygon: [
          { x: 880, y: 0 },
          { x: 950, y: 0 },
          { x: 950, y: 1000 },
          { x: 880, y: 1000 },
        ],
        color: 0x1a4a6c,
        label: 'نَهْرُ العَتِيقِ',
      },
      // The single causeway over the Atiq — the rout-trap
      {
        id: 'qantara-bridge',
        type: 'fortress_wall',
        polygon: [
          { x: 880, y: 470 },
          { x: 950, y: 470 },
          { x: 950, y: 530 },
          { x: 880, y: 530 },
        ],
        color: 0x3a2c1a,
        label: 'القَنْطَرَةُ الوَحِيدَةُ',
      },
      // Western desert edge — source of the providential sandstorm on day 4
      {
        id: 'desert-edge-west',
        type: 'sand',
        polygon: [
          { x: 0, y: 700 },
          { x: 240, y: 700 },
          { x: 240, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x8a7050,
        label: 'حَافَةُ الصَّحْرَاءِ',
      },
      // Low dunes along the southern margin
      {
        id: 'southern-dunes',
        type: 'dune',
        polygon: [
          { x: 0, y: 920 },
          { x: 1600, y: 920 },
          { x: 1600, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x7a6440,
      },
      // Old filled canal — Rustam filled it to bring the elephants across
      {
        id: 'old-canal-filled',
        type: 'trench',
        polygon: [
          { x: 600, y: 240 },
          { x: 880, y: 240 },
          { x: 880, y: 300 },
          { x: 600, y: 300 },
        ],
        color: 0x554028,
        label: 'الخَنْدَقُ القَدِيمُ',
      },
      // Palace of Qudays — Sa'd's command post on the Muslim (west) side
      {
        id: 'qasr-qudays-zone',
        type: 'elevated',
        polygon: [
          { x: 80, y: 420 },
          { x: 220, y: 420 },
          { x: 220, y: 560 },
          { x: 80, y: 560 },
        ],
        color: 0x6a4f30,
        label: 'قَصْرُ قُدَيْسٍ',
      },
      // Udhayb fort — forward fort on the Muslim rear (west)
      {
        id: 'udhayb-fort-zone',
        type: 'elevated',
        polygon: [
          { x: 60, y: 200 },
          { x: 180, y: 200 },
          { x: 180, y: 320 },
          { x: 60, y: 320 },
        ],
        color: 0x6a4f30,
        label: 'حِصْنُ العُذَيْبِ',
      },
      // Sasanian camp — east bank, Rustam's gilded pavilion ground
      {
        id: 'sasanian-camp-zone',
        type: 'flat',
        polygon: [
          { x: 1300, y: 380 },
          { x: 1520, y: 380 },
          { x: 1520, y: 620 },
          { x: 1300, y: 620 },
        ],
        color: 0x5a3e22,
        label: 'مُعَسْكَرُ رُسْتُمَ',
      },
      // Scattered palms by the canal
      {
        id: 'palm-strip-east',
        type: 'oasis',
        polygon: [
          { x: 950, y: 100 },
          { x: 1080, y: 100 },
          { x: 1080, y: 300 },
          { x: 950, y: 300 },
        ],
        color: 0x3e5230,
      },
      {
        id: 'palm-strip-west',
        type: 'oasis',
        polygon: [
          { x: 760, y: 700 },
          { x: 880, y: 700 },
          { x: 880, y: 880 },
          { x: 760, y: 880 },
        ],
        color: 0x3e5230,
      },
      // Future site of Kufa — northeast of the field, indicated for the closing camera
      {
        id: 'future-kufa',
        type: 'flat',
        polygon: [
          { x: 1340, y: 60 },
          { x: 1540, y: 60 },
          { x: 1540, y: 220 },
          { x: 1340, y: 220 },
        ],
        color: 0x7a6238,
        label: 'أَرْضُ الكُوفَةِ المُسْتَقْبَلِيَّةِ',
      },
    ],
    landmarks: [
      {
        id: 'qasr-qudays',
        position: { x: 150, y: 490 },
        type: 'hill',
        label: "Sa'd's Command at the Palace of Qudays",
        labelAr: 'قَصْرُ قُدَيْسٍ — مَقَرُّ قِيَادَةِ سَعْدٍ',
      },
      {
        id: 'nahr-atiq',
        position: { x: 915, y: 200 },
        type: 'oasis',
        label: 'The Atiq Canal',
        labelAr: 'نَهْرُ العَتِيقِ',
      },
      {
        id: 'qantara',
        position: { x: 915, y: 500 },
        type: 'mountain_pass',
        label: 'The Single Causeway',
        labelAr: 'القَنْطَرَةُ الوَحِيدَةُ',
      },
      {
        id: 'sasanian-camp',
        position: { x: 1410, y: 500 },
        type: 'camp',
        label: "Rustam's Pavilion and the Drafsh-i Kavyani",
        labelAr: 'سَرَادِقُ رُسْتُمَ وَدِرَفْشُ كَاوِيَانَ',
      },
      {
        id: 'udhayb-fort',
        position: { x: 120, y: 260 },
        type: 'marker',
        label: 'Udhayb Fort — Muslim Rear',
        labelAr: 'حِصْنُ العُذَيْبِ',
      },
      {
        id: 'muslim-front',
        position: { x: 500, y: 500 },
        type: 'marker',
        label: 'Muslim Front Line',
        labelAr: 'صَفُّ المُسْلِمِينَ',
      },
      {
        id: 'elephant-corps-marker',
        position: { x: 1180, y: 500 },
        type: 'marker',
        label: 'Persian Elephant Corps',
        labelAr: 'فِيَلَةُ الفُرْسِ',
      },
      {
        id: 'desert-edge',
        position: { x: 120, y: 850 },
        type: 'marker',
        label: 'Desert Edge — Source of the Sandstorm',
        labelAr: 'حَافَةُ الصَّحْرَاءِ',
      },
      {
        id: 'old-canal',
        position: { x: 740, y: 270 },
        type: 'marker',
        label: 'Old Canal — Filled by Rustam',
        labelAr: 'الخَنْدَقُ القَدِيمُ',
      },
      {
        id: 'kufa-future',
        position: { x: 1440, y: 140 },
        type: 'marker',
        label: 'Future Site of Kufa',
        labelAr: 'أَرْضُ الكُوفَةِ المُسْتَقْبَلِيَّةِ',
      },
    ],
    backgroundColor: 0x4a3826,
  },

  forces: [
    // ─── Muslim Forces (~30,000) ──────────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 30000,
      units: [
        {
          id: 'muslim-command-qudays',
          name: "Sa'd's Command at the Palace of Qudays",
          nameAr: 'كَتِيبَةُ القِيَادَةِ في قَصْرِ قُدَيْسٍ',
          troopType: 'command',
          soldierCount: 200,
          commander: 'سَعْدُ بنُ أَبِي وَقَّاصٍ رضي الله عنه، وَنَائِبُهُ خَالِدُ بنُ عُرْفُطَةَ العُذْرِيُّ',
          startPosition: { x: 150, y: 490 },
          startFormation: 'defensive_circle',
          startFacing: 0,
          stats: { attack: 7, defense: 9, speed: 4, morale: 10 },
        },
        {
          id: 'muslim-center-qalb',
          name: 'Muslim Centre — al-Qalb and the Standard',
          nameAr: 'كَتِيبَةُ القَلْبِ وَالرَّايَةِ',
          troopType: 'infantry',
          soldierCount: 9000,
          commander: 'زُهْرَةُ بنُ الحَوِيَّةِ السَّعْدِيُّ عَلَى المُقَدِّمَةِ',
          startPosition: { x: 480, y: 500 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-right-mujannibah',
          name: 'Muslim Right Wing (al-Mujannibah al-Yumna)',
          nameAr: 'كَتِيبَةُ المُجَنِّبَةِ اليُمْنَى',
          troopType: 'infantry',
          soldierCount: 6500,
          commander: 'عَبْدُ اللَّهِ بنُ المُعْتَمِّ وَشُرَحْبِيلُ بنُ السِّمْطِ الكِنْدِيُّ',
          startPosition: { x: 480, y: 280 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 7, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-left-mujannibah',
          name: 'Muslim Left Wing (al-Mujannibah al-Yusra)',
          nameAr: 'كَتِيبَةُ المُجَنِّبَةِ اليُسْرَى',
          troopType: 'infantry',
          soldierCount: 6500,
          commander: 'عَاصِمُ بنُ عَمْرٍو التَّمِيمِيُّ وَالأَشْعَثُ بنُ قَيْسٍ الكِنْدِيُّ',
          startPosition: { x: 480, y: 720 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 7, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-asad-banu',
          name: 'Banu Asad and the Volunteers',
          nameAr: 'كَتِيبَةُ بَنِي أَسَدٍ وَالمَطَاوِيعِ',
          troopType: 'infantry',
          soldierCount: 3000,
          commander: 'طُلَيْحَةُ بنُ خُوَيْلِدٍ الأَسَدِيُّ وَحَمَّالُ بنُ مَالِكٍ',
          startPosition: { x: 540, y: 640 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 7, speed: 6, morale: 10 },
        },
        {
          id: 'muslim-syrian-vanguard',
          name: 'Syrian Reinforcements from Yarmouk',
          nameAr: 'كَتِيبَةُ مَدَدِ الشَّامِ مِنَ اليَرْمُوكِ',
          troopType: 'cavalry',
          soldierCount: 5000,
          commander: 'هَاشِمُ بنُ عُتْبَةَ ابنُ أَخِي سَعْدٍ، وَعَلَى الطَّلِيعَةِ القَعْقَاعُ بنُ عَمْرٍو التَّمِيمِيُّ',
          startPosition: { x: 60, y: 500 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 10, defense: 8, speed: 9, morale: 10 },
        },
        {
          id: 'muslim-cavalry-reserve',
          name: 'Cavalry Reserve and Champions',
          nameAr: 'كَتِيبَةُ خَيْلِ الِاحْتِيَاطِ وَالمُبَارِزِينَ',
          troopType: 'heavy_cavalry',
          soldierCount: 2500,
          commander: 'عَمْرُو بنُ مَعْدِيكَرِبَ الزُّبَيْدِيُّ وَقَيْسُ بنُ مَكْشُوحٍ المُرَادِيُّ',
          startPosition: { x: 360, y: 500 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 9, defense: 7, speed: 9, morale: 10 },
        },
        {
          id: 'muslim-anti-elephant',
          name: 'Anti-Elephant Squadron',
          nameAr: 'كَتِيبَةُ صَيَّادِي الفِيَلَةِ',
          troopType: 'siege_engineer',
          soldierCount: 800,
          commander: 'القَعْقَاعُ بنُ عَمْرٍو التَّمِيمِيُّ وَقَيْسُ بنُ هُزَيْمٍ',
          startPosition: { x: 420, y: 500 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 9, defense: 5, speed: 6, morale: 10 },
        },
        {
          id: 'muslim-archers',
          name: 'Muslim Archers',
          nameAr: 'كَتِيبَةُ النَّشَّابَةِ وَالرُّمَاةِ',
          troopType: 'archers',
          soldierCount: 2500,
          commander: 'السَّائِبُ بنُ الأَقْرَعِ الثَّقَفِيُّ',
          startPosition: { x: 420, y: 460 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 4, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-camel-disguise',
          name: 'Disguised Camel Detachment',
          nameAr: 'كَتِيبَةُ الإِبِلِ المُلَبَّسَةِ',
          troopType: 'camel_riders',
          soldierCount: 600,
          commander: 'الرَّبِيعُ بنُ مَطَرٍ الحَنْظَلِيُّ',
          startPosition: { x: 400, y: 580 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 5, defense: 4, speed: 6, morale: 9 },
        },
      ],
    },
    // ─── Sasanian Forces (~60,000 + 33 elephants) ─────────────────────────────
    {
      faction: 'sasanian',
      label: 'Sasanian Persian Forces',
      labelAr: 'جَيْشُ الفُرْسِ السَّاسَانِيِّينَ',
      totalStrength: 60000,
      units: [
        {
          id: 'sasanian-supreme',
          name: "Rustam's Pavilion and the Drafsh-i Kavyani",
          nameAr: 'سَرَادِقُ رُسْتُمَ فَرُّخْزَادَ وَدِرَفْشُ كَاوِيَانَ',
          troopType: 'command',
          soldierCount: 300,
          commander: 'رُسْتُمُ فَرُّخْزَادُ مِنْ بَيْتِ إِسْبَهْبَذَانَ، وَصِيُّ يَزْدَجِرْدَ الثَّالِثِ',
          startPosition: { x: 1410, y: 500 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 9, speed: 5, morale: 8 },
        },
        {
          id: 'sasanian-elephants',
          name: 'Indian War Elephants and the White Elephant',
          nameAr: 'كَتِيبَةُ الفِيَلَةِ الهِنْدِيَّةِ وَالفِيلِ الأَبْيَضِ',
          troopType: 'elephant',
          soldierCount: 33,
          commander: 'قَائِدُ فَيْلَقِ الفِيَلَةِ الهِنْدِيِّ، وَعَلَى الفِيلِ الأَبْيَضِ شَهْرِيَارُ بنُ كَنَارَةَ',
          startPosition: { x: 1180, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 10, defense: 10, speed: 3, morale: 8 },
        },
        {
          id: 'sasanian-clibanarii',
          name: 'Cataphract Cavalry — the Clibanarii',
          nameAr: 'كَتِيبَةُ الفُرْسَانِ المُدَجَّجِينَ',
          troopType: 'heavy_cavalry',
          soldierCount: 12000,
          commander: 'بَهْمَنُ جَاذُوَيْهِ ذُو الحَاجِبِ، هَازِمُ المُسْلِمِينَ في يَوْمِ الجِسْرِ',
          startPosition: { x: 1180, y: 380 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 9, speed: 7, morale: 7 },
        },
        {
          id: 'sasanian-savaran-right',
          name: 'Savaran Cavalry — Right Wing',
          nameAr: 'كَتِيبَةُ سَوَارَانِ المَيْمَنَةِ',
          troopType: 'cavalry',
          soldierCount: 9000,
          commander: 'هُرْمُزَانُ المِهْرَانِيُّ صَاحِبُ الأَهْوَازِ',
          startPosition: { x: 1180, y: 260 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 7, speed: 8, morale: 7 },
        },
        {
          id: 'sasanian-savaran-left',
          name: 'Savaran Cavalry — Left Wing',
          nameAr: 'كَتِيبَةُ سَوَارَانِ المَيْسَرَةِ',
          troopType: 'cavalry',
          soldierCount: 9000,
          commander: 'مِهْرَانُ الرَّازِيُّ',
          startPosition: { x: 1180, y: 740 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 7, speed: 8, morale: 7 },
        },
        {
          id: 'sasanian-infantry-center',
          name: 'Sasanian Heavy Infantry — Centre',
          nameAr: 'كَتِيبَةُ مُشَاةِ القَلْبِ السَّاسَانِيِّ',
          troopType: 'infantry',
          soldierCount: 25000,
          commander: 'جَالِينُوسُ القَائِدُ المَيْدَانِيُّ، تَحْتَ إِشْرَافِ رُسْتُمَ',
          startPosition: { x: 1240, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 8, speed: 4, morale: 6 },
        },
        {
          id: 'sasanian-archers',
          name: 'Persian Archers — the Panjakan',
          nameAr: 'كَتِيبَةُ رُمَاةِ البَنْجَكَانِ',
          troopType: 'archers',
          soldierCount: 6000,
          commander: 'أَنُوشَجَانُ السَّاسَانِيُّ',
          startPosition: { x: 1280, y: 460 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 4, speed: 4, morale: 6 },
        },
        {
          id: 'sasanian-rear-reserve',
          name: "Piruz's Reserve of the Nobles",
          nameAr: 'كَتِيبَةُ احْتِيَاطِ بِيرُوزَانَ وَالنُّبَلَاءِ',
          troopType: 'reserves',
          soldierCount: 8000,
          commander: 'بِيرُوزُ خُسْرَوَ زَعِيمُ الپَارْسِيگ',
          startPosition: { x: 1480, y: 400 },
          startFormation: 'column',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 6 },
        },
        {
          id: 'sasanian-armenian-allied',
          name: 'Armenian and Caucasian Allied Reinforcements',
          nameAr: 'كَتِيبَةُ المَدَدِ الأَرْمَنِيِّ القُوقَازِيِّ',
          troopType: 'infantry',
          soldierCount: 5000,
          commander: 'غُرِيغُور الثَّانِي نُوفِيرَاك، وَمُشِغُ الثَّالِثُ المَامِكُونِيُّ، وَجُوَانْشِير صَاحِبُ أَلْبَانِيَا القُوقَازِ',
          startPosition: { x: 1180, y: 800 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 6 },
        },
      ],
    },
  ],

  phases: [
    // Phase 1 (0-7s): Embassy of Rib'i ibn Amir
    {
      id: 'phase-embassy',
      name: "Embassy of Rib'i ibn Amir to Rustam",
      nameAr: 'سِفَارَةُ رِبْعِيِّ بنِ عَامِرٍ إِلَى رُسْتُمَ',
      startTime: 0,
      duration: 7,
      description:
        "Sa'd dispatches a sequence of envoys to Rustam — al-Mughira ibn Shu'ba, al-Nu'man ibn Muqarrin, and finally Rib'i ibn Amir in worn clothes upon a short mare. He walks her over the silken carpets, ties her to a cushion, and offers Islam, jizya, or open battle. (al-Tabari, year 14 AH, on the authority of Sayf ibn Umar.)",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.45, duration: 2.5 }, delay: 0 },
        { type: 'camera_move', params: { x: 1200, y: 380, zoom: 0.85, duration: 4 }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'pavilion-spotlight', position: { x: 1410, y: 500 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'banner-glow', targetUnitId: 'sasanian-supreme', label: 'دِرَفْشُ كَاوِيَانَ' }, delay: 2 },
        { type: 'play_effect', params: { effect: 'qudays-spotlight', position: { x: 150, y: 490 }, label: 'قَصْرُ قُدَيْسٍ' }, delay: 4 },
      ],
      triggers: [],
    },
    // Phase 2 (7-16s): Yawm Armath — the day of disorder, elephants advance
    {
      id: 'phase-armath-elephants',
      name: 'Yawm Armath — The Elephant Charge',
      nameAr: 'يَوْمُ أَرْمَاثٍ: زَحْفُ الفِيَلَةِ',
      startTime: 7,
      duration: 9,
      description:
        "Day 1 (16 Sha'ban 15 AH / 16 November 636 CE), called Armath from the disorder of the day. The fight opens with single combat (al-mubaraza); then the thirty-three elephants advance with howdah-archers atop, the left wing trembles, and Tulayha al-Asadi, al-Ash'ath, and Hammal ibn Malik rally Banu Asad to hold. (al-Tabari, on the authority of Sayf ibn Umar.)",
      actions: [
        { type: 'camera_move', params: { x: 700, y: 600, zoom: 0.75, duration: 2.5 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'duel-animation', targetUnitId: 'muslim-cavalry-reserve', label: 'عَمْرُو بنُ مَعْدِيكَرِبَ' }, delay: 1 },
        { type: 'play_effect', params: { effect: 'four-takbirs', position: { x: 150, y: 490 }, label: 'سَعْدٌ يَقْرَأُ سُورَةَ الأَنْفَالِ' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'sasanian-elephants', params: { behavior: 'advancing' }, delay: 3 },
        { type: 'move_unit', targetUnitId: 'sasanian-elephants', params: { position: { x: 700, y: 700 }, speed: 35 }, delay: 3 },
        { type: 'play_effect', params: { effect: 'camera-shake-elephant-step', intensity: 0.6 }, delay: 3.5 },
        { type: 'change_formation', targetUnitId: 'muslim-left-mujannibah', params: { formation: 'defensive_circle' }, delay: 4.5 },
        { type: 'set_behavior', targetUnitId: 'sasanian-archers', params: { behavior: 'attacking' }, delay: 4 },
        { type: 'attack_unit', targetUnitId: 'sasanian-archers', params: { targetId: 'muslim-center-qalb' }, delay: 4.5 },
        { type: 'play_effect', params: { effect: 'arrow-rain-panjakan', position: { x: 700, y: 500 } }, delay: 5 },
        { type: 'set_behavior', targetUnitId: 'muslim-asad-banu', params: { behavior: 'attacking' }, delay: 6 },
        { type: 'move_unit', targetUnitId: 'muslim-asad-banu', params: { position: { x: 620, y: 680 }, speed: 80 }, delay: 6 },
        { type: 'play_effect', params: { effect: 'tulayha-rally', targetUnitId: 'muslim-asad-banu', label: 'طُلَيْحَةُ الأَسَدِيُّ يُثَبِّتُ بَنِي أَسَدٍ' }, delay: 7 },
        { type: 'camera_move', params: { x: 600, y: 520, zoom: 0.6, duration: 2 }, delay: 4 },
      ],
      triggers: [],
    },
    // Phase 3 (16-21s): Layla al-Hada'a — Tulayha's solo night raid
    {
      id: 'phase-tulayha-night-raid',
      name: "Night of Stillness — Tulayha's Raid on the Camp",
      nameAr: 'لَيْلَةُ الهَدْأَةِ: غَارَةُ طُلَيْحَةَ عَلَى المُعَسْكَرِ',
      startTime: 16,
      duration: 5,
      description:
        'Night following day 1, called the Night of Stillness. Tulayha ibn Khuwaylid al-Asadi alone penetrates a parasang (~12 km) into the Persian camp, slays two cataphracts in single combat, and returns with their two horses and a captive who later embraced Islam. (al-Tabari, Tarikh.)',
      actions: [
        { type: 'play_effect', params: { effect: 'shift-to-night-blue', intensity: 0.85 }, delay: 0 },
        { type: 'camera_move', params: { x: 950, y: 700, zoom: 0.85, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'lone-rider-track', from: { x: 540, y: 640 }, to: { x: 1300, y: 600 } }, delay: 1 },
        { type: 'play_effect', params: { effect: 'duel-flash', position: { x: 1300, y: 600 }, intensity: 0.9 }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'lone-rider-return', from: { x: 1300, y: 600 }, to: { x: 540, y: 640 }, label: 'فَرَسَانِ وَأَسِيرٌ' }, delay: 3.5 },
      ],
      triggers: [],
    },
    // Phase 4 (21-29s): Yawm Aghwath — Syrian relief and al-Qa'qa's ruse
    {
      id: 'phase-aghwath-syrian-relief',
      name: "Yawm Aghwath — Syrian Relief and al-Qa'qa's Ruse",
      nameAr: 'يَوْمُ أَغْوَاثٍ: مَدَدُ الشَّامِ وَحِيلَةُ القَعْقَاعِ',
      startTime: 21,
      duration: 8,
      description:
        "Day 2 (17 Sha'ban). Hashim ibn Utba arrives from Yarmouk with al-Qa'qa ibn Amr on the vanguard. Al-Qa'qa splits his column into successive waves so the relief seems endless; he drapes camels as elephants to panic Persian Savaran horses; he meets and slays Bahman Jadhuyih 'Dhu al-Hajib', the slayer of the Muslims at the Day of the Bridge. (al-Tabari, on Sayf.)",
      actions: [
        { type: 'play_effect', params: { effect: 'shift-to-dawn-amber', intensity: 0.7 }, delay: 0 },
        { type: 'camera_move', params: { x: 200, y: 500, zoom: 0.55, duration: 2.5 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'muslim-syrian-vanguard', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-syrian-vanguard', params: { position: { x: 360, y: 500 }, speed: 100 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'qaqa-wave-split', count: 10, label: 'القَعْقَاعُ يَقْسِمُ كَتِيبَتَهُ أَرْسَالًا' }, delay: 2 },
        { type: 'camera_move', params: { x: 550, y: 480, zoom: 0.7, duration: 2 }, delay: 3 },
        { type: 'set_behavior', targetUnitId: 'muslim-camel-disguise', params: { behavior: 'attacking' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'muslim-camel-disguise', params: { position: { x: 850, y: 320 }, speed: 70 }, delay: 4 },
        { type: 'play_effect', params: { effect: 'horse-panic', targetUnitId: 'sasanian-savaran-right', intensity: 0.8 }, delay: 5 },
        { type: 'set_behavior', targetUnitId: 'sasanian-savaran-right', params: { behavior: 'retreating' }, delay: 5.5 },
        { type: 'play_effect', params: { effect: 'duel-animation', targetUnitId: 'muslim-syrian-vanguard', label: 'القَعْقَاعُ يَقْتُلُ بَهْمَنَ ذَا الحَاجِبِ' }, delay: 6 },
        { type: 'play_effect', params: { effect: 'elephants-grayed-out', targetUnitId: 'sasanian-elephants' }, delay: 0.5 },
      ],
      triggers: [],
    },
    // Phase 5 (29-38s): Yawm Imas — blinding the white elephant
    {
      id: 'phase-imas-elephant-blinding',
      name: 'Yawm Imas — The Blinding of the White Elephant',
      nameAr: 'يَوْمُ عَمَاسٍ: قَتْلُ الفِيلِ الأَبْيَضِ',
      startTime: 29,
      duration: 9,
      description:
        "Day 3 (18 Sha'ban), called Imas — 'blind, harsh war'. Sa'd orders the army to converge on the elephants. Al-Qa'qa and Asim ibn Amr strike the white elephant — leader of the herd: al-Qa'qa pierces its eye, Asim severs its trunk in a single blow. The wounded bull turns and tramples the Persian ranks behind it; the rest of the herd follows in chaos. (al-Tabari, on Sayf; Ibn Kathir, al-Bidaya.)",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 480, zoom: 0.9, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'unit-focus-gold', targetUnitId: 'sasanian-elephants', label: 'الفِيلُ الأَبْيَضُ' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'muslim-anti-elephant', params: { behavior: 'attacking' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'muslim-anti-elephant', params: { position: { x: 1180, y: 500 }, speed: 110 }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'muslim-anti-elephant', params: { targetId: 'sasanian-elephants' }, delay: 3 },
        { type: 'play_effect', params: { effect: 'eye-strike', position: { x: 1180, y: 500 }, label: 'طَعْنُ القَعْقَاعِ في عَيْنِ الفِيلِ' }, delay: 3.5 },
        { type: 'play_effect', params: { effect: 'trunk-sever', position: { x: 1180, y: 510 }, label: 'ضَرْبَةُ عَاصِمٍ تَقْطَعُ الخُرْطُومَ' }, delay: 4 },
        { type: 'play_effect', params: { effect: 'blood-spray', position: { x: 1180, y: 500 } }, delay: 4.2 },
        { type: 'set_behavior', targetUnitId: 'sasanian-elephants', params: { behavior: 'retreating' }, delay: 5 },
        { type: 'change_formation', targetUnitId: 'sasanian-elephants', params: { formation: 'scattered' }, delay: 5 },
        { type: 'move_unit', targetUnitId: 'sasanian-elephants', params: { position: { x: 1300, y: 500 }, speed: 80 }, delay: 5 },
        { type: 'change_formation', targetUnitId: 'sasanian-infantry-center', params: { formation: 'scattered' }, delay: 6.5 },
        { type: 'camera_move', params: { x: 800, y: 460, zoom: 0.55, duration: 2 }, delay: 7 },
      ],
      triggers: [],
    },
    // Phase 6 (38-48s): Layla al-Harir — the longest night
    {
      id: 'phase-laylat-harir',
      name: 'Night of al-Harir — The Hour of Patience and Victory',
      nameAr: 'لَيْلَةُ الهَرِيرِ: سَاعَةُ الصَّبْرِ وَالنَّصْرِ',
      startTime: 38,
      duration: 10,
      description:
        "Night of day 4 — the longest night in the history of the conquests. Combat continues without pause until dawn; al-Tabari likens the sound of the field to harir, the low growl of dogs (and the buzzing of bees). Sa'd's orders cease to reach the field; al-Qa'qa and Hashim take command in person. Al-Qa'qa: 'Victory falls, after one hour, to whoever begins it. Be patient one hour and charge — for victory is with patience.' (al-Tabari, on Sayf.)",
      actions: [
        { type: 'play_effect', params: { effect: 'shift-to-deep-night', intensity: 1.0 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'sword-flash-flicker', position: { x: 800, y: 500 } }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'audio-harir-hum', intensity: 0.9 }, delay: 0 },
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.5, duration: 6 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'muslim-command-qudays', params: { behavior: 'holding' }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'muslim-syrian-vanguard', params: { behavior: 'attacking' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'muslim-syrian-vanguard', params: { targetId: 'sasanian-infantry-center' }, delay: 2.5 },
        { type: 'attack_unit', targetUnitId: 'muslim-center-qalb', params: { targetId: 'sasanian-infantry-center' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'muslim-right-mujannibah', params: { targetId: 'sasanian-savaran-right' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'muslim-left-mujannibah', params: { targetId: 'sasanian-armenian-allied' }, delay: 3 },
        { type: 'camera_move', params: { x: 750, y: 540, zoom: 0.85, duration: 3 }, delay: 6 },
        { type: 'play_effect', params: { effect: 'qaqa-rally-quote', label: 'فَاصْبِرُوا سَاعَةً وَاحْمِلُوا، فَإِنَّ النَّصْرَ مَعَ الصَّبْرِ' }, delay: 6.5 },
        { type: 'play_effect', params: { effect: 'casualty-counter', value: 2500, label: '٢٥٠٠ شَهِيدٍ في لَيْلَةِ الهَرِيرِ' }, delay: 8 },
      ],
      triggers: [],
    },
    // Phase 7 (48-53s): Sandstorm — providential wind
    {
      id: 'phase-sandstorm-providence',
      name: 'The Sandstorm in Persian Faces',
      nameAr: 'العَاصِفَةُ الرَّمْلِيَّةُ في وُجُوهِ الفُرْسِ',
      startTime: 48,
      duration: 5,
      description:
        "Dawn of day 4 (Yawm al-Qadisiyyah). A fierce southwest wind rises, driving sand into Persian faces with the Muslims at their backs. Persian battalions cannot see, cataphracts veil themselves with their forearms, the road to Rustam's pavilion opens behind the curtain of sand. The Islamic tradition reads it as nasrun min Allah.",
      actions: [
        { type: 'camera_move', params: { x: 300, y: 700, zoom: 0.5, duration: 2 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'sandstorm-onset', direction: 'east', intensity: 1.0 } , delay: 0.5 },
        { type: 'play_effect', params: { effect: 'particle-sand-eastward', density: 1.0 }, delay: 1 },
        { type: 'play_effect', params: { effect: 'asymmetric-veil', faction: 'sasanian' }, delay: 1.5 },
        { type: 'camera_move', params: { x: 1100, y: 420, zoom: 0.75, duration: 2.5 }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'flag-bend', targetUnitId: 'sasanian-supreme', label: 'دِرَفْشُ كَاوِيَانَ يَنْحَنِي' }, delay: 3 },
        { type: 'set_behavior', targetUnitId: 'muslim-syrian-vanguard', params: { behavior: 'advancing' }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'muslim-syrian-vanguard', params: { position: { x: 950, y: 500 }, speed: 110 }, delay: 3.5 },
      ],
      triggers: [],
    },
    // Phase 8 (53-60s): Rustam killed by Hilal
    {
      id: 'phase-rustam-killed',
      name: 'The Storming of the Pavilion and the Killing of Rustam',
      nameAr: 'اقْتِحَامُ السَّرَادِقِ وَمَقْتَلُ رُسْتُمَ',
      startTime: 53,
      duration: 7,
      description:
        "At the height of the storm al-Qa'qa and Hashim drive through the Persian centre to Rustam's pavilion. Rustam flees toward the river and shelters under the baggage mules. Hilal ibn Ullafa al-Taymi cuts the load-rope; the cargo crashes onto Rustam and breaks his back; Hilal drags him out, strikes off his head, leaps onto Khosrau's gilded throne and cries: 'I have killed Rustam — by the Lord of the Ka'ba!' (al-Tabari, on Sayf.)",
      actions: [
        { type: 'camera_move', params: { x: 1000, y: 380, zoom: 0.9, duration: 2 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'muslim-syrian-vanguard', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'muslim-syrian-vanguard', params: { position: { x: 1300, y: 450 }, speed: 130 }, delay: 0.5 },
        { type: 'attack_unit', targetUnitId: 'muslim-syrian-vanguard', params: { targetId: 'sasanian-clibanarii' }, delay: 1.5 },
        { type: 'set_behavior', targetUnitId: 'sasanian-supreme', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'sasanian-supreme', params: { position: { x: 1500, y: 600 }, speed: 90 }, delay: 2 },
        { type: 'play_effect', params: { effect: 'mule-baggage-shelter', position: { x: 1500, y: 600 } }, delay: 3 },
        { type: 'play_effect', params: { effect: 'rope-cut-cargo-fall', position: { x: 1500, y: 600 } }, delay: 3.8 },
        { type: 'play_effect', params: { effect: 'kill-strike', position: { x: 1500, y: 600 }, label: 'هِلَالُ بنُ عُلَّفَةَ' }, delay: 4.3 },
        { type: 'destroy_unit', targetUnitId: 'sasanian-supreme', params: { cause: 'rustam-killed-by-hilal' }, delay: 5 },
        { type: 'camera_move', params: { x: 1250, y: 360, zoom: 0.95, duration: 2.5 }, delay: 4.5 },
        { type: 'play_effect', params: { effect: 'throne-mount-cry', label: 'قَتَلْتُ رُسْتُمَ وَرَبِّ الكَعْبَةِ' }, delay: 5.5 },
        { type: 'play_effect', params: { effect: 'morale-collapse-wave', faction: 'sasanian' }, delay: 6 },
      ],
      triggers: [],
    },
    // Phase 9 (60-65s): Qantara rout and capture of Drafsh-i Kavyani
    {
      id: 'phase-qantara-rout',
      name: 'The Massacre at the Causeway and the Capture of the Drafsh-i Kavyani',
      nameAr: 'مَجْزَرَةُ القَنْطَرَةِ وَالْتِقَاطُ دِرَفْشِ كَاوِيَانَ',
      startTime: 60,
      duration: 5,
      description:
        "With Rustam fallen the Sasanian army collapses. The fugitives pile upon the single causeway over the Atiq; more drown in the river than fell on the field. Zuhra ibn al-Hawiyya overtakes Jalinus in the pursuit and slays him near al-Sayllihin. The Drafsh-i Kavyani — Khosrau's jewelled banner of buffalo-hide, more than twelve cubits by eight — is taken from the pavilion and dispatched to Umar in Medina, who orders it cut up and its gems distributed. (al-Tabari; al-Mas'udi, Muruj al-Dhahab II.)",
      actions: [
        { type: 'camera_move', params: { x: 1100, y: 600, zoom: 0.6, duration: 2 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'sasanian-infantry-center', params: { behavior: 'retreating' }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'sasanian-clibanarii', params: { behavior: 'retreating' }, delay: 0.3 },
        { type: 'set_behavior', targetUnitId: 'sasanian-savaran-left', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'sasanian-archers', params: { behavior: 'retreating' }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'sasanian-armenian-allied', params: { behavior: 'retreating' }, delay: 0.7 },
        { type: 'change_formation', targetUnitId: 'sasanian-infantry-center', params: { formation: 'scattered' }, delay: 1 },
        { type: 'change_formation', targetUnitId: 'sasanian-clibanarii', params: { formation: 'scattered' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'sasanian-infantry-center', params: { position: { x: 920, y: 500 }, speed: 100 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'sasanian-clibanarii', params: { position: { x: 920, y: 380 }, speed: 110 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'sasanian-archers', params: { position: { x: 920, y: 460 }, speed: 95 }, delay: 1 },
        { type: 'play_effect', params: { effect: 'qantara-pile-up', position: { x: 915, y: 500 } }, delay: 2 },
        { type: 'play_effect', params: { effect: 'drowning-cataphracts', position: { x: 915, y: 600 } }, delay: 2.5 },
        { type: 'set_behavior', targetUnitId: 'muslim-center-qalb', params: { behavior: 'pursuing' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'muslim-center-qalb', params: { targetId: 'sasanian-infantry-center' }, delay: 2.5 },
        { type: 'play_effect', params: { effect: 'kill-strike', position: { x: 800, y: 880 }, label: 'زُهْرَةُ يَقْتُلُ جَالِينُوسَ قُرْبَ السَّيْلَحِينِ' }, delay: 3 },
        { type: 'destroy_unit', targetUnitId: 'sasanian-infantry-center', params: { cause: 'rout-and-drowning' }, delay: 4 },
        { type: 'play_effect', params: { effect: 'banner-capture', targetUnitId: 'muslim-syrian-vanguard', label: 'دِرَفْشُ كَاوِيَانَ في يَدِ القَعْقَاعِ' }, delay: 3.5 },
        { type: 'camera_move', params: { x: 1410, y: 500, zoom: 0.85, duration: 1.5 }, delay: 3.5 },
      ],
      triggers: [],
    },
    // Phase 10 (65-68s): Aftermath — Kufa, Mada'in, Nahavand
    {
      id: 'phase-aftermath-victory',
      name: "The Inheritance of Qadisiyyah and the Conquest of al-Mada'in",
      nameAr: 'مِيرَاثُ القَادِسِيَّةِ وَفَتْحُ المَدَائِنِ',
      startTime: 65,
      duration: 3,
      description:
        "Battle ends after four days. Classical Muslim casualty figures via al-Tabari ~8,500 across the four days; Sasanian losses several times higher. The victory shattered Sasanian defences in Iraq: Ctesiphon fell in March 637, then Jalula (637), and finally Nahavand (21 AH / 642) — Fath al-Futuh. The veterans became 'Ahl al-Qadisiyyah' — the highest stipend rank in the Kufan register Sa'd founded.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 500, zoom: 0.4, duration: 2.5 }, delay: 0 },
        { type: 'play_effect', params: { effect: 'casualty-display', muslim: 8500, enemy: 30000 }, delay: 0.5 },
        { type: 'play_effect', params: { effect: 'future-route-overlay', label: 'القَادِسِيَّةُ — المَدَائِنُ — جَلُولَاءُ — نِهَاوَنْدُ' }, delay: 1.5 },
        { type: 'play_effect', params: { effect: 'kufa-future-glow', position: { x: 1440, y: 140 } }, delay: 2 },
        { type: 'play_effect', params: { effect: 'fade-to-credits' }, delay: 2.5 },
      ],
      triggers: [],
    },
  ],

  narration: [
    {
      id: 'narr-embassy-rustam',
      time: 0.5,
      duration: 6,
      text: "Within Rustam's gilded pavilion, amid silken carpets and cushions of gold, Rib'i ibn Amir entered in worn clothes upon a short mare, walking her over the silks and tying her to a cushion. When asked what brought him, he answered: 'Allah has sent us to bring whoever wishes from the worship of servants to the worship of Allah, from the narrowness of this world to its expanse, and from the injustice of religions to the justice of Islam.' Three he was offered: Islam, the jizya, or open battle. (al-Tabari, on the authority of Sayf ibn Umar.)",
      textAr:
        'في سَرَادِقِ رُسْتُمَ المُذَهَّبِ، حَيْثُ بُسُطُ الحَرِيرِ وَوَسَائِدُ الذَّهَبِ، دَخَلَ رِبْعِيُّ بنُ عَامِرٍ بِثِيَابٍ خَلِقَةٍ وَفَرَسٍ قَصِيرَةٍ، فَأَوْطَأَهَا الحَرِيرَ وَرَبَطَهَا عَلَى وِسَادَةٍ، فَلَمَّا قِيلَ لَهُ: مَا جَاءَ بِكُمْ؟ قَالَ: «اللَّهُ ابْتَعَثَنَا لِنُخْرِجَ مَنْ شَاءَ مِنْ عِبَادَةِ العِبَادِ إِلَى عِبَادَةِ اللَّهِ، وَمِنْ ضِيقِ الدُّنْيَا إِلَى سَعَتِهَا، وَمِنْ جَوْرِ الأَدْيَانِ إِلَى عَدْلِ الإِسْلَامِ». ثَلَاثٌ يُخَيَّرُ بَيْنَهُنَّ رُسْتُمُ: الإِسْلَامُ، أَوِ الجِزْيَةُ، أَوِ المُنَاجَزَةُ.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-saad-from-fort',
      time: 7.5,
      duration: 5,
      text: "Sa'd, whom Umar had appointed for his precedence in faith, his companionship of the Prophet, his daring and courage, lay prone upon his chest atop the palace of Qudays — afflicted with boils and sciatica that prevented him from mounting. He directed the army through his deputy Khalid ibn Urfuta. He recited Surat al-Anfal to the troops and gave four takbirs: the first a warning, the fourth a signal to charge.",
      textAr:
        'أَمَّا سَعْدٌ رضي الله عنه، فَقَدْ بَعَثَهُ عُمَرُ لِسَابِقَتِهِ وَصُحْبَتِهِ وَلِجُرْأَتِهِ وَشَجَاعَتِهِ. وَقَدْ أَقْعَدَتْهُ الدَّمَامِيلُ وَعِرْقُ النَّسَا فَلَمْ يَسْتَطِعِ الرُّكُوبَ، فَأَدَارَ المَعْرَكَةَ مِنْ فَوْقِ قَصْرِ قُدَيْسٍ مُنْبَطِحًا عَلَى صَدْرِهِ، وَاسْتَخْلَفَ في المَيْدَانِ خَالِدَ بنَ عُرْفُطَةَ العُذْرِيَّ يَنْقُلُ أَوَامِرَهُ. ثُمَّ قَرَأَ عَلَى الجُيُوشِ سُورَةَ الأَنْفَالِ، وَكَبَّرَ أَرْبَعَ تَكْبِيرَاتٍ، فَكَانَتِ الأُولَى نَذِيرًا، وَالرَّابِعَةُ إِيذَانًا بِالحَمْلَةِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-armath-elephants',
      time: 13,
      duration: 5,
      text: "Day of Armath — the day of disorder. The thirty-three armoured elephants advanced like walking mountains, with their howdah-archers atop. Muslim horses recoiled, the left wing trembled — and Tulayha al-Asadi, the rehabilitated false-prophet of yesterday's apostasy, charged forward to redeem his honour with his sword. Umar said of him and Amr ibn Madikarib: 'Each of them counts for a thousand men.'",
      textAr:
        'يَوْمُ أَرْمَاثٍ — يَوْمُ الفَوْضَى. تَقَدَّمَتِ الفِيَلَةُ الثَّلَاثَةُ وَالثَّلَاثُونَ بِأَبْرَاجِهَا كَأَنَّهَا جِبَالٌ تَمْشِي، فَاضْطَرَبَتْ خُيُولُ المُسْلِمِينَ، وَتَزَلْزَلَتْ صُفُوفُ المُجَنِّبَةِ اليُسْرَى، فَانْدَفَعَ طُلَيْحَةُ الأَسَدِيُّ — مُدَّعِي النُّبُوَّةِ التَّائِبُ بِالأَمْسِ — يَسْتَرِدُّ شَرَفَهُ بِسَيْفِهِ، وَكَانَ عُمَرُ يَقُولُ إِنَّهُ وَعَمْرَو بنَ مَعْدِيكَرِبَ بِأَلْفِ رَجُلٍ.',
      style: 'dramatic',
      position: 'top',
    },
    {
      id: 'narr-tulayha-night',
      time: 17,
      duration: 4,
      text: 'On the Night of Stillness following Armath, Tulayha alone penetrated a parasang deep into the Persian camp, slew two cataphracts in single combat, and returned with their two horses and a captive who later embraced Islam and supplied intelligence. Such was the repentance of the sword.',
      textAr:
        'وَلَيْلَةُ الهَدْأَةِ — لَيْلَةَ السُّكُونِ بَعْدَ يَوْمِ أَرْمَاثٍ — تَوَغَّلَ طُلَيْحَةُ وَحْدَهُ فَرْسَخًا في مُعَسْكَرِ الفُرْسِ، فَصَرَعَ فَارِسَيْنِ في نِزَالٍ فَرْدِيٍّ ثُمَّ عَادَ بِفَرَسَيْهِمَا وَأَسِيرٍ أَسْلَمَ بَعْدَ ذَلِكَ وَدَلَّ المُسْلِمِينَ. هَكَذَا تَابَ التَّائِبُ تَوْبَةَ السَّيْفِ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-aghwath-ruse',
      time: 22,
      duration: 6,
      text: "Day of Aghwath — the day of relief. Dust rose at the desert's western edge: Hashim ibn Utba, Sa'd's nephew, arriving with the heroes of Yarmouk, and on the vanguard al-Qa'qa ibn Amr al-Tamimi. Al-Qa'qa split his column into successive waves so that the reinforcement seemed never-ending; he draped camels to look like elephants, panicking the Persian Savaran cavalry whose horses did not know them. Then he met Bahman Jadhuyih 'Dhu al-Hajib' — the slayer of the Muslims at the Day of the Bridge — and avenged them with a single stroke.",
      textAr:
        'يَوْمُ أَغْوَاثٍ — يَوْمُ الغَوْثِ. سَطَعَ غُبَارٌ مِنْ حَافَةِ الصَّحْرَاءِ غَرْبًا، فَإِذَا هَاشِمُ بنُ عُتْبَةَ ابنُ أَخِي سَعْدٍ مُقْبِلٌ بِأَبْطَالِ اليَرْمُوكِ، وَعَلَى الطَّلِيعَةِ القَعْقَاعُ بنُ عَمْرٍو التَّمِيمِيُّ. قَسَّمَ القَعْقَاعُ كَتِيبَتَهُ أَرْسَالًا مُتَتَابِعَةً، فَكَأَنَّمَا المَدَدُ لَا يَنْقَطِعُ. ثُمَّ أَلْبَسَ الإِبِلَ كَأَنَّهَا فِيَلَةٌ، فَنَفَرَتْ خُيُولُ السَّوَارِينَ وَلَمْ تَأْنَسْ بِهَا. وَالْتَقَى القَعْقَاعُ بِبَهْمَنَ جَاذُوَيْهِ ذِي الحَاجِبِ — قَاتِلِ المُسْلِمِينَ في يَوْمِ الجِسْرِ — فَاقْتَصَّ مِنْهُ بِضَرْبَةٍ وَاحِدَةٍ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-imas-white-elephant',
      time: 30,
      duration: 6,
      text: "Day of Imas — the day of blind war. Sa'd ordered the army to converge on the elephants. Al-Qa'qa and Asim ibn Amr struck the white elephant — leader of the herd: al-Qa'qa pierced its eye, Asim severed its trunk in a single blow. It bellowed an earth-shaking cry, turned, and trampled the Persian ranks behind it; the rest of the herd followed in chaos. Sa'd, in the months of waiting, had drilled this very squadron against a wooden elephant.",
      textAr:
        'يَوْمُ عَمَاسٍ — يَوْمُ الحَرْبِ العَمْيَاءِ. أَمَرَ سَعْدٌ بِالتَّفَرُّغِ لِلْفِيَلَةِ، فَكَرَّ القَعْقَاعُ وَعَاصِمُ بنُ عَمْرٍو عَلَى الفِيلِ الأَبْيَضِ قَائِدِ القَطِيعِ. طَعَنَ القَعْقَاعُ عَيْنَهُ، وَهَوَى عَاصِمٌ عَلَى خُرْطُومِهِ بِسَيْفٍ فَقَطَعَهُ، فَصَرَخَ الفِيلُ صَرْخَةً هَزَّتِ الأَرْضَ، وَاسْتَدَارَ يَدُوسُ صُفُوفَ مَنْ خَلْفَهُ مِنَ الفُرْسِ، فَاتَّبَعَتْهُ الفِيَلَةُ كُلُّهَا في فَوْضَى. وَكَانَ سَعْدٌ قَدْ دَرَّبَ صَيَّادِيهِ مُسْبَقًا عَلَى نَمُوذَجِ فِيلٍ خَشَبِيٍّ في أَيَّامِ الِانْتِظَارِ.',
      style: 'dramatic',
      position: 'top',
    },
    {
      id: 'narr-laylat-harir-quote',
      time: 39,
      duration: 7,
      text: "Night of al-Harir — the longest night in the history of the conquests. Speech broke down between the armies and became a continuous low growl; Sa'd's orders ceased to reach the field, and al-Qa'qa and Hashim took command themselves. Al-Qa'qa called to his men: 'Victory falls, after one hour, to whoever begins it. Be patient one hour and charge — for victory is with patience.' Takbirs rose from exhausted throats, and the fighting did not stop until dawn. (al-Tabari, via Sayf ibn Umar.)",
      textAr:
        'وَلَيْلَةُ الهَرِيرِ — أَطْوَلُ لَيْلَةٍ في تَارِيخِ الفُتُوحِ. اِنْقَطَعَ الكَلَامُ بَيْنَ الفَرِيقَيْنِ فَكَانَ كَلَامُهُمُ الهَرِيرَ، وَانْقَطَعَتْ أَوَامِرُ سَعْدٍ مِنَ القَصْرِ، فَتَوَلَّى القَعْقَاعُ وَهَاشِمٌ القِيَادَةَ بِأَنْفُسِهِمَا. صَاحَ القَعْقَاعُ في أَصْحَابِهِ: «إِنَّ الدَّبْرَةَ بَعْدَ سَاعَةٍ لِمَنْ بَدَأَ القَوْمَ، فَاصْبِرُوا سَاعَةً وَاحْمِلُوا، فَإِنَّ النَّصْرَ مَعَ الصَّبْرِ». فَخَرَجَتِ التَّكْبِيرَاتُ مِنْ حُلُوقٍ مُتْعَبَةٍ، وَمَا زَالَ القِتَالُ حَتَّى الفَجْرِ.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-saad-inheritance',
      time: 46,
      duration: 4,
      text: "From the palace of Qudays, Sa'd looked out upon the dust-choked dawn and said to his men: 'This is your inheritance, promised to you by your Lord.' Then he raised his hands: 'O Allah, cover our flaws, calm our fears, and grant us victory over the disbelieving people.'",
      textAr:
        'نَظَرَ سَعْدٌ مِنْ قَصْرِ قُدَيْسٍ إِلَى الفَجْرِ المُغْبَرِّ، وَقَالَ لِجُنْدِهِ: «هَذَا مِيرَاثُكُمْ وَعَدَكُمُوهُ رَبُّكُمْ». ثُمَّ رَفَعَ يَدَيْهِ: «اللَّهُمَّ اسْتُرْ عَوْرَتَنَا وَآمِنْ رَوْعَتَنَا، وَانْصُرْنَا عَلَى القَوْمِ الكَافِرِينَ».',
      style: 'quote',
      position: 'top',
    },
    {
      id: 'narr-sandstorm',
      time: 50,
      duration: 4,
      text: 'At the apex of the fourth day — the Day of Qadisiyyah itself — a furious wind rose from the southwest, hurling sand into Persian faces with the Muslims at its back. Battalions could no longer see battalions; cataphracts veiled themselves in their forearms; a corner of the Drafsh-i Kavyani bent under the gale — as though the empire itself were stooping.',
      textAr:
        'وَفي ذُرْوَةِ اليَوْمِ الرَّابِعِ — يَوْمِ القَادِسِيَّةِ — هَبَّتْ رِيحٌ عَاصِفَةٌ مِنَ الجَنُوبِ الغَرْبِيِّ تَحْمِلُ الرَّمْلَ في وُجُوهِ الفُرْسِ بِظَهْرِ المُسْلِمِينَ، فَلَمْ يُبْصِرِ الكَتَائِبُ الكَتَائِبَ، وَاحْتَجَبَ الفُرْسَانُ بِأَذْرُعِهِمْ، وَانْكَسَرَ شَطْرٌ مِنْ دِرَفْشِ كَاوِيَانَ تَحْتَ ثِقَلِ الرِّيحِ — كَأَنَّ الإِمْبَرَاطُورِيَّةَ نَفْسَهَا تَنْحَنِي.',
      style: 'dramatic',
      position: 'top',
    },
    {
      id: 'narr-rustam-killed',
      time: 54,
      duration: 6,
      text: "Behind the curtain of sand, al-Qa'qa and Hashim drove through the Persian centre to the gilded pavilion. Rustam fled toward the river and sheltered under the baggage mules. Hilal ibn Ullafa al-Taymi — also transmitted as ibn Alqama — found him there: he cut the load-rope, the cargo crashed onto Rustam and broke his back, Hilal dragged him out from beneath, struck off his head, then leapt onto the Khosrau throne and cried at the top of his voice: 'I have killed Rustam — by the Lord of the Ka'ba!' (al-Tabari, on the authority of Sayf ibn Umar.)",
      textAr:
        'خَلْفَ سِتَارِ الرَّمْلِ، اخْتَرَقَ القَعْقَاعُ وَهَاشِمٌ القَلْبَ الفَارِسِيَّ إِلَى السَّرَادِقِ المُذَهَّبِ. فَرَّ رُسْتُمُ نَحْوَ النَّهْرِ وَاحْتَمَى تَحْتَ بِغَالِ المَتَاعِ، فَلَمْ يَدْرِ بِهِ هِلَالُ بنُ عُلَّفَةَ التَّيْمِيُّ — وَيُرْوَى ابْنَ عَلْقَمَةَ — حَتَّى قَطَعَ حَبْلَ الحَمْلِ فَهَوَى الحَمْلُ عَلَى ظَهْرِ رُسْتُمَ فَكَسَرَهُ، فَاسْتَلَّهُ هِلَالٌ مِنْ تَحْتِهَا، وَضَرَبَ عُنُقَهُ، ثُمَّ وَثَبَ عَلَى عَرْشِ كِسْرَى المُذَهَّبِ وَصَاحَ بِأَعْلَى صَوْتِهِ: «قَتَلْتُ رُسْتُمَ وَرَبِّ الكَعْبَةِ!»',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-drafsh-captured',
      time: 60,
      duration: 4,
      text: "And the Drafsh-i Kavyani — Khosrau's banner inherited from the age of legend, encrusted with jewels upon hide, more than twelve cubits by eight — fell into Muslim hands. It was sent to Umar in Medina; he ordered it cut into pieces and its gems distributed — proclaiming that four centuries of Persian sovereignty had unwoven themselves in the breast of the Caliph of the Muslims. (al-Mas'udi, Muruj al-Dhahab II, pp. 328 and 417.)",
      textAr:
        'وَوَقَعَ دِرَفْشُ كَاوِيَانَ — رَايَةُ كِسْرَى المَوْرُوثَةُ مِنْ زَمَنِ الأَسَاطِيرِ، المُرَصَّعَةُ بِالجَوَاهِرِ عَلَى جِلْدٍ، تَزِيدُ عَلَى اثْنَتَيْ عَشْرَةَ ذِرَاعًا في ثَمَانٍ — في يَدِ المُسْلِمِينَ. أُرْسِلَتْ إِلَى عُمَرَ بنِ الخَطَّابِ في المَدِينَةِ، فَأَمَرَ بِقَطْعِهَا وَتَوْزِيعِ جَوَاهِرِهَا، إِعْلَانًا بِأَنَّ سِيَادَةَ الفُرْسِ التي امْتَدَّتْ أَرْبَعَةَ قُرُونٍ قَدْ تَفَكَّكَتْ في صَدْرِ خَلِيفَةِ المُسْلِمِينَ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-qantara-rout',
      time: 64,
      duration: 2.5,
      text: 'The fugitives piled upon the single causeway over the Atiq, and more drowned in the river than fell on the field. Zuhra ibn al-Hawiyya overtook Jalinus in the pursuit and slew him.',
      textAr:
        'تَكَدَّسَ الفُرَّارُ عَلَى القَنْطَرَةِ الوَحِيدَةِ فَوْقَ العَتِيقِ، فَكَانَ مَنْ غَرِقَ في النَّهْرِ أَكْثَرَ مِمَّنْ قُتِلَ في المَيْدَانِ. وَأَدْرَكَ زُهْرَةُ بنُ الحَوِيَّةِ جَالِينُوسَ في المُطَارَدَةِ فَقَتَلَهُ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-aftermath',
      time: 65.5,
      duration: 2.5,
      text: "Qadisiyyah broke Persia's defence in Iraq beyond recovery: Ctesiphon fell in March 637, then Jalula, then Nahavand in 21 AH — the Conquest of Conquests. Sa'd founded Kufa, and the heroes of the battle became Ahl al-Qadisiyyah — the highest stipend rank in the Muslim register.",
      textAr:
        'كَسَرَتِ القَادِسِيَّةُ دِفَاعَ الفُرْسِ في العِرَاقِ كَسْرَةً لَا قِيَامَةَ لَهَا — فَسَقَطَتِ المَدَائِنُ في آذَارَ سَنَةَ سَبْعٍ وَثَلَاثِينَ وَسِتِّمِائَةٍ، ثُمَّ جَلُولَاءُ، ثُمَّ نِهَاوَنْدُ سَنَةَ إِحْدَى وَعِشْرِينَ — فَتْحُ الفُتُوحِ. وَأَسَّسَ سَعْدٌ الكُوفَةَ، وَصَارَ أَبْطَالُ القَادِسِيَّةِ «أَهْلَ القَادِسِيَّةِ» — أَرْفَعَ طَبَقَةٍ في عَطَاءِ المُسْلِمِينَ.',
      style: 'normal',
      position: 'bottom',
    },
  ],

  cameraScript: [
    { time: 0, position: { x: 800, y: 500 }, zoom: 0.45, duration: 2.5, easing: 'power2.out', type: 'overview' },
    { time: 2.5, position: { x: 1200, y: 380 }, zoom: 0.85, duration: 4.5, easing: 'power2.inOut', type: 'zoom', followEntityId: 'sasanian-supreme' },
    { time: 7, position: { x: 400, y: 350 }, zoom: 0.7, duration: 1.5, easing: 'power2.out', type: 'pan', followEntityId: 'muslim-command-qudays' },
    { time: 8.5, position: { x: 700, y: 600 }, zoom: 0.75, duration: 2.5, easing: 'power2.inOut', type: 'focus', followEntityId: 'muslim-cavalry-reserve' },
    { time: 11, position: { x: 600, y: 520 }, zoom: 0.6, duration: 5, easing: 'power2.out', type: 'follow', followEntityId: 'sasanian-elephants' },
    { time: 16, position: { x: 950, y: 700 }, zoom: 0.85, duration: 5, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-asad-banu' },
    { time: 21, position: { x: 200, y: 500 }, zoom: 0.55, duration: 3, easing: 'power2.out', type: 'pan', followEntityId: 'muslim-syrian-vanguard' },
    { time: 24, position: { x: 550, y: 480 }, zoom: 0.7, duration: 5, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-camel-disguise' },
    { time: 29, position: { x: 800, y: 480 }, zoom: 0.9, duration: 6, easing: 'power2.inOut', type: 'focus', followEntityId: 'sasanian-elephants' },
    { time: 35, position: { x: 800, y: 460 }, zoom: 0.55, duration: 3, easing: 'power2.out', type: 'overview' },
    { time: 38, position: { x: 800, y: 500 }, zoom: 0.5, duration: 6, easing: 'power2.inOut', type: 'pan' },
    { time: 44, position: { x: 750, y: 540 }, zoom: 0.85, duration: 4, easing: 'power2.out', type: 'focus', followEntityId: 'muslim-syrian-vanguard' },
    { time: 48, position: { x: 300, y: 700 }, zoom: 0.5, duration: 2.5, easing: 'power2.out', type: 'pan' },
    { time: 50.5, position: { x: 1100, y: 420 }, zoom: 0.75, duration: 2.5, easing: 'power2.inOut', type: 'focus', followEntityId: 'sasanian-savaran-right' },
    { time: 53, position: { x: 1000, y: 380 }, zoom: 0.9, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'muslim-syrian-vanguard' },
    { time: 57, position: { x: 1250, y: 360 }, zoom: 0.95, duration: 3, easing: 'power2.out', type: 'focus', followEntityId: 'sasanian-supreme' },
    { time: 60, position: { x: 1100, y: 600 }, zoom: 0.6, duration: 5, easing: 'power2.inOut', type: 'overview' },
    { time: 65, position: { x: 800, y: 500 }, zoom: 0.4, duration: 3, easing: 'power2.out', type: 'overview' },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 8500,
    enemyCasualties: 30000,
    summary:
      "A decisive Muslim victory after four days of combat (16-19 November 636 CE / late Sha'ban 15 AH), traditionally named Yawm al-Armath, Yawm Aghwath, Yawm Imas, and the Night of al-Harir / Day of al-Qadisiyyah. The Sasanian elephant corps was broken by al-Qa'qa and Asim ibn Amr, who blinded the lead white elephant and severed its trunk. Commander-in-chief Rustam Farrokhzad was slain by Hilal ibn Ullafa under cover of a providential sandstorm, and the imperial Drafsh-i Kavyani — Khosrau's jewel-encrusted banner — was captured and dispatched to Umar in Medina, who ordered it cut up and its gems distributed. Classical sources via al-Tabari report ~8,500 Muslim martyrs across the four days; Sasanian losses were several times higher, with most occurring in the rout across the Atiq's single causeway. Modern academic scholarship (Donner, Morony, Pourshariati) treats specific casualty figures as literary tradition rather than verifiable.",
    summaryAr:
      'انْتِصَارٌ مُسْلِمٌ حَاسِمٌ بَعْدَ أَرْبَعَةِ أَيَّامٍ مِنَ القِتَالِ (١٦-١٩ نُوفَمْبِر ٦٣٦م / أَوَاخِرِ شَعْبَانَ ١٥هـ): أَرْمَاثٌ، أَغْوَاثٌ، عَمَاسٌ، وَلَيْلَةُ الهَرِيرِ ثُمَّ يَوْمُ القَادِسِيَّةِ. كُسِرَتْ فِيَلَةُ الفُرْسِ عَلَى يَدِ القَعْقَاعِ وَعَاصِمٍ بِقَتْلِ الفِيلِ الأَبْيَضِ، وَقُتِلَ القَائِدُ العَامُّ رُسْتُمُ فَرُّخْزَادُ عَلَى يَدِ هِلَالِ بنِ عُلَّفَةَ تَحْتَ سِتَارِ عَاصِفَةٍ رَمْلِيَّةٍ، وَالْتُقِطَ دِرَفْشُ كَاوِيَانَ رَايَةُ كِسْرَى المُرَصَّعَةُ بِالجَوَاهِرِ فَأُرْسِلَتْ إِلَى عُمَرَ بنِ الخَطَّابِ في المَدِينَةِ فَأَمَرَ بِقَطْعِهَا وَتَوْزِيعِ جَوَاهِرِهَا. خَسَائِرُ المُسْلِمِينَ بِحَسَبِ التُّرَاثِ الكِلَاسِيكِيِّ عَبْرَ الطَّبَرِيِّ نَحْوُ ٨٥٠٠ شَهِيدٍ، وَخَسَائِرُ الفُرْسِ أَضْعَافُ ذَلِكَ خَاصَّةً في زِحَامِ القَنْطَرَةِ الوَحِيدَةِ عَلَى نَهْرِ العَتِيقِ.',
    significance:
      "Qadisiyyah shattered Sasanian defences in Mesopotamia and opened the road to Ctesiphon (which fell in March 637), then Jalula (637), and finally Nahavand (21 AH / 642 CE) — termed by classical Arabic historiography 'Fath al-Futuh' (the Conquest of Conquests), the engagement that truly opened the Iranian plateau. The chain culminated in the death of Yazdegerd III in 651 CE and the collapse of a four-century-old empire. Sa'd founded Kufa on Umar's orders, which became the political-military capital of Muslim Iraq and a foundational centre of Islamic jurisprudence, Quranic recitation, and Arabic grammar; the veterans gained permanent elite status as 'Ahl al-Qadisiyyah' in the Kufan stipend register. Together with Yarmouk three months earlier, Qadisiyyah is widely regarded as one of the most consequential battles of late antiquity.",
    significanceAr:
      'كَسَرَتِ القَادِسِيَّةُ دِفَاعَ الإِمْبَرَاطُورِيَّةِ السَّاسَانِيَّةِ في العِرَاقِ كَسْرَةً لَا قِيَامَةَ لَهَا، وَفَتَحَتْ طَرِيقَ المَدَائِنِ (سَقَطَتْ في مَارِسَ ٦٣٧م)، ثُمَّ جَلُولَاءَ (٦٣٧م)، ثُمَّ نِهَاوَنْدَ (٢١هـ/٦٤٢م) — التي سَمَّاهَا المُؤَرِّخُونَ «فَتْحَ الفُتُوحِ» إِذْ فَتَحَتْ هَضْبَةَ إِيرَانَ كُلَّهَا. أَفْضَى ذَلِكَ إِلَى مَقْتَلِ يَزْدَجِرْدَ الثَّالِثِ سَنَةَ ٦٥١م وَنِهَايَةِ إِمْبَرَاطُورِيَّةٍ فَارِسِيَّةٍ امْتَدَّتْ أَرْبَعَةَ قُرُونٍ. وَأَسَّسَ سَعْدٌ مَدِينَةَ الكُوفَةِ بِأَمْرِ عُمَرَ، فَصَارَتْ عَاصِمَةَ العِرَاقِ المُسْلِمِ وَأَرْضَ الفِقْهِ وَالقِرَاءَةِ وَالنَّحْوِ، وَصَارَ أَبْطَالُ القَادِسِيَّةِ «أَهْلَ القَادِسِيَّةِ» يَحْمِلُونَ أَعْلَى مَرْتَبَةٍ في عَطَاءِ المُسْلِمِينَ. تُعَدُّ القَادِسِيَّةُ مَعَ اليَرْمُوكِ مِنْ أَعْظَمِ مَعَارِكِ العُصُورِ الوُسْطَى أَثَرًا في خَرِيطَةِ العَالَمِ.',
  },

  totalDuration: 68,
};
