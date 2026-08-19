import { useQuery } from "@tanstack/react-query";
import { getMapPins } from "@/api/journey";

export function useMapPins() {
  return useQuery({
    queryKey: ["journeys", "pins"],
    queryFn: getMapPins,
  });
}