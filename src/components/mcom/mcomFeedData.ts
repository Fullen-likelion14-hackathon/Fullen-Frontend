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
    content:
      "브란덴부르크문 근처를 드라이브하다 우연히 들른 작은 카페. ☕🚗 여유로운 분위기와 따뜻한 커피 한 잔 덕분에 베를린의 하루가 더욱 특별해졌다. 여행은 역시 계획보다 우연히 얻은 소소한 행복이 더 기억에 남는 것 같다. 🇩🇪✨ 메고 갔던 가방이 카페랑 잘 어울려 기분이 좋았던 하루. 덕분에 오늘의 무드가 완성된 것 같다.",
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
    content:
      "도쿄 골목을 걷다가 우연히 발견한 작은 디저트 카페. 🍰☕ 조용한 분위기와 창가로 들어오는 햇살 덕분에 잠시 여행의 속도를 늦출 수 있었다. 계획 없이 들어간 곳이었는데 생각보다 너무 마음에 들어 오래 머물렀던 것 같다. 🇯🇵✨ 메고 갔던 가방도 카페 분위기랑 잘 어울려서 사진을 계속 찍게 됐던 하루. 이런 우연한 순간들이 여행에서 제일 기억에 남는 것 같다.",
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
    content:
      "파리의 골목을 천천히 걷다가 작은 테라스 카페에 자리를 잡았다. 🥐☕ 바쁘게 관광지만 돌아다니다 잠시 앉아 거리를 바라보니 그제야 정말 파리에 와 있다는 느낌이 들었다. 🇫🇷✨ 햇살도 좋고 오늘 메고 나온 가방도 거리 분위기와 잘 어울려 사진을 잔뜩 남겼다. 특별한 계획은 없었지만 그래서 더 기억에 남는 하루.",
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
    content:
      "주말의 베를린은 생각보다 훨씬 여유로웠다. 🚲🌿 아침에는 공원을 걷고 오후에는 골목에 있는 작은 편집숍들을 구경했다. 계획했던 곳보다 우연히 들어간 가게들이 더 마음에 들었던 하루. 🇩🇪✨ 가볍게 들고 나온 가방 덕분에 하루 종일 돌아다니기에도 편했고 베를린의 자유로운 분위기와도 잘 어울렸다.",
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
    content:
      "교토의 조용한 골목을 걷다 보니 시간이 조금 느리게 흐르는 것 같았다. 🍵🌿 오래된 목조 건물과 작은 상점들을 구경하며 목적지 없이 걷는 것만으로도 충분히 좋았다. 🇯🇵✨ 중간에 발견한 찻집에서 잠깐 쉬었는데 여행 중 가장 편안했던 순간으로 남았다. 오늘 코디와 가방도 교토의 차분한 분위기에 자연스럽게 어울려서 마음에 들었다.",
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
    content:
      "남프랑스의 여름은 어디를 봐도 그림 같았다. ☀️🌊 작은 마을을 지나 해안도로를 달리는데 창밖으로 보이는 풍경 때문에 몇 번이나 차를 세웠다. 🇫🇷✨ 예정에 없던 바닷가에 앉아 한참을 쉬었던 시간이 이번 여행에서 가장 기억에 남는다. 햇빛 아래에서 본 가방 색감도 예뻐서 괜히 사진을 더 많이 남겼던 하루.",
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
    content:
      "뮌헨에서의 마지막 날은 특별한 일정 없이 천천히 도시를 걸었다. 🥨☕ 광장을 지나 작은 카페에서 커피를 마시고 기념품 가게도 구경했다. 🇩🇪✨ 여행이 끝나간다는 게 아쉬웠지만 오히려 여유롭게 보낸 마지막 하루라 더 오래 기억에 남을 것 같다. 오늘 함께한 가방까지 사진으로 남기며 여행을 마무리했다.",
  },
];