"use client";
import { useRouter } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import { handleError, httpPost } from "@/utils/rest-client";
import { useContext, useEffect } from "react";
import Swal from "sweetalert2";
import TableForm from "@/components/TableForm";
import { getShops } from "@/services/shop";
import { tableContext } from "@/providers/TableProvider";
import { appContext } from "@/providers/AppProvider";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Table", href: "/dashboard/table" },
  { label: "Table Form" },
];

export default function TableCreateForm() {
  const { setLoading } = useContext(appContext);
  const router = useRouter();
  const { shops, setShops } = useContext(tableContext);

  useEffect(() => {
    // const token = localStorage.getItem("cupidcash_token");
    // if (!token) {
    //   router.push("/login");
    // }
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

  const createTable = async (data) => {
    try {
      data.shop_id = parseInt(data.shop_id);
      if (!data.shop_id) {
        throw new Error("Invalid shop!");
      }
      setLoading(true);
      const res = await httpPost("/api/tables", data);
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
      <TableForm
        shopId={0}
        shops={shops}
        onSubmit={createTable}
        onBackClick={handleBackClick}
      />
    </div>
  );
}
