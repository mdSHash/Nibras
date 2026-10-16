/**
 * Precomputes the territory map (content/territories) at build time, so the
 * app ships polygons instead of @turf/turf: one Voronoi cell per seed region,
 * clipped to the land outline, then the cells of each owner unioned, for every
 * control period. The geometry steps are the ones the app ran in the browser
 * before Phase 1B (src/territoriesData.ts), in the same order, so the polygons
 * are the same.
 */
import * as turf from '@turf/turf';
import type { Feature, MultiPolygon, Polygon } from 'geojson';
import type {
  GeneratedTerritoryPeriod,
  TerritoryControl,
  TerritoryGroup,
  TerritoryRegions,
} from '../../shared/contentSchema';
import type { ContentIssue } from './store';

type Cell = Feature<Polygon | MultiPolygon>;

/** Checks the control periods against the regions; returns the issues found. */
export function checkTerritories(regions: TerritoryRegions, control: TerritoryControl, file: string): ContentIssue[] {
  const issues: ContentIssue[] = [];
  const ids = new Set<string>();
  for (const r of regions.regions) {
    if (ids.has(r.id)) issues.push({ file: 'territories/regions.json', message: `duplicate region id "${r.id}"` });
    ids.add(r.id);
  }
  const land = regions.regions.filter(r => !r.sea).map(r => r.id);
  const sea = new Set(regions.regions.filter(r => r.sea).map(r => r.id));
  control.periods.forEach((period, i) => {
    const where = `period ${i} (${period.from ?? '…'}–${period.to ?? '…'})`;
    const first = i === 0;
    const last = i === control.periods.length - 1;
    if (first !== (period.from === undefined)) issues.push({ file, message: `${where}: only the first period has no "from"` });
    if (last !== (period.to === undefined)) issues.push({ file, message: `${where}: only the last period has no "to"` });
    if (!first && period.from !== control.periods[i - 1].to) {
      issues.push({ file, message: `${where}: "from" must equal the previous period's "to"` });
    }
    if (period.from !== undefined && period.to !== undefined && period.from >= period.to) {
      issues.push({ file, message: `${where}: "to" must be after "from"` });
    }
    const owner = new Map<string, string>();
    const groups = new Set<string>();
    for (const o of period.owners) {
      if (groups.has(o.group)) issues.push({ file, message: `${where}: group "${o.group}" is listed twice` });
      groups.add(o.group);
      for (const r of o.regions) {
        if (!ids.has(r)) issues.push({ file, message: `${where}: unknown region "${r}"` });
        else if (sea.has(r)) issues.push({ file, message: `${where}: "${r}" is a sea point` });
        else if (owner.has(r)) issues.push({ file, message: `${where}: "${r}" has two owners (${owner.get(r)}, ${o.group})` });
        owner.set(r, o.group);
      }
    }
    for (const r of land) if (!owner.has(r)) issues.push({ file, message: `${where}: region "${r}" has no owner` });
  });
  return issues;
}

function baseCells(regions: TerritoryRegions): Map<string, Cell> {
  const outline = [...regions.landOutline];
  const [a, b] = [outline[0], outline[outline.length - 1]];
  if (a[0] !== b[0] || a[1] !== b[1]) outline.push(a);
  const land = turf.polygon([outline]);
  const points = turf.featureCollection(regions.regions.map(r => turf.point([r.lng, r.lat], { id: r.id, title: r.titleAr })));
  const voronoi = turf.voronoi(points, { bbox: [0, 0, 80, 55] });
  const cells = new Map<string, Cell>();
  for (const poly of voronoi.features) {
    if (!poly) continue;
    const region = regions.regions.find(r => turf.booleanPointInPolygon(turf.point([r.lng, r.lat]), poly));
    if (!region) continue;
    const clipped = turf.intersect(turf.featureCollection([poly, land]));
    if (!clipped) throw new Error(`territory region "${region.id}" lies outside the land outline`);
    cells.set(region.id, clipped);
  }
  return cells;
}

/** Leaflet rings ([lat, lng]) of a polygon or multipolygon. */
function rings(geometry: Polygon | MultiPolygon): [number, number][][] {
  const polygons = geometry.type === 'Polygon' ? [geometry.coordinates] : geometry.coordinates;
  return polygons.flatMap(poly => poly.map(ring => ring.map(([lng, lat]) => [lat, lng] as [number, number])));
}

const round = (n: number): number => Math.round(n * 1e4) / 1e4;

/** The map for every control period. Coordinates are rounded to 1e-4° (about 11 m). */
export function buildTerritories(regions: TerritoryRegions, control: TerritoryControl): GeneratedTerritoryPeriod[] {
  const cells = baseCells(regions);
  const empires = new Set(control.empireGroups);
  return control.periods.map(period => {
    const ownerOf = new Map(period.owners.flatMap(o => o.regions.map(r => [r, o] as const)));
    // Groups in the order of their first region, cells in region order.
    const groups = new Map<string, { group: Omit<TerritoryGroup, 'polygons'>; cells: Cell[] }>();
    for (const region of regions.regions) {
      const owner = ownerOf.get(region.id);
      const cell = cells.get(region.id);
      if (!owner || !cell) continue;
      const entry = groups.get(owner.group) ?? {
        group: { id: owner.group, name: owner.nameAr, color: owner.color, isEmpire: empires.has(owner.group), specificName: '' },
        cells: [],
      };
      entry.group.specificName = region.titleAr;
      entry.cells.push(cell);
      groups.set(owner.group, entry);
    }
    const out: TerritoryGroup[] = [...groups.values()].map(({ group, cells: groupCells }) => {
      let unioned = groupCells[0];
      for (const next of groupCells.slice(1)) unioned = turf.union(turf.featureCollection([unioned, next])) ?? unioned;
      const coordinates = rings(unioned.geometry).map(ring => ring.map(([lat, lng]) => [round(lat), round(lng)] as [number, number]));
      return {
        ...group,
        polygons: [{ name: group.isEmpire ? group.name : group.specificName, color: group.color, coordinates }],
      };
    });
    return { ...(period.from !== undefined ? { from: period.from } : {}), ...(period.to !== undefined ? { to: period.to } : {}), groups: out };
  });
}
