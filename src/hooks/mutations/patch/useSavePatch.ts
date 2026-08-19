import { useMutation } from "@tanstack/react-query";

import { savePatch } from "@/api/patch";

// AI 패치 저장 Mutation Hook
export const useSavePatch = () => {
  return useMutation({
    // AI 패치 저장 API 함수
    mutationFn: savePatch,
  });
};
