//사진 삭제
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deletePhoto } from "@/api/photo";

export const useDeletePhoto = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePhoto,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["photos"],
      });
    },
  });
};
