"use client";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpPost } from "@/utils/rest-client";
import { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import IngredientForm from "@/components/IngredientForm";
import { getShops } from "@/services/shop";
import { ingredientContext } from "@/providers/IngredientProvider";
import { appContext } from "@/providers/AppProvider";
import money from "mm-money";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Ingredient", href: "/dashboard/ingredient" },
  { label: "Ingredient Form" },
];

export default function IngredientCreateForm() {
  const { setLoading } = useContext(appContext);
  const router = useRouter();
  const { shops, setShops } = useContext(ingredientContext);

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

  const createIngredient = async (data) => {
    try {
      data.shop_id = parseInt(data.shop_id);
      data.stock_quantity = money.parseNumber(
        data.stock_quantity.toString().replaceAll("[a-zA-Z]+", "")
      );
      data.reorder_level = money.parseNumber(
        data.reorder_level.toString().replaceAll("[a-zA-Z]+", "")
      );
      if (!data.shop_id) {
        throw new Error("Invalid shop!");
      }
      setLoading(true);
      const res = await httpPost("/api/ingredients", data);
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
      <IngredientForm
        shops={shops}
        onSubmit={createIngredient}
        onBackClick={handleBackClick}
      />
    </div>
  );
}
