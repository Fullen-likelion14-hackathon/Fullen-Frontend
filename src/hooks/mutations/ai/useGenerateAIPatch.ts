import { useMutation } from "@tanstack/react-query";

import { generateAIPatch } from "@/api/ai";

// AI 패치 생성 Mutation Hook
export const useGenerateAIPatch = () => {
  return useMutation({
    // AI 패치 생성 API 함수
    mutationFn: generateAIPatch,
  });
};
