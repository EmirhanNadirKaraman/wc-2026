import { client } from "./client";
import type { ParticipantPredictionSummary, PredictionWithOutcome } from "../types";

export const fetchParticipants = async (): Promise<ParticipantPredictionSummary[]> => {
  const { data } = await client.get<ParticipantPredictionSummary[]>("/predictions");
  return data;
};

export const fetchParticipantPredictions = async (
  name: string
): Promise<PredictionWithOutcome[]> => {
  const { data } = await client.get<PredictionWithOutcome[]>(
    `/predictions/${encodeURIComponent(name)}`
  );
  return data;
};
