import { useQuery } from "@tanstack/react-query";
import { getCurrentUser, getCurrentUserContext } from "../api/getCurrentUser";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}

export function useCurrentUserContext() {
  return useQuery({
    queryKey: ["currentUserContext"],
    queryFn: getCurrentUserContext,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
  });
}
