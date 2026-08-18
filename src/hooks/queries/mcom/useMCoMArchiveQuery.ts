import { useQuery } from "@tanstack/react-query";

import { getMCoMArchive } from "@/api/mcom";

import type { MCoMTab, MCoMScope } from "@/types/mcom";

const scopeMap: Record<MCoMTab, MCoMScope> = {
  country: "GERMANY",
  global: "GLOBAL",
};

export const useMCoMArchiveQuery = (tab: MCoMTab) => {
  const scope = scopeMap[tab];

  return useQuery({
    queryKey: ["mcom", "archive", tab],
    queryFn: () => getMCoMArchive(scope),
    select: (response) => response.data,
  });
};
