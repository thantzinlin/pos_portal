import { useState, useContext } from "react";
import money from "mm-money";
import CategoryForm from "./CategoryForm";
import CustomModal from "@/components/CutomModal";
import { appContext } from "@/providers/AppProvider";
import { handleError, httpPost } from "@/utils/rest-client";

function ItemForm({
  shops = [],
  discount_types = [],
  categories = [],
  item = {},
  onSubmit,
  onBackClick,
}) {
  const [formData, setFormData] = useState({
    name: item.name || "",
    description: item.description || "",
    price: item.price || "0.00",
    categories: item.categories || [],
    image_url: item.image_url || "",
    shop_id: item.shop_id || "0",
    file: null,
    discount_type: item.discount_type || "No Discount",
    discount_reason: item.discount_reason || "",
    discount_percent: item.discount_percent || 0.0,
    discounted_price: item.discounted_price || 0.0,
    discount_expiration: item.discount_expiration?.split("T")[0] || null,
  });
  const { setLoading } = useContext(appContext);
  const [showModel, setShowModel] = useState(false);

  const [image, setImage] = useState(item.image_url || "/default-product.png");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setFormData((prevData) => ({
          ...prevData,
          profile_image: reader.result,
          file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddCategory = (e) => {
    if (e.target.value === "newCategory") {
      setShowModel(true);
    } else {
      const found = formData.categories.find((c) => c.value == e.target.value);
      if (!found) {
        const category = categories.find((c) => c.value == e.target.value);

        setFormData({
          ...formData,
          categories: [...formData.categories, category],
        });
      }
    }
    // e.target.value = ""; // Clear the input after adding a category
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(
        (category) => category.value !== categoryToRemove.value
      ),
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSubmit(formData);
  };

  const handleClose = () => {
    setShowModel(false);
  };

  const createCategory = async (data) => {
    try {
      data.shop_id = parseInt(data.shop_id);
      if (!data.shop_id) {
        throw new Error("Invalid shop!");
      }
      setLoading(true);
      const res = await httpPost("/api/categories", data);
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      showModel(false);
    } catch (err) {
      setLoading(false);
    }
  };

  return (
    <div className="w-full mx-auto mt-5 p-6 bg-white shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex space-x-6">
          <div className="relative">
            <img
              onClick={() => {
                document.getElementById("image").click();
              }}
              src={image}
              alt="Item Image"
              className=" h-48 w-48 rounded-3xl border-2 cursor-pointer transition hover:border-white hover:outline-none hover:ring-2 hover:ring-c4c4c4"
            />
            <input
              id="image"
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            {/* <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1 rounded-full cursor-pointer hover:bg-blue-600 w-8 h-8 flex justify-center items-center">
              <input
                id="image"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
              <svg
                style={{ width: "1rem" }}
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20.952 3.04794C20.281 2.37696 19.3709 2 18.422 2C17.4731 2 16.563 2.37696 15.892 3.04794L3.94 14.9999C3.53379 15.4062 3.2482 15.9171 3.115 16.4759L2.02 21.0779C1.99035 21.2026 1.99313 21.3328 2.02807 21.456C2.06301 21.5793 2.12896 21.6916 2.21961 21.7821C2.31025 21.8727 2.42259 21.9385 2.5459 21.9733C2.66921 22.0081 2.79938 22.0107 2.924 21.9809L7.525 20.8849C8.08418 20.7519 8.59548 20.4663 9.002 20.0599L20.952 8.10994C21.623 7.43894 21.9999 6.52887 21.9999 5.57994C21.9999 4.63101 21.623 3.72095 20.952 3.04994V3.04794ZM16.952 4.10794C17.145 3.9149 17.3742 3.76177 17.6264 3.6573C17.8787 3.55282 18.149 3.49905 18.422 3.49905C18.695 3.49905 18.9653 3.55282 19.2176 3.6573C19.4698 3.76177 19.699 3.9149 19.892 4.10794C20.085 4.30099 20.2382 4.53016 20.3426 4.78239C20.4471 5.03461 20.5009 5.30494 20.5009 5.57794C20.5009 5.85095 20.4471 6.12128 20.3426 6.3735C20.2382 6.62572 20.085 6.8549 19.892 7.04794L19 7.93894L16.06 4.99994L16.952 4.10894V4.10794ZM15 6.06194L17.94 8.99994L7.94 18.9999C7.73 19.2099 7.466 19.3569 7.177 19.4259L3.761 20.2399L4.574 16.8239C4.643 16.5339 4.791 16.2699 5.001 16.0599L15 6.05994V6.06194Z"
                  fill="white"
                />
              </svg>
            </label> */}
          </div>
        </div>
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
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="description"
              name="description"
              cols="30"
              rows="10"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              onBlur={(e) =>
                setFormData({
                  ...formData,
                  price: money.format(e.target.value),
                })
              }
              className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="price"
              type="text"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
            />
          </div>
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="shop_id"
            >
              Shop
            </label>
            <select
              className="w-full p-2 border rounded-lg"
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

        <div className="flex flex-col space-y-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Categories
          </label>
          <div className="flex flex-wrap items-center border border-gray-300 rounded-lg p-2">
            {formData.categories.map((category, index) => (
              <div
                key={index}
                className="flex items-center bg-blue-500 text-white text-xs px-2 py-1 rounded-full mr-2 mb-2"
              >
                {category.label}
                <button
                  type="button"
                  onClick={() => handleRemoveCategory(category)}
                  className="bg-white text-blue-500 ml-2 rounded-full p-1 px-2 focus:outline-none"
                >
                  &times;
                </button>
              </div>
            ))}
            <select
              className="flex-1 border-0 focus:ring-0 rounded-lg outline-none h-full"
              onChange={handleAddCategory}
              value=""
            >
              <option value="" disabled>
                Add a category
              </option>
              {categories.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
              <option value="newCategory">Add New Category...</option>
            </select>
          </div>
        </div>
        <div className="flex-1">
          <label
            className="block text-gray-700 text-sm font-bold mb-2"
            htmlFor="discount_type"
          >
            Discount Type
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            id="discount_type"
            name="discount_type"
            value={formData.discount_type}
            onChange={handleChange}
            required
          >
            {discount_types.map((discount_type) => (
              <option key={discount_type.label} value={discount_type.label}>
                {discount_type.label}
              </option>
            ))}
          </select>
        </div>
        {formData.discount_type === "Discount by Specific Percentage" && (
          <div>
            <div className="flex space-x-6">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="discount_percent"
                >
                  Discount Percent
                </label>
                <input
                  onBlur={(e) =>
                    setFormData({
                      ...formData,
                      discount_percent: money.format(e.target.value),
                    })
                  }
                  className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
                  id="discount_percent"
                  type="text"
                  name="discount_percent"
                  value={formData.discount_percent}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="flex space-x-6">
              <div className="flex-1">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="discount_expiration"
                >
                  Discount Expire Date
                </label>
                <input
                  className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
                  id="discount_expiration"
                  type="date"
                  name="discount_expiration"
                  value={formData.discount_expiration}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        )}
        {formData.discount_type === "Discount by Specific Amount" && (
          <div className="flex space-x-6">
            <div className="flex-1">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="discounted_price"
              >
                Discounted Price
              </label>
              <input
                onBlur={(e) =>
                  setFormData({
                    ...formData,
                    discounted_price: money.format(e.target.value),
                  })
                }
                className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
                id="discounted_price"
                type="text"
                name="discounted_price"
                value={formData.discounted_price}
                onChange={handleChange}
              />
            </div>
          </div>
        )}
        {formData.discount_type !== "No Discount" && (
          <div className="flex space-x-6">
            <div className="flex-1">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="discount_reason"
              >
                Discount Reason
              </label>
              <input
                className="w-full p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
                id="discount_reason"
                type="text"
                name="discount_reason"
                value={formData.discount_reason}
                onChange={handleChange}
              />
            </div>
          </div>
        )}

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
            {item.id ? "Update" : "Create"}
          </button>
        </div>
      </form>
      <CustomModal showModel={showModel} handleClose={handleClose}>
        <CategoryForm
          shops={shops}
          onSubmit={createCategory}
          onBackClick={handleClose}
        />
      </CustomModal>
    </div>
  );
}

export default ItemForm;
