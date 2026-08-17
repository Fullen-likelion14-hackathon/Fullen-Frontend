export interface AIPatchAnalysis {
  // 사용자 여행 스타일 이름임
  travelStyle: string;

  // 여행 스타일에 대한 한 줄 설명임
  description: string;

  // 사용자의 여행 기록을 분석한 상세 결과임
  analysis: string[];

  // 분석 결과를 나타내는 키워드 목록임
  keywords: string[];

  // 분석 결과를 기반으로 보여주는 추천 안내 문구임
  recommendation: string;
}

export const aiPatchAnalysisMock: AIPatchAnalysis = {
  travelStyle: "Urban Minimalist",

  description: "도시의 감각과 건축, 미니멀한 무드를 좋아하는 당신을 분석했습니다",

  analysis: [
    "유명 관광지보다 도시 곳곳을 천천히 탐색하며,",
    "일상적인 순간을 기록하는 여행을 즐겨요.",
    "MCM과 함께 도시를 자유롭게 탐험하는 여행자시군요.",
  ],

  keywords: ["도시", "건축", "야경", "모던", "심플"],

  recommendation: "분석을 바탕으로 3인의 아티스트 추천 및 맞춤형 트래블 패치를 제작해드리겠습니다",
};
