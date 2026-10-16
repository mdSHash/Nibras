// The battle scenario registry, rebuilt from the scenario data files without
// importing src/battlefield/scenarios/index.ts (which pulls in the engine).
// Keys copied from src/battlefield/scenarios/index.ts:320.
import type { BattleScenario } from '../../src/battlefield/types/scenario';
import { battleOfBadr } from '../../src/battlefield/scenarios/badr';
import { battleOfUhud } from '../../src/battlefield/scenarios/uhud';
import { battleOfKhandaq } from '../../src/battlefield/scenarios/khandaq';
import { battleOfKhaybar } from '../../src/battlefield/scenarios/khaybar';
import { conquestOfMecca } from '../../src/battlefield/scenarios/fath-makkah';
import { battleOfHunayn } from '../../src/battlefield/scenarios/hunayn';
import { battleOfYarmouk } from '../../src/battlefield/scenarios/yarmouk';
import { battleOfQadisiyyah } from '../../src/battlefield/scenarios/qadisiyyah';
import { battleOfMutah } from '../../src/battlefield/scenarios/mutah';
import { expeditionOfTabuk } from '../../src/battlefield/scenarios/tabuk';
import { battleOfYamama } from '../../src/battlefield/scenarios/yamama';
import { battleOfNahavand } from '../../src/battlefield/scenarios/nahavand';

export const battleScenarios: Record<string, BattleScenario> = {
  'battle-of-badr': battleOfBadr,
  'battle-of-uhud': battleOfUhud,
  'battle-of-khandaq': battleOfKhandaq,
  'battle-of-khaybar': battleOfKhaybar,
  'conquest-of-mecca': conquestOfMecca,
  'battle-of-hunayn': battleOfHunayn,
  'battle-of-yarmouk': battleOfYarmouk,
  'battle-of-qadisiyyah': battleOfQadisiyyah,
  'battle-of-mutah': battleOfMutah,
  'battle-of-tabuk': expeditionOfTabuk,
  'battle-of-yamama': battleOfYamama,
  'battle-of-nahavand': battleOfNahavand,
};

// The scenarios the event panel offered a replay button for when the baseline was
// recorded (AVAILABLE_BATTLE_SCENARIOS in EventPanel.tsx before Phase 1B). Since
// 1B the panel offers one for every event with a battleScenarioId.
export const PANEL_BATTLE_SCENARIOS = [
  'battle-of-badr',
  'battle-of-uhud',
  'battle-of-khandaq',
  'battle-of-khaybar',
  'conquest-of-mecca',
  'battle-of-hunayn',
  'battle-of-yarmouk',
  'battle-of-qadisiyyah',
  'battle-of-mutah',
  'battle-of-tabuk',
  'battle-of-yamama',
  'battle-of-nahavand',
];
