// The territory map over the Relief basemap (direction B, chosen by Mostafa from the 3F comparison):
// who held what at the selected event's date, with a style per kind of hold, labels and a legend.
import { useCallback, useEffect, useMemo, useState } from 'react';
import { GeoJSON, Popup, useMap } from 'react-leaflet';
import type { Feature } from 'geojson';
import type { PathOptions } from 'leaflet';
import type { GeneratedTerritoryMap, GeneratedTerritoryShape, TerritoryKind } from '../../../shared/contentSchema';
import { decodeShape } from '../../../shared/territoryMap';
import { loadTerritoryMap, NO_EVENT_YEAR, periodForYear } from '../../territories';
import { TerritoryLabels } from './TerritoryLabels';
import { TerritoryLegend } from './TerritoryLegend';
import './territoryMap.css';

const HATCH_ID = 'territory-hatch';
const AREA_STYLE: PathOptions = { weight: 2.4, fillOpacity: 0.24, opacity: 0.95, lineJoin: 'round', lineCap: 'round' };

// What each kind of hold means, in the area's popup.
const KIND_TEXT: Record<TerritoryKind, string> = {
  state: 'حكم مباشر',
  city: 'مدينة وما حولها',
  client: 'حليف لإحدى الإمبراطوريتين',
  treaty: 'صلح أو معاهدة، دون حكم مباشر',
  contested: 'أرض متنازع عليها',
  tribal: 'ديار قبيلة، حدودها غير ثابتة',
};

/** The hatch of land on terms, in the map's own SVG, so a `url(#…)` fill finds it in every browser. */
function useHatchPattern(ready: boolean): void {
  const map = useMap();
  useEffect(() => {
    if (!ready) return;
    const svg = map.getPanes().overlayPane.querySelector('svg');
    if (!svg || svg.querySelector(`#${HATCH_ID}`)) return;
    const ns = 'http://www.w3.org/2000/svg';
    const defs = document.createElementNS(ns, 'defs');
    const pattern = document.createElementNS(ns, 'pattern');
    pattern.id = HATCH_ID;
    for (const [name, value] of Object.entries({ width: '9', height: '9', patternUnits: 'userSpaceOnUse', patternTransform: 'rotate(45)' })) {
      pattern.setAttribute(name, value);
    }
    const line = document.createElementNS(ns, 'line');
    for (const [name, value] of Object.entries({ x1: '0', y1: '0', x2: '0', y2: '9', class: 'territory-hatch-line' })) {
      line.setAttribute(name, value);
    }
    pattern.append(line);
    defs.append(pattern);
    svg.prepend(defs);
  });
}

function TerritoryArea({ shape }: { shape: GeneratedTerritoryShape }) {
  const data = useMemo<Feature>(() => ({ type: 'Feature', properties: {}, geometry: decodeShape(shape.rings) }), [shape]);
  return (
    <GeoJSON
      data={data}
      style={{
        ...AREA_STYLE,
        className: `territory-area h-${shape.holder} k-${shape.kind}${shape.uncertain ? ' uncertain' : ''}`,
        ...(shape.kind === 'treaty' ? { fillColor: `url(#${HATCH_ID})`, fillOpacity: 1 } : {}),
      }}
    >
      <Popup className="historical-popup" closeButton={false}>
        <div className="font-sans text-center px-2 py-1" dir="rtl">
          <div className="popup-title font-bold text-base">{shape.nameAr}</div>
          <div className="popup-muted text-[12px] mt-1">{KIND_TEXT[shape.kind]}</div>
          {shape.uncertain && <div className="popup-muted text-[12px]">السيطرة هنا غير مؤكدة</div>}
          <div className="popup-muted text-[12px]">الحدود مرسومة تقريبًا</div>
        </div>
      </Popup>
    </GeoJSON>
  );
}

export function TerritoryLayer({ year }: { year: number | null }) {
  const [data, setData] = useState<GeneratedTerritoryMap | null>(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    loadTerritoryMap().then(setData, () => setFailed(true));
  }, []);
  useEffect(load, [load]);

  const period = useMemo(() => (data ? periodForYear(data, year ?? NO_EVENT_YEAR) : undefined), [data, year]);
  useHatchPattern(period !== undefined);

  const rivers = useMemo(
    () => (data ? data.rivers.map<Feature>(geometry => ({ type: 'Feature', properties: {}, geometry })) : []),
    [data],
  );

  if (failed) {
    return (
      <div className="territory-status" dir="rtl" role="alert">
        <span>تعذّر تحميل حدود الخريطة</span>
        <button type="button" className="territory-status__retry" onClick={load}>إعادة المحاولة</button>
      </div>
    );
  }
  if (!data || !period) {
    return <div className="territory-status territory-status--loading" dir="rtl" role="status">جارٍ تحميل حدود الخريطة…</div>;
  }
  return (
    <>
      {rivers.map((river, i) => (
        <GeoJSON key={i} data={river} interactive={false} style={{ className: 'territory-river', weight: 1.3, fill: false }} />
      ))}
      {period.areas.map(index => (
        // Mounted anew per period, so the SVG order stays largest land first.
        <TerritoryArea key={`${period.from}-${index}`} shape={data.shapes[index]} />
      ))}
      <TerritoryLabels labels={period.labels} year={year} />
      <TerritoryLegend items={period.legend} />
    </>
  );
}
