"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpGet, httpPut } from "@/utils/rest-client";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import ShopForm from "@/components/ShopForm";
import { shopContext } from "@/providers/ShopProvider";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";

export default function ShopEditForm() {
  const { setLoading } = useContext(appContext);
  const { shops, setShops } = useContext(shopContext);
  const params = useSearchParams();
  console.log(params);
  const [shop, setShop] = useState({});
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Shop", href: "/dashboard/shop" },
    { label: params.get("shop_id") },
  ];
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getShops()
      .then((res) => {
        setShops(res.data.data.map((s) => ({ value: s.id, label: s.name })));
        httpGet(`/api/shops/${params.get("shop_id")}`)
          .then((res) => {
            setLoading(false);
            res.data.data.shop_id = res.data.data.shop_id + "";
            setShop(res.data.data);
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
  }, [router, params.get("shop_id")]);

  const updateShop = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      data.shop_id = parseInt(data.shop_id);
      const res = await httpPut(`/api/shops/${params.get("shop_id")}`, data);
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
      <div className="flex-grow bg-gray-100 pt-8 mb-6">
        <Breadcrumb items={breadcrumbItems} />
      </div>
      {Object.keys(shop).length ? (
        <ShopForm
          shops={shops}
          onSubmit={updateShop}
          onBackClick={handleBackClick}
          shop={{ ...shop }}
        />
      ) : null}
    </div>
  );
}
