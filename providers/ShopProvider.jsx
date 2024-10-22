import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  shops: [],
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
};

export const shopContext = createContext(initState);

export default function ShopProvider({ children }) {
  return (
    <shopContext.Provider value={useData(initState)}>
      {children}
    </shopContext.Provider>
  );
}
