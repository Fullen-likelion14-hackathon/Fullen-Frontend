// src/hooks/queries/useUpdateJourney.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateJourney, type UpdateJourneyRequest } from "@/api/journey";

export const useUpdateJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ journeyId, payload }: { journeyId: number; payload: UpdateJourneyRequest }) =>
      updateJourney(journeyId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
      queryClient.invalidateQueries({ queryKey: ["journey", variables.journeyId] });
    },
  });
};