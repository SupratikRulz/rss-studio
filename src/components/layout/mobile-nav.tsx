"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Newspaper,
  Bookmark,
  Rss,
  FolderOpen,
  CircleUserRound,
  Search,
  Library,
} from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";

const ICONS: Record<string, React.ElementType> = {
  today: Newspaper,
  bookmarks: Bookmark,
  sources: Rss,
  feeds: FolderOpen,
};

export default function MobileNav() {
  const pathname = usePathname();
  const { user } = useUser();

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  if (pathname.startsWith("/article")) return null;

  const settingsActive = pathname === "/settings";
  const sourcesActive =
    pathname.startsWith("/sources") || pathname.startsWith("/search");

  return (
    <>
      {/* Sources sub-navigation bar */}
      {sourcesActive && (
        <div className="lg:hidden fixed bottom-[52px] left-0 right-0 z-40 border-t border-gray-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm">
          <div className="flex items-center gap-2 px-4 py-2 mb-4">
            <Link
              href="/search"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                pathname.startsWith("/search")
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-900"
              )}
            >
              <Search size={15} />
              Search
            </Link>
            <Link
              href="/sources"
              className={cn(
                "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer",
                pathname === "/sources"
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                  : "text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-900"
              )}
            >
              <Library size={15} />
              My Sources
            </Link>
          </div>
        </div>
      )}

      {/* Main bottom nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 dark:border-neutral-800 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm">
        <div className="flex items-center justify-around px-2 py-1">
          {NAV_ITEMS.map((item) => {
            const Icon = ICONS[item.id];

            if (item.id === "sources") {
              return (
                <Link
                  key={item.id}
                  href={pathname.startsWith("/search") ? "/search" : "/sources"}
                  className={cn(
                    "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors rounded-lg cursor-pointer",
                    sourcesActive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-gray-400 dark:text-neutral-500"
                  )}
                >
                  <Icon size={20} strokeWidth={sourcesActive ? 2.2 : 1.8} />
                  {item.label}
                </Link>
              );
            }

            const active = isActive(item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors rounded-lg cursor-pointer",
                  active
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-400 dark:text-neutral-500"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
                {item.label}
              </Link>
            );
          })}
          <Link
            href="/settings"
            className={cn(
              "flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors rounded-lg cursor-pointer",
              settingsActive
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-gray-400 dark:text-neutral-500"
            )}
          >
            {user?.imageUrl ? (
              <img
                src={user.imageUrl}
                alt=""
                width={20}
                height={20}
                className="rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <CircleUserRound size={20} strokeWidth={settingsActive ? 2.2 : 1.8} />
            )}
            Settings
          </Link>
        </div>
      </nav>
    </>
  );
}
