import React from "react";

export default function PurchaseDetail({ details }) {
  return (
    <div className="w-full mx-auto  p-6 bg-white shadow-md rounded-lg">
      <label className="block text-gray-900 underline text-sm font-bold mb-2">
        Purchase Detail
      </label>
      {details && details.length !== 0 ? (
        details.map((purchaseDetail) => (
          <div key={purchaseDetail.purchase_detail_id}>
            <div className="block text-gray-700 mt-2 text-sm  mb-2">
              Ingredient : {purchaseDetail.ingredient_name}
            </div>
            <div className="block text-gray-700 text-sm  mb-2">
              Quantity : {purchaseDetail.quantity_purchased}{" "}
              {purchaseDetail.unit}
            </div>
            <div className="block text-gray-700 text-sm  mb-2">
              Buying Price per Unit : ${purchaseDetail.buying_price_per_unit}
            </div>
            <hr />
          </div>
        ))
      ) : (
        <div className="block text-gray-700 mt-2 text-sm  mb-2">
          No details available
        </div>
      )}
    </div>
  );
}
