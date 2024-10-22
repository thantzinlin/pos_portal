"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { handleError, httpGet, httpPut } from "@/utils/rest-client";
import { useCallback, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { ingredientContext } from "@/providers/IngredientProvider";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";
import money from "mm-money";
import PurchaseForm from "@/components/PurchaseForm";
import { categoryContext } from "@/providers/CategoryProvider";

export default function PurchaseEditForm() {
  const {
    ingredients,
    setIngredients,
    search,
    page,
    perPage,
    setPageCounts,
    setTotal,
  } = useContext(ingredientContext);
  const { shops, setShops } = useContext(categoryContext);
  const { setLoading } = useContext(appContext);
  const params = useSearchParams();
  const [purchase, setPurchase] = useState({});

  const router = useRouter();
  const fetchIngredients = useCallback(() => {
    setLoading(true);
    httpGet("/api/ingredients", {
      params: {
        page,
        per_page: perPage,
        search,
      },
    })
      .then((res) => {
        setLoading(false);
        setTotal(res.data.total);
        setPageCounts(res.data.page_counts);
        setIngredients(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [page, perPage, router, search]);

  useEffect(() => {
    setLoading(true);
    fetchIngredients();
    getShops()
      .then((res) => {
        setShops(res.data.data.map((s) => ({ value: s.id, label: s.name })));
        httpGet(`/api/purchases/${params.get("purchase_id")}`)
          .then((res) => {
            setLoading(false);
            setPurchase(res.data.data);
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
  }, [router, params.get("purchase_id")]);

  const updatePurchase = async (data) => {
    try {
      setLoading(true);
      console.log("Update Purchases", data);
      data.shop_id = parseInt(data.shop_id);

      const res = await httpPut(
        `/api/purchases/${params.get("purchase_id")}`,
        data
      );
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/purchase");
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
      {Object.keys(purchase).length ? (
        <PurchaseForm
          ingredients={ingredients}
          shops={shops}
          onSubmit={updatePurchase}
          onBackClick={handleBackClick}
          purchases={{ ...purchase }}
        />
      ) : null}
    </div>
  );
}
