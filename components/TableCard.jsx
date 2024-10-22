import { dashboardContext } from "@/providers/DashboardProvider";
import { useContext } from "react";

export default function TableCard({
  id,
  table_number,
  order_id,
  isActive,
  onClick = () => {},
}) {
  const { selectedTable } = useContext(dashboardContext);

  return (
    <div
      style={{
        backgroundColor:
          selectedTable === id
            ? "rgb(242, 237, 254)"
            : order_id !== 0
            ? "var(--fourth-color)"
            : "#fff",
        border:
          selectedTable === id
            ? "2px solid var(--fourth-color)"
            : "2px solid transparent",
      }}
      onClick={onClick}
      className={`bg-white rounded-md shadow p-4 cursor-pointer transform hover:scale-110 transition-transform duration-300 ease-in-out 
      ${selectedTable === id && order_id != 0 ? "scale-110" : ""}`}
    >
      <p
        className="font-bold text-gray-800"
        style={{
          color:
            selectedTable === id
              ? "black"
              : order_id != 0
              ? "var( --secondary-color)"
              : "",
        }}
      >
        #{id}
      </p>
      <p
        style={{
          color:
            selectedTable === id
              ? "black"
              : order_id != 0
              ? "var( --secondary-color)"
              : "",
        }}
        className="text-gray-600"
      >
        {table_number}
      </p>
    </div>
  );
}
