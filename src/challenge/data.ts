/** The game's dataset and question bank, built from content/ by npm run build:content. */
import type { GameData } from '../../shared/gameData';

export const loadGame = (): Promise<GameData> => import('../generated/game.json').then((m) => m.default as unknown as GameData);
