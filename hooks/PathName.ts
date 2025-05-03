"use client";

import { usePathname } from "next/navigation";
import { adminNav, businessNav, userNav } from "@/data/dummy"; // import all navs

// Optional: Replace this with actual user role from auth context/store
const getUserRole = (pathname: string): "admin" | "business" | "user" => {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/business")) return "business";
  return "user";
};

// Custom Hook for Dynamic Page Header
export const useCurrentPathHierarchy = () => {
  const pathname = usePathname();

  const role = getUserRole(pathname);
  const nav = role === "admin" ? adminNav : role === "business" ? businessNav : userNav;

  for (const item of nav) {
    if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
      return {
        parent: item.title,
      };
    }
  }

  return {
    parent: "Dashboard",
  };
};
