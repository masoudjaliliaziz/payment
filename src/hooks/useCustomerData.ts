import { useQuery } from "@tanstack/react-query";
import { loadCurrentUser } from "../api/getData";

export function useCustomers(guid: string) {
  return useQuery({
    queryKey: ["customers"],
    queryFn: () => loadCurrentUser(guid),
  });
}
