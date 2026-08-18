// src/hooks/queries/useJourney.ts
import { useQuery } from "@tanstack/react-query";
import { getJourney } from "@/api/journey";

export const useJourney = (journeyId: number) => {
  return useQuery({
    queryKey: ["journey", journeyId],
    queryFn: () => getJourney(journeyId),
    enabled: journeyId > 0,
  });
};