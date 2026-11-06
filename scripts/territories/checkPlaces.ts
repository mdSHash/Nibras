/**
 * Checks the drawn region shapes against the al-Thurayya gazetteer (CC BY 4.0): is each town the
 * sources name for a region really inside its shape? By hand only: the gazetteer is in
 * tmp/territories-research/geo, which git ignores. Usage: npx tsx scripts/territories/checkPlaces.ts
 */
import fs from 'node:fs';
import * as turf from '@turf/turf';

// region id -> the towns that place it, by al-Thurayya's romanized top name.
const TOWNS: Record<string, string[]> = {
  makkah: ['Makka'], yathrib: ['Madina'], taif: ['Taif'], khaybar: ['Khaybar'], najran: ['Najran'],
  sanaa: ['SANA_442E'], dimashq: ['Dimashq'], hims: ['Hims'], qinnasrin: ['Qinnasrin', 'Halab'], urdunn: ['Tabariyya'],
  filastin: ['Ramla', 'Bayt Maqdis'], alexandria: ['Iskandariyya'], misr: ['Fustat'], said: ['Uswan', 'Qift'],
  barqa: ['Barqa'], ifriqiya: ['Qayrawan'], hira: ['Hira', 'Anbar', 'Kufa'], sawad: ['Wasit', 'Madain'],
  ahwaz: ['Ahwaz', 'Tustar'], jibal: ['Hamadhan', 'ISBAHAN_516E', 'Nihawand'], rayy_qumis: ['RAYY_515E', 'QUMIS_541E'], fars: ['Istakhr', 'Shiraz'], kirman: ['Sirjan'],
  sijistan: ['Zaranj'], khurasan: ['Naysabur', 'Marw', 'Balkh', 'HARA_621E'], tabaristan: ['Amul', 'Sariya', 'JURJAN_549E'], adharbayjan: ['Ardabil', 'Tabriz'],
  armenia: ['Dabil'], jazira: ['Mawsil', 'Nasibin', 'Raqqa'], hanifa: ['Hajr'], abd_qays: ['HAJAR_499E', 'Qatif'], oman: ['Suhar'],
};

interface Place { geometry: { coordinates: [number, number] }; properties: { cornuData?: { toponym_translit_full?: string; toponym_search?: string; cornu_URI?: string } } }
const places = (JSON.parse(fs.readFileSync('tmp/territories-research/geo/thurayya-places.geojson', 'utf8')) as { features: Place[] }).features;
const regions = (JSON.parse(fs.readFileSync('content/territories/regions.json', 'utf8')) as { regions: { id: string; ring: number[][] }[] }).regions;

const find = (name: string): Place | undefined => {
  const key = name.toLowerCase();
  const prefix = key.includes('_') ? key : `${key.replace(/ /g, '')}_`;
  return places.find(p => (p.properties.cornuData?.cornu_URI ?? '').toLowerCase().startsWith(prefix));
};

let outside = 0;
let missing = 0;
for (const [id, towns] of Object.entries(TOWNS)) {
  const region = regions.find(r => r.id === id);
  if (!region) { console.log(`no region ${id}`); continue; }
  for (const town of towns) {
    const place = find(town);
    if (!place) { missing++; console.log(`?   ${id}: ${town} not found in al-Thurayya`); continue; }
    // Where shapes overlap the earlier region wins, as in the build.
    const holder = regions.filter(r => turf.booleanPointInPolygon(place.geometry.coordinates, turf.polygon([[...r.ring, r.ring[0]]]))).map(r => r.id);
    if (holder[0] !== id) {
      outside++;
      console.log(`OUT ${id}: ${town} at ${place.geometry.coordinates.join(',')} is in [${holder.join(', ')}]`);
    }
  }
}
console.log(`${outside} towns outside their region, ${missing} not found`);
