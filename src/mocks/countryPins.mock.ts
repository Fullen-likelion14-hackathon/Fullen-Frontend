// src/mocks/countryPins.mock.ts
// 실제 API 붙기 전까지 사용할 mock 데이터
// 백엔드 붙일 때는 이 배열을 TanStack Query 응답으로 교체하면 됨

import type { CountryPin } from '../types/globe';

export const mockCountryPins: CountryPin[] = [
  {
    id: 'de',
    countryName: '독일',
    travelTitle: '여름맞이 가족여행',
    period: '2026.07.31 ~ 2026.08.07',
    thumbnailUrl: 'https://picsum.photos/seed/de/400/500',
    recordCount: 5,
    lat: 51.1657,
    lng: 10.4515,
  },
  {
    id: 'pt',
    countryName: '리스본',
    travelTitle: '대학 동기들과 첫 여행',
    period: '2026.07.31 ~ 2026.08.07',
    thumbnailUrl: 'https://picsum.photos/seed/pt/400/500',
    recordCount: 5,
    lat: 38.7223,
    lng: -9.1393,
  },
  {
    id: 'pl',
    countryName: '폴란드',
    travelTitle: '엄마와의 여행',
    period: '2026.05.01 ~ 2026.05.07',
    thumbnailUrl: 'https://picsum.photos/seed/pl/400/500',
    recordCount: 3,
    lat: 51.9194,
    lng: 19.1451,
  },
];

// 가장 최근 여행 = 배열의 첫 번째로 가정 (실제로는 정렬된 최신순 데이터를 쓰면 됨)
export const latestPinId = mockCountryPins[0].id;