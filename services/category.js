import { httpGet } from "@/utils/rest-client";

export const getCategories = async (params = {}) => {
  return httpGet("/api/categories", {
    params: {
      ...params,
    },
  });
};
