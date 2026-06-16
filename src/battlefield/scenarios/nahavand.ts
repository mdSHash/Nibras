import type { BattleScenario } from '../types/scenario';

/**
 * مَعْرَكَةُ نَهَاوَنْدَ — فَتْحُ الفُتُوحِ
 * Battle of Nahavand — The Conquest of Conquests
 *
 * 21 AH / 642 CE — Caliphate of Umar ibn al-Khattab
 * Northern Zagros, Hamadan province, ~90 km south of Ecbatana,
 * 1,681 m elevation across the Alvand massif on the Sasanian
 * highway from Iraq onto the Iranian plateau.
 *
 * Yazdegird III's last grand muster: Hamadan, Rayy, Isfahan, Qum,
 * Adharbayjan, Nahavand and the mountain provinces under Firuzan
 * (al-Fayruzan). Tabari's chronicle gives the host as up to 150,000
 * — the figure modern historians treat as a literary topos for the
 * scale of the rout, not a literal count. The Muslim army of ~30,000
 * under An-Nu'man ibn Muqarrin al-Muzani marched from Kufa via Hulwan.
 *
 * Umar refused to march in person — Ali advised him that he was the
 * pole around which the Arabs turned (قُطْبُ العَرَبِ). The Caliph
 * wrote a sealed line of succession: Nu'man, then Hudhayfah ibn
 * al-Yaman, then the Muqarrin clan, then al-Mughirah ibn Shu'bah.
 *
 * The Persians entrenched themselves outside the fortress, sowed
 * iron caltrops (حَسَكُ الحَدِيد) across the approaches and chained
 * the front rank against flight. Two days of stalemate followed.
 * Tulayha al-Asadi — once a "false prophet" of the Ridda, now a
 * devout warrior whose counsel Umar himself had recommended —
 * proposed the كَرّ بَعْدَ الفَرّ: a feigned retreat to lure the
 * Persians off the caltrop belt. Al-Qa'qa' ibn Amr at-Tamimi led
 * the lure; the Persians took the bait and rolled out of their
 * trench.
 *
 * On Friday after zawal Nu'man raised his hands and prayed to be
 * granted the day's first martyrdom — his exact words preserved in
 * Tabari's Tarikh under year 21 AH. He instructed the army by the
 * three-takbir signal: ready, arm, charge. As the third takbir
 * sounded the Muslim line surged. The Savaran heavy cavalry broke
 * upon the disciplined spear-wall; the wings under Hudhayfah on
 * the right and Suwayd on the left wrapped the Persian centre.
 *
 * In the climactic press Nu'man's horse slipped in blood and he
 * fell mortally wounded. His brother (Nu'aym, or in some narrations
 * Suwayd) covered him with a cloak; the standard passed to Hudhayfah
 * before it touched the ground. Ma'qil ibn Yasar wiped the dust from
 * the dying commander's face. Nu'man asked only one thing — "What
 * did the people do?" — and on hearing victory, said: "الحَمْدُ لِلَّهِ
 * — اكْتُبُوا بِذَلِكَ إِلَى عُمَر" before he expired.
 *
 * The Persian army broke. Firuzan fled north toward Hamadan; al-Qa'qa'
 * ibn Amr and Nu'aym ibn Muqarrin pursued and overtook him at a narrow
 * pass blocked by a caravan of mules and donkeys laden with honey.
 * Forced to dismount, Firuzan climbed the mountainside on foot. The
 * pursuers caught and killed him there. The defile entered Arabic
 * geographical memory as ثَنِيَّةُ العَسَل — the Pass of Honey.
 *
 * Umar received the bisharah in Medina and wept. Of the unnamed
 * martyrs he said: «وَمَا ضَرَّهُمْ أَلَّا يَعْرِفَهُمْ أَمِيرُ المُؤْمِنِين؟ لَكِنَّ اللَّهَ يَعْرِفُهُم».
 * The Companions named the day فَتْحُ الفُتُوحِ — the Conquest of
 * Conquests — because no Sasanian field army would assemble after it.
 * Yazdegird III fled east through Istakhr, Kirman, Sijistan and
 * Khorasan until he was killed at Marv in 31 AH; Hamadan, Rayy,
 * Isfahan, Adharbayjan, Fars, Kirman and Khorasan fell province by
 * province in the decade that followed.
 *
 * Sources: at-Tabari, Tarikh ar-Rusul wa'l-Muluk (year 21 AH);
 *          Ibn al-Athir, al-Kamil fi't-Tarikh;
 *          Ibn Kathir, al-Bidayah wa'n-Nihayah, vol. 7;
 *          al-Baladhuri, Futuh al-Buldan;
 *          Abu Yusuf, Kitab al-Kharaj (booty distribution).
 */
export const battleOfNahavand: BattleScenario = {
  id: 'battle-of-nahavand',
  name: 'Battle of Nahavand',
  nameAr: 'معركة نهاوند',
  date: '21 AH (642 CE)',
  location: 'Nahavand, northern Zagros — Hamadan province, modern western Iran',
  description:
    "The decisive battle of the Caliph Umar's Persian campaign. Yazdegird III mustered a final coalition of ~100,000–150,000 from the mountain provinces under Firuzan, entrenched at Nahavand behind iron caltrops with the front rank chained against flight. Umar named An-Nu'man ibn Muqarrin commander and wrote a sealed succession beginning with Hudhayfah ibn al-Yaman. After a two-day stalemate, Tulayha al-Asadi proposed the famous feigned retreat; al-Qa'qa' ibn Amr executed it, drawing the Persians off the caltrop belt. Nu'man prayed for first-martyrdom on Friday after zawal, signalled the assault by three takbirs, and was killed at the moment of breakthrough. Hudhayfah took the standard per Umar's letter, the death was concealed until victory was sealed, and the Persians routed. Firuzan was overtaken at a narrow pass blocked by a honey-laden caravan and killed climbing the mountain on foot — Thaniyyat al-Asal. The Companions named it Fath al-Futuh; no Sasanian field army assembled after it.",
  descriptionAr:
    'الوَقْعَةُ الفَاصِلَةُ مِنْ غَزَوَاتِ عُمَرَ بنِ الخَطَّابِ رَضِيَ اللهُ عَنْهُ فِي بِلَادِ فَارِسَ. حَشَدَ يَزْدَجِرْدُ الثَّالِثُ آخِرَ جَمْعٍ نِظَامِيٍّ مِنْ مَرَازِبَةِ الجِبَالِ وَهَمَذَانَ وَالرَّيِّ وَأَصْبَهَانَ وَأَذْرَبِيجَانَ تَحْتَ إِمْرَةِ الفَيْرُزَانِ، فَتَحَصَّنُوا بِنَهَاوَنْدَ خَلْفَ الخَنَادِقِ، وَنَثَرُوا حَسَكَ الحَدِيدِ فِي المَدَاخِلِ، وَتَوَاصَوْا بِالسَّلَاسِلِ أَلَّا يَفِرَّ مِنْهُمْ أَحَدٌ. أَمَّرَ عُمَرُ النُّعْمَانَ بْنَ مُقَرِّنٍ المُزَنِيَّ، وَنَصَّ السَّلْسِلَةَ كِتَابَةً: فَإِنْ أُصِيبَ فَحُذَيْفَةُ بنُ اليَمَانِ، ثُمَّ مَنْ بَعْدَهُ. وَلَمَّا طَالَ المُقَامُ يَوْمَيْنِ، أَشَارَ طُلَيْحَةُ الأَسَدِيُّ بِالكَرِّ بَعْدَ الفَرِّ، فَنَفَّذَهُ القَعْقَاعُ بنُ عَمْرٍو حَتَّى انْكَشَفَ الفُرْسُ مِنْ خَنَادِقِهِمْ. وَلَمَّا زَالَتْ شَمْسُ الجُمُعَةِ دَعَا النُّعْمَانُ أَنْ يَكُونَ أَوَّلَ شَهِيدٍ، وَأَمَرَ بِثَلَاثِ تَكْبِيرَاتٍ. عِنْدَ الثَّالِثَةِ حَمَلَ الجَيْشُ، فَتَكَسَّرَتْ صَدْمَةُ السَّاوَرَانِ عَلَى صَبْرِ المُهَاجِرِينَ، وَزَلَّتْ فَرَسُ النُّعْمَانِ فِي الدِّمَاءِ فَخَرَّ شَهِيداً. سَتَرَ مَوْتَهُ أَخُوهُ، وَأَخَذَ الرَّايَةَ حُذَيْفَةُ قَبْلَ أَنْ تَمَسَّ الأَرْضَ، فَحُسِمَ الأَمْرُ. وَفَرَّ الفَيْرُزَانُ صَاعِداً فِي طَرِيقِ هَمَذَانَ، فَأَدْرَكَهُ القَعْقَاعُ وَنُعَيْمُ بنُ مُقَرِّنٍ فِي ثَنِيَّةٍ ضَيِّقَةٍ سَدَّتْهَا قَافِلَةُ بِغَالٍ مُحَمَّلَةٌ عَسَلاً، فَنَزَلَ عَنْ دَابَّتِهِ يَتَسَلَّقُ الجَبَلَ، فَقُتِلَ هُنَاكَ، وَسُمِّيَتِ الثَّنِيَّةُ ثَنِيَّةَ العَسَلِ. سَمَّاهَا الصَّحَابَةُ فَتْحَ الفُتُوحِ، فَلَمْ يَقُمْ لِيَزْدَجِرْدَ بَعْدَهَا جَيْشٌ.',

  // Cold dawn in the Zagros highlands; the historical battle joined
  // on a Friday after zawal, but the campaign opens at first light.
  dayPhase: 'dawn',
  weather: 'clear',
  // ~3 days of campaign: muster + two-day stalemate + the decisive Friday + pursuit.
  actualDayCount: 3,

  // ─── Map ───────────────────────────────────────────────────────────────────
  // Zagros foothill terrain: open plain in the centre, mountains north
  // and east, the Alvand massif funnelling toward Hamadan, the Gamasab
  // stream skirting the south, the Sasanian fortified position east
  // behind a caltrop belt and trench, and the gorge of Thaniyyat al-Asal
  // at the head of the Hamadan road.
  map: {
    width: 1450,
    height: 950,
    terrain: [
      // Open plain — the heart of the field where the engagement is fought
      {
        id: 'nahavand-plain',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1450, y: 0 },
          { x: 1450, y: 950 },
          { x: 0, y: 950 },
        ],
        color: 0x6b5a3e,
        label: 'سَهْلُ نَهَاوَنْدَ',
      },
      // Northern Zagros range — far horizon, jagged peaks with snow
      {
        id: 'zagros-north',
        type: 'mountain',
        polygon: [
          { x: 0, y: 0 },
          { x: 1450, y: 0 },
          { x: 1450, y: 95 },
          { x: 0, y: 95 },
        ],
        color: 0x3c2a1a,
        label: 'سِلْسِلَةُ زَاجْرُوس',
      },
      // The Alvand massif — east-northeast of the field, wraps toward the pass
      {
        id: 'alvand-massif',
        type: 'mountain',
        polygon: [
          { x: 1230, y: 95 },
          { x: 1450, y: 95 },
          { x: 1450, y: 470 },
          { x: 1230, y: 320 },
        ],
        color: 0x3c2a1a,
        label: 'جَبَلُ الأَلْوَنْد',
      },
      // Thaniyyat al-Asal — the narrow defile at the head of the Hamadan road
      {
        id: 'thaniyyat-al-asal',
        type: 'gorge',
        polygon: [
          { x: 1100, y: 130 },
          { x: 1230, y: 130 },
          { x: 1230, y: 320 },
          { x: 1100, y: 280 },
        ],
        color: 0x1c1a18,
        label: 'ثَنِيَّةُ العَسَلِ',
      },
      // Persian high ground — elevated ridge they entrench upon
      {
        id: 'persian-elevated',
        type: 'elevated',
        polygon: [
          { x: 880, y: 250 },
          { x: 1100, y: 250 },
          { x: 1100, y: 720 },
          { x: 880, y: 720 },
        ],
        color: 0x6b5a4a,
      },
      // Fortified perimeter — fortress wall + trench rendered as the iconic
      // Persian dug-in line. Two tiles: caltrop belt (fortress_wall to read
      // as a hazard band) and the trench behind it.
      {
        id: 'caltrop-belt',
        type: 'fortress_wall',
        polygon: [
          { x: 760, y: 280 },
          { x: 870, y: 280 },
          { x: 870, y: 700 },
          { x: 760, y: 700 },
        ],
        color: 0x6b6359,
        label: 'حَسَكُ الحَدِيدِ',
      },
      {
        id: 'persian-trench',
        type: 'trench',
        polygon: [
          { x: 870, y: 280 },
          { x: 920, y: 280 },
          { x: 920, y: 700 },
          { x: 870, y: 700 },
        ],
        color: 0x2a1a08,
        label: 'الخَنْدَقُ',
      },
      // Nahavand fortress — the citadel proper behind the trench
      {
        id: 'nahavand-fortress',
        type: 'fortress_wall',
        polygon: [
          { x: 1080, y: 320 },
          { x: 1240, y: 320 },
          { x: 1240, y: 640 },
          { x: 1080, y: 640 },
        ],
        color: 0x5a5048,
        label: 'حِصْنُ نَهَاوَنْدَ',
      },
      // Muslim camp — west, on the Kufa-Hulwan road approach
      {
        id: 'muslim-camp',
        type: 'flat',
        polygon: [
          { x: 30, y: 380 },
          { x: 200, y: 380 },
          { x: 200, y: 620 },
          { x: 30, y: 620 },
        ],
        color: 0x8c6f3f,
      },
      // Rocky broken ground — the Arabic chronicles describe the field
      // as wa'r and shi'ab; render scattered rocky bands across no-man's-land
      {
        id: 'broken-ground-north',
        type: 'rocky',
        polygon: [
          { x: 380, y: 95 },
          { x: 760, y: 95 },
          { x: 760, y: 240 },
          { x: 380, y: 240 },
        ],
        color: 0x4a3d2e,
      },
      {
        id: 'broken-ground-south',
        type: 'rocky',
        polygon: [
          { x: 380, y: 740 },
          { x: 760, y: 740 },
          { x: 760, y: 880 },
          { x: 380, y: 880 },
        ],
        color: 0x4a3d2e,
      },
      // Gamasab stream — thin river band on the southern edge
      {
        id: 'gamasab-stream',
        type: 'river',
        polygon: [
          { x: 0, y: 895 },
          { x: 1450, y: 895 },
          { x: 1450, y: 950 },
          { x: 0, y: 950 },
        ],
        color: 0x2a5e8c,
        label: 'نَهْرُ قَمَّاسَب',
      },
    ],
    landmarks: [
      {
        id: 'numan-command',
        position: { x: 110, y: 500 },
        type: 'camp',
        label: "An-Nu'man's Command",
        labelAr: 'مَقَرُّ النُّعْمَانِ بْنِ مُقَرِّنٍ',
      },
      {
        id: 'firuzan-pavilion',
        position: { x: 1160, y: 480 },
        type: 'marker',
        label: "Firuzan's Pavilion",
        labelAr: 'سُرَادِقُ الفَيْرُزَانِ',
      },
      {
        id: 'caltrops-marker',
        position: { x: 815, y: 490 },
        type: 'marker',
        label: 'Iron Caltrops',
        labelAr: 'نَثْرُ حَسَكِ الحَدِيدِ',
      },
      {
        id: 'wajj-rud',
        position: { x: 540, y: 500 },
        type: 'marker',
        label: 'Wajj ar-Rudh',
        labelAr: 'وَجُّ الرُّوذِ',
      },
      {
        id: 'hamadan-road',
        position: { x: 1080, y: 200 },
        type: 'mountain_pass',
        label: 'Hamadan Road',
        labelAr: 'طَرِيقُ هَمَذَانَ',
      },
      {
        id: 'honey-pass',
        position: { x: 1170, y: 220 },
        type: 'mountain_pass',
        label: 'Thaniyyat al-Asal',
        labelAr: 'ثَنِيَّةُ العَسَلِ',
      },
    ],
    backgroundColor: 0x2c1a10,
  },

  // ─── Forces ────────────────────────────────────────────────────────────────
  forces: [
    // ─── Muslim Forces (~30,000) ────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جَيْشُ المُسْلِمِينَ',
      totalStrength: 30000,
      units: [
        {
          // Nu'man's command — the centre, the standard, the takbir signal post
          id: 'numan-command',
          name: "An-Nu'man's Command",
          nameAr: 'كَتِيبَةُ النُّعْمَانِ بْنِ مُقَرِّنٍ',
          troopType: 'command',
          soldierCount: 1500,
          commander: "An-Nu'man ibn Muqarrin al-Muzani",
          startPosition: { x: 290, y: 500 },
          startFormation: 'line',
          startFacing: 0, // facing east toward the Persian fortress
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // Al-Qa'qa's mujarradah — the light vanguard that executed the lure
          id: 'qaqa-vanguard',
          name: "Al-Qa'qa's Vanguard (al-Mujarradah)",
          nameAr: 'مُقَدِّمَةُ القَعْقَاعِ بْنِ عَمْرٍو (المُجَرَّدَة)',
          troopType: 'cavalry',
          soldierCount: 3000,
          commander: "Al-Qa'qa' ibn Amr at-Tamimi",
          startPosition: { x: 380, y: 500 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 9, defense: 6, speed: 10, morale: 10 },
        },
        {
          // Nu'aym's advance — first contact, brother of the slain commander
          id: 'nuaym-advance',
          name: "Nu'aym ibn Muqarrin's Advance",
          nameAr: 'مُقَدِّمَةُ نُعَيْمِ بْنِ مُقَرِّنٍ',
          troopType: 'infantry',
          soldierCount: 4500,
          commander: "Nu'aym ibn Muqarrin al-Muzani",
          startPosition: { x: 320, y: 410 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // Hudhayfah's right wing — second in Umar's written succession
          id: 'hudhayfah-right',
          name: "Hudhayfah's Right Wing",
          nameAr: 'مَيْمَنَةُ حُذَيْفَةَ بْنِ اليَمَانِ',
          troopType: 'infantry',
          soldierCount: 6000,
          commander: 'Hudhayfah ibn al-Yaman',
          startPosition: { x: 280, y: 290 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          // Suwayd's left wing — third Muqarrin brother to bear command
          id: 'suwayd-left',
          name: "Suwayd ibn Muqarrin's Left Wing",
          nameAr: 'مَيْسَرَةُ سُوَيْدِ بْنِ مُقَرِّنٍ',
          troopType: 'infantry',
          soldierCount: 6000,
          commander: 'Suwayd ibn Muqarrin al-Muzani',
          startPosition: { x: 280, y: 700 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          // Tulayha's archers — the man whose counsel turned the campaign,
          // martyred on this field along with his idea's success
          id: 'tulayhah-archers',
          name: "Tulayha al-Asadi's Archers",
          nameAr: 'رُمَاةُ طُلَيْحَةَ الأَسَدِيِّ',
          troopType: 'archers',
          soldierCount: 3500,
          commander: 'Tulayha ibn Khuwaylid al-Asadi',
          startPosition: { x: 360, y: 590 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 5, speed: 5, morale: 10 },
        },
        {
          // Al-Mughirah's cavalry — the embassy and the support flank
          id: 'mughirah-cavalry',
          name: "Al-Mughirah's Cavalry",
          nameAr: 'خَيَّالَةُ المُغِيرَةِ بْنِ شُعْبَةَ',
          troopType: 'cavalry',
          soldierCount: 2500,
          commander: "Al-Mughirah ibn Shu'bah ath-Thaqafi",
          startPosition: { x: 220, y: 380 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 8, defense: 7, speed: 9, morale: 9 },
        },
        {
          // Mujashi's reserve — sealing the rear, the encirclement piece
          id: 'mujashi-rear',
          name: "Mujashi's Reserve",
          nameAr: 'سَاقَةُ مُجَاشِعِ بْنِ مَسْعُودٍ',
          troopType: 'reserves',
          soldierCount: 2500,
          commander: "Mujashi' ibn Mas'ud as-Sulami",
          startPosition: { x: 130, y: 510 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
        {
          // Amr ibn Ma'dikarib's tribal cavalry from Yemen — small, killed
          // on this field per Tabari's casualty list
          id: 'amr-cavalry',
          name: "Amr ibn Ma'dikarib's Cavalry",
          nameAr: 'فُرْسَانُ عَمْرِو بْنِ مَعْدِيكَرِبَ',
          troopType: 'cavalry',
          soldierCount: 500,
          commander: "Amr ibn Ma'dikarib az-Zubaydi",
          startPosition: { x: 260, y: 620 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 9, defense: 6, speed: 8, morale: 9 },
        },
      ],
    },

    // ─── Sasanian Forces (chronicle tradition: up to 150,000 — here ~100,000) ──
    {
      faction: 'sasanian',
      label: 'Sasanian Forces',
      labelAr: 'جَيْشُ الفُرْسِ السَّاسَانِيِّينَ',
      totalStrength: 100000,
      units: [
        {
          // Firuzan and his royal guard — behind the trench, will flee
          // the field and be killed at Thaniyyat al-Asal
          id: 'firuzan-command',
          name: "Firuzan's Command",
          nameAr: 'قَلْبُ الفَيْرُزَانِ',
          troopType: 'command',
          soldierCount: 3000,
          commander: 'Firuzan (al-Fayruzan)',
          startPosition: { x: 1160, y: 480 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI, // facing west toward the Muslims
          stats: { attack: 8, defense: 9, speed: 6, morale: 8 },
        },
        {
          // The Savaran on the Persian right — under Mardanshah, "Dhu'l-Hajib"
          id: 'savaran-right',
          name: "Mardanshah's Savaran (Right)",
          nameAr: 'السَّاوَرَانُ — مَيْمَنَةُ مَرْدَانْشَاهَ',
          troopType: 'heavy_cavalry',
          soldierCount: 15000,
          commander: "Mardanshah Dhu'l-Hajib",
          startPosition: { x: 970, y: 320 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 7, morale: 8 },
        },
        {
          // The Savaran on the Persian left — under Bundar, who received
          // al-Mughirah's embassy
          id: 'savaran-left',
          name: "Bundar's Savaran (Left)",
          nameAr: 'السَّاوَرَانُ — مَيْسَرَةُ بُنْدَارَ',
          troopType: 'heavy_cavalry',
          soldierCount: 12000,
          commander: 'Bundar',
          startPosition: { x: 970, y: 660 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 7, morale: 8 },
        },
        {
          // The chained infantry — Nahavand's signature feature: the front
          // rank tied together with iron rings against flight
          id: 'chained-infantry',
          name: 'Chained Infantry',
          nameAr: 'الرَّجَّالَةُ المُتَسَلْسِلَةُ بِالحَدِيدِ',
          troopType: 'infantry',
          soldierCount: 45000,
          commander: 'Mountain Marzbans',
          startPosition: { x: 920, y: 490 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 9, speed: 3, morale: 7 },
        },
        {
          // Mountain archers from Hamadan and Rayy on the elevated edges
          id: 'mountain-archers',
          name: 'Mountain Archers',
          nameAr: 'رُمَاةُ الجِبَالِ',
          troopType: 'archers',
          soldierCount: 12000,
          commander: 'Hamadan and Rayy Captains',
          startPosition: { x: 1020, y: 280 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 5, speed: 4, morale: 7 },
        },
        {
          // The men who scattered the caltrops — siege engineers in the
          // Nibras taxonomy
          id: 'caltrop-engineers',
          name: 'Caltrop Engineers',
          nameAr: 'نَاشِرُو حَسَكِ الحَدِيدِ',
          troopType: 'siege_engineer',
          soldierCount: 1500,
          commander: 'Persian Smiths',
          startPosition: { x: 815, y: 490 },
          startFormation: 'scattered',
          startFacing: Math.PI,
          stats: { attack: 4, defense: 5, speed: 3, morale: 6 },
        },
        {
          // Fortress reserves — the citadel garrison committed to the field
          // once the lure pulled the chained line forward
          id: 'fortress-reserves',
          name: 'Fortress Reserves',
          nameAr: 'احْتِيَاطُ نَهَاوَنْدَ',
          troopType: 'reserves',
          soldierCount: 11500,
          commander: 'Mountain Marzbans',
          startPosition: { x: 1160, y: 380 },
          startFormation: 'column',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 4, morale: 7 },
        },
      ],
    },
  ],

  // ─── Phases (72 simulation seconds) ──────────────────────────────────────
  phases: [
    // Phase 1 (0–6s): Muster. Wide aerial of the Zagros highlands at dawn.
    // Persian banners thicken at the fortress; a single Muslim courier rides
    // west toward Medina with the news of the Persian muster.
    {
      id: 'phase-01-muster',
      name: 'The Persian Muster',
      nameAr: 'اجْتِمَاعُ الجُمُوعِ',
      startTime: 0,
      duration: 6,
      description:
        "Yazdegird III's last grand muster. Coalitions from Hamadan, Rayy, Isfahan, Qum, Adharbayjan and Nahavand fill the high ground east; a single Muslim courier carries word to Umar in Medina.",
      actions: [
        { type: 'camera_move', params: { x: 750, y: 480, zoom: 0.45, duration: 4 }, delay: 0 },
        // Mountain archers settle onto the elevated rim
        { type: 'change_formation', targetUnitId: 'mountain-archers', params: { formation: 'line' }, delay: 1 },
        // Caltrop engineers scatter forward of the trench
        { type: 'move_unit', targetUnitId: 'caltrop-engineers', params: { position: { x: 815, y: 490 }, speed: 30 }, delay: 1 },
      ],
      triggers: [],
    },

    // Phase 2 (6–11s): Umar's appointment. The Muslim column climbs the road
    // from Hulwan; the chain of succession is named.
    {
      id: 'phase-02-appointment',
      name: "Umar's Appointment",
      nameAr: 'كِتَابُ عُمَرَ وَإِمْرَةُ النُّعْمَانِ',
      startTime: 6,
      duration: 5,
      description:
        "Umar names An-Nu'man ibn Muqarrin commander and writes a sealed line of succession beginning with Hudhayfah ibn al-Yaman. The Muslim army of ~30,000 marches from Kufa via Hulwan to Nahavand.",
      actions: [
        { type: 'camera_move', params: { x: 280, y: 500, zoom: 0.6, duration: 3 }, delay: 0 },
        // Muslim column moves into camp positions west of the caltrop belt
        { type: 'move_unit', targetUnitId: 'numan-command', params: { position: { x: 290, y: 500 }, speed: 40 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'nuaym-advance', params: { position: { x: 320, y: 410 }, speed: 40 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hudhayfah-right', params: { position: { x: 280, y: 290 }, speed: 40 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'suwayd-left', params: { position: { x: 280, y: 700 }, speed: 40 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'mughirah-cavalry', params: { position: { x: 220, y: 380 }, speed: 50 }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'tulayhah-archers', params: { position: { x: 360, y: 590 }, speed: 40 }, delay: 2 },
      ],
      triggers: [],
    },

    // Phase 3 (11–16s): Caltrop discovery. The Muslims find the Persians
    // entrenched and the iron caltrops scattered before the trench.
    {
      id: 'phase-03-caltrops-discovery',
      name: 'Iron Caltrops Discovered',
      nameAr: 'كَشْفُ حَسَكِ الحَدِيدِ',
      startTime: 11,
      duration: 5,
      description:
        "The Muslims arrive to find the Persians dug in behind a band of iron caltrops, the front rank chained against flight. A scout's horse is wounded by a hidden caltrop; small detachments creep forward by night to clear them.",
      actions: [
        { type: 'camera_move', params: { x: 815, y: 490, zoom: 0.7, duration: 2.5 }, delay: 0 },
        // A small detachment from Nu'aym's advance creeps forward to the caltrop band
        { type: 'move_unit', targetUnitId: 'nuaym-advance', params: { position: { x: 480, y: 410 }, speed: 35 }, delay: 1 },
        // Scout cavalry probe — Mughirah's troop forward and back
        { type: 'move_unit', targetUnitId: 'mughirah-cavalry', params: { position: { x: 540, y: 380 }, speed: 80 }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'mughirah-cavalry', params: { position: { x: 320, y: 380 }, speed: 70 }, delay: 3.5 },
      ],
      triggers: [],
    },

    // Phase 4 (16–22s): Mughirah's embassy to Bundar.
    {
      id: 'phase-04-embassy',
      name: "Al-Mughirah's Embassy to Bundar",
      nameAr: 'سِفَارَةُ المُغِيرَةِ إِلَى بُنْدَارَ',
      startTime: 16,
      duration: 6,
      description:
        "Tabari records Nu'man sending al-Mughirah ibn Shu'bah as envoy to the Persian commander Bundar. Mughirah meets Persian disdain by speaking of pre-Islamic Arab poverty and the Prophet's ﷺ promise.",
      actions: [
        { type: 'camera_move', params: { x: 700, y: 500, zoom: 0.55, duration: 2 }, delay: 0 },
        // Mughirah crosses no-man's-land to the Persian left where Bundar commands
        { type: 'move_unit', targetUnitId: 'mughirah-cavalry', params: { position: { x: 880, y: 540 }, speed: 65 }, delay: 1 },
        // Camera tightens on the meeting
        { type: 'camera_move', params: { x: 880, y: 540, zoom: 0.85, duration: 2 }, delay: 3 },
        // Mughirah returns to Muslim lines
        { type: 'move_unit', targetUnitId: 'mughirah-cavalry', params: { position: { x: 220, y: 380 }, speed: 80 }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 5 (22–28s): Council and Tulayha's counsel.
    {
      id: 'phase-05-council',
      name: "Council & Tulayha's Counsel",
      nameAr: 'مَجْلِسُ الحَرْبِ وَمَشُورَةُ طُلَيْحَةَ',
      startTime: 22,
      duration: 6,
      description:
        "Two days of stalemate. Nu'man convenes a war council; Tulayha al-Asadi proposes the kar-after-farr — a feigned retreat to lure the Persians off their caltrop-belted high ground. Nu'man assigns al-Qa'qa' ibn Amr to execute it.",
      actions: [
        { type: 'camera_move', params: { x: 320, y: 500, zoom: 0.7, duration: 2 }, delay: 0 },
        // Tulayha shifts forward in the line as the plan is set
        { type: 'move_unit', targetUnitId: 'tulayhah-archers', params: { position: { x: 380, y: 560 }, speed: 35 }, delay: 1 },
        // Qa'qa's vanguard moves to the front
        { type: 'move_unit', targetUnitId: 'qaqa-vanguard', params: { position: { x: 460, y: 500 }, speed: 70 }, delay: 2 },
        { type: 'change_formation', targetUnitId: 'qaqa-vanguard', params: { formation: 'wedge' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 6 (28–34s): Nu'man's dua and the three takbirs.
    {
      id: 'phase-06-dua',
      name: "Nu'man's Dua & The Three Takbirs",
      nameAr: 'دُعَاءُ النُّعْمَانِ وَالتَّكْبِيرَاتُ الثَّلَاثُ',
      startTime: 28,
      duration: 6,
      description:
        'Friday after zawal, winds rising. Nu\'man raises his hands and prays: "O Allah, glorify Your religion, give victory to Your servants, and make Nu\'man the first martyr today." The army says Amin and weeps. He instructs the three-takbir signal: at the first, ready; at the second, arm; at the third, charge.',
      actions: [
        { type: 'camera_move', params: { x: 540, y: 470, zoom: 0.75, duration: 2.5 }, delay: 0 },
        // Nu'man's command pushes a step forward — ceremonial advance
        { type: 'move_unit', targetUnitId: 'numan-command', params: { position: { x: 380, y: 500 }, speed: 30 }, delay: 1 },
        // First two takbirs — wings dress the line, archers nock
        { type: 'change_formation', targetUnitId: 'hudhayfah-right', params: { formation: 'line' }, delay: 3 },
        { type: 'change_formation', targetUnitId: 'suwayd-left', params: { formation: 'line' }, delay: 3 },
        { type: 'change_formation', targetUnitId: 'tulayhah-archers', params: { formation: 'line' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 7 (34–39s): Feigned retreat. Al-Qa'qa' executes three lure cycles.
    {
      id: 'phase-07-feigned-retreat',
      name: 'The Feigned Retreat',
      nameAr: 'الكَرُّ بَعْدَ الفَرِّ',
      startTime: 34,
      duration: 5,
      description:
        "Al-Qa'qa' ibn Amr leads the mujarradah forward, looses arrows, then withdraws — three times over. The chained Persian infantry takes the bait and rolls forward off the trench; the Savaran charge with them. The caltrop belt is irrelevant once the Persians clear it themselves.",
      actions: [
        { type: 'camera_move', params: { x: 620, y: 460, zoom: 0.8, duration: 2 }, delay: 0 },
        // First lure: Qa'qa skirmishes forward
        { type: 'set_behavior', targetUnitId: 'qaqa-vanguard', params: { behavior: 'attacking' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'qaqa-vanguard', params: { position: { x: 700, y: 460 }, speed: 130 }, delay: 0 },
        // First withdraw
        { type: 'set_behavior', targetUnitId: 'qaqa-vanguard', params: { behavior: 'retreating' }, delay: 1.5 },
        { type: 'move_unit', targetUnitId: 'qaqa-vanguard', params: { position: { x: 460, y: 500 }, speed: 130 }, delay: 1.5 },
        // Second lure
        { type: 'set_behavior', targetUnitId: 'qaqa-vanguard', params: { behavior: 'attacking' }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'qaqa-vanguard', params: { position: { x: 720, y: 480 }, speed: 130 }, delay: 2.5 },
        { type: 'set_behavior', targetUnitId: 'qaqa-vanguard', params: { behavior: 'retreating' }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'qaqa-vanguard', params: { position: { x: 480, y: 500 }, speed: 130 }, delay: 3.5 },
        // The Persians take the bait — chained infantry rolls forward off the trench
        { type: 'set_behavior', targetUnitId: 'chained-infantry', params: { behavior: 'advancing' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'chained-infantry', params: { position: { x: 740, y: 490 }, speed: 50 }, delay: 2 },
        // Savaran wings surge with them
        { type: 'set_behavior', targetUnitId: 'savaran-right', params: { behavior: 'advancing' }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'savaran-right', params: { position: { x: 760, y: 320 }, speed: 90 }, delay: 2.5 },
        { type: 'set_behavior', targetUnitId: 'savaran-left', params: { behavior: 'advancing' }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'savaran-left', params: { position: { x: 760, y: 660 }, speed: 90 }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 8 (39–44s): Third takbir and the collision.
    {
      id: 'phase-08-charge',
      name: 'Third Takbir & The Charge',
      nameAr: 'التَّكْبِيرَةُ الثَّالِثَةُ وَالحَمْلَةُ',
      startTime: 39,
      duration: 5,
      description:
        'The third takbir sounds. The whole Muslim line surges. The Savaran charge breaks upon the disciplined spear-wall of the Muhajirun; Hudhayfah on the right and Suwayd on the left begin to wrap the Persian centre.',
      actions: [
        { type: 'camera_move', params: { x: 700, y: 480, zoom: 0.55, duration: 2 }, delay: 0 },
        // Centre holds as a spear-wall, then absorbs and presses
        { type: 'set_behavior', targetUnitId: 'numan-command', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'numan-command', params: { position: { x: 600, y: 500 }, speed: 70 }, delay: 0.5 },
        { type: 'set_behavior', targetUnitId: 'nuaym-advance', params: { behavior: 'attacking' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'nuaym-advance', params: { position: { x: 580, y: 430 }, speed: 70 }, delay: 0.5 },
        // Wings press in
        { type: 'set_behavior', targetUnitId: 'hudhayfah-right', params: { behavior: 'flanking' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hudhayfah-right', params: { position: { x: 620, y: 320 }, speed: 80 }, delay: 1 },
        { type: 'set_behavior', targetUnitId: 'suwayd-left', params: { behavior: 'flanking' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'suwayd-left', params: { position: { x: 620, y: 660 }, speed: 80 }, delay: 1 },
        // Mughirah's cavalry and Amr's tribal cavalry support the wings
        { type: 'move_unit', targetUnitId: 'mughirah-cavalry', params: { position: { x: 560, y: 350 }, speed: 100 }, delay: 1.2 },
        { type: 'move_unit', targetUnitId: 'amr-cavalry', params: { position: { x: 560, y: 640 }, speed: 100 }, delay: 1.2 },
        // Engagements
        { type: 'attack_unit', targetUnitId: 'numan-command', params: { targetId: 'chained-infantry' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'nuaym-advance', params: { targetId: 'chained-infantry' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'hudhayfah-right', params: { targetId: 'savaran-right' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'suwayd-left', params: { targetId: 'savaran-left' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'tulayhah-archers', params: { targetId: 'savaran-right' }, delay: 2.5 },
        { type: 'attack_unit', targetUnitId: 'qaqa-vanguard', params: { targetId: 'chained-infantry' }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 9 (44–49s): Nu'man's martyrdom.
    {
      id: 'phase-09-numan-falls',
      name: "An-Nu'man's Martyrdom",
      nameAr: 'اِسْتِشْهَادُ النُّعْمَانِ',
      startTime: 44,
      duration: 5,
      description:
        "At the height of the press Nu'man's horse slips in blood and he falls — fatally wounded as he had prayed. His brother (Nu'aym, or in some accounts Suwayd) covers him with a cloak; the standard passes to Hudhayfah ibn al-Yaman per Umar's letter before it touches the ground. Ma'qil ibn Yasar wipes the dust from his face. His last words: \"What did the people do?\" — \"Allah granted them victory.\" — \"Praise be to Allah; write that to Umar.\"",
      actions: [
        { type: 'camera_move', params: { x: 620, y: 480, zoom: 0.85, duration: 1.5 }, delay: 0 },
        // Nu'man's command unit pushes one step further — and falters
        { type: 'move_unit', targetUnitId: 'numan-command', params: { position: { x: 660, y: 500 }, speed: 40 }, delay: 0.5 },
        { type: 'change_formation', targetUnitId: 'numan-command', params: { formation: 'defensive_circle' }, delay: 1.5 },
        // Tulayha falls on the field — historical casualty
        { type: 'set_behavior', targetUnitId: 'tulayhah-archers', params: { behavior: 'holding' }, delay: 2 },
        // Battle continues at full intensity around the moment
        { type: 'attack_unit', targetUnitId: 'hudhayfah-right', params: { targetId: 'savaran-right' }, delay: 2.5 },
        { type: 'attack_unit', targetUnitId: 'suwayd-left', params: { targetId: 'savaran-left' }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 10 (49–60s): Envelopment & rout.
    {
      id: 'phase-10-envelopment',
      name: 'Envelopment & Rout',
      nameAr: 'الإِحَاطَةُ وَكَسْرَةُ الفُرْسِ',
      startTime: 49,
      duration: 11,
      description:
        "Hudhayfah lifts the standard and orders the death concealed until victory. The wings close the pincer; Mujashi's reserve seals the rear. The chained infantry, unable to break formation or flee, suffers catastrophically. Mardanshah falls; Bundar's wing collapses. The Sasanian centre breaks, and Firuzan turns to flee north toward Hamadan.",
      actions: [
        { type: 'camera_move', params: { x: 800, y: 480, zoom: 0.5, duration: 3 }, delay: 0 },
        // The wings close — Hudhayfah arcs in from the north, Suwayd from the south
        { type: 'move_unit', targetUnitId: 'hudhayfah-right', params: { position: { x: 880, y: 380 }, speed: 90 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'suwayd-left', params: { position: { x: 880, y: 600 }, speed: 90 }, delay: 0 },
        // Mujashi's reserve advances into the centre
        { type: 'set_behavior', targetUnitId: 'mujashi-rear', params: { behavior: 'advancing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'mujashi-rear', params: { position: { x: 540, y: 510 }, speed: 70 }, delay: 0.5 },
        // The chained infantry — tied together — is encircled and broken
        { type: 'change_formation', targetUnitId: 'chained-infantry', params: { formation: 'defensive_circle' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'numan-command', params: { targetId: 'chained-infantry' }, delay: 2.5 },
        { type: 'attack_unit', targetUnitId: 'nuaym-advance', params: { targetId: 'chained-infantry' }, delay: 2.5 },
        { type: 'attack_unit', targetUnitId: 'qaqa-vanguard', params: { targetId: 'chained-infantry' }, delay: 2.5 },
        // Mardanshah's wing collapses
        { type: 'set_behavior', targetUnitId: 'savaran-right', params: { behavior: 'retreating' }, delay: 4 },
        { type: 'change_formation', targetUnitId: 'savaran-right', params: { formation: 'scattered' }, delay: 4.5 },
        { type: 'destroy_unit', targetUnitId: 'savaran-right', params: { cause: 'commander_killed' }, delay: 6 },
        // Bundar's wing collapses
        { type: 'set_behavior', targetUnitId: 'savaran-left', params: { behavior: 'retreating' }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'savaran-left', params: { position: { x: 1100, y: 700 }, speed: 100 }, delay: 4 },
        { type: 'change_formation', targetUnitId: 'savaran-left', params: { formation: 'scattered' }, delay: 4.5 },
        // Mountain archers break and flee up the elevated rim
        { type: 'set_behavior', targetUnitId: 'mountain-archers', params: { behavior: 'retreating' }, delay: 5 },
        { type: 'move_unit', targetUnitId: 'mountain-archers', params: { position: { x: 1140, y: 200 }, speed: 110 }, delay: 5 },
        { type: 'change_formation', targetUnitId: 'mountain-archers', params: { formation: 'scattered' }, delay: 5.5 },
        // Fortress reserves break
        { type: 'set_behavior', targetUnitId: 'fortress-reserves', params: { behavior: 'retreating' }, delay: 6 },
        { type: 'move_unit', targetUnitId: 'fortress-reserves', params: { position: { x: 1240, y: 380 }, speed: 90 }, delay: 6 },
        // The chained infantry annihilated in place
        { type: 'destroy_unit', targetUnitId: 'chained-infantry', params: { cause: 'encircled_chained' }, delay: 7 },
        // Firuzan turns to flee toward Hamadan road
        { type: 'set_behavior', targetUnitId: 'firuzan-command', params: { behavior: 'retreating' }, delay: 7 },
        { type: 'move_unit', targetUnitId: 'firuzan-command', params: { position: { x: 1100, y: 280 }, speed: 130 }, delay: 7 },
        // Camera tilts north toward the pass
        { type: 'camera_move', params: { x: 1100, y: 320, zoom: 0.7, duration: 2 }, delay: 8 },
        // Caltrop engineers and stragglers cut down on the broken ground
        { type: 'destroy_unit', targetUnitId: 'caltrop-engineers', params: { cause: 'cut_down' }, delay: 8 },
      ],
      triggers: [],
    },

    // Phase 11 (60–66s): The Honey Pass — Thaniyyat al-Asal.
    {
      id: 'phase-11-honey-pass',
      name: 'Thaniyyat al-Asal',
      nameAr: 'ثَنِيَّةُ العَسَلِ',
      startTime: 60,
      duration: 6,
      description:
        "Firuzan flees up the Hamadan road and is overtaken by al-Qa'qa' ibn Amr and Nu'aym ibn Muqarrin at a narrow defile blocked by a caravan of mules and donkeys laden with honey bound for the Sasanian court. Forced to dismount, Firuzan climbs the mountain on foot. Al-Qa'qa' pursues him on foot and kills him there. The pass enters Arabic geographical memory as Thaniyyat al-Asal — the Pass of Honey.",
      actions: [
        { type: 'camera_move', params: { x: 1170, y: 240, zoom: 0.85, duration: 2 }, delay: 0 },
        // Qa'qa's vanguard and Nu'aym's advance pursue along the road
        { type: 'set_behavior', targetUnitId: 'qaqa-vanguard', params: { behavior: 'pursuing' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'qaqa-vanguard', params: { position: { x: 1140, y: 280 }, speed: 150 }, delay: 0 },
        { type: 'set_behavior', targetUnitId: 'nuaym-advance', params: { behavior: 'pursuing' }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'nuaym-advance', params: { position: { x: 1080, y: 320 }, speed: 110 }, delay: 0.5 },
        // Firuzan dismounted into the gorge
        { type: 'change_formation', targetUnitId: 'firuzan-command', params: { formation: 'scattered' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'firuzan-command', params: { position: { x: 1170, y: 200 }, speed: 60 }, delay: 2 },
        // Catch up
        { type: 'attack_unit', targetUnitId: 'qaqa-vanguard', params: { targetId: 'firuzan-command' }, delay: 3 },
        // Tighten on the kill
        { type: 'camera_move', params: { x: 1170, y: 200, zoom: 0.95, duration: 1.5 }, delay: 3.5 },
        { type: 'destroy_unit', targetUnitId: 'firuzan-command', params: { cause: 'killed_in_pass' }, delay: 4.5 },
        // Mountain archers, fortress reserves, savaran-left finish breaking
        { type: 'destroy_unit', targetUnitId: 'mountain-archers', params: { cause: 'broken_in_rocks' }, delay: 4.5 },
        { type: 'destroy_unit', targetUnitId: 'savaran-left', params: { cause: 'commander_killed' }, delay: 5 },
      ],
      triggers: [],
    },

    // Phase 12 (66–72s): Fath al-Futuh. News reaches Medina; Umar weeps.
    // Final pull-back across the broken plateau.
    {
      id: 'phase-12-fath-al-futuh',
      name: 'Fath al-Futuh',
      nameAr: 'فَتْحُ الفُتُوحِ',
      startTime: 66,
      duration: 6,
      description:
        "News reaches Medina. Umar receives the bisharah — and weeps. Of the unnamed martyrs he says: \"Did it harm them that the Commander of the Faithful did not know them? Allah knows them.\" The Companions name the day Fath al-Futuh — the Conquest of Conquests. No Sasanian field army assembles after it.",
      actions: [
        // Final pull-back across the broken plateau
        { type: 'camera_move', params: { x: 700, y: 480, zoom: 0.4, duration: 4 }, delay: 0 },
        // Fortress reserves finish their flight
        { type: 'destroy_unit', targetUnitId: 'fortress-reserves', params: { cause: 'scattered' }, delay: 1 },
      ],
      triggers: [],
    },
  ],

  // ─── Narration ─────────────────────────────────────────────────────────────
  // Each narration anchor maps to a phase. Wording is drawn directly from the
  // verified Sunni-canonical knowledge base — Tabari, Ibn Kathir, Ibn al-Athir.
  // Where source-tradition wording is preserved, it is given verbatim; otherwise
  // the language is editorial and historically rooted.
  narration: [
    {
      id: 'narr-01-opening',
      time: 0,
      duration: 5.5,
      text: '21 AH. Yazdegird III musters a final coalition from Hamadan, Rayy, Isfahan, Adharbayjan and Nahavand — the last tremor of an empire that once spanned both Easts.',
      textAr:
        'فِي سَنَةِ إِحْدَى وَعِشْرِينَ مِنَ الهِجْرَةِ، اجْتَمَعَتْ جُمُوعُ الفُرْسِ مِنَ الجِبَالِ وَهَمَذَانَ وَالرَّيِّ وَأَصْبَهَانَ وَأَذْرَبِيجَانَ وَنَهَاوَنْدَ — رَجْفَةً أَخِيرَةً لِمُلْكٍ كَانَ يَطْوِي المَشْرِقَيْنِ.',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-02-umar-shura',
      time: 6,
      duration: 5,
      text: "Umar refuses to march in person — Ali tells him he is the pole of the Arabs. He writes to Kufa naming An-Nu'man ibn Muqarrin commander, with Hudhayfah ibn al-Yaman as written successor.",
      textAr:
        'أَبَى عُمَرُ بنُ الخَطَّابِ أَنْ يَخْرُجَ بِنَفْسِهِ، وَأَشَارَ عَلَيْهِ عَلِيٌّ أَنْ يَلْزَمَ المَدِينَةَ فَإِنَّهُ قُطْبُ العَرَبِ، فَكَتَبَ إِلَى أَهْلِ الكُوفَةِ بِإِمْرَةِ النُّعْمَانِ بْنِ مُقَرِّنٍ المُزَنِيِّ، وَنَصَّ عَلَى أَنَّهُ إِنْ أُصِيبَ النُّعْمَانُ فَالأَمِيرُ حُذَيْفَةُ بنُ اليَمَانِ، ثُمَّ مَنْ بَعْدَهُ.',
      style: 'normal',
      position: 'top',
    },
    {
      id: 'narr-03-arrive',
      time: 11,
      duration: 5,
      text: 'When the ~30,000 Muslims arrive at Nahavand, they find the Persians dug in behind iron caltrops, with the front rank chained against flight.',
      textAr:
        'وَلَمَّا وَافَى المُسْلِمُونَ نَهَاوَنْدَ — قَرَابَةَ ثَلَاثِينَ أَلْفاً — أَلْفَوُا الفُرْسَ مُتَحَصِّنِينَ فِي خَنَادِقِهِمْ، قَدْ نَثَرُوا حَسَكَ الحَدِيدِ فِي المَدَاخِلِ، وَتَوَاصَوْا بِالسَّلَاسِلِ أَلَّا يَفِرَّ مِنْهُمْ أَحَدٌ.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-04-embassy',
      time: 16,
      duration: 6,
      text: "Nu'man sends al-Mughirah ibn Shu'bah as envoy to Bundar. Met with disdain, Mughirah replies: \"By Allah you missed nothing of our description — until Allah sent us His Messenger ﷺ, who promised us victory in this world and Paradise in the next.\"",
      textAr:
        'أَرْسَلَ النُّعْمَانُ المُغِيرَةَ بْنَ شُعْبَةَ سَفِيراً إِلَى بُنْدَارَ، فَاسْتَقْبَلَهُ الفَارِسِيُّ بِالاسْتِحْقَارِ، فَأَجَابَهُ المُغِيرَةُ: «وَاللَّهِ مَا أَخْطَأْتَ مِنْ صِفَتِنَا شَيْئاً، حَتَّى بَعَثَ اللَّهُ إِلَيْنَا رَسُولَهُ ﷺ، فَوَعَدَنَا النَّصْرَ فِي الدُّنْيَا، وَالجَنَّةَ فِي الآخِرَةِ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-05-council',
      time: 22,
      duration: 5.5,
      text: "Two days of stalemate. Tulayha al-Asadi proposes the kar-after-farr — a feigned retreat to lure the Persians off their entrenched ground.",
      textAr:
        'وَطَالَ المُقَامُ يَوْمَيْنِ لَا يَخْرُجُ الفُرْسُ مِنْ حُصُونِهِمْ، فَجَمَعَ النُّعْمَانُ مَجْلِسَ الحَرْبِ، فَأَشَارَ طُلَيْحَةُ الأَسَدِيُّ بِالكَرِّ بَعْدَ الفَرِّ — أَنْ يُغْرَى الفُرْسُ بِخَدِيعَةِ الانْسِحَابِ حَتَّى يُسْتَخْرَجُوا مِنْ خَنَادِقِهِمْ.',
      style: 'normal',
      position: 'top',
    },
    {
      id: 'narr-06-dua',
      time: 28,
      duration: 6,
      text: 'Friday after zawal. Nu\'man raises his hands: "O Allah, glorify Your religion, give victory to Your servants, and make Nu\'man the first martyr today on a victory You grant the Muslims." The army says Amin and weeps.',
      textAr:
        'وَلَمَّا زَالَتِ الشَّمْسُ يَوْمَ الجُمُعَةِ، وَهَبَّتِ الرِّيحُ، رَفَعَ النُّعْمَانُ يَدَيْهِ فَقَالَ: «اللَّهُمَّ أَعْزِزْ دِينَكَ، وَانْصُرْ عِبَادَكَ، وَاجْعَلِ النُّعْمَانَ أَوَّلَ شَهِيدٍ اليَوْمَ عَلَى فَتْحٍ يَفْتَحُهُ اللَّهُ لِلْمُسْلِمِينَ فِيهِ عَلَيْهِمْ»، فَقَالَ النَّاسُ: آمِينَ، وَبَكَوْا.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-07-takbirs',
      time: 34,
      duration: 5,
      text: 'Three takbirs: at the first, ready; at the second, arm; at the third, charge. Al-Qa\'qa\' executes the lure — withdrawing again and again until the Persians break their trench.',
      textAr:
        'ثُمَّ قَالَ: «إِنِّي مُكَبِّرٌ ثَلَاثاً؛ فَإِذَا كَبَّرْتُ الأُولَى فَلْيَتَأَهَّبِ النَّاسُ، وَإِذَا كَبَّرْتُ الثَّانِيَةَ فَلْيَتَسَلَّحُوا، فَإِذَا كَبَّرْتُ الثَّالِثَةَ فَاحْمِلُوا جَمِيعاً». فَنَفَّذَ القَعْقَاعُ بنُ عَمْرٍو الكَرَّ بَعْدَ الفَرِّ، يَنْكِصُ بِجُنْدِهِ ثُمَّ يَنْكِصُ، حَتَّى انْكَشَفَ الفُرْسُ مِنْ خَنَادِقِهِمْ.',
      style: 'dramatic',
      position: 'top',
    },
    {
      id: 'narr-08-charge',
      time: 39,
      duration: 5,
      text: "At the third takbir the army surges. The Savaran charge breaks on the disciplined spear-wall of the Muhajirun; Hudhayfah's right and Suwayd's left begin to wrap.",
      textAr:
        'كَبَّرَ النُّعْمَانُ الثَّالِثَةَ، فَحَمَلَ الجَيْشُ كَالسَّيْلِ — مَيْمَنَةُ حُذَيْفَةَ، وَمَيْسَرَةُ سُوَيْدٍ، وَفُرْسَانُ المُغِيرَةِ — وَاصْطَدَمَ السَّاوَرَانُ بِجِدَارِ الرِّمَاحِ فَتَكَسَّرَتْ صَدْمَتُهُمْ عَلَى صَبْرِ المُهَاجِرِينَ.',
      style: 'dramatic',
      position: 'bottom',
    },
    {
      id: 'narr-09-numan-falls',
      time: 44,
      duration: 5,
      text: "At the height of the press Nu'man's horse slips in blood and he falls — martyred, as he had prayed. His brother covers him with a cloak; the standard passes to Hudhayfah before it touches the ground.",
      textAr:
        'وَفِي ذُرْوَةِ الزَّحْفِ زَلَّتْ فَرَسُ النُّعْمَانِ فِي الدِّمَاءِ، فَخَرَّ شَهِيداً كَمَا سَأَلَ. سَتَرَهُ أَخُوهُ — نُعَيْمٌ، وَقِيلَ سُوَيْدٌ — بِثَوْبِهِ، وَأَخْفَى مَوْتَهُ لِئَلَّا يَنْهَزِمَ النَّاسُ، وَدَفَعَ الرَّايَةَ إِلَى حُذَيْفَةَ بْنِ اليَمَانِ قَبْلَ أَنْ تَمَسَّ الأَرْضَ.',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-10-dying-words',
      time: 49,
      duration: 4.5,
      text: 'Ma\'qil ibn Yasar wipes the dust from his face. Nu\'man asks only: "What did the people do?" — "Allah granted them victory." — "Praise be to Allah; write that to Umar." And his soul departs.',
      textAr:
        'وَجَاءَهُ مَعْقِلُ بنُ يَسَارٍ يَمْسَحُ التُّرَابَ عَنْ وَجْهِهِ، فَلَمْ يَسْأَلْ إِلَّا: «مَا فَعَلَ النَّاسُ؟» قِيلَ: فَتَحَ اللَّهُ عَلَيْهِمْ. قَالَ: «الحَمْدُ لِلَّهِ، اكْتُبُوا بِذَلِكَ إِلَى عُمَرَ»، ثُمَّ فَاضَتْ نَفْسُهُ.',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-11-rout',
      time: 54,
      duration: 5,
      text: "Hudhayfah takes the standard per Umar's letter and conceals the death until the matter is sealed. The Persians break beyond recovery; the chained infantry is torn apart in place.",
      textAr:
        'وَأَخَذَ حُذَيْفَةُ الرَّايَةَ بِنَصِّ كِتَابِ عُمَرَ، فَأَقَامَ نُعَيْماً مَكَانَ أَخِيهِ، وَأَمَرَ بِكَتْمِ مَوْتِ الأَمِيرِ حَتَّى يُحْسَمَ الأَمْرُ. وَانْكَسَرَ الفُرْسُ كَسْرَةً لَا قِيَامَ بَعْدَهَا، وَتَمَزَّقَتِ الرَّجَّالَةُ المُتَسَلْسِلَةُ فِي مَوَاضِعِهَا.',
      style: 'normal',
      position: 'bottom',
    },
    {
      id: 'narr-12-honey-pass',
      time: 60,
      duration: 6,
      text: "Firuzan flees up the Hamadan road. Al-Qa'qa' and Nu'aym overtake him at a narrow defile blocked by mules and donkeys laden with honey. He dismounts to climb the mountain on foot; al-Qa'qa' pursues on foot and kills him there. The pass is named Thaniyyat al-Asal — the Pass of Honey.",
      textAr:
        'وَفَرَّ الفَيْرُزَانُ صَاعِداً فِي طَرِيقِ هَمَذَانَ، فَأَدْرَكَهُ القَعْقَاعُ بنُ عَمْرٍو وَنُعَيْمُ بنُ مُقَرِّنٍ فِي ثَنِيَّةٍ ضَيِّقَةٍ قَدْ سَدَّتْهَا قَافِلَةُ بِغَالٍ وَحَمِيرٍ مُحَمَّلَةٌ عَسَلاً. فَنَزَلَ عَنْ دَابَّتِهِ يَتَسَلَّقُ الجَبَلَ، فَتَبِعَهُ القَعْقَاعُ رَاجِلاً حَتَّى قَتَلَهُ. وَسُمِّيَتْ تِلْكَ الثَّنِيَّةُ ثَنِيَّةَ العَسَلِ.',
      style: 'dramatic',
      position: 'center',
    },
    {
      id: 'narr-13-umar-grief',
      time: 66,
      duration: 4.5,
      text: 'When the news reached Medina, Umar wept and put his hand on his head. Of the unnamed martyrs he said: "Did it harm them that the Commander of the Faithful did not know them? Allah knows them."',
      textAr:
        'وَلَمَّا بَلَغَتِ البِشَارَةُ المَدِينَةَ، بَكَى عُمَرُ، وَوَضَعَ يَدَهُ عَلَى رَأْسِهِ، وَقَالَ فِيمَنْ لَمْ يُسَمَّ مِنَ الشُّهَدَاءِ: «وَمَا ضَرَّهُمْ أَلَّا يَعْرِفَهُمْ أَمِيرُ المُؤْمِنِينَ؟ لَكِنَّ اللَّهَ يَعْرِفُهُمْ».',
      style: 'quote',
      position: 'center',
    },
    {
      id: 'narr-14-fath-al-futuh',
      time: 70,
      duration: 2.5,
      text: "And Nahavand was Fath al-Futuh — the spine of the Sasanian kingdom broken forever, the Persian plateau opening city by city, until no army assembled for Yazdegird again.",
      textAr:
        'وَكَانَتْ وَقْعَةُ نَهَاوَنْدَ فَتْحَ الفُتُوحِ — انْكَسَرَتْ بِهَا شَوْكَةُ كِسْرَى إِلَى الأَبَدِ، وَانْفَتَحَتْ هَضْبَةُ فَارِسَ مَدِينَةً مَدِينَةً، حَتَّى لَمْ يَقُمْ لِيَزْدَجِرْدَ بَعْدَهَا جَيْشٌ.',
      style: 'dramatic',
      position: 'center',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  // Modest zooms throughout — the CameraDirector tightens autonomously on
  // engagement events. Authored values stay loose so whole formations are
  // readable on screen, with two deliberately tighter beats: Nu'man's fall
  // and the kill in the Honey Pass.
  cameraScript: [
    // Wide aerial of the highlands at dawn
    { time: 0, position: { x: 750, y: 480 }, zoom: 0.45, duration: 4, easing: 'power2.inOut', type: 'overview' },
    // Drift northeast to reveal the Persian fortified line and the caltrop belt
    { time: 5, position: { x: 950, y: 380 }, zoom: 0.6, duration: 4, easing: 'power2.inOut', type: 'pan' },
    // Cross to the Muslim approach as Umar's letter is named
    { time: 10, position: { x: 320, y: 520 }, zoom: 0.65, duration: 4, easing: 'power2.out', type: 'pan' },
    // Pull back for the embassy crossing no-man's-land
    { time: 16, position: { x: 700, y: 500 }, zoom: 0.55, duration: 5, easing: 'power2.inOut', type: 'overview' },
    // Tighten on the council and Tulayha's diagram
    { time: 22, position: { x: 360, y: 520 }, zoom: 0.7, duration: 4, easing: 'power2.inOut', type: 'focus' },
    // Hold tight on Nu'man for the dua and the takbirs
    { time: 28, position: { x: 540, y: 470 }, zoom: 0.75, duration: 5, easing: 'power2.out', type: 'focus' },
    // Track the lure cycles
    { time: 34, position: { x: 620, y: 470 }, zoom: 0.78, duration: 4, easing: 'power2.inOut', type: 'follow', followEntityId: 'qaqa-vanguard' },
    // Pull back for the third-takbir collision
    { time: 39, position: { x: 700, y: 490 }, zoom: 0.55, duration: 4, easing: 'power2.inOut', type: 'overview' },
    // Tight on Nu'man's fall — historical climax, intimate without melodrama
    { time: 44, position: { x: 660, y: 500 }, zoom: 0.85, duration: 2, easing: 'power3.out', type: 'focus' },
    // Pull back as Hudhayfah lifts the standard and the wings close
    { time: 49, position: { x: 800, y: 480 }, zoom: 0.5, duration: 4, easing: 'power2.inOut', type: 'overview' },
    // Pursuit cam — chase Firuzan up the Hamadan road
    { time: 56, position: { x: 1100, y: 320 }, zoom: 0.7, duration: 4, easing: 'power2.out', type: 'follow', followEntityId: 'firuzan-command' },
    // The Honey Pass — closest zoom of the scenario
    { time: 62, position: { x: 1170, y: 230 }, zoom: 0.95, duration: 2.5, easing: 'power3.out', type: 'focus' },
    // Hold over the broken plateau as news travels to Medina
    { time: 66, position: { x: 800, y: 460 }, zoom: 0.55, duration: 3, easing: 'power2.inOut', type: 'pan' },
    // Final pull-out — Fath al-Futuh
    { time: 70, position: { x: 700, y: 480 }, zoom: 0.4, duration: 2, easing: 'power2.out', type: 'overview' },
  ],

  // ─── Outcome ───────────────────────────────────────────────────────────────
  outcome: {
    verdict: 'muslim_victory',
    // Muslim casualties — classical chronicles do not preserve a precise
    // figure; we use a defensible mid-range number consistent with Tabari's
    // emphasis on heavy losses without naming a count.
    muslimCasualties: 4000,
    // Persian casualties — chronicle tradition (Tabari, Ibn al-Athir, Ibn
    // Kathir) reports up to 100,000, a figure modern historians treat as
    // a literary topos for the scale of the rout. We surface the chronicle
    // figure here and hedge in the summary text.
    enemyCasualties: 60000,
    summary:
      "Decisive Muslim victory — Fath al-Futuh, the Conquest of Conquests. The Sasanian field-army capacity was broken forever. Commander An-Nu'man ibn Muqarrin al-Muzani fell at the moment of breakthrough, exactly as he had prayed; Hudhayfah ibn al-Yaman took the standard per Umar's written succession and concealed the death until victory was sealed. The Persian commander Firuzan was overtaken at a defile blocked by a honey-laden caravan and killed climbing the mountain on foot — the pass entered Arabic memory as Thaniyyat al-Asal. Tulayha al-Asadi (whose counsel turned the campaign) and Amr ibn Ma'dikarib were among the named martyrs. Yazdegird III never assembled another regular army; Hamadan, Rayy, Isfahan, Adharbayjan, Fars, Kirman and Khorasan fell province by province in the decade that followed.",
    summaryAr:
      'انْكَسَرَ الجَيْشُ السَّاسَانِيُّ الإِمْبَرَاطُورِيُّ كَسْرَةً نِهَائِيَّةً عَلَى أَسْوَارِ نَهَاوَنْدَ. اسْتُشْهِدَ النُّعْمَانُ بنُ مُقَرِّنٍ المُزَنِيُّ كَمَا دَعَا، وَتَوَلَّى حُذَيْفَةُ بنُ اليَمَانِ الرَّايَةَ بِنَصِّ كِتَابِ عُمَرَ، وَأَخْفَى مَوْتَ الأَمِيرِ حَتَّى انْكَشَفَ الأَمْرُ. قُتِلَ الفَيْرُزَانُ فِي ثَنِيَّةِ العَسَلِ بَعْدَ أَنْ أُدْرِكَ رَاجِلاً صَاعِداً فِي الجَبَلِ. وَاسْتُشْهِدَ يَوْمَئِذٍ طُلَيْحَةُ الأَسَدِيُّ صَاحِبُ مَشُورَةِ الكَرِّ بَعْدَ الفَرِّ، وَعَمْرُو بنُ مَعْدِيكَرِبَ الزُّبَيْدِيُّ. ذَكَرَتِ المَصَادِرُ مَقْتَلَةً عَظِيمَةً فِي الفُرْسِ تَبْلُغُ نَحْوَ مِئَةِ أَلْفٍ — رَقَمٌ يَرَاهُ المُحَقِّقُونَ المُحْدَثُونَ مُبَالَغَةً تَدُلُّ عَلَى حَجْمِ الكَارِثَةِ لَا عَلَى عَدَدِهَا الدَّقِيقِ.',
    significance:
      "The Companions named the day Fath al-Futuh — the Conquest of Conquests — because no Sasanian field army assembled after it. Yazdegird III fled east through Istakhr, Kirman, Sijistan and Khorasan until killed at Marv in 31 AH. Hamadan, Rayy, Isfahan, Adharbayjan, Fars, Kirman and Khorasan fell province by province in the decade that followed. Umar's pre-arranged written succession at Nahavand entered Islamic command doctrine; Tulayha al-Asadi's kar-after-farr stratagem entered Arabic military teaching; Thaniyyat al-Asal entered Arabic geography. Nahavand was the hinge on which the Muslim east turned from a campaign into a settled state owning the entire Iranian plateau.",
    significanceAr:
      'سَمَّاهَا الصَّحَابَةُ فَتْحَ الفُتُوحِ، لِأَنَّهَا قَصَمَتْ ظَهْرَ المُلْكِ السَّاسَانِيِّ نِهَائِيًّا. لَمْ يُجَمِّعْ يَزْدَجِرْدُ الثَّالِثُ بَعْدَهَا جَيْشاً نِظَامِيًّا، وَفَرَّ شَرْقاً مِنْ إِصْطَخْرَ إِلَى كِرْمَانَ ثُمَّ سِجِسْتَانَ ثُمَّ خُرَاسَانَ، حَتَّى قُتِلَ بِمَرْوَ سَنَةَ إِحْدَى وَثَلَاثِينَ. وَفُتِحَتْ هَمَذَانُ وَالرَّيُّ وَأَصْبَهَانُ وَأَذْرَبِيجَانُ وَفَارِسُ وَكِرْمَانُ وَخُرَاسَانُ تَبَعاً، إِقْلِيماً إِقْلِيماً، عَلَى مَدَى عَقْدٍ. كَانَتْ نَهَاوَنْدُ المِفْصَلَ الَّذِي تَحَوَّلَ بِهِ المَشْرِقُ الإِسْلَامِيُّ مِنْ غَزْوَةِ تَمَدُّدٍ إِلَى دَوْلَةٍ مُسْتَقِرَّةٍ تَمْلِكُ الهَضْبَةَ الفَارِسِيَّةَ كَامِلَةً. وَدَخَلَتْ سَلْسِلَةُ عُمَرَ المَكْتُوبَةُ فِي الإِمْرَةِ مَذْهَباً قِيَادِيّاً، وَدَخَلَتْ خَدِيعَةُ طُلَيْحَةَ مَذْهَباً عَسْكَرِيّاً، وَدَخَلَتْ ثَنِيَّةُ العَسَلِ ذَاكِرَةَ الجُغْرَافِيَا العَرَبِيَّةِ.',
  },

  totalDuration: 72,
};
