import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  shops: [],
  categories: [],
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
};

export const categoryContext = createContext(initState);

export default function CategoryProvider({ children }) {
  return (
    <categoryContext.Provider value={useData(initState)}>
      {children}
    </categoryContext.Provider>
  );
}
