import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Yarmouk - 15-20 Rajab 15 AH (August 636 CE)
 *
 * One of the most decisive battles in world history.
 * The Muslim army under Khalid ibn al-Walid destroyed the Byzantine
 * army near the Yarmouk River, ending Byzantine rule in the Levant permanently.
 *
 * This scenario focuses on Day 6 — the decisive day — compressed to 50 seconds.
 */
export const battleOfYarmouk: BattleScenario = {
  id: 'battle-of-yarmouk',
  name: 'Battle of Yarmouk',
  nameAr: 'معركة اليرموك',
  date: '15-20 Rajab 15 AH (August 636 CE)',
  location: 'Plains near the Yarmouk River, south of modern-day Syria',
  description:
    'One of the most decisive battles in history. The Muslim army, vastly outnumbered, destroyed the Byzantine forces through brilliant cavalry tactics by Khalid ibn al-Walid. The Byzantines were trapped between the Muslim army and the Yarmouk ravine, suffering catastrophic losses.',
  descriptionAr:
    'واحدة من أكثر المعارك حسماً في التاريخ. دمّر الجيش الإسلامي، رغم قلة عدده، القوات البيزنطية بفضل تكتيكات الفرسان البارعة لخالد بن الوليد. حوصر البيزنطيون بين الجيش الإسلامي ووادي اليرموك، وتكبدوا خسائر كارثية.',

  map: {
    width: 1400, // world units — slightly larger for this epic battle
    height: 1000,
    terrain: [
      // Main battlefield (open plains)
      {
        id: 'main-plains',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1400, y: 0 },
          { x: 1400, y: 800 },
          { x: 0, y: 800 },
        ],
        color: 0x4a6741,
      },
      // Yarmouk River/Ravine at the bottom (south) — the death trap
      {
        id: 'yarmouk-ravine',
        type: 'rocky',
        polygon: [
          { x: 0, y: 850 },
          { x: 1400, y: 850 },
          { x: 1400, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x1a3a5c,
        label: 'Yarmouk Ravine',
      },
      // Ravine edge (transitional zone)
      {
        id: 'ravine-edge',
        type: 'rocky',
        polygon: [
          { x: 0, y: 800 },
          { x: 1400, y: 800 },
          { x: 1400, y: 850 },
          { x: 0, y: 850 },
        ],
        color: 0x3d4f3a,
      },
      // Rolling hills on the left flank (west)
      {
        id: 'hills-west',
        type: 'elevated',
        polygon: [
          { x: 0, y: 200 },
          { x: 120, y: 200 },
          { x: 120, y: 600 },
          { x: 0, y: 600 },
        ],
        color: 0x5a7a50,
      },
      // Rolling hills on the right flank (east)
      {
        id: 'hills-east',
        type: 'elevated',
        polygon: [
          { x: 1280, y: 200 },
          { x: 1400, y: 200 },
          { x: 1400, y: 600 },
          { x: 1280, y: 600 },
        ],
        color: 0x5a7a50,
      },
      // Bridge area (southeast) — the escape route to be cut
      {
        id: 'bridge-area',
        type: 'flat',
        polygon: [
          { x: 1100, y: 830 },
          { x: 1200, y: 830 },
          { x: 1200, y: 900 },
          { x: 1100, y: 900 },
        ],
        color: 0x6b5a3e,
        label: 'Bridge',
      },
    ],
    landmarks: [
      {
        id: 'muslim-camp',
        position: { x: 150, y: 80 },
        type: 'camp',
        label: 'Muslim Camp',
        labelAr: 'معسكر المسلمين',
      },
      {
        id: 'byzantine-camp',
        position: { x: 1250, y: 100 },
        type: 'camp',
        label: 'Byzantine Camp',
        labelAr: 'معسكر الروم',
      },
      {
        id: 'yarmouk-bridge',
        position: { x: 1150, y: 870 },
        type: 'marker',
        label: 'Yarmouk Bridge',
        labelAr: 'جسر اليرموك',
      },
      {
        id: 'ravine-marker',
        position: { x: 700, y: 920 },
        type: 'marker',
        label: 'Yarmouk Gorge',
        labelAr: 'وادي اليرموك',
      },
      {
        id: 'hill-west',
        position: { x: 60, y: 400 },
        type: 'hill',
        label: 'Western Hills',
        labelAr: 'التلال الغربية',
      },
      {
        id: 'hill-east',
        position: { x: 1340, y: 400 },
        type: 'hill',
        label: 'Eastern Hills',
        labelAr: 'التلال الشرقية',
      },
    ],
    backgroundColor: 0x2e3d28,
  },

  forces: [
    // ─── MUSLIM FORCES (~30,000 soldiers) ─────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 30000,
      units: [
        {
          id: 'muslim-right-wing',
          name: 'Muslim Right Wing (Amr ibn al-As)',
          nameAr: 'الميمنة - عمرو بن العاص',
          troopType: 'infantry',
          soldierCount: 180,
          commander: 'Amr ibn al-As',
          startPosition: { x: 550, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI / 2, // facing south (toward Byzantines)
          stats: { attack: 7, defense: 7, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-center-right',
          name: 'Muslim Center-Right (Shurahbil)',
          nameAr: 'يمين القلب - شرحبيل بن حسنة',
          troopType: 'infantry',
          soldierCount: 180,
          commander: 'Shurahbil ibn Hasana',
          startPosition: { x: 420, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-center-left',
          name: 'Muslim Center-Left (Yazid)',
          nameAr: 'يسار القلب - يزيد بن أبي سفيان',
          troopType: 'infantry',
          soldierCount: 180,
          commander: 'Yazid ibn Abi Sufyan',
          startPosition: { x: 300, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 7, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-left-wing',
          name: 'Muslim Left Wing (Abu Ubayda)',
          nameAr: 'الميسرة - أبو عبيدة بن الجراح',
          troopType: 'infantry',
          soldierCount: 180,
          commander: 'Abu Ubayda ibn al-Jarrah',
          startPosition: { x: 180, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 8, speed: 5, morale: 9 },
        },
        {
          id: 'khalid-cavalry',
          name: "Khalid's Mobile Guard",
          nameAr: 'فرسان خالد بن الوليد',
          troopType: 'cavalry',
          soldierCount: 150,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 400, y: 250 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 10, defense: 7, speed: 10, morale: 10 },
        },
        {
          id: 'muslim-archers',
          name: 'Muslim Archers',
          nameAr: 'الرماة',
          troopType: 'archers',
          soldierCount: 100,
          commander: undefined,
          startPosition: { x: 400, y: 300 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 4, speed: 5, morale: 8 },
        },
        {
          id: 'muslim-camp-women',
          name: 'Muslim Camp (Women)',
          nameAr: 'المعسكر - النساء',
          troopType: 'reserves',
          soldierCount: 50,
          commander: 'Hind bint Utbah',
          startPosition: { x: 150, y: 120 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 3, defense: 5, speed: 3, morale: 10 },
        },
        {
          id: 'khalid-bridge-detachment',
          name: "Khalid's Bridge Detachment",
          nameAr: 'مفرزة الجسر',
          troopType: 'cavalry',
          soldierCount: 60,
          commander: undefined,
          startPosition: { x: 400, y: 250 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 10 },
        },
      ],
    },
    // ─── BYZANTINE FORCES (~120,000 soldiers) ────────────────────────────────────
    {
      faction: 'byzantine',
      label: 'Byzantine Forces',
      labelAr: 'جيش الروم',
      totalStrength: 120000,
      units: [
        {
          id: 'byzantine-center',
          name: 'Byzantine Center (Vahan)',
          nameAr: 'قلب الروم - فاهان',
          troopType: 'command',
          soldierCount: 200,
          commander: 'Vahan',
          startPosition: { x: 700, y: 600 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north (toward Muslims)
          stats: { attack: 7, defense: 8, speed: 4, morale: 7 },
        },
        {
          id: 'byzantine-left-wing',
          name: 'Byzantine Left Wing',
          nameAr: 'ميسرة الروم',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Theodore Trithyrius',
          startPosition: { x: 500, y: 620 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 4, morale: 6 },
        },
        {
          id: 'byzantine-right-wing',
          name: 'Byzantine Right Wing',
          nameAr: 'ميمنة الروم',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Jabalah ibn al-Aiham',
          startPosition: { x: 900, y: 620 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 5, morale: 6 },
        },
        {
          id: 'byzantine-heavy-cavalry-left',
          name: 'Byzantine Heavy Cavalry (Left)',
          nameAr: 'فرسان الروم الثقيلة - يسار',
          troopType: 'cavalry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 350, y: 650 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 7, morale: 7 },
        },
        {
          id: 'byzantine-heavy-cavalry-right',
          name: 'Byzantine Heavy Cavalry (Right)',
          nameAr: 'فرسان الروم الثقيلة - يمين',
          troopType: 'cavalry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 1050, y: 650 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 7, morale: 7 },
        },
        {
          id: 'byzantine-reserves',
          name: 'Byzantine Reserves',
          nameAr: 'احتياط الروم',
          troopType: 'reserves',
          soldierCount: 200,
          commander: undefined,
          startPosition: { x: 700, y: 720 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 6, defense: 7, speed: 4, morale: 5 },
        },
        {
          id: 'byzantine-archers',
          name: 'Byzantine Archers',
          nameAr: 'رماة الروم',
          troopType: 'archers',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 700, y: 560 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 4, speed: 4, morale: 6 },
        },
        {
          id: 'ghassanid-auxiliaries',
          name: 'Ghassanid Auxiliaries',
          nameAr: 'الغساسنة',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: 'Jabalah ibn al-Aiham',
          startPosition: { x: 1050, y: 580 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 7, morale: 5 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total ~50 seconds of simulation time) ──────────────────
  phases: [
    // Phase 1: Lines Form (0-8s)
    {
      id: 'lines-form',
      name: 'Lines Form',
      nameAr: 'تشكيل الصفوف',
      startTime: 0,
      duration: 8,
      description: 'Both massive armies deploy facing each other across the plain.',
      actions: [
        // Camera overview of the battlefield
        {
          type: 'camera_move',
          params: { x: 700, y: 500, zoom: 0.4, duration: 3 },
          delay: 0,
        },
        // Muslim forces advance slightly to battle positions
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 550, y: 400 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center-right',
          params: { position: { x: 420, y: 400 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center-left',
          params: { position: { x: 300, y: 400 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 180, y: 400 }, speed: 50 },
          delay: 2,
        },
        // Byzantine forces advance to battle positions
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-center',
          params: { position: { x: 700, y: 550 }, speed: 45 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-left-wing',
          params: { position: { x: 500, y: 560 }, speed: 45 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-right-wing',
          params: { position: { x: 900, y: 560 }, speed: 45 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-archers',
          params: { position: { x: 700, y: 500 }, speed: 40 },
          delay: 3,
        },
      ],
      triggers: [],
    },

    // Phase 2: Byzantine Advance (8-18s)
    {
      id: 'byzantine-advance',
      name: 'Byzantine Advance',
      nameAr: 'تقدم الروم',
      startTime: 8,
      duration: 10,
      description:
        'The massive Byzantine army pushes forward. Their heavy cavalry breaks the Muslim left wing.',
      actions: [
        // Full Byzantine advance
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-center',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-center',
          params: { position: { x: 500, y: 470 }, speed: 70 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-left-wing',
          params: { position: { x: 350, y: 470 }, speed: 70 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-right-wing',
          params: { position: { x: 700, y: 470 }, speed: 65 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-archers',
          params: { position: { x: 500, y: 430 }, speed: 60 },
          delay: 1,
        },
        // Byzantine heavy cavalry charges Muslim left wing
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-heavy-cavalry-left',
          params: { behavior: 'attacking' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-heavy-cavalry-left',
          params: { formation: 'wedge' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-heavy-cavalry-left',
          params: { position: { x: 180, y: 400 }, speed: 130 },
          delay: 2.5,
        },
        // Attack Muslim left wing
        {
          type: 'attack_unit',
          targetUnitId: 'byzantine-heavy-cavalry-left',
          params: { targetId: 'muslim-left-wing' },
          delay: 4,
        },
        // Muslim left wing breaks and retreats
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-left-wing',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-left-wing',
          params: { formation: 'scattered' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 150, y: 180 }, speed: 90 },
          delay: 6.5,
        },
        // Camera follows the cavalry charge
        {
          type: 'camera_move',
          params: { x: 300, y: 420, zoom: 0.8, duration: 2 },
          delay: 2,
        },
        // General engagement on the line
        {
          type: 'attack_unit',
          targetUnitId: 'byzantine-center',
          params: { targetId: 'muslim-center-right' },
          delay: 5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'byzantine-left-wing',
          params: { targetId: 'muslim-center-left' },
          delay: 5.5,
        },
      ],
      triggers: [],
    },

    // Phase 3: Rally & Khalid's Maneuver (18-30s)
    {
      id: 'rally-and-maneuver',
      name: "Rally & Khalid's Maneuver",
      nameAr: 'التجمع ومناورة خالد',
      startTime: 18,
      duration: 12,
      description:
        "Women in the camp rally retreating soldiers. Khalid takes his cavalry reserve on a wide flanking ride behind Byzantine lines.",
      actions: [
        // Women rally the retreaters — camp unit moves toward retreating left wing
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-camp-women',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-camp-women',
          params: { position: { x: 150, y: 180 }, speed: 40 },
          delay: 0,
        },
        // Left wing rallies — reforms
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-left-wing',
          params: { behavior: 'regrouping' },
          delay: 3,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-left-wing',
          params: { formation: 'line' },
          delay: 3.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 180, y: 400 }, speed: 70 },
          delay: 4,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-left-wing',
          params: { behavior: 'advancing' },
          delay: 5,
        },
        // Khalid's cavalry begins wide flanking maneuver
        // First moves east behind Muslim lines
        {
          type: 'set_behavior',
          targetUnitId: 'khalid-cavalry',
          params: { behavior: 'flanking' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'khalid-cavalry',
          params: { formation: 'column' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-cavalry',
          params: { position: { x: 800, y: 200 }, speed: 150 },
          delay: 2.5,
        },
        // Then swings south-east around the Byzantine right flank
        {
          type: 'move_unit',
          targetUnitId: 'khalid-cavalry',
          params: { position: { x: 1200, y: 400 }, speed: 150 },
          delay: 5,
        },
        // Then rides behind Byzantine lines (south)
        {
          type: 'move_unit',
          targetUnitId: 'khalid-cavalry',
          params: { position: { x: 1100, y: 650 }, speed: 140 },
          delay: 8,
        },
        // Bridge detachment splits off toward the bridge
        {
          type: 'set_behavior',
          targetUnitId: 'khalid-bridge-detachment',
          params: { behavior: 'flanking' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'khalid-bridge-detachment',
          params: { formation: 'column' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-bridge-detachment',
          params: { position: { x: 800, y: 200 }, speed: 140 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-bridge-detachment',
          params: { position: { x: 1200, y: 500 }, speed: 140 },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-bridge-detachment',
          params: { position: { x: 1150, y: 850 }, speed: 130 },
          delay: 9,
        },
        // Camera follows Khalid's ride
        {
          type: 'camera_move',
          params: { x: 400, y: 300, zoom: 0.7, duration: 2 },
          delay: 0,
        },
        {
          type: 'camera_move',
          params: { x: 800, y: 400, zoom: 0.5, duration: 3 },
          delay: 4,
        },
        // Muslim center holds firm
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center-right',
          params: { behavior: 'attacking' },
          delay: 3,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center-left',
          params: { behavior: 'attacking' },
          delay: 3,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-right-wing',
          params: { behavior: 'attacking' },
          delay: 3,
        },
        // Push back against Byzantines
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-center-right',
          params: { targetId: 'byzantine-center' },
          delay: 5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-right-wing',
          params: { targetId: 'byzantine-right-wing' },
          delay: 5.5,
        },
      ],
      triggers: [],
    },

    // Phase 4: Bridge Cut & Rear Charge (30-40s)
    {
      id: 'bridge-cut-rear-charge',
      name: 'Bridge Cut & Rear Charge',
      nameAr: 'قطع الجسر والهجوم من الخلف',
      startTime: 30,
      duration: 10,
      description:
        "Khalid's detachment cuts the bridge over the Yarmouk ravine. His main cavalry force charges into the Byzantine rear, causing panic.",
      actions: [
        // Bridge detachment arrives and "destroys" the bridge
        {
          type: 'set_behavior',
          targetUnitId: 'khalid-bridge-detachment',
          params: { behavior: 'holding' },
          delay: 0,
        },
        {
          type: 'change_formation',
          targetUnitId: 'khalid-bridge-detachment',
          params: { formation: 'defensive_circle' },
          delay: 0.5,
        },
        // Play effect for bridge destruction
        {
          type: 'play_effect',
          params: { effectType: 'dust', position: { x: 1150, y: 870 }, intensity: 1.0 },
          delay: 1,
        },
        // Khalid's main cavalry forms wedge for the devastating charge
        {
          type: 'change_formation',
          targetUnitId: 'khalid-cavalry',
          params: { formation: 'wedge' },
          delay: 2,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'khalid-cavalry',
          params: { behavior: 'attacking' },
          delay: 2.5,
        },
        // THE DEVASTATING REAR CHARGE
        {
          type: 'move_unit',
          targetUnitId: 'khalid-cavalry',
          params: { position: { x: 700, y: 600 }, speed: 180 },
          delay: 3,
        },
        // Attack Byzantine reserves from behind
        {
          type: 'attack_unit',
          targetUnitId: 'khalid-cavalry',
          params: { targetId: 'byzantine-reserves' },
          delay: 5,
        },
        // Byzantine reserves panic
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-reserves',
          params: { behavior: 'retreating' },
          delay: 5.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-reserves',
          params: { formation: 'scattered' },
          delay: 5.5,
        },
        // Panic spreads to Byzantine center
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-center',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        // Muslim infantry pushes forward
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center-right',
          params: { position: { x: 500, y: 550 }, speed: 80 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center-left',
          params: { position: { x: 350, y: 550 }, speed: 80 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 650, y: 550 }, speed: 80 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 200, y: 530 }, speed: 75 },
          delay: 5,
        },
        // Camera shows the rear charge
        {
          type: 'camera_move',
          params: { x: 900, y: 600, zoom: 0.7, duration: 2 },
          delay: 2,
        },
        {
          type: 'camera_move',
          params: { x: 700, y: 600, zoom: 0.6, duration: 2 },
          delay: 5,
        },
        // Ghassanid auxiliaries flee
        {
          type: 'set_behavior',
          targetUnitId: 'ghassanid-auxiliaries',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'change_formation',
          targetUnitId: 'ghassanid-auxiliaries',
          params: { formation: 'scattered' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ghassanid-auxiliaries',
          params: { position: { x: 1300, y: 800 }, speed: 110 },
          delay: 7.5,
        },
      ],
      triggers: [],
    },

    // Phase 5: Rout into the Ravine (40-50s)
    {
      id: 'rout-into-ravine',
      name: 'Rout into the Ravine',
      nameAr: 'الهزيمة في الوادي',
      startTime: 40,
      duration: 10,
      description:
        'Trapped between Muslim infantry and cavalry, with the ravine behind them and the bridge destroyed, the Byzantines are pushed into the gorge. Thousands fall to their deaths.',
      actions: [
        // All Byzantine units rout
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-center',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-left-wing',
          params: { behavior: 'retreating' },
          delay: 0.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-right-wing',
          params: { behavior: 'retreating' },
          delay: 0.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-heavy-cavalry-left',
          params: { behavior: 'retreating' },
          delay: 1,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-heavy-cavalry-right',
          params: { behavior: 'retreating' },
          delay: 1,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-archers',
          params: { behavior: 'retreating' },
          delay: 1.5,
        },
        // All scatter
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-center',
          params: { formation: 'scattered' },
          delay: 0.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-left-wing',
          params: { formation: 'scattered' },
          delay: 1,
        },
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-right-wing',
          params: { formation: 'scattered' },
          delay: 1,
        },
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-heavy-cavalry-left',
          params: { formation: 'scattered' },
          delay: 1.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-heavy-cavalry-right',
          params: { formation: 'scattered' },
          delay: 1.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'byzantine-archers',
          params: { formation: 'scattered' },
          delay: 2,
        },
        // Byzantines pushed toward the ravine (south)
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-center',
          params: { position: { x: 600, y: 880 }, speed: 90 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-left-wing',
          params: { position: { x: 400, y: 880 }, speed: 85 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-right-wing',
          params: { position: { x: 800, y: 880 }, speed: 85 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-reserves',
          params: { position: { x: 700, y: 900 }, speed: 80 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-heavy-cavalry-left',
          params: { position: { x: 300, y: 870 }, speed: 100 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-heavy-cavalry-right',
          params: { position: { x: 1000, y: 870 }, speed: 100 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-archers',
          params: { position: { x: 600, y: 890 }, speed: 75 },
          delay: 2.5,
        },
        // Muslim pursuit — push them into the ravine
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center-right',
          params: { behavior: 'pursuing' },
          delay: 2,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center-left',
          params: { behavior: 'pursuing' },
          delay: 2,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-right-wing',
          params: { behavior: 'pursuing' },
          delay: 2,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-left-wing',
          params: { behavior: 'pursuing' },
          delay: 2.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'khalid-cavalry',
          params: { behavior: 'pursuing' },
          delay: 1,
        },
        // Muslim forces advance toward ravine
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center-right',
          params: { position: { x: 500, y: 750 }, speed: 90 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center-left',
          params: { position: { x: 350, y: 750 }, speed: 90 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 650, y: 750 }, speed: 90 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 200, y: 750 }, speed: 85 },
          delay: 3.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-cavalry',
          params: { position: { x: 700, y: 780 }, speed: 130 },
          delay: 2,
        },
        // Dust effects at the ravine (units falling)
        {
          type: 'play_effect',
          params: { effectType: 'dust', position: { x: 600, y: 880 }, intensity: 1.0 },
          delay: 5,
        },
        {
          type: 'play_effect',
          params: { effectType: 'dust', position: { x: 800, y: 880 }, intensity: 1.0 },
          delay: 6,
        },
        {
          type: 'play_effect',
          params: { effectType: 'dust', position: { x: 400, y: 880 }, intensity: 1.0 },
          delay: 7,
        },
        // Destroy routed Byzantine units (fallen into ravine)
        {
          type: 'destroy_unit',
          targetUnitId: 'byzantine-reserves',
          params: {},
          delay: 7,
        },
        {
          type: 'destroy_unit',
          targetUnitId: 'byzantine-archers',
          params: {},
          delay: 8,
        },
        // Camera shows the catastrophic rout
        {
          type: 'camera_move',
          params: { x: 700, y: 800, zoom: 0.5, duration: 2 },
          delay: 0,
        },
        {
          type: 'camera_move',
          params: { x: 700, y: 850, zoom: 0.4, duration: 3 },
          delay: 5,
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
      duration: 6,
      text: 'The Battle of Yarmouk — Rajab 15 AH. The decisive day. Two great armies face each other on the plains above the Yarmouk gorge.',
      textAr:
        'معركة اليرموك — رجب ١٥ هـ. اليوم الحاسم الذي سيغيّر وجه التاريخ! جيشان عظيمان يتواجهان على سهول وادي اليرموك في مشهد يحبس الأنفاس.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'scale-narration',
      time: 5,
      duration: 4,
      text: '30,000 Muslims face over 100,000 Byzantines — the largest army the Romans have assembled in decades.',
      textAr:
        'ثلاثون ألف مسلم يقفون كالجبال أمام أكثر من مئة ألف من جنود الروم — أكبر جيش حشدته الإمبراطورية البيزنطية منذ عقود لسحق الإسلام.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'advance-narration',
      time: 9,
      duration: 4,
      text: 'The Byzantine army advances with overwhelming force. Their heavy cavalry smashes into the Muslim left wing.',
      textAr:
        'يتقدم الجيش البيزنطي بقوته الساحقة كالطوفان. فرسانهم المدرّعون بالحديد يحطمون الجناح الأيسر للمسلمين بهجوم مدمر.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'left-breaks-narration',
      time: 14,
      duration: 4,
      text: 'The Muslim left wing breaks! Soldiers flee toward the camp in disarray.',
      textAr:
        'ينكسر الجناح الأيسر تحت وطأة الهجوم! يفر الجنود نحو المعسكر في فوضى عارمة والرعب يملأ قلوبهم.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'women-rally-narration',
      time: 18,
      duration: 5,
      text: 'The women of the camp, led by Hind bint Utbah, beat the retreating soldiers with tent poles: "Where are you fleeing to? Back to the battlefield!"',
      textAr:
        'تخرج نساء المعسكر بقيادة هند بنت عتبة كاللبؤات الغاضبات، يضربن الفارين بأعمدة الخيام صارخات: "إلى أين تفرون؟ عودوا إلى المعركة!"',
      position: 'center',
      style: 'quote',
    },
    {
      id: 'khalid-maneuver-narration',
      time: 23,
      duration: 5,
      text: "Khalid ibn al-Walid — the Sword of Allah — takes his mobile cavalry reserve on a daring ride behind the entire Byzantine army.",
      textAr:
        'خالد بن الوليد — سيف الله المسلول — يقود فرسانه في مناورة عبقرية جريئة، يلتف بهم خلف الجيش البيزنطي بأكمله في حركة لم يتوقعها أحد!',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'bridge-cut-narration',
      time: 30,
      duration: 4,
      text: "Khalid's detachment seizes and destroys the bridge over the Yarmouk ravine — the Byzantines' only escape route is cut!",
      textAr:
        'مفرزة خالد تستولي على الجسر فوق وادي اليرموك وتدمره تدميراً — طريق هروب الروم الوحيد قُطع! أصبحوا محاصرين بين الجيش والهاوية!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'rear-charge-narration',
      time: 34,
      duration: 4,
      text: "Khalid's cavalry crashes into the Byzantine rear in a devastating wedge charge. Panic erupts in the Roman ranks!",
      textAr:
        'فرسان خالد ينقضّون على مؤخرة الروم في هجوم إسفيني مدمر كالصاعقة! الذعر والرعب يجتاحان صفوف الرومان كالوباء!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'trapped-narration',
      time: 40,
      duration: 4,
      text: 'Trapped! Muslim infantry from the front, cavalry from the rear, and the deadly ravine behind them. The Byzantines have nowhere to run.',
      textAr:
        'محاصرون من كل جانب! مشاة المسلمين يسحقونهم من الأمام، وفرسان خالد يمزقونهم من الخلف، ووادي اليرموك السحيق يفغر فاه خلفهم. لا مفر ولا ملجأ!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'ravine-narration',
      time: 44,
      duration: 4,
      text: 'Thousands of Byzantine soldiers are pushed into the Yarmouk gorge. The ravine becomes their grave.',
      textAr:
        'آلاف الجنود البيزنطيين يتساقطون في هاوية وادي اليرموك كأوراق الخريف. الوادي السحيق يبتلعهم ويصبح مقبرتهم الأبدية.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'victory-narration',
      time: 48,
      duration: 2,
      text: 'Total Muslim victory. Byzantine power in the Levant is shattered forever. One of the most decisive battles in world history.',
      textAr:
        'نصر إسلامي ساحق مدوٍّ! قوة الإمبراطورية البيزنطية في الشام تحطمت إلى الأبد. واحدة من أعظم المعارك وأكثرها حسماً في تاريخ البشرية.',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    {
      time: 0,
      position: { x: 700, y: 500 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 5,
      position: { x: 400, y: 400 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 8,
      position: { x: 500, y: 500 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 11,
      position: { x: 250, y: 420 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 15,
      position: { x: 180, y: 300 },
      zoom: 0.8,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 18,
      position: { x: 200, y: 180 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 21,
      position: { x: 600, y: 300 },
      zoom: 0.5,
      duration: 2.5,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 25,
      position: { x: 1000, y: 400 },
      zoom: 0.6,
      duration: 3,
      easing: 'power2.inOut',
      type: 'follow',
      followEntityId: 'khalid-cavalry',
    },
    {
      time: 30,
      position: { x: 1150, y: 850 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 33,
      position: { x: 900, y: 650 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'follow',
      followEntityId: 'khalid-cavalry',
    },
    {
      time: 37,
      position: { x: 700, y: 600 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 40,
      position: { x: 700, y: 750 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 44,
      position: { x: 600, y: 870 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 47,
      position: { x: 700, y: 700 },
      zoom: 0.35,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 3000,
    enemyCasualties: 50000,
    summary:
      'Catastrophic Byzantine defeat. The entire Byzantine army was destroyed — tens of thousands fell into the Yarmouk ravine or were killed on the field. This single battle ended Byzantine rule in the Levant permanently.',
    summaryAr:
      'هزيمة بيزنطية كارثية. دُمّر الجيش البيزنطي بالكامل — عشرات الآلاف سقطوا في وادي اليرموك أو قُتلوا في الميدان. هذه المعركة الواحدة أنهت حكم الروم في الشام إلى الأبد.',
    significance:
      'One of the most decisive battles in world history. Ended Byzantine control of the Levant permanently and opened the way for the Muslim conquest of Syria, Palestine, and Egypt. Demonstrated Khalid ibn al-Walid\'s genius as one of history\'s greatest military commanders.',
  },

  dayPhase: 'day',
  weather: 'dust',
  actualDayCount: 6,
  totalDuration: 50, // 50 seconds of simulation
};
