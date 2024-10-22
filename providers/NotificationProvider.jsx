import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
    orderId:0
};

export const notificationContext = createContext(initState);

export default function NotificationProvider({ children }) {
  return (
    <notificationContext.Provider value={useData(initState)}>
      {children}
    </notificationContext.Provider>
  );
}
