import type { TravelCategory } from "./Passport";
import { getCountryFlagUrl } from "@/mocks/countryFlags.mock";

import germanyImage from "@/assets/images/MainGermany.png";
import japanImage from "@/assets/images/MainJapan.png";

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
    createdAt: "2026-08-01T00:00:00.000Z",
    flagUrl: getCountryFlagUrl("GERMANY"),
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
    createdAt: "2026-03-31T00:00:00.000Z",
    flagUrl: getCountryFlagUrl("JAPAN"),
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
    createdAt: "2026-12-11T00:00:00.000Z",
    flagUrl: getCountryFlagUrl("GERMANY"),
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
    createdAt: "2026-01-15T00:00:00.000Z",
    flagUrl: getCountryFlagUrl("JAPAN"),
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
    createdAt: "2026-09-16T00:00:00.000Z",
    flagUrl: getCountryFlagUrl("GERMANY"),
  },
];
