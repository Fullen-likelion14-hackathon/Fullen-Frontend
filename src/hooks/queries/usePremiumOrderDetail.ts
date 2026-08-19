import { useQuery } from "@tanstack/react-query";

import { getPremiumOrderDetail } from "@/api/premiumOrder";

export const usePremiumOrderDetail = (premiumId?: number) => {
  return useQuery({
    queryKey: ["premiumOrderDetail", premiumId],
    queryFn: () => getPremiumOrderDetail(premiumId!),
    enabled: premiumId !== undefined,
  });
};
