import api from "./axios";

import type { PremiumOrderRequest, PremiumOrderResponse } from "@/types/premiumOrder";

// 1:1 커스텀 주문 생성
export const createPremiumOrder = async (
  request: PremiumOrderRequest,
): Promise<PremiumOrderResponse> => {
  const response = await api.post<PremiumOrderResponse>("/api/orders/premiums", request);

  return response.data;
};
