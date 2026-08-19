import { useQuery } from "@tanstack/react-query";

import { getArtist } from "@/api/artist";

export const useArtist = (artistId?: number) => {
  return useQuery({
    queryKey: ["artist", artistId],
    queryFn: () => getArtist(artistId!),
    select: (response) => response.data,
    enabled: artistId !== undefined,
  });
};
