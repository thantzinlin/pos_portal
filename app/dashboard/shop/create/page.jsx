"use client";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpPost } from "@/utils/rest-client";
import { useContext, useEffect } from "react";
import ShopForm from "@/components/ShopForm";
import { shopContext } from "@/providers/ShopProvider";
import { appContext } from "@/providers/AppProvider";
import Swal from "sweetalert2";
const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Shop", href: "/dashboard/shop" },
  { label: "Shop Form" },
];

export default function ShopCreateForm() {
  const { setLoading } = useContext(appContext);
  const router = useRouter();
  const { shops, setShops } = useContext(shopContext);

  const createShop = async (data) => {
    try {
      data.shop_id = parseInt(data.shop_id);
      setLoading(true);
      const res = await httpPost("/api/shops", data);
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/shop");
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
      <ShopForm
        shops={shops}
        onSubmit={createShop}
        onBackClick={handleBackClick}
      />
    </div>
  );
}
