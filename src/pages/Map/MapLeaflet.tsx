// src/pages/Map/MapLeaflet.tsx
// (기존 pages/Map/MapGlobe.tsx 대체 - 3D 지구본 대신 실제 지도 타일)
//
// 설치 필요:
//   npm install react-leaflet leaflet
//
// 타일 스타일 옵션 (URL만 바꾸면 교체됨, 전부 API 키/가입 불필요):
//   Voyager(현재)  : https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png
//   Positron(밝음) : https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png
//   Dark Matter    : https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png
//   OSM 기본       : https://tile.openstreetmap.org/{z}/{x}/{y}.png (서브도메인 {s} 없음, 사용량 정책 주의)
//   Esri World St. : https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}
//
// 이 파일은 컴포넌트만 export합니다.
// 지도 이동 유틸(flyToPin)은 ../../utils/mapCamera 로 분리했습니다.
// (컴포넌트 파일에 일반 함수를 같이 export하면 Fast Refresh 경고가 발생함)

import { useEffect, useMemo, type MutableRefObject } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L, { latLngBounds, type Map as LeafletMapInstance } from "leaflet";
import "leaflet/dist/leaflet.css";
import type { MapPin } from "../../types/mapPin";

// Esri World Street Map - 무료, API 키/가입 불필요.
// 전 세계 국가/도시명 라벨이 기본적으로 영어로 표시됨(CARTO/OSM은 국가별로
// 현지 문자로 나올 때가 있어서, 영어 라벨 통일이 필요해 이걸로 교체)
// 주의: {s} 서브도메인이 없고, 좌표 순서가 {z}/{y}/{x}로 다른 타일과 다름
const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
const TILE_ATTRIBUTION =
  "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012";

// 이 이하로는 축소되지 않게 막음 -> 어떤 화면 크기에서도 세계지도 타일이
// 항상 화면보다 크게 유지되어, 축소해도 빈 공간(회색 배경)이 안 보임.
const MIN_ZOOM = 2;

// 위경도 유효 범위를 살짝 넘는 선까지만 이동 허용 (남/북극 위아래로 드래그했을 때
// 회색 빈 공간이 보이는 것 방지). Mercator 투영 특성상 위도 ±85도 근처가 실질적 한계.
const WORLD_BOUNDS = latLngBounds([-85, -180], [85, 180]);

interface MapLeafletProps {
  pins: MapPin[];
  activePinId: string | null;
  onPinClick?: (pin: MapPin) => void;
  /** 부모(캐러셀)에서 지도를 직접 이동시키고 싶을 때 ref로 노출 */
  mapRef?: MutableRefObject<LeafletMapInstance | null>;
  height?: string | number;
  /** 최초 진입 시 중심 좌표 (GPS 있으면 그 값, 없으면 기본값) */
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
}

/** 빨강/회색 물방울 핀 아이콘을 SVG로 직접 생성 (외부 이미지 파일 불필요) */
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
    className: "", // 기본 Leaflet 마커 스타일(흰 사각 배경) 제거
    iconSize: [size, size],
    iconAnchor: [size / 2, size], // 핀 뾰족한 아래쪽 끝이 실제 좌표를 가리키게
  });
}

/** MapContainer 내부에서만 useMap()을 쓸 수 있어서 별도 자식 컴포넌트로 분리 */
function MapRefBinder({ mapRef }: { mapRef?: MutableRefObject<LeafletMapInstance | null> }) {
  const map = useMap();
  useEffect(() => {
    if (mapRef) mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

export function MapLeaflet({
  pins,
  activePinId,
  onPinClick,
  mapRef,
  height = "100%",
  initialCenter,
  initialZoom = 1.5,
}: MapLeafletProps) {
  const center = useMemo<[number, number]>(() => {
    if (initialCenter) return [initialCenter.lat, initialCenter.lng];
    const first = pins[0];
    return first ? [first.lat, first.lng] : [20, 0]; // fallback: 대략 세계 중앙
  }, [initialCenter, pins]);

  return (
    <MapContainer
      center={center}
      zoom={initialZoom}
      minZoom={MIN_ZOOM} // 이 이하로 축소 불가 -> 화면이 항상 지도로 꽉 참
      zoomSnap={0.5} // 줄 단위(1.0)가 아니라 0.5 단위로 부드럽게 확대/축소
      zoomDelta={0.5} // 버튼/더블클릭 줌 조작도 0.5 단위로 (zoomSnap과 맞춰줘야 함)
      wheelPxPerZoomLevel={100} // 마우스 휠 스크롤 시 줌 변화가 더 부드럽게 (기본 60 -> 100, 숫자 클수록 완만함)
      maxBounds={WORLD_BOUNDS}
      maxBoundsViscosity={1.0} // 경계에서 튕기듯 멈춤 (경계 밖으로 드래그 자체가 안 됨)
      worldCopyJump // 좌우로 계속 드래그해도 지도가 이어져서 빈 공간 없음
      style={{ width: "100%", height }}
      zoomControl={false} // UI 자체 버튼('지도 한눈에 보기' 등)으로 대체
    >
      <MapRefBinder mapRef={mapRef} />
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      {pins.map((pin) => (
        <Marker
          key={pin.id}
          position={[pin.lat, pin.lng]}
          icon={createPinIcon(pin.id === activePinId)}
          eventHandlers={{
            click: () => onPinClick?.(pin),
          }}
        />
      ))}
    </MapContainer>
  );
}
