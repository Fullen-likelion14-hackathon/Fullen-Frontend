import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePatch } from "@/api/patch";

import type { AIPatchApiType } from "@/types/ai";

interface DeletePatchVariables {
  // 삭제 대상 패치 id
  patchId: number;

  // 삭제 대상 패치 타입
  type: AIPatchApiType;
}

// 저장 패치 삭제 Mutation
export const useDeletePatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ patchId }: DeletePatchVariables) => deletePatch(patchId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["patches", variables.type],
      });
    },
  });
};
