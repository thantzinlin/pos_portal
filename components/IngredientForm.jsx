import { useState } from "react";
import money from "mm-money";

function IngredientForm({
  ingredient = {},
  shops = [],
  onSubmit,
  onBackClick,
}) {
  const [formData, setFormData] = useState({
    name: ingredient.name || "",
    stock_quantity: ingredient.stock_quantity || "0.00",
    unit: ingredient.unit || "",
    reorder_level: ingredient.reorder_level || "0.00",
    expiry_date: ingredient.expiry_date || "",
    shop_id: ingredient.shop_id || "0",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="w-full mx-auto mt-5 p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="stock_quantity"
            >
              Stock Quantity
            </label>
            <input
              onBlur={(e) =>
                setFormData({
                  ...formData,
                  stock_quantity: money.format(e.target.value),
                })
              }
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="stock_quantity"
              type="text"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="unit"
            >
              Unit
            </label>
            <input
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="unit"
              type="text"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="reorder_level"
            >
              Reorder Level
            </label>
            <input
              onBlur={(e) =>
                setFormData({
                  ...formData,
                  reorder_level: money.format(e.target.value),
                })
              }
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="reorder_level"
              type="number"
              name="reorder_level"
              value={formData.reorder_level}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="expiry_date"
            >
              Expiry Date
            </label>
            <input
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="expiry_date"
              type="text"
              name="expiry_date"
              value={formData.expiry_date}
              onChange={handleChange}
              required
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
              className="w-full p-2 border rounded-lg select select-bordered w-full  focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
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
          >
            {ingredient.id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default IngredientForm;
