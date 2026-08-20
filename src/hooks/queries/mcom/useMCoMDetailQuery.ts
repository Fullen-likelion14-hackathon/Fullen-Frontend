import { useQuery } from "@tanstack/react-query";

import { getMCoMDetail } from "@/api/mcom";

export const useMCoMDetailQuery = (postId: number) => {
  return useQuery({
    queryKey: ["mcom", "detail", postId],
    queryFn: () => getMCoMDetail(postId),
    enabled: postId > 0,
  });
};
