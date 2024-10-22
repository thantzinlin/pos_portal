import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  shops: [],
  discount_types: [],
  items: [],
  categories: [],
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
};

export const itemContext = createContext(initState);

export default function ItemProvider({ children }) {
  return (
    <itemContext.Provider value={useData(initState)}>
      {children}
    </itemContext.Provider>
  );
}
