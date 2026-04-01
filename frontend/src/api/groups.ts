import { client } from "./client";
import type { GroupsResponse } from "../types";

export const fetchGroups = async (): Promise<GroupsResponse> => {
  const { data } = await client.get<GroupsResponse>("/groups");
  return data;
};
