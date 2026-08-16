// src/mocks/countryCentroids.mock.ts
//
// 국가별 중심 좌표 테이블 (사진에 GPS 정보가 전혀 없을 때 fallback용).
// 지금은 실사용 국가 몇 개만 샘플로 넣어뒀습니다.
//
// 전체 국가(196개국) 채우는 방법 2가지:
//   1) npm 패키지 활용: `world-countries` (각 국가의 lat/lng 포함) 설치 후 매핑
//      npm install world-countries
//   2) 직접 필요한 국가만 그때그때 추가 (여행 서비스 특성상 실제로는
//      사용자가 등록한 국가만 존재하면 되므로 196개 다 채울 필요 없음)
//
// key는 카테고리 생성 시 사용자가 선택한 국가명과 정확히 일치해야 합니다.
// (CountryAutocomplete에서 쓰는 국가명 표기와 맞춰주세요)

export const countryCentroids: Record<string, { lat: number; lng: number }> = {
  독일: { lat: 51.1657, lng: 10.4515 },
  포르투갈: { lat: 39.3999, lng: -8.2245 },
  폴란드: { lat: 51.9194, lng: 19.1451 },
  프랑스: { lat: 46.2276, lng: 2.2137 },
  이탈리아: { lat: 41.8719, lng: 12.5674 },
  스페인: { lat: 40.4637, lng: -3.7492 },
  일본: { lat: 36.2048, lng: 138.2529 },
  대한민국: { lat: 36.5, lng: 127.75 },
  // TODO: 실제 서비스에 등록 가능한 국가 목록에 맞춰 추가
};
