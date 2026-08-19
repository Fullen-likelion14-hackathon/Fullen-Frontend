import { useQuery } from "@tanstack/react-query";

import { getAIAnalysis } from "@/api/ai";

// AI 여행 분석 조회 Query Hook
export const useAIAnalysis = () => {
  return useQuery({
    // AI 여행 분석 전용 Query Key
    queryKey: ["ai", "analysis"],

    // AI 여행 분석 조회 함수
    queryFn: getAIAnalysis,

    // 공통 응답 객체에서 실제 분석 데이터 추출 처리
    select: (response) => response.data,
  });
};
