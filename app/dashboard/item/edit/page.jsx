"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpGet, httpPut, uploadFile } from "@/utils/rest-client";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getDiscountTypes } from "@/services/discounttype";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";
import { itemContext } from "@/providers/ItemProvider";
import { getCategories } from "@/services/category";
import ItemForm from "@/components/ItemForm";
import money from "mm-money";
import { server_domain } from "@/constants";

export default function CategoryEditForm() {
  const { setLoading } = useContext(appContext);
  const { shops, setShops, categories, setCategories, discount_types, setDiscount_types } =
    useContext(itemContext);
  const params = useSearchParams();

  const [item, setItem] = useState({});
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Item", href: "/dashboard/item" },
    { label: params.get("item_id") },
  ];
  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("watchwonder_token");
    // if (!token) {
    //   router.push("/login");
    // }
    setLoading(true);
    Promise.all([getShops(), getCategories(), getDiscountTypes()])
      .then(([shopRes, categoryRes, discountTypeRes]) => {
        setShops(
          shopRes.data.data.map((s) => ({ value: s.id, label: s.name }))
        );
        const categoryList = categoryRes.data.data.map((c) => ({
          value: c.id,
          label: c.name,
        }));
        setCategories(categoryList);
        setDiscount_types(discountTypeRes.data.data.map((d) => ({
          value: d.id,
          label: d.description,
        })));
        httpGet(`/api/items/${params.get("item_id")}`)
          .then((res) => {
            setLoading(false);
            if (res.data.data.image_url) {
              res.data.data.image_url = `${server_domain}${res.data.data.image_url}`;
            }
            res.data.data.shop_id = res.data.data.shop_id + "";
            res.data.data.categories = res.data.data.categories.map((c) =>
              categoryList.find((cat) => c.id == cat.value)
            );
            res.data.data.price = money.format(res.data.data.price);
            res.data.data.discount_percent = money.format(res.data.data.discount_percent);
            res.data.data.discounted_price = money.format(res.data.data.discounted_price);
            setItem(res.data.data);
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
  }, [router, params.get("item_id")]);

  const updateItem = async (data) => {
    try {
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
        data.discount_expiration = data.discount_expiration.split("T")[0] + "T23:59:59";
      if (!data.shop_id) {
        throw new Error("Invalid shop!");
      }

      setLoading(true);
      let res = null;
      if (data.file) {
        res = await uploadFile(
          "/api/image/upload?resolution=800x800",
          data.file
        );
        data.image_url = res.data.url;
      }
      delete data.file;
      if (data.image_url) {
        data.image_url = data.image_url.replace(server_domain, "");
      }

      res = await httpPut(`/api/items/${params.get("item_id")}`, {
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
      setLoading(false);
      if (data.discount_expiration)
        data.discount_expiration = data.discount_expiration.split("T")[0];
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
      {Object.keys(item).length ? (
        <ItemForm
          categories={categories}
          shops={shops}
          discount_types={discount_types}
          onSubmit={updateItem}
          onBackClick={handleBackClick}
          item={{ ...item }}
        />
      ) : null}
    </div>
  );
}
