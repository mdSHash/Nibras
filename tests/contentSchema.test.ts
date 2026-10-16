import { describe, expect, it } from 'vitest';
import { join } from 'node:path';
import { checkContent, readContent, type RawContent, type RawFile } from '../scripts/content/store';
import { battleScenarios } from '../scripts/baseline/scenarios';

const CONTENT_DIR = join(__dirname, '..', 'content');
const SCENARIOS = new Set(Object.keys(battleScenarios));
const { raw, issues: readIssues } = readContent(CONTENT_DIR);

/** A copy of the content with one event file changed. */
function withEvent(id: string, change: (event: Record<string, unknown>) => Record<string, unknown>): RawContent {
  const copy = structuredClone(raw);
  const file = copy.events.find(f => f.file === `events/${id}.json`) as RawFile;
  file.data = change(file.data as Record<string, unknown>);
  return copy;
}
const messages = (content: RawContent): string[] =>
  checkContent(content, SCENARIOS).issues.map(i => `${i.file}: ${i.message}`);
const badr = (raw.events.find(f => f.file === 'events/battle-badr.json') as RawFile).data as Record<string, unknown>;

describe('content/', () => {
  const { content, issues } = checkContent(raw, SCENARIOS);

  it('is valid: every file and every link', () => {
    expect([...readIssues, ...issues]).toEqual([]);
  });

  it('covers the whole content set', () => {
    expect(content.events).toHaveLength(131);
    expect(content.people).toHaveLength(161);
    expect(content.cities).toHaveLength(10);
    expect(content.quranPassages).toHaveLength(51);
    expect(content.eras).toHaveLength(6);
    expect(content.categories).toHaveLength(7);
  });

  it('lists events in timeline order', () => {
    const keys = content.events.map(e => e.date.sortKey);
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
  });
});

describe('the content check fails', () => {
  it('on an unknown or misspelled field', () => {
    expect(messages(withEvent('battle-badr', e => ({ ...e, titel: 'x' })))).toEqual([
      'events/battle-badr.json: (record): Unrecognized key: "titel"',
    ]);
  });

  it('on a missing required field', () => {
    const issues = messages(withEvent('battle-badr', ({ title: _title, ...rest }) => rest));
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/^events\/battle-badr\.json: title:/);
  });

  it('on coordinates outside the globe', () => {
    const location = { ...(badr.location as object), coordinates: [200, 39] };
    expect(messages(withEvent('battle-badr', e => ({ ...e, location })))).toHaveLength(1);
  });

  it('on a file not named after its id', () => {
    expect(messages(withEvent('battle-badr', e => ({ ...e, id: 'battle-badr-2' })))).toEqual([
      'events/battle-badr.json: file name must be battle-badr-2.json',
    ]);
  });

  it('on a link to an unknown person, era, category, Quran passage or replay', () => {
    const issues = messages(
      withEvent('battle-badr', e => ({
        ...e,
        eraId: 'umayyad',
        categoryId: 'festival',
        keyFigures: [{ personId: 'nobody', labelAr: 'أحد' }],
        quran: [{ surah: 2, from: 1, to: 300, labelAr: 'سورة البقرة' }],
        battleScenarioId: 'battle-of-nowhere',
      })),
    );
    expect(issues).toEqual([
      'events/battle-badr.json: unknown era "umayyad"',
      'events/battle-badr.json: unknown category "festival"',
      'events/battle-badr.json: unknown person "nobody" (أحد)',
      'events/battle-badr.json: no Quran passage 2:1-300 in quran/passages.json (سورة البقرة)',
      'events/battle-badr.json: unknown battle scenario "battle-of-nowhere"',
    ]);
  });

  it('when events share a date without tieOrder', () => {
    const date = { ...(badr.date as object) } as Record<string, unknown>;
    delete date.tieOrder;
    const issues = messages(withEvent('battle-badr', e => ({ ...e, date })));
    expect(issues).toHaveLength(1);
    expect(issues[0]).toMatch(/^events\/battle-badr\.json: shares date\.sortKey 624 with .*: set date\.tieOrder$/);
  });

  it('when a person is missing from people-order.json', () => {
    const copy = structuredClone(raw);
    copy.peopleOrder.data = (copy.peopleOrder.data as string[]).filter(id => id !== 'hamza');
    expect(messages(copy)).toEqual(['people-order.json: "hamza" is missing from the list']);
  });

  it('on a duplicate event id', () => {
    const copy = structuredClone(raw);
    copy.events.push({ file: 'events/battle-badr.json', data: badr });
    expect(messages(copy)).toContain('events/battle-badr.json: duplicate event id "battle-badr"');
  });
});
