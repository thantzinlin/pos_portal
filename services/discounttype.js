import { httpGet } from "@/utils/rest-client";

export const getDiscountTypes = async (params = {}) => {
  return httpGet("/api/discount_types", {
    params: {
      ...params,
    },
  });
};
