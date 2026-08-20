// src/api/auth.ts
import api from "@/api/axios";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
}

export const login = async ({ email, password }: LoginRequest) => {
  const response = await api.post<{
    success: boolean;
    code: number;
    message: string;
    data: LoginResponse;
  }>("/api/auth/login", { email, password });

  return response.data.data;
};