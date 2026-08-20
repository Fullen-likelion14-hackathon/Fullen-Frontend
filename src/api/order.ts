import api from "./axios";

import type { CreateCustomOrderRequest, CreateCustomOrderResponse, Order } from "@/types/order";

// 주문 목록 최신순 조회
export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get("/api/orders");

  return response.data.data;
};

// 커스텀 주문 생성
export const createCustomOrder = async (
  request: CreateCustomOrderRequest,
): Promise<CreateCustomOrderResponse> => {
  const response = await api.post<CreateCustomOrderResponse>("/api/orders", request);

  return response.data;
};
