// Realm and region names on the map. They sit in a pane below the event markers and take no clicks;
// where they go is decided by placeLabels, again whenever the view or the markers change.
import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import type { TerritoryLabel } from '../../../shared/contentSchema';
import { labelShowsAtZoom, placeLabels, type Box, type LabelBox } from './labelPlacement';

const PANE = 'territory-labels';
// What a label must keep clear of, besides the labels before it. Inside the map container.
const OBSTACLES = '.leaflet-marker-pane > *, .leaflet-tooltip-pane > *, .territory-legend, .nb-credit';
// The app's own parts over the map: a label half under one of them could not be read.
const COVERS = 'header, [data-tour-id="event-panel"], [data-map-cover]';
// The event panel slides in after the selection changes.
const PANEL_SETTLED_MS = 700;
const SHORT_NAMES = '(max-width: 639px)';

interface Placed {
  label: TerritoryLabel;
  marker: L.Marker;
  span: HTMLSpanElement;
}

export function TerritoryLabels({ labels, year }: { labels: TerritoryLabel[]; year: number | null }) {
  const map = useMap();
  const placedRef = useRef<Placed[]>([]);
  const placeRef = useRef<() => void>(() => undefined);

  // Leaflet's own markers keep the names in step with the map while it moves and zooms.
  useEffect(() => {
    if (!map.getPane(PANE)) {
      const pane = map.createPane(PANE);
      pane.style.zIndex = '450';
      pane.style.pointerEvents = 'none';
      pane.setAttribute('aria-hidden', 'true');
    }
    const short = window.matchMedia(SHORT_NAMES).matches;
    const placed = labels.map<Placed>(label => {
      const span = document.createElement('span');
      span.className = `territory-label l${label.level} k-${label.kind}`;
      span.dir = 'rtl';
      span.textContent = (short && label.short) || label.text;
      span.style.visibility = 'hidden';
      const marker = L.marker([label.lat, label.lng], {
        pane: PANE,
        interactive: false,
        keyboard: false,
        icon: L.divIcon({ className: 'territory-label-wrap', html: span, iconSize: [0, 0] }),
      }).addTo(map);
      return { label, marker, span };
    });
    placedRef.current = placed;
    placeRef.current();
    return () => {
      placed.forEach(p => p.marker.remove());
      placedRef.current = [];
    };
  }, [map, labels]);

  useEffect(() => {
    const container = map.getContainer();
    let frame = 0;
    const place = () => {
      frame = 0;
      const zoom = map.getZoom();
      const origin = container.getBoundingClientRect();
      const obstacles: Box[] = [...container.querySelectorAll(OBSTACLES), ...document.querySelectorAll(COVERS)]
        .map(el => el.getBoundingClientRect())
        .filter(r => r.width > 0 && r.height > 0);
      const shown = placedRef.current.filter(p => labelShowsAtZoom(p.label.level, zoom));
      const boxes: LabelBox[] = shown.map(p => {
        const point = map.latLngToContainerPoint([p.label.lat, p.label.lng]);
        return { x: point.x + origin.left, y: point.y + origin.top, width: p.span.offsetWidth, height: p.span.offsetHeight, level: p.label.level };
      });
      const placements = placeLabels(boxes, obstacles, origin);
      for (const p of placedRef.current) p.span.style.visibility = 'hidden';
      shown.forEach((p, i) => {
        const { dx, dy, visible } = placements[i];
        p.span.style.setProperty('--dx', `${dx}px`);
        p.span.style.setProperty('--dy', `${dy}px`);
        p.span.style.visibility = visible ? 'visible' : 'hidden';
      });
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(place);
    };
    placeRef.current = schedule;

    map.on('moveend zoomend resize', schedule);
    // Markers cluster and unfold after the view settles, and the selected one changes with the event.
    const observer = new MutationObserver(schedule);
    for (const name of ['markerPane', 'tooltipPane'] as const) observer.observe(map.getPanes()[name], { childList: true });
    void document.fonts?.ready.then(schedule);
    schedule();
    return () => {
      map.off('moveend zoomend resize', schedule);
      observer.disconnect();
      cancelAnimationFrame(frame);
      placeRef.current = () => undefined;
    };
  }, [map]);

  // Another event: the panel moves, and with it what the labels must avoid.
  useEffect(() => {
    const timer = setTimeout(() => placeRef.current(), PANEL_SETTLED_MS);
    return () => clearTimeout(timer);
  }, [year]);

  return null;
}
