// src/hooks/queries/useDeleteJourney.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteJourney } from "@/api/journey";

export const useDeleteJourney = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteJourney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["journeys"] });
    },
  });
};