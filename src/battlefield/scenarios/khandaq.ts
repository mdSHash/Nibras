import type { BattleScenario } from '../types/scenario';

/**
 * Battle of the Trench (Khandaq) - Shawwal 5 AH (March 627 CE)
 *
 * A siege battle where the Confederates (Ahzab) — ~10,000 strong —
 * attempted to conquer Medina but were thwarted by a trench dug across
 * the northern approach on the suggestion of Salman al-Farisi.
 * The siege lasted ~27 days and ended with a divine storm scattering
 * the Confederate camp. This was a decisive Muslim strategic victory
 * without a major pitched battle.
 */
export const battleOfKhandaq: BattleScenario = {
  id: 'battle-of-khandaq',
  name: 'Battle of the Trench (Khandaq)',
  nameAr: 'غزوة الخندق',
  date: 'Shawwal 5 AH (March 627 CE)',
  location: 'Northern approaches to Medina',
  description:
    'The Confederates (Ahzab) — 10,000 strong — besieged Medina but were stopped by an innovative trench dug across the northern approach. After ~27 days, a divine storm scattered their camp and they withdrew.',
  descriptionAr:
    'حاصر الأحزاب — عشرة آلاف مقاتل — المدينة لكنهم أُوقفوا بخندق مبتكر حُفر عبر المدخل الشمالي. بعد نحو ٢٧ يوماً، بعث الله ريحاً عاصفة فرّقت معسكرهم وانسحبوا.',

  map: {
    width: 1200, // world units
    height: 900,
    terrain: [
      // Main battlefield (sandy plain north of Medina)
      {
        id: 'main-field',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 1200, y: 0 },
          { x: 1200, y: 900 },
          { x: 0, y: 900 },
        ],
        color: 0x3d2b1f,
      },
      // The Trench (khandaq) — running east-west across the northern approach
      {
        id: 'trench',
        type: 'flat',
        polygon: [
          { x: 150, y: 420 },
          { x: 1050, y: 420 },
          { x: 1050, y: 450 },
          { x: 150, y: 450 },
        ],
        color: 0x1a1a2e,
        label: 'The Trench (Al-Khandaq)',
      },
      // Harrah (lava field) — west flank
      {
        id: 'harrah-west',
        type: 'rocky',
        polygon: [
          { x: 0, y: 200 },
          { x: 120, y: 200 },
          { x: 120, y: 700 },
          { x: 0, y: 700 },
        ],
        color: 0x2a1a1a,
        label: 'Harrat al-Wabara',
      },
      // Harrah (lava field) — east flank
      {
        id: 'harrah-east',
        type: 'rocky',
        polygon: [
          { x: 1080, y: 200 },
          { x: 1200, y: 200 },
          { x: 1200, y: 700 },
          { x: 1080, y: 700 },
        ],
        color: 0x2a1a1a,
        label: 'Harrat Waqim',
      },
      // Medina city area (south)
      {
        id: 'medina-city',
        type: 'flat',
        polygon: [
          { x: 200, y: 700 },
          { x: 1000, y: 700 },
          { x: 1000, y: 900 },
          { x: 200, y: 900 },
        ],
        color: 0x2e4a3e,
        label: 'Medina',
      },
      // Confederate camp area (north)
      {
        id: 'confederate-camp',
        type: 'sand',
        polygon: [
          { x: 150, y: 0 },
          { x: 1050, y: 0 },
          { x: 1050, y: 180 },
          { x: 150, y: 180 },
        ],
        color: 0x5c4033,
      },
      // Banu Qurayza settlement (southeast inside Medina perimeter)
      {
        id: 'banu-qurayza',
        type: 'flat',
        polygon: [
          { x: 850, y: 720 },
          { x: 1000, y: 720 },
          { x: 1000, y: 820 },
          { x: 850, y: 820 },
        ],
        color: 0x4a3a2a,
        label: 'Banu Qurayza',
      },
    ],
    landmarks: [
      {
        id: 'trench-center',
        position: { x: 600, y: 435 },
        type: 'marker',
        label: 'The Trench',
        labelAr: 'الخندق',
      },
      {
        id: 'prophet-command',
        position: { x: 600, y: 550 },
        type: 'camp',
        label: "Prophet's Command Post",
        labelAr: 'مقر قيادة النبي ﷺ',
      },
      {
        id: 'confederate-camp-marker',
        position: { x: 600, y: 100 },
        type: 'camp',
        label: 'Confederate Camp',
        labelAr: 'معسكر الأحزاب',
      },
      {
        id: 'mount-sal',
        position: { x: 500, y: 600 },
        type: 'hill',
        label: "Mount Sal'",
        labelAr: 'جبل سلع',
      },
      {
        id: 'qurayza-fort',
        position: { x: 925, y: 770 },
        type: 'marker',
        label: 'Banu Qurayza Fort',
        labelAr: 'حصن بني قريظة',
      },
      {
        id: 'duel-point',
        position: { x: 400, y: 435 },
        type: 'marker',
        label: 'Crossing Point (Duel Site)',
        labelAr: 'نقطة العبور (موقع المبارزة)',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  forces: [
    // ─── MUSLIM FORCES (~3000 defenders) ─────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Defenders',
      labelAr: 'المدافعون المسلمون',
      totalStrength: 3000,
      units: [
        {
          id: 'muslim-trench-center',
          name: 'Trench Center Guard',
          nameAr: 'حراس وسط الخندق',
          troopType: 'infantry',
          soldierCount: 600,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 600, y: 480 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north (toward enemy)
          stats: { attack: 7, defense: 9, speed: 4, morale: 10 },
        },
        {
          id: 'muslim-trench-right',
          name: 'Trench Right Guard',
          nameAr: 'حراس يمين الخندق',
          troopType: 'infantry',
          soldierCount: 500,
          commander: "Sa'd ibn Mu'adh",
          startPosition: { x: 850, y: 480 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-trench-left',
          name: 'Trench Left Guard',
          nameAr: 'حراس يسار الخندق',
          troopType: 'infantry',
          soldierCount: 500,
          commander: "Sa'd ibn Ubadah",
          startPosition: { x: 350, y: 480 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-archers-center',
          name: 'Muslim Archers (Center)',
          nameAr: 'الرماة (الوسط)',
          troopType: 'archers',
          soldierCount: 400,
          commander: undefined,
          startPosition: { x: 600, y: 510 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 4, speed: 4, morale: 9 },
        },
        {
          id: 'muslim-archers-flanks',
          name: 'Muslim Archers (Flanks)',
          nameAr: 'الرماة (الأجنحة)',
          troopType: 'archers',
          soldierCount: 300,
          commander: undefined,
          startPosition: { x: 250, y: 500 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 4, speed: 4, morale: 8 },
        },
        {
          id: 'muslim-reserve',
          name: 'Muslim Reserve',
          nameAr: 'الاحتياط',
          troopType: 'reserves',
          soldierCount: 400,
          commander: 'Ali ibn Abi Talib',
          startPosition: { x: 600, y: 580 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 7, morale: 10 },
        },
        {
          id: 'muslim-rear-guard',
          name: 'Rear Guard (vs Qurayza)',
          nameAr: 'الحرس الخلفي',
          troopType: 'infantry',
          soldierCount: 300,
          commander: 'Zayd ibn Harithah',
          startPosition: { x: 800, y: 680 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2, // facing south (toward Qurayza)
          stats: { attack: 6, defense: 8, speed: 5, morale: 8 },
        },
      ],
    },
    // ─── CONFEDERATE FORCES (~10,000 soldiers) ────────────────────────────────────
    {
      faction: 'quraysh',
      label: 'Confederate Forces (Ahzab)',
      labelAr: 'قوات الأحزاب',
      totalStrength: 10000,
      units: [
        {
          id: 'quraysh-main',
          name: 'Quraysh Main Force',
          nameAr: 'جيش قريش الرئيسي',
          troopType: 'command',
          soldierCount: 200,
          commander: 'Abu Sufyan ibn Harb',
          startPosition: { x: 600, y: 150 },
          startFormation: 'line',
          startFacing: Math.PI / 2, // facing south (toward trench)
          stats: { attack: 7, defense: 7, speed: 5, morale: 7 },
        },
        {
          id: 'quraysh-center',
          name: 'Quraysh Center',
          nameAr: 'قلب قريش',
          troopType: 'infantry',
          soldierCount: 200,
          commander: undefined,
          startPosition: { x: 600, y: 250 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 7 },
        },
        {
          id: 'ghatafan-right',
          name: 'Ghatafan (Right Flank)',
          nameAr: 'غطفان (الميمنة)',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Uyaynah ibn Hisn',
          startPosition: { x: 850, y: 220 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 6, speed: 6, morale: 6 },
        },
        {
          id: 'allied-tribes-left',
          name: 'Allied Tribes (Left Flank)',
          nameAr: 'القبائل المتحالفة (الميسرة)',
          troopType: 'infantry',
          soldierCount: 200,
          commander: undefined,
          startPosition: { x: 350, y: 220 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 5, morale: 5 },
        },
        {
          id: 'confederate-archers',
          name: 'Confederate Archers',
          nameAr: 'رماة الأحزاب',
          troopType: 'archers',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 600, y: 300 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 4, speed: 5, morale: 6 },
        },
        {
          id: 'confederate-cavalry',
          name: 'Confederate Cavalry',
          nameAr: 'فرسان الأحزاب',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: undefined,
          startPosition: { x: 750, y: 280 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 7 },
        },
        {
          id: 'amr-warriors',
          name: "Amr's Elite Warriors",
          nameAr: 'فرسان عمرو بن عبد ود',
          troopType: 'cavalry',
          soldierCount: 30,
          commander: 'Amr ibn Abd Wudd',
          startPosition: { x: 400, y: 320 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 8, speed: 8, morale: 9 },
        },
        {
          id: 'confederate-reserves',
          name: 'Confederate Reserves',
          nameAr: 'احتياط الأحزاب',
          troopType: 'reserves',
          soldierCount: 200,
          commander: undefined,
          startPosition: { x: 600, y: 100 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 5, defense: 5, speed: 5, morale: 5 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total ~50 seconds of simulation time) ──────────────────
  phases: [
    // Phase 1: Trench Defense Setup (0-8s)
    {
      id: 'trench-defense',
      name: 'Trench Defense Setup',
      nameAr: 'تحصين الخندق',
      startTime: 0,
      duration: 8,
      description:
        'Muslims are positioned along the trench. The massive Confederate army arrives from the north and is shocked to find the trench blocking their advance.',
      actions: [
        // Camera overview of the battlefield
        {
          type: 'camera_move',
          params: { x: 600, y: 450, zoom: 0.5, duration: 3 },
          delay: 0,
        },
        // Confederates march south toward the trench
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 600, y: 320 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ghatafan-right',
          params: { position: { x: 850, y: 300 }, speed: 50 },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'allied-tribes-left',
          params: { position: { x: 350, y: 300 }, speed: 50 },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'confederate-archers',
          params: { position: { x: 600, y: 350 }, speed: 45 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'confederate-cavalry',
          params: { position: { x: 750, y: 330 }, speed: 60 },
          delay: 3,
        },
        // Confederates halt at the trench — cannot cross
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-center',
          params: { behavior: 'holding' },
          delay: 6,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'ghatafan-right',
          params: { behavior: 'holding' },
          delay: 6,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'allied-tribes-left',
          params: { behavior: 'holding' },
          delay: 6,
        },
      ],
      triggers: [],
    },

    // Phase 2: Confederate Probing (8-18s)
    {
      id: 'confederate-probing',
      name: 'Confederate Probing Attacks',
      nameAr: 'هجمات الأحزاب الاستطلاعية',
      startTime: 8,
      duration: 10,
      description:
        'Confederates attempt to find crossing points along the trench. Archers exchange fire across the gap. Cavalry probes the flanks but cannot pass.',
      actions: [
        // Confederate cavalry probes right flank
        {
          type: 'move_unit',
          targetUnitId: 'confederate-cavalry',
          params: { position: { x: 950, y: 380 }, speed: 80 },
          delay: 0,
        },
        // Confederate archers advance and fire
        {
          type: 'move_unit',
          targetUnitId: 'confederate-archers',
          params: { position: { x: 600, y: 380 }, speed: 40 },
          delay: 1,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'confederate-archers',
          params: { targetId: 'muslim-trench-center' },
          delay: 3,
        },
        // Muslim archers return fire
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-archers-center',
          params: { targetId: 'confederate-archers' },
          delay: 4,
        },
        // Cavalry probes left flank — blocked by harrah
        {
          type: 'move_unit',
          targetUnitId: 'confederate-cavalry',
          params: { position: { x: 200, y: 380 }, speed: 90 },
          delay: 4,
        },
        // Camera follows the probing
        {
          type: 'camera_move',
          params: { x: 600, y: 380, zoom: 0.7, duration: 2 },
          delay: 2,
        },
        // Cavalry retreats — cannot find crossing
        {
          type: 'move_unit',
          targetUnitId: 'confederate-cavalry',
          params: { position: { x: 500, y: 320 }, speed: 70 },
          delay: 7,
        },
        // Ghatafan probes right side
        {
          type: 'move_unit',
          targetUnitId: 'ghatafan-right',
          params: { position: { x: 900, y: 380 }, speed: 50 },
          delay: 5,
        },
        // Muslim archers on flanks fire at Ghatafan
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-archers-flanks',
          params: { targetId: 'ghatafan-right' },
          delay: 7,
        },
        // Ghatafan pulls back
        {
          type: 'move_unit',
          targetUnitId: 'ghatafan-right',
          params: { position: { x: 850, y: 300 }, speed: 60 },
          delay: 9,
        },
        // Camera zooms to show frustration
        {
          type: 'camera_move',
          params: { x: 600, y: 400, zoom: 0.8, duration: 1.5 },
          delay: 7,
        },
      ],
      triggers: [],
    },

    // Phase 3: Ali vs Amr Duel (18-26s)
    {
      id: 'ali-vs-amr',
      name: 'Ali vs Amr ibn Abd Wudd',
      nameAr: 'مبارزة علي وعمرو بن عبد ود',
      startTime: 18,
      duration: 8,
      description:
        'Amr ibn Abd Wudd and a few horsemen find a narrow crossing point and leap across the trench. Amr challenges the Muslims to single combat. Ali ibn Abi Talib answers and defeats him.',
      actions: [
        // Amr's warriors move to the narrow crossing point
        {
          type: 'move_unit',
          targetUnitId: 'amr-warriors',
          params: { position: { x: 400, y: 400 }, speed: 80 },
          delay: 0,
        },
        // Camera focuses on the duel area
        {
          type: 'camera_move',
          params: { x: 400, y: 460, zoom: 1.2, duration: 1.5 },
          delay: 0.5,
        },
        // Amr crosses the trench!
        {
          type: 'move_unit',
          targetUnitId: 'amr-warriors',
          params: { position: { x: 400, y: 470 }, speed: 60 },
          delay: 2,
        },
        // Ali advances from the reserve to meet Amr
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-reserve',
          params: { behavior: 'advancing' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-reserve',
          params: { position: { x: 400, y: 500 }, speed: 80 },
          delay: 3,
        },
        // The duel — Ali engages Amr
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-reserve',
          params: { targetId: 'amr-warriors' },
          delay: 4.5,
        },
        // Ali defeats Amr — Amr's warriors rout
        {
          type: 'set_behavior',
          targetUnitId: 'amr-warriors',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'change_formation',
          targetUnitId: 'amr-warriors',
          params: { formation: 'scattered' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'amr-warriors',
          params: { position: { x: 400, y: 280 }, speed: 100 },
          delay: 6.5,
        },
        // Ali returns to position
        {
          type: 'move_unit',
          targetUnitId: 'muslim-reserve',
          params: { position: { x: 600, y: 560 }, speed: 60 },
          delay: 7,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-reserve',
          params: { behavior: 'holding' },
          delay: 7.5,
        },
      ],
      triggers: [],
    },

    // Phase 4: Siege Pressure & Banu Qurayza Threat (26-36s)
    {
      id: 'siege-pressure',
      name: 'Siege Pressure',
      nameAr: 'ضغط الحصار',
      startTime: 26,
      duration: 10,
      description:
        'The siege intensifies. Banu Qurayza breaks their treaty, threatening Muslims from behind. Nu\'aym ibn Mas\'ud sows discord between Qurayza and the Confederates. Muslims are stretched thin defending both fronts.',
      actions: [
        // Camera shows overview of the siege
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.5, duration: 2 },
          delay: 0,
        },
        // Confederates press harder along the trench
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 600, y: 380 }, speed: 40 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'allied-tribes-left',
          params: { position: { x: 300, y: 380 }, speed: 40 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ghatafan-right',
          params: { position: { x: 900, y: 370 }, speed: 45 },
          delay: 0.5,
        },
        // Arrow exchanges intensify
        {
          type: 'attack_unit',
          targetUnitId: 'confederate-archers',
          params: { targetId: 'muslim-trench-center' },
          delay: 2,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-archers-center',
          params: { targetId: 'quraysh-center' },
          delay: 3,
        },
        // Banu Qurayza threat — rear guard must respond
        // Camera pans to show the rear threat
        {
          type: 'camera_move',
          params: { x: 800, y: 700, zoom: 0.9, duration: 2 },
          delay: 4,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-rear-guard',
          params: { behavior: 'advancing' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 880, y: 720 }, speed: 50 },
          delay: 5,
        },
        // Muslims stretched thin — some reserves move to rear
        {
          type: 'change_formation',
          targetUnitId: 'muslim-rear-guard',
          params: { formation: 'line' },
          delay: 6,
        },
        // Camera returns to trench overview
        {
          type: 'camera_move',
          params: { x: 600, y: 450, zoom: 0.6, duration: 2 },
          delay: 7,
        },
        // Confederates continue pressing but cannot cross
        {
          type: 'attack_unit',
          targetUnitId: 'ghatafan-right',
          params: { targetId: 'muslim-trench-right' },
          delay: 8,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-trench-left',
          params: { targetId: 'allied-tribes-left' },
          delay: 8.5,
        },
      ],
      triggers: [],
    },

    // Phase 5: Storm & Confederate Withdrawal (36-50s)
    {
      id: 'storm-withdrawal',
      name: 'Divine Storm & Withdrawal',
      nameAr: 'الريح الإلهية والانسحاب',
      startTime: 36,
      duration: 14,
      description:
        'A fierce cold wind and storm batters the Confederate camp for days, extinguishing fires and overturning tents. Demoralized and divided, Abu Sufyan orders the retreat. The Confederates withdraw northward in disarray.',
      actions: [
        // Camera shows the Confederate camp
        {
          type: 'camera_move',
          params: { x: 600, y: 250, zoom: 0.7, duration: 2 },
          delay: 0,
        },
        // Storm effect — Confederates begin to scatter
        {
          type: 'change_formation',
          targetUnitId: 'confederate-archers',
          params: { formation: 'scattered' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'confederate-reserves',
          params: { formation: 'scattered' },
          delay: 2.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'allied-tribes-left',
          params: { formation: 'scattered' },
          delay: 3,
        },
        // Morale breaks — retreat begins
        {
          type: 'set_behavior',
          targetUnitId: 'allied-tribes-left',
          params: { behavior: 'retreating' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'allied-tribes-left',
          params: { position: { x: 250, y: 50 }, speed: 80 },
          delay: 3.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'ghatafan-right',
          params: { behavior: 'retreating' },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'ghatafan-right',
          params: { formation: 'scattered' },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ghatafan-right',
          params: { position: { x: 950, y: 50 }, speed: 85 },
          delay: 4.5,
        },
        // Confederate archers flee
        {
          type: 'set_behavior',
          targetUnitId: 'confederate-archers',
          params: { behavior: 'retreating' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'confederate-archers',
          params: { position: { x: 600, y: 50 }, speed: 75 },
          delay: 5,
        },
        // Cavalry retreats
        {
          type: 'set_behavior',
          targetUnitId: 'confederate-cavalry',
          params: { behavior: 'retreating' },
          delay: 5.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'confederate-cavalry',
          params: { position: { x: 800, y: 30 }, speed: 110 },
          delay: 5.5,
        },
        // Quraysh center retreats
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-center',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'change_formation',
          targetUnitId: 'quraysh-center',
          params: { formation: 'scattered' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 600, y: 30 }, speed: 70 },
          delay: 6.5,
        },
        // Abu Sufyan's command retreats last
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-main',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-main',
          params: { position: { x: 600, y: 20 }, speed: 65 },
          delay: 7.5,
        },
        // Reserves flee
        {
          type: 'set_behavior',
          targetUnitId: 'confederate-reserves',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'confederate-reserves',
          params: { position: { x: 500, y: 20 }, speed: 70 },
          delay: 7.5,
        },
        // Camera zooms out to show the full retreat
        {
          type: 'camera_move',
          params: { x: 600, y: 300, zoom: 0.4, duration: 3 },
          delay: 8,
        },
        // Muslims observe from the trench — victorious
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-trench-center',
          params: { behavior: 'holding' },
          delay: 10,
        },
        // Rear guard stands down
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-rear-guard',
          params: { behavior: 'holding' },
          delay: 10,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-rear-guard',
          params: { formation: 'defensive_circle' },
          delay: 10,
        },
      ],
      triggers: [],
    },
  ],

  // ─── Narration Points ──────────────────────────────────────────────────────
  narration: [
    {
      id: 'intro',
      time: 0,
      duration: 5,
      text: 'The Battle of the Trench (Al-Khandaq) — Shawwal, 5 AH. Ten thousand Confederates march on Medina. Salman al-Farisi suggests an unprecedented defense: a trench.',
      textAr:
        'غزوة الخندق (الأحزاب) — شوال ٥ هـ. عشرة آلاف مقاتل من أحزاب الكفر يزحفون نحو المدينة المنورة. سلمان الفارسي يُشير بحفر خندقٍ عظيم — تدبيرٌ لم تعرفه العرب من قبل.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'trench-complete',
      time: 5,
      duration: 3,
      text: '3,000 Muslims defend the trench. Medina is shielded by lava fields east and west, palm groves to the south.',
      textAr:
        'ثلاثة آلاف مسلم يرابطون خلف الخندق. المدينة محصّنة بالحرّات البركانية شرقًا وغربًا، وبساتين النخيل الكثيفة من الجنوب.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'confederate-shock',
      time: 8,
      duration: 4,
      text: 'The Confederates arrive and are stunned — a trench blocks their path. Unprecedented in Arabian warfare! They probe for crossings but find none.',
      textAr:
        'يصل جيش الأحزاب الجرّار فيُصعقون! خندقٌ عميق يقطع عليهم الطريق — أمرٌ لم تشهده جزيرة العرب قط! يبحثون عن ثغرة فلا يجدون.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'arrows-exchange',
      time: 13,
      duration: 4,
      text: 'Days pass in a war of attrition. Archers exchange fire across the trench. The Confederates grow frustrated.',
      textAr:
        'تمضي الأيام ثقيلة في حرب استنزاف مريرة. يتبادل الرماة وابل السهام عبر الخندق، ويتصاعد الإحباط في صفوف الأحزاب.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'amr-crosses',
      time: 18,
      duration: 4,
      text: 'Amr ibn Abd Wudd — the legendary warrior — finds a narrow point and leaps across with a few horsemen! He challenges the Muslims to single combat.',
      textAr:
        'عمرو بن عبد ودّ — فارس العرب الذي يُعدّ بألف — يجد موضعًا ضيقًا فيقفز بجواده عابرًا الخندق مع نفرٍ من الفرسان! يصيح متحديًا المسلمين للمبارزة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'ali-duel',
      time: 22,
      duration: 4,
      text: 'Ali ibn Abi Talib answers the challenge. "The strike of Ali on the day of Khandaq is greater than the worship of all mankind." Ali defeats Amr.',
      textAr:
        'يبرز عليّ بن أبي طالب كرّم الله وجهه ويُلبّي النداء. «ضربة عليٍّ يوم الخندق أفضل من عبادة الثقلين.» يصرع عليٌّ عمرًا في مبارزة خالدة.',
      position: 'center',
      style: 'quote',
    },
    {
      id: 'qurayza-betrayal',
      time: 27,
      duration: 5,
      text: 'Crisis — Banu Qurayza breaks their treaty! They threaten Medina from within. Nu\'aym ibn Mas\'ud, a secret convert, sows discord between Qurayza and the Confederates.',
      textAr:
        'تتأزّم الأمور — بنو قريظة ينقضون العهد ويطعنون المسلمين من الخلف! نعيم بن مسعود، المسلم الذي أخفى إسلامه، يُوقع الفتنة بين قريظة والأحزاب بدهاءٍ عجيب.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'siege-pressure',
      time: 32,
      duration: 4,
      text: 'The Muslims are stretched thin — defending the trench to the north and watching Qurayza to the south. The siege enters its darkest hour.',
      textAr:
        'يُحاصَر المسلمون من كل جانب — يدافعون عن الخندق شمالًا ويحرسون ظهورهم من غدر قريظة جنوبًا. الحصار يبلغ ذروته وتضيق الأرض بما رحبت.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'storm-arrives',
      time: 36,
      duration: 5,
      text: '"We sent against them a wind and forces you did not see." (Quran 33:9) A fierce, cold storm batters the Confederate camp — fires extinguished, tents overturned!',
      textAr:
        '﴿فَأَرْسَلْنَا عَلَيْهِمْ رِيحًا وَجُنُودًا لَّمْ تَرَوْهَا﴾ — ريحٌ صرصرٌ عاتية تهبّ على معسكر الأحزاب فتُطفئ نيرانهم وتقلب خيامهم وتُطير قدورهم! جندٌ من الله لا يُرَدّ.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'retreat-begins',
      time: 42,
      duration: 4,
      text: 'Abu Sufyan cries: "O Quraysh! Each man look to his seat — I am leaving!" The Confederates flee in disarray, never to return.',
      textAr:
        'يصرخ أبو سفيان: «يا معشر قريش! إنّ كلّ امرئٍ لينظر مَن بجانبه — إنّي راحل!» فيفرّ الأحزاب مذعورين في جنح الليل، ولن يعودوا أبدًا.',
      position: 'center',
      style: 'quote',
    },
    {
      id: 'victory',
      time: 47,
      duration: 3,
      text: 'Decisive Muslim victory. The trench — an innovation of Salman al-Farisi — neutralized 10,000 warriors without a major battle. "Now we march against them, they shall never march against us."',
      textAr:
        'نصرٌ مبين بغير قتال! الخندق — ابتكار سلمان الفارسي — أبطل كيد عشرة آلاف مقاتل. قال ﷺ: «الآن نغزوهم ولا يغزوننا!» تحوّلٌ استراتيجي حاسم.',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    {
      time: 0,
      position: { x: 600, y: 450 },
      zoom: 0.5,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 4,
      position: { x: 600, y: 300 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 8,
      position: { x: 600, y: 380 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 12,
      position: { x: 800, y: 400 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 16,
      position: { x: 400, y: 400 },
      zoom: 0.8,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 18,
      position: { x: 400, y: 460 },
      zoom: 1.2,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 22,
      position: { x: 400, y: 480 },
      zoom: 1.4,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 25,
      position: { x: 600, y: 450 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 28,
      position: { x: 800, y: 700 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 32,
      position: { x: 600, y: 500 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 36,
      position: { x: 600, y: 250 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 40,
      position: { x: 600, y: 200 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 44,
      position: { x: 600, y: 300 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
    {
      time: 48,
      position: { x: 600, y: 450 },
      zoom: 0.4,
      duration: 2,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 6,
    enemyCasualties: 3,
    summary:
      'Decisive Muslim strategic victory. The innovative trench defense neutralized the Confederates\' overwhelming numerical superiority. The siege ended without a major battle when a divine storm scattered the enemy camp.',
    summaryAr:
      'نصر استراتيجي حاسم للمسلمين. دفاع الخندق المبتكر أبطل التفوق العددي الساحق للأحزاب. انتهى الحصار دون معركة كبرى عندما فرّقت ريح إلهية معسكر العدو.',
    significance:
      'The last major offensive by the Quraysh against Medina. Demonstrated that siege warfare and defensive innovation could defeat numerical superiority. After this, the Prophet ﷺ declared: "Now we march against them, they shall never march against us."',
  },

  totalDuration: 50, // 50 seconds of simulation
};
