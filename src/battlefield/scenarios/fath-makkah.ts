import type { BattleScenario } from '../types/scenario';

/**
 * Conquest of Mecca (Fath Makkah) - 20 Ramadan 8 AH (11 January 630 CE)
 *
 * The peaceful conquest of Mecca by 10,000 Muslim soldiers.
 * Quraysh broke the Treaty of Hudaybiyyah by attacking Banu Khuza'ah.
 * Prophet Muhammad ﷺ marched on Mecca with the largest Muslim army assembled to that point.
 * The city surrendered with minimal resistance — only Khalid's column faced a brief skirmish.
 */
export const conquestOfMecca: BattleScenario = {
  id: 'conquest-of-mecca',
  name: 'Conquest of Mecca',
  nameAr: 'فتح مكة',
  date: '20 Ramadan 8 AH (11 January 630 CE)',
  location: 'Mecca and its surrounding approaches',
  description:
    'The peaceful conquest of Mecca. After Quraysh broke the Treaty of Hudaybiyyah, Prophet Muhammad ﷺ marched with 10,000 soldiers — the largest Muslim army ever assembled. The city surrendered with almost no bloodshed.',
  descriptionAr:
    'فتح مكة المكرمة. بعد نقض قريش لصلح الحديبية، سار النبي ﷺ بعشرة آلاف مقاتل — أكبر جيش إسلامي حتى ذلك الوقت. استسلمت المدينة بلا إراقة دماء تقريباً.',

  map: {
    width: 1200, // world units
    height: 900,
    terrain: [
      // Main desert/valley floor
      {
        id: 'valley-floor',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 1200, y: 0 },
          { x: 1200, y: 900 },
          { x: 0, y: 900 },
        ],
        color: 0x3d2b1f,
      },
      // Mecca city center
      {
        id: 'mecca-center',
        type: 'sand',
        polygon: [
          { x: 450, y: 350 },
          { x: 750, y: 350 },
          { x: 750, y: 600 },
          { x: 450, y: 600 },
        ],
        color: 0x4a3520,
        label: 'Mecca',
      },
      // Northern mountain pass (Zubayr's route)
      {
        id: 'north-pass',
        type: 'rocky',
        polygon: [
          { x: 700, y: 0 },
          { x: 900, y: 0 },
          { x: 850, y: 150 },
          { x: 750, y: 150 },
        ],
        color: 0x4a3728,
      },
      // Southern approach (Khalid's route)
      {
        id: 'south-pass',
        type: 'rocky',
        polygon: [
          { x: 450, y: 750 },
          { x: 700, y: 750 },
          { x: 700, y: 900 },
          { x: 450, y: 900 },
        ],
        color: 0x4a3728,
      },
      // Western approach (Abu Ubayda's route)
      {
        id: 'west-pass',
        type: 'rocky',
        polygon: [
          { x: 0, y: 350 },
          { x: 150, y: 350 },
          { x: 150, y: 550 },
          { x: 0, y: 550 },
        ],
        color: 0x4a3728,
      },
      // Eastern approach (Ali/Sa'd's route)
      {
        id: 'east-pass',
        type: 'rocky',
        polygon: [
          { x: 1050, y: 350 },
          { x: 1200, y: 350 },
          { x: 1200, y: 550 },
          { x: 1050, y: 550 },
        ],
        color: 0x4a3728,
      },
      // Marr al-Zahran (Muslim camp) - top area
      {
        id: 'marr-al-zahran',
        type: 'oasis',
        polygon: [
          { x: 400, y: 0 },
          { x: 800, y: 0 },
          { x: 800, y: 100 },
          { x: 400, y: 100 },
        ],
        color: 0x2e4a3e,
        label: 'Marr al-Zahran',
      },
      // Al-Khandama (resistance area) - south
      {
        id: 'al-khandama',
        type: 'dune',
        polygon: [
          { x: 500, y: 680 },
          { x: 680, y: 680 },
          { x: 680, y: 750 },
          { x: 500, y: 750 },
        ],
        color: 0x5c4033,
        label: 'Al-Khandama',
      },
    ],
    landmarks: [
      {
        id: 'kaabah',
        position: { x: 600, y: 475 },
        type: 'marker',
        label: "Ka'bah",
        labelAr: 'الكعبة المشرفة',
      },
      {
        id: 'muslim-camp',
        position: { x: 600, y: 50 },
        type: 'camp',
        label: 'Muslim Camp (Marr al-Zahran)',
        labelAr: 'معسكر المسلمين (مر الظهران)',
      },
      {
        id: 'north-entry',
        position: { x: 800, y: 100 },
        type: 'mountain_pass',
        label: 'Northern Pass',
        labelAr: 'المدخل الشمالي',
      },
      {
        id: 'south-entry',
        position: { x: 575, y: 850 },
        type: 'mountain_pass',
        label: 'Southern Pass (Lower Mecca)',
        labelAr: 'المدخل الجنوبي (أسفل مكة)',
      },
      {
        id: 'west-entry',
        position: { x: 75, y: 450 },
        type: 'mountain_pass',
        label: 'Western Pass',
        labelAr: 'المدخل الغربي',
      },
      {
        id: 'east-entry',
        position: { x: 1125, y: 450 },
        type: 'mountain_pass',
        label: 'Eastern Pass',
        labelAr: 'المدخل الشرقي',
      },
      {
        id: 'abu-sufyan-meeting',
        position: { x: 500, y: 120 },
        type: 'marker',
        label: "Abu Sufyan's Meeting Point",
        labelAr: 'نقطة لقاء أبي سفيان',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  forces: [
    // ─── MUSLIM FORCES (~10,000 soldiers) ───────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 10000,
      units: [
        // Prophet's main column (command)
        {
          id: 'prophet-column',
          name: "Prophet's Column",
          nameAr: 'موكب النبي ﷺ',
          troopType: 'command',
          soldierCount: 200,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 600, y: 80 },
          startFormation: 'column',
          startFacing: Math.PI / 2, // facing south toward Mecca
          stats: { attack: 7, defense: 9, speed: 5, morale: 10 },
        },
        // Khalid ibn al-Walid's column (south approach)
        {
          id: 'khalid-column',
          name: "Khalid's Column",
          nameAr: 'كتيبة خالد بن الوليد',
          troopType: 'cavalry',
          soldierCount: 200,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 550, y: 100 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 9, morale: 10 },
        },
        // Khalid's infantry support
        {
          id: 'khalid-infantry',
          name: "Khalid's Infantry",
          nameAr: 'مشاة كتيبة خالد',
          troopType: 'infantry',
          soldierCount: 180,
          commander: undefined,
          startPosition: { x: 520, y: 120 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 6, morale: 9 },
        },
        // Zubayr ibn al-Awwam's column (north approach)
        {
          id: 'zubayr-column',
          name: "Zubayr's Column",
          nameAr: 'كتيبة الزبير بن العوام',
          troopType: 'cavalry',
          soldierCount: 180,
          commander: 'Zubayr ibn al-Awwam',
          startPosition: { x: 650, y: 80 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 8, morale: 10 },
        },
        // Zubayr's infantry
        {
          id: 'zubayr-infantry',
          name: "Zubayr's Infantry",
          nameAr: 'مشاة كتيبة الزبير',
          troopType: 'infantry',
          soldierCount: 170,
          commander: undefined,
          startPosition: { x: 680, y: 100 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 6, morale: 9 },
        },
        // Abu Ubayda's column (west approach)
        {
          id: 'abu-ubayda-column',
          name: "Abu Ubayda's Column",
          nameAr: 'كتيبة أبي عبيدة',
          troopType: 'infantry',
          soldierCount: 200,
          commander: "Abu Ubayda ibn al-Jarrah",
          startPosition: { x: 500, y: 90 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 8, speed: 6, morale: 10 },
        },
        // Abu Ubayda's support
        {
          id: 'abu-ubayda-support',
          name: "Abu Ubayda's Support",
          nameAr: 'دعم كتيبة أبي عبيدة',
          troopType: 'infantry',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 470, y: 110 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 7, speed: 6, morale: 9 },
        },
        // Ali/Sa'd's column (east approach)
        {
          id: 'ali-column',
          name: "Ali & Sa'd's Column",
          nameAr: 'كتيبة علي وسعد',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Ali ibn Abi Talib',
          startPosition: { x: 700, y: 90 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 9, defense: 8, speed: 7, morale: 10 },
        },
        // Ali's support cavalry
        {
          id: 'ali-cavalry',
          name: "Sa'd's Cavalry",
          nameAr: 'فرسان سعد بن عبادة',
          troopType: 'cavalry',
          soldierCount: 150,
          commander: "Sa'd ibn Ubadah",
          startPosition: { x: 730, y: 110 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 6, speed: 8, morale: 9 },
        },
        // Main body reserves (Abu Bakr & Umar)
        {
          id: 'main-reserves',
          name: 'Main Army Reserves',
          nameAr: 'احتياطي الجيش',
          troopType: 'reserves',
          soldierCount: 200,
          commander: 'Abu Bakr & Umar',
          startPosition: { x: 600, y: 130 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 7, speed: 5, morale: 10 },
        },
      ],
    },
    // ─── QURAYSH FORCES (minimal resistance) ──────────────────────────────────
    {
      faction: 'quraysh',
      label: 'Quraysh Defenders',
      labelAr: 'مدافعو قريش',
      totalStrength: 200,
      units: [
        // Ikrimah's resistance at al-Khandama
        {
          id: 'ikrimah-resistance',
          name: "Ikrimah's Fighters",
          nameAr: 'مقاتلو عكرمة',
          troopType: 'infantry',
          soldierCount: 80,
          commander: 'Ikrimah ibn Abi Jahl',
          startPosition: { x: 580, y: 720 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north
          stats: { attack: 6, defense: 5, speed: 5, morale: 4 },
        },
        // Safwan's men (also at al-Khandama)
        {
          id: 'safwan-fighters',
          name: "Safwan's Men",
          nameAr: 'رجال صفوان',
          troopType: 'infantry',
          soldierCount: 60,
          commander: 'Safwan ibn Umayyah',
          startPosition: { x: 630, y: 730 },
          startFormation: 'scattered',
          startFacing: -Math.PI / 2,
          stats: { attack: 5, defense: 4, speed: 5, morale: 3 },
        },
        // Token city garrison (surrenders)
        {
          id: 'city-garrison',
          name: 'Mecca City Garrison',
          nameAr: 'حامية مكة',
          troopType: 'reserves',
          soldierCount: 60,
          commander: 'Abu Sufyan',
          startPosition: { x: 600, y: 480 },
          startFormation: 'defensive_circle',
          startFacing: 0,
          stats: { attack: 3, defense: 4, speed: 3, morale: 2 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total ~50 seconds of simulation time) ──────────────────
  phases: [
    {
      id: 'assembly',
      name: 'Assembly at Marr al-Zahran',
      nameAr: 'التجمع في مر الظهران',
      startTime: 0,
      duration: 8,
      description: 'The massive Muslim army assembles at Marr al-Zahran. Abu Sufyan sees 10,000 campfires and realizes resistance is futile.',
      actions: [
        // Camera shows the massive camp
        {
          type: 'camera_move',
          params: { x: 600, y: 100, zoom: 0.7, duration: 3 },
          delay: 0,
        },
        // Slight forward movement to show army stirring
        {
          type: 'move_unit',
          targetUnitId: 'prophet-column',
          params: { position: { x: 600, y: 100 }, speed: 20 },
          delay: 2,
        },
        // Abu Sufyan's garrison stands down
        {
          type: 'set_behavior',
          targetUnitId: 'city-garrison',
          params: { behavior: 'holding' },
          delay: 5,
        },
      ],
      triggers: [],
    },
    {
      id: 'four-columns-deploy',
      name: 'Four Columns Deploy',
      nameAr: 'انتشار الكتائب الأربع',
      startTime: 8,
      duration: 12,
      description: 'The army splits into four columns, each heading to their designated approach route around Mecca.',
      actions: [
        // Khalid's column moves south (will loop around to southern approach)
        {
          type: 'move_unit',
          targetUnitId: 'khalid-column',
          params: { position: { x: 575, y: 850 }, speed: 100 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-infantry',
          params: { position: { x: 550, y: 830 }, speed: 90 },
          delay: 1,
        },
        // Zubayr's column moves to northern entry (upper Mecca)
        {
          type: 'move_unit',
          targetUnitId: 'zubayr-column',
          params: { position: { x: 800, y: 150 }, speed: 90 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'zubayr-infantry',
          params: { position: { x: 820, y: 180 }, speed: 85 },
          delay: 1,
        },
        // Abu Ubayda's column moves west
        {
          type: 'move_unit',
          targetUnitId: 'abu-ubayda-column',
          params: { position: { x: 100, y: 450 }, speed: 85 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'abu-ubayda-support',
          params: { position: { x: 120, y: 480 }, speed: 80 },
          delay: 1,
        },
        // Ali/Sa'd's column moves east
        {
          type: 'move_unit',
          targetUnitId: 'ali-column',
          params: { position: { x: 1100, y: 450 }, speed: 85 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ali-cavalry',
          params: { position: { x: 1120, y: 480 }, speed: 95 },
          delay: 1,
        },
        // Prophet's column and reserves stay center, advance slightly
        {
          type: 'move_unit',
          targetUnitId: 'prophet-column',
          params: { position: { x: 600, y: 200 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'main-reserves',
          params: { position: { x: 600, y: 230 }, speed: 45 },
          delay: 3,
        },
        // Camera zooms out to show the split
        {
          type: 'camera_move',
          params: { x: 600, y: 450, zoom: 0.4, duration: 3 },
          delay: 2,
        },
      ],
      triggers: [],
    },
    {
      id: 'convergence',
      name: 'Convergence on Mecca',
      nameAr: 'التقارب نحو مكة',
      startTime: 20,
      duration: 12,
      description: 'All four columns advance toward Mecca simultaneously from different directions — a massive pincer movement.',
      actions: [
        // Khalid advances from south toward al-Khandama
        {
          type: 'move_unit',
          targetUnitId: 'khalid-column',
          params: { position: { x: 580, y: 700 }, speed: 90 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-infantry',
          params: { position: { x: 560, y: 720 }, speed: 80 },
          delay: 1,
        },
        {
          type: 'change_formation',
          targetUnitId: 'khalid-column',
          params: { formation: 'wedge' },
          delay: 3,
        },
        // Zubayr advances from north into upper Mecca
        {
          type: 'move_unit',
          targetUnitId: 'zubayr-column',
          params: { position: { x: 700, y: 370 }, speed: 85 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'zubayr-infantry',
          params: { position: { x: 720, y: 390 }, speed: 80 },
          delay: 1,
        },
        // Abu Ubayda advances from west into Mecca
        {
          type: 'move_unit',
          targetUnitId: 'abu-ubayda-column',
          params: { position: { x: 430, y: 470 }, speed: 80 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'abu-ubayda-support',
          params: { position: { x: 410, y: 490 }, speed: 75 },
          delay: 1,
        },
        // Ali/Sa'd advances from east into Mecca
        {
          type: 'move_unit',
          targetUnitId: 'ali-column',
          params: { position: { x: 770, y: 470 }, speed: 80 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ali-cavalry',
          params: { position: { x: 790, y: 490 }, speed: 90 },
          delay: 1,
        },
        // Prophet advances toward Mecca center
        {
          type: 'move_unit',
          targetUnitId: 'prophet-column',
          params: { position: { x: 600, y: 320 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'main-reserves',
          params: { position: { x: 600, y: 350 }, speed: 45 },
          delay: 3,
        },
        // Camera pans to show convergence
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.45, duration: 3 },
          delay: 0,
        },
      ],
      triggers: [],
    },
    {
      id: 'resistance-and-entry',
      name: 'Minor Resistance & Entry',
      nameAr: 'المقاومة الطفيفة والدخول',
      startTime: 32,
      duration: 10,
      description: "Khalid's column faces brief resistance at al-Khandama from Ikrimah and Safwan's men. Other columns enter peacefully.",
      actions: [
        // Khalid engages Ikrimah's resistance
        {
          type: 'attack_unit',
          targetUnitId: 'khalid-column',
          params: { targetId: 'ikrimah-resistance' },
          delay: 0,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'khalid-infantry',
          params: { targetId: 'safwan-fighters' },
          delay: 1,
        },
        // Camera focuses on the skirmish
        {
          type: 'camera_move',
          params: { x: 590, y: 720, zoom: 1.0, duration: 1.5 },
          delay: 0,
        },
        // Resistance quickly breaks
        {
          type: 'set_behavior',
          targetUnitId: 'ikrimah-resistance',
          params: { behavior: 'retreating' },
          delay: 3,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'safwan-fighters',
          params: { behavior: 'retreating' },
          delay: 3.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ikrimah-resistance',
          params: { position: { x: 400, y: 880 }, speed: 100 },
          delay: 3.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'safwan-fighters',
          params: { position: { x: 700, y: 890 }, speed: 95 },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'ikrimah-resistance',
          params: { formation: 'scattered' },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'safwan-fighters',
          params: { formation: 'scattered' },
          delay: 4.5,
        },
        // City garrison surrenders
        {
          type: 'set_behavior',
          targetUnitId: 'city-garrison',
          params: { behavior: 'retreating' },
          delay: 4,
        },
        {
          type: 'change_formation',
          targetUnitId: 'city-garrison',
          params: { formation: 'scattered' },
          delay: 4.5,
        },
        // Khalid continues into Mecca after resistance clears
        {
          type: 'move_unit',
          targetUnitId: 'khalid-column',
          params: { position: { x: 590, y: 550 }, speed: 80 },
          delay: 5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-infantry',
          params: { position: { x: 570, y: 570 }, speed: 75 },
          delay: 5.5,
        },
        // Other columns continue peaceful entry toward Ka'bah
        {
          type: 'move_unit',
          targetUnitId: 'zubayr-column',
          params: { position: { x: 650, y: 440 }, speed: 60 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'abu-ubayda-column',
          params: { position: { x: 500, y: 470 }, speed: 60 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ali-column',
          params: { position: { x: 700, y: 470 }, speed: 60 },
          delay: 2,
        },
        // Camera zooms back out
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.5, duration: 2 },
          delay: 5,
        },
      ],
      triggers: [],
    },
    {
      id: 'victory-purification',
      name: 'Victory & Purification',
      nameAr: 'النصر وتطهير الكعبة',
      startTime: 42,
      duration: 8,
      description: "All columns converge at the Ka'bah. Prophet ﷺ enters Mecca on his camel, head bowed in humility. The idols are destroyed and general amnesty is declared.",
      actions: [
        // All units converge on Ka'bah area
        {
          type: 'move_unit',
          targetUnitId: 'prophet-column',
          params: { position: { x: 600, y: 460 }, speed: 40 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'main-reserves',
          params: { position: { x: 600, y: 420 }, speed: 40 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-column',
          params: { position: { x: 560, y: 500 }, speed: 50 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'zubayr-column',
          params: { position: { x: 640, y: 440 }, speed: 50 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'abu-ubayda-column',
          params: { position: { x: 530, y: 475 }, speed: 50 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ali-column',
          params: { position: { x: 670, y: 475 }, speed: 50 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ali-cavalry',
          params: { position: { x: 700, y: 500 }, speed: 55 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'khalid-infantry',
          params: { position: { x: 550, y: 520 }, speed: 50 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'zubayr-infantry',
          params: { position: { x: 660, y: 430 }, speed: 50 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'abu-ubayda-support',
          params: { position: { x: 510, y: 490 }, speed: 45 },
          delay: 1,
        },
        // Change to defensive circle (surrounding Ka'bah)
        {
          type: 'change_formation',
          targetUnitId: 'prophet-column',
          params: { formation: 'line' },
          delay: 3,
        },
        {
          type: 'change_formation',
          targetUnitId: 'khalid-column',
          params: { formation: 'line' },
          delay: 3,
        },
        {
          type: 'change_formation',
          targetUnitId: 'zubayr-column',
          params: { formation: 'line' },
          delay: 3,
        },
        {
          type: 'change_formation',
          targetUnitId: 'abu-ubayda-column',
          params: { formation: 'line' },
          delay: 3,
        },
        {
          type: 'change_formation',
          targetUnitId: 'ali-column',
          params: { formation: 'line' },
          delay: 3,
        },
        // Destroy city garrison entity (surrender complete)
        {
          type: 'destroy_unit',
          targetUnitId: 'city-garrison',
          params: {},
          delay: 2,
        },
        // Camera focuses on Ka'bah for the climactic moment
        {
          type: 'camera_move',
          params: { x: 600, y: 475, zoom: 0.9, duration: 2 },
          delay: 2,
        },
        // Victory effect
        {
          type: 'play_effect',
          params: { effect: 'victory', position: { x: 600, y: 475 } },
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
      duration: 5,
      text: 'The Conquest of Mecca — 20 Ramadan, 8 AH. Ten thousand Muslims march to reclaim the Sacred House.',
      textAr:
        'فتح مكة المبين — ٢٠ رمضان ٨ هـ. عشرة آلاف مقاتل يزحفون في موكب مهيب لاستعادة البيت الحرام وتطهيره من رجس الأصنام.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'abu-sufyan-narration',
      time: 5,
      duration: 4,
      text: 'Abu Sufyan visits the Muslim camp at Marr al-Zahran. Seeing 10,000 campfires, he accepts Islam and negotiates the surrender of Mecca.',
      textAr:
        'يأتي أبو سفيان متسللاً إلى معسكر المسلمين في مر الظهران، فتبهره عشرة آلاف نار تضيء الليل كأنه نهار. يدرك أن لا طاقة لقريش بهذا الجيش، فيُسلم ويفاوض على تسليم مكة.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'columns-deploy-narration',
      time: 10,
      duration: 5,
      text: 'The Prophet ﷺ divides the army into four columns: Khalid from the south, Zubayr from the north, Abu Ubayda from the west, and Ali from the east.',
      textAr:
        'يقسم النبي ﷺ جيشه العظيم إلى أربع كتائب تطوّق مكة من كل جانب: خالد بن الوليد من الجنوب، والزبير من الشمال، وأبو عبيدة من الغرب، وعلي من الشرق.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'convergence-narration',
      time: 20,
      duration: 5,
      text: 'The four columns advance simultaneously toward Mecca from all directions — an overwhelming display of force that leaves no room for resistance.',
      textAr:
        'تتحرك الكتائب الأربع كالسيل الجارف في وقت واحد نحو مكة من جميع الاتجاهات — مشهد مهيب يخلع القلوب ولا يترك مجالاً للمقاومة.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'orders-narration',
      time: 26,
      duration: 4,
      text: '"Do not fight unless you are fought." The Prophet ﷺ orders a peaceful entry — no blood is to be shed unless absolutely necessary.',
      textAr:
        '"لا تقاتلوا إلا من قاتلكم." يأمر النبي ﷺ جيشه العظيم بدخول سلمي رحيم — لا تُراق دماء ولا يُروّع آمن، إلا من رفع السلاح في وجوههم.',
      position: 'center',
      style: 'quote',
    },
    {
      id: 'resistance-narration',
      time: 32,
      duration: 4,
      text: "At al-Khandama, Ikrimah and Safwan's men offer brief resistance to Khalid's column. The skirmish ends quickly — about 12 Quraysh are killed.",
      textAr:
        'عند الخندمة، يتجرأ رجال عكرمة وصفوان على مقاومة كتيبة خالد — لكن سيف الله المسلول يحسم المناوشة في لحظات. يسقط نحو اثني عشر من قريش، آخر من رفع سيفاً في وجه الإسلام.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'peaceful-entry-narration',
      time: 37,
      duration: 4,
      text: 'The other three columns enter Mecca without any resistance. The people of Mecca watch in awe as the massive army flows peacefully into the city.',
      textAr:
        'تدخل الكتائب الثلاث الأخرى مكة دون أن يُراق قطرة دم واحدة. يقف أهل مكة مبهوتين يراقبون الجيش العظيم يتدفق بسلام وسكينة إلى مدينتهم.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'entry-narration',
      time: 42,
      duration: 4,
      text: 'The Prophet ﷺ enters Mecca on his camel, head bowed in humility, reciting Surah al-Fath: "Indeed, We have given you a clear conquest."',
      textAr:
        'يدخل النبي ﷺ مكة المكرمة على ناقته القصواء، خافضاً رأسه الشريف تواضعاً لله حتى كاد يمس قربوس الرحل، يتلو سورة الفتح: "إِنَّا فَتَحْنَا لَكَ فَتْحًا مُّبِينًا".',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'purification-narration',
      time: 46,
      duration: 4,
      text: 'The Prophet ﷺ circles the Ka\'bah and destroys 360 idols, declaring: "Truth has come and falsehood has vanished. Indeed, falsehood is ever bound to vanish."',
      textAr:
        'يطوف النبي ﷺ بالكعبة المشرفة ويحطم ثلاثمئة وستين صنماً واحداً تلو الآخر بعصاه، معلناً بصوت يملأ الأرجاء: "جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ ۚ إِنَّ الْبَاطِلَ كَانَ زَهُوقًا".',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    // Opening: overview of the massive camp
    {
      time: 0,
      position: { x: 600, y: 100 },
      zoom: 0.7,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Show the camp scale
    {
      time: 4,
      position: { x: 600, y: 150 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Zoom out to show army splitting
    {
      time: 8,
      position: { x: 600, y: 400 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Pan to show columns deploying
    {
      time: 14,
      position: { x: 600, y: 450 },
      zoom: 0.35,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Convergence - full battlefield view
    {
      time: 20,
      position: { x: 600, y: 450 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Focus on southern approach (Khalid)
    {
      time: 26,
      position: { x: 580, y: 650 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    // Resistance at al-Khandama
    {
      time: 32,
      position: { x: 590, y: 720 },
      zoom: 1.0,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Pull back to show other columns entering peacefully
    {
      time: 36,
      position: { x: 600, y: 470 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Final convergence at Ka'bah
    {
      time: 42,
      position: { x: 600, y: 475 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Dramatic close on Ka'bah
    {
      time: 46,
      position: { x: 600, y: 475 },
      zoom: 0.9,
      duration: 2,
      easing: 'power2.out',
      type: 'focus',
    },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 2,
    enemyCasualties: 12,
    summary:
      "Nearly bloodless conquest. Mecca was taken by 10,000 Muslim soldiers with minimal resistance. The Prophet ﷺ declared general amnesty for all Quraysh, purified the Ka'bah of idols, and established Islam's triumph in its birthplace.",
    summaryAr:
      'فتح شبه سلمي. فُتحت مكة بعشرة آلاف مقاتل مسلم بأقل مقاومة. أعلن النبي ﷺ العفو العام عن جميع قريش، وطهّر الكعبة من الأصنام، وأقام انتصار الإسلام في مهده.',
    significance:
      "The peaceful conquest of Mecca marked the triumph of Islam in Arabia. The Prophet's mercy in granting general amnesty won over former enemies and demonstrated that Islam's victory was spiritual as much as military.",
  },

  totalDuration: 50, // 50 seconds of simulation
};
