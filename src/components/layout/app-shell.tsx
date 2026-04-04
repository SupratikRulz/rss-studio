"use client";

import Sidebar from "./sidebar";
import MobileNav from "./mobile-nav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-white dark:bg-neutral-950">
      <Sidebar />
      <main className="flex-1 min-w-0 pb-20 lg:pb-0">{children}</main>
      <MobileNav />
    </div>
  );
}
