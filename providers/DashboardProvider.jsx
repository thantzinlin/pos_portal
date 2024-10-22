import useData from "@/hooks/use-data";
import { createContext } from "react";

const initState = {
    showModel: false,
    shops: [],
    shopTables: {},
    order: {
        waiter_name: "",
        table_number: "",
        created_at: new Date().toISOString(),
        items: [],
    },
    search: "",
    selectedOrder: 0,
    selectedTable: 0,
    selectedShop:0,
};

export const dashboardContext = createContext(initState);

export default function DashboardProvider({ children }) {
    return (
        <dashboardContext.Provider value={useData(initState)}>
            {children}
        </dashboardContext.Provider>
    );
}
