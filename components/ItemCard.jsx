import React from "react";
import money from "mm-money";

export default function ItemCard({
  itemName,
  price,
  isActive,
  onClick = () => {},
}) {
  console.log;
  return (
    <div
      style={{
        backgroundColor: isActive ? "#3C82F6" : "#fff",
      }}
      onClick={onClick}
      className={`bg-white rounded-md shadow p-4 cursor-pointer transform hover:-translate-y-2 transition duration-300 ease-in-out
          hover:shadow-customShadow
        `}
    >
      <p style={{ color: isActive ? "#fff" : "" }} className="text-gray-600">
        {itemName}
      </p>
      <p style={{ color: isActive ? "#fff" : "" }} className="text-gray-600">
        {money.format(price)} Ks
      </p>
    </div>
  );
}
