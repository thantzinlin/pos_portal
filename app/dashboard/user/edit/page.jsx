"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpGet, httpPut } from "@/utils/rest-client";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";
import { userContext } from "@/providers/UserProvider";
import { getRoles } from "@/services/role";
import UserForm from "@/components/UserForm";

export default function UserEditForm() {
  const { setLoading } = useContext(appContext);
  const { shops, setShops, roles, setRoles } = useContext(userContext);
  const params = useSearchParams();
  const [user, setUser] = useState({});
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "User", href: "/dashboard/user" },
    { label: params.get("user_id") },
  ];
  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("watchwonder_token");
    // if (!token) {
    //   router.push("/login");
    // }
    setLoading(true);
    Promise.all([getShops(), getRoles()])
      .then(([shopsRes, rolesRes]) => {
        setShops(
          shopsRes.data.data.map((s) => ({ value: s.id, label: s.name }))
        );
        setRoles(
          rolesRes.data.data.map((r) => ({ value: r.id, label: r.role_name }))
        );
        httpGet(`/api/users/${params.get("user_id")}`)
          .then((res) => {
            setLoading(false);
            res.data.data.shop_id = res.data.data.shop_id + "";
            res.data.data.role_id = res.data.data.role_id + "";
            setUser(res.data.data);
          })
          .catch((err) => {
            setLoading(false);
            handleError(err, router);
          });
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [router, params.get("user_id")]);

  const updateUser = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      data.shop_id = parseInt(data.shop_id);
      data.role_id = parseInt(data.role_id);
      const res = await httpPut(`/api/users/${params.get("user_id")}`, data);
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
      {Object.keys(user).length ? (
        <UserForm
          roles={roles}
          shops={shops}
          onSubmit={updateUser}
          onBackClick={handleBackClick}
          user={{ ...user }}
        />
      ) : null}
    </div>
  );
}
