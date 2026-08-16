import artistImage1 from "@/assets/images/artist1.png";
import artistImage2 from "@/assets/images/artist1.png";
import artistImage3 from "@/assets/images/artist1.png";

import franceFlag from "@/assets/images/flags/france.png";
import germanyFlag from "@/assets/images/flags/germany.png";
import japanFlag from "@/assets/images/flags/japan.png";

export type Artist = {
  id: number;
  image: string;
  name: string;
  flagImage: string;
  description: string;
};

/* AI 추천 작가 3명 */
export const recommendedArtists: Artist[] = [
  {
    id: 1,
    image: artistImage1,
    name: "빈센트 반 고흐",
    flagImage: franceFlag,
    description: "강렬한 색채와 두꺼운 붓질, 역동적인 곡선으로 감정과 움직임을 표현하는 화풍.",
  },
  {
    id: 2,
    image: artistImage2,
    name: "작가 2",
    flagImage: germanyFlag,
    description: "섬세한 색감과 부드러운 표현을 중심으로 작품을 구성하는 작가입니다.",
  },
  {
    id: 3,
    image: artistImage3,
    name: "작가 3",
    flagImage: japanFlag,
    description: "독특한 형태와 감각적인 색채를 활용해 개성 있는 작품을 표현하는 작가입니다.",
  },
];

/* 다른 작가 더보기 */
export const otherArtists: Artist[] = [
  {
    id: 4,
    image: artistImage1,
    name: "작가 4",
    flagImage: germanyFlag,
    description: "따뜻한 색감과 자연스러운 질감을 활용해 편안한 분위기를 표현하는 작가입니다.",
  },
  {
    id: 5,
    image: artistImage2,
    name: "작가 5",
    flagImage: japanFlag,
    description: "간결한 형태와 선을 중심으로 감각적인 작품을 제작하는 작가입니다.",
  },
  {
    id: 6,
    image: artistImage3,
    name: "작가 6",
    flagImage: franceFlag,
    description: "선명한 색채와 대담한 구성을 활용해 현대적인 분위기를 표현하는 작가입니다.",
  },
];
