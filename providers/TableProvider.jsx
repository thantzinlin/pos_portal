import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  shops: [],
  tables: [],
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
};

export const tableContext = createContext(initState);

export default function TableProvider({ children }) {
  return (
    <tableContext.Provider value={useData(initState)}>
      {children}
    </tableContext.Provider>
  );
}
