"use client";

import LoadingBar from "@/components/LoadingBar";

import Sidebar from "@/components/Sidebar";
import { socketio_domain } from "@/constants";
import { appContext } from "@/providers/AppProvider";
import { notificationContext } from "@/providers/NotificationProvider";
import { useContext, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { handleError } from "@/utils/rest-client";
import { io } from "socket.io-client";
import "react-toastify/dist/ReactToastify.css";
import { getOrderDetails } from "@/services/order";
import { useRouter } from "next/navigation";
import NavBar from "@/components/NavBar";
import Breadcrumb from "@/components/Breadcrumb";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const { loading } = useContext(appContext);
  const { orderId, setOrderId } = useContext(notificationContext);
  // useEffect(() => {
  //   const socket = io(socketio_domain);

  //   socket.on("connect", () => {
  //     console.log("SocketIO connection established.");
  //     console.log(`socket_id: ${socket.id}`);
  //     const token = localStorage.getItem("cupidcash_token");
  //     socket.emit("join", { token });
  //     socket.on("new-order", (data) => {
  //       setOrderId(data.order_id);

  //       getOrderDetails(data.order_id)
  //         .then((res) => {
  //           if (res.data.code != 200) {
  //             return Swal.fire({
  //               title: "",
  //               text: res.data.message || "Something went wrong!",
  //               showConfirmButton: false,
  //               timer: 5000,
  //             });
  //           }
  //           const noti =
  //             "Order #" +
  //             res.data.data.id +
  //             ", placed by Waiter " +
  //             res.data.data.waiter_name +
  //             " for Table " +
  //             res.data.data.table_number +
  //             " received";
  //           toast.success(noti, {
  //             position: "top-right",
  //             autoClose: 5000,
  //             hideProgressBar: false,
  //             closeOnClick: true,
  //             pauseOnHover: true,
  //             draggable: true,
  //             progress: undefined,
  //             theme: "light",
  //             onClick: () => {
  //               router.push("/dashboard/payment");
  //             },
  //           });
  //         })
  //         .catch((err) => handleError(err));
  //     });
  //   });
  //   return () => {
  //     socket.off("new-order");
  //     socket.disconnect();
  //   };
  // }, []);

  const keyDownSearchModal = (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key == "k") {
      // event.preventDefault();
      my_modal_1.showModal();
    }
  };

  return (
    <>
      {loading ? <LoadingBar /> : null}
      <div
        className="w-full"
        style={{ height: "100%" }}
        onKeyDown={keyDownSearchModal}
      >
        <div className="flex " style={{ height: "100%" }}>
          <div className="hidden-print sidebar-div z-50">
            <Sidebar router={router} />
          </div>
          <div className="w-full pl-16">
            <div className="w-full">
              <NavBar />
            </div>
            <div
              className="flex-grow bg-gray-100 h-full w-full "
              style={{
                height: "calc(100% - 66px)",
                padding: "2%",
                backgroundColor: "var(--primary-color)",
              }}
            >
              {children}
            </div>
          </div>
          {/* Same as */}
          <ToastContainer />
        </div>
      </div>
    </>
  );
}
