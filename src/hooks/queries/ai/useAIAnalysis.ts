import { useMutation, useQuery } from "@tanstack/react-query";

import { getAIAnalysis, retryAIAnalysis } from "@/api/ai";

import type { RetryAIAnalysisRequest } from "@/types/ai";

export const AI_ANALYSIS_QUERY_KEY = ["ai", "analysis"];

// AI 여행 분석 조회 Query Hook
export const useAIAnalysis = () => {
  return useQuery({
    queryKey: AI_ANALYSIS_QUERY_KEY,
    queryFn: getAIAnalysis,
    select: (response) => response.data,

    // 수정 페이지 갔다 돌아오는 동안 기존 분석 유지
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

// AI 여행 분석 재분석 Mutation Hook
export const useRetryAIAnalysis = () => {
  return useMutation({
    mutationFn: (request: RetryAIAnalysisRequest) => retryAIAnalysis(request),
  });
};
