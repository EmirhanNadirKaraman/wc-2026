import { client } from "./client";
import type { HomeResponse } from "../types";

export const fetchHome = async (): Promise<HomeResponse> => {
  const { data } = await client.get<HomeResponse>("/home");
  return data;
};
