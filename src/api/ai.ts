import api from "@/api/axios";

import type {
  AIAnalysisResponse,
  GenerateAIPatchRequest,
  GenerateAIPatchResponse,
} from "@/types/ai";

// 현재 로그인 사용자 AI 여행 분석 조회 API
export const getAIAnalysis = async (): Promise<AIAnalysisResponse> => {
  const response = await api.get<AIAnalysisResponse>("/api/ai/analysis");

  return response.data;
};

// 선택 사진 / 작가 / 프레임 기반 AI 패치 생성 API
export const generateAIPatch = async (
  request: GenerateAIPatchRequest,
): Promise<GenerateAIPatchResponse> => {
  const response = await api.post<GenerateAIPatchResponse>("/api/ai/imageGen", request);

  return response.data;
};
