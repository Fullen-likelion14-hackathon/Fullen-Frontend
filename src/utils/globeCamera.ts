// src/utils/globeCamera.ts
//
// MapGlobe.tsx에서 분리한 이유:
// MapGlobe.tsx가 컴포넌트 외에 함수(flyToPin)까지 export하면
// "Fast refresh only works when a file only exports components" 경고가 남.
// 컴포넌트 파일은 컴포넌트만 export하는 게 원칙이라 유틸 함수는 따로 뺌.

import type { GlobeMethods } from 'react-globe.gl';
import type { GlobePOV } from '../types/globe';

/** 특정 위경도로 카메라를 부드럽게 이동시키는 헬퍼 */
export function flyToPin(
  globeRef: React.MutableRefObject<GlobeMethods | undefined>,
  pov: GlobePOV,
  durationMs = 800
) {
  globeRef.current?.pointOfView(pov, durationMs);
}