import { useQuery } from "@tanstack/react-query";

import { getBagDetail, getBags } from "@/api/bag";

// 소유한 가방 리스트 조회
export const useBags = () => {
  return useQuery({
    queryKey: ["bags"],
    queryFn: getBags,
  });
};

// 소유한 가방 상세 조회
export const useBag = (bagId?: number) => {
  return useQuery({
    queryKey: ["bag", bagId],
    queryFn: () => getBagDetail(bagId!),
    enabled: bagId !== undefined,
  });
};
