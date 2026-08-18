import api from "./axios";

import type { Order } from "@/types/order";

// 주문 목록 최신순 조회
export const getOrders = async (): Promise<Order[]> => {
  const response = await api.get("/api/orders");

  return response.data.data;
};
