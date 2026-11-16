/**
 * The question bank (content/game/questions/<mode>.json, Phase 5B): reads and
 * checks every question against the content. A clue's every source quote must
 * be in the record it names; the answer's name must not show in its own clues;
 * no Qur'an text; nothing excluded.
 */
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { ContentIssue, ContentSet } from '../content/store';
import { aliasForm } from '../../shared/arabic';
import { BANK_LEVELS, questionBankSchema, type BankMode, type BankQuestion } from '../../shared/gameData';
import { containsQuote, foldForMatch, hasPhrase, nameTokens } from '../../shared/gameText';

/** Which kind of record a mode's answer is. */
const ANSWER_KIND: Record<BankMode, 'person' | 'event' | 'city'> = {
  who: 'person', title: 'person', quote: 'person', battle: 'event', year: 'event', number: 'event', order: 'event', there: 'event', place: 'city',
};
const NAME_PARTS = new Set(['بن', 'بنت', 'ابو', 'ابي', 'ابن', 'عبد', 'الله', 'ام'].map(foldForMatch));

export interface BankResult {
  questions: BankQuestion[];
  issues: ContentIssue[];
}

export function checkBank(
  content: ContentSet,
  gameDir: string,
  excluded: { events: Set<string>; eras: Set<string> },
  isQuran: (text: string) => boolean,
): BankResult {
  const dir = join(gameDir, 'questions');
  const issues: ContentIssue[] = [];
  const questions: BankQuestion[] = [];
  if (!existsSync(dir)) return { questions, issues };
  const people = new Map(content.people.map((p) => [p.id, p]));
  const events = new Map(content.events.map((e) => [e.id, e]));
  const cities = new Map(content.cities.map((c) => [c.id, c]));
  const seen = new Set<string>();

  const fieldText = (kind: string, id: string, from: string): string | undefined => {
    if (kind === 'person') {
      const p = people.get(id);
      return p && ({ bio: p.bio, role: p.role, title: p.title, name: p.name } as Record<string, string>)[from];
    }
    if (kind === 'event') {
      const e = events.get(id);
      if (!e) return undefined;
      const forces = [e.forces?.army?.textAr, e.forces?.enemyArmy?.textAr].filter(Boolean).join(' ');
      return ({ summary: e.summary, course: e.courseOfEvents.join(' '), full: e.fullDescription, date: e.date.labelAr, place: e.location.nameAr, forces, title: e.title } as Record<string, string>)[from];
    }
    const c = cities.get(id);
    return c && ({ description: c.description, significance: c.significance, name: c.name } as Record<string, string>)[from];
  };

  for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
    const where = `game/questions/${file}`;
    const parsed = questionBankSchema.safeParse(JSON.parse(readFileSync(join(dir, file), 'utf8')));
    if (!parsed.success) {
      for (const i of parsed.error.issues) issues.push({ file: where, message: `${i.path.join('.')}: ${i.message}` });
      continue;
    }
    const { mode } = parsed.data;
    if (file !== `${mode}.json`) issues.push({ file: where, message: `file name must be ${mode}.json` });
    const kind = ANSWER_KIND[mode];
    for (const q of parsed.data.questions) {
      const at = `${q.id}`;
      if (seen.has(q.id)) issues.push({ file: where, message: `${at}: duplicate id` });
      seen.add(q.id);
      const answerId = mode === 'number' ? q.answer.replace(/:(army|enemyArmy)$/, '') : q.answer;
      const known = kind === 'person' ? people.has(answerId) : kind === 'event' ? events.has(answerId) : cities.has(answerId);
      if (!known) issues.push({ file: where, message: `${at}: unknown ${kind} "${answerId}"` });
      const event = kind === 'event' ? events.get(answerId) : undefined;
      if (excluded.events.has(answerId) || (event && excluded.eras.has(event.eraId))) issues.push({ file: where, message: `${at}: "${answerId}" is excluded from the game` });
      // The answer's own name must not show in its clues or prompt.
      const name = kind === 'person' ? people.get(answerId)?.name : kind === 'event' ? event?.title : cities.get(answerId)?.name;
      const keys = name ? nameTokens(aliasForm(name)).filter((k) => !NAME_PARTS.has(k) && k.length >= 3) : [];
      const texts = [...q.clues.map((c) => c.text), ...(q.prompt ? [q.prompt] : [])];
      for (const t of texts) {
        if (isQuran(t)) issues.push({ file: where, message: `${at}: Qur'an text in «${t.slice(0, 40)}»` });
        const leak = keys.find((k) => hasPhrase(t, k));
        if (leak && mode !== 'year' && mode !== 'number') issues.push({ file: where, message: `${at}: «${t.slice(0, 40)}» names the answer («${leak}»)` });
      }
      for (const clue of q.clues) {
        for (const s of clue.sources) {
          const [refKind, refId] = s.of ? (s.of.split(/:(.*)/s) as [string, string]) : [kind, answerId];
          const source = fieldText(refKind, refId, s.from);
          if (source === undefined) issues.push({ file: where, message: `${at}: no ${s.from} on ${refKind} "${refId}"` });
          else if (!containsQuote(source, s.quote)) issues.push({ file: where, message: `${at}: «${s.quote.slice(0, 50)}» is not in the ${s.from} of ${refKind} "${refId}"` });
        }
      }
      questions.push({ ...q, mode });
    }
  }
  return { questions, issues };
}

/** Questions per mode and level, for the report. */
export function bankCounts(questions: readonly BankQuestion[]): Record<string, Record<string, number>> {
  const out: Record<string, Record<string, number>> = {};
  for (const q of questions) {
    out[q.mode] ??= Object.fromEntries(BANK_LEVELS.map((l) => [l, 0]));
    out[q.mode][q.level]++;
  }
  return out;
}
