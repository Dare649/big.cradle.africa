"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { PageTitle } from "@/utils/PageTitle";

const PageHeader = () => {
  const pathname = usePathname(); // Use `usePathname` for Next.js 13+ apps

  useEffect(() => {
    if (pathname) {
      document.title = PageTitle(pathname);
    }
  }, [pathname]);

  return null; // Since this component doesn't render anything
};

export default PageHeader;
