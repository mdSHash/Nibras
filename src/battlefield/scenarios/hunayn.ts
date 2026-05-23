import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Hunayn - 10 Shawwal 8 AH (31 January 630 CE)
 *
 * One of the most dramatic battles in Islamic history.
 * After the Conquest of Mecca, the Hawazin and Thaqif tribes ambushed
 * the massive Muslim army in the Valley of Hunayn. Despite initial rout,
 * the Prophet ﷺ stood firm and rallied his forces to a decisive victory.
 *
 * Referenced in Quran 9:25-26.
 */
export const battleOfHunayn: BattleScenario = {
  id: 'battle-of-hunayn',
  name: 'Battle of Hunayn',
  nameAr: 'غزوة حنين',
  date: '10 Shawwal 8 AH (31 January 630 CE)',
  location: 'Valley of Hunayn, between Mecca and Ta\'if',
  description:
    'After the Conquest of Mecca, the Hawazin and Thaqif tribes ambushed the 12,000-strong Muslim army in a narrow valley. Despite a devastating initial rout, the Prophet ﷺ stood firm with a handful of companions and rallied his forces to a complete victory.',
  descriptionAr:
    'بعد فتح مكة، نصب قبائل هوازن وثقيف كميناً لجيش المسلمين البالغ ١٢ ألف مقاتل في وادٍ ضيق. رغم الهزيمة الأولية المدمرة، ثبت النبي ﷺ مع نفر قليل من أصحابه وجمع قواته لتحقيق نصر كامل.',

  map: {
    width: 1200, // world units
    height: 900,
    terrain: [
      // Valley floor (main area)
      {
        id: 'valley-floor',
        type: 'sand',
        polygon: [
          { x: 350, y: 0 },
          { x: 850, y: 0 },
          { x: 900, y: 900 },
          { x: 300, y: 900 },
        ],
        color: 0x3d2b1f,
      },
      // Eastern hillside (elevated - ambush positions)
      {
        id: 'east-hills',
        type: 'elevated',
        polygon: [
          { x: 850, y: 0 },
          { x: 1200, y: 0 },
          { x: 1200, y: 900 },
          { x: 900, y: 900 },
        ],
        color: 0x4a3728,
      },
      // Western hillside (elevated - ambush positions)
      {
        id: 'west-hills',
        type: 'elevated',
        polygon: [
          { x: 0, y: 0 },
          { x: 350, y: 0 },
          { x: 300, y: 900 },
          { x: 0, y: 900 },
        ],
        color: 0x4a3728,
      },
      // Valley narrows (rocky passage at north entrance)
      {
        id: 'valley-narrows',
        type: 'rocky',
        polygon: [
          { x: 400, y: 0 },
          { x: 800, y: 0 },
          { x: 750, y: 150 },
          { x: 450, y: 150 },
        ],
        color: 0x5c4033,
      },
      // Hawazin camp area (south)
      {
        id: 'hawazin-camp-area',
        type: 'flat',
        polygon: [
          { x: 300, y: 750 },
          { x: 900, y: 750 },
          { x: 900, y: 900 },
          { x: 300, y: 900 },
        ],
        color: 0x2c1810,
      },
    ],
    landmarks: [
      {
        id: 'valley-entrance',
        position: { x: 600, y: 50 },
        type: 'mountain_pass',
        label: 'Valley Entrance',
        labelAr: 'مدخل الوادي',
      },
      {
        id: 'east-ambush-ridge',
        position: { x: 1000, y: 300 },
        type: 'hill',
        label: 'Eastern Ridge',
        labelAr: 'التلال الشرقية',
      },
      {
        id: 'west-ambush-ridge',
        position: { x: 200, y: 300 },
        type: 'hill',
        label: 'Western Ridge',
        labelAr: 'التلال الغربية',
      },
      {
        id: 'prophet-stand',
        position: { x: 600, y: 400 },
        type: 'marker',
        label: "Prophet's Stand",
        labelAr: 'موقف النبي ﷺ',
      },
      {
        id: 'hawazin-camp',
        position: { x: 600, y: 830 },
        type: 'camp',
        label: 'Hawazin Camp (Families & Livestock)',
        labelAr: 'معسكر هوازن (العائلات والأنعام)',
      },
      {
        id: 'rally-point',
        position: { x: 600, y: 250 },
        type: 'marker',
        label: 'Rally Point',
        labelAr: 'نقطة التجمع',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  forces: [
    // ─── MUSLIM FORCES (~12,000 soldiers) ─────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 12000,
      units: [
        {
          id: 'muslim-vanguard-cavalry',
          name: "Vanguard Cavalry (Khalid's)",
          nameAr: 'فرسان المقدمة (خالد)',
          troopType: 'cavalry',
          soldierCount: 200,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 600, y: 80 },
          startFormation: 'column',
          startFacing: Math.PI / 2, // facing south (into valley)
          stats: { attack: 9, defense: 7, speed: 9, morale: 8 },
        },
        {
          id: 'muslim-meccan-converts',
          name: 'New Meccan Converts',
          nameAr: 'مسلمو مكة الجدد',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Abu Sufyan ibn Harb',
          startPosition: { x: 600, y: 130 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 5, defense: 4, speed: 5, morale: 4 },
        },
        {
          id: 'muslim-main-body',
          name: 'Main Body (Muhajirun & Ansar)',
          nameAr: 'الجيش الرئيسي (المهاجرون والأنصار)',
          troopType: 'infantry',
          soldierCount: 200,
          commander: undefined,
          startPosition: { x: 600, y: 200 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-prophet-guard',
          name: "Prophet's ﷺ Guard",
          nameAr: 'حرس النبي ﷺ',
          troopType: 'command',
          soldierCount: 100,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 600, y: 270 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-rear-guard',
          name: 'Rear Guard',
          nameAr: 'المؤخرة',
          troopType: 'infantry',
          soldierCount: 150,
          commander: 'Umar ibn al-Khattab',
          startPosition: { x: 600, y: 50 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-ansar-veterans',
          name: 'Ansar Veterans',
          nameAr: 'أبطال الأنصار',
          troopType: 'infantry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 550, y: 230 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 8, speed: 6, morale: 10 },
        },
      ],
    },
    // ─── HAWAZIN/THAQIF FORCES (~4,000 warriors) ──────────────────────────────
    {
      faction: 'quraysh', // using 'quraysh' faction type for enemy
      label: 'Hawazin & Thaqif Forces',
      labelAr: 'جيش هوازن وثقيف',
      totalStrength: 4000,
      units: [
        {
          id: 'hawazin-east-archers',
          name: 'Eastern Hillside Archers',
          nameAr: 'رماة التلال الشرقية',
          troopType: 'archers',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 950, y: 250 },
          startFormation: 'line',
          startFacing: -Math.PI, // facing west (into valley)
          stats: { attack: 8, defense: 4, speed: 5, morale: 8 },
        },
        {
          id: 'hawazin-west-archers',
          name: 'Western Hillside Archers',
          nameAr: 'رماة التلال الغربية',
          troopType: 'archers',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 250, y: 250 },
          startFormation: 'line',
          startFacing: 0, // facing east (into valley)
          stats: { attack: 8, defense: 4, speed: 5, morale: 8 },
        },
        {
          id: 'hawazin-ambush-infantry',
          name: 'Hidden Valley Infantry',
          nameAr: 'مشاة الكمين',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Malik ibn Awf al-Nasri',
          startPosition: { x: 600, y: 450 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north (toward Muslims)
          stats: { attack: 8, defense: 6, speed: 7, morale: 9 },
        },
        {
          id: 'hawazin-east-infantry',
          name: 'Eastern Ambush Infantry',
          nameAr: 'مشاة الكمين الشرقي',
          troopType: 'infantry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 900, y: 350 },
          startFormation: 'line',
          startFacing: -Math.PI, // facing west
          stats: { attack: 7, defense: 6, speed: 7, morale: 8 },
        },
        {
          id: 'hawazin-west-infantry',
          name: 'Western Ambush Infantry',
          nameAr: 'مشاة الكمين الغربي',
          troopType: 'infantry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 300, y: 350 },
          startFormation: 'line',
          startFacing: 0, // facing east
          stats: { attack: 7, defense: 6, speed: 7, morale: 8 },
        },
        {
          id: 'hawazin-cavalry',
          name: 'Hawazin Cavalry',
          nameAr: 'فرسان هوازن',
          troopType: 'cavalry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 1050, y: 450 },
          startFormation: 'wedge',
          startFacing: -Math.PI, // facing west
          stats: { attack: 8, defense: 6, speed: 9, morale: 8 },
        },
        {
          id: 'hawazin-reserves',
          name: 'Hawazin Reserves (Camp Guard)',
          nameAr: 'احتياط هوازن (حراسة المعسكر)',
          troopType: 'reserves',
          soldierCount: 100,
          commander: 'Duraid ibn al-Simma',
          startPosition: { x: 600, y: 800 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 5, defense: 5, speed: 4, morale: 7 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total ~50 seconds of simulation time) ──────────────────
  phases: [
    // Phase 1: Valley Approach (0-8s)
    {
      id: 'valley-approach',
      name: 'Valley Approach',
      nameAr: 'دخول الوادي',
      startTime: 0,
      duration: 8,
      description: 'The massive Muslim army enters the Valley of Hunayn in long marching columns, confident after the Conquest of Mecca.',
      actions: [
        // Camera shows overview of the valley
        {
          type: 'camera_move',
          params: { x: 600, y: 200, zoom: 0.6, duration: 2 },
          delay: 0,
        },
        // Vanguard advances into valley
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { position: { x: 600, y: 250 }, speed: 80 },
          delay: 0,
        },
        // Meccan converts follow
        {
          type: 'move_unit',
          targetUnitId: 'muslim-meccan-converts',
          params: { position: { x: 600, y: 200 }, speed: 70 },
          delay: 1,
        },
        // Main body advances
        {
          type: 'move_unit',
          targetUnitId: 'muslim-main-body',
          params: { position: { x: 600, y: 280 }, speed: 65 },
          delay: 2,
        },
        // Prophet's guard advances
        {
          type: 'move_unit',
          targetUnitId: 'muslim-prophet-guard',
          params: { position: { x: 600, y: 330 }, speed: 60 },
          delay: 3,
        },
        // Rear guard enters
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 600, y: 150 }, speed: 60 },
          delay: 3,
        },
        // Ansar veterans advance
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ansar-veterans',
          params: { position: { x: 550, y: 300 }, speed: 60 },
          delay: 2.5,
        },
        // Set advancing behavior
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-meccan-converts',
          params: { behavior: 'advancing' },
          delay: 1,
        },
      ],
      triggers: [],
    },
    // Phase 2: The Ambush (8-18s)
    {
      id: 'the-ambush',
      name: 'The Ambush',
      nameAr: 'الكمين',
      startTime: 8,
      duration: 10,
      description: 'Hawazin spring their devastating trap — arrows rain from the hillsides and warriors charge from hidden positions on all sides.',
      actions: [
        // Camera zooms to ambush zone
        {
          type: 'camera_move',
          params: { x: 600, y: 300, zoom: 0.8, duration: 1.5 },
          delay: 0,
        },
        // Eastern archers attack
        {
          type: 'attack_unit',
          targetUnitId: 'hawazin-east-archers',
          params: { targetId: 'muslim-vanguard-cavalry' },
          delay: 0,
        },
        // Western archers attack
        {
          type: 'attack_unit',
          targetUnitId: 'hawazin-west-archers',
          params: { targetId: 'muslim-meccan-converts' },
          delay: 0.5,
        },
        // Eastern archers move to firing positions
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-east-archers',
          params: { position: { x: 850, y: 250 }, speed: 60 },
          delay: 0,
        },
        // Western archers move to firing positions
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-west-archers',
          params: { position: { x: 350, y: 250 }, speed: 60 },
          delay: 0,
        },
        // Hidden infantry charges from center
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-ambush-infantry',
          params: { behavior: 'attacking' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-ambush-infantry',
          params: { position: { x: 600, y: 300 }, speed: 100 },
          delay: 1,
        },
        // Eastern infantry charges into valley
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-east-infantry',
          params: { behavior: 'attacking' },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-east-infantry',
          params: { position: { x: 700, y: 280 }, speed: 90 },
          delay: 1.5,
        },
        // Western infantry charges into valley
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-west-infantry',
          params: { behavior: 'attacking' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-west-infantry',
          params: { position: { x: 500, y: 280 }, speed: 90 },
          delay: 2,
        },
        // Hawazin cavalry charges from behind eastern hills
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-cavalry',
          params: { behavior: 'flanking' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-cavalry',
          params: { position: { x: 750, y: 200 }, speed: 130 },
          delay: 3,
        },
        // Engagements
        {
          type: 'attack_unit',
          targetUnitId: 'hawazin-ambush-infantry',
          params: { targetId: 'muslim-vanguard-cavalry' },
          delay: 4,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'hawazin-east-infantry',
          params: { targetId: 'muslim-main-body' },
          delay: 5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'hawazin-west-infantry',
          params: { targetId: 'muslim-meccan-converts' },
          delay: 5,
        },
        // Vanguard panics - formation breaks
        {
          type: 'change_formation',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { formation: 'scattered' },
          delay: 6,
        },
        // Meccan converts panic
        {
          type: 'change_formation',
          targetUnitId: 'muslim-meccan-converts',
          params: { formation: 'scattered' },
          delay: 7,
        },
      ],
      triggers: [],
    },
    // Phase 3: The Rout (18-28s)
    {
      id: 'the-rout',
      name: 'The Rout',
      nameAr: 'الانهزام',
      startTime: 18,
      duration: 10,
      description: 'Chain rout — the vanguard flees backward, causing panic throughout the massive army. Only the Prophet ﷺ and ~100 companions hold firm.',
      actions: [
        // Camera shows the chaos
        {
          type: 'camera_move',
          params: { x: 600, y: 250, zoom: 0.5, duration: 2 },
          delay: 0,
        },
        // Vanguard cavalry routs northward
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { position: { x: 650, y: 30 }, speed: 130 },
          delay: 0,
        },
        // Meccan converts rout
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-meccan-converts',
          params: { behavior: 'retreating' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-meccan-converts',
          params: { position: { x: 550, y: 30 }, speed: 110 },
          delay: 1,
        },
        // Main body starts to waver and retreat
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-main-body',
          params: { behavior: 'retreating' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-main-body',
          params: { formation: 'scattered' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-main-body',
          params: { position: { x: 620, y: 80 }, speed: 90 },
          delay: 2.5,
        },
        // Rear guard panics
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-rear-guard',
          params: { behavior: 'retreating' },
          delay: 3,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-rear-guard',
          params: { formation: 'scattered' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 580, y: 20 }, speed: 85 },
          delay: 3.5,
        },
        // Ansar veterans waver but slow retreat
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-ansar-veterans',
          params: { behavior: 'retreating' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ansar-veterans',
          params: { position: { x: 530, y: 100 }, speed: 70 },
          delay: 3.5,
        },
        // *** PROPHET STANDS FIRM ***
        // Prophet's guard forms defensive circle - does NOT retreat
        {
          type: 'change_formation',
          targetUnitId: 'muslim-prophet-guard',
          params: { formation: 'defensive_circle' },
          delay: 2,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-prophet-guard',
          params: { behavior: 'holding' },
          delay: 2,
        },
        // Prophet's guard moves slightly to hold position
        {
          type: 'move_unit',
          targetUnitId: 'muslim-prophet-guard',
          params: { position: { x: 600, y: 350 }, speed: 30 },
          delay: 2,
        },
        // Camera focuses on Prophet's stand
        {
          type: 'camera_move',
          params: { x: 600, y: 350, zoom: 1.2, duration: 2 },
          delay: 5,
        },
        // Hawazin continue pressing
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-ambush-infantry',
          params: { position: { x: 600, y: 250 }, speed: 70 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-cavalry',
          params: { position: { x: 650, y: 150 }, speed: 100 },
          delay: 4,
        },
      ],
      triggers: [],
    },
    // Phase 4: Abbas's Call & Rally (28-38s)
    {
      id: 'abbas-call-rally',
      name: "Abbas's Call & The Rally",
      nameAr: 'نداء العباس والتجمع',
      startTime: 28,
      duration: 10,
      description: 'The Prophet ﷺ orders Abbas to call out with his thunderous voice. The Ansar and Muhajirun veterans hear and turn back, shouting "Labbayk!"',
      actions: [
        // Camera on Prophet's position for the call
        {
          type: 'camera_move',
          params: { x: 600, y: 300, zoom: 1.0, duration: 1.5 },
          delay: 0,
        },
        // Play dramatic effect for Abbas's call
        {
          type: 'play_effect',
          params: { effect: 'rally_call', position: { x: 600, y: 350 }, radius: 400 },
          delay: 1,
        },
        // Ansar veterans STOP retreating and turn back
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-ansar-veterans',
          params: { behavior: 'advancing' },
          delay: 3,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-ansar-veterans',
          params: { formation: 'line' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ansar-veterans',
          params: { position: { x: 550, y: 350 }, speed: 90 },
          delay: 3.5,
        },
        // Main body rallies
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-main-body',
          params: { behavior: 'advancing' },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-main-body',
          params: { formation: 'line' },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-main-body',
          params: { position: { x: 620, y: 320 }, speed: 85 },
          delay: 4.5,
        },
        // Rear guard rallies
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-rear-guard',
          params: { behavior: 'advancing' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-rear-guard',
          params: { formation: 'line' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 580, y: 280 }, speed: 80 },
          delay: 5.5,
        },
        // Vanguard cavalry rallies
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { behavior: 'advancing' },
          delay: 5.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { formation: 'wedge' },
          delay: 5.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { position: { x: 700, y: 300 }, speed: 110 },
          delay: 6,
        },
        // Meccan converts rally (slower)
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-meccan-converts',
          params: { behavior: 'advancing' },
          delay: 7,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-meccan-converts',
          params: { formation: 'line' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-meccan-converts',
          params: { position: { x: 500, y: 350 }, speed: 70 },
          delay: 7.5,
        },
        // Camera pulls back to show rally
        {
          type: 'camera_move',
          params: { x: 600, y: 300, zoom: 0.6, duration: 2 },
          delay: 5,
        },
        // Prophet's guard expands formation
        {
          type: 'change_formation',
          targetUnitId: 'muslim-prophet-guard',
          params: { formation: 'line' },
          delay: 6,
        },
        // Counter-attacks begin
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-ansar-veterans',
          params: { targetId: 'hawazin-ambush-infantry' },
          delay: 7,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { targetId: 'hawazin-cavalry' },
          delay: 8,
        },
      ],
      triggers: [],
    },
    // Phase 5: Victory (38-50s)
    {
      id: 'victory',
      name: 'Muslim Victory',
      nameAr: 'نصر المسلمين',
      startTime: 38,
      duration: 12,
      description: 'The rallied Muslim forces overwhelm the Hawazin. Malik ibn Awf flees to Ta\'if. Massive spoils are captured.',
      actions: [
        // Full Muslim counter-attack
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-main-body',
          params: { behavior: 'attacking' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-main-body',
          params: { position: { x: 620, y: 450 }, speed: 90 },
          delay: 0,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-ansar-veterans',
          params: { behavior: 'attacking' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ansar-veterans',
          params: { position: { x: 550, y: 480 }, speed: 90 },
          delay: 0.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { behavior: 'pursuing' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { position: { x: 700, y: 500 }, speed: 130 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 500, y: 400 }, speed: 85 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-meccan-converts',
          params: { position: { x: 450, y: 450 }, speed: 75 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-prophet-guard',
          params: { position: { x: 600, y: 450 }, speed: 70 },
          delay: 1.5,
        },
        // Engagements
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-main-body',
          params: { targetId: 'hawazin-ambush-infantry' },
          delay: 2,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { targetId: 'hawazin-west-infantry' },
          delay: 3,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { targetId: 'hawazin-cavalry' },
          delay: 3,
        },
        // Hawazin morale breaks - they rout
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-ambush-infantry',
          params: { behavior: 'retreating' },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'hawazin-ambush-infantry',
          params: { formation: 'scattered' },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-ambush-infantry',
          params: { position: { x: 600, y: 880 }, speed: 100 },
          delay: 4.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-east-infantry',
          params: { behavior: 'retreating' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'hawazin-east-infantry',
          params: { formation: 'scattered' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-east-infantry',
          params: { position: { x: 1100, y: 850 }, speed: 95 },
          delay: 5.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-west-infantry',
          params: { behavior: 'retreating' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'hawazin-west-infantry',
          params: { formation: 'scattered' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-west-infantry',
          params: { position: { x: 100, y: 850 }, speed: 95 },
          delay: 5.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-cavalry',
          params: { behavior: 'retreating' },
          delay: 5.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'hawazin-cavalry',
          params: { formation: 'scattered' },
          delay: 5.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-cavalry',
          params: { position: { x: 1100, y: 900 }, speed: 130 },
          delay: 6,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-east-archers',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-east-archers',
          params: { position: { x: 1150, y: 800 }, speed: 80 },
          delay: 6.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-west-archers',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-west-archers',
          params: { position: { x: 50, y: 800 }, speed: 80 },
          delay: 6.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'hawazin-reserves',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'change_formation',
          targetUnitId: 'hawazin-reserves',
          params: { formation: 'scattered' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'hawazin-reserves',
          params: { position: { x: 600, y: 900 }, speed: 70 },
          delay: 7.5,
        },
        // Camera shows the rout overview
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.4, duration: 2.5 },
          delay: 4,
        },
        // Muslim pursuit
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard-cavalry',
          params: { position: { x: 700, y: 750 }, speed: 140 },
          delay: 8,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-main-body',
          params: { position: { x: 600, y: 650 }, speed: 80 },
          delay: 8,
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
      text: 'The Battle of Hunayn — 10 Shawwal, 8 AH. After the Conquest of Mecca, 12,000 Muslims march toward the Hawazin tribes.',
      textAr:
        'غزوة حنين — ١٠ شوال ٨ هـ. بعد فتح مكة العظيم، يزحف اثنا عشر ألف مقاتل مسلم نحو قبائل هوازن وثقيف في أكبر جيش إسلامي عرفته الجزيرة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'overconfidence',
      time: 5,
      duration: 4,
      text: '"We cannot be defeated today due to our numbers!" — Some Muslims boasted. Allah later revealed: "...your great numbers pleased you, but they availed you not." (Quran 9:25)',
      textAr:
        '"لن نُغلب اليوم من قلة!" — تفاخر بعض المسلمين. فأنزل الله: "...وَيَوْمَ حُنَيْنٍ إِذْ أَعْجَبَتْكُمْ كَثْرَتُكُمْ فَلَمْ تُغْنِ عَنكُمْ شَيْئًا" (التوبة: ٢٥)',
      position: 'bottom',
      style: 'quote',
    },
    {
      id: 'ambush-narration',
      time: 9,
      duration: 5,
      text: 'Malik ibn Awf springs the trap! Arrows rain from the hillsides. Warriors charge from every hidden position. The valley becomes a death trap.',
      textAr:
        'مالك بن عوف يُطلق الكمين المدمر! تنهمر السهام كالمطر الأسود من التلال، والمقاتلون ينقضّون من كل شِعب وكل صخرة. الوادي يتحول إلى فخ مميت لا مخرج منه!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'rout-narration',
      time: 18,
      duration: 5,
      text: 'Panic spreads like wildfire. The vanguard flees, crashing into those behind. 12,000 men rout in chaos — the greatest army Arabia has ever seen, fleeing in terror.',
      textAr:
        'ينتشر الذعر كالنار في الهشيم! تفر المقدمة فتصطدم بمن خلفها في فوضى عارمة. اثنا عشر ألف مقاتل ينهزمون — أعظم جيش عرفته الجزيرة يفر مذعوراً كأن الأرض ضاقت عليهم بما رحبت!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'prophet-stand-narration',
      time: 23,
      duration: 5,
      text: 'The Prophet ﷺ stands firm on his white mule, with only Abu Bakr, Ali, Abbas, and fewer than 100 companions. He calls out: "I am the Prophet, this is no lie! I am the son of Abdul-Muttalib!"',
      textAr:
        'يثبت النبي ﷺ ثبات الجبال على بغلته البيضاء، ومعه أبو بكر وعلي والعباس ونفر قليل لا يتجاوزون المئة. يصيح بأعلى صوته الشريف: "أنا النبي لا كذب، أنا ابن عبد المطلب!"',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'abbas-call-narration',
      time: 29,
      duration: 5,
      text: 'The Prophet ﷺ orders Abbas — whose voice could reach across valleys — to call: "O Companions of the Acacia Tree! O Companions of Surah al-Baqarah!" The call thunders across the battlefield.',
      textAr:
        'يأمر النبي ﷺ عمه العباس — صاحب الصوت الذي يزلزل الوديان — أن يصرخ بأعلى صوته: "يا أصحاب الشجرة! يا أصحاب سورة البقرة!" فيدوي النداء في أرجاء المعركة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'rally-narration',
      time: 34,
      duration: 4,
      text: '"Labbayk! Labbayk!" (At your service!) — The Ansar and Muhajirun veterans hear the call, turn their horses, and charge back toward the Prophet ﷺ.',
      textAr:
        '"لبيك! لبيك!" — يسمع الأنصار والمهاجرون النداء، فيلوون أعنة خيولهم، ويعودون مسرعين نحو النبي ﷺ.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'counter-attack-narration',
      time: 38,
      duration: 4,
      text: 'The rallied Muslims crash into the Hawazin like a tidal wave. The ambushers become the ambushed. The tide of battle reverses completely.',
      textAr:
        'ينقضّ المسلمون المتجمعون على هوازن كالموج العارم الذي لا يُردّ! يصبح الكامنون هم المحاصرين، والصيادون هم الفريسة. تنقلب موازين المعركة رأساً على عقب!',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'hawazin-rout-narration',
      time: 43,
      duration: 4,
      text: 'The Hawazin lines shatter. Malik ibn Awf flees to the fortress of Ta\'if. Their camp with families and livestock falls to the Muslims.',
      textAr:
        'تتحطم صفوف هوازن كالزجاج المهشّم! يفر مالك بن عوف مذعوراً إلى حصن الطائف. يسقط معسكرهم بكل ما فيه من عائلات وأنعام وغنائم في أيدي المسلمين.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'victory-narration',
      time: 47,
      duration: 3,
      text: 'Total victory. From the brink of annihilation to complete triumph. Allah sent down His tranquility upon His Messenger and the believers. (Quran 9:26)',
      textAr:
        'نصر مبين عظيم! من حافة الهلاك والفناء إلى النصر الساحق الكامل. "ثُمَّ أَنزَلَ اللَّهُ سَكِينَتَهُ عَلَىٰ رَسُولِهِ وَعَلَى الْمُؤْمِنِينَ" (التوبة: ٢٦)',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    // Opening overview of the valley
    {
      time: 0,
      position: { x: 600, y: 200 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Follow Muslim column entering
    {
      time: 3,
      position: { x: 600, y: 250 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    // Ambush begins - quick zoom
    {
      time: 8,
      position: { x: 600, y: 300 },
      zoom: 0.9,
      duration: 1,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Show the ambush from above
    {
      time: 11,
      position: { x: 600, y: 300 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Rout - wide shot showing chaos
    {
      time: 18,
      position: { x: 600, y: 250 },
      zoom: 0.45,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Focus on Prophet's stand
    {
      time: 22,
      position: { x: 600, y: 350 },
      zoom: 1.2,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Abbas's call - dramatic zoom
    {
      time: 28,
      position: { x: 600, y: 350 },
      zoom: 1.0,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Rally - pull back to show troops returning
    {
      time: 32,
      position: { x: 600, y: 300 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Counter-attack
    {
      time: 38,
      position: { x: 600, y: 400 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    // Hawazin rout - wide overview
    {
      time: 42,
      position: { x: 600, y: 500 },
      zoom: 0.4,
      duration: 2.5,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Final victory shot
    {
      time: 47,
      position: { x: 600, y: 450 },
      zoom: 0.35,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    victor: 'muslim',
    muslimCasualties: 4,
    enemyCasualties: 70,
    summary:
      'Decisive Muslim victory after initial near-disaster. The Hawazin were routed, their camp captured with 6,000 prisoners, 24,000 camels, and 40,000 sheep. Malik ibn Awf fled to Ta\'if.',
    summaryAr:
      'نصر حاسم للمسلمين بعد كارثة أولية وشيكة. هُزمت هوازن واستُولي على معسكرهم مع ٦٠٠٠ أسير و٢٤٠٠٠ بعير و٤٠٠٠٠ شاة. فر مالك بن عوف إلى الطائف.',
    significance:
      'Demonstrated that victory comes from Allah alone, not from numbers. The dramatic reversal from near-total defeat to complete victory is directly referenced in Quran 9:25-26. One of the most dramatic battles in Islamic history.',
  },

  totalDuration: 50, // 50 seconds of simulation
};
