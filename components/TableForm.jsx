import { useState } from "react";

function TableForm({ shopId = 0, table = {}, shops = [], onSubmit }) {
  const [formData, setFormData] = useState({
    table_number: table.table_number || "",
    qr_code: table.qr_code || "",
    shop_id: table.shop_id || "0",
  });
  formData.shop_id = shopId;
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
              htmlFor="table_number"
            >
              Table Number
            </label>
            <input
              className="w-full p-2 border focus rounded-lg"
              id="table_number"
              type="text"
              name="table_number"
              value={formData.table_number}
              onChange={handleChange}
              required
              autoComplete="off"
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="qr_code"
            >
              QR Code
            </label>
            <textarea
              className="w-full p-2 border rounded-lg focus"
              id="qr_code"
              name="qr_code"
              cols="30"
              rows="10"
              value={formData.qr_code}
              onChange={handleChange}
            ></textarea>
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
              className="select select-bordered w-full focus"
              id="shop_id"
              name="shop_id"
              value={formData.shop_id}
              onChange={handleChange}
              required
            >
              <option value={0} disabled selected>
                Select a Shop
              </option>
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
              document.getElementById("my_modal_2").close();
            }}
            className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 mr-2"
          >
            Back
          </button>
          <button
            style={{
              backgroundColor: "var(--fourth-color)",
            }}
            className="text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {table.id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default TableForm;
