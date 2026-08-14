// src/mocks/categoryFeeds.mock.ts
//
// passport.mock.ts / categoryFeed.mock.ts와 동일한 5개 카테고리(id, 여행제목,
// 기간, 썸네일, feedCount 전부 실제 값 그대로).
//
// 핀 좌표는 "카테고리의 첫 번째(가장 먼저 등록된) 피드 사진의 GPS"로 결정됩니다
// (getCategoryMapPin.ts 참고). 도시명 같은 별도 텍스트 필드는 필요 없고,
// 순전히 GPS 좌표값만 지도 표시에 쓰입니다. 여행제목은 사용자가 자유롭게
// 입력하는 텍스트라서 위치 정보와 무관하며, 여기서는 실제 mock 값을 그대로 씁니다.
//
// 실제 앱에는 아직 피드별 GPS 데이터가 없어서(사진 업로드 시 위치 추출 기능
// 미구현), 이 mock에서는 카테고리별 첫 피드에 임시로 도시 GPS를 하드코딩해서
// 넣어뒀습니다. 실제 GPS 저장 기능이 붙으면 이 하드코딩은 제거하고
// extractPhotoGps.ts가 뽑은 실제 값을 쓰게 됩니다.

import type { CategoryPin, Feed } from "../types/feed";
import germanyImage from "@/assets/images/MainGermany.png";
import japanImage from "@/assets/images/MainJapan.png";
import germanyFeed1 from "@/assets/images/germany_feed1.jpg";
import germanyFeed2 from "@/assets/images/germany_feed2.jpg";
import japanFeed1 from "@/assets/images/japan_feed1.jpg";
import japanFeed2 from "@/assets/images/japan_feed2.png";

function addDays(iso: string, days: number): string {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString();
}

// count만큼 더미 feed를 채우되, 첫 번째(index 0) feed에만 GPS를 부여.
// createdAt도 첫 feed가 가장 이른 날짜가 되도록 함
// (getCategoryMapPin이 등록순 정렬 후 GPS 있는 첫 feed를 쓰기 때문).
function buildDummyFeeds(
  categoryId: string,
  count: number,
  images: [string, string],
  startDate: string,
  firstFeedGps: { lat: number; lng: number },
): Feed[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `${categoryId}-feed-${i + 1}`,
    photoUrl: images[i % 2],
    createdAt: addDays(startDate, i),
    gps: i === 0 ? firstFeedGps : null,
  }));
}

export const mockCategories: CategoryPin[] = [
  {
    id: "1",
    countryName: "독일",
    travelTitle: "여름맞이 가족여행",
    period: "2026.07.31 ~ 2026.08.07",
    thumbnailUrl: germanyImage,
    feeds: buildDummyFeeds(
      "1",
      5,
      [germanyFeed1, germanyFeed2],
      "2026-07-31T09:00:00Z",
      { lat: 52.52, lng: 13.405 }, // 베를린 (임시 하드코딩 GPS)
    ),
  },
  {
    id: "2",
    countryName: "일본",
    travelTitle: "벚꽃 보러 떠난 봄여행",
    period: "2026.03.25 ~ 2026.03.30",
    thumbnailUrl: japanImage,
    feeds: buildDummyFeeds(
      "2",
      8,
      [japanFeed1, japanFeed2],
      "2026-03-25T09:00:00Z",
      { lat: 35.6762, lng: 139.6503 }, // 도쿄 (임시 하드코딩 GPS)
    ),
  },
  {
    id: "3",
    countryName: "독일",
    travelTitle: "겨울 크리스마스 마켓",
    period: "2026.12.05 ~ 2026.12.10",
    thumbnailUrl: germanyImage,
    feeds: buildDummyFeeds(
      "3",
      3,
      [germanyFeed1, germanyFeed2],
      "2026-12-05T09:00:00Z",
      { lat: 48.1351, lng: 11.582 }, // 뮌헨 (임시 하드코딩 GPS)
    ),
  },
  {
    id: "4",
    countryName: "일본",
    travelTitle: "온천 힐링 여행",
    period: "2026.01.10 ~ 2026.01.14",
    thumbnailUrl: japanImage,
    feeds: buildDummyFeeds(
      "4",
      6,
      [japanFeed1, japanFeed2],
      "2026-01-10T09:00:00Z",
      { lat: 34.6937, lng: 135.5023 }, // 오사카 (임시 하드코딩 GPS)
    ),
  },
  {
    id: "5",
    countryName: "독일",
    travelTitle: "혼자 떠난 배낭여행",
    period: "2026.09.01 ~ 2026.09.15",
    thumbnailUrl: germanyImage,
    feeds: buildDummyFeeds(
      "5",
      12,
      [germanyFeed1, germanyFeed2],
      "2026-09-01T09:00:00Z",
      { lat: 53.5511, lng: 9.9937 }, // 함부르크 (임시 하드코딩 GPS)
    ),
  },
];
