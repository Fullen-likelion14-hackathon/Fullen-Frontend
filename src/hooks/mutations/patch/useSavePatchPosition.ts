import { useMutation, useQueryClient } from "@tanstack/react-query";

import { savePatchPosition } from "@/api/patch";

// 가방 패치 적용 Mutation
export const useSavePatchPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePatchPosition,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["patchPositions", response.data.userBagId],
      });
    },
  });
};
