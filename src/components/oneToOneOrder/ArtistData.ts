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

  // 작가 카드에 표시되는 짧은 설명
  description: string;

  // 작가 상세 모달
  detailImages: string[];
  detailSummary: string;
  detailDescription: string[];
};

/* AI 추천 작가 3명 */
export const recommendedArtists: Artist[] = [
  {
    id: 1,
    image: artistImage1,
    name: "빈센트 반 고흐",
    flagImage: franceFlag,

    description: "강렬한 색채와 두꺼운 붓질, 역동적인 곡선으로 감정과 움직임을 표현하는 화풍.",

    detailImages: [artistImage1, artistImage2, artistImage3],

    detailSummary: "강렬한 색채와 두꺼운 붓질, 역동적인 곡선으로 감정과 움직임을 표현하는 화풍.",

    detailDescription: [
      "빈센트 반 고흐는 강렬한 색채와 두꺼운 붓질을 활용해 자신의 감정과 인상을 표현하는 작품을 선보인 작가입니다.",

      "대상의 형태를 사실적으로 재현하기보다는 색과 선을 강조하고, 반복적이고 역동적인 붓질을 통해 화면에 움직임과 리듬감을 만들어냅니다.",

      "특히 노랑, 파랑과 같은 선명한 색채의 대비를 적극적으로 사용하여 작품에 강한 인상을 남기는 것이 특징입니다.",
    ],
  },

  {
    id: 2,
    image: artistImage2,
    name: "작가 2",
    flagImage: germanyFlag,

    description: "섬세한 색감과 부드러운 표현을 중심으로 작품을 구성하는 작가입니다.",

    detailImages: [artistImage2, artistImage3, artistImage1],

    detailSummary: "섬세한 색감과 부드러운 표현을 통해 차분하고 따뜻한 분위기를 만들어내는 화풍.",

    detailDescription: [
      "작가 2는 섬세한 색의 변화와 부드러운 형태 표현을 중심으로 작품을 구성합니다.",

      "강한 대비보다는 자연스럽게 연결되는 색채를 활용하여 안정적이고 편안한 분위기를 만들어냅니다.",

      "작품 속 세밀한 표현과 부드러운 화면 구성을 통해 일상적인 장면에서도 특별한 감정을 전달하는 것이 특징입니다.",
    ],
  },

  {
    id: 3,
    image: artistImage3,
    name: "작가 3",
    flagImage: japanFlag,

    description: "독특한 형태와 감각적인 색채를 활용해 개성 있는 작품을 표현하는 작가입니다.",

    detailImages: [artistImage3, artistImage1, artistImage2],

    detailSummary: "독특한 형태와 감각적인 색채 조합을 활용해 개성 있는 분위기를 표현하는 화풍.",

    detailDescription: [
      "작가 3은 형태를 자유롭게 변형하고 감각적인 색채를 조합하여 개성 있는 작품을 만들어냅니다.",

      "전통적인 표현 방식에 얽매이지 않고 다양한 구성과 시각적 요소를 활용해 새로운 분위기를 만들어내는 데 집중합니다.",

      "작품마다 다른 색감과 형태를 적극적으로 활용한다는 점이 주요 특징입니다.",
    ],
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

    detailImages: [artistImage1, artistImage3, artistImage2],

    detailSummary:
      "따뜻한 색채와 자연스러운 질감을 활용해 편안하고 안정적인 분위기를 표현하는 화풍.",

    detailDescription: [
      "작가 4는 따뜻하고 부드러운 색채를 중심으로 화면을 구성합니다.",

      "자연스러운 붓의 질감과 은은한 색의 변화를 활용해 편안하면서도 감성적인 분위기를 만들어냅니다.",

      "일상의 풍경과 자연에서 받은 인상을 차분하게 표현하는 것이 특징입니다.",
    ],
  },

  {
    id: 5,
    image: artistImage2,
    name: "작가 5",
    flagImage: japanFlag,

    description: "간결한 형태와 선을 중심으로 감각적인 작품을 제작하는 작가입니다.",

    detailImages: [artistImage2, artistImage1, artistImage3],

    detailSummary: "간결한 선과 절제된 형태를 활용해 세련되고 감각적인 화면을 구성하는 화풍.",

    detailDescription: [
      "작가 5는 복잡한 형태보다는 간결한 선과 구조를 중심으로 작품을 구성합니다.",

      "불필요한 요소를 최소화하고 형태와 색채의 균형을 통해 시각적으로 정돈된 이미지를 만들어냅니다.",

      "단순하지만 명확한 표현을 통해 작품의 핵심적인 분위기를 전달하는 것이 특징입니다.",
    ],
  },

  {
    id: 6,
    image: artistImage3,
    name: "작가 6",
    flagImage: franceFlag,

    description: "선명한 색채와 대담한 구성을 활용해 현대적인 분위기를 표현하는 작가입니다.",

    detailImages: [artistImage3, artistImage2, artistImage1],

    detailSummary:
      "선명한 색채와 대담한 화면 구성을 활용해 현대적이고 역동적인 분위기를 표현하는 화풍.",

    detailDescription: [
      "작가 6은 강렬하고 선명한 색채를 적극적으로 사용하여 시선을 끄는 작품을 제작합니다.",

      "화면을 과감하게 분할하거나 형태를 크게 배치하여 역동적인 구성을 만들어내는 것이 특징입니다.",

      "현대적인 색채 감각과 대담한 표현 방식을 결합해 강한 시각적 인상을 전달합니다.",
    ],
  },
];
