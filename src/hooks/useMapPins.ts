// src/hooks/useMapPins.ts
//
// 카테고리 원본 데이터(feeds 포함)를 받아서, 지도에 실제로 그릴 핀 목록으로
// 변환하는 훅. resolveMapPins가 좌표 없는(=피드 없는) 카테고리를 알아서
// 걸러주기 때문에, Map.tsx는 이 훅의 결과만 지도 컴포넌트에 넘기면 됩니다.
//
// 나중에 백엔드 연동 시(이번 라운드 범위 아님): mockCategories 자리를
// TanStack Query 결과로 교체하면 끝.

import { useMemo } from "react";
import { resolveMapPins } from "../utils/getCategoryMapPin";
import { sortPinsByProximity } from "../utils/sortPinsByProximity";
import { mockCategories } from "../mocks/categoryFeeds.mock";
import { getCountryFlagUrl } from "../mocks/countryFlags.mock";
import type { CategoryPin } from "../types/feed";
import type { MapPin } from "../types/mapPin";

export function useMapPins(categories: CategoryPin[] = mockCategories) {
  const pins: MapPin[] = useMemo(() => {
    const resolved = resolveMapPins(categories).map((pin) => ({
      id: pin.id,
      countryName: pin.countryName,
      travelTitle: pin.travelTitle,
      period: pin.period,
      thumbnailUrl: pin.thumbnailUrl,
      recordCount: pin.feeds.length,
      lat: pin.lat,
      lng: pin.lng,
      flagUrl: getCountryFlagUrl(pin.countryName),
    }));

    // 캐러셀에서 옆에 뜨는 카드가 실제로 가까운 곳이 되도록 거리 기반으로 재정렬
    return sortPinsByProximity(resolved);
  }, [categories]);

  return { pins };
}
