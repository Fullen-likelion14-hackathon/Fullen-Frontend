import api from "./axios";

import type {
  PremiumOrderRequest,
  PremiumOrderResponse,
  PremiumOrderDetail,
} from "@/types/premiumOrder";

// 1:1 커스텀 주문 생성
export const createPremiumOrder = async (
  request: PremiumOrderRequest,
): Promise<PremiumOrderResponse> => {
  const response = await api.post<PremiumOrderResponse>("/api/orders/premiums", request);

  return response.data;
};

// 1:1 커스텀 요청 주문 상세 조회
export const getPremiumOrderDetail = async (premiumId: number): Promise<PremiumOrderDetail> => {
  const response = await api.get<{
    success: boolean;
    code: number;
    message: string;
    data: PremiumOrderDetail;
  }>(`/api/orders/premiums/${premiumId}`);

  return response.data.data;
};
