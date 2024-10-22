"use client";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpPost } from "@/utils/rest-client";
import { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";
import { userContext } from "@/providers/UserProvider";
import { getRoles } from "@/services/role";
import UserForm from "@/components/UserForm";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "User", href: "/dashboard/user" },
  { label: "User Form" },
];

export default function UserCreateForm() {
  const { setLoading } = useContext(appContext);
  const router = useRouter();
  const { shops, setShops, roles, setRoles } = useContext(userContext);

  useEffect(() => {
    // const token = localStorage.getItem("cupidcash_token");
    // if (!token) {
    //   router.push("/login");
    // }
    setLoading(true);
    Promise.all([getShops(), getRoles()])
      .then(([shopsRes, rolesRes]) => {
        setLoading(false);
        setShops(
          shopsRes.data.data.map((s) => ({ value: s.id, label: s.name }))
        );
        setRoles(
          rolesRes.data.data.map((r) => ({ value: r.id, label: r.role_name }))
        );
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [router]);

  const createUser = async (data) => {
    try {
      data.shop_id = parseInt(data.shop_id);
      data.role_id = parseInt(data.role_id);

      if (!data.role_id) {
        throw new Error("Invalid role!");
      }
      if (!data.shop_id) {
        throw new Error("Invalid shop!");
      }
      setLoading(true);
      const res = await httpPost("/api/users", data);
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/user");
    } catch (err) {
      setLoading(false);
      handleError(err, router);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="px-2 pr-6 pb-6">
      <div className="flex-grow bg-gray-100 pt-8 mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      <UserForm
        shops={shops}
        roles={roles}
        onSubmit={createUser}
        onBackClick={handleBackClick}
      />
    </div>
  );
}
