"use client";
import Breadcrumb from "@/components/Breadcrumb";
import OrderCard from "@/components/OrderCard";
import { server_domain } from "@/constants";
import { getOrderDetails, getOrders } from "@/services/order";
import { handleError, httpPut } from "@/utils/rest-client";
import { useRouter } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import money from "mm-money";
import { paymentContext } from "@/providers/PaymentProvider";
import { appContext } from "@/providers/AppProvider";
import { notificationContext } from "@/providers/NotificationProvider";
import { ToastContainer, toast } from "react-toastify";
import Link from "next/link";
import Swal from "sweetalert2";
import moment from "moment";
import { invoke } from "@tauri-apps/api/tauri";
import { navContext } from "@/providers/navProvider";
import ReceiptView from "@/components/ReceiptView";
const breadcrumbItems = [
  { label: "Home", href: "/dashboard" },
  { label: "Payment" },
];

export default function Payment() {
  const [tax, setTax] = useState("0.00");
  const [discount, setDiscount] = useState("0.00");
  const { orderId } = useContext(notificationContext);
  const router = useRouter();
  const { setLoading } = useContext(appContext);
  const [slideAnimation, setSlideAnimation] = useState(
    "slideOut 0.5s ease-in-out forwards"
  );
  const {
    orders,
    setOrders,
    order,
    setOrder,
    subTotal,
    setSubTotal,
    search,
    setSearch,
    selectedOrder,
    setSelectedOrder,
  } = useContext(paymentContext);

  useEffect(() => {
    if (selectedOrder != 0) {
      setSlideAnimation("slideIn 0.3s ease-in-out forwards");
    } else {
      setSlideAnimation("slideOut 0.5s ease-in-out forwards");
    }
  }, [selectedOrder]);

  useEffect(() => {
    if (selectedOrder) {
      getOrderDetails(selectedOrder)
        .then((res) => {
          if (res.data.code != 200) {
            return Swal.fire({
              title: "",
              text: res.data.message || "Something went wrong!",
              showConfirmButton: false,
              timer: 5000,
            });
          }

          setOrder(res.data.data);
          let total = 0;
          let discountTotal = 0;
          for (const item of res.data.data.items) {
            total += item.original_price * item.quantity;
            discountTotal += (item.original_price - item.price) * item.quantity;
          }
          setDiscount(discountTotal);
          setSubTotal(total);
        })
        .catch((err) => handleError(err, router));
    }
    fetchData();
  }, [selectedOrder, search, router, orderId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      let status = "Pending";
      const res = await getOrders({ search, status });
      setLoading(false);
      if (res.data.code !== 200) {
        return Swal.fire({
          title: "",
          text: res.data.message || "Something went wrong!",
          showConfirmButton: false,
          timer: 5000,
        });
      }

      setOrders(res.data.data);
      // if (res.data.data.length) {
      //   setSelectedOrder(res.data.data[0]);
      // }
    } catch (err) {
      setLoading(false);
      handleError(err, router);
    }
  };

  const changeStatus = async (order_id) => {
    let data = {
      status: "Completed",
      tax: money.parseNumber(tax),
      discount: money.parseNumber(discount),
    };
    try {
      setLoading(true);
      const res = await httpPut(`/api/orders/${order_id}`, data);
      setLoading(false);
      Swal.fire({
        icon: "success",
        text: res.data.message,
        showConfirmButton: false,
        timer: 5000,
      });
      fetchData();
      setSelectedOrder(0);
    } catch (err) {
      setLoading(false);
      handleError(err, router);
    }
  };

  const handlePrint = () => {
    window.print();
    // invoke("print_receipt", { data: "Text to print" })
    //   .then(() => console.log("Printing successful"))
    //   .catch((err) => console.error("Printing failed:", err));
  };

  return (
    <>
      <div className="flex">
        <div
          className="flex-grow hidden-print"
          style={{ paddingRight: selectedOrder == 0 ? 0 : "24rem" }}
        >
          <div className="flex-grow overflow-auto">
            <div className="m-4">
              <div className="mb-4 flex justify-end">
                <Link href="/dashboard/paymentHistory">
                  <button className="view-history text-white font-bold py-2 px-4 rounded">
                    VIEW PAYMENT HISTORY
                  </button>
                </Link>
              </div>

              {/* Search bar */}
              <div className="mb-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Type to search..."
                  className="w-full p-4 rounded-md border transition focus"
                />
              </div>

              {/* Card grid */}
              <div className="bg-transparent w-full py-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 ">
                {/* Repeat this div for each card, use a map function for real data */}
                {orders.map((order) => (
                  <OrderCard
                    key={order.id}
                    id={order.id}
                    tableNumber={order.table_number}
                    waiterName={order.waiter_name}
                    isActive={selectedOrder == order.id}
                    onClick={() => {
                      setSelectedOrder(order.id);
                    }}
                  />
                ))}
                {/* <div className="bg-white rounded-md shadow p-4">
              <p>DN-0012A</p>
              <p>A10 - 1st Floor</p>
              <p>Difana Wilson</p>
            </div> */}
                {/* ... other cards */}
              </div>
            </div>
          </div>
        </div>

        {/* Right section */}
        <div
          className="w-96  text-black fixed top-0 bottom-0 right-0 flex flex-col"
          style={{
            width: selectedOrder == 0 ? 0 : "24rem",
            maxWidth: selectedOrder == 0 ? 0 : "24rem",
            padding: selectedOrder == 0 ? 0 : "0.75rem 0",
            opacity: selectedOrder == 0 ? 0 : 1,
            animation: slideAnimation,
            transition: "all 0.3s",
            marginTop: "4.2rem",
            backgroundColor: "var(--secondary-color)",
          }}
        >
          <div className="flex">
            <div
              className="absolute left-[-3%] pt-1%  p-1  shadow-md skeleton close-sidebar"
              onClick={() => {
                setSelectedOrder(0);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18L15 12L9 6"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {/* Display order information */}
            <div className="px-8">
              <h3 className="text-lg font-bold">#{order.id}</h3>
              <p>Waiter: {order.waiter_name}</p>
              <p>Table: {order.table_number}</p>
              <p>
                Time: {moment(order.created_at).format("DD/MM/YYYY hh:mm A")}
              </p>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pl-8 custom-scrollbar">
            {/* Loop over items array */}
            {order.items.map((item, index) => (
              <div key={index} className="mb-4 flex">
                <img
                  src={server_domain + item.image_url}
                  alt={item.item_name}
                  className="h-20 w-20 rounded-full text-center overflow-hidden"
                />
                <div className="px-4 flex flex-col justify-between leading-normal">
                  <h5 className="text-md font-bold">{item.item_name}</h5>
                  {/* <p className="text-sm">{item.description}</p> */}
                  <p className="text-sm">Qty: {item.quantity}</p>
                  {item.special_instructions && (
                    <p className="text-sm">
                      Notes: {item.special_instructions}
                    </p>
                  )}
                  <p className="text-md">
                    {money.format(item.original_price)} Ks
                  </p>
                </div>
              </div>
            ))}
          </div>
          {/* Summary section */}
          <div className="px-8">
            <p className="mb-1">
              <span className="float-right">{money.format(subTotal)} Ks</span>
            </p>
            <div className="mb-1 flex" style={{ width: "100%" }}>
              <div style={{ width: "20%" }}>Discount</div>
              <div className="flex" style={{ width: "80%" }}>
                <input
                  onBlur={(e) => setDiscount(money.format(e.target.value))}
                  style={{ width: "100%" }}
                  type="text"
                  className="mr-1 border-transparent rounded-lg  text-right outline-none bg-transparent"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
                Ks
              </div>
            </div>
            <div className="flex" style={{ width: "100%" }}>
              <div style={{ width: "20%" }}>Tax</div>
              <div className="flex" style={{ width: "80%" }}>
                <input
                  onBlur={(e) => setTax(money.format(e.target.value))}
                  style={{ width: "100%" }}
                  type="text"
                  className="mr-1 border-transparent rounded-lg  text-right outline-none bg-transparent"
                  value={tax}
                  onChange={(e) => setTax(e.target.value)}
                />
                Ks
              </div>
            </div>
            <div className="mb-4">
              <p>
                Total
                <span className="float-right">
                  {money.format(money.sum([subTotal, `-${discount}`, tax]))} Ks
                </span>
              </p>
            </div>
            <div className="mb-4">
              <p>
                Payment Method <span className="float-right">Cash</span>
              </p>
            </div>
          </div>
          <div className="px-8">
            <button
              className="w-full view-history text-white font-bold py-2 px-4 rounded"
              onClick={() => {
                handlePrint(), changeStatus(order.id);
              }}
            >
              PRINT
            </button>
          </div>
        </div>
      </div>

      <ReceiptView
        order={order}
        subTotal={money.format(subTotal)}
        discount={discount}
        tax={tax}
        total={money.format(money.sum([subTotal, `-${discount}`, tax]))}
      />
    </>
  );
}
