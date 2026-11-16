/**
 * One puzzle per mode, level and day, from the generated dataset
 * (src/generated/game.json). The game shell calls `buildPuzzle`; a practice
 * round passes `practiceRng()` instead of the daily generator.
 */
import type { GameCity, GameData, GameEvent, GamePerson, Tier } from '../../../shared/gameData';
import { stripDiacritics } from '../../../shared/arabic';
import {
  battleOptions,
  fullNameOptions,
  fullPlaceOptions,
  numberOptions,
  pickAnswer,
  placeOptions,
  timeOptions,
  whoOptions,
} from './options';
import type { Level, Mode } from './levels';
import type { Rng } from './seed';

export interface NumberItem {
  id: string;
  tier: Tier;
  event: GameEvent;
  side: 'army' | 'enemyArmy';
  value: number;
  /** The force text verbatim, for the result screen. */
  textAr: string;
  prompt: string;
}

const SHIPS = /سفين|سفن|مراكب|مركب|أسطول|اسطول/;

/** The «رقم اليوم» pool: one item per numeric force. */
export function numberItems(events: readonly GameEvent[]): NumberItem[] {
  const out: NumberItem[] = [];
  for (const event of events) {
    for (const side of ['army', 'enemyArmy'] as const) {
      const force = event[side];
      if (!force || force.value <= 0) continue;
      const unit = SHIPS.test(stripDiacritics(force.textAr)) ? 'مراكب' : 'جيش';
      const whose = side === 'army' ? 'المسلمين' : 'العدو';
      const title = stripDiacritics(event.title);
      out.push({
        id: `${event.id}:${side}`,
        tier: event.tier,
        event,
        side,
        value: force.value,
        textAr: force.textAr,
        prompt: `كم كان عدد ${unit} ${whose} في «${title}»؟`,
      });
    }
  }
  return out;
}

export type Puzzle =
  | { mode: 'who'; answer: GamePerson; options: GamePerson[] }
  | { mode: 'battle'; answer: GameEvent; options: GameEvent[] }
  | { mode: 'place'; answer: GameCity; options: GameCity[] }
  | { mode: 'time'; answer: GameEvent; options: number[] }
  | { mode: 'number'; answer: NumberItem; options: number[] }
  | { mode: 'full'; answer: GameEvent; nameOptions: GameEvent[]; placeOptions: GameEvent[]; yearOptions: number[] };

/** The pool each mode draws from (items with too few clues to play are left out). */
export function modePool(data: GameData, mode: Mode): { id: string; tier: Tier }[] {
  switch (mode) {
    case 'who':
      return data.people.filter((p) => p.clues.length >= 2);
    case 'battle':
      return data.events.filter((e) => e.battle && e.clues.length >= 2);
    case 'place':
      return data.cities.filter((c) => c.clues.length >= 2);
    case 'time':
      return data.events;
    case 'number':
      return numberItems(data.events);
    case 'full':
      return data.events.filter((e) => e.excerpt.length > 0);
  }
}

export function buildPuzzle(data: GameData, mode: Mode, level: Level, rng: Rng): Puzzle {
  switch (mode) {
    case 'who': {
      const answer = pickAnswer(modePool(data, 'who') as GamePerson[], level, rng);
      return { mode, answer, options: whoOptions(data.people, answer, rng) };
    }
    case 'battle': {
      const answer = pickAnswer(modePool(data, 'battle') as GameEvent[], level, rng);
      return { mode, answer, options: battleOptions(data.events, answer, rng) };
    }
    case 'place': {
      const answer = pickAnswer(modePool(data, 'place') as GameCity[], level, rng);
      return { mode, answer, options: placeOptions(data.cities, answer, rng) };
    }
    case 'time': {
      const answer = pickAnswer(data.events, level, rng);
      return { mode, answer, options: timeOptions(answer, level, rng) };
    }
    case 'number': {
      const answer = pickAnswer(numberItems(data.events), level, rng);
      return { mode, answer, options: numberOptions(answer.value, level, rng) };
    }
    case 'full': {
      const answer = pickAnswer(modePool(data, 'full') as GameEvent[], level, rng);
      return {
        mode,
        answer,
        nameOptions: fullNameOptions(data.events, answer, rng),
        placeOptions: fullPlaceOptions(data.events, answer, level, rng),
        yearOptions: timeOptions(answer, level, rng),
      };
    }
  }
}
