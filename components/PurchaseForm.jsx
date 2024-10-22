import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import Swal from "sweetalert2";
import money from "mm-money";
function PurchaseForm({
  purchases = {},
  shops = [],
  ingredients = {},
  onSubmit,
  onBackClick,
}) {
  const [formData, setFormData] = useState({
    total_cost: purchases.total_cost || "0.00",
    purchase_date: purchases.purchase_date
      ? moment(purchases.purchase_date).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD"),
    shop_id: purchases.shop_id || "0",
    purchase_details: purchases.purchase_details || [],
  });

  const [itemDetail, setItemDetail] = useState({
    purchase_detail_id: purchases.purchase_detail_id || 0,
    ingredient_id: purchases.ingredient_id || "0",
    quantity_purchased: purchases.quantity_purchased || "0.00",
    unit: purchases.unit || "kg",
    buying_price_per_unit: purchases.buying_price_per_unit || "0.00",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "ingredient_shop_id") {
      // If the selected field is shop_id, update itemDetail
      setItemDetail((prevItemDetail) => ({
        ...prevItemDetail,
        ingredient_id: value,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  console.log("ingredients", ingredients);
  const addItem = () => {
    // Check if any of the required fields are empty or have invalid values
    if (
      itemDetail.ingredient_id === "0" ||
      itemDetail.quantity_purchased === "0.00" ||
      itemDetail.buying_price_per_unit === "0.00"
    ) {
      return Swal.fire({
        icon: "error",
        text: "Please fill all fields correctly",
        showConfirmButton: false,
        timer: 5000,
      });
    }

    // If all fields are valid, add the item to the purchase details
    setFormData((prevData) => {
      const updatedData = {
        ...prevData,
        purchase_details: [...prevData.purchase_details, itemDetail],
      };
      return updatedData;
    });

    // Reset itemDetail to default values
    setItemDetail({
      ingredient_id: "0",
      quantity_purchased: "0.00",
      unit: "kg",
      buying_price_per_unit: "0.00",
    });

    console.log("itemDetail", formData);
  };

  useEffect(() => {
    // Calculate total cost when purchase details change
    const calculateTotalCost = () => {
      let totalCost = 0;
      formData.purchase_details.forEach((detail) => {
        totalCost +=
          parseFloat(detail.quantity_purchased) *
          parseFloat(detail.buying_price_per_unit);
      });
      setFormData((prevData) => ({
        ...prevData,
        total_cost: totalCost.toFixed(2), // Round to 2 decimal places
      }));
    };

    calculateTotalCost();
  }, [formData.purchase_details]);

  const handleSubmit = () => {
    const formattedData = {
      total_cost: parseFloat(formData.total_cost),
      purchase_date: formData.purchase_date,
      shop_id: parseInt(formData.shop_id),
      purchase_details: formData.purchase_details.map((detail) => ({
        purchase_detail_id: parseFloat(detail.purchase_detail_id),
        ingredient_id: parseInt(detail.ingredient_id),
        quantity_purchased: parseFloat(detail.quantity_purchased),
        unit: detail.unit,
        buying_price_per_unit: parseFloat(detail.buying_price_per_unit),
      })),
    };

    onSubmit(formattedData);
  };

  const deleteItem = (index) => {
    setFormData((prevData) => {
      const updatedPurchaseDetails = [...prevData.purchase_details];
      updatedPurchaseDetails.splice(index, 1);
      return {
        ...prevData,
        purchase_details: updatedPurchaseDetails,
      };
    });
  };
  const showshop = (ingredientId) => {
    const ingredient = ingredients.find(
      (ingredient) => ingredient.ingredient_id == ingredientId
    );
    return ingredient ? ingredient.name : "Unknown Shop";
  };

  const handleItemClick = (detail, index) => {
    setItemDetail(detail);

    // Remove the clicked item from formData.purchase_details
    const updatedPurchaseDetails = formData.purchase_details.filter(
      (item, i) => i !== index
    );
    setFormData((prevData) => ({
      ...prevData,
      purchase_details: updatedPurchaseDetails,
    }));
  };

  const handleDeleteClick = (e, index) => {
    e.stopPropagation(); // Prevents the row click event from being triggered
    deleteItem(index);
  };

  return (
    <div className="w-full mx-auto mt-5 p-6 bg-white shadow-md rounded-lg">
      <form className="space-y-6">
        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="total_cost"
            >
              Total Cost
            </label>
            <input
              // onBlur={(e) =>
              //   setFormData({
              //     ...formData,
              //     total_cost: money.format(e.target.value),
              //   })
              // }
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="total_cost"
              type="text"
              name="total_cost"
              value={formData.total_cost}
              onChange={handleChange}
              disabled
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="purchase_date"
            >
              Date
            </label>
            <input
              value={formData.purchase_date}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  purchase_date: e.target.value,
                })
              }
              type="date"
              className="p-2 w-full rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="shop_id"
            >
              Shop
            </label>
            <select
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4 "
              id="shop_id"
              name="shop_id"
              value={formData.shop_id}
              onChange={handleChange}
              required
            >
              <option value="0">Select a Shop</option>
              {shops.map((shop) => (
                <option key={shop.value} value={shop.value}>
                  {shop.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <hr />
      </form>
      <div className="space-y-6 pt-4">
        <div className="flex">
          <label
            className="block text-gray-700 underline text-sm font-bold mb-2"
            htmlFor="shop_id"
          >
            Item Detail
          </label>
          <div
            className="ml-auto cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            onClick={() => {
              addItem();
            }}
          >
            Add
          </div>
        </div>
        <div>
          <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-200">
              <tr className=" text-left">
                <th style={{ padding: "8px" }}>Ingredient Name</th>
                <th style={{ padding: "8px" }}>Quantity Purchased</th>
                <th style={{ padding: "8px" }}>Unit</th>
                <th style={{ padding: "8px" }}>Buying Price Per Unit</th>
                <th style={{ padding: "8px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {formData.purchase_details.map((detail, index) => (
                <tr key={index} onClick={() => handleItemClick(detail, index)}>
                  <td style={{ padding: "8px" }}>
                    {showshop(detail.ingredient_id)}
                  </td>
                  <td style={{ padding: "8px" }}>
                    {detail.quantity_purchased}
                  </td>
                  <td style={{ padding: "8px" }}>{detail.unit}</td>
                  <td style={{ padding: "8px" }}>
                    {detail.buying_price_per_unit}
                  </td>
                  <td style={{ padding: "8px" }}>
                    <button
                      className="text-red-500"
                      onClick={(e) => handleDeleteClick(e, index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="shop_id"
            >
              Ingredient
            </label>
            <select
              className=" w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="ingredient_shop_id"
              name="ingredient_shop_id"
              value={itemDetail.ingredient_id}
              onChange={handleChange}
              required
            >
              <option value="0">Select a Ingredient</option>

              {ingredients.map((ingredient) => (
                <option
                  key={ingredient.ingredient_id}
                  value={ingredient.ingredient_id}
                >
                  {ingredient.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="purchase_date"
            >
              Quantity Purchased
            </label>
            <input
              onBlur={(e) =>
                setItemDetail({
                  ...itemDetail,
                  quantity_purchased: e.target.value,
                })
              }
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="quantity_purchased"
              type="text"
              name="quantity_purchased"
              value={itemDetail.quantity_purchased}
              onChange={(e) =>
                setItemDetail({
                  ...itemDetail,
                  quantity_purchased: e.target.value,
                })
              }
              required
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="purchase_date"
            >
              Unit
            </label>
            <input
              onBlur={(e) =>
                setItemDetail({
                  ...itemDetail,
                  unit: e.target.value,
                })
              }
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="unit"
              type="text"
              name="unit"
              value={itemDetail.unit}
              onChange={(e) =>
                setItemDetail({
                  ...itemDetail,
                  unit: e.target.value,
                })
              }
              required
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="purchase_date"
            >
              Buying Price Per Unit
            </label>
            <input
              onBlur={(e) =>
                setFormData({
                  ...formData,
                  buying_price_per_unit: money.format(e.target.value),
                })
              }
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="buying_price_per_unit"
              type="text"
              name="buying_price_per_unit"
              value={itemDetail.buying_price_per_unit}
              onChange={(e) =>
                setItemDetail({
                  ...itemDetail,
                  buying_price_per_unit: e.target.value,
                })
              }
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          onClick={(e) => {
            e.preventDefault();
            onBackClick(e);
          }}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
        >
          Back
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
          type="submit"
          onClick={() => {
            handleSubmit();
          }}
        >
          {purchases.purchase_id ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}

export default PurchaseForm;
