// Maps a chat citation's battleId (e.g. "badr", the chat KB's battle key) to
// the replay id (e.g. "battle-of-badr"). Events link replays by id
// (content/events, `battleScenarioId`); only the chat still uses battleIds.
const BATTLE_ID_TO_SCENARIO: Record<string, string> = { 'fath-makkah': 'conquest-of-mecca' };

export function resolveScenarioId(battleId: string): string {
  return BATTLE_ID_TO_SCENARIO[battleId] || `battle-of-${battleId}`;
}
