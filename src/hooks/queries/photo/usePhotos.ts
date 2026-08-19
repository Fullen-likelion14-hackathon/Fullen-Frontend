import { useQuery } from "@tanstack/react-query";

import { getPhotos } from "@/api/photo";

import type { PhotoScope } from "@/types/photo";

export const usePhotos = (scope?: PhotoScope) => {
  return useQuery({
    queryKey: ["photos", scope],
    queryFn: () => getPhotos(scope),
    select: (response) => response.data,
  });
};
