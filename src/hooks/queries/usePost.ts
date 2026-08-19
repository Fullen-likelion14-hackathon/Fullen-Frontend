import { useQuery } from "@tanstack/react-query";
import { getPost } from "@/api/post";

export const usePost = (postId: number) => {
  return useQuery({
    queryKey: ["post", postId],
    queryFn: () => getPost(postId),
    enabled: postId > 0,
  });
};
