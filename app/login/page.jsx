"use client";
import { httpPost } from "@/utils/rest-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("User@123");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    // if (token) {
    //   router.push("/dashboard");
    // }
  }, [router]);

  const handleLogin = async () => {
    try {
      const res = await httpPost("/api/auth/login", {
        username,
        password,
      });
      // if (res.data.role != "Admin") {
      //   return Swal.fire({
      //     // icon: "error",
      //     title: "Unauthorized Access",
      //     text: "You do not have the necessary permissions to access this resource. Only administrators are allowed. If you believe this is an error, please contact the system administrator.",
      //     showConfirmButton: false,
      //     timer: 5000,
      //   });
      // }

      if (res.data.returncode === "200") {
        localStorage.setItem("token", res.data.token);
        setErrorMessage(null);
        router.push("/dashboard");
      }
    } catch (err) {
      if (err.response) {
        setErrorMessage(err.response.data.message);
      } else {
        setErrorMessage(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div
        className="p-8 bg-white shadow-lg rounded-lg"
        style={{ minWidth: "18rem" }}
      >
        <h1 className="text-2xl font-bold mb-4">Admin Portal</h1>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-600 mb-2"
            htmlFor="username"
          >
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text"
            id="username"
            name="username"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-600 mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            id="password"
            name="password"
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <button
          onClick={handleLogin}
          className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login
        </button>

        {errorMessage && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md">
            {errorMessage}
          </div>
        )}
      </div>
    </div>
  );
}
