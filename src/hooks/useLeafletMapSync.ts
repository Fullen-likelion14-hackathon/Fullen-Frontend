// src/hooks/useLeafletMapSync.ts
//
// nearby.centerJourney 좌표가 바뀔 때마다 지도를 그 위치로 flyTo.
// (기존 activeIndex 기반 동기화는 폐기 — pins 전체 배열을 더 이상 안 쓰기 때문)

import { useEffect } from "react";
import type { Map as LeafletMapInstance } from "leaflet";
import { flyToPin } from "../utils/mapCamera";

interface Center {
  lat: number;
  lng: number;
}

export function useLeafletMapSync(
  mapRef: React.MutableRefObject<LeafletMapInstance | null>,
  center: Center | null,
) {
  useEffect(() => {
    if (!center) return;
    // zoom 8 = "나라 안 큰 도시들 보이는 정도" (기존과 동일한 값 유지)
    flyToPin(mapRef, center.lat, center.lng, 8, 0.7);
  }, [mapRef, center?.lat, center?.lng]);
}