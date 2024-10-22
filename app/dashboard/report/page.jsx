import React from "react";
import Breadcrumb from "@/components/Breadcrumb";

const Report = () => {
  return (
    <div className="py-5 pr-4">
      <div className="m-8 grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Render four cards with different icons and menu descriptions */}
        <ReportCard
          icon={<DailySaleReportIcon />}
          description="Daily Sale Report"
          href="/dashboard/report/dailysalereport"
        />
      </div>
    </div>
  );
};

export default Report;

function ReportCard({ icon, description = "tooltip 💡", href = "/" }) {
  return (
    <a href={href}>
      <div
        className="flex pt-5 bg-white rounded-lg overflow-hidden shadow-md w-full  items-center p-4 justify-start"
        style={{ gap: "0.75rem" }}
      >
        {/* Icon */}
        <div className="group ">{icon}</div>

        {/* Description */}
        <div className="pb-4 pt-3 ">
          <h2 className="font-bold text-xl m-2">{description}</h2>
        </div>
      </div>
    </a>
  );
}

function DailySaleReportIcon() {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
      >
        <g
          fill="none"
          stroke="black"
          stroke-linecap="round"
          stroke-linejoin="round"
          strokeWidth="2"
        >
          <path d="M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h5.697M18 14v4h4m-4-7V7a2 2 0 0 0-2-2h-2" />
          <path d="M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2m6 13a4 4 0 1 0 8 0a4 4 0 1 0-8 0m-6-7h4m-4 4h3" />
        </g>
      </svg>
    </div>
  );
}
