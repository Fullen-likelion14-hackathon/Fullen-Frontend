// src/hooks/useGlobeCarouselSync.ts
//
// 캐러셀에서 카드가 바뀔 때(activeIndex 변경) 지구본 카메라를
// 해당 국가 좌표로 부드럽게 이동시키는 동기화 훅.
//
// 사용 예:
//   const globeRef = useRef<GlobeMethods | undefined>(undefined);
//   const { activeIndex, setActiveIndex } = useGlobeCarouselSync(globeRef, pins);
//   <Carousel onSlideChange={setActiveIndex} />
//   <MapGlobe globeRef={globeRef} pins={pins} activePinId={pins[activeIndex]?.id} />

import { useCallback, useState } from 'react';
import type { GlobeMethods } from 'react-globe.gl';
import type { CountryPin } from '../types/globe';
import { flyToPin } from '@/utils/globeCamera';

export function useGlobeCarouselSync(
  globeRef: React.MutableRefObject<GlobeMethods | undefined>,
  pins: CountryPin[],
  initialIndex = 0
) {
  const [activeIndex, setActiveIndexState] = useState(initialIndex);

  const setActiveIndex = useCallback(
    (index: number) => {
      setActiveIndexState(index);
      const target = pins[index];
      if (!target) return;

      // 캐러셀 스와이프에 맞춰 지구본도 같이 회전 + 살짝 확대
      flyToPin(
        globeRef,
        { lat: target.lat, lng: target.lng, altitude: 1.5 },
        700 // 캐러셀 슬라이드 애니메이션 시간과 맞춰서 튜닝하세요 (보통 300~800ms)
      );
    },
    [globeRef, pins]
  );

  return { activeIndex, setActiveIndex };
}