import api from "./axios";

import type { BagDetail, BagListItem } from "@/types/bag";

// 소유한 가방 리스트 조회
export const getBags = async (): Promise<BagListItem[]> => {
  const response = await api.get("/api/bags");

  return response.data.data;
};

// 소유한 가방 상세 조회
export const getBagDetail = async (bagId: number): Promise<BagDetail> => {
  const response = await api.get(`/api/bags/${bagId}`);

  return response.data.data;
};
