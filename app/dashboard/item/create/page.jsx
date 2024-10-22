"use client";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpPost, uploadFile } from "@/utils/rest-client";
import { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import { getShops } from "@/services/shop";
import { getDiscountTypes } from "@/services/discounttype";
import { appContext } from "@/providers/AppProvider";
import { itemContext } from "@/providers/ItemProvider";
import { getCategories } from "@/services/category";
import ItemForm from "@/components/ItemForm";
import money from "mm-money";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Item", href: "/dashboard/item" },
  { label: "Item Form" },
];

export default function ItemCreateForm() {
  const { setLoading } = useContext(appContext);
  const router = useRouter();
  const {
    shops,
    setShops,
    categories,
    setCategories,
    discount_types,
    setDiscount_types,
  } = useContext(itemContext);

  useEffect(() => {
    // const token = localStorage.getItem("cupidcash_token");
    // if (!token) {
    //   router.push("/login");
    // }
    setLoading(true);
    Promise.all([getShops(), getCategories(), getDiscountTypes()])
      .then(([shopRes, categoryRes, discountTypeRes]) => {
        setLoading(false);
        setShops(
          shopRes.data.data.map((s) => ({ value: s.id, label: s.name }))
        );
        setCategories(
          categoryRes.data.data.map((c) => ({ value: c.id, label: c.name }))
        );
        setDiscount_types(
          discountTypeRes.data.data.map((d) => ({
            value: d.id,
            label: d.description,
          }))
        );
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [router]);

  const createItem = async (data) => {
    try {
      console.log(data);
      let res = null;

      data.shop_id = parseInt(data.shop_id);
      data.price = money.parseNumber(
        data.price.toString().replaceAll("[a-zA-Z]+", "")
      );
      data.discount_percent = money.parseNumber(
        data.discount_percent.toString().replaceAll("[a-zA-Z]+", "")
      );
      data.discounted_price = money.parseNumber(
        data.discounted_price.toString().replaceAll("[a-zA-Z]+", "")
      );
      if (data.discount_expiration)
        data.discount_expiration =
          data.discount_expiration.split("T")[0] + "T23:59:59";
      if (!data.shop_id) {
        throw new Error("Invalid shop!");
      }

      setLoading(true);
      if (data.file) {
        res = await uploadFile(
          "/api/image/upload?resolution=800x800",
          data.file
        );
        data.image_url = res.data.url;
      }
      delete data.file;

      res = await httpPost("/api/items", {
        ...data,
        categories: data.categories.map((c) => parseInt(c.value)),
      });
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/item");
    } catch (err) {
      if (data.discount_expiration)
        data.discount_expiration = data.discount_expiration.split("T")[0];
      setLoading(false);
      handleError(err, router);
    }
  };

  const handleBackClick = () => {
    router.back();
  };

  return (
    <div className="px-2 pr-6 pb-6 overflow-hidden">
      <div className="flex-grow bg-gray-100 pt-8 mb-6"></div>
      <ItemForm
        categories={categories}
        shops={shops}
        discount_types={discount_types}
        onSubmit={createItem}
        onBackClick={handleBackClick}
      />
    </div>
  );
}
