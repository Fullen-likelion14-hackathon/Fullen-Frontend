// src/hooks/queries/useJourneys.ts
import { useQuery } from "@tanstack/react-query";
import { getJourneys } from "@/api/journey";

export const useJourneys = () => {
  return useQuery({
    queryKey: ["journeys"],
    queryFn: getJourneys,
  });
};
