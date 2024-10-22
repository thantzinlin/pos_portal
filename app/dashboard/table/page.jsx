"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";
import moment from "moment";
import Pagination from "@/components/Pagination";
import { handleError, httpDelete, httpGet } from "@/utils/rest-client";
import Swal from "sweetalert2";
import { tableContext } from "@/providers/TableProvider";
import { appContext } from "@/providers/AppProvider";
import { ToastContainer, toast } from "react-toastify";

const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Table" },
];

export default function TablesList() {
  const { setLoading } = useContext(appContext);
  const {
    tables,
    setTables,
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
  } = useContext(tableContext);
  const router = useRouter();

  const fetchTables = useCallback(() => {
    setLoading(true);
    httpGet("/api/tables", {
      params: {
        page,
        limit: perPage,
        search,
      },
    })
      .then((res) => {
        setLoading(false);
        setTotal(res.data.total);
        setPageCounts(res.data.pageCounts);
        setTables(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [page, perPage, router, search]);

  useEffect(() => {
    const token = localStorage.getItem("cupidcash_token");
    if (!token) {
      router.push("/login");
    }
    fetchTables();
  }, [page, perPage, search, router, fetchTables]);

  const handleDelete = (table_id) => {
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
        httpDelete(`/api/tables/${table_id}`)
          .then((res) => {
            setLoading(false);
            Swal.fire({
              text: res.data.message,
              icon: "success",
              showConfirmButton: false,
              timer: 5000,
            });
            fetchTables();
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
            placeholder="Search tables..."
            className="p-2 border rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
          />
        </div>
        {/* Create Table Button */}
        <Link href="/dashboard/table/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create Table
          </button>
        </Link>
      </div>
      {/* Total Rows Section */}
      <div className="my-4">
        <span className="text-gray-600 font-medium">Total Tables: </span>
        <span className="text-black font-bold">{total}</span>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className=" text-left">
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Table No</th>
            <th className="py-2 px-4 border-b">QR Code</th>
            <th className="py-2 px-4 border-b">Shop Name</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tables.map((table) => (
            <tr key={table.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{table.id}</td>
              <td className="py-2 px-4 border-b">{table.table_number}</td>
              <td className="py-2 px-4 border-b">{table.qr_code}</td>
              <td className="py-2 px-4 border-b">{table.shop_name}</td>
              <td className="py-2 px-4 border-b">
                {moment(table.created_at).format("DD/MM/YYYY hh:mm:ss A")}
              </td>
              <td className="py-2 px-4 border-b">
                <Link
                  className="text-blue-500 hover:underline"
                  href={`/dashboard/table/edit?table_id=${table.id}`}
                >
                  Edit
                </Link>
                {/* Add delete functionality */}
                <button
                  className="ml-2 text-red-500 hover:underline"
                  onClick={() => handleDelete(table.id)}
                >
                  Delete
                </button>
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
    </div>
  );
}
