import type { TravelCategory } from "./Passport";

import germanyImage from "@/assets/images/MainGermany.png"; // TODO: 실제 파일명으로 교체
import japanImage from "@/assets/images/MainJapan.png"; // TODO: 실제 파일명으로 교체

// 개발 중 레이아웃 확인용 더미데이터
// 커밋 전 Passport.tsx에서 이 import를 빈 배열로 되돌릴 것
export const mockCategories: TravelCategory[] = [
  { id: "1", countryName: "GERMANY", imageUrl: germanyImage },
  { id: "2", countryName: "JAPAN", imageUrl: japanImage },
  { id: "3", countryName: "GERMANY", imageUrl: germanyImage },
  { id: "4", countryName: "JAPAN", imageUrl: japanImage },
  { id: "5", countryName: "GERMANY", imageUrl: germanyImage }, // 홀수 개수 레이아웃 확인용
];
