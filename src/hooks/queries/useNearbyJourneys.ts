import { useQuery } from "@tanstack/react-query";
import { getNearbyJourneys } from "@/api/journey";

export function useNearbyJourneys(journeyId: number | null) {
  return useQuery({
    queryKey: ["journeys", journeyId, "nearby"],
    queryFn: () => getNearbyJourneys(journeyId as number),
    enabled: journeyId !== null,
  });
}