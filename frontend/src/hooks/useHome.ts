import { useQuery } from "@tanstack/react-query";
import { fetchHome } from "../api/home";

export const useHome = () =>
  useQuery({
    queryKey: ["home"],
    queryFn: fetchHome,
    staleTime: 30_000,
    refetchInterval: 30_000,
  });
