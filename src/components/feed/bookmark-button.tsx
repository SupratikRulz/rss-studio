"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import useBookmarkStore from "@/stores/bookmark-store";
import useToastStore from "@/stores/toast-store";
import type { FeedItem } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BookmarkButtonProps {
  item: FeedItem;
  size?: number;
  className?: string;
}

export default function BookmarkButton({
  item,
  size = 18,
  className,
}: BookmarkButtonProps) {
  const { isBookmarked, addBookmark, removeBookmark, getBookmarkByLink } =
    useBookmarkStore();
  const bookmarked = isBookmarked(item.link);
  const [pop, setPop] = useState(false);

  function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setPop(true);
    setTimeout(() => setPop(false), 200);
    if (bookmarked) {
      const bookmark = getBookmarkByLink(item.link);
      if (bookmark) {
        removeBookmark(bookmark.id);
        useToastStore.getState().addToast("Bookmark removed.", "success");
      }
    } else {
      addBookmark(item);
      useToastStore.getState().addToast("Article bookmarked.", "success");
    }
  }

  return (
    <button
      onClick={handleToggle}
      className={cn(
        "rounded-lg p-1.5 transition-colors cursor-pointer",
        bookmarked
          ? "text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
          : "text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300",
        pop && "animate-bookmark",
        className
      )}
      title={bookmarked ? "Remove bookmark" : "Bookmark this article"}
    >
      <Bookmark
        size={size}
        fill={bookmarked ? "currentColor" : "none"}
        strokeWidth={1.8}
      />
    </button>
  );
}
