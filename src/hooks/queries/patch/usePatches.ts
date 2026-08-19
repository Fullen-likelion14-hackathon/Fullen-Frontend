import { useQuery } from "@tanstack/react-query";

import { getPatches } from "@/api/patch";

import type { AIPatchApiType } from "@/types/ai";

// 저장 패치 목록 조회 Query
export const usePatches = (type?: AIPatchApiType) => {
  return useQuery({
    queryKey: ["patches", type],

    queryFn: () => {
      if (!type) {
        throw new Error("패치 타입이 필요합니다.");
      }

      return getPatches(type);
    },

    select: (response) => response.data,

    enabled: !!type,
  });
};
