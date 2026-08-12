import germanyFeed1 from "@/assets/images/germany_feed1.jpg";
import germanyFeed2 from "@/assets/images/germany_feed2.jpg";
import japanFeed1 from "@/assets/images/japan_feed1.jpg";
import japanFeed2 from "@/assets/images/japan_feed2.png";

export interface FeedDetailData {
  feedId: number;
  categoryId: number;
  date: string;
  isPublic: boolean;
  images: string[];
  content: string;
}

const GERMANY_IMAGES = [germanyFeed1, germanyFeed2];
const JAPAN_IMAGES = [japanFeed1, japanFeed2];

const randomImages = (count: number, pool: string[]) =>
  Array.from({ length: count }, () => pool[Math.floor(Math.random() * pool.length)]);

// 카테고리 1 (독일 · 여름맞이 가족여행) - 개별 작성
const category1Feeds: FeedDetailData[] = [
  {
    feedId: 1,
    categoryId: 1,
    date: "2026.08.04",
    isPublic: true,
    images: randomImages(3, GERMANY_IMAGES),
    content:
      "브란덴부르크문 근처를 드라이브하다\n우연히 들른 작은 카페. ☕🚗\n여유로운 분위기와 따뜻한 커피 한 잔 덕분에\n베를린의 하루가 더욱 특별해졌다.\n여행은 역시 계획보다 우연이 얻은 소소한 행복이\n더 기억에 남는 것 같다. 🇩🇪✨\n메고갔던 가방이 카페랑 잘어울려\n기분이 좋았던 하루~\n덕분에 오늘의 무드가 완성된 것 같다.",
  },
  {
    feedId: 2,
    categoryId: 1,
    date: "2026.08.03",
    isPublic: true,
    images: randomImages(2, GERMANY_IMAGES),
    content:
      "노이슈반슈타인 성으로 가는 길.\n산길을 따라 올라가다 보니\n동화 속 한 장면 같은 풍경이 펼쳐졌다.\n가족들과 함께라 더 특별했던 하루.",
  },
  {
    feedId: 3,
    categoryId: 1,
    date: "2026.08.02",
    isPublic: false,
    images: randomImages(1, GERMANY_IMAGES),
    content:
      "뮌헨 시내를 걷다가 발견한 작은 빵집.\n프레첼 냄새에 이끌려 들어갔는데\n생각보다 훨씬 맛있어서 두 개 더 샀다.",
  },
  {
    feedId: 4,
    categoryId: 1,
    date: "2026.08.01",
    isPublic: true,
    images: randomImages(4, GERMANY_IMAGES),
    content:
      "여행 셋째 날, 마리엔 광장에서\n글로켄슈필 공연을 보며 하루를 시작했다.\n사람은 많았지만 그만큼 볼거리도 많았던 아침.",
  },
  {
    feedId: 5,
    categoryId: 1,
    date: "2026.07.31",
    isPublic: false,
    images: randomImages(2, GERMANY_IMAGES),
    content:
      "독일 도착 첫날.\n긴 비행 끝에 도착해서 피곤했지만\n숙소 근처 산책만으로도 기분이 좋아졌다.",
  },
  {
    feedId: 6,
    categoryId: 1,
    date: "2026.08.05",
    isPublic: true,
    images: randomImages(1, GERMANY_IMAGES),
    content:
      "여행 마지막 날 저녁,\n다 같이 모여 그동안 찍은 사진을 정리했다.\n짧았지만 오래 기억에 남을 여름이었다.",
  },
];

// 카테고리별 캡션 풀 - 반복 순환하며 사용 (개발용 목업이라 내용 반복 허용)
const generateFeeds = (
  categoryId: number,
  feedIdStart: number,
  count: number,
  dateStart: string,
  captionPool: string[],
  imagePool: string[],
): FeedDetailData[] =>
  Array.from({ length: count }, (_, i) => {
    const date = new Date(dateStart);
    date.setDate(date.getDate() + i);

    return {
      feedId: feedIdStart + i,
      categoryId,
      date: date.toISOString().slice(0, 10).replace(/-/g, "."),
      isPublic: i % 3 !== 0,
      images: randomImages((i % 3) + 1, imagePool),
      content: captionPool[i % captionPool.length],
    };
  });

// 카테고리 2 (일본 · 벚꽃 보러 떠난 봄여행)
const category2Feeds = generateFeeds(
  2,
  7,
  8,
  "2026-03-25",
  [
    "우에노 공원 가득 핀 벚꽃 아래에서\n돗자리 깔고 즐긴 하나미.\n봄바람에 꽃잎이 흩날려서 더 예뻤다.",
    "교토 골목길을 거닐다\n작은 찻집에서 말차 한 잔.\n조용하고 평화로운 오후였다.",
    "료칸에서 맞은 첫 아침.\n온천물에 몸을 담그니\n여행의 피로가 싹 풀리는 기분.",
  ],
  JAPAN_IMAGES,
);

// 카테고리 3 (독일 · 겨울 크리스마스 마켓)
const category3Feeds = generateFeeds(
  3,
  15,
  3,
  "2026-12-05",
  [
    "크리스마스 마켓의 불빛과 향신료 냄새.\n따뜻한 글뤼바인 한 잔이면\n추위도 잊게 된다.",
    "눈 내리는 광장에서 산 작은 오너먼트.\n트리에 달아두면 매년 이 여행이\n생각날 것 같다.",
  ],
  GERMANY_IMAGES,
);

// 카테고리 4 (일본 · 온천 힐링 여행)
const category4Feeds = generateFeeds(
  4,
  18,
  6,
  "2026-01-10",
  [
    "노천탕에 몸을 담그고 바라본 설경.\n아무 생각 없이 멍하니 있었던\n그 순간이 제일 좋았다.",
    "가이세키 요리로 채운 저녁상.\n계절마다 바뀐다는 구성이\n하나하나 다 인상적이었다.",
  ],
  JAPAN_IMAGES,
);

// 카테고리 5 (독일 · 혼자 떠난 배낭여행)
const category5Feeds = generateFeeds(
  5,
  24,
  12,
  "2026-09-01",
  [
    "혼자 걷는 여행길, 낯설지만\n그만큼 온전히 나만의 속도로\n움직일 수 있어서 좋았다.",
    "게스트하우스에서 만난 여행자들과\n밤늦도록 나눈 이야기.\n예상 못한 인연이 여행을 더 풍성하게 했다.",
    "기차 창밖으로 스쳐가는 풍경을 보며\n아무 계획 없이 다음 도시를 정했다.\n이런 자유가 배낭여행의 매력.",
  ],
  GERMANY_IMAGES,
);

export const feedDetailMockData: FeedDetailData[] = [
  ...category1Feeds,
  ...category2Feeds,
  ...category3Feeds,
  ...category4Feeds,
  ...category5Feeds,
];