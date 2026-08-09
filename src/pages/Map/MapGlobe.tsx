// src/pages/Map/MapGlobe.tsx
//
// 설치 필요:
//   npm install react-globe.gl three
//
// globeImageUrl 은 디자인팀에서 equirectangular(가로:세로 2:1) 텍스처를 받으면
// 그 이미지 경로로 교체하면 끝. 지금은 임시 라이브러리 기본 텍스처를 씁니다.
//
// 이 파일은 컴포넌트(MapGlobe)만 export합니다.
// 카메라 이동 유틸(flyToPin)은 ../../utils/globeCamera 로 분리했습니다.
// (컴포넌트 파일에 일반 함수를 같이 export하면 Fast Refresh 경고가 발생함)

import { useRef, useEffect, useMemo, useCallback } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import type { CountryPin } from '../../types/globe';

// 임시 기본 텍스처 (디자인 나오면 이 경로만 교체)
// public 폴더에 있는 자체 텍스처를 쓰려면: '/assets/images/world-equirectangular.png'
const DEFAULT_GLOBE_TEXTURE =
  '//unpkg.com/three-globe/example/img/earth-blue-marble.jpg';

interface MapGlobeProps {
  pins: CountryPin[];
  activePinId: string | null;
  onPinClick?: (pin: CountryPin) => void;
  /** 부모(캐러셀)에서 지구본을 직접 회전시키고 싶을 때 ref로 노출 */
  globeRef?: React.MutableRefObject<GlobeMethods | undefined>;
  width?: number;
  height?: number;
  globeImageUrl?: string;
}

export function MapGlobe({
  pins,
  activePinId,
  onPinClick,
  globeRef: externalRef,
  width,
  height,
  globeImageUrl = DEFAULT_GLOBE_TEXTURE,
}: MapGlobeProps) {
  // useRef<T>()는 초기값 없이 호출하면 타입 에러(Expected 1 arguments, but got 0)가 남.
  // 명시적으로 undefined를 넘겨줘야 함.
  const internalRef = useRef<GlobeMethods | undefined>(undefined);
  const globeRef = externalRef ?? internalRef;

  // 핀 데이터를 react-globe.gl의 pointsData 포맷으로 변환
  const pointsData = useMemo(
    () =>
      pins.map((pin) => ({
        ...pin,
        isActive: pin.id === activePinId,
      })),
    [pins, activePinId]
  );

  // 최초 진입 시 GPS 기반(또는 activePinId 기반) 위치로 카메라 이동
  // 의도적으로 "최초 1회만" 실행 (pins/activePinId 변경 시 재실행되면 안 됨 -
  // 그건 useGlobeCarouselSync 훅이 담당함)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!globeRef.current) return;
    const target = pins.find((p) => p.id === activePinId) ?? pins[0];
    if (!target) return;

    globeRef.current.pointOfView(
      { lat: target.lat, lng: target.lng, altitude: 1.8 },
      0 // 최초 진입은 애니메이션 없이 바로 위치
    );
  }, []);

  const handlePointClick = useCallback(
    (point: object) => {
      const pin = point as CountryPin;
      onPinClick?.(pin);
    },
    [onPinClick]
  );

  return (
    <Globe
      ref={globeRef as React.MutableRefObject<GlobeMethods | undefined>}
      width={width}
      height={height}
      globeImageUrl={globeImageUrl}
      backgroundColor="rgba(0,0,0,0)"
      showAtmosphere
      atmosphereColor="#7fa7ff"
      atmosphereAltitude={0.15}
      pointsData={pointsData}
      pointLat="lat"
      pointLng="lng"
      pointColor={(d: object) => ((d as { isActive: boolean }).isActive ? '#e53935' : '#9e9e9e')}
      pointAltitude={0.01}
      pointRadius={(d: object) => ((d as { isActive: boolean }).isActive ? 0.6 : 0.4)}
      onPointClick={handlePointClick}
      pointLabel={(d: object) => (d as CountryPin).countryName}
    />
  );
}