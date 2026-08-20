import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updatePatchPosition } from "@/api/patch";

import type { UpdatePatchPositionRequest } from "@/types/patch";

interface UpdatePatchPositionVariables {
  // 패치 위치 id
  patchPositionId: number;

  // 패치 위치 수정 정보
  request: UpdatePatchPositionRequest;

  // 사용자 가방 id
  userBagId: number;
}

// 가방 패치 위치 수정 Mutation
export const useUpdatePatchPosition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patchPositionId, request }: UpdatePatchPositionVariables) =>
      updatePatchPosition(patchPositionId, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patchPositions", variables.userBagId],
      });
    },
  });
};
