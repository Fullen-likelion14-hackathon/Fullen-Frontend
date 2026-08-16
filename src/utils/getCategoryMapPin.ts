// src/utils/getCategoryMapPin.ts
//
// "카테고리 하나 = 지도 위 핀 하나"의 좌표를 결정하는 순수 함수.
// 지도가 3D 지구본이든, 실제 지도 타일(Leaflet)이든 이 함수의 결과(lat, lng)는
// 그대로 재사용됩니다.
//
// 결정 우선순위:
//   1. 피드가 하나도 없으면 -> null (핀을 아예 찍지 않음)
//   2. 가장 먼저(오래된 순) 등록된 피드부터 순서대로, GPS가 있는 첫 피드의 좌표 사용
//      (그 여행이 시작된 지점에 핀이 고정되도록 - "최근 피드 우선"으로 하면
//      사진이 추가될 때마다 핀 위치가 계속 바뀌는 문제가 있어 "첫 피드 우선"으로 확정)
//   3. 피드는 있지만 전부 GPS가 없으면 -> 국가 중심 좌표(centroid)로 대체
//      (사진에 위치 정보가 아예 없는 경우가 흔하기 때문에 대체값 필요)
//   4. 국가 중심 좌표 테이블에도 없는 나라면 -> null
//
// 참고: 여기서 다루는 GPS는 오직 지도 위 좌표(lat, lng) 계산용입니다.
// "어느 도시인지" 이름을 알아내거나 화면에 표시할 필요는 없습니다
// (여행제목은 사용자가 자유롭게 입력하는 텍스트일 뿐, 도시명과 무관함).

import type { CategoryPin } from "../types/feed";
import { countryCentroids } from "../mocks/countryCentroids.mock";

export interface MapPinCoordinate {
  lat: number;
  lng: number;
  /** 이 좌표가 사진 GPS에서 왔는지, 국가 중심 좌표 대체값인지 구분용 (디버깅/표시에 활용 가능) */
  source: "photo" | "country-fallback";
}

export function getCategoryMapPin(category: CategoryPin): MapPinCoordinate | null {
  // 1. 피드가 없으면 핀 자체를 찍지 않음
  if (!category.feeds || category.feeds.length === 0) {
    return null;
  }

  // 2. 오래된 순(등록 순서) 정렬 후, GPS 있는 첫 피드 사용
  const sortedByOldest = [...category.feeds].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );
  const firstWithGps = sortedByOldest.find(
    (feed) => feed.gps && typeof feed.gps.lat === "number" && typeof feed.gps.lng === "number",
  );
  if (firstWithGps?.gps) {
    return { lat: firstWithGps.gps.lat, lng: firstWithGps.gps.lng, source: "photo" };
  }

  // 3. 사진에 GPS가 하나도 없으면 국가 중심 좌표로 대체
  const centroid = countryCentroids[category.countryName];
  if (centroid) {
    return { ...centroid, source: "country-fallback" };
  }

  // 4. 대체할 국가 좌표조차 없으면 핀을 찍지 않음 (좌표 없이 억지로 찍지 않음)
  return null;
}

/**
 * CategoryPin 배열을 지도에 바로 그릴 수 있는 형태로 변환합니다.
 * - 좌표를 구할 수 없는 카테고리(피드 없음/좌표 정보 전무)는 결과에서 제외됩니다.
 */
export function resolveMapPins<T extends CategoryPin>(categories: T[]): (T & MapPinCoordinate)[] {
  return categories
    .map((category) => {
      const coord = getCategoryMapPin(category);
      if (!coord) return null;
      return { ...category, ...coord };
    })
    .filter((pin): pin is T & MapPinCoordinate => pin !== null);
}
