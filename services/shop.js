import { httpGet } from "@/utils/rest-client";

export const getShops = async (params = {}) => {
  return httpGet("/api/shops", {
    params: {
      ...params,
    },
  });
};
