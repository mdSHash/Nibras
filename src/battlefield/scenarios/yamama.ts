import type { BattleScenario } from '../types/scenario';

/**
 * مَعْرَكَةُ الْيَمَامَةِ — حَدِيقَةُ الْمَوْتِ
 * Battle of al-Yamamah — The Garden of Death
 *
 * 12 AH / December 632 – January 633 CE — Caliphate of Abu Bakr al-Siddiq
 * Aqraba plain, region of al-Yamamah (modern al-Aflaj, central Arabia).
 *
 * The decisive battle of the Ridda Wars. Khalid ibn al-Walid led ~13,000
 * Muslims against ~40,000 of Banu Hanifa under Musaylimah al-Kadhdhab
 * (the False Prophet). The first phases went badly for the Muslims —
 * Banu Hanifa shattered the front lines and reached the women's tents.
 * Khalid then ordered the famous reorganization: each tribal contingent
 * was to fight under its own banner so men would not break and run past
 * unfamiliar faces. The reorganized Muslim army drove Banu Hanifa back.
 *
 * The survivors retreated into a walled garden — حديقة الرحمن — to
 * make a last stand. Bara'a ibn Malik (brother of Anas) had himself
 * hoisted up on a shield and dropped over the wall, fought through to
 * the gate, and threw it open. The slaughter inside earned the garden
 * its new name: حديقة الموت — the Garden of Death. Wahshi ibn Harb,
 * the same man who killed Hamza at Uhud (and was now a Muslim), threw
 * his javelin and killed Musaylimah, saying afterward: "I killed with
 * it the best of men and the worst of men."
 *
 * Casualties were brutal. Roughly 1,200 Muslim dead, including ~700
 * memorizers of the Qur'an (al-huffaz). Their loss prompted Abu Bakr
 * to commission Zayd ibn Thabit to compile the Qur'an into one volume.
 * Banu Hanifa lost over 10,000 — 7,000 in the open field, 7,000 in
 * the garden, and several thousand more during the pursuit.
 */
export const battleOfYamama: BattleScenario = {
  id: 'battle-of-yamama',
  name: 'Battle of al-Yamamah',
  nameAr: 'معركة اليمامة',
  date: '12 AH (December 632 – January 633 CE)',
  location: 'Aqraba plain, al-Yamamah, central Arabia',
  description:
    "The decisive battle of the Ridda Wars under Caliph Abu Bakr. Khalid ibn al-Walid led ~13,000 Muslims against ~40,000 of Banu Hanifa under the false prophet Musaylimah. After early Muslim setbacks, Khalid's tribal-banner reorganization turned the battle. The survivors made their last stand inside a walled garden — afterward known as the Garden of Death. Roughly 700 memorizers of the Qur'an were martyred, prompting the first compilation of the mushaf.",
  descriptionAr:
    'المعركة الفاصلة من حروب الردة في خلافة أبي بكر الصديق رضي الله عنه. قاد خالد بن الوليد نحو ثلاثة عشر ألف مسلم في مواجهة قرابة أربعين ألفاً من بني حنيفة بقيادة مسيلمة الكذاب. تأخر النصر في أول الأمر حتى أمر خالد بإعادة تنظيم الجيش — فقاتل كل قومٍ تحت رايتهم. تحوّلت كفة المعركة، ولجأ مَن بقي من بني حنيفة إلى حديقةٍ مسوّرة قاتلوا فيها قتالهم الأخير، فسُمّيت بعدها حديقةَ الموت. استُشهد قرابة سبعمائة من حُفّاظ القرآن، وكان ذلك السبب الأكبر في جمع المصحف على عهد الصديق.',

  // Day-of-battle atmosphere — clear desert daylight; the garden carnage
  // is what darkens the scene, not the weather.
  dayPhase: 'day',
  weather: 'dust',
  // Two days of fighting historically; we'll show it as a single arc.
  actualDayCount: 2,

  // ─── Map ───────────────────────────────────────────────────────────────────
  map: {
    width: 1500,
    height: 1000,
    terrain: [
      // Main field — the open Aqraba plain
      {
        id: 'aqraba-plain',
        type: 'sand',
        polygon: [
          { x: 0, y: 0 },
          { x: 1500, y: 0 },
          { x: 1500, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0xb89968,
        label: 'سهل عقرباء',
      },
      // The Najd uplands form the northern horizon of al-Yamamah —
      // jagged dark sandstone ridges visible during the battle
      {
        id: 'najd-mountains',
        type: 'mountain',
        polygon: [
          { x: 0, y: 0 },
          { x: 1500, y: 0 },
          { x: 1500, y: 90 },
          { x: 0, y: 90 },
        ],
        color: 0x3c2a1a,
        label: 'جبال نجد',
      },
      // Low rolling hills bordering the south of the plain
      {
        id: 'southern-hills',
        type: 'elevated',
        polygon: [
          { x: 0, y: 920 },
          { x: 1500, y: 920 },
          { x: 1500, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x6b5a4a,
      },
      // Palm groves to the north and south of the garden
      {
        id: 'north-palms',
        type: 'oasis',
        polygon: [
          { x: 950, y: 110 },
          { x: 1450, y: 110 },
          { x: 1450, y: 290 },
          { x: 950, y: 290 },
        ],
        color: 0x3a5a2a,
        label: 'بساتين النخل',
      },
      {
        id: 'south-palms',
        type: 'oasis',
        polygon: [
          { x: 950, y: 720 },
          { x: 1450, y: 720 },
          { x: 1450, y: 900 },
          { x: 950, y: 900 },
        ],
        color: 0x3a5a2a,
      },
      // The Garden of Death — walled enclosure on the east side.
      // Rendered as fortress_wall terrain (stone walls + dark interior).
      {
        id: 'garden-of-death',
        type: 'fortress_wall',
        polygon: [
          { x: 1050, y: 320 },
          { x: 1430, y: 320 },
          { x: 1430, y: 700 },
          { x: 1050, y: 700 },
        ],
        color: 0x6b6359,
        label: 'حديقة الموت',
      },
      // Muslim camp — west side
      {
        id: 'muslim-camp',
        type: 'flat',
        polygon: [
          { x: 0, y: 350 },
          { x: 180, y: 350 },
          { x: 180, y: 650 },
          { x: 0, y: 650 },
        ],
        color: 0x8c6f3f,
      },
      // Banu Hanifa main encampment — center-east, in front of the garden
      {
        id: 'hanifa-camp',
        type: 'flat',
        polygon: [
          { x: 800, y: 400 },
          { x: 1000, y: 400 },
          { x: 1000, y: 600 },
          { x: 800, y: 600 },
        ],
        color: 0x6f4f2a,
      },
    ],
    landmarks: [
      {
        id: 'khalid-command',
        position: { x: 90, y: 500 },
        type: 'camp',
        label: "Khalid's Command",
        labelAr: 'قيادة خالد بن الوليد',
      },
      {
        id: 'aqraba-marker',
        position: { x: 600, y: 60 },
        type: 'marker',
        label: 'Aqraba',
        labelAr: 'عقرباء',
      },
      {
        id: 'garden-gate',
        position: { x: 1050, y: 510 },
        type: 'marker',
        label: 'Garden Gate',
        labelAr: 'باب الحديقة',
      },
      {
        id: 'baraa-wall-point',
        position: { x: 1240, y: 320 },
        type: 'marker',
        label: "Bara'a's Wall",
        labelAr: 'مكان البراء',
      },
      {
        id: 'musaylimah-spot',
        position: { x: 1320, y: 510 },
        type: 'marker',
        label: 'Musaylimah Killed',
        labelAr: 'مصرع مسيلمة',
      },
    ],
    backgroundColor: 0x3a2c1a,
  },

  // ─── Forces ────────────────────────────────────────────────────────────────
  forces: [
    // ─── Muslim Forces (~13,000) ─────────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 13000,
      units: [
        {
          // Vanguard — Khalid himself with the elite cavalry
          id: 'khalid-vanguard',
          name: "Khalid's Vanguard",
          nameAr: 'مقدمة خالد',
          troopType: 'heavy_cavalry',
          soldierCount: 1500,
          commander: 'Khalid ibn al-Walid',
          startPosition: { x: 280, y: 500 },
          startFormation: 'wedge',
          startFacing: 0, // facing east toward Banu Hanifa
          stats: { attack: 10, defense: 8, speed: 9, morale: 10 },
        },
        {
          id: 'muhajirun',
          name: 'Muhajirun',
          nameAr: 'المهاجرون',
          troopType: 'infantry',
          soldierCount: 2500,
          commander: 'Salim mawla Abi Hudhayfa',
          startPosition: { x: 250, y: 380 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          id: 'ansar',
          name: 'Ansar',
          nameAr: 'الأنصار',
          troopType: 'infantry',
          soldierCount: 3000,
          commander: 'Thabit ibn Qays',
          startPosition: { x: 250, y: 620 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 8, speed: 5, morale: 10 },
        },
        {
          id: 'bedouin-allies',
          name: 'Bedouin Tribes',
          nameAr: 'القبائل العربية',
          troopType: 'cavalry',
          soldierCount: 2000,
          commander: undefined,
          startPosition: { x: 220, y: 500 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 7, defense: 6, speed: 8, morale: 7 },
        },
        {
          id: 'baraa-company',
          name: "Bara'a ibn Malik's Company",
          nameAr: 'كتيبة البراء بن مالك',
          troopType: 'infantry',
          soldierCount: 1500,
          commander: 'Bara’a ibn Malik',
          // Slightly forward — they'll be the spearhead at the garden wall
          startPosition: { x: 320, y: 440 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 9, defense: 7, speed: 6, morale: 10 },
        },
        {
          // Reserve under Zayd ibn al-Khattab (Umar's brother). Many huffaz
          // were here — they fall heavily in this battle.
          id: 'muslim-reserve',
          name: 'Muslim Reserve',
          nameAr: 'الاحتياط',
          troopType: 'reserves',
          soldierCount: 2450,
          commander: 'Zayd ibn al-Khattab',
          startPosition: { x: 130, y: 500 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
        {
          // Wahshi ibn Harb — small skirmisher unit. The same man who
          // killed Hamza at Uhud, now a Muslim. Will cast the javelin
          // that kills Musaylimah. Keep the count tiny so the renderer
          // shows a single distinct figure.
          id: 'wahshi',
          name: 'Wahshi ibn Harb',
          nameAr: 'وحشي بن حرب',
          troopType: 'infantry',
          soldierCount: 50,
          commander: 'Wahshi ibn Harb',
          startPosition: { x: 380, y: 520 },
          startFormation: 'scattered',
          startFacing: 0,
          stats: { attack: 10, defense: 5, speed: 7, morale: 10 },
        },
      ],
    },

    // ─── Banu Hanifa (~40,000 under Musaylimah) ──────────────────────────
    {
      faction: 'banu_hanifa',
      label: 'Banu Hanifa',
      labelAr: 'بنو حنيفة',
      totalStrength: 40000,
      units: [
        {
          // Muhakkim's elite cavalry — the strike force that breaks the
          // Muslim front lines in phase 1. Killed during the counter-attack.
          id: 'muhakkim-cavalry',
          name: "Muhakkim's Cavalry",
          nameAr: 'فرسان محكّم',
          troopType: 'heavy_cavalry',
          soldierCount: 5000,
          commander: 'Muhakkim al-Yamama',
          startPosition: { x: 880, y: 400 },
          startFormation: 'wedge',
          startFacing: Math.PI, // facing west toward Muslims
          stats: { attack: 9, defense: 7, speed: 8, morale: 9 },
        },
        {
          id: 'hanifa-center',
          name: 'Banu Hanifa Center',
          nameAr: 'قلب بني حنيفة',
          troopType: 'infantry',
          soldierCount: 15000,
          commander: undefined,
          startPosition: { x: 900, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 7, speed: 5, morale: 8 },
        },
        {
          id: 'hanifa-right',
          name: 'Banu Hanifa Right',
          nameAr: 'ميمنة بني حنيفة',
          troopType: 'infantry',
          soldierCount: 7000,
          commander: undefined,
          startPosition: { x: 920, y: 320 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 8 },
        },
        {
          id: 'hanifa-left',
          name: 'Banu Hanifa Left',
          nameAr: 'ميسرة بني حنيفة',
          troopType: 'infantry',
          soldierCount: 7000,
          commander: undefined,
          startPosition: { x: 920, y: 680 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 7, speed: 5, morale: 8 },
        },
        {
          // Garden defenders — sit inside the walls from t=0, fight only
          // during the garden-assault phases.
          id: 'garden-defenders',
          name: 'Garden Defenders',
          nameAr: 'حُماة الحديقة',
          troopType: 'infantry',
          soldierCount: 4500,
          commander: undefined,
          startPosition: { x: 1240, y: 510 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 9, speed: 4, morale: 8 },
        },
        {
          // Musaylimah and his personal guard. Small unit so the figure
          // reads as a distinct person on screen during the killing.
          id: 'musaylimah-guard',
          name: "Musaylimah's Guard",
          nameAr: 'حرس مسيلمة',
          troopType: 'heavy_cavalry',
          soldierCount: 1500,
          commander: 'Musaylimah al-Kadhdhab',
          startPosition: { x: 1340, y: 510 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 6, morale: 8 },
        },
      ],
    },
  ],

  // ─── Phases (60 simulation seconds) ────────────────────────────────────────
  phases: [
    // Phase 1 (0–10s): The Initial Clash. Banu Hanifa attacks aggressively,
    // breaks through the Muslim front, pushes them back toward the camp.
    {
      id: 'initial-clash',
      name: 'The Initial Clash',
      nameAr: 'الصدام الأول',
      startTime: 0,
      duration: 10,
      description:
        'Banu Hanifa launches a ferocious assault. Muhakkim leads his cavalry through the Muslim front lines, scattering the tribal Bedouin cavalry. The Muslim front bends.',
      actions: [
        { type: 'camera_move', params: { x: 700, y: 500, zoom: 0.65, duration: 2.5 }, delay: 0 },
        // Banu Hanifa surges forward
        { type: 'move_unit', targetUnitId: 'muhakkim-cavalry', params: { position: { x: 500, y: 460 }, speed: 110 }, delay: 0.5 },
        { type: 'move_unit', targetUnitId: 'hanifa-center', params: { position: { x: 600, y: 500 }, speed: 75 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hanifa-right', params: { position: { x: 600, y: 360 }, speed: 70 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'hanifa-left', params: { position: { x: 600, y: 640 }, speed: 70 }, delay: 1 },
        // Engagements: Hanifa cav strikes Bedouin allies, breaks them
        { type: 'attack_unit', targetUnitId: 'muhakkim-cavalry', params: { targetId: 'bedouin-allies' }, delay: 4 },
        { type: 'attack_unit', targetUnitId: 'hanifa-center', params: { targetId: 'muhajirun' }, delay: 5 },
        { type: 'attack_unit', targetUnitId: 'hanifa-right', params: { targetId: 'ansar' }, delay: 5 },
        { type: 'attack_unit', targetUnitId: 'hanifa-left', params: { targetId: 'ansar' }, delay: 5.5 },
      ],
      triggers: [],
    },

    // Phase 2 (10–15s): Muslims falter. The line bends, casualties mount,
    // Banu Hanifa reaches the women's camp.
    {
      id: 'muslims-falter',
      name: 'The Lines Bend',
      nameAr: 'تتمايل الصفوف',
      startTime: 10,
      duration: 5,
      description:
        "The Muslim front gives way. Bedouin allies break and run. The Ansar and Muhajirun are pushed back; Banu Hanifa reaches the women's tents.",
      actions: [
        { type: 'camera_move', params: { x: 500, y: 480, zoom: 0.8, duration: 1.5 }, delay: 0 },
        // Bedouin allies break — fall back to the camp
        { type: 'set_behavior', targetUnitId: 'bedouin-allies', params: { behavior: 'retreating' }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'bedouin-allies', params: { position: { x: 100, y: 480 }, speed: 130 }, delay: 0 },
        // Muhakkim presses
        { type: 'move_unit', targetUnitId: 'muhakkim-cavalry', params: { position: { x: 350, y: 480 }, speed: 100 }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'muhakkim-cavalry', params: { targetId: 'muslim-reserve' }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 3 (15–22s): Khalid orders the famous reorganization. Each
    // tribe under its own banner. The Muhajirun, the Ansar, and the
    // Bedouin contingents pull apart and re-form, identifiable by banner.
    {
      id: 'khalid-reorganizes',
      name: "Khalid's Tribal Reorganization",
      nameAr: 'تنظيم خالد للقبائل',
      startTime: 15,
      duration: 7,
      description:
        'Khalid rides among the troops shouting "تميَّزوا!" — let each tribe fight under its own banner. The Muslim line re-forms, this time with each contingent fighting beside its own kin.',
      actions: [
        { type: 'camera_move', params: { x: 280, y: 500, zoom: 0.95, duration: 2 }, delay: 0 },
        // Khalid rides forward
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 380, y: 500 }, speed: 110 }, delay: 1 },
        // Bedouin allies rally and return
        { type: 'set_behavior', targetUnitId: 'bedouin-allies', params: { behavior: 'advancing' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'bedouin-allies', params: { position: { x: 350, y: 500 }, speed: 90 }, delay: 2.5 },
        // Muhajirun realign in tighter line
        { type: 'change_formation', targetUnitId: 'muhajirun', params: { formation: 'line' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 360, y: 380 }, speed: 60 }, delay: 1.5 },
        // Ansar reform
        { type: 'change_formation', targetUnitId: 'ansar', params: { formation: 'line' }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 360, y: 620 }, speed: 60 }, delay: 1.5 },
        // Bara'a forward
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 420, y: 480 }, speed: 80 }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 4 (22–32s): The Counter-Attack. Reorganized Muslims advance.
    // Khalid drives a wedge into Muhakkim's cavalry. The Banu Hanifa
    // center buckles.
    {
      id: 'counter-attack',
      name: 'The Counter-Attack',
      nameAr: 'الهجوم المضاد',
      startTime: 22,
      duration: 10,
      description:
        'The reorganized Muslim line advances as one. Khalid charges Muhakkim head-on. The Muhajirun and Ansar press the Banu Hanifa center and wings simultaneously.',
      actions: [
        { type: 'camera_move', params: { x: 600, y: 500, zoom: 0.6, duration: 2 }, delay: 0 },
        // Charges
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 580, y: 470 }, speed: 130 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 560, y: 400 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 560, y: 600 }, speed: 80 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 620, y: 480 }, speed: 90 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'bedouin-allies', params: { position: { x: 580, y: 530 }, speed: 95 }, delay: 1 },
        // Engagements
        { type: 'attack_unit', targetUnitId: 'khalid-vanguard', params: { targetId: 'muhakkim-cavalry' }, delay: 2 },
        { type: 'attack_unit', targetUnitId: 'muhajirun', params: { targetId: 'hanifa-right' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'ansar', params: { targetId: 'hanifa-left' }, delay: 3 },
        { type: 'attack_unit', targetUnitId: 'baraa-company', params: { targetId: 'hanifa-center' }, delay: 3 },
      ],
      triggers: [],
    },

    // Phase 5 (32–37s): Death of Muhakkim. The cavalry breaks. Banu
    // Hanifa morale collapses. They begin to retreat eastward toward
    // the garden.
    {
      id: 'muhakkim-falls',
      name: 'The Fall of Muhakkim',
      nameAr: 'مصرع محكّم اليمامة',
      startTime: 32,
      duration: 5,
      description:
        "Khalid's vanguard cuts through the cavalry. Muhakkim al-Yamama falls. The Banu Hanifa cavalry breaks; foot soldiers begin to fall back toward the walled garden.",
      actions: [
        { type: 'camera_move', params: { x: 580, y: 470, zoom: 1.1, duration: 1.2 }, delay: 0 },
        // Muhakkim's cavalry destroyed
        { type: 'destroy_unit', targetUnitId: 'muhakkim-cavalry', params: {}, delay: 1.5 },
        // Hanifa starts retreating to the garden
        { type: 'set_behavior', targetUnitId: 'hanifa-center', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'hanifa-right', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'set_behavior', targetUnitId: 'hanifa-left', params: { behavior: 'retreating' }, delay: 2 },
        { type: 'move_unit', targetUnitId: 'hanifa-center', params: { position: { x: 1100, y: 510 }, speed: 110 }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'hanifa-right', params: { position: { x: 1100, y: 380 }, speed: 110 }, delay: 2.5 },
        { type: 'move_unit', targetUnitId: 'hanifa-left', params: { position: { x: 1100, y: 640 }, speed: 110 }, delay: 2.5 },
      ],
      triggers: [],
    },

    // Phase 6 (37–44s): Retreat to the Garden. Banu Hanifa survivors
    // pour through the single gate. Muslims pursue, but the gate is
    // shut behind the last defender.
    {
      id: 'retreat-to-garden',
      name: 'Retreat to the Garden',
      nameAr: 'الفرار إلى الحديقة',
      startTime: 37,
      duration: 7,
      description:
        'The Banu Hanifa survivors pour through the single gate of the walled garden. The gate slams shut behind them; the surviving Muslims line the wall but cannot enter.',
      actions: [
        { type: 'camera_move', params: { x: 1100, y: 510, zoom: 0.7, duration: 2 }, delay: 0 },
        // Hanifa units enter the garden
        { type: 'move_unit', targetUnitId: 'hanifa-center', params: { position: { x: 1240, y: 510 }, speed: 130 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'hanifa-right', params: { position: { x: 1200, y: 400 }, speed: 130 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'hanifa-left', params: { position: { x: 1200, y: 620 }, speed: 130 }, delay: 0 },
        // Muslims reach the wall
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 980, y: 380 }, speed: 90 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 980, y: 620 }, speed: 90 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 1010, y: 470 }, speed: 95 }, delay: 1 },
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 940, y: 510 }, speed: 110 }, delay: 1 },
      ],
      triggers: [],
    },

    // Phase 7 (44–50s): Bara'a's Wall. Bara'a ibn Malik volunteers to
    // be hoisted onto a shield and dropped over the wall. He fights
    // through to the gate and throws it open. The Muslims pour in.
    {
      id: 'baraas-wall',
      name: "Bara'a's Wall",
      nameAr: 'البراء يقتحم الجدار',
      startTime: 44,
      duration: 6,
      description:
        'Bara’a ibn Malik says: "Lift me on a shield and throw me over the wall!" He drops inside, fights ten wounds, reaches the gate, and throws it open. The Muslim army surges into the Garden.',
      actions: [
        // Cinematic close-up on Bara'a as he climbs
        { type: 'camera_move', params: { x: 1240, y: 380, zoom: 1.6, duration: 1.5 }, delay: 0 },
        // Bara'a's company rushes the wall point
        { type: 'move_unit', targetUnitId: 'baraa-company', params: { position: { x: 1240, y: 360 }, speed: 130 }, delay: 0 },
        { type: 'attack_unit', targetUnitId: 'baraa-company', params: { targetId: 'garden-defenders' }, delay: 2 },
        // Gate opens — pan to gate
        { type: 'camera_move', params: { x: 1100, y: 510, zoom: 0.85, duration: 1.5 }, delay: 3 },
        // Muslim units pour into the garden
        { type: 'move_unit', targetUnitId: 'khalid-vanguard', params: { position: { x: 1180, y: 510 }, speed: 140 }, delay: 3.5 },
        { type: 'move_unit', targetUnitId: 'muhajirun', params: { position: { x: 1180, y: 420 }, speed: 100 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'ansar', params: { position: { x: 1180, y: 600 }, speed: 100 }, delay: 4 },
        { type: 'move_unit', targetUnitId: 'wahshi', params: { position: { x: 1240, y: 480 }, speed: 100 }, delay: 4.5 },
      ],
      triggers: [],
    },

    // Phase 8 (50–56s): Garden of Death. Massive slaughter inside the
    // walled enclosure. The Muslim contingents engage all defenders.
    // Heavy losses on both sides — many huffaz fall here.
    {
      id: 'garden-of-death',
      name: 'The Garden of Death',
      nameAr: 'حديقة الموت',
      startTime: 50,
      duration: 6,
      description:
        'Inside the walls, retreat is impossible. The Muslims and Banu Hanifa fight at sword-point in cramped space. The garden runs red. Roughly 700 memorizers of the Qur’an are martyred here.',
      actions: [
        { type: 'camera_move', params: { x: 1240, y: 510, zoom: 0.9, duration: 2 }, delay: 0 },
        // All Muslim units engage all garden defenders
        { type: 'attack_unit', targetUnitId: 'khalid-vanguard', params: { targetId: 'garden-defenders' }, delay: 0.5 },
        { type: 'attack_unit', targetUnitId: 'muhajirun', params: { targetId: 'hanifa-right' }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'ansar', params: { targetId: 'hanifa-left' }, delay: 1 },
        { type: 'attack_unit', targetUnitId: 'baraa-company', params: { targetId: 'hanifa-center' }, delay: 1 },
      ],
      triggers: [],
    },

    // Phase 9 (56–60s): The Death of Musaylimah. Wahshi ibn Harb throws
    // his javelin — the same one that killed Hamza at Uhud. Musaylimah
    // falls. Banu Hanifa surrenders.
    {
      id: 'musaylimah-falls',
      name: 'The Death of Musaylimah',
      nameAr: 'مصرع مسيلمة الكذاب',
      startTime: 56,
      duration: 4,
      description:
        'Wahshi ibn Harb hurls his javelin — the same weapon he once used to kill Hamza ibn Abd al-Muttalib at Uhud. Musaylimah falls. Banu Hanifa surrenders. The Ridda Wars are decided.',
      actions: [
        // Snap close-up on Wahshi
        { type: 'camera_move', params: { x: 1320, y: 510, zoom: 1.8, duration: 1.0 }, delay: 0 },
        { type: 'move_unit', targetUnitId: 'wahshi', params: { position: { x: 1310, y: 510 }, speed: 120 }, delay: 0.2 },
        { type: 'attack_unit', targetUnitId: 'wahshi', params: { targetId: 'musaylimah-guard' }, delay: 0.8 },
        // Musaylimah's guard falls
        { type: 'destroy_unit', targetUnitId: 'musaylimah-guard', params: {}, delay: 2 },
        // Pull back for the aftermath
        { type: 'camera_move', params: { x: 1240, y: 510, zoom: 0.5, duration: 2 }, delay: 2.5 },
      ],
      triggers: [],
    },
  ],

  // ─── Narration ─────────────────────────────────────────────────────────────
  narration: [
    {
      id: 'opening',
      time: 0.5,
      duration: 6,
      text: 'Battle of al-Yamamah — 12 AH. Khalid ibn al-Walid leads ~13,000 Muslims against 40,000 of Banu Hanifa under the false prophet Musaylimah.',
      textAr:
        'معركة اليمامة — السنة الثانية عشر للهجرة. يقود خالد بن الوليد قرابة ثلاثة عشر ألفاً من المسلمين في مواجهة أربعين ألفاً من بني حنيفة، يتزعّمهم مسيلمة الكذاب.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'first-clash',
      time: 5,
      duration: 5,
      text: "Banu Hanifa's cavalry strikes first. Muhakkim al-Yamama scatters the Bedouin tribes; the Muslim front bends and breaks.",
      textAr:
        'يَحْمِلُ محكَّمُ اليمامةِ بفرسانِه على القبائل العربيّة فيُفرِّقُها. يَتَزعزعُ صفُّ المسلمين الأوّل ويَتراجع.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'lines-bend',
      time: 11,
      duration: 4,
      text: "Banu Hanifa reach the women's tents — the Muslim camp itself is in danger.",
      textAr:
        'يَبْلُغُ بنو حنيفةَ خِيامَ النساءِ! المعسكرُ ذاتُه يَكادُ يَسقط.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'reorganization',
      time: 16,
      duration: 6,
      text: 'Khalid rides among the men shouting: "Distinguish yourselves! Let each tribe fight under its own banner!"',
      textAr:
        'يَجولُ خالدُ بين الناسِ صائحاً: «تَميَّزُوا! ليُقاتِل كلُّ قومٍ تحتَ رايتِهم» فيَتميَّز المهاجرون والأنصارُ والقبائلُ كلٌّ تحتَ رايتِه.',
      position: 'top',
      style: 'normal',
    },
    {
      id: 'counter-attack',
      time: 23,
      duration: 5,
      text: "The reorganized Muslim line surges forward. Khalid drives his wedge into Muhakkim's cavalry.",
      textAr:
        'يَنطلقُ الصفُّ المُتميِّزُ كالسَّيلِ. يَشُقُّ خالدُ بمقدمتِه فُرسانَ محكَّم.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'muhakkim-killed',
      time: 33,
      duration: 4,
      text: 'Muhakkim al-Yamama falls. The Banu Hanifa cavalry breaks. The infantry begins to flee toward the walled garden.',
      textAr:
        'يَسقُطُ محكَّمُ اليمامة. تَنكَسرُ خيلُ بني حنيفة، ويَبدأ المُشاةُ بالفرارِ نحوَ الحديقةِ المسوَّرة.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'the-garden',
      time: 39,
      duration: 5,
      text: 'The survivors pour into a walled garden — حديقة الرحمن — and shut the gate behind them. Inside: thousands of warriors with no escape.',
      textAr:
        'يَتَدافعُ مَن بقِيَ من بني حنيفةَ داخلَ الحديقةِ المسوَّرة — حديقةِ الرحمن — ثُمَّ يُوصدون البابَ خلفَهم. آلافُ المقاتلين في حصارٍ بلا مَهرَب.',
      position: 'top',
      style: 'quote',
    },
    {
      id: 'baraa-call',
      time: 45,
      duration: 5,
      text: 'Bara’a ibn Malik shouts: "Lift me on a shield and throw me over the wall!" He drops inside alone, fights through ten wounds, and throws the gate open from within.',
      textAr:
        'يَصْرُخُ البراءُ بن مالك: «احْمِلوني على تُرسٍ وارْفَعوني فوقَ الجدار!» فيُلْقَى داخلَ الحديقةِ وحدَه. يُقاتلُ بعشرِ جراحاتٍ حتى يَفتحَ البابَ من الداخل.',
      position: 'top',
      style: 'dramatic',
    },
    {
      id: 'into-the-garden',
      time: 50.5,
      duration: 4,
      text: 'The Muslim army pours through the gate. The garden becomes a butchery. Hundreds of memorizers of the Qur’an are martyred here.',
      textAr:
        'يَنْدَفِعُ الجيشُ من البابِ المفتوح. تَتحوَّلُ الحديقةُ إلى مَجزَرة. يَسقُطُ سبعُ مئةٍ من حُفّاظِ كتابِ الله شهداء.',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'wahshi',
      time: 56.5,
      duration: 3,
      text: 'Wahshi ibn Harb hurls his javelin — the same weapon he once used to kill Hamza at Uhud. Musaylimah falls.',
      textAr:
        'يَرْمي وحشيُّ بنُ حربٍ بحربتِه — هي الحربةُ ذاتُها التي قتلَ بها حمزةَ يومَ أُحُد — فيَسقُطُ مسيلمةُ صريعاً.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'wahshi-quote',
      time: 58,
      duration: 4,
      text: 'Wahshi: "I killed with this javelin the best of men, and I have now killed with it the worst of men."',
      textAr:
        'يقولُ وحشيٌّ: «قَتلتُ بهذه الحربةِ خيرَ الناسِ، وقَتلتُ بها شرَّ الناس.»',
      position: 'center',
      style: 'quote',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  // Zooms are deliberately moderate — the field is wide and the viewer
  // should be able to see whole formations clashing, not just one or two
  // figures. The CameraDirector's autonomous moves add slight zoom-ins on
  // engagement events, so the authored values stay loose.
  cameraScript: [
    // Opening overview of the entire field
    { time: 0, position: { x: 700, y: 500 }, zoom: 0.45, duration: 3, easing: 'power2.inOut', type: 'overview' },
    // Drop in slightly on the initial clash
    { time: 4, position: { x: 600, y: 480 }, zoom: 0.6, duration: 2, easing: 'power2.inOut', type: 'focus' },
    // Pull back as lines bend
    { time: 10, position: { x: 450, y: 500 }, zoom: 0.5, duration: 2, easing: 'power2.inOut', type: 'pan' },
    // Khalid reorganizes — show the whole western side, not just him
    { time: 16, position: { x: 320, y: 500 }, zoom: 0.7, duration: 2, easing: 'power2.inOut', type: 'focus' },
    // Wide for the counter-attack
    { time: 22, position: { x: 600, y: 500 }, zoom: 0.45, duration: 2.5, easing: 'power2.inOut', type: 'overview' },
    // Muhakkim's death — modest tighten so the viewer sees the surrounding
    // melee, not just the dying unit
    { time: 32.5, position: { x: 580, y: 470 }, zoom: 0.85, duration: 1.5, easing: 'power3.out', type: 'focus' },
    // Pull back for the retreat to garden
    { time: 37, position: { x: 1000, y: 500 }, zoom: 0.5, duration: 2.5, easing: 'power2.inOut', type: 'pan' },
    // Bara'a's wall — pulled back so the Muslim line surrounding the wall
    // and the interior of the garden are both readable in one frame
    { time: 44, position: { x: 1200, y: 470 }, zoom: 0.78, duration: 1.5, easing: 'power3.out', type: 'focus' },
    // Garden interior — wide enough to see the slaughter as a whole
    { time: 50, position: { x: 1240, y: 510 }, zoom: 0.6, duration: 2, easing: 'power2.inOut', type: 'overview' },
    // Musaylimah's death — modest tighten only
    { time: 56, position: { x: 1320, y: 510 }, zoom: 0.85, duration: 1, easing: 'power3.out', type: 'focus' },
    // Final overview before the summary panel takes over
    { time: 58.5, position: { x: 800, y: 500 }, zoom: 0.42, duration: 1.5, easing: 'power2.inOut', type: 'overview' },
  ],

  // ─── Outcome ───────────────────────────────────────────────────────────────
  outcome: {
    verdict: 'muslim_victory',
    muslimCasualties: 1200,
    enemyCasualties: 21000,
    summary:
      "Decisive Muslim victory ending the Ridda Wars. Roughly 1,200 Muslims fell, including ~700 memorizers of the Qur'an — their loss prompted Caliph Abu Bakr to commission Zayd ibn Thabit to gather the Qur'an into a single mushaf, the foundation of every later Qur'anic codex. Banu Hanifa lost over 21,000 between the open field, the garden, and the pursuit. Musaylimah was killed by Wahshi ibn Harb. Khalid ibn al-Walid was confirmed as the supreme military commander of the caliphate, and the path to the Iraq and Syria campaigns was opened.",
    summaryAr:
      'انتصارٌ حاسمٌ أنهى حروبَ الردة. استُشهد قرابة ألفٍ ومئتي مسلم، منهم نحو سبع مئة من حُفّاظ كتاب الله. كان فقدُ هؤلاء الحُفّاظ السببَ الذي حَمَل أبا بكرٍ الصدّيق رضي الله عنه على تكليف زيد بن ثابت بجمعِ القرآن في مصحفٍ واحد — أصلُ كلِّ مصحفٍ بعدَه. سقط من بني حنيفةَ ما يَزيدُ على واحدٍ وعشرين ألفاً بين السهلِ والحديقةِ والطلبِ، وقَتل وحشيُّ بنُ حربٍ مسيلمةَ بحربتِه. تثبَّتَ خالدُ بن الوليد قائداً عاماً لجيوشِ الخلافة، وانفتح الطريقُ نحوَ العراقِ والشام.',
    significance:
      "The catastrophic loss of Qur'an memorizers prompted the first compilation of the Qur'an. The Ridda Wars ended decisively, securing the unity of the Arabian peninsula under the caliphate. Khalid's tribal-banner reorganization passed into military doctrine. The Garden of Death — حديقة الموت — became the proverb in Arabic for a place of irrevocable engagement.",
    significanceAr:
      'سقوط هذا العدد من حُفّاظ كتاب الله كان السببَ المباشر لجمعِ القرآن في مصحفٍ واحد على عهد أبي بكرٍ الصدّيق رضي الله عنه. انتهت حروبُ الردة حسماً وثبتت وحدة الجزيرة العربية تحت راية الخلافة. تنظيمُ خالدٍ للقبائل تحت راياتها صار مذهباً عسكريّاً يُتعلَّم. وصارت "حديقةُ الموت" مَثَلاً عربيّاً لكلِّ ساحةِ قتالٍ لا مَهرَب منها.',
  },

  totalDuration: 60,
};
