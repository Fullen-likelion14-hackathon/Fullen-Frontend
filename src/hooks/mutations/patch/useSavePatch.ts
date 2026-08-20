import { useMutation, useQueryClient } from "@tanstack/react-query";

import { savePatch } from "@/api/patch";

// AI 생성 패치 저장 Mutation
export const useSavePatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: savePatch,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["patches", response.data.type],
      });
    },
  });
};
