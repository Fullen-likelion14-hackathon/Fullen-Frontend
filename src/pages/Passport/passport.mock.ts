import type { TravelCategory } from "./Passport";

import germanyImage from "@/assets/images/MainGermany.png"; // TODO: 실제 파일명으로 교체
import japanImage from "@/assets/images/MainJapan.png"; // TODO: 실제 파일명으로 교체

// 개발 중 레이아웃 확인용 더미데이터
// 커밋 전 Passport.tsx에서 이 import를 빈 배열로 되돌릴 것
export const mockCategories: TravelCategory[] = [
  {
    id: "1",
    countryName: "GERMANY",
    imageUrl: germanyImage,
    continent: "유럽",
    travelTitle: "여름맞이 가족여행",
    startDate: "2026-07-31",
    endDate: "2026-08-07",
    feedCount: 5,
  },
  {
    id: "2",
    countryName: "JAPAN",
    imageUrl: japanImage,
    continent: "아시아",
    travelTitle: "벚꽃 보러 떠난 봄여행",
    startDate: "2026-03-25",
    endDate: "2026-03-30",
    feedCount: 8,
  },
  {
    id: "3",
    countryName: "GERMANY",
    imageUrl: germanyImage,
    continent: "유럽",
    travelTitle: "겨울 크리스마스 마켓",
    startDate: "2026-12-05",
    endDate: "2026-12-10",
    feedCount: 3,
  },
  {
    id: "4",
    countryName: "JAPAN",
    imageUrl: japanImage,
    continent: "아시아",
    travelTitle: "온천 힐링 여행",
    startDate: "2026-01-10",
    endDate: "2026-01-14",
    feedCount: 6,
  },
  {
    id: "5", // 홀수 개수 레이아웃 확인용
    countryName: "GERMANY",
    imageUrl: germanyImage,
    continent: "유럽",
    travelTitle: "혼자 떠난 배낭여행",
    startDate: "2026-09-01",
    endDate: "2026-09-15",
    feedCount: 12,
  },
];