"use client";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpPost } from "@/utils/rest-client";
import { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import CategoryForm from "@/components/CategoryForm";
import { getShops } from "@/services/shop";
import { categoryContext } from "@/providers/CategoryProvider";
import { appContext } from "@/providers/AppProvider";

export default function CategoryCreateForm() {
  const { setLoading } = useContext(appContext);
  const router = useRouter();
  const { shops, setShops } = useContext(categoryContext);

  useEffect(() => {
    setLoading(true);
    getShops()
      .then((res) => {
        setLoading(false);
        setShops(res.data.data.map((s) => ({ value: s.id, label: s.name })));
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [router]);

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
      <div className="flex-grow bg-gray-100 pt-8 mb-6"></div>
      <CategoryForm
        shops={shops}
        onSubmit={createCategory}
        onBackClick={handleBackClick}
      />
    </div>
  );
}
