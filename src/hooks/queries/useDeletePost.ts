import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePost } from "@/api/post";

export const useDeletePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};
