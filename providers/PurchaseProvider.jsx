import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  purchases: [],
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
};
export const purchaseContext = createContext(initState);
export default function PurchaseProvider({ children }) {
  return (
    <purchaseContext.Provider value={useData(initState)}>
      {children}
    </purchaseContext.Provider>
  );
}
