// src/utils/sortPinsByProximity.ts
//
// 지도 핀 배열을 "가까운 핀끼리 이웃하도록" 재정렬합니다.
// 배열의 첫 번째 핀을 시작점으로, 그 다음은 남은 핀 중 가장 가까운 것,
// 그 다음은 또 남은 것 중 가장 가까운 것... 순으로 이어붙이는 방식(nearest-neighbor path).
// 이렇게 하면 캐러셀에서 어떤 카드가 가운데 와도 배열상 바로 옆 카드가
// 실제로도 지리적으로 가까운 핀이 됩니다.
//
// 주의: 전체를 한 번만 이 순서로 고정하는 방식입니다. "지금 활성화된 핀 기준으로
// 매번 다시 계산"하는 방식이 아니라서, 100% 모든 상황에서 "가장 가까운 두 곳이
// 정확히 양옆"이라고 보장하진 않지만, 캐러셀 순서가 튀지 않고 안정적입니다.

import type { MapPin } from "../types/mapPin";

function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLng = ((b.lng - a.lng) * Math.PI) / 180;
  const lat1 = (a.lat * Math.PI) / 180;
  const lat2 = (b.lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function sortPinsByProximity(pins: MapPin[]): MapPin[] {
  if (pins.length <= 2) return pins;

  const remaining = [...pins];
  const ordered: MapPin[] = [remaining.shift()!]; // 시작점: 원래 배열의 첫 핀

  while (remaining.length > 0) {
    const current = ordered[ordered.length - 1];
    let nearestIndex = 0;
    let nearestDist = Infinity;

    remaining.forEach((pin, i) => {
      const dist = haversineKm(current, pin);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIndex = i;
      }
    });

    ordered.push(remaining.splice(nearestIndex, 1)[0]);
  }

  return ordered;
}
