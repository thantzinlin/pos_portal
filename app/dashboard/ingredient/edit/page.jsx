"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpGet, httpPut } from "@/utils/rest-client";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import IngredientForm from "@/components/IngredientForm";
import { ingredientContext } from "@/providers/IngredientProvider";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";
import money from "mm-money";

export default function IngredientEditForm() {
  const { setLoading } = useContext(appContext);
  const { shops, setShops } = useContext(ingredientContext);
  const params = useSearchParams();
  const [ingredient, setIngredient] = useState({});
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Ingredient", href: "/dashboard/ingredient" },
    { label: params.get("ingredient_id") },
  ];
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    getShops()
      .then((res) => {
        setShops(res.data.data.map((s) => ({ value: s.id, label: s.name })));
        httpGet(`/api/ingredients/${params.get("ingredient_id")}`)
          .then((res) => {
            setLoading(false);
            res.data.data.shop_id = res.data.data.shop_id + "";
            setIngredient(res.data.data);
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
  }, [router, params.get("ingredient_id")]);

  const updateIngredient = async (data) => {
    try {
      setLoading(true);
      console.log(data);
      data.shop_id = parseInt(data.shop_id);
      data.stock_quantity = money.parseNumber(
        data.stock_quantity.toString().replaceAll("[a-zA-Z]+", "")
      );
      data.reorder_level = money.parseNumber(
        data.reorder_level.toString().replaceAll("[a-zA-Z]+", "")
      );
      const res = await httpPut(
        `/api/ingredients/${params.get("ingredient_id")}`,
        data
      );
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/ingredient");
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
      {Object.keys(ingredient).length ? (
        <IngredientForm
          shops={shops}
          onSubmit={updateIngredient}
          onBackClick={handleBackClick}
          ingredient={{ ...ingredient }}
        />
      ) : null}
    </div>
  );
}
