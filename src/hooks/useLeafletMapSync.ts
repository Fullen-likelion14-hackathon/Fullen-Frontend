// src/hooks/useLeafletMapSync.ts
// (기존 hooks/useGlobeCarouselSync.ts 대체 - 3D 카메라 대신 Leaflet 지도 이동)
//
// 캐러셀에서 카드가 바뀔 때(activeIndex 변경) 지도를 해당 핀 좌표로
// 부드럽게 이동시키는 동기화 훅.
//
// 사용 예:
//   const mapRef = useRef<LeafletMapInstance | null>(null);
//   const { activeIndex, setActiveIndex } = useLeafletMapSync(mapRef, pins);
//   <PinCardCarousel onSlideChange={setActiveIndex} />
//   <MapLeaflet mapRef={mapRef} pins={pins} activePinId={pins[activeIndex]?.id} />

import { useCallback, useState } from "react";
import type { Map as LeafletMapInstance } from "leaflet";
import type { MapPin } from "../types/mapPin";
import { flyToPin } from "../utils/mapCamera";

export function useLeafletMapSync(
  mapRef: React.MutableRefObject<LeafletMapInstance | null>,
  pins: MapPin[],
  initialIndex = 0,
) {
  const [activeIndex, setActiveIndexState] = useState(initialIndex);

  const setActiveIndex = useCallback(
    (index: number) => {
      setActiveIndexState(index);
      const target = pins[index];
      if (!target) return;

      // 캐러셀 스와이프에 맞춰 지도도 같이 이동 + 확대
      // zoom 8 정도 = "나라 안 큰 도시들 보이는 정도" (필요에 따라 튜닝)
      flyToPin(mapRef, target.lat, target.lng, 8, 0.7);
    },
    [mapRef, pins],
  );

  return { activeIndex, setActiveIndex };
}
