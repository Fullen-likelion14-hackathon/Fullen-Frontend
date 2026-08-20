// src/utils/mapCamera.ts
// (기존 utils/globeCamera.ts 대체 - 3D 카메라 대신 Leaflet 지도 이동)
//
// 컴포넌트 파일(MapLeaflet.tsx)과 분리한 이유는 이전과 동일:
// 컴포넌트 파일에 일반 함수를 같이 export하면 Vite Fast Refresh 경고가 남.

import type { Map as LeafletMapInstance } from "leaflet";

/** 특정 위경도로 지도를 부드럽게 이동/확대시키는 헬퍼 */
export function flyToPin(
  mapRef: React.MutableRefObject<LeafletMapInstance | null>,
  lat: number,
  lng: number,
  zoom = 8,
  durationSec = 0.8,
) {
  mapRef.current?.flyTo([lat, lng], zoom, { duration: durationSec });
}
