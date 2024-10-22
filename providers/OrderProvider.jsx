import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  selectItems: [],
};

export const orderContext = createContext(initState);

export default function OrderProvider({ children }) {
  return (
    <orderContext.Provider value={useData(initState)}>
      {children}
    </orderContext.Provider>
  );
}
