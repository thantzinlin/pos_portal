"use client";
import { dashboardContext } from "@/providers/DashboardProvider";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";

export default function RightSectionCard({ order, children }) {
  const { selectedTable, setSelectedTable } = useContext(dashboardContext);
  const [slideAnimation, setSlideAnimation] = useState(
    "slideOut 0.5s ease-in-out forwards"
  );

  useEffect(() => {
    if (selectedTable != 0) {
      setSlideAnimation("slideIn 0.3s ease-in-out forwards");
    } else {
      setSlideAnimation("slideOut 0.5s ease-in-out forwards");
    }
  }, [selectedTable]);
  return (
    <div
      className=" w-96  text-black py-8 fixed top-0 bottom-0 right-0"
      style={{
        width: selectedTable == 0 ? 0 : "24rem",
        maxWidth: selectedTable == 0 ? 0 : "24rem",
        padding: selectedTable == 0 ? 0 : "2rem 0",
        animation: slideAnimation,
        transition: "all 0.3s",
        marginTop: "4.2rem",
        backgroundColor: "var(--secondary-color)",
      }}
    >
      <div className="flex">
        <div
          className="absolute left-[-3%] pt-1%  p-1  shadow-md skeleton close-sidebar"
          onClick={() => {
            setSelectedTable(0);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M9 18L15 12L9 6"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="mb-8 px-8">
          <h3 className="text-lg font-bold">#{order.id}</h3>
          <p>Waiter: {order.waiter_name}</p>
          <p>Table: {order.table_number}</p>
          <p>Time: {moment(order.created_at).format("DD/MM/YYYY hh:mm A")}</p>
          <div>Status: {order.status}</div>
        </div>
      </div>
      {children}
    </div>
  );
}
