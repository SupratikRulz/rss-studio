"use client";

import { Suspense } from "react";
import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";
import ToastContainer from "@/components/ui/toast";

function SidebarFallback() {
  return (
    <aside
      aria-hidden="true"
      className="hidden lg:flex w-60 shrink-0 border-r border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-950"
    />
  );
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-950">
      <Suspense fallback={<SidebarFallback />}>
        <Sidebar />
      </Suspense>
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
      <MobileNav />
      <ToastContainer />
    </div>
  );
}
