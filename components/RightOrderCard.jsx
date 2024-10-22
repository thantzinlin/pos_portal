"use client";
import { useRouter } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { orderContext } from "@/providers/OrderProvider";
import { server_domain } from "@/constants";
import money from "mm-money";
import { appContext } from "@/providers/AppProvider";
import { tableContext } from "@/providers/TableProvider";
import { dashboardContext } from "@/providers/DashboardProvider";
import { getTables } from "@/services/table";
import Swal from "sweetalert2";
import { handleError, httpPost } from "@/utils/rest-client";
export default function RightOrderCard() {
  const router = useRouter();
  const [table_no, setTableNo] = useState("");
  const { setLoading } = useContext(appContext);
  const { selectItems, setSelectItems } = useContext(orderContext);
  const { search, setSearch } = useContext(dashboardContext);
  const [slideAnimation, setSlideAnimation] = useState(
    "slideOut 0.5s ease-in-out forwards"
  );
  const { tables, setTables } = useContext(tableContext);
  useEffect(() => {
    if (selectItems.length > 0) {
      setSlideAnimation("slideIn 0.3s ease-in-out forwards");
    } else {
      setSlideAnimation("slideOut 0.5s ease-in-out forwards");
    }
    loadTables({ search });
  }, [selectItems]);

  const handleQuantityChange = (itemId, newQuantity) => {
    // Filter out the item if the new quantity is 0
    if (newQuantity === 0) {
      handleRemoveItem(itemId);
    } else {
      // Update the quantity if it's greater than 0
      const updateItems = selectItems.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
      setSelectItems(updateItems);
    }
  };
  const handleRemoveItem = (itemId) => {
    const updateItems = selectItems.filter((item) => item.id !== itemId);
    setSelectItems(updateItems);
  };

  const calculateTotalPrice = () => {
    return selectItems.reduce(
      (total, selectedItem) =>
        total + selectedItem.quantity * selectedItem.price,
      0
    );
  };

  const loadTables = (search) => {
    setLoading(true);
    getTables(search)
      .then((res) => {
        setLoading(false);
        if (res.data.code != 200) {
          return Swal.fire({
            title: "",
            text: res.data.message || "Something went wrong!",
            showConfirmButton: false,
            timer: 5000,
          });
        }
        setTables(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  };

  const addOrders = async (data) => {
    try {
      setLoading(true);
      const res = await httpPost("/api/orders", data);
      setLoading(false);
      console.log(res.data.code, "res");
      if (res.data.code === 400) {
        Swal.fire({
          icon: "fail",
          text: res.data.message,
          showConfirmButton: false,
          timer: 5000,
        });
      } else {
        Swal.fire({
          icon: "success",
          text: res.data.message,
          showConfirmButton: false,
          timer: 5000,
        });
      }
    } catch (err) {
      setLoading(false);
      handleError(err, router);
    }
  };
  const handleSave = async () => {
    // Check if the entered table_no exists in the list of available tables
    const selectedTable = tables.find(
      (table) => table.table_number === table_no
    );

    if (selectedTable) {
      const data = {
        table_id: selectedTable.id,
        items: selectItems.map((item) => ({
          item_id: item.id,
          quantity: item.quantity,
          special_instructions: " ",
        })),
      };
      console.log("data", data);
      await addOrders(data);
      setSelectItems([]);
      setTableNo("");
    } else {
      // If the entered table_no doesn't exist, show an error alert
      Swal.fire({
        icon: "error",
        text: "Table does not exist. Please enter a valid table number.",
        showConfirmButton: false,
        timer: 5000,
      });
    }
  };
  return (
    selectItems.length > 0 && (
      <div
        className=" w-96  text-black py-8 fixed top-0 bottom-0 right-0"
        style={{
          width: selectItems.length === 0 ? 0 : "24rem",
          maxWidth: selectItems.length === 0 ? 0 : "24rem",
          padding: selectItems.length === 0 ? 0 : "0.75rem 0",
          animation: slideAnimation,
          transition: "all 0.3s",
          marginTop: "4.2rem",
          backgroundColor: "var(--secondary-color)",
        }}
      >
        <div style={{ width: 0 }}>
          <div
            className="absolute left-[-3%] pt-1%  p-1  shadow-md skeleton close-sidebar"
            onClick={() => {
              setSelectItems([]);
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
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
          <div className="mb-8 px-8"></div>
        </div>
        <div
          className="flex-grow overflow-y-auto pl-8 custom-scrollbar "
          style={{ height: "75%", borderBottom: "2px solid #c4c4c4" }}
        >
          {selectItems.map((selectedItem) => (
            <div key={selectedItem.id} className="mb-4 flex">
              <div className="h-20 w-20">
                <img
                  src={server_domain + selectedItem.image_url}
                  alt={selectedItem.name}
                  className="w-full h-full flex-none bg-cover rounded-full text-center overflow-hidden"
                />
              </div>
              <div className="px-4 py-2 flex flex-col leading-normal">
                <h5 className="text-md font-bold">{selectedItem.name}</h5>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        selectedItem.id,
                        selectedItem.quantity - 1
                      )
                    }
                  >
                    <svg
                      width="25px"
                      height="25px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H15C15.4142 11.25 15.75 11.5858 15.75 12Z"
                        fill="var(--buttom-color)"
                      />
                    </svg>
                  </button>
                  <p className="text-sm">
                    Qty:{" "}
                    <span className="zoom-animation">
                      {selectedItem.quantity}
                    </span>
                  </p>
                  <button
                    onClick={() =>
                      handleQuantityChange(
                        selectedItem.id,
                        selectedItem.quantity + 1
                      )
                    }
                  >
                    <svg
                      width="22px"
                      height="22px"
                      viewBox="0 0 24 24"
                      id="meteor-icon-kit__solid-plus-circle"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M10.5 10.5H7C6.17157 10.5 5.5 11.1716 5.5 12C5.5 12.8284 6.17157 13.5 7 13.5H10.5V17C10.5 17.8284 11.1716 18.5 12 18.5C12.8284 18.5 13.5 17.8284 13.5 17V13.5H17C17.8284 13.5 18.5 12.8284 18.5 12C18.5 11.1716 17.8284 10.5 17 10.5H13.5V7C13.5 6.17157 12.8284 5.5 12 5.5C11.1716 5.5 10.5 6.17157 10.5 7V10.5ZM24 12C24 18.6274 18.6274 24 12 24C5.37258 24 0 18.6274 0 12C0 5.37258 5.37258 0 12 0C18.6274 0 24 5.37258 24 12Z"
                        fill="var(--buttom-color)"
                      />
                    </svg>
                  </button>
                </div>
                <p className="font-bold text-md">
                  {money.format(selectedItem.price)} Ks
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="float-right gap-4 flex p-4">
          <div className="font-bold text-lg"> Total Price:</div>
          <div className="font-bold">
            <span className="text-lg">
              {money.format(calculateTotalPrice().toFixed(2).split(".")[0])}
            </span>
            <span className="text-sm">{`.${
              calculateTotalPrice().toFixed(2).split(".")[1]
            }`}</span>
          </div>
          <div className=" text-lg font-bold">Ks</div>
        </div>
        <div className="flex w-full px-4">
          <div style={{ width: "75px", padding: "0.3rem 0rem" }}>
            <label className="blocktext-sm font-bold mb-2" htmlFor="name">
              Table No.
            </label>
          </div>
          <div style={{ width: "calc(100% - 75px)" }}>
            <input
              style={{
                border: "1px solid var(--fourth-color)",
              }}
              className="w-full p-2  rounded-lg border transition focus:border-white focus:outline-none focus:ring-2 focus:ring-c4c4c4"
              id="name"
              type="text"
              name="Table No."
              value={table_no}
              onChange={(e) => setTableNo(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="p-4 w-full font-bold">
          <button
            className="w-full view-history text-white font-bold py-2 px-4 rounded"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    )
  );
}
