import { httpGet } from "@/utils/rest-client";

export const getOrders = async (params = {}) => {
  return httpGet("/api/orders", {
    params: {
      page: 1,
      per_page: 10,
      ...params,
    },
  });
};

export const getOrderDetails = async (id) => {
  return httpGet(`/api/orders/${id}/details`);
};
