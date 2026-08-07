import testImage1 from "@/assets/images/McoMTest.png";
import testImage2 from "@/assets/images/McoMTest2.png";

import germanyFlag from "@/assets/images/flags/germany.png";
import japanFlag from "@/assets/images/flags/japan.png";
import franceFlag from "@/assets/images/flags/france.png";

import type { MCoMFeed } from "@/components/mcom/mcom";

export const mcomFeedMockData: MCoMFeed[] = [
  {
    feedId: 1,
    countryName: "독일",
    countryCode: "DE",
    flagImage: germanyFlag,
    title: "여름맞이 가족여행",
    date: "2026.07.31",
    thumbnail: testImage1,
    imageCount: 8,
    textCount: 356,
  },
  {
    feedId: 2,
    countryName: "일본",
    countryCode: "JP",
    flagImage: japanFlag,
    title: "도쿄에서 만난 순간들",
    date: "2026.07.28",
    thumbnail: testImage2,
    imageCount: 6,
    textCount: 248,
  },
  {
    feedId: 3,
    countryName: "프랑스",
    countryCode: "FR",
    flagImage: franceFlag,
    title: "파리에서의 하루",
    date: "2026.07.20",
    thumbnail: testImage1,
    imageCount: 10,
    textCount: 421,
  },
  {
    feedId: 4,
    countryName: "독일",
    countryCode: "DE",
    flagImage: germanyFlag,
    title: "베를린에서 보낸 주말",
    date: "2026.07.16",
    thumbnail: testImage2,
    imageCount: 5,
    textCount: 287,
  },
  {
    feedId: 5,
    countryName: "일본",
    countryCode: "JP",
    flagImage: japanFlag,
    title: "교토 골목 여행",
    date: "2026.07.10",
    thumbnail: testImage1,
    imageCount: 7,
    textCount: 312,
  },
  {
    feedId: 6,
    countryName: "프랑스",
    countryCode: "FR",
    flagImage: franceFlag,
    title: "남프랑스에서의 여름",
    date: "2026.07.05",
    thumbnail: testImage2,
    imageCount: 9,
    textCount: 398,
  },
  {
    feedId: 7,
    countryName: "독일",
    countryCode: "DE",
    flagImage: germanyFlag,
    title: "뮌헨에서 남긴 기록",
    date: "2026.06.29",
    thumbnail: testImage1,
    imageCount: 4,
    textCount: 196,
  },
];
