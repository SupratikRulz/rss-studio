"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Newspaper,
  Bookmark,
  Rss,
  FolderOpen,
  ChevronDown,
  CircleUserRound,
  Search,
  Library,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/lib/constants";
import useFeedStore from "@/stores/feed-store";
import FeedTree from "@/components/feeds/feed-tree";
import Dialog, { ConfirmDialog } from "@/components/ui/dialog";
import { addFolderInputSchema } from "@/lib/schemas";

const ICONS: Record<string, React.ElementType> = {
  today: Newspaper,
  bookmarks: Bookmark,
  sources: Rss,
  feeds: FolderOpen,
};

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [feedsExpanded, setFeedsExpanded] = useState(true);
  const [sourcesExpanded, setSourcesExpanded] = useState(true);
  const { fetchSourceFeed, selectedSourceId, addFolder, removeFolder } =
    useFeedStore();

  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderError, setFolderError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const sourcesActive =
    pathname.startsWith("/sources") || pathname.startsWith("/search");

  function handleSourceSelect(sourceId: string) {
    fetchSourceFeed(sourceId);
    router.push("/feeds");
  }

  function handleAddFolder(e: React.FormEvent) {
    e.preventDefault();
    setFolderError("");
    const result = addFolderInputSchema.safeParse({ name: newFolderName });
    if (!result.success) {
      setFolderError(result.error.issues[0].message);
      return;
    }
    const folder = addFolder(newFolderName);
    if (!folder) {
      setFolderError("A folder with this name already exists.");
      return;
    }
    setNewFolderName("");
    setShowAddFolder(false);
  }

  const settingsActive = pathname === "/settings";

  return (
    <aside className="hidden lg:flex flex-col w-60 border-r border-gray-200 dark:border-neutral-800 bg-gray-50/50 dark:bg-neutral-950 h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-gray-200 dark:border-neutral-800">
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600">
            <Rss size={16} className="text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900 dark:text-neutral-100 tracking-tight">
            RSS Studio
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = ICONS[item.id];
          const active = isActive(item.href);

          if (item.id === "sources") {
            return (
              <div key={item.id}>
                <button
                  onClick={() => setSourcesExpanded((v) => !v)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    sourcesActive
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-200"
                  )}
                >
                  <Icon size={18} strokeWidth={sourcesActive ? 2.2 : 1.8} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-gray-400 dark:text-neutral-500 transition-transform duration-200",
                      !sourcesExpanded && "-rotate-90"
                    )}
                  />
                </button>

                {sourcesExpanded && (
                  <div className="mt-1 ml-4 space-y-0.5">
                    <Link
                      href="/search"
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                        pathname.startsWith("/search")
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10"
                          : "text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-200"
                      )}
                    >
                      <Search size={15} strokeWidth={pathname.startsWith("/search") ? 2.2 : 1.8} />
                      Search
                    </Link>
                    <Link
                      href="/sources"
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                        pathname === "/sources"
                          ? "text-emerald-700 dark:text-emerald-400 bg-emerald-50/60 dark:bg-emerald-900/10"
                          : "text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-200"
                      )}
                    >
                      <Library size={15} strokeWidth={pathname === "/sources" ? 2.2 : 1.8} />
                      My Sources
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          if (item.id === "feeds") {
            return (
              <div key={item.id}>
                <button
                  onClick={() => setFeedsExpanded((v) => !v)}
                  className={cn(
                    "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                    active
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                      : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-200"
                  )}
                >
                  <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
                  <span className="flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={14}
                    className={cn(
                      "text-gray-400 dark:text-neutral-500 transition-transform duration-200",
                      !feedsExpanded && "-rotate-90"
                    )}
                  />
                </button>

                {feedsExpanded && (
                  <div className="mt-1 ml-2 pl-2">
                    <FeedTree
                      onSourceSelect={handleSourceSelect}
                      selectedSourceId={pathname.startsWith("/feeds") ? selectedSourceId : null}
                      onAddFolder={() => setShowAddFolder(true)}
                      onDeleteFolder={(id) => setDeleteTarget(id)}
                      compact
                    />
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
                active
                  ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                  : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-200"
              )}
            >
              <Icon size={18} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Settings at bottom */}
      <div className="px-3 py-3 border-t border-gray-200 dark:border-neutral-800">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer",
            settingsActive
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
              : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-900 hover:text-gray-900 dark:hover:text-neutral-200"
          )}
        >
          <CircleUserRound size={18} strokeWidth={settingsActive ? 2.2 : 1.8} />
          Settings
        </Link>
      </div>

      {/* Add Folder Dialog */}
      <Dialog
        open={showAddFolder}
        onClose={() => {
          setShowAddFolder(false);
          setNewFolderName("");
          setFolderError("");
        }}
        title="New Folder"
      >
        <form onSubmit={handleAddFolder} className="space-y-4">
          <div>
            <label
              htmlFor="sidebar-folder-name"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Folder Name
            </label>
            <input
              id="sidebar-folder-name"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Technology, News, Science"
              className="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              autoFocus
            />
            {folderError && (
              <p className="text-xs text-red-500 mt-1.5">{folderError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Create Folder
          </button>
        </form>
      </Dialog>

      {/* Delete Folder Confirm */}
      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeFolder(deleteTarget);
          setDeleteTarget(null);
        }}
        title="Delete Folder"
        message="Are you sure you want to delete this folder? Feeds in this folder will be moved to General."
        confirmLabel="Delete"
        variant="danger"
      />
    </aside>
  );
}
