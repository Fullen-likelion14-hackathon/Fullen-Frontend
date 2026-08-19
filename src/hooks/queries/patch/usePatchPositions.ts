import { useQuery } from "@tanstack/react-query";

import { getPatchPositions } from "@/api/patch";

// 가방 적용 패치 목록 조회 Query
export const usePatchPositions = (userBagId?: number) => {
  return useQuery({
    queryKey: ["patchPositions", userBagId],

    queryFn: () => {
      if (userBagId === undefined) {
        throw new Error("사용자 가방 id가 필요합니다.");
      }

      return getPatchPositions(userBagId);
    },

    select: (response) => response.data,

    enabled: userBagId !== undefined,
  });
};
