import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteInitial } from "@/api/initial";

interface DeleteInitialVariables {
  // 서버 발급 이니셜 id
  initialId: number;

  // 사용자 가방 id
  userBagId: number;
}

// 이니셜 삭제 Mutation
export const useDeleteInitial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ initialId }: DeleteInitialVariables) => deleteInitial(initialId),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["initials", variables.userBagId],
      });
    },
  });
};
