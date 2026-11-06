// The territory map's data: the map follows the timeline, and every row of the ledger reaches it.
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { decodeRing, decodeShape, encodeRing, NO_EVENT_YEAR, periodForYear } from '../shared/territoryMap';
import type { GeneratedTerritoryMap, TerritoryLedgerRow } from '../shared/contentSchema';

const ROOT = join(import.meta.dirname, '..');
const json = <T>(...path: string[]): T => JSON.parse(readFileSync(join(ROOT, ...path), 'utf8')) as T;
const map = json<GeneratedTerritoryMap>('src', 'generated', 'territories.json');
const events = readdirSync(join(ROOT, 'content', 'events')).map(f => json<{ id: string; date: { sortKey: number } }>('content', 'events', f));
const sortKey = new Map(events.map(e => [e.id, e.date.sortKey]));
const ledgerDir = join('content', 'territories', 'ledger');
const rows = readdirSync(join(ROOT, ledgerDir)).flatMap(f => json<TerritoryLedgerRow[]>(ledgerDir, f));
const holders = json<{ holders: { id: string }[] }>('content', 'territories', 'holders.json').holders;

describe('the map follows the timeline', () => {
  it('a row tied to an event has no date of its own', () => {
    for (const row of rows) if (row.ev) expect(row.at).toBeUndefined();
  });

  it('every change tied to an event starts exactly at that event, so the map cannot run ahead or behind', () => {
    for (const row of rows.filter(r => r.ev)) {
      const at = sortKey.get(row.ev!)!;
      const period = periodForYear(map, at)!;
      expect(period.from, row.ev).toBe(at);
      expect(period.causes, row.ev).toContain(row.ev);
    }
  });

  it('every date the app can select has a map, with no gap between periods', () => {
    for (const year of [NO_EVENT_YEAR, ...sortKey.values()]) expect(periodForYear(map, year), String(year)).toBeDefined();
    map.periods.forEach((p, i) => {
      const next = map.periods[i + 1];
      if (next) expect(p.to).toBe(next.from);
      else expect(p.to).toBeUndefined();
    });
  });
});

describe('the map says what the ledger says', () => {
  const shapesAt = (year: number) => periodForYear(map, year)!.areas.map(i => map.shapes[i]);

  it('Syria is Roman before 614, Persian after, and Muslim only after the conquests', () => {
    expect(shapesAt(610).some(s => s.holder === 'byz')).toBe(true);
    const labels = (year: number) => periodForYear(map, year)!.labels;
    expect(labels(610).find(l => l.text === 'جند دمشق')?.holder).toBe('byz');
    expect(labels(620).find(l => l.text === 'جند دمشق')?.holder).toBe('sas');
    expect(labels(632.3).find(l => l.text === 'جند دمشق')?.holder).not.toBe('islam');
  });

  it("names the Muslim state by the date", () => {
    const realm = (year: number) => periodForYear(map, year)!.labels.find(l => l.holder === 'islam' && l.level <= 2)?.text;
    expect(realm(631)).toBe('الدولة الإسلامية');
    const death = sortKey.get('prophet-death')!;
    expect(realm(death - 0.01)).toBe('الدولة الإسلامية');
    expect(realm(death)).toBe('دولة الخلفاء الراشدين');
    expect(realm(640)).toBe('دولة الخلفاء الراشدين');
  });

  it('shows Ali and Muawiya apart at Siffin', () => {
    const holdersAtSiffin = new Set(shapesAt(657).map(s => s.holder));
    expect(holdersAtSiffin.has('ali')).toBe(true);
    expect(holdersAtSiffin.has('muawiya')).toBe(true);
  });

  it('marks as uncertain the land of every row marked so, except where tribal land is soft already', () => {
    const uncertainHolders = new Set(rows.filter(r => r.c === 'uncertain').map(r => r.h));
    for (const h of uncertainHolders) {
      expect(map.shapes.some(s => s.holder === h && s.uncertain), h).toBe(true);
    }
    const legendLines = map.periods.flatMap(p => p.legend).filter(l => l.kind === 'uncertain');
    expect(legendLines.length).toBeGreaterThan(0);
  });

  it('has a color token for every holder, in both themes', () => {
    const css = readFileSync(join(ROOT, 'src', 'index.css'), 'utf8');
    const tokens = holders.map(h => (h.id === 'local' ? 'tribal' : h.id));
    for (const id of tokens) expect(css.match(new RegExp(`--sys-terr-${id}:`, 'g'))?.length, id).toBe(2);
    const rules = readFileSync(join(ROOT, 'src', 'components', 'map', 'territoryMap.css'), 'utf8');
    for (const h of holders) expect(rules, h.id).toContain(`.h-${h.id}`);
  });

  it('keeps every shape on the map, in the extent of the tiles', () => {
    for (const shape of map.shapes) {
      const { coordinates } = decodeShape(shape.rings);
      expect(coordinates.length).toBeGreaterThan(0);
      const points = coordinates.flat(2);
      expect(Math.min(...points.map(p => p[0]))).toBeGreaterThanOrEqual(-14.2);
      expect(Math.max(...points.map(p => p[0]))).toBeLessThanOrEqual(88.2);
      expect(Math.min(...points.map(p => p[1]))).toBeGreaterThanOrEqual(-8.2);
      expect(Math.max(...points.map(p => p[1]))).toBeLessThanOrEqual(58.2);
    }
  });
});

describe('rings as text', () => {
  it('come back the same, to a thousandth of a degree', () => {
    const ring = [[39.826, 21.423], [-13.5, -7.25], [87.999, 57.001], [0, 0], [39.826, 21.423]];
    expect(decodeRing(encodeRing(ring))).toEqual(ring);
  });
});
