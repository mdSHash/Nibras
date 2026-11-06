import React, { lazy, Suspense, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

// Register the gesture handler once at module load.
// Requires two-finger pan on touch, ctrl+wheel zoom on desktop — prevents map
// from stealing page scroll when the user is scrolling the surrounding UI.
/** A marker's name for screen readers: Leaflet makes it a button, but a div icon gets no name of its own. */
const nameMarker = (name: string) => (e: L.LeafletEvent) => (e.target as L.Marker).getElement()?.setAttribute('aria-label', name);

const LeafletMapClass = L.Map as typeof L.Map & { _nibrasGestureHandlerRegistered?: boolean };
if (!LeafletMapClass._nibrasGestureHandlerRegistered) {
  L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  LeafletMapClass._nibrasGestureHandlerRegistered = true;
}
import { EventItem, categories, citiesData } from '../data';
import type { EventIcon } from '../../shared/contentSchema';
import useSupercluster from 'use-supercluster';
import { clusterHtml, markerHtml } from './map/markerIcons';
import { ErrorBoundary } from './ErrorBoundary';
import { TERRITORY_BOUNDS } from '../territories';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useAppStore } from '../store/appStore';

// The territories load on demand: the layer, its styles and its data stay out of the first bundle.
const TerritoryLayer = lazy(() => import('./map/TerritoryLayer').then(m => ({ default: m.TerritoryLayer })));

// The map's credit: the Relief tiles and the coast come from Natural Earth (public domain); the region
// shapes were checked against al-Thurayya's coordinates, whose license (CC BY 4.0) asks for this credit.
const TILE_ATTRIBUTION =
  'الخريطة: <a href="https://www.naturalearthdata.com/" target="_blank" rel="noopener">Natural Earth</a> (ملكية عامة)، ' +
  'ومواضع المدن: <a href="https://althurayya.github.io/" target="_blank" rel="noopener">الثريا al-Thurayya</a> ' +
  '(<a href="https://creativecommons.org/licenses/by/4.0/deed.ar" target="_blank" rel="noopener">CC BY 4.0</a>)';
// The tiles are self-hosted (public/map-tiles), at native zooms 3 to 7; the app zooms to 8 on an event.
const reliefTiles = (dark: boolean): string => `${import.meta.env.BASE_URL}map-tiles/relief-${dark ? 'dark' : 'light'}/{z}/{x}/{y}.webp`;
const ATTRIBUTION_PREFIX = '<a href="https://leafletjs.com/" target="_blank" rel="noopener">Leaflet</a>';

/**
 * The map credit, folded into a small © button (Mostafa, 3A: the full strip was too much). Top-left,
 * under the header: the only corner the panel and the timeline never cover. Opens on tap, click or
 * keyboard (and on hover with a mouse); closes on Escape or a tap on the map.
 */
function MapCredit() {
  const map = useMap();
  useEffect(() => {
    const control = new L.Control({ position: 'topleft' });
    control.onAdd = () => {
      const box = L.DomUtil.create('div', 'leaflet-control nb-credit');
      box.innerHTML =
        '<button type="button" class="nb-credit__toggle" aria-expanded="false" aria-controls="nb-credit-text" aria-label="مصادر صور الخريطة">©</button>' +
        `<span id="nb-credit-text" class="nb-credit__text" dir="rtl">${ATTRIBUTION_PREFIX} | ${TILE_ATTRIBUTION}</span>`;
      L.DomEvent.disableClickPropagation(box);
      L.DomEvent.disableScrollPropagation(box);
      return box;
    };
    control.addTo(map);
    const box = control.getContainer()!;
    const toggle = box.querySelector('button')!;
    const setOpen = (open: boolean) => {
      box.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    const onToggle = () => setOpen(!box.classList.contains('is-open'));
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || !box.classList.contains('is-open')) return;
      e.stopPropagation(); // Escape here closes the credit, not the event panel.
      setOpen(false);
      toggle.focus();
    };
    const close = () => setOpen(false);
    toggle.addEventListener('click', onToggle);
    box.addEventListener('keydown', onKey);
    map.on('click', close);
    return () => {
      toggle.removeEventListener('click', onToggle);
      box.removeEventListener('keydown', onKey);
      map.off('click', close);
      control.remove();
    };
  }, [map]);
  return null;
}

// Custom Map Controls, Updater etc... (Keep as is, but we'll update TerritoryRenderer)


interface MapViewProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  showCities?: boolean;
}

// Map Updater Component to center map on selected event
const MapUpdater = ({ selectedEvent }: { selectedEvent: EventItem | null }) => {
  const map = useMap();
  
  useEffect(() => {
    // Force recalculation of map size to fix grey unrendered areas
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    
    const onResize = () => {
      map.invalidateSize();
    };
    
    window.addEventListener('resize', onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    }
  }, [map]);

  // Read through a ref so toggling the OS setting doesn't re-run the flight.
  const reducedMotion = useReducedMotion();
  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    if (!selectedEvent) return;
    const [lat, lng] = selectedEvent.location.coordinates;
    // On mobile, shift the center down slightly because the event panel covers the bottom
    const isMobile = window.innerWidth < 640;
    // Use dynamic offsets so the event is nicely centered in the remaining visible area
    const target: L.LatLngTuple = [lat + (isMobile ? -1.8 : 0), lng];
    const zoomLevel = isMobile ? 7 : 8; // Zoom closer so the event is clearly located

    const hasSize = () => {
      const size = map.getSize();
      return size.x > 0 && size.y > 0;
    };

    if (hasSize()) {
      if (reducedMotionRef.current) {
        map.setView(target, zoomLevel, { animate: false });
      } else {
        map.flyTo(target, zoomLevel, { animate: true, duration: 1, easeLinearity: 0.1 });
      }
      return;
    }

    // flyTo on a map with no size (container hidden or not laid out yet) computes
    // NaN coordinates and throws "Invalid LatLng object", which blanked the page.
    // Wait until the container has a size, then jump there without animating.
    const observer = new ResizeObserver(() => {
      map.invalidateSize({ pan: false });
      if (!hasSize()) return;
      observer.disconnect();
      map.setView(target, zoomLevel, { animate: false });
    });
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [selectedEvent, map]);

  return null;
};

// Helper to create custom marker icons (markup in ./map/markerIcons.ts)
const createIcon = (color: string, label: string, icon: EventIcon, isSelected?: boolean, isDimmed?: boolean, hasBattle?: boolean) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const iconMarkup = markerHtml({ color, label, icon, isSelected, isDimmed, hasBattle, isMobile });

  const size = isMobile ? (isSelected ? 48 : 40) : (isSelected ? 44 : 36);
  return L.divIcon({
    html: iconMarkup,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -(size / 2)]
  });
};

// Marker colour per category (content/categories.json).
const categoryColor = (categoryId: string): string =>
  categories.find((c) => c.id === categoryId)?.color ?? categories.find((c) => c.id === 'events')!.color;

const cityIcon = L.divIcon({
  html: `<div style="width: 20px; height: 20px; background-color: rgb(var(--sys-go-rgb)); border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;"></div>`,
  className: 'custom-marker',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10]
});

const EventClusters = ({ events, selectedEvent, onSelectEvent }: Pick<MapViewProps, 'events' | 'selectedEvent' | 'onSelectEvent'>) => {
  const map = useMap();
  const [bounds, setBounds] = useState<[number, number, number, number]>(() => {
    const b = map.getBounds();
    return [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()];
  });
  const [zoom, setZoom] = useState(map.getZoom());

  const updateBounds = useCallback(() => {
    const b = map.getBounds();
    setBounds([
      b.getWest(),
      b.getSouth(),
      b.getEast(),
      b.getNorth()
    ]);
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    updateBounds();
    map.on('moveend', updateBounds);
    return () => {
      map.off('moveend', updateBounds);
    };
  }, [map, updateBounds]);

  // Important: Disable clustering for the currently selected event so it always shows individually
  const unclusteredSelectedEvent = selectedEvent;

  const selectedEventIcon = useMemo(() => {
    if (!unclusteredSelectedEvent) {
      return null;
    }

    return createIcon(
      categoryColor(unclusteredSelectedEvent.categoryId),
      unclusteredSelectedEvent.location.nameAr || unclusteredSelectedEvent.title,
      unclusteredSelectedEvent.icon,
      true,
      false,
      !!unclusteredSelectedEvent.battleScenarioId,
    );
  }, [unclusteredSelectedEvent]);

  const points = events
    .filter(evt => evt.id !== unclusteredSelectedEvent?.id)
    .map(evt => ({
      type: 'Feature' as const,
      properties: { cluster: false, eventId: evt.id, event: evt, category: evt.categoryId },
      geometry: {
        type: 'Point' as const,
        coordinates: [
          evt.location.coordinates[1], // lng
          evt.location.coordinates[0]  // lat
        ]
      }
    }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 50, maxZoom: 14 }
  });

  return (
    <>
      {clusters.map(cluster => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster } = cluster.properties;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any -- supercluster cluster/point property union
        const pointCount = (cluster.properties as any).point_count;

        if (isCluster) {
          const hasSelectedEvent = selectedEvent !== null;
          const iconMarkup = clusterHtml(pointCount, hasSelectedEvent);
          const cIcon = L.divIcon({
            html: iconMarkup,
            className: 'custom-marker',
            iconSize: [44, 44],
            iconAnchor: [22, 22],
            popupAnchor: [0, -22]
          });

          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[lat, lng]}
              icon={cIcon}
              eventHandlers={{ add: nameMarker('أحداث متعددة هنا') }}
            >
              <Popup className="historical-popup" closeButton={false} maxWidth={300}>
                <div className="font-sans text-right p-2 sm:p-1" dir="rtl">
                  <h3 className="popup-title font-bold mb-2 sm:mb-2 text-[15px] sm:text-[14px]">أحداث متعددة هنا</h3>
                  <ul className="flex flex-col gap-2 sm:gap-1.5 min-w-[220px] sm:min-w-[200px] max-h-[250px] sm:max-h-[200px] overflow-y-auto">
                    {supercluster && typeof cluster.id === 'number' && supercluster.getLeaves(cluster.id, Infinity).map(leaf => (
                      <li key={leaf.properties.eventId}>
                        <button
                          onClick={() => {
                            onSelectEvent(leaf.properties.event);
                            map.closePopup();
                          }}
                          className="popup-text popup-surface w-full text-right px-3 sm:px-3 py-2.5 sm:py-2 hover:bg-accent/20 rounded-lg sm:rounded-[4px] transition font-bold text-[14px] sm:text-[13px] hover:border-accent/40 min-h-[44px] sm:min-h-0 flex items-center"
                        >
                          {leaf.properties.event.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </Popup>
            </Marker>
          );
        }

        const evt = cluster.properties.event;
        const mappedColor = categoryColor(evt.categoryId);
        const isDimmed = selectedEvent !== null;
        const icon = createIcon(mappedColor, evt.location.nameAr || evt.title, evt.icon, false, isDimmed, !!evt.battleScenarioId);

        return (
          <Marker 
            key={evt.id}
            position={[lat, lng]} 
            icon={icon}
            zIndexOffset={0}
            eventHandlers={{
              add: nameMarker(evt.title),
              click: () => onSelectEvent(evt),
            }}
          />
        );
      })}

      {/* Explicitly render the selected event on top unclustered */}
      {unclusteredSelectedEvent && (
        <Marker 
          key={unclusteredSelectedEvent.id}
          position={[unclusteredSelectedEvent.location.coordinates[0], unclusteredSelectedEvent.location.coordinates[1]]} 
          icon={selectedEventIcon ?? undefined}
          zIndexOffset={2000}
          eventHandlers={{ add: nameMarker(unclusteredSelectedEvent.title) }}
        />
      )}
    </>
  );
};

export default function HistoricalMap({ events, selectedEvent, onSelectEvent, showCities = true }: MapViewProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const isDarkMode = useAppStore(s => s.isDarkMode);

  const resetView = useCallback(() => {
    if (map) {
      map.flyTo([24.4672, 39.6112], 6, { animate: true, duration: 1.5 });
    }
  }, [map]);

  // The header's reset button bumps mapResetCount in the store.
  const mapResetCount = useAppStore(s => s.mapResetCount);
  const lastReset = useRef(mapResetCount);
  useEffect(() => {
    if (mapResetCount === lastReset.current) return;
    lastReset.current = mapResetCount;
    resetView();
  }, [mapResetCount, resetView]);

  return (
    <div className="relative w-full h-full z-0" data-tour-id="map-container">
      {/* Map controls moved to header - see App.tsx */}
      
      <MapContainer
        center={[24.4672, 39.6112]}
        zoom={6}
        // Further out the map would be mostly beyond the tiles and the history it shows.
        minZoom={window.innerWidth < 640 ? 3 : 4}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        attributionControl={false}
        ref={setMap}
        // @ts-expect-error - gestureHandling options are added by the plugin
        gestureHandling={true}
        gestureHandlingOptions={{
          text: {
            touch: 'استخدم إصبعين للتحريك',
            scroll: 'اضغط Ctrl + عجلة الفأرة للتكبير',
            scrollMac: 'اضغط ⌘ + عجلة الفأرة للتكبير',
          },
          duration: 1500,
        }}
      >
        <TileLayer
          url={reliefTiles(isDarkMode)}
          bounds={TERRITORY_BOUNDS}
          minNativeZoom={3}
          maxNativeZoom={7}
          className="historical-map-tiles"
          keepBuffer={8}
        />
        <MapCredit />
        <MapUpdater selectedEvent={selectedEvent} />

        <ErrorBoundary area="territories" variant="floating">
          <Suspense fallback={null}>
            <TerritoryLayer year={selectedEvent ? selectedEvent.date.sortKey : null} />
          </Suspense>
        </ErrorBoundary>

        {/* Render Cities */}
        {showCities && citiesData.map(city => (
          <Marker
            key={city.id}
            position={city.coordinates}
            icon={cityIcon}
            eventHandlers={{ add: nameMarker(city.name) }}
          >
            <Popup
              className="historical-popup"
              closeButton={false}
              autoPanPadding={[50, 50]}
            >
              <div className="font-sans text-right min-w-[200px]" dir="rtl">
                <h3 className="popup-title font-bold text-[16px] border-b border-white/15 pb-2 mb-2">
                  {city.name}
                </h3>
                <p className="popup-text text-[13px] leading-relaxed mb-3">
                  {city.description}
                </p>
                <div className="popup-surface p-2 rounded">
                  <span className="popup-accent block text-[11px] font-bold mb-0.5">الأهمية التاريخية:</span>
                  <p className="popup-muted text-[12px] leading-relaxed">
                    {city.significance}
                  </p>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Render Events */}
        <EventClusters events={events} selectedEvent={selectedEvent} onSelectEvent={onSelectEvent} />
        
        {/* Route line if available and event is selected */}
        {selectedEvent?.route && (
          <Polyline
            positions={selectedEvent.route}
            color={categoryColor(selectedEvent.categoryId)}
            weight={3}
            dashArray="5, 10"
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}
