// 사진 상세 조회
import { useQuery } from "@tanstack/react-query";

import { getPhoto } from "@/api/photo";

export const usePhoto = (photoId?: number) => {
  return useQuery({
    queryKey: ["photo", photoId],
    queryFn: () => getPhoto(photoId!),
    select: (response) => response.data,
    enabled: photoId !== undefined,
  });
};
