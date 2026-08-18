// src/hooks/queries/useCreateJourney.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createJourney } from "@/api/journey";

export const useCreateJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
  });
};