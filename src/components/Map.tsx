import React, { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { EventItem, citiesData } from '../data';
import { renderToStaticMarkup } from 'react-dom/server';
import useSupercluster from 'use-supercluster';
import { Maximize, Minimize, Home, Filter, Swords, Flag, MapPin, ScrollText, Tent, Book, Crown, Skull } from 'lucide-react';
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
      // Very smooth, immersive zoom transition for the journey effect
      map.flyTo(selectedEvent.location.coordinates, 6, { 
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
const createIcon = (color: string, label: string, category: string, title: string) => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex justify-center">
      <div className="w-7 h-7 rounded-full border-[2px] border-parchment shadow-[0_0_10px_rgba(0,0,0,0.6)] flex items-center justify-center transition-transform hover:scale-125" style={{ backgroundColor: color }}>
        {getCategoryIcon(category, title)}
      </div>
      <div className="absolute top-8 bg-ink text-parchment px-2 py-0.5 rounded-[4px] text-[11px] whitespace-nowrap opacity-90 pointer-events-none z-10 font-sans border border-border-dark/50 shadow-sm">
        {label}
      </div>
    </div>
  );
  return L.divIcon({
    html: iconMarkup,
    className: 'custom-marker',
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

const iconConfig: Record<string, { color: string }> = {
  'battle': { color: '#ef4444' },        
  'migration': { color: '#10b981' },  
  'revelation': { color: '#f59e0b' },     
  'landmark': { color: '#3b82f6' },       
  'treaty': { color: '#8b5cf6' },
  'politics': { color: '#6366f1' },
  'أحداث': { color: '#8b7355' },
};

const cityIcon = L.divIcon({
  html: `<div class="w-4 h-4 bg-[#10b981] border-2 border-parchment shadow-[0_0_10px_rgba(0,0,0,0.4)] rounded-full flex items-center justify-center"></div>`,
  className: 'custom-marker',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
  popupAnchor: [0, -8]
});

const createClusterIcon = (count: number) => {
  const iconMarkup = renderToStaticMarkup(
    <div className="relative flex justify-center items-center w-9 h-9 rounded-full border-2 border-parchment shadow-[0_0_15px_rgba(0,0,0,0.5)] bg-accent transition-transform hover:scale-110">
      <span className="text-parchment font-bold font-sans text-sm drop-shadow-md">{count}</span>
    </div>
  );
  return L.divIcon({
    html: iconMarkup,
    className: 'custom-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18]
  });
};

const EventClusters = ({ events, selectedEvent, onSelectEvent }: MapViewProps) => {
  const map = useMap();
  const [bounds, setBounds] = useState<any>(null);
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
    return () => { map.off('moveend', updateBounds); }
  }, [map, updateBounds]);

  const points = events.map(evt => ({
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
    options: { radius: 55, maxZoom: 14 }
  });

  return (
    <>
      {clusters.map(cluster => {
        const [lng, lat] = cluster.geometry.coordinates;
        const { cluster: isCluster } = cluster.properties;
        const pointCount = (cluster.properties as any).point_count;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
              position={[lat, lng]}
              icon={createClusterIcon(pointCount)}
            >
              <Popup className="historical-popup" closeButton={false}>
                <div className="font-sans text-right p-1" dir="rtl">
                  <h3 className="font-bold text-ink mb-2 text-[14px]">أحداث متعددة هنا</h3>
                  <ul className="flex flex-col gap-1.5 min-w-[200px] max-h-[200px] overflow-y-auto">
                    {supercluster.getLeaves(cluster.id as number, Infinity).map((leaf: any) => (
                      <li key={leaf.properties.eventId}>
                        <button 
                          onClick={() => {
                            onSelectEvent(leaf.properties.event);
                            map.closePopup();
                          }}
                          className="w-full text-right px-3 py-2 bg-ink/5 hover:bg-accent/20 rounded-[4px] transition text-battle-red font-bold text-[13px] border border-transparent hover:border-accent/40"
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
        const icon = createIcon(mappedColor, evt.location?.name || evt.title, evt.category, evt.title);

        return (
          <Marker 
            key={evt.id}
            position={[lat, lng]} 
            icon={icon}
            eventHandlers={{
              click: () => onSelectEvent(evt),
            }}
          />
        );
      })}
    </>
  );
};

// Custom Zoom Controls ensuring it integrates safely with leaflet map context
const CustomMapControls = ({ onOpenFilter }: { onOpenFilter?: () => void }) => {
  const map = useMap();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFs = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFs);
    return () => document.removeEventListener('fullscreenchange', handleFs);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(e => console.error(e));
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const resetView = () => {
    map.flyTo([24.4672, 39.6112], 6, { animate: true, duration: 1.5 });
  };
  
  return (
    <div className="leaflet-top leaflet-left !top-[70px] sm:!top-[90px] !left-2 sm:!left-4">
      <div className="leaflet-control flex flex-col gap-1 sm:gap-2 pointer-events-auto">
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomIn(); }}
          onDoubleClick={(e) => { e.stopPropagation(); }}
          className="hidden sm:flex w-10 h-10 bg-card-bg shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded text-ink hover:bg-parchment border border-border-dark justify-center items-center font-bold text-xl transition-colors"
          title="تكبير"
        >
          +
        </button>
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); map.zoomOut(); }}
          onDoubleClick={(e) => { e.stopPropagation(); }}
          className="hidden sm:flex w-10 h-10 bg-card-bg shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded text-ink hover:bg-parchment border border-border-dark justify-center items-center font-bold text-xl transition-colors"
          title="تصغير"
        >
          -
        </button>
        
        {/* Reset View */}
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); resetView(); }}
          className="w-8 h-8 sm:w-10 sm:h-10 bg-card-bg shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded text-ink hover:bg-parchment border border-border-dark flex justify-center items-center transition-colors sm:mt-2"
          title="العودة للمركز">
          <Home size={16} className="sm:w-[18px] sm:h-[18px]" />
        </button>

        {/* Open Filter Menu */}
        {onOpenFilter && (
          <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); onOpenFilter(); }}
            className="w-8 h-8 sm:w-10 sm:h-10 bg-accent text-parchment shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded hover:bg-[#a68058] border border-border-dark flex justify-center items-center transition-colors sm:mt-2"
            title="تصفية الخريطة">
            <Filter size={16} className="sm:w-[18px] sm:h-[18px]" />
          </button>
        )}

        {/* Fullscreen */}
        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFullscreen(); }}
          className="hidden sm:flex w-10 h-10 bg-card-bg shadow-[0_0_15px_rgba(0,0,0,0.1)] rounded text-ink hover:bg-parchment border border-border-dark justify-center items-center transition-colors mt-2"
          title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}>
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
};

const TerritoryRenderer = ({ selectedEvent }: { selectedEvent: EventItem | null }) => {
  const [territoryGroups, setTerritoryGroups] = useState<TerritoryGroup[]>([]);

  useEffect(() => {
    const currentYear = selectedEvent ? selectedEvent.date.gregorian : 610;
    setTerritoryGroups(getTerritoriesForYear(currentYear));
  }, [selectedEvent]);

  return (
    <>
      {territoryGroups.map(group => (
        <React.Fragment key={group.id}>
          {group.polygons.map((poly, idx) => {
            const isRidda = group.id === 'ridda';
            
            return (
              <Polyline 
                key={`${group.id}-${idx}`}
                positions={poly.coordinates}
                pathOptions={{
                  color: isRidda ? '#f87171' : poly.color,
                  fillColor: poly.color,
                  fillOpacity: isRidda ? 0.45 : 0.3,
                  weight: isRidda ? 2 : 1,
                  dashArray: isRidda ? '8, 8' : '0',
                  opacity: isRidda ? 1 : 0.5,
                  fill: true 
                }}
              >
                <Popup className="historical-popup" closeButton={false}>
                  <div className="font-sans font-bold text-base px-3 py-2 text-center drop-shadow-md" dir="rtl" style={{ color: poly.color }}>
                    {poly.name}
                  </div>
                </Popup>
              </Polyline>
            );
          })}
        </React.Fragment>
      ))}
    </>
  );
};

export default function HistoricalMap({ events, selectedEvent, onSelectEvent, showCities = true, onOpenFilter }: MapViewProps) {
  return (
    <div className="relative w-full h-full z-0">
      <MapContainer 
        center={[24.4672, 39.6112]} 
        zoom={6} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          className="historical-map-tiles"
        />
        <MapUpdater selectedEvent={selectedEvent} />
        <CustomMapControls onOpenFilter={onOpenFilter} />

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
                <h3 className="font-bold text-[16px] text-ink border-b border-border-dark/30 pb-2 mb-2">
                  {city.name}
                </h3>
                <p className="text-[13px] text-ink/80 leading-relaxed mb-3">
                  {city.description}
                </p>
                <div className="bg-ink/5 p-2 rounded border border-border-dark/20">
                  <span className="block text-[11px] font-bold text-accent mb-0.5">الأهمية التاريخية:</span>
                  <p className="text-[12px] text-ink/70 leading-relaxed">
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
