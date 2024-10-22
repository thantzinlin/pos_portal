import { httpGet } from "@/utils/rest-client";

export const getRoles = async (params = {}) => {
  return httpGet("/api/roles", {
    params: {
      ...params,
    },
  });
};
