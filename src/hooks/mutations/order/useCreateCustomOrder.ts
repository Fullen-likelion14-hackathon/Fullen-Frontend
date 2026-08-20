import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createCustomOrder } from "@/api/order";

// 커스텀 주문 생성 Mutation
export const useCreateCustomOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createCustomOrder,

    onSuccess: (response) => {
      // 주문 목록 동기화
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      // 주문 완료 패치 상태 동기화
      queryClient.invalidateQueries({
        queryKey: ["patchPositions", response.data.userBagId],
      });

      // 주문 완료 이니셜 상태 동기화
      queryClient.invalidateQueries({
        queryKey: ["initials", response.data.userBagId],
      });
    },
  });
};
