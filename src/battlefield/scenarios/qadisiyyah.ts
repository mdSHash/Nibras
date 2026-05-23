import type { BattleScenario } from '../types/scenario';

/**
 * Battle of Qadisiyyah - 16-19 Sha'ban 15 AH (November 636 CE)
 *
 * The decisive battle that broke the Sassanid Persian Empire.
 * Muslim forces under Sa'd ibn Abi Waqqas defeated the vastly larger
 * Persian army of Rustam Farrokhzad, including 33 war elephants.
 * The battle lasted 3-4 days, compressed here to 50 seconds.
 *
 * Key events: War elephant charge, al-Qa'qa's reinforcements,
 * anti-elephant tactics, the sandstorm, Rustam's death, and the Persian rout.
 */
export const battleOfQadisiyyah: BattleScenario = {
  id: 'battle-of-qadisiyyah',
  name: 'Battle of Qadisiyyah',
  nameAr: 'معركة القادسية',
  date: '16-19 Sha\'ban 15 AH (November 636 CE)',
  location: 'Al-Qadisiyyah, near modern-day Kufa, Iraq',
  description:
    'The decisive battle that shattered the Sassanid Persian Empire. Despite being outnumbered 2-to-1 and facing 33 war elephants, the Muslim army under Sa\'d ibn Abi Waqqas employed brilliant anti-elephant tactics, received critical reinforcements from al-Qa\'qa\' ibn Amr, and exploited a providential sandstorm to achieve total victory. Rustam Farrokhzad was killed and the Persian army was annihilated.',
  descriptionAr:
    'المعركة الحاسمة التي حطمت الإمبراطورية الساسانية الفارسية. رغم التفوق العددي الفارسي ووجود ٣٣ فيلاً حربياً، استخدم الجيش الإسلامي بقيادة سعد بن أبي وقاص تكتيكات بارعة ضد الأفيال، وتلقى تعزيزات حاسمة من القعقاع بن عمرو، واستغل عاصفة رملية لتحقيق نصر ساحق. قُتل رستم فرخزاد وأُبيد الجيش الفارسي.',

  map: {
    width: 1400,
    height: 1000,
    terrain: [
      // Main battlefield — flat Mesopotamian desert plain
      {
        id: 'main-desert',
        type: 'flat',
        polygon: [
          { x: 0, y: 0 },
          { x: 1200, y: 0 },
          { x: 1200, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x5c4a32,
      },
      // Atiq River (old Euphrates channel) — east side
      {
        id: 'atiq-river',
        type: 'oasis',
        polygon: [
          { x: 1200, y: 0 },
          { x: 1400, y: 0 },
          { x: 1400, y: 1000 },
          { x: 1200, y: 1000 },
        ],
        color: 0x1a4a6c,
        label: 'Atiq River',
      },
      // Sandy dunes — south edge
      {
        id: 'southern-dunes',
        type: 'dune',
        polygon: [
          { x: 0, y: 900 },
          { x: 1200, y: 900 },
          { x: 1200, y: 1000 },
          { x: 0, y: 1000 },
        ],
        color: 0x6b5a3e,
      },
      // Rocky terrain — north edge
      {
        id: 'northern-rocky',
        type: 'rocky',
        polygon: [
          { x: 0, y: 0 },
          { x: 1200, y: 0 },
          { x: 1200, y: 100 },
          { x: 0, y: 100 },
        ],
        color: 0x4a3d2e,
      },
    ],
    landmarks: [
      {
        id: 'muslim-camp',
        position: { x: 150, y: 500 },
        type: 'camp',
        label: 'Muslim Camp',
        labelAr: 'معسكر المسلمين',
      },
      {
        id: 'persian-camp',
        position: { x: 1100, y: 500 },
        type: 'camp',
        label: 'Persian Camp',
        labelAr: 'معسكر الفرس',
      },
      {
        id: 'rustam-pavilion',
        position: { x: 1150, y: 350 },
        type: 'marker',
        label: "Rustam's Pavilion",
        labelAr: 'سرادق رستم',
      },
      {
        id: 'saad-command',
        position: { x: 100, y: 500 },
        type: 'marker',
        label: "Sa'd's Command Post",
        labelAr: 'مقر قيادة سعد',
      },
      {
        id: 'river-crossing',
        position: { x: 1250, y: 700 },
        type: 'marker',
        label: 'River Crossing',
        labelAr: 'معبر النهر',
      },
    ],
    backgroundColor: 0x3d2e1a,
  },

  forces: [
    // ─── MUSLIM FORCES (~33,000 soldiers) ─────────────────────────────────────
    {
      faction: 'muslim',
      label: 'Muslim Forces',
      labelAr: 'جيش المسلمين',
      totalStrength: 33000,
      units: [
        {
          id: 'muslim-center',
          name: 'Muslim Center (Main Infantry)',
          nameAr: 'القلب - المشاة الرئيسيون',
          troopType: 'infantry',
          soldierCount: 8000,
          commander: "Sa'd ibn Abi Waqqas",
          startPosition: { x: 350, y: 500 },
          startFormation: 'line',
          startFacing: 0, // facing east (toward enemy)
          stats: { attack: 7, defense: 8, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-right-wing',
          name: 'Muslim Right Wing',
          nameAr: 'الميمنة',
          troopType: 'infantry',
          soldierCount: 6000,
          commander: 'Zuhra ibn al-Hawiyya',
          startPosition: { x: 350, y: 300 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-left-wing',
          name: 'Muslim Left Wing',
          nameAr: 'الميسرة',
          troopType: 'infantry',
          soldierCount: 6000,
          commander: 'Asim ibn Amr',
          startPosition: { x: 350, y: 700 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 7, defense: 7, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-archers',
          name: 'Muslim Archers',
          nameAr: 'الرماة',
          troopType: 'archers',
          soldierCount: 4000,
          commander: undefined,
          startPosition: { x: 420, y: 500 },
          startFormation: 'line',
          startFacing: 0,
          stats: { attack: 8, defense: 4, speed: 5, morale: 9 },
        },
        {
          id: 'muslim-cavalry-reserve',
          name: 'Muslim Cavalry Reserve',
          nameAr: 'فرسان الاحتياط',
          troopType: 'cavalry',
          soldierCount: 4000,
          commander: 'Tulayha ibn Khuwaylid',
          startPosition: { x: 200, y: 500 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 8, defense: 6, speed: 9, morale: 9 },
        },
        {
          id: 'qaqa-reinforcements',
          name: "Al-Qa'qa's Reinforcements",
          nameAr: 'تعزيزات القعقاع',
          troopType: 'cavalry',
          soldierCount: 5000,
          commander: "Al-Qa'qa' ibn Amr",
          startPosition: { x: 30, y: 500 },
          startFormation: 'column',
          startFacing: 0,
          stats: { attack: 10, defense: 7, speed: 9, morale: 10 },
        },
      ],
    },
    // ─── SASSANID PERSIAN FORCES (~80,000 soldiers + 33 elephants) ─────────────
    {
      faction: 'quraysh',
      label: 'Sassanid Persian Forces',
      labelAr: 'جيش الفرس الساسانيين',
      totalStrength: 80000,
      units: [
        {
          id: 'persian-center',
          name: 'Persian Center (Heavy Infantry)',
          nameAr: 'القلب - المشاة الثقيلة',
          troopType: 'infantry',
          soldierCount: 20000,
          commander: 'Jalinus',
          startPosition: { x: 850, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI, // facing west (toward Muslims)
          stats: { attack: 7, defense: 8, speed: 4, morale: 7 },
        },
        {
          id: 'persian-right-wing',
          name: 'Persian Right Wing',
          nameAr: 'الميمنة الفارسية',
          troopType: 'infantry',
          soldierCount: 15000,
          commander: 'Bahman Jadhuyih',
          startPosition: { x: 850, y: 250 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 6, defense: 7, speed: 4, morale: 6 },
        },
        {
          id: 'persian-left-wing',
          name: 'Persian Left Wing',
          nameAr: 'الميسرة الفارسية',
          troopType: 'infantry',
          soldierCount: 15000,
          commander: undefined,
          startPosition: { x: 850, y: 750 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 6, defense: 7, speed: 4, morale: 6 },
        },
        {
          id: 'war-elephants',
          name: 'War Elephants Corps',
          nameAr: 'فيلق الأفيال الحربية',
          troopType: 'cavalry', // closest available type for elephants
          soldierCount: 3300, // 33 elephants with crews (~100 per elephant unit)
          commander: undefined,
          startPosition: { x: 750, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 10, defense: 10, speed: 3, morale: 8 },
        },
        {
          id: 'persian-savaran-right',
          name: 'Savaran Heavy Cavalry (Right)',
          nameAr: 'فرسان السواران - يمين',
          troopType: 'cavalry',
          soldierCount: 6000,
          commander: undefined,
          startPosition: { x: 950, y: 200 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 8, morale: 7 },
        },
        {
          id: 'persian-savaran-left',
          name: 'Savaran Heavy Cavalry (Left)',
          nameAr: 'فرسان السواران - يسار',
          troopType: 'cavalry',
          soldierCount: 6000,
          commander: undefined,
          startPosition: { x: 950, y: 800 },
          startFormation: 'wedge',
          startFacing: Math.PI,
          stats: { attack: 9, defense: 8, speed: 8, morale: 7 },
        },
        {
          id: 'persian-archers',
          name: 'Persian Archers',
          nameAr: 'الرماة الفرس',
          troopType: 'archers',
          soldierCount: 10000,
          commander: undefined,
          startPosition: { x: 800, y: 500 },
          startFormation: 'line',
          startFacing: Math.PI,
          stats: { attack: 7, defense: 4, speed: 4, morale: 6 },
        },
        {
          id: 'rustam-guard',
          name: "Rustam's Royal Guard",
          nameAr: 'حرس رستم الملكي',
          troopType: 'command',
          soldierCount: 5000,
          commander: 'Rustam Farrokhzad',
          startPosition: { x: 1100, y: 400 },
          startFormation: 'defensive_circle',
          startFacing: Math.PI,
          stats: { attack: 8, defense: 9, speed: 5, morale: 8 },
        },
      ],
    },
  ],

  // ─── Battle Phases (total 50 seconds of simulation time) ──────────────────
  phases: [
    // Phase 1: Deployment & Elephant Charge (0-10s)
    {
      id: 'deployment-elephant-charge',
      name: 'Deployment & Elephant Charge',
      nameAr: 'التعبئة وهجوم الأفيال',
      startTime: 0,
      duration: 10,
      description: 'Both armies deploy. Persian war elephants advance, terrifying Muslim horses.',
      actions: [
        // Camera overview
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.5, duration: 3 },
          delay: 0,
        },
        // War elephants advance toward Muslim lines
        {
          type: 'move_unit',
          targetUnitId: 'war-elephants',
          params: { position: { x: 550, y: 500 }, speed: 40 },
          delay: 3,
        },
        // Persian archers advance behind elephants
        {
          type: 'move_unit',
          targetUnitId: 'persian-archers',
          params: { position: { x: 650, y: 500 }, speed: 50 },
          delay: 4,
        },
        // Muslim cavalry panics and retreats slightly
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-cavalry-reserve',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-reserve',
          params: { position: { x: 150, y: 500 }, speed: 80 },
          delay: 6,
        },
        // Muslim line wavers but holds
        {
          type: 'change_formation',
          targetUnitId: 'muslim-center',
          params: { formation: 'defensive_circle' },
          delay: 7,
        },
        // Camera focuses on elephant charge
        {
          type: 'camera_move',
          params: { x: 550, y: 500, zoom: 0.9, duration: 2 },
          delay: 5,
        },
        // Persian center advances behind elephants
        {
          type: 'move_unit',
          targetUnitId: 'persian-center',
          params: { position: { x: 700, y: 500 }, speed: 45 },
          delay: 5,
        },
      ],
      triggers: [],
    },
    // Phase 2: Reinforcements & Anti-Elephant Tactics (10-20s)
    {
      id: 'reinforcements-anti-elephant',
      name: "Reinforcements & Anti-Elephant Tactics",
      nameAr: 'التعزيزات وتكتيكات مضادة للأفيال',
      startTime: 10,
      duration: 10,
      description: "Al-Qa'qa' arrives from the west. Disguised camels and archers neutralize the elephants.",
      actions: [
        // Al-Qa'qa's dramatic arrival from the far west
        {
          type: 'set_behavior',
          targetUnitId: 'qaqa-reinforcements',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'qaqa-reinforcements',
          params: { position: { x: 300, y: 500 }, speed: 120 },
          delay: 0,
        },
        // Camera pans to show reinforcements arriving
        {
          type: 'camera_move',
          params: { x: 200, y: 500, zoom: 0.8, duration: 2 },
          delay: 0,
        },
        // Muslim archers target elephant eyes/trunks
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-archers',
          params: { targetId: 'war-elephants' },
          delay: 3,
        },
        // Muslim cavalry regroups (no longer panicking)
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-cavalry-reserve',
          params: { behavior: 'regrouping' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-reserve',
          params: { position: { x: 250, y: 350 }, speed: 90 },
          delay: 4,
        },
        // Elephants are neutralized — they retreat in panic
        {
          type: 'set_behavior',
          targetUnitId: 'war-elephants',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'war-elephants',
          params: { position: { x: 900, y: 600 }, speed: 50 },
          delay: 6,
        },
        {
          type: 'change_formation',
          targetUnitId: 'war-elephants',
          params: { formation: 'scattered' },
          delay: 7,
        },
        // Muslim center reforms into line
        {
          type: 'change_formation',
          targetUnitId: 'muslim-center',
          params: { formation: 'line' },
          delay: 7,
        },
        // Camera shows elephants retreating
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.7, duration: 2 },
          delay: 6,
        },
        // Al-Qa'qa' takes position in the line
        {
          type: 'move_unit',
          targetUnitId: 'qaqa-reinforcements',
          params: { position: { x: 380, y: 450 }, speed: 100 },
          delay: 8,
        },
      ],
      triggers: [],
    },
    // Phase 3: Fierce Melee — Night of Clanging (20-32s)
    {
      id: 'fierce-melee',
      name: 'Fierce Melee — Night of Clanging',
      nameAr: 'القتال العنيف — ليلة الهرير',
      startTime: 20,
      duration: 12,
      description: 'Full infantry engagement across the line. Back-and-forth fighting through day and night.',
      actions: [
        // Full Muslim advance
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center',
          params: { behavior: 'advancing' },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 550, y: 500 }, speed: 70 },
          delay: 0,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 550, y: 300 }, speed: 70 },
          delay: 0.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 550, y: 700 }, speed: 70 },
          delay: 0.5,
        },
        // Persian flanks engage
        {
          type: 'move_unit',
          targetUnitId: 'persian-right-wing',
          params: { position: { x: 650, y: 250 }, speed: 60 },
          delay: 1,
        },
        {
          type: 'move_unit',
          targetUnitId: 'persian-left-wing',
          params: { position: { x: 650, y: 750 }, speed: 60 },
          delay: 1,
        },
        // Savaran cavalry flanking attempts
        {
          type: 'move_unit',
          targetUnitId: 'persian-savaran-right',
          params: { position: { x: 500, y: 150 }, speed: 90 },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'persian-savaran-left',
          params: { position: { x: 500, y: 850 }, speed: 90 },
          delay: 2,
        },
        // Engagements across the line
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-center',
          params: { targetId: 'persian-center' },
          delay: 3,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-right-wing',
          params: { targetId: 'persian-right-wing' },
          delay: 3.5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-left-wing',
          params: { targetId: 'persian-left-wing' },
          delay: 3.5,
        },
        // Muslim cavalry counters Savaran on the right
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-cavalry-reserve',
          params: { behavior: 'flanking' },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-cavalry-reserve',
          params: { position: { x: 500, y: 150 }, speed: 100 },
          delay: 4,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-cavalry-reserve',
          params: { targetId: 'persian-savaran-right' },
          delay: 6,
        },
        // Camera shows the full melee
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.55, duration: 2 },
          delay: 0,
        },
        // Night of Clanging — intense close combat
        {
          type: 'camera_move',
          params: { x: 600, y: 450, zoom: 0.8, duration: 2 },
          delay: 6,
        },
        // Persian center pushes back slightly
        {
          type: 'move_unit',
          targetUnitId: 'persian-center',
          params: { position: { x: 620, y: 500 }, speed: 50 },
          delay: 8,
        },
        // Muslim archers advance and engage
        {
          type: 'move_unit',
          targetUnitId: 'muslim-archers',
          params: { position: { x: 480, y: 500 }, speed: 60 },
          delay: 5,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'muslim-archers',
          params: { targetId: 'persian-archers' },
          delay: 7,
        },
      ],
      triggers: [],
    },
    // Phase 4: Sandstorm & Final Charge (32-42s)
    {
      id: 'sandstorm-final-charge',
      name: 'Sandstorm & Final Charge',
      nameAr: 'العاصفة الرملية والهجوم الأخير',
      startTime: 32,
      duration: 10,
      description: 'A sandstorm blows east into Persian faces. Al-Qa\'qa\' leads the decisive wedge charge.',
      actions: [
        // Sandstorm effect (play_effect)
        {
          type: 'play_effect',
          params: { effect: 'sandstorm', direction: 'east', intensity: 1.0 },
          delay: 0,
        },
        // Camera dramatic zoom
        {
          type: 'camera_move',
          params: { x: 600, y: 500, zoom: 0.6, duration: 2 },
          delay: 0,
        },
        // Al-Qa'qa' forms wedge for the decisive charge
        {
          type: 'change_formation',
          targetUnitId: 'qaqa-reinforcements',
          params: { formation: 'wedge' },
          delay: 1,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'qaqa-reinforcements',
          params: { behavior: 'attacking' },
          delay: 2,
        },
        // Al-Qa'qa' charges into Persian center
        {
          type: 'move_unit',
          targetUnitId: 'qaqa-reinforcements',
          params: { position: { x: 750, y: 450 }, speed: 140 },
          delay: 2,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'qaqa-reinforcements',
          params: { targetId: 'persian-center' },
          delay: 4,
        },
        // Muslim center pushes forward with the storm at their backs
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center',
          params: { behavior: 'attacking' },
          delay: 2,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 700, y: 500 }, speed: 80 },
          delay: 2,
        },
        // Both wings push forward
        {
          type: 'move_unit',
          targetUnitId: 'muslim-right-wing',
          params: { position: { x: 700, y: 280 }, speed: 80 },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-left-wing',
          params: { position: { x: 700, y: 720 }, speed: 80 },
          delay: 3,
        },
        // Persian morale drops — Savaran start retreating
        {
          type: 'set_behavior',
          targetUnitId: 'persian-savaran-right',
          params: { behavior: 'retreating' },
          delay: 6,
        },
        {
          type: 'move_unit',
          targetUnitId: 'persian-savaran-right',
          params: { position: { x: 1000, y: 200 }, speed: 90 },
          delay: 6,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'persian-savaran-left',
          params: { behavior: 'retreating' },
          delay: 7,
        },
        {
          type: 'move_unit',
          targetUnitId: 'persian-savaran-left',
          params: { position: { x: 1000, y: 850 }, speed: 90 },
          delay: 7,
        },
        // Camera follows the charge
        {
          type: 'camera_move',
          params: { x: 700, y: 480, zoom: 0.75, duration: 2 },
          delay: 3,
        },
        // Persian center starts to crack
        {
          type: 'change_formation',
          targetUnitId: 'persian-center',
          params: { formation: 'scattered' },
          delay: 8,
        },
      ],
      triggers: [],
    },
    // Phase 5: Rustam Falls & Persian Rout (42-50s)
    {
      id: 'rustam-falls-rout',
      name: "Rustam Falls & Persian Rout",
      nameAr: 'مقتل رستم وانهيار الفرس',
      startTime: 42,
      duration: 8,
      description: "Rustam is killed. The Persian command collapses. Mass rout toward the river — many drown.",
      actions: [
        // Al-Qa'qa' charges toward Rustam's position
        {
          type: 'move_unit',
          targetUnitId: 'qaqa-reinforcements',
          params: { position: { x: 1050, y: 400 }, speed: 130 },
          delay: 0,
        },
        {
          type: 'attack_unit',
          targetUnitId: 'qaqa-reinforcements',
          params: { targetId: 'rustam-guard' },
          delay: 1.5,
        },
        // Rustam's guard is destroyed (Rustam killed)
        {
          type: 'set_behavior',
          targetUnitId: 'rustam-guard',
          params: { behavior: 'retreating' },
          delay: 2,
        },
        {
          type: 'change_formation',
          targetUnitId: 'rustam-guard',
          params: { formation: 'scattered' },
          delay: 2.5,
        },
        {
          type: 'destroy_unit',
          targetUnitId: 'rustam-guard',
          params: { cause: 'commander_killed' },
          delay: 3,
        },
        // Persian army collapses — mass rout
        {
          type: 'set_behavior',
          targetUnitId: 'persian-center',
          params: { behavior: 'retreating' },
          delay: 3,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'persian-right-wing',
          params: { behavior: 'retreating' },
          delay: 3.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'persian-left-wing',
          params: { behavior: 'retreating' },
          delay: 3.5,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'persian-archers',
          params: { behavior: 'retreating' },
          delay: 4,
        },
        // Persians flee toward the river
        {
          type: 'move_unit',
          targetUnitId: 'persian-center',
          params: { position: { x: 1250, y: 550 }, speed: 100 },
          delay: 3.5,
        },
        {
          type: 'move_unit',
          targetUnitId: 'persian-right-wing',
          params: { position: { x: 1250, y: 300 }, speed: 95 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'persian-left-wing',
          params: { position: { x: 1250, y: 750 }, speed: 95 },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'persian-archers',
          params: { position: { x: 1250, y: 600 }, speed: 90 },
          delay: 4.5,
        },
        // Scattered rout formations
        {
          type: 'change_formation',
          targetUnitId: 'persian-right-wing',
          params: { formation: 'scattered' },
          delay: 4.5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'persian-left-wing',
          params: { formation: 'scattered' },
          delay: 5,
        },
        {
          type: 'change_formation',
          targetUnitId: 'persian-archers',
          params: { formation: 'scattered' },
          delay: 5,
        },
        // Muslim pursuit
        {
          type: 'set_behavior',
          targetUnitId: 'muslim-center',
          params: { behavior: 'pursuing' },
          delay: 4,
        },
        {
          type: 'move_unit',
          targetUnitId: 'muslim-center',
          params: { position: { x: 950, y: 500 }, speed: 90 },
          delay: 4,
        },
        {
          type: 'set_behavior',
          targetUnitId: 'qaqa-reinforcements',
          params: { behavior: 'pursuing' },
          delay: 3,
        },
        {
          type: 'move_unit',
          targetUnitId: 'qaqa-reinforcements',
          params: { position: { x: 1150, y: 450 }, speed: 120 },
          delay: 4,
        },
        // Camera shows the rout toward the river
        {
          type: 'camera_move',
          params: { x: 1000, y: 500, zoom: 0.5, duration: 2 },
          delay: 3,
        },
        // Many Persians drown at the river crossing
        {
          type: 'destroy_unit',
          targetUnitId: 'war-elephants',
          params: { cause: 'drowned_at_river' },
          delay: 6,
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
      text: 'The Battle of Qadisiyyah — Sha\'ban 15 AH. The fate of Persia hangs in the balance.',
      textAr: 'معركة القادسية — شعبان ١٥ هـ. مصير الإمبراطورية الفارسية العظمى معلّق في الميزان، والتاريخ يحبس أنفاسه!',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'elephant-charge',
      time: 5,
      duration: 4,
      text: '33 war elephants thunder forward — living siege towers that terrify the Muslim horses.',
      textAr: 'ثلاثة وثلاثون فيلاً حربياً تتقدم كالرعد القاصف — أبراج حصار حية تهتز لها الأرض وتُرعب خيول المسلمين التي لم ترَ مثلها قط!',
      position: 'bottom',
      style: 'dramatic',
    },
    {
      id: 'qaqa-arrives',
      time: 10,
      duration: 4,
      text: "Al-Qa'qa' ibn Amr arrives with reinforcements from Syria! \"I bring a thousand heroes!\"",
      textAr: 'يصل القعقاع بن عمرو — الفارس الذي يعدل بألف — بتعزيزات من الشام! "جئتكم بألف بطل!"',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'anti-elephant',
      time: 15,
      duration: 4,
      text: 'Camels disguised with cloth charge the elephants. Archers target their eyes. The beasts panic and retreat!',
      textAr: 'إبل مُقنّعة بالقماش الملون تنقضّ على الأفيال في حيلة عبقرية! الرماة يستهدفون أعين الوحوش بدقة متناهية. تفزع الأفيال وتدوس جنودها في تراجعها!',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'melee-begins',
      time: 20,
      duration: 4,
      text: 'The armies clash across the entire front. The grinding battle rages through day and night.',
      textAr: 'يشتبك الجيشان على كامل الجبهة في قتال ضارٍ لا هوادة فيه. تستعر المعركة ليلاً ونهاراً والأرض تشرب الدماء.',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'night-of-clanging',
      time: 26,
      duration: 4,
      text: 'Laylat al-Harir — the Night of Clanging. The sound of swords never ceases until dawn.',
      textAr: 'ليلة الهرير — ليلة لم يشهد التاريخ مثلها! لا يتوقف صليل السيوف وأنين الجرحى حتى يشق الفجر ظلام تلك الليلة الرهيبة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'sandstorm',
      time: 32,
      duration: 4,
      text: 'A mighty sandstorm rises — blowing east into Persian faces! Allah sends His wind.',
      textAr: 'تهبّ عاصفة رملية عاتية من الغرب — تضرب وجوه الفرس وتعمي أبصارهم! أرسل الله جنده من السماء لنصرة عباده المؤمنين.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'final-charge',
      time: 36,
      duration: 4,
      text: "Al-Qa'qa' leads the decisive wedge charge through the storm into the Persian center!",
      textAr: 'يقود القعقاع بن عمرو الهجوم الحاسم بتشكيل الإسفين المدمر، يشق العاصفة كالسهم نحو قلب الجيش الفارسي!',
      position: 'bottom',
      style: 'normal',
    },
    {
      id: 'rustam-killed',
      time: 42,
      duration: 4,
      text: "Rustam Farrokhzad is killed — crushed beneath his fallen pavilion! The Persian command shatters.",
      textAr: 'يُقتل رستم فرخزاد قائد الفرس — سُحق تحت سرادقه المنهار كما سُحقت أحلام كسرى! تتحطم قيادة الإمبراطورية في لحظة.',
      position: 'center',
      style: 'dramatic',
    },
    {
      id: 'rout-river',
      time: 46,
      duration: 4,
      text: 'The Persian army flees toward the Atiq River. Thousands drown in the crossing. Total victory for Islam.',
      textAr: 'يفرّ الجيش الفارسي المهزوم نحو نهر العتيق في فوضى عارمة. يغرق الآلاف في مياهه المتلاطمة. نصر ساحق مبين للإسلام يفتح أبواب فارس بأسرها!',
      position: 'center',
      style: 'dramatic',
    },
  ],

  // ─── Camera Choreography ───────────────────────────────────────────────────
  cameraScript: [
    // Opening overview
    {
      time: 0,
      position: { x: 600, y: 500 },
      zoom: 0.4,
      duration: 3,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Focus on elephant advance
    {
      time: 4,
      position: { x: 650, y: 500 },
      zoom: 0.85,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Show Muslim line wavering
    {
      time: 7,
      position: { x: 400, y: 500 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Pan to show al-Qa'qa's arrival
    {
      time: 10,
      position: { x: 200, y: 500 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    // Show anti-elephant tactics
    {
      time: 14,
      position: { x: 550, y: 500 },
      zoom: 0.85,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Elephants retreating
    {
      time: 17,
      position: { x: 700, y: 550 },
      zoom: 0.7,
      duration: 2,
      easing: 'power2.inOut',
      type: 'pan',
    },
    // Full battle overview for melee phase
    {
      time: 20,
      position: { x: 600, y: 500 },
      zoom: 0.5,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Night of Clanging — closer view
    {
      time: 26,
      position: { x: 600, y: 450 },
      zoom: 0.75,
      duration: 2,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Sandstorm — dramatic wide shot
    {
      time: 32,
      position: { x: 650, y: 500 },
      zoom: 0.55,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Follow al-Qa'qa's charge
    {
      time: 35,
      position: { x: 700, y: 470 },
      zoom: 0.8,
      duration: 2,
      easing: 'power2.inOut',
      type: 'follow',
      followEntityId: 'qaqa-reinforcements',
    },
    // Rustam's death — focus on command area
    {
      time: 42,
      position: { x: 1050, y: 400 },
      zoom: 0.9,
      duration: 1.5,
      easing: 'power2.inOut',
      type: 'focus',
    },
    // Rout — wide shot showing flight to river
    {
      time: 44,
      position: { x: 1000, y: 500 },
      zoom: 0.45,
      duration: 2,
      easing: 'power2.inOut',
      type: 'overview',
    },
    // Final overview — victory
    {
      time: 48,
      position: { x: 700, y: 500 },
      zoom: 0.35,
      duration: 2,
      easing: 'power2.out',
      type: 'overview',
    },
  ],

  outcome: {
    victor: 'muslim',
    muslimCasualties: 8500,
    enemyCasualties: 30000,
    summary:
      'Catastrophic Persian defeat. Rustam Farrokhzad killed, the Sassanid army annihilated. Opened all of Iraq and Mesopotamia to Muslim conquest and ended Sassanid control west of the Zagros Mountains forever.',
    summaryAr:
      'هزيمة فارسية كارثية. قُتل رستم فرخزاد وأُبيد الجيش الساساني. فتحت المعركة العراق وبلاد الرافدين أمام الفتح الإسلامي وأنهت السيطرة الساسانية غرب جبال زاغروس إلى الأبد.',
    significance:
      'Broke the Sassanid Persian Empire permanently. One of the most important battles in Islamic history, opening the path to the conquest of the entire Persian Empire within a decade.',
  },

  totalDuration: 50, // 50 seconds of simulation
};
