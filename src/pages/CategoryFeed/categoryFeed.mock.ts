import germanyFeed1 from "@/assets/images/germany_feed1.jpg";
import germanyFeed2 from "@/assets/images/germany_feed2.jpg";
import japanFeed1 from "@/assets/images/japan_feed1.jpg";
import japanFeed2 from "@/assets/images/japan_feed2.png";

export interface FeedThumbnail {
  feedId: number;
  thumbnail: string;
}

export interface CategoryFeedData {
  categoryId: number;
  countryName: string;
  title: string;
  startDate: string;
  endDate: string;
  flagImage: string;
  feeds: FeedThumbnail[];
}

const GERMANY_FLAG = "https://placehold.co/45x30?text=DE";
const JAPAN_FLAG = "https://placehold.co/45x30?text=JP";

const GERMANY_IMAGES = [germanyFeed1, germanyFeed2];
const JAPAN_IMAGES = [japanFeed1, japanFeed2];

const randomFrom = (images: string[]) => images[Math.floor(Math.random() * images.length)];

// passport.mock.ts의 mockCategories와 id/countryName/title/date를 동일하게 맞춤
const baseCategories = [
  {
    categoryId: 1,
    countryName: "독일",
    title: "여름맞이 가족여행",
    startDate: "2026.07.31",
    endDate: "2026.08.07",
    flagImage: GERMANY_FLAG,
    images: GERMANY_IMAGES,
    feedCount: 6,
    feedIdStart: 1,
  },
  {
    categoryId: 2,
    countryName: "일본",
    title: "벚꽃 보러 떠난 봄여행",
    startDate: "2026.03.25",
    endDate: "2026.03.30",
    flagImage: JAPAN_FLAG,
    images: JAPAN_IMAGES,
    feedCount: 8,
    feedIdStart: 7,
  },
  {
    categoryId: 3,
    countryName: "독일",
    title: "겨울 크리스마스 마켓",
    startDate: "2026.12.05",
    endDate: "2026.12.10",
    flagImage: GERMANY_FLAG,
    images: GERMANY_IMAGES,
    feedCount: 3,
    feedIdStart: 15,
  },
  {
    categoryId: 4,
    countryName: "일본",
    title: "온천 힐링 여행",
    startDate: "2026.01.10",
    endDate: "2026.01.14",
    flagImage: JAPAN_FLAG,
    images: JAPAN_IMAGES,
    feedCount: 6,
    feedIdStart: 18,
  },
  {
    categoryId: 5,
    countryName: "독일",
    title: "혼자 떠난 배낭여행",
    startDate: "2026.09.01",
    endDate: "2026.09.15",
    flagImage: GERMANY_FLAG,
    images: GERMANY_IMAGES,
    feedCount: 12,
    feedIdStart: 24,
  },
];

export const categoryFeedMockData: CategoryFeedData[] = baseCategories.map((category) => ({
  categoryId: category.categoryId,
  countryName: category.countryName,
  title: category.title,
  startDate: category.startDate,
  endDate: category.endDate,
  flagImage: category.flagImage,
  feeds: Array.from({ length: category.feedCount }, (_, i) => ({
    feedId: category.feedIdStart + i,
    thumbnail: randomFrom(category.images),
  })),
}));