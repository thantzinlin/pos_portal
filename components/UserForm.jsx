import { useState } from "react";

function UserForm({
  shops = [],
  user = {},
  roles = [],
  onSubmit,
  onBackClick,
}) {
  const [formData, setFormData] = useState({
    name: user.name || "",
    username: user.username || "",
    password: user.password || "",
    role_id: user.role_id || "0",
    shop_id: user.shop_id || "0",
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
              className="w-full p-2 border rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
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
              className="block text-gray-700 text-sm font-bold mb-2 "
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="w-full p-2 border rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="username"
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="w-full p-2 border rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="flex space-x-6">
          <div className="flex-1">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="role_id"
            >
              Role
            </label>
            <select
              className="w-full p-2 border rounded-lg select select-bordered focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="role_id"
              name="role_id"
              value={formData.role_id}
              onChange={handleChange}
              required
            >
              <option value="0">Select a Role</option>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
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
              className="w-full p-2 border rounded-lg select select-bordered focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
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
            {user.id ? "Update" : "Create"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm;
