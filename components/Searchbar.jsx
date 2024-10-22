import React from "react";

function Searchbar() {
  return (
    <div className="w-64 mx-auto p-4 bg-white rounded-lg relative">
      <div className="mx-auto">
        <div className="absolute">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input type="text" className="input w-64 h-full" />
      </div>
    </div>
  );
}

export default Searchbar;
