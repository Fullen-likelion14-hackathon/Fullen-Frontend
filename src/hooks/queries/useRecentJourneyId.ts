import { useQuery } from "@tanstack/react-query";
import { getRecentJourneyId } from "@/api/journey";

export function useRecentJourneyId() {
  return useQuery({
    queryKey: ["journeys", "recent"],
    queryFn: getRecentJourneyId,
  });
}