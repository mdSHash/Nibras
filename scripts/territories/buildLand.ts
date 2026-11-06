/**
 * Writes content/territories/land.json and rivers.json from Natural Earth (public domain): the real
 * coastline the region shapes are clipped to, and the rivers drawn over the map. By hand only, when
 * the extent or detail changes: the geo data is in tmp/territories-research/geo, which git ignores.
 * Usage: npx tsx scripts/territories/buildLand.ts
 */
import fs from 'node:fs';
import * as turf from '@turf/turf';
import type { Feature, FeatureCollection, LineString, MultiLineString, MultiPolygon, Polygon } from 'geojson';
import { TERRITORY_EXTENT } from '../content/territories';

const GEO = 'tmp/territories-research/geo';
const BBOX = TERRITORY_EXTENT;
const RIVERS = /^(Nile|Euphrates|Tigris|Karun|Jordan|Amu Darya|Helmand|Blue Nile|White Nile|Kura|Aras|Atbara)/;

const read = <T>(name: string): T => JSON.parse(fs.readFileSync(`${GEO}/${name}`, 'utf8')) as T;
const overlaps = (box: number[]): boolean => !(box[2] < BBOX[0] || box[0] > BBOX[2] || box[3] < BBOX[1] || box[1] > BBOX[3]);
const round = (value: unknown): unknown =>
  typeof value === 'number' ? Math.round(value * 1e3) / 1e3 : Array.isArray(value) ? value.map(round) : value;

const clip = turf.bboxPolygon(BBOX);
const land = read<FeatureCollection<Polygon | MultiPolygon>>('ne_10m_land.geojson')
  .features.flatMap(f => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates))
  .map(c => turf.polygon(c))
  .filter(p => overlaps(turf.bbox(p)))
  .map(p => turf.intersect(turf.featureCollection([p, clip])))
  .filter((p): p is Feature<Polygon | MultiPolygon> => p !== null)
  // Islets of under 20 km2 cannot be seen on the map, and turf.simplify can stall on them.
  .filter(p => turf.area(p) >= 20e6)
  .map(p => turf.simplify(p, { tolerance: 0.015, highQuality: false }).geometry);
fs.writeFileSync('content/territories/land.json', `${JSON.stringify(round(land))}\n`);

const rivers = read<FeatureCollection<LineString | MultiLineString, { name?: string }>>('ne_10m_rivers_lake_centerlines.geojson')
  .features.filter(f => RIVERS.test(f.properties.name ?? ''))
  .map(f => turf.simplify(f, { tolerance: 0.02 }).geometry);
fs.writeFileSync('content/territories/rivers.json', `${JSON.stringify(round(rivers))}\n`);

for (const f of ['land', 'rivers']) console.log(f, Math.round(fs.statSync(`content/territories/${f}.json`).size / 1024), 'KB');
