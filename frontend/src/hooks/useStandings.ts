import { useQuery } from "@tanstack/react-query";
import { fetchStandings } from "../api/standings";

export const useStandings = () =>
  useQuery({
    queryKey: ["standings"],
    queryFn: fetchStandings,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
