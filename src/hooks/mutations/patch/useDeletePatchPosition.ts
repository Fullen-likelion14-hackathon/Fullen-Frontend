import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePatchPosition } from "@/api/patch";

interface DeletePatchPositionVariables {
  // 패치 위치 id
  patchPositionId: number;

  // 사용자 가방 id
  userBagId: number;
}

// 가방 패치 위치 삭제 Mutation
export const useDeletePatchPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patchPositionId }: DeletePatchPositionVariables) =>
      deletePatchPosition(patchPositionId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patchPositions", variables.userBagId],
      });
    },
  });
};
