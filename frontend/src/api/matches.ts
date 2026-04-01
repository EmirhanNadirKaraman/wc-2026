import { client } from "./client";
import type { Match } from "../types";

export const fetchMatches = async (stage?: string, group?: string): Promise<Match[]> => {
  const params: Record<string, string> = {};
  if (stage) params.stage = stage;
  if (group) params.group = group;
  const { data } = await client.get<Match[]>("/matches", { params });
  return data;
};
