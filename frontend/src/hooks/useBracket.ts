import { useQuery } from "@tanstack/react-query";
import { fetchBracket } from "../api/bracket";

export const useBracket = () =>
  useQuery({
    queryKey: ["bracket"],
    queryFn: fetchBracket,
    staleTime: 5 * 60_000,
  });
