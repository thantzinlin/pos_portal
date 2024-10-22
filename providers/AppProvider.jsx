import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  loading: false,
};

export const appContext = createContext(initState);

export default function AppProvider({ children }) {
  return (
    <appContext.Provider value={useData(initState)}>
      {children}
    </appContext.Provider>
  );
}
