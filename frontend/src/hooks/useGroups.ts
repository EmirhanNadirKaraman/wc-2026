import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../api/groups";

export const useGroups = () =>
  useQuery({
    queryKey: ["groups"],
    queryFn: fetchGroups,
    staleTime: 5 * 60_000,
  });
