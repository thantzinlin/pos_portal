import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  shops: [],
  roles: [],
  users: [],
  search: "",
  page: 1,
  perPage: 10,
  pageCounts: 0,
  total: 0,
};

export const userContext = createContext(initState);

export default function UserProvider({ children }) {
  return (
    <userContext.Provider value={useData(initState)}>
      {children}
    </userContext.Provider>
  );
}
