import { useQuery } from "@tanstack/react-query";

import { getArtists } from "@/api/artist";

export const useArtists = (enabled = true) => {
  return useQuery({
    queryKey: ["artists"],
    queryFn: getArtists,
    select: (response) => response.data,
    enabled,
  });
};
