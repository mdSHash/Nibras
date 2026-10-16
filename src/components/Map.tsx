import React, { useEffect, useState, useCallback, useMemo, useRef, type ReactElement } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { GestureHandling } from 'leaflet-gesture-handling';
import 'leaflet-gesture-handling/dist/leaflet-gesture-handling.css';

// Register the gesture handler once at module load.
// Requires two-finger pan on touch, ctrl+wheel zoom on desktop — prevents map
// from stealing page scroll when the user is scrolling the surrounding UI.
const LeafletMapClass = L.Map as typeof L.Map & { _nibrasGestureHandlerRegistered?: boolean };
if (!LeafletMapClass._nibrasGestureHandlerRegistered) {
  L.Map.addInitHook('addHandler', 'gestureHandling', GestureHandling);
  LeafletMapClass._nibrasGestureHandlerRegistered = true;
}
import { EventItem, categories, citiesData } from '../data';
import type { EventIcon } from '../../shared/contentSchema';
import { renderToStaticMarkup } from 'react-dom/server';
import useSupercluster from 'use-supercluster';
import { Swords, Flag, MapPin, ScrollText, Tent, Book, Crown, Skull } from 'lucide-react';
import { getTerritoriesForYear } from '../territoriesData';
import { useReducedMotion } from '../hooks/useReducedMotion';

// Custom Map Controls, Updater etc... (Keep as is, but we'll update TerritoryRenderer)


interface MapViewProps {
  events: EventItem[];
  selectedEvent: EventItem | null;
  onSelectEvent: (event: EventItem) => void;
  showCities?: boolean;
  onOpenFilter?: () => void;
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

// Marker icon per event (content/events/<id>.json, `icon`).
const EVENT_ICONS: Record<EventIcon, ReactElement> = {
  skull: <Skull size={14} color="#fff" />,
  crown: <Crown size={14} color="#fff" />,
  swords: <Swords size={14} color="#fff" />,
  flag: <Flag size={14} color="#fff" />,
  book: <Book size={14} color="#fff" />,
  scroll: <ScrollText size={14} color="#fff" />,
  tent: <Tent size={14} color="#fff" />,
  pin: <MapPin size={14} color="#fff" />,
};

// Helper to create custom marker icons
const createIcon = (color: string, label: string, icon: EventIcon, isSelected?: boolean, isDimmed?: boolean, hasBattle?: boolean) => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const iconSize = isMobile ? (isSelected ? '48px' : '40px') : (isSelected ? '44px' : '36px');
  const badgeSize = isMobile ? 16 : 14;
  
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 700ms',
        width: iconSize,
        height: iconSize,
        opacity: isDimmed ? 0.4 : 1,
        filter: isDimmed ? 'grayscale(0.8)' : 'none'
      }}
    >
      {isSelected && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '9999px',
            opacity: 0.75,
            margin: '0 auto',
            width: '100%',
            height: '100%',
            backgroundColor: color,
            animation: 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite'
          }}
        />
      )}
      <div
        style={{
          position: 'relative',
          width: isMobile ? (isSelected ? '44px' : '36px') : (isSelected ? '40px' : '32px'),
          height: isMobile ? (isSelected ? '44px' : '36px') : (isSelected ? '40px' : '32px'),
          borderRadius: '9999px',
          border: isMobile ? '3px solid white' : '3px solid white',
          boxShadow: isSelected ? '0 4px 16px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 300ms',
          transform: isSelected ? 'scale(1.25)' : 'scale(1)',
          backgroundColor: color,
          zIndex: isSelected ? 1000 : 'auto'
        }}
      >
        {EVENT_ICONS[icon]}
      </div>
      {hasBattle && !isDimmed && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            top: '-2px',
            right: '-2px',
            width: `${badgeSize}px`,
            height: `${badgeSize}px`,
            borderRadius: '9999px',
            backgroundColor: 'var(--color-accent)',
            border: '1.5px solid rgba(20,15,10,0.9)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 11,
          }}
        >
          {/* Filled play triangle, optically nudged to visually center. */}
          <svg width={badgeSize - 6} height={badgeSize - 6} viewBox="0 0 8 8" fill="rgba(20,15,10,0.95)">
            <path d="M2 1.2 L6.6 4 L2 6.8 Z" />
          </svg>
        </div>
      )}
      {!isDimmed && (
        <div
          style={{
            position: 'absolute',
            top: isMobile ? '48px' : '42px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(44, 36, 30, 0.95)',
            color: '#f4ece1',
            padding: isMobile ? '8px 14px' : '6px 12px',
            borderRadius: '8px',
            fontSize: isMobile ? '13px' : '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            minWidth: 'max-content',
            maxWidth: isMobile ? '200px' : 'none',
            overflow: isMobile ? 'hidden' : 'visible',
            textOverflow: isMobile ? 'ellipsis' : 'clip'
          }}
        >
          {label}
        </div>
      )}
    </div>
  );

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
  html: `<div style="width: 20px; height: 20px; background-color: #10b981; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.5); border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s;"></div>`,
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
      categoryColor(unclusteredSelectedEvent.category),
      unclusteredSelectedEvent.location?.name || unclusteredSelectedEvent.title,
      unclusteredSelectedEvent.icon,
      true,
      false,
      !!unclusteredSelectedEvent.battleId,
    );
  }, [unclusteredSelectedEvent]);

  const points = events
    .filter(evt => evt.id !== unclusteredSelectedEvent?.id)
    .map(evt => ({
      type: 'Feature' as const,
      properties: { cluster: false, eventId: evt.id, event: evt, category: evt.category },
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
          const dimClass = hasSelectedEvent ? 'opacity-40 grayscale-[0.8]' : 'opacity-100';
          const iconMarkup = renderToStaticMarkup(
            <div className={`relative flex justify-center items-center w-11 h-11 rounded-full border-[3px] border-white shadow-[0_2px_10px_rgba(0,0,0,0.5)] bg-accent transition-transform hover:scale-110 ${dimClass}`}>
              <span className="text-white font-extrabold text-base drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{pointCount}</span>
            </div>
          );
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
        const mappedColor = categoryColor(evt.category);
        const isDimmed = selectedEvent !== null;
        const icon = createIcon(mappedColor, evt.location?.name || evt.title, evt.icon, false, isDimmed, !!evt.battleId);

        return (
          <Marker 
            key={evt.id}
            position={[lat, lng]} 
            icon={icon}
            zIndexOffset={0}
            eventHandlers={{
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
        />
      )}
    </>
  );
};

const TerritoryRenderer = ({ selectedEvent }: { selectedEvent: EventItem | null }) => {
  const territoryGroups = useMemo(() => {
    const currentYear = selectedEvent ? selectedEvent.date.gregorian : 610;
    return getTerritoriesForYear(currentYear);
  }, [selectedEvent]);

  return (
    <>
      {territoryGroups.map(group => (
        <React.Fragment key={group.id}>
          {group.polygons.map((poly, idx) => {
            const isRidda = group.id === 'ridda';
            
            return (
              <Polygon
                key={`${group.id}-${idx}`}
                positions={poly.coordinates}
                pathOptions={{
                  color: isRidda ? '#f87171' : poly.color,
                  fillColor: poly.color,
                  fillOpacity: isRidda ? 0.4 : 0.3,
                  weight: isRidda ? 2.5 : 2,
                  dashArray: isRidda ? '8, 8' : '0',
                  opacity: isRidda ? 1 : 0.7,
                  fill: true,
                  lineCap: "round",
                  lineJoin: "round"
                }}
              >
                <Popup className="historical-popup" closeButton={false}>
                  <div className="popup-title font-sans font-bold text-base px-4 py-3 text-center drop-shadow-lg bg-ink/90 rounded-lg border-2 border-white/20" dir="rtl">
                    {poly.name}
                  </div>
                </Popup>
              </Polygon>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

export default function HistoricalMap({ events, selectedEvent, onSelectEvent, showCities = true }: MapViewProps) {
  const [map, setMap] = useState<L.Map | null>(null);

  const resetView = useCallback(() => {
    if (map) {
      map.flyTo([24.4672, 39.6112], 6, { animate: true, duration: 1.5 });
    }
  }, [map]);

  // Listen for custom event from header to reset map view
  useEffect(() => {
    const handleResetView = () => resetView();
    window.addEventListener('nibras:reset-map-view', handleResetView);
    return () => window.removeEventListener('nibras:reset-map-view', handleResetView);
  }, [resetView]);

  return (
    <div className="relative w-full h-full z-0" data-tour-id="map-container">
      {/* Map controls moved to header - see App.tsx */}
      
      <MapContainer
        center={[24.4672, 39.6112]}
        zoom={6}
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
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          className="historical-map-tiles"
          keepBuffer={8}
        />
        <MapUpdater selectedEvent={selectedEvent} />

        <TerritoryRenderer selectedEvent={selectedEvent} />

        {/* Render Cities */}
        {showCities && citiesData.map(city => (
          <Marker
            key={city.id}
            position={city.coordinates}
            icon={cityIcon}
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
            color={categoryColor(selectedEvent.category)}
            weight={3}
            dashArray="5, 10"
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}
