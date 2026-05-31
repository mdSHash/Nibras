import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Badr - 17 Ramadan 2 AH (13 March 624 CE)
 *
 * The first major military engagement in Islamic history.
 * A decisive Muslim victory against a much larger Quraysh force.
 */
export const battleOfBadr: BattleScenario = {
  id: 'battle-of-badr',
  name: 'Battle of Badr',
  nameAr: 'غزوة بدر',
  date: '17 Ramadan 2 AH (13 March 624 CE)',
  location: 'Wells of Badr, Hejaz',
  description:
    'The first major battle between the Muslims of Medina and the Quraysh of Mecca. Despite being outnumbered 3 to 1, the Muslim forces achieved a decisive victory.',
  descriptionAr:
    'أول معركة كبرى بين المسلمين وقريش. رغم أن المسلمين كانوا أقل عدداً بنسبة ١ إلى ٣، حققوا نصراً حاسماً.',

  map: {
    width: 2000, // world units
    height: 1500,
    terrain: [
      // Main battlefield (sandy flat)
      {
        id: 'main-field',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 2000, y: 0 },
          { x: 2000, y: 1500 },
          { x: 0, y: 1500 },
        ],
        color: 0x3d2b1f,
      },
      // Wells area (oasis)
      {
        id: 'wells',
        type: 'oasis',
        polygon: [
          { x: 800, y: 600 },
          { x: 1000, y: 600 },
          { x: 1000, y: 800 },
          { x: 800, y: 800 },
        ],
        color: 0x2e4a3e,
        label: 'Wells of Badr',
      },
      // Rocky area (north)
      {
        id: 'rocky-north',
        type: 'rocky',
        polygon: [
          { x: 0, y: 0 },
          { x: 2000, y: 0 },
          { x: 2000, y: 200 },
          { x: 0, y: 200 },
        ],
        color: 0x4a3728,
      },
      // Dunes (south)
      {
        id: 'dunes-south',
        type: 'dune',
        polygon: [
          { x: 0, y: 1300 },
          { x: 2000, y: 1300 },
          { x: 2000, y: 1500 },
          { x: 0, y: 1500 },
        ],
        color: 0x5c4033,
      },
    ],
    landmarks: [
      {
        id: 'well-1',
        position: { x: 850, y: 700 },
        type: 'well',
        label: 'Main Well',
        labelAr: 'البئر الرئيسي',
      },
      {
        id: 'well-2',
        position: { x: 950, y: 650 },
        type: 'well',
        label: 'Second Well',
        labelAr: 'البئر الثاني',
      },
      {
        id: 'muslim-camp',
        position: { x: 900, y: 900 },
        type: 'camp',
        label: 'Muslim Camp',
        labelAr: 'معسكر المسلمين',
      },
      {
        id: 'quraysh-camp',
        position: { x: 900, y: 300 },
        type: 'camp',
        label: 'Quraysh Camp',
        labelAr: 'معسكر قريش',
      },
      {
        id: 'hill-east',
        position: { x: 1700, y: 750 },
        type: 'hill',
        label: 'Eastern Hill',
        labelAr: 'التل الشرقي',
      },
    ],
    backgroundColor: 0x2c1810,
  },

  forces: [
    // ─── MUSLIM FORCES (~313 soldiers) ─────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 313,
      units: [
        {
          id: 'muslim-center',
          name: 'Muslim Center',
          nameAr: 'القلب',
          troopType: 'command',
          soldierCount: 70,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 900, y: 850 },
          startFormation: 'line',
          startFacing: -Math.PI / 2, // facing north (toward enemy)
          stats: { attack: 7, defense: 8, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-right',
          name: 'Muslim Right Flank',
          nameAr: 'الميمنة',
          troopType: 'infantry',
          soldierCount: 80,
          commander: "Mus'ab ibn Umair",
          startPosition: { x: 1100, y: 850 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 7, defense: 7, speed: 6, morale: 9 },
        },
        {
          id: 'muslim-left',
          name: 'Muslim Left Flank',
          nameAr: 'الميسرة',
          troopType: 'infantry',
          soldierCount: 80,
          commander: 'Ali ibn Abi Talib',
          startPosition: { x: 700, y: 850 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 7, speed: 7, morale: 10 },
        },
        {
          id: 'muslim-archers',
          name: 'Muslim Archers',
          nameAr: 'الرماة',
          troopType: 'archers',
          soldierCount: 50,
          commander: "Sa'd ibn Abi Waqqas",
          startPosition: { x: 900, y: 950 },
          startFormation: 'line',
          startFacing: -Math.PI / 2,
          stats: { attack: 8, defense: 4, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-cavalry',
          name: 'Muslim Cavalry',
          nameAr: 'الفرسان',
          troopType: 'cavalry',
          soldierCount: 33,
          commander: 'Zubayr ibn al-Awwam',
          startPosition: { x: 1200, y: 900 },
          startFormation: 'wedge',
          startFacing: -Math.PI / 2,
          stats: { attack: 9, defense: 6, speed: 9, morale: 10 },
        },
      ],
    },
    // ─── QURAYSH FORCES (~950 soldiers) ────────────────────────────────────────
    {
      faction: 'quraysh',
      label: 'Quraysh Forces',
      labelAr: 'جيش قريش',
      totalStrength: 950,
      units: [
        {
          id: 'quraysh-center',
          name: 'Quraysh Center',
          nameAr: 'القلب',
          troopType: 'command',
          soldierCount: 200,
          commander: 'Abu Jahl',
          startPosition: { x: 900, y: 400 },
          startFormation: 'line',
          startFacing: Math.PI / 2, // facing south (toward Muslims)
          stats: { attack: 6, defense: 7, speed: 5, morale: 7 },
        },
        {
          id: 'quraysh-right',
          name: 'Quraysh Right Flank',
          nameAr: 'الميمنة',
          troopType: 'cavalry',
          soldierCount: 100,
          commander: 'Hakim ibn Hizam',
          startPosition: { x: 1200, y: 400 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 8, defense: 7, speed: 8, morale: 7 },
        },
        {
          id: 'quraysh-left',
          name: 'Quraysh Left Flank',
          nameAr: 'الميسرة',
          troopType: 'infantry',
          soldierCount: 200,
          commander: 'Ikrimah ibn Abi Jahl',
          startPosition: { x: 600, y: 400 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 6, defense: 6, speed: 5, morale: 6 },
        },
        {
          id: 'quraysh-vanguard',
          name: 'Quraysh Vanguard',
          nameAr: 'المقدمة',
          troopType: 'infantry',
          soldierCount: 150,
          commander: "Utbah ibn Rabi'ah",
          startPosition: { x: 900, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 6, speed: 6, morale: 6 },
        },
        {
          id: 'quraysh-archers',
          name: 'Quraysh Archers',
          nameAr: 'الرماة',
          troopType: 'archers',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 900, y: 350 },
          startFormation: 'line',
          startFacing: Math.PI / 2,
          stats: { attack: 7, defense: 4, speed: 5, morale: 6 },
        },
        {
          id: 'quraysh-reserves',
          name: 'Quraysh Reserves',
          nameAr: 'الاحتياط',
          troopType: 'reserves',
          soldierCount: 150,
          commander: undefined,
          startPosition: { x: 900, y: 250 },
          startFormation: 'column',
          startFacing: Math.PI / 2,
          stats: { attack: 5, defense: 5, speed: 5, morale: 5 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total ~45 seconds of simulation time) ──────────────────
  phases: [
    {
      id: 'deployment',
      name: 'Deployment',
      nameAr: 'التعبئة',
      startTime: 0,
      duration: 8,
      description: 'Both armies take their positions on the battlefield.',
      actions: [
        // Muslims secure the wells
        {
          type: 'camera_move',
          params: { x: 900, y: 750, zoom: 0.8, duration: 2 },
          delay: 0,
        },
      ],
      triggers: [],
    },
    {
      id: 'champions-duel',
      name: 'Champions Duel',
      nameAr: 'المبارزة',
      startTime: 8,
      duration: 10,
      description: 'Three champions from each side meet in single combat.',
      actions: [
        // Quraysh champions advance
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-vanguard',
          params: { position: { x: 900, y: 600 }, speed: 60 },
          delay: 0,
        },
        // Muslim champions advance
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 900, y: 750 }, speed: 60 },
          delay: 1,
        },
        // Camera focuses on center
        {
          type: 'camera_move',
          params: { x: 900, y: 680, zoom: 1.2, duration: 1.5 },
          delay: 1.5,
        },
        // Engagement
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-center',
          params: { targetId: 'quraysh-vanguard' },
          delay: 4,
        },
      ],
      triggers: [],
    },
    {
      id: 'quraysh-advance',
      name: 'Quraysh Advance',
      nameAr: 'تقدم قريش',
      startTime: 18,
      duration: 12,
      description: 'The main Quraysh force advances toward the Muslim lines.',
      actions: [
        // Full Quraysh advance
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 900, y: 600 }, speed: 70 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-right',
          params: { position: { x: 1200, y: 600 }, speed: 80 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-left',
          params: { position: { x: 600, y: 600 }, speed: 70 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-archers',
          params: { position: { x: 900, y: 500 }, speed: 65 },
          delay: 1.5,
        },
        // Camera shows overview
        {
          type: 'camera_move',
          params: { x: 900, y: 650, zoom: 0.6, duration: 2 },
          delay: 0,
        },
        // Change to attack formation
        {
          type: 'change_formation',
          targetUnitId: 'quraysh-right',
          params: { formation: 'wedge' },
          delay: 3,
        },
      ],
      triggers: [],
    },
    {
      id: 'muslim-counter',
      name: 'Muslim Counter-Attack',
      nameAr: 'هجوم المسلمين المضاد',
      startTime: 30,
      duration: 10,
      description:
        'The Prophet ﷺ orders the counter-attack. The Muslim forces charge.',
      actions: [
        // Muslim charge
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 900, y: 650 }, speed: 90 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right',
          params: { position: { x: 1100, y: 650 }, speed: 90 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left',
          params: { position: { x: 700, y: 650 }, speed: 95 },
          delay: 0.5,
        },
        // Cavalry flanking
        {
          type: 'change_formation',
          targetUnitId: 'muslim-cavalry',
          params: { formation: 'wedge' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry',
          params: { position: { x: 1350, y: 500 }, speed: 150 },
          delay: 1.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-cavalry',
          params: { behavior: 'flanking' },
          delay: 1.5,
        },
        // Engagements
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-right',
          params: { targetId: 'quraysh-right' },
          delay: 4,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-left',
          params: { targetId: 'quraysh-left' },
          delay: 4,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-center',
          params: { targetId: 'quraysh-center' },
          delay: 5,
        },
        // Camera follows the charge
        {
          type: 'camera_move',
          params: { x: 900, y: 650, zoom: 0.7, duration: 1.5 },
          delay: 0,
        },
      ],
      triggers: [],
    },
    {
      id: 'quraysh-rout',
      name: 'Quraysh Rout',
      nameAr: 'هزيمة قريش',
      startTime: 40,
      duration: 5,
      description: 'The Quraysh forces break and flee the battlefield.',
      actions: [
        // Quraysh morale breaks - retreat
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-center',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-left',
          params: { behavior: 'retreating' },
          delay: 0.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-archers',
          params: { behavior: 'retreating' },
          delay: 1,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'quraysh-reserves',
          params: { behavior: 'retreating' },
          delay: 1.5,
        },
        // Retreat movements
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-center',
          params: { position: { x: 900, y: 150 }, speed: 100 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-left',
          params: { position: { x: 400, y: 150 }, speed: 95 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-archers',
          params: { position: { x: 900, y: 100 }, speed: 90 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-reserves',
          params: { position: { x: 1000, y: 100 }, speed: 85 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'quraysh-right',
          params: { position: { x: 1500, y: 150 }, speed: 110 },
          delay: 1,
        },
        // Change to scattered formation (rout)
        {
          type: 'change_formation',
          targetUnitId: 'quraysh-center',
          params: { formation: 'scattered' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'quraysh-left',
          params: { formation: 'scattered' },
          delay: 2.5,
        },
        // Camera shows the rout
        {
          type: 'camera_move',
          params: { x: 900, y: 500, zoom: 0.5, duration: 2 },
          delay: 0,
        },
        // Muslim pursuit
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-cavalry',
          params: { behavior: 'pursuing' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry',
          params: { position: { x: 1300, y: 300 }, speed: 130 },
          delay: 2,
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
      text: 'The Battle of Badr — 17 Ramadan, 2 AH. The first decisive battle in Islamic history.',
      textAr:
        'غزوة بدر الكبرى — ١٧ رمضان ٢ هـ. أولى المعارك الفاصلة في تاريخ الإسلام، يوم الفرقان الذي فرّق الله فيه بين الحق والباطل.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'deployment-narration',
      time: 5,
      duration: 3,
      text: '313 Muslims face nearly 1,000 Quraysh warriors on the plains of Badr.',
      textAr:
        'ثلاثمائة وثلاثة عشر مؤمنًا يقفون في وجه ألف مقاتل من صناديد قريش على أرض بدر، متوكلين على الله وحده.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'duel-narration',
      time: 9,
      duration: 5,
      text: 'Champions from both sides meet in single combat. Hamza, Ali, and Ubaidah face the Quraysh champions.',
      textAr:
        'يبرز فرسان الإسلام للمبارزة: حمزة بن عبد المطلب أسد الله، وعلي بن أبي طالب، وعبيدة بن الحارث، فيواجهون أبطال قريش ويصرعونهم.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'advance-narration',
      time: 18,
      duration: 4,
      text: 'The Quraysh army advances with overwhelming numbers, confident of victory.',
      textAr: 'يتقدم جيش قريش بأعداده الغفيرة وعُدّته الكاملة، مغترًّا بقوته، واثقًا من سحق المسلمين.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'counter-narration',
      time: 30,
      duration: 4,
      text: '"Stand firm! Paradise lies beneath the shade of swords." The Prophet ﷺ orders the counter-attack.',
      textAr:
        '«قوموا إلى جنّةٍ عرضُها السماوات والأرض!» يأمر رسول الله ﷺ بالهجوم المضاد، فتنطلق صيحات التكبير تهزّ أرض المعركة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'charge-narration',
      time: 35,
      duration: 3,
      text: 'The Muslim forces charge with unwavering faith. The cavalry flanks from the east.',
      textAr:
        'ينقضّ المسلمون كالسيل الجارف بإيمانٍ راسخ وعزيمةٍ لا تلين، والفرسان يطوّقون العدو من الجهة الشرقية.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'rout-narration',
      time: 40,
      duration: 3,
      text: 'The Quraysh lines shatter. Their forces flee in disarray toward Mecca.',
      textAr: 'تتحطّم صفوف قريش وتنهار عزائمهم، فيولّون الأدبار فارّين في فوضى عارمة نحو مكة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'victory-narration',
      time: 43,
      duration: 2,
      text: 'Victory for the Muslims. 70 Quraysh slain, 70 captured. 14 Muslim martyrs. A turning point in history.',
      textAr:
        'نصرٌ مؤزّر للمسلمين بإذن الله! سبعون قتيلًا وسبعون أسيرًا من قريش، وأربعة عشر شهيدًا من المسلمين. يومٌ غيّر مجرى التاريخ.',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    {
      time: 0,
      position: { x: 900, y: 750 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 3,
      position: { x: 900, y: 850 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 8,
      position: { x: 900, y: 680 },
      zoom: 1.1,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 18,
      position: { x: 900, y: 600 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 28,
      position: { x: 900, y: 750 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 32,
      position: { x: 1100, y: 650 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 36,
      position: { x: 900, y: 600 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 40,
      position: { x: 900, y: 500 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 43,
      position: { x: 900, y: 600 },
      zoom: 0.4,
      duration: 2,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 14,
    enemyCasualties: 70,
    summary:
      'Decisive Muslim victory. The Battle of Badr established the Muslim community as a military force and was a turning point in the struggle between Islam and the Quraysh.',
    summaryAr:
      'نصر حاسم للمسلمين. أثبتت غزوة بدر أن المجتمع المسلم قوة عسكرية وكانت نقطة تحول في الصراع بين الإسلام وقريش.',
    significance:
      'First major military victory in Islamic history. Demonstrated that faith and strategy could overcome numerical superiority.',
  },

  totalDuration: 45, // 45 seconds of simulation
};
