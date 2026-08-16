// src/types/mapPin.ts

/** 지도 위에 찍히는 핀 하나 = useMapPins 훅의 최종 결과물 */
export interface MapPin {
  id: string;
  countryName: string;
  travelTitle: string;
  period: string;
  thumbnailUrl: string;
  recordCount: number;
  lat: number;
  lng: number;
  /** 국기 원형 배지에 쓸 이미지. 없으면 배지 자리는 비워둠 */
  flagUrl?: string;
}
