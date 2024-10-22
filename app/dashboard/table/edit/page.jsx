"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpGet, httpPut } from "@/utils/rest-client";
import { useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";
import TableForm from "@/components/TableForm";
import { tableContext } from "@/providers/TableProvider";
import { getShops } from "@/services/shop";
import { appContext } from "@/providers/AppProvider";

export default function TableEditForm() {
  const { setLoading } = useContext(appContext);
  const { shops, setShops } = useContext(tableContext);
  const params = useSearchParams();
  const [table, setTable] = useState({});
  const breadcrumbItems = [
    { label: "Home", href: "/dashboard" },
    { label: "Table", href: "/dashboard/table" },
    { label: params.get("table_id") },
  ];
  const router = useRouter();

  useEffect(() => {
    // const token = localStorage.getItem("watchwonder_token");
    // if (!token) {
    //   router.push("/login");
    // }
    setLoading(true);
    getShops()
      .then((res) => {
        setShops(res.data.data.map((s) => ({ value: s.id, label: s.name })));
        httpGet(`/api/tables/${params.get("table_id")}`)
          .then((res) => {
            setLoading(false);
            res.data.data.shop_id = res.data.data.shop_id + "";
            setTable(res.data.data);
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
  }, [router, params.get("table_id")]);

  const updateTable = async (data) => {
    try {
      setLoading(true);
      data.shop_id = parseInt(data.shop_id);
      const res = await httpPut(`/api/tables/${params.get("table_id")}`, data);
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      router.push("/dashboard/table");
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
      {Object.keys(table).length ? (
        <TableForm
          shopId={0}
          shops={shops}
          onSubmit={updateTable}
          onBackClick={handleBackClick}
          table={{ ...table }}
        />
      ) : null}
    </div>
  );
}
