import { httpGet } from "@/utils/rest-client";

export const getTables = async (params = {}) => {
  return httpGet("/api/tables", {
    params: {
      ...params,
    },
  });
};