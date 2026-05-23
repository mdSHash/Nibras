import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Mu'tah - Jumada al-Ula 8 AH (September 629 CE)
 *
 * The first major Muslim military expedition against the Byzantine Empire.
 * Fought near the village of Mu'tah in modern-day Jordan.
 * Three successive Muslim commanders were martyred before Khalid ibn al-Walid
 * took command and executed a brilliant tactical withdrawal, saving the army.
 */
export const battleOfMutah: BattleScenario = {
  id: 'battle-of-mutah',
  name: "Battle of Mu'tah",
  nameAr: 'معركة مؤتة',
  date: 'Jumada al-Ula 8 AH (September 629 CE)',
  location: "Village of Mu'tah, modern-day Jordan",
  description:
    "The first major Muslim military expedition against the Byzantine Empire. The Prophet ﷺ sent 3,000 fighters against a Byzantine-allied force of over 100,000. Three successive commanders were martyred before Khalid ibn al-Walid took command and executed a brilliant tactical withdrawal.",
  descriptionAr:
    'أول مواجهة عسكرية كبرى بين المسلمين والإمبراطورية البيزنطية. أرسل النبي ﷺ ثلاثة آلاف مقاتل في مواجهة جيش من الروم وحلفائهم يفوق مئة ألف. استُشهد ثلاثة قادة متتالين قبل أن يتولى خالد بن الوليد القيادة وينفذ انسحاباً تكتيكياً بارعاً أنقذ الجيش.',

  map: {
    width: 1200,
    height: 900,
    terrain: [
      // Main battlefield — hilly terrain
      {
        id: 'main-field',
        type: 'rocky',
        polygon: [
          { x: 0, y: 0 },
          { x: 1200, y: 0 },
          { x: 1200, y: 900 },
          { x: 0, y: 900 },
        ],
        color: 0x5c4a3a,
      },
      // Hills on the north side
      {
        id: 'northern-hills',
        type: 'elevated',
        polygon: [
          { x: 0, y: 0 },
          { x: 1200, y: 0 },
          { x: 1200, y: 200 },
          { x: 0, y: 200 },
        ],
        color: 0x6b5a4a,
      },
      // Village of Mu'tah area (center-right)
      {
        id: 'mutah-village',
        type: 'flat',
        polygon: [
          { x: 700, y: 350 },
          { x: 950, y: 350 },
          { x: 950, y: 550 },
          { x: 700, y: 550 },
        ],
        color: 0x8b7355,
      },
      // Valley/Wadi running through the field
      {
        id: 'wadi',
        type: 'sand',
        polygon: [
          { x: 400, y: 400 },
          { x: 500, y: 400 },
          { x: 500, y: 900 },
          { x: 400, y: 900 },
        ],
        color: 0x3d2b1f,
      },
      // Byzantine camp area (right/east side)
      {
        id: 'byzantine-camp-area',
        type: 'flat',
        polygon: [
          { x: 900, y: 100 },
          { x: 1200, y: 100 },
          { x: 1200, y: 400 },
          { x: 900, y: 400 },
        ],
        color: 0x4a3728,
      },
      // Muslim camp area (left/west side)
      {
        id: 'muslim-camp-area',
        type: 'sand',
        polygon: [
          { x: 0, y: 600 },
          { x: 250, y: 600 },
          { x: 250, y: 900 },
          { x: 0, y: 900 },
        ],
        color: 0x5c4033,
      },
    ],
    landmarks: [
      {
        id: 'mutah-village-marker',
        position: { x: 825, y: 450 },
        type: 'marker',
        label: "Village of Mu'tah",
        labelAr: 'قرية مؤتة',
      },
      {
        id: 'hills-marker',
        position: { x: 600, y: 100 },
        type: 'hill',
        label: 'Hills',
        labelAr: 'التلال',
      },
      {
        id: 'byzantine-camp',
        position: { x: 1050, y: 250 },
        type: 'camp',
        label: 'Byzantine Camp',
        labelAr: 'معسكر الروم',
      },
      {
        id: 'muslim-camp',
        position: { x: 125, y: 750 },
        type: 'camp',
        label: 'Muslim Camp',
        labelAr: 'معسكر المسلمين',
      },
      {
        id: 'wadi-marker',
        position: { x: 450, y: 650 },
        type: 'marker',
        label: 'Valley',
        labelAr: 'الوادي',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  forces: [
    // ─── MUSLIM FORCES (~3000 soldiers) ─────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'المسلمون',
      totalStrength: 3000,
      units: [
        {
          id: 'muslim-infantry',
          name: 'Main Infantry',
          nameAr: 'المشاة',
          troopType: 'infantry',
          soldierCount: 1200,
          commander: 'Zayd ibn Harithah',
          startPosition: { x: 200, y: 650 },
          startFormation: 'line',
          startFacing: -Math.PI / 4, // facing northeast
          stats: { attack: 7, defense: 7, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-right-wing',
          name: 'Right Wing',
          nameAr: 'الميمنة',
          troopType: 'infantry',
          soldierCount: 600,
          commander: "Qutbah ibn Qatadah",
          startPosition: { x: 300, y: 550 },
          startFormation: 'line',
          startFacing: -Math.PI / 4,
          stats: { attack: 7, defense: 6, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-left-wing',
          name: 'Left Wing',
          nameAr: 'الميسرة',
          troopType: 'infantry',
          soldierCount: 600,
          commander: undefined,
          startPosition: { x: 150, y: 750 },
          startFormation: 'line',
          startFacing: -Math.PI / 4,
          stats: { attack: 7, defense: 6, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-cavalry',
          name: 'Cavalry',
          nameAr: 'الفرسان',
          troopType: 'cavalry',
          soldierCount: 400,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 250, y: 600 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 4,
          stats: { attack: 9, defense: 6, speed: 9, morale: 10 },
        },
        {
          id: 'muslim-rear-guard',
          name: 'Rear Guard',
          nameAr: 'الساقة',
          troopType: 'reserves',
          soldierCount: 200,
          commander: undefined,
          startPosition: { x: 100, y: 800 },
          startFormation: 'line',
          startFacing: -Math.PI / 4,
          stats: { attack: 6, defense: 7, speed: 5, morale: 8 },
        },
      ],
    },
    // ─── BYZANTINE & ALLIED FORCES (~100,000-200,000 soldiers) ──────────────────
    {
      faction: 'quraysh',
      label: 'Byzantine & Allied Forces',
      labelAr: 'الروم وحلفاؤهم',
      totalStrength: 100000,
      units: [
        {
          id: 'byzantine-infantry',
          name: 'Byzantine Infantry',
          nameAr: 'مشاة الروم',
          troopType: 'infantry',
          soldierCount: 30000,
          commander: 'Theodore',
          startPosition: { x: 850, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI + Math.PI / 4, // facing southwest
          stats: { attack: 7, defense: 8, speed: 4, morale: 7 },
        },
        {
          id: 'byzantine-cavalry',
          name: 'Byzantine Cavalry',
          nameAr: 'فرسان الروم',
          troopType: 'cavalry',
          soldierCount: 15000,
          commander: undefined,
          startPosition: { x: 1000, y: 300 },
          startFormation: 'wedge',
          startFacing: Math.PI + Math.PI / 4,
          stats: { attack: 8, defense: 7, speed: 8, morale: 7 },
        },
        {
          id: 'ghassanid-allies',
          name: 'Ghassanid Arab Allies',
          nameAr: 'غساسنة',
          troopType: 'infantry',
          soldierCount: 20000,
          commander: 'Shurahbil ibn Amr',
          startPosition: { x: 750, y: 250 },
          startFormation: 'line',
          startFacing: Math.PI + Math.PI / 4,
          stats: { attack: 6, defense: 6, speed: 6, morale: 6 },
        },
        {
          id: 'byzantine-right-flank',
          name: 'Right Flank',
          nameAr: 'الجناح الأيمن',
          troopType: 'infantry',
          soldierCount: 15000,
          commander: undefined,
          startPosition: { x: 1050, y: 450 },
          startFormation: 'line',
          startFacing: Math.PI + Math.PI / 4,
          stats: { attack: 6, defense: 7, speed: 5, morale: 6 },
        },
        {
          id: 'byzantine-left-flank',
          name: 'Left Flank',
          nameAr: 'الجناح الأيسر',
          troopType: 'infantry',
          soldierCount: 15000,
          commander: undefined,
          startPosition: { x: 650, y: 300 },
          startFormation: 'line',
          startFacing: Math.PI + Math.PI / 4,
          stats: { attack: 6, defense: 7, speed: 5, morale: 6 },
        },
        {
          id: 'byzantine-reserve',
          name: 'Reserve',
          nameAr: 'الاحتياط',
          troopType: 'reserves',
          soldierCount: 5000,
          commander: undefined,
          startPosition: { x: 1100, y: 200 },
          startFormation: 'column',
          startFacing: Math.PI + Math.PI / 4,
          stats: { attack: 5, defense: 6, speed: 5, morale: 6 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total 55 seconds of simulation time) ──────────────────────
  phases: [
    // Phase 1: The Advance (0-10s)
    {
      id: 'advance',
      name: 'The Advance',
      nameAr: 'التقدم',
      startTime: 0,
      duration: 10,
      description:
        'The Muslim army advances from their camp toward the village of Mu\'tah. The Byzantines form their massive defensive lines.',
      actions: [
        // Camera overview
        {
          type: 'camera_move',
          params: { x: 600, y: 450, zoom: 0.4, duration: 3 },
          delay: 0,
        },
        // Muslim forces advance northeast
        {
          type: 'move_unit',
          targetUnitId: 'muslim-infantry',
          params: { position: { x: 400, y: 500 }, speed: 60 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 480, y: 420 }, speed: 60 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 350, y: 580 }, speed: 60 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry',
          params: { position: { x: 420, y: 460 }, speed: 70 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 280, y: 650 }, speed: 50 },
          delay: 2,
        },
        // Byzantines form up
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-infantry',
          params: { behavior: 'holding' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-infantry',
          params: { position: { x: 750, y: 400 }, speed: 40 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-left-flank',
          params: { position: { x: 600, y: 380 }, speed: 40 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-right-flank',
          params: { position: { x: 900, y: 450 }, speed: 40 },
          delay: 3,
        },
      ],
      triggers: [],
    },

    // Phase 2: Zayd's Command (10-22s)
    {
      id: 'zayd-command',
      name: "Zayd's Command",
      nameAr: 'قيادة زيد',
      startTime: 10,
      duration: 12,
      description:
        'Zayd ibn Harithah leads the charge with the banner of the Prophet ﷺ. Fierce fighting ensues as the Muslim vanguard crashes into the Byzantine lines. Zayd is martyred.',
      actions: [
        // Camera focuses on the engagement
        {
          type: 'camera_move',
          params: { x: 550, y: 450, zoom: 0.6, duration: 2 },
          delay: 0,
        },
        // Muslim main force charges
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-infantry',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-infantry',
          params: { position: { x: 550, y: 420 }, speed: 80 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 600, y: 370 }, speed: 75 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 480, y: 480 }, speed: 75 },
          delay: 1,
        },
        // Engagement begins
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-infantry',
          params: { targetId: 'byzantine-infantry' },
          delay: 3,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-right-wing',
          params: { targetId: 'ghassanid-allies' },
          delay: 4,
        },
        // Byzantine counter-pressure
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-cavalry',
          params: { position: { x: 700, y: 380 }, speed: 70 },
          delay: 5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'byzantine-cavalry',
          params: { targetId: 'muslim-cavalry' },
          delay: 7,
        },
        // Zayd falls — Muslim infantry briefly falters
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-infantry',
          params: { behavior: 'regrouping' },
          delay: 10,
        },
      ],
      triggers: [],
    },

    // Phase 3: Ja'far's Command (22-34s)
    {
      id: 'jafar-command',
      name: "Ja'far's Command",
      nameAr: 'قيادة جعفر',
      startTime: 22,
      duration: 12,
      description:
        "Ja'far ibn Abi Talib takes the banner. He dismounts his horse and fights on foot, pushing deeper into enemy lines. He is martyred after losing both arms holding the banner.",
      actions: [
        // Camera follows the push
        {
          type: 'camera_move',
          params: { x: 600, y: 400, zoom: 0.7, duration: 2 },
          delay: 0,
        },
        // Renewed Muslim advance under Ja'far
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-infantry',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-infantry',
          params: { position: { x: 620, y: 390 }, speed: 70 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 650, y: 340 }, speed: 70 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 550, y: 440 }, speed: 70 },
          delay: 1.5,
        },
        // Cavalry supports the push
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry',
          params: { position: { x: 580, y: 380 }, speed: 85 },
          delay: 2,
        },
        // Continued engagement
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-infantry',
          params: { targetId: 'byzantine-infantry' },
          delay: 3,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-cavalry',
          params: { targetId: 'byzantine-cavalry' },
          delay: 4,
        },
        // Byzantine flanks close in
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-left-flank',
          params: { position: { x: 520, y: 380 }, speed: 50 },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-right-flank',
          params: { position: { x: 750, y: 430 }, speed: 50 },
          delay: 5,
        },
        // Ja'far falls — another moment of crisis
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-infantry',
          params: { behavior: 'regrouping' },
          delay: 10,
        },
      ],
      triggers: [],
    },

    // Phase 4: Abdullah's Command (34-43s)
    {
      id: 'abdullah-command',
      name: "Abdullah's Command",
      nameAr: 'قيادة عبدالله',
      startTime: 34,
      duration: 9,
      description:
        'Abdullah ibn Rawahah takes the banner. He hesitates briefly, then recites poetry to steel himself and charges forward. He is martyred pushing into the enemy ranks.',
      actions: [
        // Camera on the final push
        {
          type: 'camera_move',
          params: { x: 620, y: 400, zoom: 0.7, duration: 2 },
          delay: 0,
        },
        // Abdullah rallies and pushes forward
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-infantry',
          params: { behavior: 'advancing' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-infantry',
          params: { position: { x: 670, y: 370 }, speed: 65 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 700, y: 330 }, speed: 65 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 600, y: 420 }, speed: 65 },
          delay: 1.5,
        },
        // Fierce engagement
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-infantry',
          params: { targetId: 'byzantine-infantry' },
          delay: 3,
        },
        // Byzantine pressure intensifies
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-reserve',
          params: { position: { x: 850, y: 350 }, speed: 60 },
          delay: 4,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'byzantine-left-flank',
          params: { targetId: 'muslim-right-wing' },
          delay: 5,
        },
        // Abdullah falls
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-infantry',
          params: { behavior: 'regrouping' },
          delay: 7,
        },
      ],
      triggers: [],
    },

    // Phase 5: Khalid's Withdrawal (43-55s)
    {
      id: 'khalid-withdrawal',
      name: "Khalid's Withdrawal",
      nameAr: 'انسحاب خالد',
      startTime: 43,
      duration: 12,
      description:
        "Khalid ibn al-Walid takes command. He reorganizes the army, swaps the wings to confuse the enemy into thinking reinforcements arrived, then executes a brilliant tactical withdrawal saving the Muslim army.",
      actions: [
        // Camera pulls back for the tactical view
        {
          type: 'camera_move',
          params: { x: 500, y: 500, zoom: 0.5, duration: 2 },
          delay: 0,
        },
        // Khalid takes command — cavalry moves to screen
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-cavalry',
          params: { behavior: 'flanking' },
          delay: 0,
        },
        // Swap wings to confuse the enemy
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 550, y: 470 }, speed: 90 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 650, y: 350 }, speed: 90 },
          delay: 1,
        },
        // Cavalry screens the withdrawal
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry',
          params: { position: { x: 600, y: 420 }, speed: 100 },
          delay: 2,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-cavalry',
          params: { targetId: 'byzantine-cavalry' },
          delay: 3,
        },
        // Byzantines hesitate (confused by wing swap)
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-infantry',
          params: { behavior: 'holding' },
          delay: 3,
        },
        // Begin orderly withdrawal — all units pull back west/left
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-infantry',
          params: { behavior: 'retreating' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-infantry',
          params: { position: { x: 300, y: 550 }, speed: 70 },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 280, y: 500 }, speed: 70 },
          delay: 5.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 250, y: 600 }, speed: 70 },
          delay: 5.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 150, y: 700 }, speed: 60 },
          delay: 5,
        },
        // Cavalry covers the retreat last
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry',
          params: { position: { x: 200, y: 550 }, speed: 100 },
          delay: 8,
        },
        // Final camera — overview of successful withdrawal
        {
          type: 'camera_move',
          params: { x: 400, y: 500, zoom: 0.4, duration: 3 },
          delay: 9,
        },
      ],
      triggers: [],
    },
  ],

  // ─── Narration Points ──────────────────────────────────────────────────────────
  narration: [
    {
      id: 'intro',
      time: 0,
      duration: 5,
      text: "The Battle of Mu'tah — Jumada al-Ula, 8 AH. The first great clash between Islam and the Byzantine Empire.",
      textAr:
        'معركة مؤتة — جمادى الأولى، ٨ هـ. أول صدام عسكري كبير بين المسلمين والإمبراطورية البيزنطية. ثلاثة آلاف مقاتل مسلم يواجهون جيشاً جراراً من الروم وحلفائهم يفوق مئة ألف مقاتل.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'advance-narration',
      time: 6,
      duration: 4,
      text: 'The Muslim army advances from their camp toward the village of Mu\'tah, banners flying high.',
      textAr:
        'يتقدم جيش المسلمين من معسكرهم نحو قرية مؤتة، والرايات تخفق عالياً في سماء الشام. زيد بن حارثة يحمل لواء رسول الله ﷺ في المقدمة.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'zayd-charge',
      time: 11,
      duration: 4,
      text: 'Zayd ibn Harithah leads the charge, carrying the banner of the Prophet ﷺ.',
      textAr:
        'يقود زيد بن حارثة — حِبُّ رسول الله ﷺ — الهجوم بنفسه حاملاً اللواء، يشقّ صفوف الروم بشجاعة منقطعة النظير، والمسلمون خلفه كالسيل الجارف.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'zayd-martyrdom',
      time: 18,
      duration: 4,
      text: 'Zayd is struck down — the first commander martyred. The banner must not fall!',
      textAr:
        'يسقط زيد بن حارثة شهيداً مضرّجاً بدمائه بين رماح الروم! اللواء يجب ألا يسقط! فيلتقطه جعفر بن أبي طالب بعزيمة لا تلين.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'jafar-takes-banner',
      time: 23,
      duration: 4,
      text: "Ja'far ibn Abi Talib seizes the banner. He dismounts and hamstrings his horse — there is no retreat.",
      textAr:
        'يأخذ جعفر بن أبي طالب الراية ويعقر فرسه — لا رجعة اليوم! يقاتل قتال الأبطال وهو يردد: يا حبذا الجنة واقترابها!',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'jafar-martyrdom',
      time: 30,
      duration: 4,
      text: "Ja'far's arms are severed but he holds the banner with his stumps. He falls — the second commander martyred.",
      textAr:
        'تُقطع يدا جعفر وهو يحتضن اللواء بعضديه! يسقط الطيّار شهيداً وقد أبدله الله جناحين يطير بهما في الجنة. القائد الثاني يُستشهد في ساعات.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'abdullah-command-narration',
      time: 35,
      duration: 4,
      text: 'Abdullah ibn Rawahah takes the banner. He hesitates, then steels himself with poetry.',
      textAr:
        'يأخذ عبدالله بن رواحة اللواء فيتردد لحظة، ثم يزجر نفسه قائلاً: أقسمتُ يا نفسُ لتنزِلِنّه! ويندفع في صفوف العدو كالأسد الهصور.',
      position: 'bottom',
      style: 'quote',
    },
    {
      id: 'abdullah-martyrdom',
      time: 40,
      duration: 3,
      text: 'Abdullah charges deep into enemy ranks and is martyred — the third commander falls.',
      textAr:
        'يتوغل عبدالله بن رواحة في قلب جيش الروم ويُستشهد — القائد الثالث يسقط شهيداً! الجيش بلا قائد والراية على وشك السقوط!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'khalid-takes-command',
      time: 43,
      duration: 4,
      text: 'Khalid ibn al-Walid seizes the banner. Nine swords break in his hand that day.',
      textAr:
        'يلتقط خالد بن الوليد الراية بيمينه! سيف الله المسلول يتولى القيادة. تسعة أسياف تنكسر في يده في ذلك اليوم من شدة القتال!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'khalid-tactic',
      time: 48,
      duration: 4,
      text: 'Khalid swaps the wings and rear — the Byzantines think Muslim reinforcements have arrived!',
      textAr:
        'يبدّل خالد الميمنة بالميسرة والمقدمة بالساقة! يظن الروم أن مدداً جديداً قد وصل للمسلمين فيرتبكون ويتراجعون، وخالد ينسحب بالجيش في نظام محكم.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'withdrawal-success',
      time: 53,
      duration: 4,
      text: "The Muslim army withdraws intact — Khalid's tactical genius saves 3,000 lives.",
      textAr:
        'ينجح خالد بن الوليد في سحب الجيش سالماً من أرض المعركة! عبقرية تكتيكية فذّة أنقذت ثلاثة آلاف مسلم من الإبادة. سمّاه النبي ﷺ يومها: سيف الله المسلول.',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────────
  cameraScript: [
    {
      time: 0,
      position: { x: 600, y: 450 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 5,
      position: { x: 300, y: 650 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 10,
      position: { x: 500, y: 450 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 14,
      position: { x: 580, y: 400 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 18,
      position: { x: 550, y: 420 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 22,
      position: { x: 600, y: 400 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 27,
      position: { x: 630, y: 380 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 30,
      position: { x: 620, y: 390 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 34,
      position: { x: 650, y: 380 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 40,
      position: { x: 670, y: 370 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 43,
      position: { x: 550, y: 450 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 48,
      position: { x: 450, y: 480 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 52,
      position: { x: 400, y: 550 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    victor: 'muslim',
    muslimCasualties: 12,
    enemyCasualties: 0, // unknown exact number
    summary:
      "A strategic Muslim withdrawal. Despite being outnumbered 30-to-1, Khalid ibn al-Walid's tactical brilliance saved the Muslim army from annihilation. The battle demonstrated Muslim military capability to the Byzantines.",
    summaryAr:
      'انسحاب إسلامي استراتيجي. رغم التفوق العددي الساحق للعدو بنسبة ثلاثين إلى واحد، أنقذت عبقرية خالد بن الوليد التكتيكية الجيش الإسلامي من الإبادة. أثبتت المعركة القدرة العسكرية الإسلامية أمام البيزنطيين.',
    significance:
      "The first major Muslim engagement with a superpower. Demonstrated that the Muslim army could face the Byzantine Empire. Khalid ibn al-Walid earned the title 'Sword of Allah' (سيف الله المسلول) from the Prophet ﷺ.",
  },

  totalDuration: 55,
};
