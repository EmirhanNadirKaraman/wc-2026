import { client } from "./client";
import type { MetaResponse } from "../types";

export const fetchMeta = async (): Promise<MetaResponse> => {
  const { data } = await client.get<MetaResponse>("/meta");
  return data;
};
