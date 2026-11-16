/**
 * Builds the daily challenge's dataset (Phase 5, docs/phase5/challenge-spec.md
 * section 4) from the validated content and the config in content/game/.
 * Returns the data, the issues that must fail the build, and a report for
 * Mostafa (exclusions, dropped clues, pool sizes, facts awaiting a source).
 */
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ZodType } from 'zod';
import { checkBank } from './bank';
import type { ContentSet, ContentIssue } from '../content/store';
import { aliasForm, stripDiacritics } from '../../shared/arabic';
import { eventSlug } from '../../shared/routes';
import {
  companionFactsSchema,
  exclusionsSchema,
  tiersSchema,
  type GameCity,
  type GameData,
  type GameEvent,
  type GamePerson,
  type LastEra,
  type Tier,
} from '../../shared/gameData';
import { clueLeak, containsQuote, foldForMatch, hasPhrase, maskTerms, nameTokens, parseHijriYear, sentences } from '../../shared/gameText';

export interface GameReport {
  excluded: string[];
  skipped: string[];
  droppedClues: string[];
  pending: string[];
  data: GameData;
}

/**
 * Braces, ornate parentheses and Qur'anic pause marks (U+06D6–U+06ED): the signs
 * of a verse. Checked by code point: the marks combine, so a regex class can't hold them.
 */
export const QURAN_MARKS = {
  test: (text: string): boolean =>
    [...text].some((ch) => {
      const c = ch.codePointAt(0) ?? 0;
      return c === 0x7b || c === 0x7d || c === 0xfd3e || c === 0xfd3f || (c >= 0x6d6 && c <= 0x6ed);
    }),
};

const KINDS = ['غزوة', 'سرية', 'معركة', 'فتح', 'موقعة'];
/** Title words that never identify an event, folded. */
const GENERIC_TITLE = new Set(
  nameTokens(
    'غزوة معركة موقعة سرية فتح الكبرى الصغرى يوم وقعة حصار بيعة صلح هجرة الهجرة إلى في من بن بني بنو أبي ابن على عن ذات ' +
      'جيش الفتوح وفاة مقتل استشهاد بداية تولي الخلافة عام سنة',
  ),
);
const NAME_PARTS = new Set(['بن', 'بنت', 'أبو', 'أبي', 'ابن', 'عبد', 'الله', 'ام', 'أم'].map(foldForMatch));

function readJson<T>(dir: string, file: string, schema: ZodType<T>, issues: ContentIssue[]): T | null {
  const path = join(dir, file);
  if (!existsSync(path)) {
    issues.push({ file: `game/${file}`, message: 'missing file' });
    return null;
  }
  const parsed = schema.safeParse(JSON.parse(readFileSync(path, 'utf8')));
  if (parsed.success) return parsed.data;
  for (const i of parsed.error.issues) issues.push({ file: `game/${file}`, message: `${i.path.join('.')}: ${i.message}` });
  return null;
}

/** The era a person lived to, from the (first) death year. */
export function lastEraOf(deathYear: number): LastEra {
  if (deathYear <= 11) return 'prophet';
  if (deathYear <= 13) return 'abu-bakr';
  if (deathYear <= 23) return 'umar';
  if (deathYear <= 35) return 'uthman';
  if (deathYear <= 40) return 'ali';
  return 'after';
}

export function buildGameData(content: ContentSet, gameDir: string): { report: GameReport | null; issues: ContentIssue[] } {
  const issues: ContentIssue[] = [];
  const exclusions = readJson(gameDir, 'exclusions.json', exclusionsSchema, issues);
  const tiers = readJson(gameDir, 'tiers.json', tiersSchema, issues);
  const facts = readJson(gameDir, 'companion-facts.json', companionFactsSchema, issues);
  if (!exclusions || !tiers || !facts) return { report: null, issues };

  const events = new Map(content.events.map((e) => [e.id, e]));
  const people = new Map(content.people.map((p) => [p.id, p]));
  const cities = new Map(content.cities.map((c) => [c.id, c]));
  const eraIds = new Set(content.eras.map((e) => e.id));
  const unknown = (file: string, kind: string, ids: Iterable<string>, known: { has(id: string): boolean }): void => {
    for (const i of ids) if (!known.has(i)) issues.push({ file: `game/${file}`, message: `unknown ${kind} "${i}"` });
  };
  unknown('exclusions.json', 'era', exclusions.eras.map((e) => e.id), eraIds);
  unknown('exclusions.json', 'event', exclusions.events.map((e) => e.id), events);
  unknown('tiers.json', 'event', [...tiers.events.tier1, ...Object.keys(tiers.events.overrides)], events);
  unknown('tiers.json', 'era', tiers.events.tier2Eras, eraIds);
  unknown('tiers.json', 'person', [...tiers.people.tier1, ...tiers.people.tier3], people);
  unknown('tiers.json', 'city', [...tiers.cities.tier1, ...tiers.cities.tier3], cities);
  unknown('companion-facts.json', 'person', facts.people.map((p) => p.id), people);

  const report: GameReport = { excluded: [], skipped: [], droppedClues: [], pending: [], data: { eras: [], events: [], people: [], cities: [], questions: [], leaders: [] } };
  const excludedEras = new Set(exclusions.eras.map((e) => e.id));
  const excludedEvents = new Map(exclusions.events.map((e) => [e.id, e.reason]));
  const isSensitive = (clue: string): boolean => exclusions.clueWords.some((w) => hasPhrase(clue, w));

  /** Masks, then keeps only safe clues; logs each dropped one under `owner`. */
  const safeClues = (owner: string, raw: string[], terms: Set<string>, keys: string[]): string[] => {
    const out: string[] = [];
    for (const r of raw) {
      const clue = maskTerms(r, terms);
      const leak = clueLeak(clue, keys);
      // No Qur'an text anywhere in the game: verses in the content are set in braces with pause marks.
      const reason = leak ?? (QURAN_MARKS.test(clue) ? 'quran' : isSensitive(clue) ? 'sensitive' : null);
      if (reason) report.droppedClues.push(`${owner} (${reason}): ${clue.replace(/[ً-ٰٟ]/g, '').slice(0, 90)}`);
      else if (!out.includes(clue)) out.push(clue);
    }
    return out;
  };

  report.data.eras = content.eras.filter((e) => !excludedEras.has(e.id)).map((e) => ({ id: e.id, nameAr: e.nameAr }));

  const tier1Events = new Set(tiers.events.tier1);
  const tier2Eras = new Set(tiers.events.tier2Eras);
  for (const e of content.events) {
    if (excludedEras.has(e.eraId)) {
      report.excluded.push(`${e.id}: era "${e.eraId}" is excluded`);
      continue;
    }
    if (excludedEvents.has(e.id)) {
      report.excluded.push(`${e.id}: ${excludedEvents.get(e.id)}`);
      continue;
    }
    const parsed = parseHijriYear(e.date.labelAr);
    if (!parsed) {
      report.skipped.push(`${e.id}: no Hijri year in «${stripDiacritics(e.date.labelAr)}»`);
      continue;
    }
    const plainTitle = stripDiacritics(e.title).trim();
    const first = plainTitle.split(/\s+/)[0];
    const kind = KINDS.includes(first) ? first : e.isBattle ? 'معركة' : 'حدث';
    const terms = new Set<string>();
    for (const word of plainTitle.replace(/[()[\]،,:-]/g, ' ').split(/\s+/)) {
      if (word.length >= 3 && !GENERIC_TITLE.has(nameTokens(word)[0] ?? '')) terms.add(word);
    }
    const keys = [...new Set(nameTokens(e.title))].filter((k) => !GENERIC_TITLE.has(k));
    const clues = safeClues(e.id, [e.summary, ...e.courseOfEvents.slice(0, 3)], terms, keys);
    let excerpt = safeClues(`${e.id} excerpt`, e.courseOfEvents.slice(0, 2), terms, keys);
    if (excerpt.join('').length < 90 && clues[0] && clues[0] !== excerpt[0]) excerpt = [clues[0], ...excerpt];
    const tier: Tier =
      tiers.events.overrides[e.id] ??
      (tier1Events.has(e.id) ? 1 : tier2Eras.has(e.eraId) || (tiers.events.tier2WithForces && e.forces) ? 2 : 3);
    const force = (c?: { value?: number; textAr: string }) => (c?.value != null ? { value: c.value, textAr: c.textAr } : undefined);
    const event: GameEvent = {
      id: e.id,
      slug: eventSlug(e),
      title: e.title,
      year: parsed.year,
      disputed: parsed.disputed,
      dateLabel: e.date.labelAr,
      place: e.location.nameAr,
      lat: e.location.coordinates[0],
      lon: e.location.coordinates[1],
      era: e.eraId,
      battle: e.isBattle,
      kind,
      prophetPresent: kind === 'غزوة' || e.id === 'conquest-mecca',
      tier,
      summary: e.summary,
      clues,
      excerpt,
      keys,
    };
    const army = force(e.forces?.army);
    const enemyArmy = force(e.forces?.enemyArmy);
    if (army) event.army = army;
    if (enemyArmy) event.enemyArmy = enemyArmy;
    report.data.events.push(event);
  }

  const personTier = (pid: string): Tier => (tiers.people.tier1.includes(pid) ? 1 : tiers.people.tier3.includes(pid) ? 3 : 2);
  for (const f of facts.people) {
    const p = people.get(f.id);
    if (!p) continue;
    for (const [field, value] of Object.entries({ islam: f.islam, migration: f.migration, knownFor: f.knownFor, deathPlace: f.deathPlace })) {
      if (value.pending) report.pending.push(`${f.id}.${field} = ${value.value}: ${value.pending}`);
      for (const ev of value.evidence) {
        const source = ev.from.startsWith('event:') ? events.get(ev.from.slice(6))?.location.nameAr : p[ev.from as 'bio' | 'role' | 'title'];
        if (source === undefined) issues.push({ file: 'game/companion-facts.json', message: `${f.id}.${field}: unknown source "${ev.from}"` });
        else if (!containsQuote(source, ev.quote))
          issues.push({ file: 'game/companion-facts.json', message: `${f.id}.${field}: «${ev.quote}» is not in ${ev.from}` });
      }
      if (!value.evidence.length && !value.pending)
        issues.push({ file: 'game/companion-facts.json', message: `${f.id}.${field}: no evidence and no pending note` });
    }
    const death = parseHijriYear(p.birthDeath.split(' - ')[1] ?? '');
    if (!death) {
      issues.push({ file: 'game/companion-facts.json', message: `${f.id}: no death year in «${p.birthDeath}»` });
      continue;
    }
    const name = aliasForm(p.name);
    const terms = new Set<string>([name, ...p.aliases.map(aliasForm)]);
    for (const n of [...terms]) for (const w of n.split(/\s+/)) if (w.length >= 3 && !NAME_PARTS.has(foldForMatch(w))) terms.add(w);
    const keys = [...new Set([...terms].flatMap(nameTokens))].filter((k) => !NAME_PARTS.has(k));
    const bio = sentences(p.bio).filter((s) => s.length > 15);
    const raw = [...bio.slice(1, 4), ...bio.slice(0, 1), p.title, p.role].filter(Boolean);
    const person: GamePerson = {
      id: p.id,
      name,
      deathYear: death.year,
      disputed: death.disputed,
      lastEra: lastEraOf(death.year),
      role: p.role,
      title: p.title,
      bioShort: sentences(p.bio).slice(0, 2).join(' '),
      tier: personTier(p.id),
      clues: safeClues(p.id, raw, terms, keys).slice(0, 6),
      keys,
      islam: f.islam.value,
      migration: f.migration.value,
      knownFor: f.knownFor.value,
      deathPlace: f.deathPlace.value,
    };
    report.data.people.push(person);
  }

  const cityTier = (cid: string): Tier => (tiers.cities.tier1.includes(cid) ? 1 : tiers.cities.tier3.includes(cid) ? 3 : 2);
  for (const c of content.cities) {
    const terms = new Set<string>([c.name, ...c.name.split(/\s+/).filter((w) => w.length >= 3)]);
    const keys = [...new Set(nameTokens(c.name))].filter((k) => !['منوره', 'مكرمه'].includes(k));
    const city: GameCity = {
      id: c.id,
      name: c.name,
      lat: c.coordinates[0],
      lon: c.coordinates[1],
      description: c.description,
      tier: cityTier(c.id),
      clues: safeClues(c.id, sentences(`${c.description} ${c.significance}`), terms, keys).slice(0, 5),
      keys,
    };
    report.data.cities.push(city);
  }

  // Leaders: people whose role in a kept battle names them as its commander.
  const LEAD = /قائد|أمير|قيادة|قاد/;
  const leaders = new Map<string, GameData['leaders'][number]>();
  for (const ge of report.data.events) {
    const e = events.get(ge.id)!;
    if (!e.isBattle) continue;
    for (const r of e.roles) {
      if (r.personId === 'prophet' || !LEAD.test(stripDiacritics(r.roleAr))) continue;
      const p = people.get(r.personId);
      if (!p) continue;
      const l = leaders.get(p.id) ?? { id: p.id, name: aliasForm(p.name), battles: [] };
      if (!l.battles.some((x) => x.event === ge.id)) l.battles.push({ event: ge.id, title: ge.title, year: ge.year, era: ge.era });
      leaders.set(p.id, l);
    }
  }
  report.data.leaders = [...leaders.values()].sort((x, y) => x.id.localeCompare(y.id));

  const bank = checkBank(content, gameDir, { events: new Set(excludedEvents.keys()), eras: excludedEras }, QURAN_MARKS.test);
  issues.push(...bank.issues);
  const withFacts = new Set(facts.people.map((p) => p.id));
  for (const q of bank.questions) {
    if ((q.mode === 'who' || q.mode === 'title') && !withFacts.has(q.answer))
      issues.push({ file: `game/questions/${q.mode}.json`, message: `${q.id}: "${q.answer}" has no «من أكون؟» facts` });
  }
  report.data.questions = bank.questions;

  return { report, issues };
}
