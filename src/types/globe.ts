// src/types/globe.ts
// 지도(지구본) 관련 타입 정의

/** 카테고리(국가) 하나 = 캐러셀 카드 하나에 대응 */
export interface CountryPin {
  id: string;           // 카테고리 id (백엔드 categoryId)
  countryName: string;  // "독일"
  travelTitle: string;  // "여름맞이 가족여행"
  period: string;       // "2026.07.31 ~ 2026.08.07"
  thumbnailUrl: string; // 카드 대표 사진
  recordCount: number;  // 기록 개수
  lat: number;           // 실제 위도 (국가 대표 좌표)
  lng: number;           // 실제 경도
  flagUrl?: string;      // 국기 이미지 (선택)
}

/** 지구본 카메라 위치 (react-globe.gl의 pointOfView 포맷과 동일) */
export interface GlobePOV {
  lat: number;
  lng: number;
  altitude: number; // 카메라 거리 (줌 정도). 값이 작을수록 확대됨. 보통 0.5~2.5 사이 사용
}