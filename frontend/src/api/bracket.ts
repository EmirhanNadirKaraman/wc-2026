import { client } from "./client";
import type { BracketResponse } from "../types";

export const fetchBracket = async (): Promise<BracketResponse> => {
  const { data } = await client.get<BracketResponse>("/bracket");
  return data;
};
