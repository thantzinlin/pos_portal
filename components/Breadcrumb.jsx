"use client";
import { usePathname } from "next/navigation";
// components/Breadcrumb.js
import { useEffect, useState } from "react";

function Breadcrumb() {
  const pathname = usePathname();
  const [breadcrumbItems, setBreadcrumbItems] = useState([
    { label: "Home", href: "/" },
  ]);
  let labelName = "";

  if (pathname === "/dashboard") {
    labelName = "";
  } else if (pathname.startsWith("/dashboard/")) {
    const suffix = pathname.slice("/dashboard/".length);
    labelName = "  > " + suffix.charAt(0).toUpperCase() + suffix.slice(1);
  }
  console.log(labelName, typeof labelName);

  useEffect(() => {
    setBreadcrumbItems((prevItems) => [
      { label: "Home", href: "/dashboard" },
      { label: labelName },
    ]);
  }, [pathname]);

  return (
    <>
      <nav className="text-gray-500 text-sm breadcrumbs mb-0">
        {breadcrumbItems.map((item, index) => (
          <span key={item.label}>
            {item.href ? (
              <a
                href={item.href}
                className="hover:underline"
                style={{ color: "#7468D4" }}
              >
                {item.label}
              </a>
            ) : (
              item.label
            )}
          </span>
        ))}
      </nav>
    </>
  );
}

export default Breadcrumb;
