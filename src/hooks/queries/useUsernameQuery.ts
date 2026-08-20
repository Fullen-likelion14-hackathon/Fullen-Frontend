import { useQuery } from "@tanstack/react-query";

import { getUsername } from "@/api/user";

export const useUsernameQuery = () => {
  return useQuery({
    queryKey: ["username"],
    queryFn: getUsername,
  });
};
