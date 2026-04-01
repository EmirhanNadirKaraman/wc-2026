import { useQuery } from "@tanstack/react-query";
import { fetchMeta } from "../api/meta";

export const useMeta = () =>
  useQuery({
    queryKey: ["meta"],
    queryFn: fetchMeta,
    staleTime: 60_000,
    refetchInterval: 60_000,
  });
