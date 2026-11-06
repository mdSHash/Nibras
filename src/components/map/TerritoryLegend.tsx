// The map's legend: always open on a wide screen, a chip that opens it on a phone.
import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import type { TerritoryLegendItem } from '../../../shared/contentSchema';
import { useMatchMedia } from '../../hooks/useMatchMedia';

const LEGEND_ID = 'territory-legend-list';

function LegendList({ items }: { items: TerritoryLegendItem[] }) {
  return (
    <ul id={LEGEND_ID} className="territory-legend__list">
      {items.map(item => (
        <li key={`${item.holder}-${item.kind}`} className="territory-legend__row">
          <span className={`territory-swatch h-${item.holder} k-${item.kind}`} aria-hidden="true" />
          <span className="territory-legend__text">{item.text}</span>
        </li>
      ))}
      <li className="territory-legend__row">
        <span className="territory-legend__text territory-legend__note">الحدود كلها مرسومة تقريبًا</span>
      </li>
    </ul>
  );
}

export function TerritoryLegend({ items }: { items: TerritoryLegendItem[] }) {
  const isPhone = useMatchMedia('(max-width: 639px)');
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  // A click or a scroll on the legend is not a click or a scroll on the map.
  useEffect(() => {
    if (!box.current) return;
    L.DomEvent.disableClickPropagation(box.current);
    L.DomEvent.disableScrollPropagation(box.current);
  }, []);

  useEffect(() => {
    if (!open) return;
    const close = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    // On the document: Safari does not focus a button on a click, so the key may not reach the legend.
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.stopPropagation(); // Escape here closes the legend, not the event panel.
      setOpen(false);
      box.current?.querySelector('button')?.focus();
    };
    document.addEventListener('pointerdown', close);
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.removeEventListener('pointerdown', close);
      document.removeEventListener('keydown', onKey, true);
    };
  }, [open]);

  if (!isPhone) {
    return (
      <div ref={box} className="territory-legend" dir="rtl" role="group" aria-label="مفتاح الخريطة">
        <LegendList items={items} />
      </div>
    );
  }
  return (
    <div
      ref={box}
      className={`territory-legend territory-legend--chip${open ? ' is-open' : ''}`}
      dir="rtl"
      role="group"
      aria-label="مفتاح الخريطة"
    >
      <button
        type="button"
        className="territory-legend__toggle"
        aria-expanded={open}
        aria-controls={open ? LEGEND_ID : undefined}
        onClick={() => setOpen(v => !v)}
      >
        <span className="territory-legend__text">مفتاح الخريطة</span>
        <span className="territory-legend__chevron" aria-hidden="true">▾</span>
      </button>
      {open && <LegendList items={items} />}
    </div>
  );
}
