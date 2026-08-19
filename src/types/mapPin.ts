// src/types/mapPin.ts

/** 지도 위에 찍히는 마커 하나 (좌표만) */
export interface MapPin {
  journeyId: number;
  latitude: number;
  longitude: number;
}