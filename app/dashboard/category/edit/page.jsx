"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpGet, httpPut } from "@/utils/rest-client";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import CategoryForm from "@/components/CategoryForm";
import { categoryContext } from "@/providers/CategoryProvider";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";

export default function CategoryEditForm() {
  const { setLoading } = useContext(appContext);
  const { shops, setShops } = useContext(categoryContext);
  const params = useSearchParams();
  console.log(params);
  const [category, setCategory] = useState({});
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Category", href: "/dashboard/category" },
    { label: params.get("category_id") },
  ];
  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("watchwonder_token");
    // if (!token) {
    //   router.push("/login");
    // }
    setLoading(true);
    console.log("categoryid : " + params.get("category_id"));

    getCategories()
      .then((res) => {
        //  setShops(res.data.data.map((s) => ({ value: s.id, label: s.name })));
        httpGet(`/api/categories/${params.get("category_id")}`)
          .then((res) => {
            setLoading(false);
            //  res.data.data.shop_id = res.data.data.shop_id + "";
            //setCategory(res.data.data);
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
  }, [router, params.get("category_id")]);

  const updateCategory = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      // data.shop_id = parseInt(data.shop_id);
      const res = await httpPut(
        `/api/categories/${params.get("category_id")}`,
        data
      );
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/category");
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
      {Object.keys(category).length ? (
        <CategoryForm
          shops={shops}
          onSubmit={updateCategory}
          onBackClick={handleBackClick}
          category={{ ...category }}
        />
      ) : null}
    </div>
  );
}
