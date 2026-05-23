import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Khaybar - Muharram 7 AH (May/June 628 CE)
 *
 * A siege battle where the Muslim forces (~1,400-1,600) conquered the
 * fortress complex of Khaybar, ~150km north of Medina. The complex
 * consisted of 8 fortresses in 3 regions. After failed assaults by
 * Abu Bakr and Umar, Ali ibn Abi Talib was given the banner and
 * conquered the main fortress of al-Qamus, killing the Jewish champion
 * Marhab in single combat and tearing the fortress gate off its hinges.
 */
export const battleOfKhaybar: BattleScenario = {
  id: 'battle-of-khaybar',
  name: 'Battle of Khaybar',
  nameAr: 'غزوة خيبر',
  date: 'Muharram 7 AH (May/June 628 CE)',
  location: 'Khaybar oasis fortress complex, ~150km north of Medina',
  description:
    'The Muslim forces besieged the fortress complex of Khaybar. After failed assaults by Abu Bakr and Umar, Ali ibn Abi Talib was given the banner and conquered the main fortress of al-Qamus, killing the champion Marhab in single combat.',
  descriptionAr:
    'حاصر المسلمون حصون خيبر. بعد محاولات فاشلة من أبي بكر وعمر، أُعطي علي بن أبي طالب الراية ففتح حصن القموص الرئيسي وقتل البطل مرحب في مبارزة.',

  map: {
    width: 1200, // world units
    height: 900,
    terrain: [
      // Main battlefield (oasis terrain)
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
      // Na'im fortress zone (upper-left)
      {
        id: 'fortress-naim',
        type: 'elevated',
        polygon: [
          { x: 100, y: 120 },
          { x: 320, y: 120 },
          { x: 320, y: 300 },
          { x: 100, y: 300 },
        ],
        color: 0x5c4a3a,
        label: "Fortress of Na'im",
      },
      // Al-Sa'b fortress zone (upper-right)
      {
        id: 'fortress-sab',
        type: 'elevated',
        polygon: [
          { x: 880, y: 120 },
          { x: 1100, y: 120 },
          { x: 1100, y: 300 },
          { x: 880, y: 300 },
        ],
        color: 0x5c4a3a,
        label: "Fortress of al-Sa'b",
      },
      // Al-Qamus fortress zone (center-top — main objective)
      {
        id: 'fortress-qamus',
        type: 'elevated',
        polygon: [
          { x: 450, y: 50 },
          { x: 750, y: 50 },
          { x: 750, y: 250 },
          { x: 450, y: 250 },
        ],
        color: 0x6b4f3a,
        label: 'Fortress of al-Qamus',
      },
      // Rocky terrain between fortresses
      {
        id: 'rocky-center',
        type: 'rocky',
        polygon: [
          { x: 320, y: 250 },
          { x: 880, y: 250 },
          { x: 880, y: 420 },
          { x: 320, y: 420 },
        ],
        color: 0x4a3728,
      },
      // Palm groves (oasis) — left side
      {
        id: 'palm-grove-left',
        type: 'oasis',
        polygon: [
          { x: 50, y: 400 },
          { x: 250, y: 400 },
          { x: 250, y: 550 },
          { x: 50, y: 550 },
        ],
        color: 0x2e4a3e,
      },
      // Palm groves (oasis) — right side
      {
        id: 'palm-grove-right',
        type: 'oasis',
        polygon: [
          { x: 950, y: 400 },
          { x: 1150, y: 400 },
          { x: 1150, y: 550 },
          { x: 950, y: 550 },
        ],
        color: 0x2e4a3e,
      },
      // Muslim camp area (south)
      {
        id: 'camp-area',
        type: 'flat',
        polygon: [
          { x: 300, y: 700 },
          { x: 900, y: 700 },
          { x: 900, y: 880 },
          { x: 300, y: 880 },
        ],
        color: 0x2c1810,
      },
    ],
    landmarks: [
      {
        id: 'muslim-camp',
        position: { x: 600, y: 800 },
        type: 'camp',
        label: 'Muslim Camp',
        labelAr: 'معسكر المسلمين',
      },
      {
        id: 'naim-fortress',
        position: { x: 210, y: 200 },
        type: 'marker',
        label: "Na'im Fortress",
        labelAr: 'حصن نعيم',
      },
      {
        id: 'sab-fortress',
        position: { x: 990, y: 200 },
        type: 'marker',
        label: "Al-Sa'b Fortress",
        labelAr: 'حصن الصعب',
      },
      {
        id: 'qamus-fortress',
        position: { x: 600, y: 150 },
        type: 'marker',
        label: 'Al-Qamus Fortress',
        labelAr: 'حصن القموص',
      },
      {
        id: 'palm-oasis-left',
        position: { x: 150, y: 475 },
        type: 'oasis',
        label: 'Palm Groves',
        labelAr: 'بساتين النخيل',
      },
      {
        id: 'palm-oasis-right',
        position: { x: 1050, y: 475 },
        type: 'oasis',
        label: 'Palm Groves',
        labelAr: 'بساتين النخيل',
      },
      {
        id: 'rocky-pass',
        position: { x: 600, y: 350 },
        type: 'mountain_pass',
        label: 'Rocky Pass',
        labelAr: 'الممر الصخري',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  forces: [
    // ─── MUSLIM FORCES (~1,400-1,600 soldiers) ─────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 1500,
      units: [
        {
          id: 'muslim-command',
          name: 'Prophet\'s Command',
          nameAr: 'قيادة النبي ﷺ',
          troopType: 'command',
          soldierCount: 200,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 600, y: 780 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north (toward fortresses)
          stats: { attack: 7, defense: 8, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-abubakr',
          name: "Abu Bakr's Force",
          nameAr: 'قوة أبي بكر',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Abu Bakr al-Siddiq',
          startPosition: { x: 450, y: 750 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-umar',
          name: "Umar's Force",
          nameAr: 'قوة عمر',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Umar ibn al-Khattab',
          startPosition: { x: 750, y: 750 },
          startFormation: 'column',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-ali',
          name: "Ali's Assault Force",
          nameAr: 'قوة علي',
          troopType: 'infantry',
          soldierCount: 300,
          commander: 'Ali ibn Abi Talib',
          startPosition: { x: 600, y: 720 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 10, defense: 8, speed: 7, morale: 10 },
        },
        {
          id: 'muslim-cavalry-left',
          name: 'Muslim Cavalry (Left)',
          nameAr: 'فرسان المسلمين (يسار)',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: 'Zubayr ibn al-Awwam',
          startPosition: { x: 350, y: 800 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 9 },
        },
        {
          id: 'muslim-cavalry-right',
          name: 'Muslim Cavalry (Right)',
          nameAr: 'فرسان المسلمين (يمين)',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: undefined,
          startPosition: { x: 850, y: 800 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 9 },
        },
        {
          id: 'muslim-archers',
          name: 'Muslim Archers',
          nameAr: 'رماة المسلمين',
          troopType: 'archers',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 600, y: 850 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 4, speed: 5, morale: 8 },
        },
        {
          id: 'muslim-reserves',
          name: 'Muslim Reserves',
          nameAr: 'احتياط المسلمين',
          troopType: 'reserves',
          soldierCount: 250,
          commander: undefined,
          startPosition: { x: 600, y: 870 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 5, morale: 8 },
        },
      ],
    },
    // ─── JEWISH FORCES (~2,000 warriors defending fortresses) ──────────────────
    {
      faction: 'quraysh', // using 'quraysh' as the enemy faction type
      label: 'Jewish Defenders of Khaybar',
      labelAr: 'مدافعو خيبر',
      totalStrength: 2000,
      units: [
        {
          id: 'jewish-naim-garrison',
          name: "Na'im Garrison",
          nameAr: 'حامية نعيم',
          troopType: 'infantry',
          soldierCount: 300,
          commander: 'al-Harith ibn Abu Zaynab',
          startPosition: { x: 210, y: 210 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2, // facing south (toward Muslims)
          stats: { attack: 6, defense: 8, speed: 4, morale: 7 },
        },
        {
          id: 'jewish-sab-garrison',
          name: "Al-Sa'b Garrison",
          nameAr: 'حامية الصعب',
          troopType: 'infantry',
          soldierCount: 300,
          commander: undefined,
          startPosition: { x: 990, y: 210 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 8, speed: 4, morale: 7 },
        },
        {
          id: 'jewish-qamus-garrison',
          name: 'Al-Qamus Garrison (Marhab)',
          nameAr: 'حامية القموص (مرحب)',
          troopType: 'infantry',
          soldierCount: 500,
          commander: 'Marhab',
          startPosition: { x: 600, y: 150 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 9, speed: 4, morale: 8 },
        },
        {
          id: 'jewish-qamus-archers',
          name: 'Al-Qamus Archers',
          nameAr: 'رماة القموص',
          troopType: 'archers',
          soldierCount: 200,
          commander: undefined,
          startPosition: { x: 600, y: 100 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 3, morale: 7 },
        },
        {
          id: 'jewish-reserves',
          name: 'Jewish Reserves',
          nameAr: 'الاحتياط',
          troopType: 'reserves',
          soldierCount: 400,
          commander: 'Kinana ibn al-Rabi',
          startPosition: { x: 600, y: 320 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 5, defense: 6, speed: 5, morale: 6 },
        },
        {
          id: 'jewish-sortie-force',
          name: 'Sortie Force',
          nameAr: 'قوة الإغارة',
          troopType: 'cavalry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 450, y: 280 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 5, speed: 7, morale: 6 },
        },
        {
          id: 'jewish-naim-archers',
          name: "Na'im Archers",
          nameAr: 'رماة نعيم',
          troopType: 'archers',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 210, y: 160 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 3, morale: 6 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total ~50 seconds of simulation time) ──────────────────
  phases: [
    // Phase 1: Siege Deployment (0-8s)
    {
      id: 'siege-deployment',
      name: 'Siege Deployment',
      nameAr: 'نشر الحصار',
      startTime: 0,
      duration: 8,
      description: 'Muslims arrive and set up camp facing the fortress complex.',
      actions: [
        // Camera overview of the fortress complex
        {
          type: 'camera_move',
          params: { x: 600, y: 450, zoom: 0.5, duration: 3 },
          delay: 0,
        },
        // Muslim forces advance from camp toward siege positions
        {
          type: 'move_unit',
          targetUnitId: 'muslim-command',
          params: { position: { x: 600, y: 650 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-abubakr',
          params: { position: { x: 350, y: 600 }, speed: 50 },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-umar',
          params: { position: { x: 850, y: 600 }, speed: 50 },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ali',
          params: { position: { x: 600, y: 620 }, speed: 50 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-archers',
          params: { position: { x: 600, y: 680 }, speed: 45 },
          delay: 3,
        },
        // Cavalry takes flanking positions
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-left',
          params: { position: { x: 200, y: 600 }, speed: 70 },
          delay: 3.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-right',
          params: { position: { x: 1000, y: 600 }, speed: 70 },
          delay: 3.5,
        },
      ],
      triggers: [],
    },

    // Phase 2: Initial Assaults — Abu Bakr & Umar repelled (8-18s)
    {
      id: 'initial-assaults',
      name: 'Initial Assaults (Repelled)',
      nameAr: 'الهجمات الأولى (صُدّت)',
      startTime: 8,
      duration: 10,
      description: "Abu Bakr then Umar attempt assaults on the outer fortresses — both are repelled.",
      actions: [
        // Abu Bakr advances toward Na'im fortress
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-abubakr',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-abubakr',
          params: { position: { x: 250, y: 350 }, speed: 80 },
          delay: 0,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-abubakr',
          params: { formation: 'wedge' },
          delay: 0.5,
        },
        // Camera focuses on Abu Bakr's assault
        {
          type: 'camera_move',
          params: { x: 250, y: 300, zoom: 1.0, duration: 1.5 },
          delay: 0.5,
        },
        // Na'im garrison engages — repels Abu Bakr
        {
          type: 'attack_unit',
          targetUnitId: 'jewish-naim-garrison',
          params: { targetId: 'muslim-abubakr' },
          delay: 2,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'jewish-naim-archers',
          params: { targetId: 'muslim-abubakr' },
          delay: 2.5,
        },
        // Jewish sortie force counter-attacks
        {
          type: 'move_unit',
          targetUnitId: 'jewish-sortie-force',
          params: { position: { x: 300, y: 380 }, speed: 90 },
          delay: 3,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'jewish-sortie-force',
          params: { targetId: 'muslim-abubakr' },
          delay: 3.5,
        },
        // Abu Bakr repelled — retreats
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-abubakr',
          params: { behavior: 'retreating' },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-abubakr',
          params: { position: { x: 350, y: 600 }, speed: 70 },
          delay: 4.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-abubakr',
          params: { formation: 'column' },
          delay: 4.5,
        },
        // Sortie force returns to position
        {
          type: 'move_unit',
          targetUnitId: 'jewish-sortie-force',
          params: { position: { x: 450, y: 280 }, speed: 80 },
          delay: 5,
        },

        // --- Umar's assault (starts at delay 5) ---
        // Umar advances toward al-Sa'b fortress
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-umar',
          params: { behavior: 'advancing' },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-umar',
          params: { position: { x: 950, y: 350 }, speed: 80 },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-umar',
          params: { formation: 'wedge' },
          delay: 5.5,
        },
        // Camera pans to Umar's assault
        {
          type: 'camera_move',
          params: { x: 950, y: 300, zoom: 1.0, duration: 1.5 },
          delay: 5.5,
        },
        // Al-Sa'b garrison engages — repels Umar
        {
          type: 'attack_unit',
          targetUnitId: 'jewish-sab-garrison',
          params: { targetId: 'muslim-umar' },
          delay: 7,
        },
        // Umar repelled — retreats
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-umar',
          params: { behavior: 'retreating' },
          delay: 8.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-umar',
          params: { position: { x: 750, y: 600 }, speed: 70 },
          delay: 9,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-umar',
          params: { formation: 'column' },
          delay: 9,
        },
      ],
      triggers: [],
    },

    // Phase 3: Ali's Banner (18-28s)
    {
      id: 'ali-banner',
      name: "Ali's Banner",
      nameAr: 'راية علي',
      startTime: 18,
      duration: 10,
      description: "The Prophet ﷺ gives the banner to Ali. Ali leads the assault force toward al-Qamus.",
      actions: [
        // Camera focuses on Muslim camp (the declaration)
        {
          type: 'camera_move',
          params: { x: 600, y: 600, zoom: 0.9, duration: 2 },
          delay: 0,
        },
        // Ali's force changes to assault formation
        {
          type: 'change_formation',
          targetUnitId: 'muslim-ali',
          params: { formation: 'wedge' },
          delay: 2,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-ali',
          params: { behavior: 'advancing' },
          delay: 2.5,
        },
        // Ali advances toward al-Qamus
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ali',
          params: { position: { x: 600, y: 400 }, speed: 70 },
          delay: 3,
        },
        // Camera follows Ali's advance
        {
          type: 'camera_move',
          params: { x: 600, y: 400, zoom: 0.8, duration: 2 },
          delay: 3,
        },
        // Supporting forces advance
        {
          type: 'move_unit',
          targetUnitId: 'muslim-archers',
          params: { position: { x: 600, y: 500 }, speed: 55 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-left',
          params: { position: { x: 300, y: 450 }, speed: 90 },
          delay: 4.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-right',
          params: { position: { x: 900, y: 450 }, speed: 90 },
          delay: 4.5,
        },
        // Ali continues advance toward fortress
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ali',
          params: { position: { x: 600, y: 300 }, speed: 80 },
          delay: 6,
        },
        // Jewish defenders prepare
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-qamus-garrison',
          params: { behavior: 'holding' },
          delay: 7,
        },
        // Jewish reserves move to reinforce al-Qamus
        {
          type: 'move_unit',
          targetUnitId: 'jewish-reserves',
          params: { position: { x: 600, y: 250 }, speed: 60 },
          delay: 7.5,
        },
        // Camera zooms in on the approach to al-Qamus
        {
          type: 'camera_move',
          params: { x: 600, y: 250, zoom: 1.1, duration: 2 },
          delay: 8,
        },
      ],
      triggers: [],
    },

    // Phase 4: Marhab's Duel & Gate (28-38s)
    {
      id: 'marhab-duel',
      name: "Marhab's Duel & The Gate",
      nameAr: 'مبارزة مرحب والباب',
      startTime: 28,
      duration: 10,
      description: "Ali defeats Marhab in single combat and tears the fortress gate off its hinges.",
      actions: [
        // Camera focuses tightly on the duel area
        {
          type: 'camera_move',
          params: { x: 600, y: 220, zoom: 1.3, duration: 1.5 },
          delay: 0,
        },
        // Ali engages Marhab's garrison (the duel)
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-ali',
          params: { targetId: 'jewish-qamus-garrison' },
          delay: 1,
        },
        // Marhab's garrison fights back
        {
          type: 'attack_unit',
          targetUnitId: 'jewish-qamus-garrison',
          params: { targetId: 'muslim-ali' },
          delay: 1.5,
        },
        // Jewish archers fire on Ali's force
        {
          type: 'attack_unit',
          targetUnitId: 'jewish-qamus-archers',
          params: { targetId: 'muslim-ali' },
          delay: 2,
        },
        // Muslim archers provide covering fire
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-archers',
          params: { targetId: 'jewish-qamus-archers' },
          delay: 2.5,
        },
        // Ali pushes forward (Marhab falls — the duel is won)
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ali',
          params: { position: { x: 600, y: 200 }, speed: 90 },
          delay: 4,
        },
        // Play effect: gate breach
        {
          type: 'play_effect',
          params: { effect: 'gate_breach', position: { x: 600, y: 180 } },
          delay: 5,
        },
        // Ali breaches the fortress — enters al-Qamus
        {
          type: 'move_unit',
          targetUnitId: 'muslim-ali',
          params: { position: { x: 600, y: 150 }, speed: 100 },
          delay: 5.5,
        },
        // Garrison morale breaks after Marhab's death
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-qamus-garrison',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'change_formation',
          targetUnitId: 'jewish-qamus-garrison',
          params: { formation: 'scattered' },
          delay: 6.5,
        },
        // Jewish archers retreat
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-qamus-archers',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'jewish-qamus-archers',
          params: { position: { x: 700, y: 80 }, speed: 60 },
          delay: 7,
        },
        // Muslim cavalry charges in to support
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-left',
          params: { position: { x: 450, y: 250 }, speed: 120 },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-right',
          params: { position: { x: 750, y: 250 }, speed: 120 },
          delay: 7,
        },
        // Camera pulls back to show the breach
        {
          type: 'camera_move',
          params: { x: 600, y: 200, zoom: 0.9, duration: 2 },
          delay: 7,
        },
        // Jewish reserves break
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-reserves',
          params: { behavior: 'retreating' },
          delay: 8,
        },
        {
          type: 'change_formation',
          targetUnitId: 'jewish-reserves',
          params: { formation: 'scattered' },
          delay: 8.5,
        },
      ],
      triggers: [],
    },

    // Phase 5: Victory & Surrender (38-50s)
    {
      id: 'victory-surrender',
      name: 'Victory & Surrender',
      nameAr: 'النصر والاستسلام',
      startTime: 38,
      duration: 12,
      description: "Al-Qamus falls. The remaining fortresses surrender one by one.",
      actions: [
        // Camera overview showing the whole battlefield
        {
          type: 'camera_move',
          params: { x: 600, y: 400, zoom: 0.5, duration: 3 },
          delay: 0,
        },
        // Muslim forces occupy al-Qamus
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-ali',
          params: { behavior: 'holding' },
          delay: 0,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-ali',
          params: { formation: 'defensive_circle' },
          delay: 0.5,
        },
        // Na'im garrison surrenders
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-naim-garrison',
          params: { behavior: 'retreating' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'jewish-naim-garrison',
          params: { formation: 'scattered' },
          delay: 2.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-naim-archers',
          params: { behavior: 'retreating' },
          delay: 2.5,
        },
        // Muslim forces advance to Na'im
        {
          type: 'move_unit',
          targetUnitId: 'muslim-abubakr',
          params: { position: { x: 210, y: 250 }, speed: 80 },
          delay: 3,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-abubakr',
          params: { behavior: 'advancing' },
          delay: 3,
        },
        // Al-Sa'b garrison surrenders
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-sab-garrison',
          params: { behavior: 'retreating' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'jewish-sab-garrison',
          params: { formation: 'scattered' },
          delay: 5.5,
        },
        // Muslim forces advance to al-Sa'b
        {
          type: 'move_unit',
          targetUnitId: 'muslim-umar',
          params: { position: { x: 990, y: 250 }, speed: 80 },
          delay: 6,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-umar',
          params: { behavior: 'advancing' },
          delay: 6,
        },
        // Sortie force surrenders
        {
          type: 'set_behavior',
          targetUnitId: 'jewish-sortie-force',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'change_formation',
          targetUnitId: 'jewish-sortie-force',
          params: { formation: 'scattered' },
          delay: 7.5,
        },
        // Final camera — victory overview
        {
          type: 'camera_move',
          params: { x: 600, y: 350, zoom: 0.4, duration: 3 },
          delay: 8,
        },
        // Muslim command advances to center
        {
          type: 'move_unit',
          targetUnitId: 'muslim-command',
          params: { position: { x: 600, y: 400 }, speed: 60 },
          delay: 8,
        },
        // All remaining Muslim forces converge
        {
          type: 'move_unit',
          targetUnitId: 'muslim-reserves',
          params: { position: { x: 600, y: 500 }, speed: 55 },
          delay: 9,
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
      text: 'The Battle of Khaybar — Muharram, 7 AH. The Muslim army marches to conquer the fortress complex of Khaybar.',
      textAr:
        'غزوة خيبر — محرم ٧ هـ. يزحف جيش الإسلام نحو حصون خيبر المنيعة، تلك القلاع الشامخة التي تتحدى السماء في شمال المدينة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'deployment-narration',
      time: 5,
      duration: 3,
      text: '1,500 Muslims — veterans of Hudaybiyyah — face 2,000 warriors defending eight fortresses in three regions.',
      textAr:
        'ألف وخمسمئة من أبطال الحديبية يواجهون ألفي مقاتل محصنين خلف أسوار ثمانية حصون في ثلاث مناطق — حصار لم تشهد الجزيرة مثله.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'abubakr-assault',
      time: 8,
      duration: 4,
      text: "Abu Bakr leads the first assault on Na'im fortress — fierce resistance forces him to withdraw.",
      textAr:
        'يتقدم الصدّيق أبو بكر بالراية نحو حصن نعيم — تنهال السهام كالمطر من الأسوار، والمقاومة الشرسة تجبره على الانسحاب بعد قتال عنيف.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'umar-assault',
      time: 13,
      duration: 4,
      text: "Umar leads the next assault on al-Sa'b fortress — he too is repelled by the defenders.",
      textAr:
        'يحمل الفاروق عمر الراية ويقود هجوماً عنيفاً على حصن الصعب — لكن الأسوار المنيعة والمدافعين الأشداء يصدّونه كما صدّوا من قبله.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'prophet-declaration',
      time: 18,
      duration: 5,
      text: '"Tomorrow I will give the banner to a man who loves Allah and His Messenger, and whom Allah and His Messenger love. Allah will grant victory at his hands."',
      textAr:
        'يعلن النبي ﷺ في تلك الليلة المباركة: "لأُعطينّ الراية غداً رجلاً يحب الله ورسوله ويحبه الله ورسوله، يفتح الله على يديه." فبات الصحابة يتطلعون لمن يكون صاحب هذا الشرف العظيم.',
      position: 'center',
      style: 'quote',
    },
    {
      id: 'ali-banner-narration',
      time: 23,
      duration: 4,
      text: 'Ali ibn Abi Talib receives the banner. Despite an eye infection healed by the Prophet\'s saliva, he leads the assault on al-Qamus.',
      textAr:
        'يُنادى علي بن أبي طالب وهو أرمد العينين، فيتفل النبي ﷺ في عينيه فيبرأ كأن لم يكن به وجع قط! يتسلّم الراية ويزحف كالأسد نحو حصن القموص.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'marhab-duel-narration',
      time: 28,
      duration: 5,
      text: 'Marhab, the Jewish champion, comes forth for single combat. Ali strikes him down with a mighty blow, splitting his helmet.',
      textAr:
        'يبرز مرحب — فارس خيبر الذي لا يُقهر — يرتجز ويتحدى. فيتقدم علي كالصاعقة ويهوي بذي الفقار على هامته فيشق خوذته ورأسه حتى أضراسه!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'gate-narration',
      time: 33,
      duration: 4,
      text: 'Ali tears the fortress gate off its hinges and uses it as a shield — the legendary breach of al-Qamus.',
      textAr:
        'يقتلع علي باب الحصن العملاق من مفصلاته بيد واحدة ويتخذه ترساً يتقدم به — اختراق أسطوري لحصن القموص لم يصدقه من رآه!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'fortress-falls',
      time: 38,
      duration: 4,
      text: 'Al-Qamus falls! The strongest fortress of Khaybar is conquered. The remaining fortresses begin to surrender.',
      textAr:
        'سقط القموص! أمنع حصون خيبر وأعظمها يخرّ صريعاً أمام أسد الله. ترتجف بقية الحصون وتبدأ أبوابها تُفتح واحداً تلو الآخر.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'victory-narration',
      time: 44,
      duration: 5,
      text: 'Decisive Muslim victory. Khaybar is conquered. The inhabitants are allowed to stay and farm in exchange for half their produce.',
      textAr:
        'نصر مؤزر للإسلام! خيبر بأسرها تُفتح وتسقط آخر معاقل التآمر على المدينة. يُظهر النبي ﷺ سماحة الإسلام فيسمح للسكان بالبقاء والزراعة مقابل نصف محصولهم.',
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
      position: { x: 600, y: 700 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 8,
      position: { x: 250, y: 300 },
      zoom: 1.0,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 13,
      position: { x: 950, y: 300 },
      zoom: 1.0,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 18,
      position: { x: 600, y: 600 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 22,
      position: { x: 600, y: 400 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'follow',
      followEntityId: 'muslim-ali',
    },
    {
      time: 26,
      position: { x: 600, y: 250 },
      zoom: 1.1,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 28,
      position: { x: 600, y: 220 },
      zoom: 1.3,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 33,
      position: { x: 600, y: 180 },
      zoom: 1.2,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 36,
      position: { x: 600, y: 200 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 38,
      position: { x: 600, y: 400 },
      zoom: 0.5,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 44,
      position: { x: 600, y: 350 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    victor: 'muslim',
    muslimCasualties: 18,
    enemyCasualties: 93,
    summary:
      'Decisive Muslim victory. The fortress complex of Khaybar was conquered after a siege of approximately 20 days. Ali ibn Abi Talib\'s heroic assault on al-Qamus broke the defenders\' will.',
    summaryAr:
      'نصر حاسم للمسلمين. فُتحت حصون خيبر بعد حصار دام نحو عشرين يوماً. اقتحام علي بن أبي طالب البطولي للقموص حطّم إرادة المدافعين.',
    significance:
      'Eliminated the last major hostile force near Medina. Demonstrated Muslim military capability against fortified positions. The terms set a precedent for treatment of conquered peoples in Islamic law.',
  },

  totalDuration: 50, // 50 seconds of simulation
};
