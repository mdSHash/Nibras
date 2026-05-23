import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Ain Jalut - 25 Ramadan 658 AH (3 September 1260 CE)
 *
 * The decisive Mamluk victory over the Mongol Empire at Ain Jalut
 * (Spring of Goliath) in Palestine. After the Mongols under Kitbuqa
 * had conquered Baghdad (1258) and Damascus, the Mamluk Sultan Qutuz
 * and commander Baybars led the Muslim army from Egypt. Baybars led
 * a vanguard that lured the Mongols into an ambush, then Qutuz led
 * the main force in a devastating counterattack. This was the first
 * major Mongol defeat and stopped their westward expansion.
 */
export const battleOfAinJalut: BattleScenario = {
  id: 'battle-of-ain-jalut',
  name: 'Battle of Ain Jalut',
  nameAr: 'معركة عين جالوت',
  date: '25 Ramadan 658 AH (3 September 1260 CE)',
  location: 'Ain Jalut (Spring of Goliath), Jezreel Valley, Palestine',
  description:
    'The Mamluk army under Sultan Qutuz and commander Baybars defeated the Mongol forces of Kitbuqa at Ain Jalut. Baybars lured the Mongols into an ambush with a feigned retreat, then Qutuz led the decisive counterattack. This was the first major Mongol defeat and halted their westward expansion.',
  descriptionAr:
    'هزم جيش المماليك بقيادة السلطان قطز والقائد بيبرس قوات المغول بقيادة كتبغا في عين جالوت. استدرج بيبرس المغول إلى كمين بانسحاب تكتيكي، ثم قاد قطز الهجوم الحاسم. كانت هذه أول هزيمة كبرى للمغول وأوقفت توسعهم غرباً.',

  map: {
    width: 1300,
    height: 950,
    terrain: [
      // Main battlefield (valley floor)
      {
        id: 'valley-floor',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1300, y: 0 },
          { x: 1300, y: 950 },
          { x: 0, y: 950 },
        ],
        color: 0x3b2f1e,
      },
      // Hills on the left (ambush position)
      {
        id: 'hills-left',
        type: 'elevated',
        polygon: [
          { x: 0, y: 200 },
          { x: 200, y: 200 },
          { x: 200, y: 600 },
          { x: 0, y: 600 },
        ],
        color: 0x4a6741,
        label: 'التلال الغربية',
      },
      // Hills on the right (ambush position)
      {
        id: 'hills-right',
        type: 'elevated',
        polygon: [
          { x: 1100, y: 200 },
          { x: 1300, y: 200 },
          { x: 1300, y: 600 },
          { x: 1100, y: 600 },
        ],
        color: 0x4a6741,
        label: 'التلال الشرقية',
      },
      // Valley narrows (kill zone)
      {
        id: 'valley-narrows',
        type: 'sand',
        polygon: [
          { x: 300, y: 300 },
          { x: 1000, y: 300 },
          { x: 1000, y: 550 },
          { x: 300, y: 550 },
        ],
        color: 0x4d3a20,
      },
      // Spring of Ain Jalut
      {
        id: 'spring-area',
        type: 'oasis',
        polygon: [
          { x: 550, y: 380 },
          { x: 750, y: 380 },
          { x: 750, y: 480 },
          { x: 550, y: 480 },
        ],
        color: 0x2a5a4a,
      },
      // Mamluk camp area (south)
      {
        id: 'mamluk-camp',
        type: 'flat',
        polygon: [
          { x: 350, y: 750 },
          { x: 950, y: 750 },
          { x: 950, y: 930 },
          { x: 350, y: 930 },
        ],
        color: 0x2c1f10,
      },
      // Mongol approach (north)
      {
        id: 'mongol-approach',
        type: 'flat',
        polygon: [
          { x: 350, y: 30 },
          { x: 950, y: 30 },
          { x: 950, y: 200 },
          { x: 350, y: 200 },
        ],
        color: 0x3d2b15,
      },
    ],
    landmarks: [
      {
        id: 'ain-jalut-spring',
        position: { x: 650, y: 430 },
        type: 'oasis',
        label: 'Ain Jalut Spring',
        labelAr: 'عين جالوت',
      },
      {
        id: 'the-hills',
        position: { x: 100, y: 400 },
        type: 'hill',
        label: 'The Hills',
        labelAr: 'التلال',
      },
      {
        id: 'valley-of-goliath',
        position: { x: 650, y: 300 },
        type: 'marker',
        label: 'Valley of Goliath',
        labelAr: 'وادي جالوت',
      },
      {
        id: 'mamluk-camp-marker',
        position: { x: 650, y: 850 },
        type: 'camp',
        label: 'Mamluk Camp',
        labelAr: 'معسكر المماليك',
      },
      {
        id: 'ambush-position',
        position: { x: 1200, y: 400 },
        type: 'hill',
        label: 'Ambush Position',
        labelAr: 'موقع الكمين',
      },
    ],
    backgroundColor: 0x2c1f10,
  },

  forces: [
    // ─── MAMLUK FORCES (~20,000 soldiers) ─────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Mamluk Army',
      labelAr: 'المماليك',
      totalStrength: 20000,
      units: [
        {
          id: 'mamluk-baybars-vanguard',
          name: "Baybars' Vanguard",
          nameAr: 'مقدمة بيبرس',
          troopType: 'cavalry',
          soldierCount: 4000,
          commander: 'Baybars',
          startPosition: { x: 650, y: 700 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 9, morale: 10 },
        },
        {
          id: 'mamluk-cavalry',
          name: 'Mamluk Cavalry',
          nameAr: 'فرسان المماليك',
          troopType: 'cavalry',
          soldierCount: 5000,
          commander: undefined,
          startPosition: { x: 650, y: 800 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 8, morale: 9 },
        },
        {
          id: 'mamluk-infantry',
          name: 'Mamluk Infantry',
          nameAr: 'مشاة المماليك',
          troopType: 'infantry',
          soldierCount: 4000,
          commander: undefined,
          startPosition: { x: 650, y: 870 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 5, morale: 9 },
        },
        {
          id: 'mamluk-right-wing',
          name: 'Right Wing',
          nameAr: 'الجناح الأيمن',
          troopType: 'cavalry',
          soldierCount: 3000,
          commander: undefined,
          startPosition: { x: 150, y: 450 },
          startFormation: 'line',
          startFacing: Math.PI / 4,
          stats: { attack: 8, defense: 7, speed: 8, morale: 9 },
        },
        {
          id: 'mamluk-left-wing',
          name: 'Left Wing',
          nameAr: 'الجناح الأيسر',
          troopType: 'cavalry',
          soldierCount: 3000,
          commander: undefined,
          startPosition: { x: 1150, y: 450 },
          startFormation: 'line',
          startFacing: (3 * Math.PI) / 4,
          stats: { attack: 8, defense: 7, speed: 8, morale: 9 },
        },
        {
          id: 'mamluk-qutuz-reserve',
          name: "Qutuz's Reserve",
          nameAr: 'قوات قطز',
          troopType: 'cavalry',
          soldierCount: 5000,
          commander: 'Sultan Qutuz',
          startPosition: { x: 650, y: 900 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 8, speed: 8, morale: 10 },
        },
      ],
    },
    // ─── MONGOL FORCES (~15,000 soldiers) ─────────────────────────────────────
    {
      faction: 'quraysh',
      label: 'Mongol Army',
      labelAr: 'المغول',
      totalStrength: 15000,
      units: [
        {
          id: 'mongol-cavalry',
          name: 'Mongol Cavalry',
          nameAr: 'فرسان المغول',
          troopType: 'cavalry',
          soldierCount: 5000,
          commander: undefined,
          startPosition: { x: 650, y: 120 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 6, speed: 9, morale: 8 },
        },
        {
          id: 'mongol-archers',
          name: 'Mongol Archers',
          nameAr: 'رماة المغول',
          troopType: 'archers',
          soldierCount: 3000,
          commander: undefined,
          startPosition: { x: 650, y: 60 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 4, speed: 7, morale: 7 },
        },
        {
          id: 'mongol-infantry',
          name: 'Mongol Infantry',
          nameAr: 'مشاة المغول',
          troopType: 'infantry',
          soldierCount: 3000,
          commander: undefined,
          startPosition: { x: 450, y: 100 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 6, speed: 5, morale: 7 },
        },
        {
          id: 'mongol-kitbuqa-guard',
          name: "Kitbuqa's Guard",
          nameAr: 'الحرس الخاص',
          troopType: 'cavalry',
          soldierCount: 2000,
          commander: 'Kitbuqa',
          startPosition: { x: 850, y: 80 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 8, morale: 9 },
        },
        {
          id: 'mongol-right-wing',
          name: 'Mongol Right Wing',
          nameAr: 'الجناح الأيمن المغولي',
          troopType: 'cavalry',
          soldierCount: 2000,
          commander: undefined,
          startPosition: { x: 350, y: 140 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 5, speed: 9, morale: 7 },
        },
      ],
    },
  ],

  // ─── Battle Phases ──────────────────────────────────────────────────────────
  phases: [
    // Phase 1: The Lure (0-10s)
    {
      id: 'the-lure',
      name: 'The Lure',
      nameAr: 'الاستدراج',
      startTime: 0,
      duration: 10,
      description: "Baybars' vanguard advances toward the Mongols, engages briefly, then feigns retreat to draw them south.",
      actions: [
        // Camera overview
        {
          type: 'camera_move',
          params: { x: 650, y: 475, zoom: 0.4, duration: 3 },
          delay: 0,
        },
        // Baybars' vanguard advances north toward Mongols
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { behavior: 'advancing' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { position: { x: 650, y: 350 }, speed: 90 },
          delay: 1.5,
        },
        // Camera follows Baybars
        {
          type: 'camera_move',
          params: { x: 650, y: 350, zoom: 0.7, duration: 2 },
          delay: 3,
        },
        // Brief engagement with Mongol cavalry
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { targetId: 'mongol-cavalry' },
          delay: 5,
        },
        // Mongol cavalry responds
        {
          type: 'move_unit',
          targetUnitId: 'mongol-cavalry',
          params: { position: { x: 650, y: 250 }, speed: 80 },
          delay: 4,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'mongol-cavalry',
          params: { targetId: 'mamluk-baybars-vanguard' },
          delay: 5.5,
        },
        // Baybars feigns retreat
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { position: { x: 650, y: 550 }, speed: 85 },
          delay: 7.5,
        },
      ],
      triggers: [],
    },

    // Phase 2: The Pursuit (10-22s)
    {
      id: 'the-pursuit',
      name: 'The Pursuit',
      nameAr: 'المطاردة',
      startTime: 10,
      duration: 12,
      description: 'The Mongols pursue Baybars into the valley, entering the ambush zone between the hills.',
      actions: [
        // Mongol cavalry pursues aggressively
        {
          type: 'set_behavior',
          targetUnitId: 'mongol-cavalry',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mongol-cavalry',
          params: { position: { x: 650, y: 420 }, speed: 90 },
          delay: 0.5,
        },
        // Mongol archers follow
        {
          type: 'move_unit',
          targetUnitId: 'mongol-archers',
          params: { position: { x: 650, y: 300 }, speed: 70 },
          delay: 1,
        },
        // Mongol infantry advances
        {
          type: 'move_unit',
          targetUnitId: 'mongol-infantry',
          params: { position: { x: 450, y: 350 }, speed: 60 },
          delay: 1.5,
        },
        // Kitbuqa's guard follows
        {
          type: 'move_unit',
          targetUnitId: 'mongol-kitbuqa-guard',
          params: { position: { x: 850, y: 350 }, speed: 75 },
          delay: 2,
        },
        // Mongol right wing advances
        {
          type: 'move_unit',
          targetUnitId: 'mongol-right-wing',
          params: { position: { x: 350, y: 380 }, speed: 80 },
          delay: 2.5,
        },
        // Camera pans to show Mongols entering the valley
        {
          type: 'camera_move',
          params: { x: 650, y: 400, zoom: 0.6, duration: 2.5 },
          delay: 3,
        },
        // Baybars continues retreating deeper into the valley
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { position: { x: 650, y: 650 }, speed: 75 },
          delay: 4,
        },
        // Mongol cavalry continues pursuit deeper
        {
          type: 'move_unit',
          targetUnitId: 'mongol-cavalry',
          params: { position: { x: 650, y: 520 }, speed: 85 },
          delay: 6,
        },
        // Mongol archers move into the valley
        {
          type: 'move_unit',
          targetUnitId: 'mongol-archers',
          params: { position: { x: 650, y: 420 }, speed: 65 },
          delay: 7,
        },
        // Kitbuqa pushes forward
        {
          type: 'move_unit',
          targetUnitId: 'mongol-kitbuqa-guard',
          params: { position: { x: 850, y: 450 }, speed: 70 },
          delay: 8,
        },
        // Camera shows the trap forming
        {
          type: 'camera_move',
          params: { x: 650, y: 450, zoom: 0.5, duration: 2 },
          delay: 9,
        },
      ],
      triggers: [],
    },

    // Phase 3: The Ambush (22-35s)
    {
      id: 'the-ambush',
      name: 'The Ambush',
      nameAr: 'الكمين',
      startTime: 22,
      duration: 13,
      description: 'Hidden Mamluk forces spring from the hills on both flanks, trapping the Mongols in the valley.',
      actions: [
        // Camera zooms out to show the ambush
        {
          type: 'camera_move',
          params: { x: 650, y: 450, zoom: 0.45, duration: 2 },
          delay: 0,
        },
        // Right wing springs from the hills
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-right-wing',
          params: { behavior: 'advancing' },
          delay: 1,
        },
        {
          type: 'change_formation',
          targetUnitId: 'mamluk-right-wing',
          params: { formation: 'wedge' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-right-wing',
          params: { position: { x: 400, y: 420 }, speed: 90 },
          delay: 1.5,
        },
        // Left wing springs from the hills
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-left-wing',
          params: { behavior: 'advancing' },
          delay: 1.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'mamluk-left-wing',
          params: { formation: 'wedge' },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-left-wing',
          params: { position: { x: 900, y: 420 }, speed: 90 },
          delay: 2,
        },
        // Wings attack Mongol flanks
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-right-wing',
          params: { targetId: 'mongol-right-wing' },
          delay: 4,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-left-wing',
          params: { targetId: 'mongol-kitbuqa-guard' },
          delay: 4.5,
        },
        // Baybars turns and attacks
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { behavior: 'advancing' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { formation: 'wedge' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { position: { x: 650, y: 480 }, speed: 95 },
          delay: 5.5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { targetId: 'mongol-cavalry' },
          delay: 7,
        },
        // Mamluk cavalry advances
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-cavalry',
          params: { behavior: 'advancing' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-cavalry',
          params: { position: { x: 650, y: 550 }, speed: 80 },
          delay: 6.5,
        },
        // Camera focuses on the encirclement
        {
          type: 'camera_move',
          params: { x: 650, y: 430, zoom: 0.55, duration: 2 },
          delay: 8,
        },
        // Mongols start to panic
        {
          type: 'set_behavior',
          targetUnitId: 'mongol-archers',
          params: { behavior: 'retreating' },
          delay: 10,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mongol-archers',
          params: { position: { x: 650, y: 350 }, speed: 60 },
          delay: 10.5,
        },
      ],
      triggers: [],
    },

    // Phase 4: Qutuz's Charge (35-45s)
    {
      id: 'qutuz-charge',
      name: "Qutuz's Charge",
      nameAr: 'هجوم قطز',
      startTime: 35,
      duration: 10,
      description: "Sultan Qutuz throws his helmet, rallies his troops with the cry 'واإسلاماه', and leads the devastating counterattack.",
      actions: [
        // Camera focuses on Qutuz's reserve
        {
          type: 'camera_move',
          params: { x: 650, y: 750, zoom: 0.8, duration: 1.5 },
          delay: 0,
        },
        // Qutuz charges
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-qutuz-reserve',
          params: { behavior: 'advancing' },
          delay: 1.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'mamluk-qutuz-reserve',
          params: { formation: 'wedge' },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-qutuz-reserve',
          params: { position: { x: 650, y: 500 }, speed: 100 },
          delay: 2,
        },
        // Infantry advances
        {
          type: 'set_behavior',
          targetUnitId: 'mamluk-infantry',
          params: { behavior: 'advancing' },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-infantry',
          params: { position: { x: 650, y: 600 }, speed: 60 },
          delay: 3,
        },
        // Camera follows Qutuz's charge
        {
          type: 'camera_move',
          params: { x: 650, y: 500, zoom: 0.7, duration: 2 },
          delay: 3.5,
        },
        // Qutuz attacks Mongol cavalry
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-qutuz-reserve',
          params: { targetId: 'mongol-cavalry' },
          delay: 5,
        },
        // Mamluk cavalry joins the attack
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-cavalry',
          params: { targetId: 'mongol-archers' },
          delay: 5.5,
        },
        // Wings close in tighter
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-right-wing',
          params: { position: { x: 500, y: 400 }, speed: 80 },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-left-wing',
          params: { position: { x: 800, y: 400 }, speed: 80 },
          delay: 6,
        },
        // Attack Kitbuqa's guard
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-left-wing',
          params: { targetId: 'mongol-kitbuqa-guard' },
          delay: 7,
        },
        // Mongol morale collapses
        {
          type: 'set_behavior',
          targetUnitId: 'mongol-cavalry',
          params: { behavior: 'retreating' },
          delay: 8,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'mongol-infantry',
          params: { behavior: 'retreating' },
          delay: 8.5,
        },
      ],
      triggers: [],
    },

    // Phase 5: The Decisive End (45-55s)
    {
      id: 'decisive-end',
      name: 'The Decisive End',
      nameAr: 'الحسم',
      startTime: 45,
      duration: 10,
      description: 'The Mongol army is routed and surrounded. Kitbuqa is killed. The first major Mongol defeat is complete.',
      actions: [
        // Camera zooms out for the rout
        {
          type: 'camera_move',
          params: { x: 650, y: 400, zoom: 0.4, duration: 2 },
          delay: 0,
        },
        // Mongols try to flee north
        {
          type: 'set_behavior',
          targetUnitId: 'mongol-right-wing',
          params: { behavior: 'retreating' },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mongol-right-wing',
          params: { position: { x: 300, y: 150 }, speed: 90 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mongol-cavalry',
          params: { position: { x: 650, y: 200 }, speed: 85 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mongol-infantry',
          params: { position: { x: 450, y: 180 }, speed: 70 },
          delay: 1.5,
        },
        // Kitbuqa stands and fights (refuses to flee)
        {
          type: 'set_behavior',
          targetUnitId: 'mongol-kitbuqa-guard',
          params: { behavior: 'holding' },
          delay: 1,
        },
        // Mamluks pursue
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { position: { x: 650, y: 300 }, speed: 95 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'mamluk-qutuz-reserve',
          params: { position: { x: 650, y: 350 }, speed: 90 },
          delay: 2.5,
        },
        // Attack fleeing Mongols
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-baybars-vanguard',
          params: { targetId: 'mongol-cavalry' },
          delay: 4,
        },
        // Kitbuqa's guard is destroyed
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-left-wing',
          params: { targetId: 'mongol-kitbuqa-guard' },
          delay: 4.5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'mamluk-right-wing',
          params: { targetId: 'mongol-kitbuqa-guard' },
          delay: 5,
        },
        // Kitbuqa killed
        {
          type: 'destroy_unit',
          targetUnitId: 'mongol-kitbuqa-guard',
          params: {},
          delay: 7,
        },
        // Final camera — victory overview
        {
          type: 'camera_move',
          params: { x: 650, y: 450, zoom: 0.35, duration: 3 },
          delay: 7,
        },
        // Remaining Mongols destroyed/routed
        {
          type: 'destroy_unit',
          targetUnitId: 'mongol-right-wing',
          params: {},
          delay: 8,
        },
      ],
      triggers: [],
    },
  ],

  // ─── Narration ──────────────────────────────────────────────────────────────
  narration: [
    {
      id: 'intro',
      time: 0,
      duration: 5,
      text: 'The Mongol horde that destroyed Baghdad and conquered Damascus now faces the Mamluk army at Ain Jalut — the fate of the Muslim world hangs in the balance.',
      textAr:
        'جحافل المغول التي دمّرت بغداد وسقطت دمشق أمامها تواجه الآن جيش المماليك في عين جالوت — مصير العالم الإسلامي معلّق بهذه المعركة.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'baybars-lure',
      time: 5,
      duration: 4,
      text: "Baybars leads his vanguard forward, engaging the Mongols briefly before executing a masterful feigned retreat — the trap is set.",
      textAr:
        'يتقدم بيبرس بمقدمته ويشتبك مع المغول ثم ينفذ انسحاباً تكتيكياً بارعاً — الفخ يُنصب بإتقان.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'mongol-pursuit',
      time: 11,
      duration: 5,
      text: 'The Mongols, confident in their invincibility, pursue Baybars deep into the valley between the hills — unaware of the death trap awaiting them.',
      textAr:
        'المغول الواثقون من أنهم لا يُقهرون يطاردون بيبرس في عمق الوادي بين التلال — غافلين عن فخ الموت الذي ينتظرهم.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'ambush-springs',
      time: 22,
      duration: 5,
      text: 'The hills come alive! Hidden Mamluk cavalry charges from both flanks, slamming into the Mongol sides. The trap is sprung!',
      textAr:
        'التلال تنبض بالحياة! فرسان المماليك المختبئون ينقضّون من الجناحين على أجناب المغول. الكمين يُطبق!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'qutuz-rallying-cry',
      time: 35,
      duration: 5,
      text: 'Sultan Qutuz throws his helmet, raises his sword and thunders: "واإسلاماه!" — his reserve force charges like a tidal wave into the Mongol center.',
      textAr:
        'يلقي السلطان قطز خوذته ويرفع سيفه صارخاً: "واإسلاماه!" — قواته الاحتياطية تنطلق كالسيل الجارف في قلب المغول.',
      position: 'center',
      style: 'quote',
    },
    {
      id: 'mongol-collapse',
      time: 41,
      duration: 4,
      text: 'The Mongol army, surrounded and leaderless, collapses. For the first time in history, the "invincible" Mongol war machine is shattered.',
      textAr:
        'جيش المغول المحاصر بلا قيادة ينهار. لأول مرة في التاريخ، آلة الحرب المغولية "التي لا تُقهر" تتحطم.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'kitbuqa-killed',
      time: 46,
      duration: 4,
      text: 'Kitbuqa refuses to flee and fights to the death. His guard is annihilated. The Mongol rout is complete.',
      textAr:
        'كتبغا يرفض الفرار ويقاتل حتى الموت. حرسه يُباد عن آخره. هزيمة المغول تامة وساحقة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'victory',
      time: 51,
      duration: 4,
      text: 'A decisive victory that changed history. Ain Jalut proved the Mongols could be defeated and saved the Muslim world from annihilation.',
      textAr:
        'نصر حاسم غيّر مجرى التاريخ. عين جالوت أثبتت أن المغول يمكن هزيمتهم وأنقذت العالم الإسلامي من الفناء.',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    {
      time: 0,
      position: { x: 650, y: 475 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 3,
      position: { x: 650, y: 350 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'follow',
      followEntityId: 'mamluk-baybars-vanguard',
    },
    {
      time: 7,
      position: { x: 650, y: 450 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 11,
      position: { x: 650, y: 400 },
      zoom: 0.6,
      duration: 2.5,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 16,
      position: { x: 650, y: 450 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 22,
      position: { x: 650, y: 450 },
      zoom: 0.45,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 27,
      position: { x: 650, y: 430 },
      zoom: 0.55,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 35,
      position: { x: 650, y: 750 },
      zoom: 0.8,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 38,
      position: { x: 650, y: 500 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'follow',
      followEntityId: 'mamluk-qutuz-reserve',
    },
    {
      time: 42,
      position: { x: 650, y: 400 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 46,
      position: { x: 850, y: 400 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 50,
      position: { x: 650, y: 450 },
      zoom: 0.35,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    victor: 'muslim',
    muslimCasualties: 1500,
    enemyCasualties: 10000,
    summary:
      "Decisive Mamluk victory. The Mongol army was routed and Kitbuqa was killed. This was the first major defeat of the Mongol Empire and halted their westward expansion into Africa and the rest of the Muslim world.",
    summaryAr:
      'نصر حاسم للمماليك. هُزم جيش المغول وقُتل كتبغا. كانت هذه أول هزيمة كبرى للإمبراطورية المغولية وأوقفت توسعهم غرباً نحو أفريقيا وبقية العالم الإسلامي.',
    significance:
      "First major Mongol defeat in history. Proved the Mongols were not invincible. Saved Egypt, North Africa, and the remaining Muslim lands from Mongol conquest. Established the Mamluk Sultanate as the dominant power in the region. Baybars later became Sultan and expanded Mamluk territory significantly.",
  },

  totalDuration: 55,
};
