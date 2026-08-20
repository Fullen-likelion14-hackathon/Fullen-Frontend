// src/hooks/queries/useNations.ts
import { useQuery } from "@tanstack/react-query";
import { getNations } from "@/api/nation";

export const useNations = () => {
  return useQuery({
    queryKey: ["nations"],
    queryFn: getNations,
    select: (nations) => nations.map((n) => n.nationKRName),
    staleTime: Infinity, // 나라 목록은 자주 안 바뀌니 재요청 최소화
  });
};