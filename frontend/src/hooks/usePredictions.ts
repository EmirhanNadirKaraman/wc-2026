import { useQuery } from "@tanstack/react-query";
import { fetchParticipantPredictions, fetchParticipants } from "../api/predictions";

export const useParticipants = () =>
  useQuery({
    queryKey: ["participants"],
    queryFn: fetchParticipants,
    staleTime: 60_000,
  });

export const useParticipantPredictions = (name: string | null) =>
  useQuery({
    queryKey: ["predictions", name],
    queryFn: () => fetchParticipantPredictions(name!),
    enabled: !!name,
    staleTime: 60_000,
  });
