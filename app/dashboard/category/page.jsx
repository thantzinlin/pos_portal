"use client";

import Breadcrumb from "@/components/Breadcrumb";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect } from "react";
import moment from "moment";
import Pagination from "@/components/Pagination";
import { handleError, httpDelete, httpGet } from "@/utils/rest-client";
import Swal from "sweetalert2";
import { categoryContext } from "@/providers/CategoryProvider";
import { appContext } from "@/providers/AppProvider";

export default function CategoriesList() {
  const { setLoading } = useContext(appContext);
  const {
    categories,
    setCategories,
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
  } = useContext(categoryContext);
  const router = useRouter();

  const fetchCategories = useCallback(() => {
    setLoading(true);
    httpGet("/api/categories", {
      params: {
        page,
        perPage,
        search,
      },
    })
      .then((res) => {
        setLoading(false);
        setTotal(res.data.total);
        setPageCounts(res.data.page_counts);
        setCategories(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [page, perPage, router, search]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
    fetchCategories();
  }, [page, perPage, search, router, fetchCategories]);

  const handleDelete = (category_id) => {
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
        httpDelete(`/api/categories/${category_id}`)
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
        <Link href="/dashboard/category/create">
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Create Category
          </button>
        </Link>
      </div>
      {/* Total Rows Section */}
      <div className="my-4">
        <span className="text-gray-600 font-medium">Total Categories: </span>
        <span className="text-black font-bold">{total}</span>
      </div>
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr className=" text-left">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Description</th>
            <th className="py-2 px-4 border-b">Time</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b">{category.name}</td>
              <td className="py-2 px-4 border-b">{category.description}</td>
              <td className="py-2 px-4 border-b">
                {moment(category.createdAt).format("DD/MM/YYYY hh:mm:ss A")}
              </td>
              <td className="py-2 px-4 border-b">
                <div className="flex">
                  <Link
                    className="text-blue-500 hover:underline flex-1"
                    href={`/dashboard/category/edit?category_id=${category._id}`}
                  >
                    Edit
                  </Link>
                  {/* Add delete functionality */}
                  <button
                    className="ml-2 text-red-500 hover:underline flex-1"
                    onClick={() => handleDelete(category.id)}
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
    </div>
  );
}
