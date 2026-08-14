// src/types/feed.ts
//
// 카테고리(=지도의 핀 하나)와 그 안의 피드(사진 게시물) 타입.
// 지도 핀 좌표를 "카테고리 자체"가 아니라 "카테고리 안 최근 피드의 사진 위치"에서
// 뽑아 쓰기 위해, 카테고리가 feeds 배열을 갖는 구조로 정의합니다.

export interface Feed {
  id: string;
  photoUrl: string;
  createdAt: string; // ISO 날짜 문자열. "가장 최근 피드" 판별 기준
  /**
   * 업로드 시점에 사진 EXIF에서 추출한 GPS 좌표.
   * - 사진에 위치 정보가 없거나(카톡 전송, 스크린샷 등) 추출 실패 시 null/undefined
   * - 이 값은 프론트에서 매번 다시 뽑는 게 아니라, 업로드 시 1회 추출해서
   *   백엔드에 저장해두고 그대로 내려받는 걸 권장 (extractPhotoGps.ts 참고)
   */
  gps?: { lat: number; lng: number } | null;
}

export interface CategoryPin {
  id: string;
  countryName: string;
  travelTitle: string;
  period: string;
  thumbnailUrl: string;
  feeds: Feed[]; // 피드가 하나도 없으면(length === 0) 지도에 핀을 찍지 않음
}
