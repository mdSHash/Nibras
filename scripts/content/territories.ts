/**
 * Builds the territory map at build time, so the app ships polygons instead of @turf/turf.
 * The inputs are in content/territories: the ledger (who held which region from when, with its
 * sources), the region shapes, the holders' names, and Natural Earth's coast. A row tied to an event
 * takes its date from that event's date.sortKey, so the map and the timeline cannot drift apart.
 *
 * Every line drawn here is an interpretation: the chronicles never draw a border
 * (docs/territories/BORDERS.md). Quotes are checked apart, by scripts/territories/checkLedger.ts,
 * because that needs the network.
 */
import * as turf from '@turf/turf';
import type { Feature, MultiPolygon, Point, Polygon, Position } from 'geojson';
import type {
  ContentEvent,
  GeneratedTerritoryMap,
  GeneratedTerritoryPeriod,
  GeneratedTerritoryShape,
  TerritoryHolders,
  TerritoryLabel,
  TerritoryLedgerRow,
  TerritoryLegendItem,
  TerritoryRegions,
} from '../../shared/contentSchema';
import { encodeRing } from '../../shared/territoryMap';
import type { ContentIssue } from './store';

/** [west, south, east, north]: what the map data and the Relief tiles cover. */
export const TERRITORY_EXTENT: [number, number, number, number] = [-14, -8, 88, 58];

type Area = Feature<Polygon | MultiPolygon>;
type Region = TerritoryRegions['regions'][number];
type Land = { area: Area; box: number[] }[];

export interface TerritorySource {
  regions: TerritoryRegions;
  holders: TerritoryHolders;
  ledger: { file: string; rows: TerritoryLedgerRow[] }[];
  land: (Polygon | MultiPolygon)[];
  rivers: GeneratedTerritoryMap['rivers'];
}

const NAMED_KINDS = new Set<string>(['state', 'client', 'city']);
const asList = (r: string | string[]): string[] => (Array.isArray(r) ? r : [r]);

/** Checks the links between the ledger, the regions, the holders and the events. */
export function checkTerritories(source: Pick<TerritorySource, 'regions' | 'holders' | 'ledger'>, events: readonly ContentEvent[]): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const regionIds = new Set<string>();
  for (const r of source.regions.regions) {
    if (regionIds.has(r.id)) issues.push({ file: 'territories/regions.json', message: `duplicate region id "${r.id}"` });
    regionIds.add(r.id);
  }
  const eventIds = new Set(events.map(e => e.id));
  const holderIds = new Set<string>();
  for (const h of source.holders.holders) {
    if (holderIds.has(h.id)) issues.push({ file: 'territories/holders.json', message: `duplicate holder id "${h.id}"` });
    holderIds.add(h.id);
    for (const n of h.names ?? []) {
      if (!eventIds.has(n.fromEvent)) issues.push({ file: 'territories/holders.json', message: `${h.id}: unknown event "${n.fromEvent}"` });
    }
  }
  const used = new Set<string>();
  for (const { file, rows } of source.ledger) {
    rows.forEach((row, i) => {
      for (const id of asList(row.r)) {
        used.add(id);
        if (!regionIds.has(id)) issues.push({ file, message: `row ${i}: unknown region "${id}"` });
      }
      if (!holderIds.has(row.h)) issues.push({ file, message: `row ${i}: unknown holder "${row.h}"` });
      if (row.ev !== undefined && !eventIds.has(row.ev)) issues.push({ file, message: `row ${i}: unknown event "${row.ev}"` });
    });
  }
  for (const id of regionIds) {
    if (!used.has(id)) issues.push({ file: 'territories/regions.json', message: `region "${id}" has no row in the ledger` });
  }
  return issues;
}

/** Rounds a ring's corners (two passes of Chaikin), so a drawn shape has no hard angles. */
function smoothRing(ring: Position[]): Position[] {
  let points = ring;
  for (let pass = 0; pass < 2; pass++) {
    const next: Position[] = [];
    points.forEach((a, i) => {
      const b = points[(i + 1) % points.length];
      next.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]);
    });
    points = next;
  }
  return [...points, points[0]];
}

const boxesTouch = (a: number[], b: number[]): boolean => !(b[2] < a[0] || b[0] > a[2] || b[3] < a[1] || b[1] > a[3]);

function unionAll(areas: Area[]): Area | null {
  if (areas.length === 0) return null;
  return areas.length === 1 ? areas[0] : turf.union(turf.featureCollection(areas));
}

function onLand(area: Area, land: Land): Area | null {
  const box = turf.bbox(area);
  const near: [number, number, number, number] = [box[0] - 0.1, box[1] - 0.1, box[2] + 0.1, box[3] + 0.1];
  const parts = land
    .filter(l => boxesTouch(l.box, box))
    // The mainland is one huge polygon: only the coast near the area takes part.
    .map(l => turf.intersect(turf.featureCollection([turf.bboxClip(l.area, near) as Area, area])))
    .filter((p): p is Area => p !== null);
  return unionAll(parts);
}

/** Each region's land, on the real coast. Earlier regions win where two overlap. */
function buildCells(regions: Region[], land: Land): Map<string, { region: Region; area: Area }> {
  const cells = new Map<string, { region: Region; area: Area }>();
  let taken: Area | null = null;
  for (const region of regions) {
    const shape: Area = turf.polygon([smoothRing(region.ring)]);
    const free: Area | null = taken ? turf.difference(turf.featureCollection([shape, taken])) : shape;
    const area = free && onLand(free, land);
    if (area) cells.set(region.id, { region, area });
    taken = taken ? turf.union(turf.featureCollection([taken, shape])) : shape;
  }
  return cells;
}

const polygonsOf = (area: Area): Position[][][] =>
  area.geometry.type === 'Polygon' ? [area.geometry.coordinates] : area.geometry.coordinates;

// Below this a piece of land cannot be seen at any zoom the map offers. It must go before simplifying:
// turf.simplify retries without end on a ring of a few square metres.
const SPECK_M2 = 20e6;

/** Simplifies an area, dropping specks of land. */
function tidy(area: Area, tolerance: number): Area {
  const parts = polygonsOf(area).filter(c => turf.area(turf.polygon(c)) >= SPECK_M2);
  const kept = parts.length > 0 ? parts : polygonsOf(area).slice(0, 1);
  return turf.simplify(turf.multiPolygon(kept), { tolerance, highQuality: false });
}

const round = (n: number): number => Math.round(n * 1e3) / 1e3;
const encodeArea = (area: Area): string[][] => polygonsOf(area).map(polygon => polygon.map(encodeRing));

/** The middle of the largest part: where a name goes. */
function labelPoint(area: Area): [number, number] {
  const largest = polygonsOf(area)
    .map(c => turf.polygon(c))
    .sort((a, b) => turf.area(b) - turf.area(a))[0];
  const center = turf.centerOfMass(largest);
  const point = turf.booleanPointInPolygon(center, largest) ? center : turf.pointOnFeature(largest);
  return [round(point.geometry.coordinates[0]), round(point.geometry.coordinates[1])];
}

/**
 * One group's regions as one soft-edged area: grown then shrunk, so the gaps between drawn regions
 * close and the corners round. Returned with its holes: see closeHoles.
 */
function growTogether(areas: Area[]): Area {
  // Simplified first, for speed: the coast comes back when the result is clipped to the land.
  const polygons = areas.flatMap(a => polygonsOf(tidy(a, 0.04)));
  // One buffer over all of them: its own union does not stall on near-coincident edges, as turf.union did.
  const together = turf.multiPolygon(polygons);
  const grown = turf.buffer(together, 45, { units: 'kilometers', steps: 3 }) ?? together;
  return turf.buffer(grown, -31, { units: 'kilometers', steps: 3 }) ?? grown;
}

/**
 * Drops the holes of a merged area, except where another group's region lies in one: an enclave must
 * stay visible. Returns the rings and which holes stayed.
 */
function closeHoles(merged: Area, points: Feature<Point>[]): { area: Area; kept: string } {
  const kept: string[] = [];
  const polygons = polygonsOf(merged).map((poly, p) => [
    poly[0],
    ...poly.slice(1).filter((hole, h) => {
      const inHole = turf.polygon([hole]);
      const keep = points.some(point => turf.booleanPointInPolygon(point, inHole));
      if (keep) kept.push(`${p}.${h}`);
      return keep;
    }),
  ]);
  return { area: turf.multiPolygon(polygons), kept: kept.join(',') };
}

interface Dated {
  at: number;
  row: TerritoryLedgerRow;
}

/** The whole map: every period between two changes, its shapes, its labels and its legend. */
export function buildTerritories(source: TerritorySource, events: readonly ContentEvent[]): GeneratedTerritoryMap {
  const sortKey = new Map(events.map(e => [e.id, e.date.sortKey]));
  const dated: Dated[] = source.ledger
    .flatMap(l => l.rows)
    .map(row => ({ row, at: row.ev !== undefined ? sortKey.get(row.ev)! : row.at! }));
  const inOrder = dated.map((d, i) => ({ d, i })).sort((a, b) => a.d.at - b.d.at || a.i - b.i).map(x => x.d);
  // A holder's new name starts a period too: its event changes what the map says.
  const renames = source.holders.holders.flatMap(h => (h.names ?? []).map(n => ({ at: sortKey.get(n.fromEvent)!, ev: n.fromEvent })));
  const changes = [...new Set([...inOrder.map(d => d.at), ...renames.map(r => r.at)])].sort((a, b) => a - b);

  const land: Land = source.land.flatMap(g => (g.type === 'Polygon' ? [g.coordinates] : g.coordinates)).map(c => {
    const area: Area = turf.polygon(c);
    return { area, box: turf.bbox(area) };
  });
  const cells = buildCells(source.regions.regions, land);
  const cellPoint = new Map([...cells].map(([id, cell]) => [id, turf.pointOnFeature(cell.area)]));
  const cellLabel = new Map([...cells].map(([id, cell]) => [id, labelPoint(cell.area)]));
  const holders = new Map(source.holders.holders.map(h => [h.id, h]));
  const kinds = source.holders.kinds as Partial<Record<string, string>>;

  const nameOf = (holder: string, at: number): string => {
    const h = holders.get(holder)!;
    const named = (h.names ?? []).filter(n => sortKey.get(n.fromEvent)! <= at);
    return named.length > 0 ? named[named.length - 1].nameAr : h.nameAr;
  };

  // Shapes are shared between periods: a period lists the ones it shows.
  const shapes: GeneratedTerritoryShape[] = [];
  const shapeSize: number[] = [];
  const shapeArea: Area[] = [];
  const shapeIndex = new Map<string, number>();
  const addShape = (key: string, meta: Omit<GeneratedTerritoryShape, 'rings'>, area: () => Area): number => {
    let index = shapeIndex.get(key);
    if (index === undefined) {
      const drawn = area();
      index = shapes.push({ ...meta, rings: encodeArea(drawn) }) - 1;
      shapeArea[index] = drawn;
      shapeSize[index] = turf.area(drawn);
      shapeIndex.set(key, index);
    }
    return index;
  };
  const grownCache = new Map<string, Area>();

  const periods: GeneratedTerritoryPeriod[] = changes.map((at, index) => {
    const state = new Map<string, TerritoryLedgerRow>();
    for (const d of inOrder) {
      if (d.at > at) break;
      for (const id of asList(d.row.r)) state.set(id, d.row);
    }
    const groups = new Map<string, { row: TerritoryLedgerRow; uncertain: boolean; ids: string[] }>();
    for (const [id, row] of state) {
      if (!cells.has(id)) continue;
      const uncertain = row.c === 'uncertain';
      const key = `${row.h}|${row.k}|${uncertain ? 'uncertain' : ''}`;
      const group = groups.get(key) ?? { row, uncertain, ids: [] };
      group.ids.push(id);
      groups.set(key, group);
    }

    const areas: number[] = [];
    const realmLabels: { label: TerritoryLabel; size: number }[] = [];
    const legend = new Map<string, TerritoryLegendItem>();
    for (const [groupKey, group] of groups) {
      const { h: holder, k: kind } = group.row;
      const { uncertain } = group;
      const name = nameOf(holder, at);
      if (kind === 'tribal') {
        // Pastures moved and overlapped: each stays its own soft area, never merged into a state.
        for (const id of group.ids) {
          const cell = cells.get(id)!;
          areas.push(addShape(`${groupKey}|${id}`, { holder, kind, uncertain, nameAr: cell.region.nameAr }, () => tidy(cell.area, 0.012)));
        }
      } else {
        const ids = [...group.ids].sort().join(',');
        const grown = grownCache.get(ids) ?? growTogether(group.ids.map(id => cells.get(id)!.area));
        grownCache.set(ids, grown);
        const others = [...groups.entries()].filter(([k]) => k !== groupKey).flatMap(([, g]) => g.ids.map(id => cellPoint.get(id)!));
        const closed = closeHoles(grown, others);
        const shapeIdx = addShape(
          `${groupKey}|${ids}|${closed.kept}|${name}`,
          { holder, kind, uncertain, nameAr: name },
          () => tidy(onLand(closed.area, land) ?? closed.area, 0.012),
        );
        areas.push(shapeIdx);
        if (kind === 'state' || kind === 'client') {
          const h = holders.get(holder)!;
          const [lng, lat] = h.labelAt ?? labelPoint(shapeArea[shapeIdx]);
          const label: TerritoryLabel = { text: name, lat, lng, level: group.ids.length > 2 ? 1 : 2, kind, holder };
          if (h.shortAr) label.short = h.shortAr;
          realmLabels.push({ label, size: shapeSize[shapeIdx] });
        }
      }
      if (holder === 'tribal' && kind === 'city') continue;
      const named = NAMED_KINDS.has(kind);
      const legendKey = named ? holder : `k-${kind}`;
      if (!legend.has(legendKey)) {
        legend.set(legendKey, { holder: kind === 'treaty' ? 'islam' : holder, kind, text: named ? name : kinds[kind]! });
      }
    }

    // Realm names first, largest land first; then every region's own name.
    const labels = realmLabels.sort((a, b) => b.size - a.size).map(r => r.label);
    for (const [id, row] of state) {
      const cell = cells.get(id);
      if (!cell) continue;
      const [lng, lat] = cellLabel.get(id)!;
      const level = cell.region.kind === 'province' && row.k === 'state' ? 4 : 3;
      labels.push({ text: row.name ?? cell.region.nameAr, lat, lng, level, kind: row.k, holder: row.h });
    }
    const seen = new Set<string>();
    const anyUncertain = [...groups.values()].some(g => g.uncertain && g.row.k !== 'tribal');
    const period: GeneratedTerritoryPeriod = {
      from: at,
      // Large areas first, so a smaller one is never hidden under a larger one.
      areas: [...areas].sort((a, b) => shapeSize[b] - shapeSize[a]),
      labels: labels.filter(l => !seen.has(l.text) && seen.add(l.text)),
      legend: [
        ...[...legend.values()].sort((a, b) => Number(!NAMED_KINDS.has(a.kind)) - Number(!NAMED_KINDS.has(b.kind))),
        ...(anyUncertain ? [{ holder: 'tribal', kind: 'uncertain' as const, text: source.holders.uncertainAr }] : []),
      ],
      causes: [...new Set([...inOrder.filter(d => d.at === at && d.row.ev !== undefined).map(d => d.row.ev!), ...renames.filter(r => r.at === at).map(r => r.ev)])],
    };
    if (index < changes.length - 1) period.to = changes[index + 1];
    return period;
  });

  return { rivers: source.rivers, shapes, periods };
}
