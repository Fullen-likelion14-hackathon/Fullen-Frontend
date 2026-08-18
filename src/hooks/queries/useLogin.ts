// src/hooks/queries/useLogin.ts
import { useMutation } from "@tanstack/react-query";
import { login } from "@/api/auth";
import { useAuthStore } from "@/stores/authStore";

export const useLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
    },
  });
};