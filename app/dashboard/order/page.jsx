"use client";

import Pagination from "@/components/Pagination";
import RightOrderCard from "@/components/RightOrderCard";
import { server_domain } from "@/constants";
import { appContext } from "@/providers/AppProvider";
import { itemContext } from "@/providers/ItemProvider";
import { orderContext } from "@/providers/OrderProvider";
import { handleError, httpGet } from "@/utils/rest-client";
import money from "mm-money";
import { useRouter } from "next/navigation";
import { useCallback, useContext, useEffect, useState } from "react";

const PosSystem = ({ items }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { selectItems, setSelectItems } = useContext(orderContext);
  const categorizedItems = {};

  items.forEach((item) => {
    item.categories.forEach((category) => {
      if (!categorizedItems[category.name]) {
        categorizedItems[category.name] = [];
      }
      categorizedItems[category.name].push(item);
    });
  });
  const handleItemClick = (clickedItem) => {
    console.log("Clicked Item:", clickedItem);
    const existingItem = selectItems.find(
      (selectedItem) =>
        selectedItem.id === clickedItem.id &&
        selectedItem.name === clickedItem.name
    );
    console.log("Existing Item:", existingItem);
    if (existingItem) {
      const updatedSelectItems = selectItems.map((selectedItem) =>
        selectedItem.id === clickedItem.id
          ? { ...selectedItem, quantity: selectedItem.quantity + 1 }
          : selectedItem
      );
      setSelectItems(updatedSelectItems);
    } else {
      setSelectItems([...selectItems, { ...clickedItem, quantity: 1 }]);
    }
  };

  // Filter items based on the selected category
  const displayedItems =
    selectedCategory === "All" ? items : categorizedItems[selectedCategory];

  return (
    <div>
      {/* Display "All" option */}
      <div className="flex py-4 gap-3">
        <div
          key="All"
          className="card"
          style={
            selectedCategory == "All"
              ? {
                  color: "white",
                  backgroundColor: "var(--buttom-color)",
                  borderColor: "var(--buttom-color)",
                }
              : {}
          }
        >
          <strong
            onClick={() => setSelectedCategory("All")}
            style={{ cursor: "pointer" }}
          >
            All
          </strong>
        </div>

        <div className="flex gap-3">
          {/* Display all categories */}
          {Object.keys(categorizedItems).map((categoryName) => (
            <div
              key={categoryName}
              className="card"
              style={
                selectedCategory == categoryName
                  ? {
                      color: "white",
                      backgroundColor: "var(--buttom-color)",
                      borderColor: "var(--buttom-color)",
                    }
                  : {}
              }
            >
              <strong
                onClick={() => setSelectedCategory(categoryName)}
                style={{ cursor: "pointer" }}
              >
                {categoryName}
              </strong>
            </div>
          ))}
        </div>
      </div>

      {/* Display items based on the selected category */}
      <div className="bg-transparent w-full py-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 ">
        {displayedItems.map((item) => (
          <div
            key={item.name}
            className="items-center gap-4"
            style={{
              background: "var(--secondary-color)",
              "border-bottom-left-radius": "0.75rem",
              "border-bottom-right-radius": "0.75rem",
            }}
            onClick={() => handleItemClick(item)}
          >
            <div>
              {item.image_url && (
                <img
                  style={{
                    height: "123px",
                    objectFit: "cover",
                    "border-top-left-radius": "0.75rem",
                    "border-top-right-radius": "0.75rem",
                  }}
                  src={`${server_domain}${item.image_url}`}
                  alt={item.name}
                  className="w-full "
                />
              )}
            </div>
            <div style={{ padding: "8px" }}>{item.name}</div>
            <div style={{ padding: "8px" }}>
              Price-{money.format(item.price)} Ks
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AddOrder() {
  const router = useRouter();
  const { setLoading } = useContext(appContext);
  const { selectItems, setSelectItems } = useContext(orderContext);
  const {
    items,
    setItems,
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
  } = useContext(itemContext);

  const fetchItems = useCallback(() => {
    setLoading(true);
    httpGet("/api/items", {
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
        setItems(res.data.data);
      })
      .catch((err) => {
        setLoading(false);
        handleError(err, router);
      });
  }, [
    page,
    perPage,
    router,
    search,
    setItems,
    setLoading,
    setTotal,
    setPageCounts,
  ]);

  useEffect(() => {
    fetchItems();
  }, [search]);

  return (
    <div className="flex h-full">
      <div
        className="flex-grow"
        style={{ paddingRight: selectItems.length === 0 ? 0 : "24rem" }}
      >
        <div
          className="flex-grow overflow-auto"
          style={{ height: "calc(100% - 36px)" }}
        >
          <div>
            {/* Search bar */}
            <div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                type="text"
                placeholder="Type to search..."
                className="w-full p-4 rounded-md border transition focus"
              />
            </div>
          </div>
          <div>
            <PosSystem items={items} />
          </div>
        </div>
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

      <RightOrderCard></RightOrderCard>
    </div>
  );
}
