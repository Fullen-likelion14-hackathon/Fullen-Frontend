import { useMutation, useQueryClient } from "@tanstack/react-query";

import { saveInitial } from "@/api/initial";

// 이니셜 적용 Mutation
export const useSaveInitial = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveInitial,

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["initials", response.data.userBagId],
      });
    },
  });
};
