"use client";

import { useState, useMemo } from "react";
import { Bookmark, Search, X } from "lucide-react";
import useBookmarkStore from "@/stores/bookmark-store";
import FeedList from "@/components/feed/feed-list";

export default function BookmarksPage() {
  const { bookmarks } = useBookmarkStore();
  const [searchQuery, setSearchQuery] = useState("");

  const items = useMemo(() => {
    const all = bookmarks.map((b) => b.item);
    const q = searchQuery.toLowerCase().trim();
    if (!q) return all;
    return all.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.sourceName.toLowerCase().includes(q) ||
        (item.author && item.author.toLowerCase().includes(q)) ||
        item.description.toLowerCase().includes(q)
    );
  }, [bookmarks, searchQuery]);

  return (
    <div className="max-w-3xl mx-auto">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-5">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Bookmarks</h1>
        </div>

        {bookmarks.length > 0 && (
          <div className="px-4 sm:px-6 pb-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search bookmarks..."
                className="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 pl-9 pr-8 py-2 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {bookmarks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
          <Bookmark size={36} strokeWidth={1.5} className="mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">No bookmarks yet</p>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
            Save articles to read later by clicking the bookmark icon.
          </p>
        </div>
      ) : (
        <div className="px-2 sm:px-4">
          <FeedList
            items={items}
            isLoading={false}
            emptyMessage="No matching bookmarks"
            emptyDescription="Try a different search term."
          />
        </div>
      )}
    </div>
  );
}
