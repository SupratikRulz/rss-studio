"use client";

import { useEffect } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.getAttribute("data-theme");
    root.setAttribute("data-theme", "light");
    root.style.colorScheme = "light";
    return () => {
      if (prev) {
        root.setAttribute("data-theme", prev);
        root.style.colorScheme = prev;
      }
    };
  }, []);

  return <>{children}</>;
}
