import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  orders: [],
  order: {
    waiter_name: "",
    table_number: "",
    created_at: new Date().toISOString(),
    items: [],
  },
  subTotal: 0,
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
  selectedOrder: 0,
  fromDate: "",
  toDate: "",
};

export const paymentContext = createContext(initState);

export default function PaymentProvider({ children }) {
  return (
    <paymentContext.Provider value={useData(initState)}>
      {children}
    </paymentContext.Provider>
  );
}
