import { useQuery } from "@tanstack/react-query";
import { getPosts } from "@/api/post";

export const usePosts = (journeyId: number) => {
  return useQuery({
    queryKey: ["posts", journeyId],
    queryFn: () => getPosts(journeyId),
    enabled: journeyId > 0,
  });
};
