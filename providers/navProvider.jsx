import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
  href: "",
};
export const navContext = createContext(initState);
export default function NavProvider({ children }) {
  return (
    <navContext.Provider value={useData(initState)}>
      {children}
    </navContext.Provider>
  );
}
