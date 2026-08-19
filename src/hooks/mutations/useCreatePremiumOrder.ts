import { useMutation } from "@tanstack/react-query";

import { createPremiumOrder } from "@/api/premiumOrder";

// 1:1 커스텀 주문 생성
export const useCreatePremiumOrder = () => {
  return useMutation({
    mutationFn: createPremiumOrder,
  });
};
