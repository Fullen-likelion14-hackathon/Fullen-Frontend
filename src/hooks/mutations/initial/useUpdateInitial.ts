import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateInitial } from "@/api/initial";

import type { UpdateInitialRequest } from "@/types/initial";

interface UpdateInitialVariables {
  // 서버 발급 이니셜 id
  initialId: number;

  // 사용자 가방 id
  userBagId: number;

  // 이니셜 수정 정보
  request: UpdateInitialRequest;
}

// 이니셜 수정 Mutation
export const useUpdateInitial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ initialId, request }: UpdateInitialVariables) =>
      updateInitial(initialId, request),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["initials", variables.userBagId],
      });
    },
  });
};
