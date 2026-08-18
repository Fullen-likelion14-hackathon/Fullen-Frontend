import { useQuery } from "@tanstack/react-query";

import { getMCoMPreview } from "@/api/mcom";

export const useMCoMPreviewQuery = (postId: number) => {
  return useQuery({
    queryKey: ["mcom", "preview", postId],
    queryFn: () => getMCoMPreview(postId),
    select: (response) => response.data,
    enabled: postId > 0,
  });
};
