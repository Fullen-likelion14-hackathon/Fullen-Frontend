import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost } from "@/api/post";

export const useCreatePost = (journeyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Parameters<typeof createPost>[1]) => createPost(journeyId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts", journeyId] });
    },
  });
};
