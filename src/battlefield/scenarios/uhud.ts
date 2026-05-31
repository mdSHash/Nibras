import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Uhud - 7 Shawwal 3 AH (23 March 625 CE)
 *
 * The second major battle between the Muslims and Quraysh.
 * Initially a Muslim success, the battle turned when archers
 * abandoned their post, allowing Khalid ibn al-Walid's cavalry
 * to execute a devastating flanking maneuver.
 */
export const battleOfUhud: BattleScenario = {
  id: 'battle-of-uhud',
  name: 'Battle of Uhud',
  nameAr: 'غزوة أُحُد',
  date: '7 Shawwal 3 AH (23 March 625 CE)',
  location: 'Mount Uhud, near Medina',
  description:
    'The Quraysh sought revenge for Badr. Despite initial Muslim success, archers abandoning their post allowed Khalid ibn al-Walid to flank the Muslim army, turning the tide of battle.',
  descriptionAr:
    'سعت قريش للثأر من بدر. رغم النجاح الأولي للمسلمين، أدى ترك الرماة لمواقعهم إلى تمكين خالد بن الوليد من الالتفاف على جيش المسلمين وقلب مجرى المعركة.',

  map: {
    width: 2000,
    height: 1500,
    terrain: [
      // Main battlefield (rocky plain near mountain)
      {
        id: 'main-field',
        type: 'rocky',
        polygon: [
          { x: 0, y: 0 },
          { x: 2000, y: 0 },
          { x: 2000, y: 1500 },
          { x: 0, y: 1500 },
        ],
        color: 0x4a3728,
      },
      // Mount Uhud (north) - elevated rocky terrain
      {
        id: 'mount-uhud',
        type: 'elevated',
        polygon: [
          { x: 0, y: 0 },
          { x: 2000, y: 0 },
          { x: 2000, y: 250 },
          { x: 0, y: 250 },
        ],
        color: 0x5c4a3a,
        label: 'Mount Uhud',
      },
      // Archers' Hill (Mount Rumah/Ainain) - elevated position on left flank
      {
        id: 'archers-hill',
        type: 'elevated',
        polygon: [
          { x: 250, y: 400 },
          { x: 450, y: 400 },
          { x: 450, y: 550 },
          { x: 250, y: 550 },
        ],
        color: 0x6b5a4a,
        label: "Archers' Hill",
      },
      // Open plain (center battlefield)
      {
        id: 'open-plain',
        type: 'flat',
        polygon: [
          { x: 400, y: 400 },
          { x: 1600, y: 400 },
          { x: 1600, y: 1100 },
          { x: 400, y: 1100 },
        ],
        color: 0x3d2b1f,
      },
      // Quraysh camp area (south)
      {
        id: 'quraysh-camp-area',
        type: 'sand',
        polygon: [
          { x: 0, y: 1200 },
          { x: 2000, y: 1200 },
          { x: 2000, y: 1500 },
          { x: 0, y: 1500 },
        ],
        color: 0x5c4033,
      },
    ],
    landmarks: [
      {
        id: 'mount-uhud-peak',
        position: { x: 1000, y: 100 },
        type: 'hill',
        label: 'Mount Uhud',
        labelAr: 'جبل أُحُد',
      },
      {
        id: 'archers-hill-marker',
        position: { x: 350, y: 475 },
        type: 'hill',
        label: "Archers' Hill (Mount Rumah)",
        labelAr: 'جبل الرماة (عينين)',
      },
      {
        id: 'muslim-camp',
        position: { x: 900, y: 300 },
        type: 'camp',
        label: 'Muslim Camp',
        labelAr: 'معسكر المسلمين',
      },
      {
        id: 'quraysh-camp',
        position: { x: 1000, y: 1350 },
        type: 'camp',
        label: 'Quraysh Camp',
        labelAr: 'معسكر قريش',
      },
      {
        id: 'mountain-pass',
        position: { x: 1700, y: 200 },
        type: 'mountain_pass',
        label: 'Mountain Pass',
        labelAr: 'ممر الجبل',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  forces: [
    // ─── MUSLIM FORCES (~700 soldiers after desertion) ─────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 700,
      units: [
        {
          id: 'muslim-center',
          name: 'Muslim Center',
          nameAr: 'القلب',
          troopType: 'command',
          soldierCount: 200,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 900, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI / 2, // facing south (toward enemy)
          stats: { attack: 7, defense: 8, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-right',
          name: 'Muslim Right Wing',
          nameAr: 'الميمنة',
          troopType: 'infantry',
          soldierCount: 150,
          commander: 'Abu Dujana',
          startPosition: { x: 1200, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-left',
          name: 'Muslim Left Wing',
          nameAr: 'الميسرة',
          troopType: 'infantry',
          soldierCount: 150,
          commander: 'Ali ibn Abi Talib',
          startPosition: { x: 600, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 7, morale: 10 },
        },
        {
          id: 'muslim-archers',
          name: "Archers of Ainain",
          nameAr: 'رماة عينين',
          troopType: 'archers',
          soldierCount: 50,
          commander: 'Abdullah ibn Jubayr',
          startPosition: { x: 350, y: 475 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 5, speed: 4, morale: 8 },
        },
        {
          id: 'muslim-vanguard',
          name: 'Muslim Vanguard',
          nameAr: 'المقدمة',
          troopType: 'infantry',
          soldierCount: 100,
          commander: 'Hamza ibn Abdul-Muttalib',
          startPosition: { x: 900, y: 600 },
          startFormation: 'wedge',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 7, morale: 10 },
        },
        {
          id: 'muslim-guard',
          name: "Prophet's Guard",
          nameAr: 'حرس النبي',
          troopType: 'infantry',
          soldierCount: 50,
          commander: "Mus'ab ibn Umayr",
          startPosition: { x: 900, y: 400 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 9, speed: 5, morale: 10 },
        },
      ],
    },
    // ─── QURAYSH FORCES (~3000 soldiers) ──────────────────────────────────────
    {
      faction: 'quraysh',
      label: 'Quraysh Forces',
      labelAr: 'جيش قريش',
      totalStrength: 3000,
      units: [
        {
          id: 'quraysh-center',
          name: 'Quraysh Center',
          nameAr: 'القلب',
          troopType: 'command',
          soldierCount: 600,
          commander: 'Abu Sufyan ibn Harb',
          startPosition: { x: 1000, y: 1100 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north (toward Muslims)
          stats: { attack: 6, defense: 7, speed: 5, morale: 7 },
        },
        {
          id: 'quraysh-left',
          name: 'Quraysh Left Wing',
          nameAr: 'الميسرة',
          troopType: 'infantry',
          soldierCount: 500,
          commander: 'Ikrimah ibn Abi Jahl',
          startPosition: { x: 700, y: 1100 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 5, morale: 6 },
        },
        {
          id: 'quraysh-right',
          name: 'Quraysh Right Wing',
          nameAr: 'الميمنة',
          troopType: 'infantry',
          soldierCount: 500,
          commander: undefined,
          startPosition: { x: 1300, y: 1100 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 5, morale: 6 },
        },
        {
          id: 'quraysh-cavalry-khalid',
          name: "Khalid's Cavalry",
          nameAr: 'فرسان خالد',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 1700, y: 1050 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 9, morale: 8 },
        },
        {
          id: 'quraysh-cavalry-ikrimah',
          name: "Ikrimah's Cavalry",
          nameAr: 'فرسان عكرمة',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: 'Ikrimah ibn Abi Jahl',
          startPosition: { x: 300, y: 1050 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 9, morale: 7 },
        },
        {
          id: 'quraysh-archers',
          name: 'Quraysh Archers',
          nameAr: 'رماة قريش',
          troopType: 'archers',
          soldierCount: 500,
          commander: undefined,
          startPosition: { x: 1000, y: 1000 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 4, speed: 5, morale: 6 },
        },
        {
          id: 'quraysh-armored',
          name: 'Quraysh Armored Infantry',
          nameAr: 'المدرعون',
          troopType: 'infantry',
          soldierCount: 700,
          commander: undefined,
          startPosition: { x: 1000, y: 1200 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 9, speed: 4, morale: 7 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total ~50 seconds of simulation time) ──────────────────
  phases: [
    // Phase 1: Deployment (0-8s)
    {
      id: 'deployment',
      name: 'Deployment',
      nameAr: 'التعبئة',
      startTime: 0,
      duration: 8,
      description:
        'Muslims deploy with backs to Mount Uhud. 50 archers positioned on the hill to guard the left flank.',
      actions: [
        // Camera overview of the battlefield
        {
          type: 'camera_move',
          params: { x: 1000, y: 750, zoom: 0.5, duration: 3 },
          delay: 0,
        },
        // Quraysh advance slightly into position
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 1000, y: 1000 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-archers',
          params: { position: { x: 1000, y: 900 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-left',
          params: { position: { x: 700, y: 1000 }, speed: 50 },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-right',
          params: { position: { x: 1300, y: 1000 }, speed: 50 },
          delay: 2.5,
        },
      ],
      triggers: [],
    },

    // Phase 2: Initial Muslim Advance (8-18s)
    {
      id: 'muslim-advance',
      name: 'Muslim Advance',
      nameAr: 'تقدم المسلمين',
      startTime: 8,
      duration: 10,
      description:
        'The Muslim forces charge forward. Hamza leads the vanguard. The archers rain arrows on the Quraysh flanks.',
      actions: [
        // Muslim vanguard charges
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard',
          params: { position: { x: 900, y: 800 }, speed: 100 },
          delay: 0,
        },
        // Muslim center advances
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 900, y: 650 }, speed: 80 },
          delay: 1,
        },
        // Wings advance
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right',
          params: { position: { x: 1200, y: 700 }, speed: 85 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left',
          params: { position: { x: 600, y: 700 }, speed: 85 },
          delay: 1.5,
        },
        // Camera follows the charge
        {
          type: 'camera_move',
          params: { x: 900, y: 700, zoom: 0.7, duration: 2 },
          delay: 0,
        },
        // Archers fire (hold position)
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-archers',
          params: { targetId: 'quraysh-cavalry-ikrimah' },
          delay: 3,
        },
        // Engagement begins
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-vanguard',
          params: { targetId: 'quraysh-archers' },
          delay: 5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-right',
          params: { targetId: 'quraysh-right' },
          delay: 6,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-left',
          params: { targetId: 'quraysh-left' },
          delay: 6,
        },
        // Quraysh begin to falter
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-archers',
          params: { behavior: 'retreating' },
          delay: 8,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-archers',
          params: { position: { x: 1000, y: 1100 }, speed: 70 },
          delay: 8,
        },
        // Khalid's cavalry probes the left flank but is repelled by archers
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { position: { x: 1700, y: 700 }, speed: 100 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { position: { x: 1700, y: 900 }, speed: 80 },
          delay: 8,
        },
      ],
      triggers: [],
    },

    // Phase 3: Archers Abandon Post (18-28s)
    {
      id: 'archers-abandon',
      name: 'Archers Abandon Post',
      nameAr: 'ترك الرماة مواقعهم',
      startTime: 18,
      duration: 10,
      description:
        'Seeing the Quraysh retreat, most archers disobey orders and leave the hill to collect spoils. The left flank is exposed.',
      actions: [
        // Quraysh center retreats further (appearing defeated)
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-center',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 1000, y: 1200 }, speed: 70 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-left',
          params: { position: { x: 700, y: 1200 }, speed: 65 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-right',
          params: { position: { x: 1300, y: 1200 }, speed: 65 },
          delay: 0.5,
        },
        // Muslim forces pursue (overextending)
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard',
          params: { behavior: 'pursuing' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard',
          params: { position: { x: 900, y: 1000 }, speed: 90 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right',
          params: { position: { x: 1200, y: 950 }, speed: 80 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left',
          params: { position: { x: 600, y: 950 }, speed: 80 },
          delay: 2,
        },
        // KEY MOMENT: Archers leave the hill to collect spoils
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-archers',
          params: { behavior: 'advancing' },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-archers',
          params: { formation: 'scattered' },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-archers',
          params: { position: { x: 600, y: 900 }, speed: 70 },
          delay: 4.5,
        },
        // Camera focuses on the archers leaving
        {
          type: 'camera_move',
          params: { x: 450, y: 600, zoom: 1.0, duration: 2 },
          delay: 3.5,
        },
        // Muslim center also advances too far
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 900, y: 850 }, speed: 70 },
          delay: 3,
        },
        // Khalid observes the hill is empty - positions for attack
        {
          type: 'camera_move',
          params: { x: 1500, y: 800, zoom: 0.9, duration: 1.5 },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { position: { x: 1800, y: 500 }, speed: 110 },
          delay: 7,
        },
      ],
      triggers: [],
    },

    // Phase 4: Khalid's Flanking Attack (28-38s)
    {
      id: 'khalid-flanking',
      name: "Khalid's Flanking Attack",
      nameAr: 'التفاف خالد',
      startTime: 28,
      duration: 10,
      description:
        "Khalid ibn al-Walid's cavalry sweeps around the undefended hill and strikes the Muslim rear. Ikrimah's cavalry joins from the other side.",
      actions: [
        // Khalid's cavalry charges around the hill into Muslim rear
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { behavior: 'flanking' },
          delay: 0,
        },
        {
          type: 'change_formation',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { formation: 'wedge' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { position: { x: 1100, y: 500 }, speed: 150 },
          delay: 0,
        },
        // Camera follows Khalid's devastating charge
        {
          type: 'camera_move',
          params: { x: 1200, y: 600, zoom: 0.8, duration: 2 },
          delay: 0,
        },
        // Ikrimah's cavalry also charges from the left
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-cavalry-ikrimah',
          params: { behavior: 'flanking' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-cavalry-ikrimah',
          params: { position: { x: 500, y: 600 }, speed: 130 },
          delay: 1,
        },
        // Khalid attacks Muslim center from behind
        {
          type: 'attack_unit',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { targetId: 'muslim-center' },
          delay: 3,
        },
        // Quraysh center rallies and counter-attacks
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-center',
          params: { behavior: 'advancing' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 1000, y: 900 }, speed: 90 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-left',
          params: { position: { x: 700, y: 900 }, speed: 85 },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-right',
          params: { position: { x: 1300, y: 900 }, speed: 85 },
          delay: 2.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-armored',
          params: { position: { x: 1000, y: 1000 }, speed: 70 },
          delay: 3,
        },
        // Muslims caught between two forces
        {
          type: 'attack_unit',
          targetUnitId: 'quraysh-center',
          params: { targetId: 'muslim-vanguard' },
          delay: 5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'quraysh-cavalry-ikrimah',
          params: { targetId: 'muslim-left' },
          delay: 4,
        },
        // Hamza is killed (vanguard takes heavy losses)
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        // Muslim formation breaks
        {
          type: 'change_formation',
          targetUnitId: 'muslim-center',
          params: { formation: 'scattered' },
          delay: 7,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-right',
          params: { formation: 'scattered' },
          delay: 7.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-left',
          params: { formation: 'scattered' },
          delay: 7.5,
        },
        // Camera shows the chaos
        {
          type: 'camera_move',
          params: { x: 900, y: 700, zoom: 0.6, duration: 2 },
          delay: 5,
        },
      ],
      triggers: [],
    },

    // Phase 5: Muslim Rout & Last Stand (38-50s)
    {
      id: 'last-stand',
      name: 'Last Stand at Uhud',
      nameAr: 'الصمود عند أُحُد',
      startTime: 38,
      duration: 12,
      description:
        'Muslims scatter in confusion. The Prophet ﷺ is wounded but rallies remaining fighters at the mountain. Quraysh withdraw without pressing their advantage.',
      actions: [
        // Muslim rout - units scatter
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-right',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-left',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right',
          params: { position: { x: 1400, y: 300 }, speed: 90 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left',
          params: { position: { x: 400, y: 300 }, speed: 90 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard',
          params: { position: { x: 800, y: 350 }, speed: 80 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-archers',
          params: { position: { x: 500, y: 350 }, speed: 75 },
          delay: 0.5,
        },
        // Prophet's guard holds firm and retreats to mountain
        {
          type: 'move_unit',
          targetUnitId: 'muslim-guard',
          params: { position: { x: 900, y: 280 }, speed: 60 },
          delay: 0,
        },
        // Prophet rallies at the mountain
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center',
          params: { behavior: 'regrouping' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-center',
          params: { formation: 'defensive_circle' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 900, y: 300 }, speed: 70 },
          delay: 2,
        },
        // Camera focuses on the last stand
        {
          type: 'camera_move',
          params: { x: 900, y: 350, zoom: 0.9, duration: 2 },
          delay: 2,
        },
        // Remaining Muslims regroup at the mountain
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-right',
          params: { behavior: 'regrouping' },
          delay: 4,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-left',
          params: { behavior: 'regrouping' },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-guard',
          params: { formation: 'defensive_circle' },
          delay: 3,
        },
        // Quraysh advance but do not press the attack
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 1000, y: 700 }, speed: 50 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { position: { x: 1200, y: 600 }, speed: 60 },
          delay: 3,
        },
        // Quraysh halt and eventually withdraw
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-center',
          params: { behavior: 'holding' },
          delay: 7,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { behavior: 'holding' },
          delay: 7,
        },
        // Quraysh begin withdrawal
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-center',
          params: { behavior: 'retreating' },
          delay: 9,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 1000, y: 1300 }, speed: 60 },
          delay: 9,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-cavalry-khalid',
          params: { position: { x: 1700, y: 1200 }, speed: 80 },
          delay: 9.5,
        },
        // Final camera - overview of aftermath
        {
          type: 'camera_move',
          params: { x: 900, y: 600, zoom: 0.4, duration: 3 },
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
      text: 'The Battle of Uhud — 7 Shawwal, 3 AH. The Quraysh march on Medina with 3,000 warriors seeking revenge for Badr.',
      textAr:
        'غزوة أُحُد — ٧ شوال ٣ هـ. تزحف قريش بثلاثة آلاف مقاتل نحو المدينة المنورة، تغلي صدورهم حقدًا وطلبًا للثأر من هزيمة بدر.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'deployment-narration',
      time: 5,
      duration: 3,
      text: '700 Muslims deploy with Mount Uhud at their backs. 50 archers guard the hill with strict orders: "Do not leave your post."',
      textAr:
        'سبعمائة مقاتل مسلم يصطفّون وجبل أُحُد يحمي ظهورهم. خمسون راميًا يتمركزون على جبل الرماة بأمرٍ نبويٍّ صارم: «لا تبرحوا مكانكم ولو رأيتمونا تخطّفنا الطير!»',
      position: 'bottom',
      style: 'quote',
    },
    {
      id: 'advance-narration',
      time: 9,
      duration: 4,
      text: 'Hamza leads the Muslim charge. Abu Dujana fights with the Prophet\'s own sword. The Quraysh lines begin to crumble.',
      textAr:
        'يقود حمزة بن عبد المطلب — أسد الله — هجوم المسلمين الكاسح. أبو دجانة يشقّ الصفوف بسيف رسول الله ﷺ. تبدأ صفوف قريش بالتصدّع والانهيار.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'quraysh-retreat-narration',
      time: 15,
      duration: 3,
      text: 'The Quraysh fall back in disarray. Victory seems certain for the Muslims.',
      textAr: 'تتراجع قريش في فوضى عارمة وتولّي الأدبار. يبدو النصر محققًا للمسلمين، وتلوح بشائر الفتح.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'archers-leave-narration',
      time: 20,
      duration: 5,
      text: 'Disaster strikes — the archers abandon their hill to collect spoils, disobeying the Prophet\'s explicit command. The left flank lies exposed.',
      textAr:
        'تقع الطامّة الكبرى! يهجر الرماة مواقعهم على الجبل طمعًا في الغنائم، عاصين أمر رسول الله ﷺ الصريح. ينكشف ظهر المسلمين وتُفتح ثغرة قاتلة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'khalid-charge-narration',
      time: 28,
      duration: 5,
      text: 'Khalid ibn al-Walid seizes the moment — his cavalry sweeps around the empty hill and crashes into the Muslim rear!',
      textAr:
        'ينقضّ خالد بن الوليد كالصاعقة! فرسانه يلتفّون حول الجبل الخالي ويطبقون على المسلمين من خلفهم في هجوم مباغت مدمّر!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'chaos-narration',
      time: 34,
      duration: 4,
      text: 'Caught between two forces, the Muslims scatter. Hamza is martyred. A rumor spreads: "Muhammad has been killed!"',
      textAr:
        'يُحاصَر المسلمون بين فكّي كماشة فيتفرّقون. يسقط حمزة شهيدًا، وتنتشر إشاعة مروّعة في الميدان: «قُتل محمد!»',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'rally-narration',
      time: 39,
      duration: 5,
      text: 'The Prophet ﷺ, wounded but alive, rallies the faithful at Mount Uhud. "I am here! Come to me!" The remnant holds firm.',
      textAr:
        'رسول الله ﷺ جريحٌ لكنه ثابت كالجبل، ينادي المؤمنين: «إليّ عباد الله! أنا رسول الله!» فيلتفّ حوله الصحابة ويصمدون صمود الأبطال.',
      position: 'center',
      style: 'quote',
    },
    {
      id: 'withdrawal-narration',
      time: 45,
      duration: 5,
      text: 'Abu Sufyan withdraws without pressing the advantage. A costly lesson: the price of disobedience. 70 Muslim martyrs, including Hamza.',
      textAr:
        'ينسحب أبو سفيان دون أن يستثمر تفوّقه. درسٌ بليغ ومؤلم في ثمن مخالفة أمر القائد. سبعون شهيدًا من خيرة المسلمين، على رأسهم حمزة أسد الله.',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    {
      time: 0,
      position: { x: 1000, y: 750 },
      zoom: 0.5,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 4,
      position: { x: 350, y: 475 },
      zoom: 1.0,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 8,
      position: { x: 900, y: 700 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 12,
      position: { x: 900, y: 800 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 18,
      position: { x: 900, y: 900 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 21,
      position: { x: 450, y: 600 },
      zoom: 1.0,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 26,
      position: { x: 1700, y: 700 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 28,
      position: { x: 1200, y: 600 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 33,
      position: { x: 900, y: 700 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 38,
      position: { x: 900, y: 500 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 41,
      position: { x: 900, y: 350 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 46,
      position: { x: 900, y: 600 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    verdict: 'enemy_victory',
    muslimCasualties: 70,
    // Sources vary widely; Ibn Ishaq gives ~22 Quraysh dead while later
    // accounts cite higher figures. Using the conservative chronicle figure.
    enemyCasualties: 22,
    summary:
      'A tactical defeat for the Muslims. Initial success was reversed when archers abandoned their post, allowing a devastating cavalry flanking attack. The Prophet ﷺ was wounded but survived.',
    summaryAr:
      'هزيمة تكتيكية للمسلمين. انقلب النجاح الأولي عندما ترك الرماة مواقعهم، مما أتاح هجوماً مدمراً بالفرسان من الخلف. جُرح النبي ﷺ لكنه نجا.',
    significance:
      'A harsh lesson in military discipline and obedience. The battle demonstrated the consequences of disobeying command orders and the importance of maintaining defensive positions.',
  },

  totalDuration: 50, // 50 seconds of simulation
};
