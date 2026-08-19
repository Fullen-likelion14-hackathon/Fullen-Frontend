import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPremiumOrder } from "@/api/premiumOrder";

// 1:1 커스텀 주문 생성
export const useCreatePremiumOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPremiumOrder,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },
  });
};
