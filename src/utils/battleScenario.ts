// Maps an EventItem.battleId (e.g. "badr", set via data.ts's BATTLE_ID_MAP)
// to the battlefield scenario registry key (e.g. "battle-of-badr"), used by
// both EventPanel's battle-open handler and ChatPanel's citation clicks so
// there's one place that knows the "fath-makkah" -> "conquest-of-mecca"
// exception.
const BATTLE_ID_TO_SCENARIO: Record<string, string> = { 'fath-makkah': 'conquest-of-mecca' };

export function resolveScenarioId(battleId: string): string {
  return BATTLE_ID_TO_SCENARIO[battleId] || `battle-of-${battleId}`;
}
