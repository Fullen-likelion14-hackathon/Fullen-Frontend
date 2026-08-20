import api from "@/api/axios";

type UsernameResponse = {
  success: boolean;
  code: number;
  message: string;
  data: string;
};

export const getUsername = async () => {
  const response = await api.get<UsernameResponse>("/api/users/username");

  return response.data.data;
};
