/**
 * A round of the daily challenge, built from the question bank
 * (content/game/questions/) and the dataset: the question, its clues, five
 * options at the level's distance, and what a wrong pick teaches (tiles and a
 * plain sentence). UI-free; the game renders it.
 */
import type { BankQuestion, GameCity, GameData, GameEvent, GamePerson } from '../../../shared/gameData';
import { FACT_TITLES } from '../../../shared/gameLabels';
import { stripDiacritics, toArabicIndic } from '../../../shared/arabic';
import { yearDiff } from '../../../shared/gameText';
import { compareBattles, comparePeople, yearLabel, type Mark } from './compare';
import { directionAr, distanceKm, roundKm } from './geo';
import { LEVEL_CONFIG, MAX_WRONG, OPTION_COUNT, type Level, type Mode } from './levels';
import { numberOptions, preferred, yearOptions } from './options';
import { dailyRng, hash, practiceRng, puzzleNumber, rngFrom, shuffle, type Rng } from './seed';

/** The first daily puzzle. */
export const LAUNCH_DATE = '2026-11-16';

export interface Cell { text: string; mark: Mark; sub?: string }
export interface Option {
  id: string;
  label: string;
  link?: string;
  /** A line about this option, verbatim from Nibras (the first sentence of a bio, summary or description). */
  about?: string;
  /** A short tag under the name: a person's title or an event's date, verbatim. */
  tag?: string;
}
export interface Teach { cells: Cell[]; sentence?: string }

export interface Round {
  mode: Mode;
  level: Level;
  questionId: string;
  puzzle: number;
  prompt: string;
  clues: string[];
  heads: string[];
  options: Option[];
  answerId: string;
  answerLabel: string;
  /** A verbatim Nibras fact line for the result. */
  fact: string;
  link: string;
  /** What `link` opens, for «اعرف أكتر عن …». */
  linkLabel: string;
  /** What a wrong pick teaches. */
  teach: (optionId: string) => Teach;
}

/** Nibras's pages, seen from the challenge (it lives at <base>/challenge/). */
export function nibrasBase(): string {
  const base = (import.meta.env?.BASE_URL ?? '/').replace(/challenge\/?$/, '');
  return base.endsWith('/') ? base : `${base}/`;
}
const personLink = (id: string): string => `${nibrasBase()}person/${id}/`;
const eventLink = (e: GameEvent): string => `${nibrasBase()}event/${encodeURIComponent(e.slug)}/`;
const bare = (t: string): string => stripDiacritics(t).replace(/\s+/g, ' ').trim();
/** The first sentence of a Nibras text, unchanged. */
export const firstSentence = (t: string): string => t.trim().split(/(?<=[.؟!])\s/)[0];
const personAbout = (p: GamePerson | undefined): Pick<Option, 'about' | 'tag'> => (p ? { about: firstSentence(p.bioShort), tag: p.title } : {});
const eventAbout = (e: GameEvent): Pick<Option, 'about' | 'tag'> => ({ about: firstSentence(e.summary), tag: e.dateLabel });

/** The bank's questions for a mode and level, in this level's fixed cycle order. */
export function cycle(data: GameData, mode: Mode, level: Level): BankQuestion[] {
  const qs = data.questions.filter((q) => q.mode === mode && q.level === level).sort((a, b) => a.id.localeCompare(b.id));
  return shuffle(qs, rngFrom(hash(`${mode}|${level}|cycle`)));
}

/** Today's round, the same for everyone. */
export function dailyRound(data: GameData, mode: Mode, level: Level, date: string): Round {
  const qs = cycle(data, mode, level);
  const n = puzzleNumber(date, LAUNCH_DATE);
  const q = qs[(((n - 1) % qs.length) + qs.length) % qs.length];
  return buildRound(data, q, level, dailyRng(date, mode, level), n);
}

/** A practice round: a random question from the level, random options. */
export function practiceRound(data: GameData, mode: Mode, level: Level, avoid?: string): Round {
  const rng = practiceRng();
  const qs = cycle(data, mode, level).filter((q) => q.id !== avoid);
  return buildRound(data, qs[Math.floor(rng() * qs.length)], level, rng, 0);
}

const sameFacts = (a: GamePerson, b: GamePerson): number =>
  Number(a.islam === b.islam) + Number(a.migration === b.migration) + Number(a.knownFor === b.knownFor) + Number(a.deathPlace === b.deathPlace) + Number(a.lastEra === b.lastEra);

/** The level's preference: far apart and famous at easy, the same tier at mid, close at hard. */
function byLevel<T extends { id: string; tier?: number }>(level: Level, pool: readonly T[], answer: T, rng: Rng, closeness: (x: T) => number): T[] {
  const prefer =
    level === 'easy' ? (x: T) => (x.tier === 1 ? 10 : 0) - closeness(x) : level === 'mid' ? (x: T) => (x.tier === answer.tier ? 1 : 0) + closeness(x) / 10 : closeness;
  return preferred(pool, answer.id, OPTION_COUNT - 1, rng, prefer);
}

export function buildRound(data: GameData, q: BankQuestion, level: Level, rng: Rng, puzzle: number): Round {
  const eraName = (id: string): string => data.eras.find((e) => e.id === id)?.nameAr ?? '';
  const base = { mode: q.mode as Mode, level, questionId: q.id, puzzle, clues: q.clues.map((c) => c.text) };
  const event = (id: string): GameEvent => {
    const e = data.events.find((x) => x.id === id);
    if (!e) throw new Error(`unknown event ${id}`);
    return e;
  };
  switch (q.mode) {
    case 'who': {
      const a = data.people.find((p) => p.id === q.answer)!;
      const options = shuffle([a, ...byLevel(level, data.people, a, rng, (p) => sameFacts(p, a))], rng);
      return {
        ...base,
        prompt: 'مين الشخصية دي؟',
        heads: [FACT_TITLES.islam, FACT_TITLES.migration, FACT_TITLES.knownFor, level === 'hard' ? 'سنة الوفاة' : FACT_TITLES.lastEra, FACT_TITLES.deathPlace],
        options: options.map((p) => ({ id: p.id, label: p.name, link: personLink(p.id), ...personAbout(p) })),
        answerId: a.id,
        answerLabel: a.name,
        linkLabel: a.name,
        fact: `${bare(a.role)} · توفي سنة ${toArabicIndic(a.deathYear)} هـ`,
        link: personLink(a.id),
        teach: (id) => {
          const c = comparePeople(data.people.find((p) => p.id === id)!, a, level);
          return { cells: c.tiles.map((t) => ({ text: t.value, mark: t.mark, ...(t.arrow ? { sub: t.arrow } : {}) })), sentence: c.sentence };
        },
      };
    }
    case 'battle': {
      const a = event(q.answer);
      const battles = data.events.filter((e) => e.battle);
      const close = (e: GameEvent): number => (e.era === a.era ? 5 : 0) - Math.min(5, Math.abs(yearDiff(e.year, a.year)) / 3);
      const options = shuffle([a, ...byLevel(level, battles, a, rng, close)], rng);
      return {
        ...base,
        prompt: 'أنهي معركة دي؟',
        heads: ['السنة', 'العهد', 'النبي ﷺ فيها؟', 'المسافة'],
        options: options.map((e) => ({ id: e.id, label: bare(e.title), link: eventLink(e), ...eventAbout(e) })),
        answerId: a.id,
        answerLabel: bare(a.title),
        linkLabel: bare(a.title),
        fact: `${bare(a.dateLabel)} · ${bare(a.place)} · ${eraName(a.era)}`,
        link: eventLink(a),
        teach: (id) => {
          const c = compareBattles(event(id), a, data.eras);
          return { cells: c.tiles.map((t) => ({ text: t.value, mark: t.mark, ...(t.arrow ? { sub: t.arrow } : {}) })), sentence: c.sentence };
        },
      };
    }
    case 'place': {
      const places = placePool(data);
      const a = places.find((p) => p.id === q.answer)!;
      // Far apart at easy, any at mid, the nearest at hard.
      const close = (p: Place): number => (level === 'hard' ? -distanceKm(p, a) : distanceKm(p, a)) / 500;
      const others = level === 'mid' ? preferred(places, a.id, OPTION_COUNT - 1, rng, () => 0) : preferred(places, a.id, OPTION_COUNT - 1, rng, close);
      const options = shuffle([a, ...others], rng);
      return {
        ...base,
        prompt: a.city ? 'أنهي مدينة دي؟' : 'أنهي مكان ده؟',
        heads: ['بعدها عن المكان', 'ناحية'],
        options: options.map((p) => ({ id: p.id, label: p.label, link: p.link, about: p.about })),
        answerId: a.id,
        answerLabel: a.label,
        linkLabel: a.label,
        fact: a.fact,
        link: a.link,
        teach: (id) => {
          const g = places.find((p) => p.id === id)!;
          const km = distanceKm(g, a);
          return {
            cells: [{ text: `${toArabicIndic(roundKm(km))} كم`, mark: km < 400 ? 'yellow' : 'red' }, { text: directionAr(g, a), mark: 'red' }],
            sentence: `${a.city ? 'المدينة اللي بندوّر عليها' : 'المكان اللي بندوّر عليه'} على بعد ${toArabicIndic(roundKm(km))} كم منها ناحية ${directionAr(g, a)}.`,
          };
        },
      };
    }
    case 'year': {
      const a = event(q.answer);
      const years = yearOptions(a, level, rng);
      return {
        ...base,
        prompt: q.prompt ?? 'حصل سنة كام؟',
        heads: ['قبلها ولا بعدها؟'],
        options: years.map((y) => ({ id: `y${y}`, label: yearLabel(y) })),
        answerId: `y${a.year}`,
        answerLabel: yearLabel(a.year),
        fact: `${bare(a.title)} · ${bare(a.dateLabel)}`,
        link: eventLink(a),
        linkLabel: bare(a.title),
        teach: (id) => {
          const y = Number(id.slice(1));
          const later = a.year > y;
          return { cells: [{ text: later ? 'بعد كده ↑' : 'قبل كده ↓', mark: 'red' }], sentence: later ? 'حصل بعد السنة دي.' : 'حصل قبل السنة دي.' };
        },
      };
    }
    case 'number': {
      const [id, side] = q.answer.split(':') as [string, 'army' | 'enemyArmy'];
      const e = event(id);
      const force = e[side]!;
      const nums = numberOptions(force.value, level, rng);
      return {
        ...base,
        prompt: q.prompt ?? 'كانوا كام؟',
        heads: ['أكبر ولا أصغر؟'],
        options: nums.map((n) => ({ id: `n${n}`, label: toArabicIndic(n.toLocaleString('en-US')) })),
        answerId: `n${force.value}`,
        answerLabel: toArabicIndic(force.value.toLocaleString('en-US')),
        fact: `${bare(force.textAr)} · ${bare(e.title)}`,
        link: eventLink(e),
        linkLabel: bare(e.title),
        teach: (oid) => {
          const n = Number(oid.slice(1));
          const bigger = force.value > n;
          return { cells: [{ text: bigger ? 'الصح أكبر ↑' : 'الصح أصغر ↓', mark: Math.abs(force.value - n) / force.value <= 0.5 ? 'yellow' : 'red' }] };
        },
      };
    }
    case 'leader': {
      const battle = event(q.event!);
      const a = data.leaders.find((l) => l.id === q.answer)!;
      const eraIndex = (id: string): number => data.eras.findIndex((x) => x.id === id);
      const close = (l: (typeof data.leaders)[number]): number => (l.battles.some((b) => b.era === battle.era) ? 5 : 0) + Math.min(3, l.battles.length) / 3;
      const pool = data.leaders.map((l) => ({ ...l, tier: l.battles.length >= 3 ? 1 : 2 }));
      const ans = pool.find((l) => l.id === a.id)!;
      const options = shuffle([ans, ...byLevel(level, pool, ans, rng, close)], rng);
      return {
        ...base,
        prompt: q.prompt ?? 'مين القائد؟',
        heads: ['قاد المسلمين في', 'العهد', 'السنة'],
        options: options.map((l) => ({ id: l.id, label: l.name, link: personLink(l.id), ...personAbout(data.people.find((p) => p.id === l.id)) })),
        answerId: a.id,
        answerLabel: a.name,
        fact: `${bare(battle.title)} · ${bare(battle.dateLabel)}`,
        link: personLink(a.id),
        linkLabel: a.name,
        teach: (id) => {
          const g = data.leaders.find((l) => l.id === id)!;
          const b = [...g.battles].sort((x, y) => Math.abs(yearDiff(x.year, battle.year)) - Math.abs(yearDiff(y.year, battle.year)))[0];
          const gap = Math.abs(eraIndex(b.era) - eraIndex(battle.era));
          const d = yearDiff(battle.year, b.year);
          return {
            cells: [
              { text: bare(b.title), mark: 'red' },
              { text: eraName(b.era), mark: gap === 0 ? 'green' : gap === 1 ? 'yellow' : 'red' },
              { text: yearLabel(b.year), mark: d === 0 ? 'green' : Math.abs(d) <= 2 ? 'yellow' : 'red', ...(d ? { sub: d > 0 ? '↑ المعركة بعدها' : '↓ المعركة قبلها' } : {}) },
            ],
            sentence: `${g.name} قاد المسلمين في «${bare(b.title)}». القائد اللي بندوّر عليه قاد «${bare(battle.title)}».`,
          };
        },
      };
    }
    case 'era': {
      const a = event(q.answer);
      const index = (id: string): number => data.eras.findIndex((x) => x.id === id);
      return {
        ...base,
        prompt: q.prompt ?? 'أنهي عهد؟',
        heads: ['قبله ولا بعده؟'],
        options: data.eras.map((x) => ({ id: x.id, label: x.nameAr })),
        answerId: a.era,
        answerLabel: eraName(a.era),
        fact: `${bare(a.title)} · ${bare(a.dateLabel)}`,
        link: eventLink(a),
        linkLabel: bare(a.title),
        teach: (id) => {
          const later = index(a.era) > index(id);
          return { cells: [{ text: later ? 'بعد كده ↑' : 'قبل كده ↓', mark: 'red' }], sentence: later ? 'الحدث حصل في عهد بعد ده.' : 'الحدث حصل في عهد قبل ده.' };
        },
      };
    }
    case 'order': {
      const ids = q.answer.split(',');
      const evs = ids.map(event);
      return {
        ...base,
        prompt: 'رتّب الأحداث دي من الأقدم للأحدث',
        heads: ['١', '٢', '٣', '٤'],
        options: shuffle(evs, rng).map((e) => ({ id: e.id, label: bare(e.title), link: eventLink(e), ...eventAbout(e) })),
        answerId: ids.join(','),
        answerLabel: evs.map((e) => bare(e.title)).join(' ← '),
        fact: evs.map((e) => `${bare(e.title)}: ${bare(e.dateLabel)}`).join(' · '),
        link: eventLink(evs[0]),
        linkLabel: bare(evs[0].title),
        teach: (attempt) => {
          const guess = attempt.split(',');
          return { cells: guess.map((id, i) => ({ text: bare(event(id).title), mark: id === ids[i] ? 'green' : 'red' })) };
        },
      };
    }
    default:
      throw new Error(`no rounds for mode ${q.mode}`);
  }
}

interface Place { id: string; label: string; lat: number; lon: number; city: boolean; fact: string; link: string; about: string }

/** «المكان»'s answers and options: the cities, and every event's place under its short name (one per name). */
export function placePool(data: GameData): Place[] {
  const out: Place[] = data.cities.map((c: GameCity) => ({ id: c.id, label: bare(c.name), lat: c.lat, lon: c.lon, city: true, fact: bare(c.description), link: nibrasBase(), about: firstSentence(c.description) }));
  const names = new Set(out.map((p) => p.label.split(' (')[0]));
  for (const e of data.events) {
    const label = bare(e.place).split('،')[0].trim();
    if (names.has(label) || /^(مكة|المدينة)/.test(label)) continue;
    names.add(label);
    out.push({ id: `event:${e.id}`, label, lat: e.lat, lon: e.lon, city: false, fact: `${bare(e.title)} · ${bare(e.place)}`, link: eventLink(e), about: `هنا حصلت «${bare(e.title)}».` });
  }
  return out;
}

/** Clues open now: the level's start, then one more every two wrong picks. */
export function cluesOpen(level: Level, wrong: number, total: number): number {
  return Math.min(total, LEVEL_CONFIG[level].cluesAtStart + Math.floor(wrong / 2));
}

/** The level suggestion after a round: harder when fast, easier after a loss or a win on the last try. */
export function suggestLevel(level: Level, won: boolean, picks: number, seconds: number): Level | null {
  const order: Level[] = ['easy', 'mid', 'hard'];
  const i = order.indexOf(level);
  const cfg = LEVEL_CONFIG[level];
  if (won && i < 2 && (picks <= cfg.fastPicks || seconds <= cfg.fastSeconds)) return order[i + 1];
  if ((!won || picks > MAX_WRONG) && i > 0) return order[i - 1];
  return null;
}
