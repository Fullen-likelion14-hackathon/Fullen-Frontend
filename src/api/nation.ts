// src/api/nation.ts
import api from "@/api/axios";

export interface NationResponse {
  nationKRName: string;
  nationENName: string;
}

export const getNations = async () => {
  const response = await api.get<{
    success: boolean;
    code: number;
    message: string;
    data: NationResponse[];
  }>("/api/nations");

  return response.data.data;
};