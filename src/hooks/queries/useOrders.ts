import { useQuery } from "@tanstack/react-query";

import { getOrders } from "@/api/order";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
};
