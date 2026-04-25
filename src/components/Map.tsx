import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EventItem, citiesData } from '../data';
import { renderToStaticMarkup } from 'react-dom/server';
import useSupercluster from 'use-supercluster';
import { Maximize2, Minimize2, LocateFixed, SlidersHorizontal, Swords, Flag, MapPin, ScrollText, Tent, Book, Crown, Skull } from 'lucide-react';
import { getTerritoriesForYear, TerritoryGroup } from '../territoriesData';

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
    if (selectedEvent) {
      const [lat, lng] = selectedEvent.location.coordinates;
      // On mobile, shift the center down slightly because the event panel covers the bottom
      const isMobile = window.innerWidth < 640;
      // Use dynamic offsets so the event is nicely centered in the remaining visible area
      const latOffset = isMobile ? -1.8 : 0; 
      
      const zoomLevel = isMobile ? 7 : 8; // Zoom closer so the event is clearly located
      
      // Very smooth, immersive zoom transition for the journey effect
      map.flyTo([lat + latOffset, lng], zoomLevel, {
        animate: true,
        duration: 2.5,
        easeLinearity: 0.1
      });
    }
  }, [selectedEvent, map]);

  return null;
};

// Return meaningful Lucide icons based on event keywords
const getCategoryIcon = (category: string, title: string) => {
  if (title.includes('وفاة') || title.includes('استشهاد')) return <Skull size={14} color="#fff" />;
  if (title.includes('خلافة') || title.includes('تولي') || title.includes('عاصمة')) return <Crown size={14} color="#fff" />;
  if (category === 'battle' || title.includes('معركة') || title.includes('موقعة') || title.includes('يوم') || title.includes('غزوة') || title.includes('حروب')) return <Swords size={14} color="#fff" />;
  if (title.includes('فتح')) return <Flag size={14} color="#fff" />;
  if (title.includes('مصحف') || title.includes('قرآن') || title.includes('وحي')) return <Book size={14} color="#fff" />;
  if (category === 'treaty' || title.includes('صلح') || title.includes('وثيقة') || title.includes('بيعة')) return <ScrollText size={14} color="#fff" />;
  if (category === 'migration' || title.includes('هجرة') || title.includes('انتقال')) return <Tent size={14} color="#fff" />;
  
  return <MapPin size={14} color="#fff" />;
};

// Helper to create custom marker icons
const createIcon = (color: string, label: string, category: string, title: string, isSelected?: boolean, isDimmed?: boolean) => {
  const iconMarkup = renderToStaticMarkup(
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'all 700ms',
        width: '40px',
        height: '40px',
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
          width: isSelected ? '40px' : '32px',
          height: isSelected ? '40px' : '32px',
          borderRadius: '9999px',
          border: '3px solid white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 300ms',
          transform: isSelected ? 'scale(1.25)' : 'scale(1)',
          backgroundColor: color,
          zIndex: isSelected ? 1000 : 'auto'
        }}
      >
        {getCategoryIcon(category, title)}
      </div>
      {!isDimmed && (
        <div
          style={{
            position: 'absolute',
            top: '42px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(44, 36, 30, 0.95)',
            color: '#f4ece1',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 700,
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            zIndex: 10,
            boxShadow: '0 2px 12px rgba(0,0,0,0.5)',
            border: '2px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(4px)',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            minWidth: 'max-content'
          }}
        >
          {label}
        </div>
      )}
    </div>
  );

  return L.divIcon({
    html: iconMarkup,
    className: 'custom-marker',
    iconSize: [40, 40],
    iconAnchor: [20, 20],
    popupAnchor: [0, -20]
  });
};

const iconConfig: Record<string, { color: string }> = {
  'battle': { color: '#ef4444' },        
  'غزوات ومعارك': { color: '#ef4444' },
  'migration': { color: '#10b981' },  
  'revelation': { color: '#f59e0b' },     
  'landmark': { color: '#3b82f6' },       
  'treaty': { color: '#8b5cf6' },
  'politics': { color: '#6366f1' },
  'أحداث': { color: '#06b6d4' },
};

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
      iconConfig[unclusteredSelectedEvent.category]?.color || iconConfig['أحداث'].color,
      unclusteredSelectedEvent.location?.name || unclusteredSelectedEvent.title,
      unclusteredSelectedEvent.category,
      unclusteredSelectedEvent.title,
      true,
      false
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
              <Popup className="historical-popup" closeButton={false}>
                <div className="font-sans text-right p-1" dir="rtl">
                  <h3 className="popup-title font-bold mb-2 text-[14px]">أحداث متعددة هنا</h3>
                  <ul className="flex flex-col gap-1.5 min-w-[200px] max-h-[200px] overflow-y-auto">
                    {supercluster && typeof cluster.id === 'number' && supercluster.getLeaves(cluster.id, Infinity).map((leaf: any) => (
                      <li key={leaf.properties.eventId}>
                        <button 
                          onClick={() => {
                            onSelectEvent(leaf.properties.event);
                            map.closePopup();
                          }}
                          className="popup-text popup-surface w-full text-right px-3 py-2 hover:bg-accent/20 rounded-[4px] transition font-bold text-[13px] hover:border-accent/40"
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
        const mappedColor = iconConfig[evt.category]?.color || iconConfig['أحداث'].color;
        const isDimmed = selectedEvent !== null;
        const icon = createIcon(mappedColor, evt.location?.name || evt.title, evt.category, evt.title, false, isDimmed);

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

// New Map Controls Component - positioned on the left side
const MapControls = ({
  onOpenFilter,
  onResetView,
  onToggleFullscreen,
  isFullscreen
}: {
  onOpenFilter?: () => void;
  onResetView: () => void;
  onToggleFullscreen: () => void;
  isFullscreen: boolean;
}) => {
  return (
    <div
      className="absolute top-[16px] sm:top-[24px] left-2 sm:left-4 z-[1000] flex flex-col gap-2 pointer-events-auto"
      dir="ltr"
    >
      {/* Control 1: Recenter Map - Returns to default Arabian Peninsula view */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onResetView();
        }}
        className="w-10 h-10 sm:w-11 sm:h-11 bg-card-bg/95 backdrop-blur-sm shadow-lg rounded-lg text-ink hover:bg-accent hover:text-parchment border border-border-dark/40 flex justify-center items-center transition-all duration-200 hover:scale-105 active:scale-95"
        title="إعادة توسيط الخريطة"
        aria-label="إعادة توسيط الخريطة إلى الموقع الافتراضي"
      >
        <LocateFixed size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} aria-hidden="true" />
      </button>

      {/* Control 2: Filter Events - Opens filter menu for event categories */}
      {onOpenFilter && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenFilter();
          }}
          className="w-10 h-10 sm:w-11 sm:h-11 bg-accent/95 backdrop-blur-sm text-parchment shadow-lg rounded-lg hover:bg-accent hover:brightness-110 border border-border-dark/40 flex justify-center items-center transition-all duration-200 hover:scale-105 active:scale-95"
          title="تصفية الأحداث"
          aria-label="فتح قائمة تصفية الأحداث حسب الفئة"
        >
          <SlidersHorizontal size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} aria-hidden="true" />
        </button>
      )}

      {/* Control 3: Fullscreen Toggle - Expands/collapses fullscreen mode */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggleFullscreen();
        }}
        className="w-10 h-10 sm:w-11 sm:h-11 bg-card-bg/95 backdrop-blur-sm shadow-lg rounded-lg text-ink hover:bg-accent hover:text-parchment border border-border-dark/40 flex justify-center items-center transition-all duration-200 hover:scale-105 active:scale-95"
        title={isFullscreen ? "الخروج من وضع ملء الشاشة" : "وضع ملء الشاشة"}
        aria-label={isFullscreen ? "الخروج من وضع ملء الشاشة" : "تفعيل وضع ملء الشاشة"}
      >
        {isFullscreen ? (
          <Minimize2 size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} aria-hidden="true" />
        ) : (
          <Maximize2 size={18} className="sm:w-5 sm:h-5" strokeWidth={2.5} aria-hidden="true" />
        )}
      </button>
    </div>
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

const LegendOverlay = ({ selectedEvent }: { selectedEvent: EventItem | null }) => {
  const groups = useMemo(() => {
    const currentYear = selectedEvent ? selectedEvent.date.gregorian : 610;
    return getTerritoriesForYear(currentYear);
  }, [selectedEvent]);
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div
      className="absolute top-[80px] sm:top-[90px] left-2 sm:left-4 right-auto z-[400] bg-[#2c241e] dark:bg-[#f4ece1] backdrop-blur-lg border-2 border-white/30 dark:border-[#8b6b4a]/40 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] pointer-events-auto transition-all duration-300"
      dir="rtl"
      onWheel={(e) => {
        e.stopPropagation();
      }}
      onTouchMove={(e) => {
        e.stopPropagation();
      }}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full p-3 sm:p-4 flex items-center justify-between hover:bg-white/15 dark:hover:bg-[#8b6b4a]/15 transition-colors rounded-t-xl"
        aria-label={isCollapsed ? "فتح مفتاح الخريطة" : "إغلاق مفتاح الخريطة"}
        aria-expanded={!isCollapsed}
      >
        <h4 className="text-[#f4ece1] dark:text-[#2c241e] font-bold text-sm sm:text-base flex items-center gap-2" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
          <MapPin size={16} className="text-[#d4a373] dark:text-[#8b6b4a] sm:w-5 sm:h-5" aria-hidden="true" />
          مفتاح الخريطة
        </h4>
        <span className="text-[#f4ece1] dark:text-[#2c241e] text-base font-bold" aria-hidden="true">{isCollapsed ? '▼' : '▲'}</span>
      </button>
      {!isCollapsed && (
        <div
          className="px-3 pb-3 sm:px-4 sm:pb-4 flex flex-col gap-2.5 sm:gap-3 max-h-[200px] sm:max-h-[240px] overflow-y-auto legend-scroll"
          onWheel={(e) => {
            e.stopPropagation();
          }}
          onTouchMove={(e) => {
            e.stopPropagation();
          }}
        >
          {groups.map(g => (
            <div key={g.id} className="flex items-center gap-2.5 sm:gap-3 group py-1">
              <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-sm border-2 border-white/50 dark:border-[#2c241e]/50 shadow-lg shrink-0 transition-transform group-hover:scale-110" style={{ backgroundColor: g.color }} aria-hidden="true"></div>
              <span className="text-[#f4ece1] dark:text-[#2c241e] text-xs sm:text-sm leading-snug font-bold" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>{g.name}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function HistoricalMap({ events, selectedEvent, onSelectEvent, showCities = true, onOpenFilter }: MapViewProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => {
      document.removeEventListener('fullscreenchange', handleFs);
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const resetView = useCallback(() => {
    if (map) {
      map.flyTo([24.4672, 39.6112], 6, { animate: true, duration: 1.5 });
    }
  }, [map]);

  return (
    <div className="relative w-full h-full z-0" data-tour-id="map-container">
      <LegendOverlay selectedEvent={selectedEvent} />
      <MapControls
        onOpenFilter={onOpenFilter}
        onResetView={resetView}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
      />
      
      <MapContainer
        center={[24.4672, 39.6112]}
        zoom={6}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
        ref={setMap}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          className="historical-map-tiles"
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
            color={iconConfig[selectedEvent.category as keyof typeof iconConfig]?.color || 'var(--color-battle-red)'}
            weight={3}
            dashArray="5, 10"
            opacity={0.8}
          />
        )}
      </MapContainer>
    </div>
  );
}
