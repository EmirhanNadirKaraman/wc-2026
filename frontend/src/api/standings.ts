import { client } from "./client";
import type { StandingsResponse } from "../types";

export const fetchStandings = async (): Promise<StandingsResponse> => {
  const { data } = await client.get<StandingsResponse>("/standings");
  return data;
};
