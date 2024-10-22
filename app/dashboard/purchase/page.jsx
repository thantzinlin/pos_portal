"use client";

import CustomModal from "@/components/CutomModal";
import Pagination from "@/components/Pagination";
import PurchaseDetail from "@/components/PurchaseDetails";
import { appContext } from "@/providers/AppProvider";
import { purchaseContext } from "@/providers/PurchaseProvider";
import { handleError, httpDelete, httpGet } from "@/utils/rest-client";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import Swal from "sweetalert2";

export default function PurchaseList() {
  const { setLoading } = useContext(appContext);
  const {
    purchases,
    setPurchases,
    search,
    setSearch,
    page,
    setPage,
    perPage,
    setPerPage,
    pageCounts,
    setPageCounts,
    total,
    setTotal,
  } = useContext(purchaseContext);
  const [selectedPurchaseDetails, setSelectedPurchaseDetails] = useState(null);
  const router = useRouter();

  const fetchCategories = useCallback(() => {
    setLoading(true);
    httpGet("/api/purchases", {
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
        setPurchases(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
        console.log(err);
      });
  }, [page, perPage, router, search]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    fetchCategories();
  }, [page, perPage, search, router, fetchCategories]);

  const handleDelete = (purchase_id) => {
    Swal.fire({
      text: "Are you sure you want to delete?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#d1d5db",
      confirmButtonText: "Delete",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        httpDelete(`/api/purchases/${purchase_id}`)
          .then((res) => {
            setLoading(false);
            Swal.fire({
              text: res.data.message,
              icon: "success",
              showConfirmButton: false,
              timer: 5000,
            });
            fetchCategories();
          })
          .catch((err) => {
            setLoading(false);
            handleError(err, router);
          });
      }
    });
  };

  return (
    <div className="pr-6 pb-6">
      {/* Search Box */}
      <div className="flex mb-4 justify-between">
        <div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search categories..."
            className="p-2 rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
          />
        </div>
        {/* Create Category Button */}
        <Link href="/dashboard/purchase/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create Purchase
          </button>
        </Link>
      </div>
      {/* Total Rows Section */}
      <div className="my-4">
        <span className="text-gray-600 font-medium">Total Purchases: </span>
        <span className="text-black font-bold">{total}</span>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className=" text-left">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Total Cost</th>
            <th className="py-2 px-4 border-b">Purchase Date</th>
            <th className="py-2 px-4 border-b">Shop Id</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Purchase Details</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {purchases.map((purchase) => (
            <tr key={purchase.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{purchase.purchase_id}</td>
              <td className="py-2 px-4 border-b">{purchase.total_cost}</td>
              <td className="py-2 px-4 border-b">
                {moment(purchase.purchase_date).format("DD/MM/YYYY hh:mm:ss A")}
              </td>
              <td className="py-2 px-4 border-b">{purchase.shop_name}</td>
              <td className="py-2 px-4 border-b">
                {moment(purchase.created_at).format("DD/MM/YYYY hh:mm:ss A")}
              </td>
              <td className="py-2 px-4 border-b">
                <div
                  className="text-blue-500 hover:underline flex-1"
                  onClick={() => {
                    setSelectedPurchaseDetails(purchase.purchase_details);
                    document.getElementById("my_modal_2").showModal();
                  }}
                >
                  Details
                </div>
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex">
                  <Link
                    className="text-blue-500 hover:underline flex-1"
                    href={`/dashboard/purchase/edit?purchase_id=${purchase.purchase_id}`}
                  >
                    Edit
                  </Link>
                  {/* Add delete functionality */}
                  <button
                    className="ml-2 text-red-500 hover:underline flex-1"
                    onClick={() => handleDelete(purchase.purchase_id)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* Pagination Controls */}
      <Pagination
        page={page}
        pageCounts={pageCounts}
        onPageChange={setPage}
        perPage={perPage}
        onPerPageChange={(p) => {
          setPerPage(p);
          setPage(1);
        }}
      />

      <CustomModal>
        <PurchaseDetail details={selectedPurchaseDetails} />
      </CustomModal>
    </div>
  );
}
