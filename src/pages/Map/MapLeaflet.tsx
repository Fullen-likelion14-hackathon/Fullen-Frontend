// src/pages/Map/MapLeaflet.tsx
import { useEffect, useMemo, type MutableRefObject } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { latLngBounds, type Map as LeafletMapInstance } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPin } from "../../types/mapPin";

const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
const TILE_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012";

const MIN_ZOOM = 2;
const WORLD_BOUNDS = latLngBounds([-85, -180], [85, 180]);

interface MapLeafletProps {
  pins: MapPin[];
  activeJourneyId: number | null;
  onPinClick?: (pin: MapPin) => void;
  mapRef?: MutableRefObject<LeafletMapInstance | null>;
  height?: string | number;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

function createPinIcon(isActive: boolean) {
  const color = isActive ? "#e53935" : "#9e9e9e";
  const size = isActive ? 38 : 30;
  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path fill="${color}" stroke="#ffffff" stroke-width="1"
        d="M12 0C7.03 0 3 4.03 3 9c0 6.5 9 15 9 15s9-8.5 9-15c0-4.97-4.03-9-9-9z"/>
      <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
    </svg>`;
  return L.divIcon({
    html: svg,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
  });
}

function MapRefBinder({ mapRef }: { mapRef?: MutableRefObject<LeafletMapInstance | null> }) {
  const map = useMap();
  useEffect(() => {
    if (mapRef) mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

/** 좌표가 유효한(null/undefined 아닌) 핀만 걸러내는 헬퍼 */
function hasValidCoords(pin: MapPin): pin is MapPin & { latitude: number; longitude: number } {
  return pin.latitude != null && pin.longitude != null;
}

export function MapLeaflet({
  pins,
  activeJourneyId,
  onPinClick,
  mapRef,
  height = "100%",
  initialCenter,
  initialZoom = 1.5,
}: MapLeafletProps) {
  // 좌표 있는 핀만 지도에 그림 (null 좌표는 Leaflet 크래시 원인이라 여기서 제외)
  const validPins = useMemo(() => pins.filter(hasValidCoords), [pins]);

  const center = useMemo<[number, number]>(() => {
    if (initialCenter) return [initialCenter.lat, initialCenter.lng];
    const first = validPins[0]; // 필터링된 배열에서 첫번째를 씀 (원본 pins[0] 아님)
    return first ? [first.latitude, first.longitude] : [20, 0];
  }, [initialCenter, validPins]);

  return (
    <MapContainer
      center={center}
      zoom={initialZoom}
      minZoom={MIN_ZOOM}
      zoomSnap={0.5}
      zoomDelta={0.5}
      wheelPxPerZoomLevel={100}
      maxBounds={WORLD_BOUNDS}
      maxBoundsViscosity={1.0}
      worldCopyJump
      style={{ width: "100%", height }}
      zoomControl={false}
    >
      <MapRefBinder mapRef={mapRef} />
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {validPins.map((pin) => (
        <Marker
          key={pin.journeyId}
          position={[pin.latitude, pin.longitude]}
          icon={createPinIcon(pin.journeyId === activeJourneyId)}
          eventHandlers={{
            click: () => onPinClick?.(pin),
          }}
        />
      ))}
    </MapContainer>
  );
}