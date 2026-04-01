import { useQuery } from "@tanstack/react-query";
import { fetchMatches } from "../api/matches";

export const useMatches = (stage?: string, group?: string) =>
  useQuery({
    queryKey: ["matches", stage, group],
    queryFn: () => fetchMatches(stage, group),
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
