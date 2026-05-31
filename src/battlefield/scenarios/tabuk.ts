import type { BattleScenario } from '../types/scenario';

/**
 * Expedition of Tabuk (غزوة تبوك) - Rajab 9 AH (October 630 CE)
 *
 * The last military expedition led by Prophet Muhammad ﷺ.
 * ~30,000 Muslims marched to Tabuk near the Byzantine border.
 * The Byzantines and their Ghassanid allies retreated without engaging.
 * Known as the "Army of Hardship" (جيش العسرة) due to extreme heat and scarcity.
 * Several tribes submitted and signed treaties.
 */
export const expeditionOfTabuk: BattleScenario = {
  id: 'battle-of-tabuk',
  name: 'Expedition of Tabuk',
  nameAr: 'غزوة تبوك',
  date: 'Rajab 9 AH (October 630 CE)',
  location: 'Tabuk, northern Arabia (near Byzantine border)',
  description:
    "The last military expedition led by Prophet Muhammad ﷺ. An army of 30,000 Muslims marched through extreme heat to Tabuk on the Byzantine border. The Byzantines retreated without engaging, and several northern tribes submitted to Muslim authority.",
  descriptionAr:
    'آخر غزوات النبي ﷺ وأقساها. استنفر النبي ﷺ المسلمين في قيظ الصيف فخرج ثلاثون ألف مقاتل نحو تبوك على حدود الشام. انسحب الروم دون قتال وخضعت القبائل الشمالية لسلطان المسلمين.',

  map: {
    width: 1400,
    height: 1000,
    terrain: [
      // Main desert terrain
      {
        id: 'main-desert',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 1400, y: 0 },
          { x: 1400, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x8b7355,
      },
      // Road to Syria (طريق الشام)
      {
        id: 'road-to-syria',
        type: 'flat',
        polygon: [
          { x: 0, y: 450 },
          { x: 1400, y: 450 },
          { x: 1400, y: 550 },
          { x: 0, y: 550 },
        ],
        color: 0x6b5a3a,
      },
      // Tabuk city area (right side)
      {
        id: 'tabuk-area',
        type: 'flat',
        polygon: [
          { x: 1050, y: 300 },
          { x: 1350, y: 300 },
          { x: 1350, y: 700 },
          { x: 1050, y: 700 },
        ],
        color: 0x7a6a4a,
      },
      // Oasis area
      {
        id: 'oasis-area',
        type: 'oasis',
        polygon: [
          { x: 1100, y: 420 },
          { x: 1250, y: 420 },
          { x: 1250, y: 580 },
          { x: 1100, y: 580 },
        ],
        color: 0x2e5a2e,
      },
      // Muslim camp area (left side)
      {
        id: 'muslim-camp-area',
        type: 'sand',
        polygon: [
          { x: 50, y: 300 },
          { x: 350, y: 300 },
          { x: 350, y: 700 },
          { x: 50, y: 700 },
        ],
        color: 0x9b8365,
      },
      // Byzantine border zone (far right)
      {
        id: 'byzantine-border',
        type: 'rocky',
        polygon: [
          { x: 1300, y: 0 },
          { x: 1400, y: 0 },
          { x: 1400, y: 1000 },
          { x: 1300, y: 1000 },
        ],
        color: 0x5a4a3a,
      },
      // Dunes in the middle
      {
        id: 'desert-dunes',
        type: 'dune',
        polygon: [
          { x: 500, y: 200 },
          { x: 800, y: 200 },
          { x: 800, y: 400 },
          { x: 500, y: 400 },
        ],
        color: 0xa08050,
      },
    ],
    landmarks: [
      {
        id: 'tabuk-city',
        position: { x: 1200, y: 500 },
        type: 'marker',
        label: 'Tabuk',
        labelAr: 'تبوك',
      },
      {
        id: 'muslim-camp',
        position: { x: 200, y: 500 },
        type: 'camp',
        label: 'Muslim Camp',
        labelAr: 'معسكر المسلمين',
      },
      {
        id: 'byzantine-border-marker',
        position: { x: 1350, y: 500 },
        type: 'marker',
        label: 'Byzantine Border',
        labelAr: 'الحدود البيزنطية',
      },
      {
        id: 'oasis-marker',
        position: { x: 1175, y: 500 },
        type: 'oasis',
        label: 'Oasis',
        labelAr: 'واحة',
      },
      {
        id: 'road-marker',
        position: { x: 700, y: 500 },
        type: 'marker',
        label: 'Road to Syria',
        labelAr: 'طريق الشام',
      },
    ],
    backgroundColor: 0x3d2b1f,
  },

  forces: [
    // ─── MUSLIM FORCES (~30,000 soldiers) ─────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'المسلمون',
      totalStrength: 30000,
      units: [
        {
          id: 'muslim-vanguard',
          name: 'Vanguard',
          nameAr: 'المقدمة',
          troopType: 'infantry',
          soldierCount: 5000,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 150, y: 420 },
          startFormation: 'wedge',
          startFacing: 0, // facing east
          stats: { attack: 8, defense: 7, speed: 7, morale: 10 },
        },
        {
          id: 'muslim-center',
          name: 'Main Body',
          nameAr: 'القلب',
          troopType: 'infantry',
          soldierCount: 12000,
          commander: 'Prophet Muhammad ﷺ',
          startPosition: { x: 100, y: 500 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 8, speed: 5, morale: 10 },
        },
        {
          id: 'muslim-right-wing',
          name: 'Right Wing',
          nameAr: 'الميمنة',
          troopType: 'infantry',
          soldierCount: 5000,
          commander: 'Abu Bakr al-Siddiq',
          startPosition: { x: 120, y: 350 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 6, morale: 10 },
        },
        {
          id: 'muslim-left-wing',
          name: 'Left Wing',
          nameAr: 'الميسرة',
          troopType: 'infantry',
          soldierCount: 5000,
          commander: 'Umar ibn al-Khattab',
          startPosition: { x: 120, y: 650 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 6, morale: 10 },
        },
        {
          id: 'muslim-rear-guard',
          name: 'Rear Guard',
          nameAr: 'الساقة',
          troopType: 'reserves',
          soldierCount: 2000,
          commander: undefined,
          startPosition: { x: 50, y: 500 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 6, defense: 7, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-khalid-cavalry',
          name: "Khalid's Cavalry Scouts",
          nameAr: 'فرسان خالد',
          troopType: 'cavalry',
          soldierCount: 1000,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 200, y: 380 },
          startFormation: 'wedge',
          startFacing: 0,
          stats: { attack: 9, defense: 6, speed: 10, morale: 10 },
        },
      ],
    },
    // ─── BYZANTINE & GHASSANID FORCES ─────────────────────────────────────────────
    {
      faction: 'byzantine',
      label: 'Byzantine & Ghassanid Forces',
      labelAr: 'الروم',
      totalStrength: 8000,
      units: [
        {
          id: 'tabuk-garrison',
          name: 'Tabuk Garrison',
          nameAr: 'حامية تبوك',
          troopType: 'infantry',
          soldierCount: 2000,
          commander: undefined,
          startPosition: { x: 1200, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI, // facing west
          stats: { attack: 6, defense: 7, speed: 4, morale: 5 },
        },
        {
          id: 'ghassanid-cavalry',
          name: 'Ghassanid Cavalry',
          nameAr: 'فرسان الغساسنة',
          troopType: 'cavalry',
          soldierCount: 3000,
          commander: undefined,
          startPosition: { x: 1250, y: 400 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 5, speed: 8, morale: 4 },
        },
        {
          id: 'byzantine-infantry',
          name: 'Byzantine Infantry',
          nameAr: 'مشاة الروم',
          troopType: 'infantry',
          soldierCount: 3000,
          commander: undefined,
          startPosition: { x: 1300, y: 600 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 4 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total 50 seconds of simulation time) ──────────────────────
  phases: [
    // Phase 1: Departure from Medina (0-10s)
    {
      id: 'departure',
      name: 'Departure from Medina',
      nameAr: 'الخروج من المدينة',
      startTime: 0,
      duration: 10,
      description:
        'The Muslim army assembles and begins the long march northward. 30,000 strong — the largest Muslim army ever assembled.',
      actions: [
        // Camera overview
        {
          type: 'camera_move',
          params: { x: 300, y: 500, zoom: 0.4, duration: 3 },
          delay: 0,
        },
        // Muslim forces form up
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center',
          params: { behavior: 'advancing' },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard',
          params: { position: { x: 300, y: 420 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 250, y: 500 }, speed: 40 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 270, y: 350 }, speed: 45 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 270, y: 650 }, speed: 45 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 180, y: 500 }, speed: 35 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-khalid-cavalry',
          params: { position: { x: 350, y: 380 }, speed: 60 },
          delay: 2,
        },
      ],
      triggers: [],
    },

    // Phase 2: Desert March (10-22s)
    {
      id: 'desert-march',
      name: 'Desert March',
      nameAr: 'المسير في الصحراء',
      startTime: 10,
      duration: 12,
      description:
        'The army crosses the harsh desert terrain under scorching heat. The "Army of Hardship" endures thirst and exhaustion.',
      actions: [
        // Camera pans to follow the march
        {
          type: 'camera_move',
          params: { x: 550, y: 500, zoom: 0.35, duration: 4 },
          delay: 0,
        },
        // All units march eastward across the map
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard',
          params: { position: { x: 600, y: 440 }, speed: 55 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-khalid-cavalry',
          params: { position: { x: 680, y: 400 }, speed: 70 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 520, y: 500 }, speed: 45 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 540, y: 360 }, speed: 48 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 540, y: 640 }, speed: 48 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 420, y: 500 }, speed: 40 },
          delay: 2,
        },
        // Byzantine scouts observe
        {
          type: 'set_behavior',
          targetUnitId: 'ghassanid-cavalry',
          params: { behavior: 'holding' },
          delay: 5,
        },
      ],
      triggers: [],
    },

    // Phase 3: Arrival at Tabuk (22-34s)
    {
      id: 'arrival',
      name: 'Arrival at Tabuk',
      nameAr: 'الوصول إلى تبوك',
      startTime: 22,
      duration: 12,
      description:
        'The Muslim army arrives at Tabuk and deploys in battle formation. The sheer size of the force is overwhelming.',
      actions: [
        // Camera shows the deployment
        {
          type: 'camera_move',
          params: { x: 850, y: 500, zoom: 0.35, duration: 3 },
          delay: 0,
        },
        // Muslim forces deploy near Tabuk
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard',
          params: { position: { x: 900, y: 450 }, speed: 55 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-khalid-cavalry',
          params: { position: { x: 980, y: 380 }, speed: 70 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 820, y: 500 }, speed: 50 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 850, y: 350 }, speed: 50 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 850, y: 650 }, speed: 50 },
          delay: 1.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-rear-guard',
          params: { position: { x: 700, y: 500 }, speed: 45 },
          delay: 2,
        },
        // Change to battle formation
        {
          type: 'change_formation',
          targetUnitId: 'muslim-vanguard',
          params: { formation: 'line' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-center',
          params: { formation: 'line' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-right-wing',
          params: { formation: 'line' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'muslim-left-wing',
          params: { formation: 'line' },
          delay: 5,
        },
      ],
      triggers: [],
    },

    // Phase 4: Byzantine Retreat (34-42s)
    {
      id: 'byzantine-retreat',
      name: 'Byzantine Retreat',
      nameAr: 'انسحاب الروم',
      startTime: 34,
      duration: 8,
      description:
        'Seeing the massive Muslim army, the Byzantines and their Ghassanid allies withdraw without engaging in battle.',
      actions: [
        // Camera focuses on the retreating Byzantines
        {
          type: 'camera_move',
          params: { x: 1150, y: 500, zoom: 0.5, duration: 2 },
          delay: 0,
        },
        // Byzantines retreat
        {
          type: 'set_behavior',
          targetUnitId: 'tabuk-garrison',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'ghassanid-cavalry',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'byzantine-infantry',
          params: { behavior: 'retreating' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'ghassanid-cavalry',
          params: { position: { x: 1380, y: 300 }, speed: 80 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'tabuk-garrison',
          params: { position: { x: 1380, y: 500 }, speed: 50 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'byzantine-infantry',
          params: { position: { x: 1380, y: 700 }, speed: 45 },
          delay: 2,
        },
        // Muslim cavalry advances to observe retreat
        {
          type: 'move_unit',
          targetUnitId: 'muslim-khalid-cavalry',
          params: { position: { x: 1100, y: 400 }, speed: 80 },
          delay: 3,
        },
      ],
      triggers: [],
    },

    // Phase 5: Establishing Control (42-50s)
    {
      id: 'establishing-control',
      name: 'Establishing Control',
      nameAr: 'فرض السيطرة',
      startTime: 42,
      duration: 8,
      description:
        'The Muslim army secures Tabuk and the surrounding region. Northern tribes submit and sign treaties of peace.',
      actions: [
        // Camera pulls back for overview
        {
          type: 'camera_move',
          params: { x: 1000, y: 500, zoom: 0.35, duration: 3 },
          delay: 0,
        },
        // Muslim cavalry secures forward positions
        {
          type: 'move_unit',
          targetUnitId: 'muslim-khalid-cavalry',
          params: { position: { x: 1250, y: 450 }, speed: 70 },
          delay: 0,
        },
        // Vanguard moves to Tabuk
        {
          type: 'move_unit',
          targetUnitId: 'muslim-vanguard',
          params: { position: { x: 1050, y: 470 }, speed: 45 },
          delay: 1,
        },
        // Main body advances to secure position
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 950, y: 500 }, speed: 40 },
          delay: 2,
        },
        // Wings spread to cover the area
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 1000, y: 300 }, speed: 45 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 1000, y: 700 }, speed: 45 },
          delay: 2,
        },
        // Set holding behavior — area secured
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center',
          params: { behavior: 'holding' },
          delay: 5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-vanguard',
          params: { behavior: 'holding' },
          delay: 5,
        },
        // Final camera overview
        {
          type: 'camera_move',
          params: { x: 900, y: 500, zoom: 0.3, duration: 3 },
          delay: 5,
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
      text: 'The Expedition of Tabuk — Rajab, 9 AH. The last and greatest expedition of the Prophet ﷺ.',
      textAr:
        'غزوة تبوك — رجب، ٩ هـ. آخر غزوات النبي ﷺ وأعظمها. ثلاثون ألف مقاتل يخرجون في قيظ الصيف وشدة الحر نحو حدود الروم. سُمّي هذا الجيش بجيش العسرة لشدة الحال وبُعد المسافة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'hardship-narration',
      time: 6,
      duration: 4,
      text: 'The Army of Hardship marches through scorching heat. Abu Bakr gives all his wealth, Uthman equips a third of the army.',
      textAr:
        'يسير جيش العسرة في حرّ الصيف اللاهب. جاء أبو بكر بماله كله، وجهّز عثمان ثلث الجيش بتجهيز كامل حتى قال النبي ﷺ: «ما ضرّ عثمان ما فعل بعد اليوم».',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'march-narration',
      time: 11,
      duration: 5,
      text: 'The massive army crosses the desert — the largest Muslim force ever assembled.',
      textAr:
        'يعبر الجيش الصحراء القاحلة في مشهد مهيب لم تشهده الجزيرة العربية من قبل. ثلاثون ألف مقاتل يسيرون في نظام محكم، والرايات تخفق فوق رؤوسهم تحت شمس الصحراء الحارقة.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'hypocrites-narration',
      time: 17,
      duration: 4,
      text: 'The hypocrites make excuses to stay behind. The Quran exposes their cowardice.',
      textAr:
        'تخلّف المنافقون بحجج واهية كشفها القرآن الكريم. وتخلّف كعب بن مالك وصاحباه بصدق فهجرهم المسلمون خمسين ليلة حتى تاب الله عليهم.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'arrival-narration',
      time: 23,
      duration: 5,
      text: 'The Muslim army arrives at Tabuk and deploys in full battle formation.',
      textAr:
        'يصل الجيش الإسلامي إلى تبوك على حدود الشام وينتشر في تشكيل قتالي كامل. منظر ثلاثين ألف مقاتل مسلم يرعب كل من يراه ويُلقي الرعب في قلوب الأعداء.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'retreat-narration',
      time: 34,
      duration: 4,
      text: 'The Byzantines and Ghassanids retreat without engaging — the Muslim army is too powerful.',
      textAr:
        'ينسحب الروم والغساسنة دون قتال! هيبة الجيش الإسلامي الجرار أرعبت قيصر الروم وحلفاءه. لم يجرؤ أحد على مواجهة سيل المسلمين الجارف.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'control-narration',
      time: 39,
      duration: 4,
      text: 'The Prophet ﷺ stays 20 days, securing treaties with northern tribes.',
      textAr:
        'يقيم النبي ﷺ عشرين يوماً في تبوك يُرهب فيها قيصر الروم ويعقد معاهدات مع القبائل الشمالية. دومة الجندل وأيلة وغيرها تخضع لسلطان الإسلام.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'conclusion-narration',
      time: 44,
      duration: 5,
      text: 'Victory without bloodshed — Muslim authority extends to the Byzantine border.',
      textAr:
        'يعود النبي ﷺ منتصراً دون قتال، مرسّخاً هيبة الدولة الإسلامية العظمى الجديدة. امتد سلطان المسلمين إلى حدود الشام، وأصبحت الجزيرة العربية بأكملها تحت راية الإسلام.',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────────
  cameraScript: [
    {
      time: 0,
      position: { x: 200, y: 500 },
      zoom: 0.5,
      duration: 3,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 4,
      position: { x: 350, y: 500 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 10,
      position: { x: 550, y: 500 },
      zoom: 0.35,
      duration: 4,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 16,
      position: { x: 650, y: 450 },
      zoom: 0.5,
      duration: 3,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 22,
      position: { x: 900, y: 500 },
      zoom: 0.35,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 28,
      position: { x: 950, y: 450 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 34,
      position: { x: 1150, y: 500 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    {
      time: 38,
      position: { x: 1250, y: 450 },
      zoom: 0.6,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    {
      time: 42,
      position: { x: 1050, y: 500 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    {
      time: 47,
      position: { x: 900, y: 500 },
      zoom: 0.3,
      duration: 3,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    // No battle was fought — the Byzantine army did not appear. Use the
    // dedicated verdict so the UI doesn't render this as a combat victory.
    verdict: 'unfought_expedition',
    muslimCasualties: 0,
    enemyCasualties: undefined,
    summary:
      "A decisive strategic victory without combat. The massive Muslim army's march to Tabuk demonstrated overwhelming military power, causing the Byzantines to retreat. Northern tribes submitted, extending Muslim authority to the Byzantine border.",
    summaryAr:
      'نصر استراتيجي حاسم دون قتال. أثبت مسير الجيش الإسلامي الجرار إلى تبوك القوة العسكرية الساحقة للمسلمين، مما أجبر الروم على الانسحاب. خضعت القبائل الشمالية وامتد سلطان المسلمين إلى حدود الشام.',
    significance:
      "The last expedition of the Prophet ﷺ. Demonstrated that the Muslim state was now a superpower capable of projecting force to the Byzantine border. Secured the northern frontier and established Muslim hegemony over all of Arabia.",
  },

  totalDuration: 50,
};
