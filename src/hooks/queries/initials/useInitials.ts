import { useQuery } from "@tanstack/react-query";

import { getInitials } from "@/api/initial";

// 적용 이니셜 목록 조회 Query
export const useInitials = (userBagId?: number) => {
  return useQuery({
    queryKey: ["initials", userBagId],

    queryFn: () => {
      if (userBagId === undefined) {
        throw new Error("사용자 가방 id가 필요합니다.");
      }

      return getInitials(userBagId);
    },

    select: (response) => response.data,

    enabled: userBagId !== undefined,
  });
};
