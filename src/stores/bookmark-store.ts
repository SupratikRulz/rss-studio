import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Bookmark, FeedItem } from "@/lib/types";
import { generateId } from "@/lib/utils";

interface BookmarkState {
  bookmarks: Bookmark[];
  addBookmark: (item: FeedItem) => void;
  removeBookmark: (bookmarkId: string) => void;
  isBookmarked: (itemLink: string) => boolean;
  getBookmarkByLink: (itemLink: string) => Bookmark | undefined;
}

const useBookmarkStore = create<BookmarkState>()(
  persist(
    (set, get) => ({
      bookmarks: [],

      addBookmark: (item) => {
        if (get().isBookmarked(item.link)) return;
        const bookmark: Bookmark = {
          id: generateId(),
          item,
          bookmarkedAt: new Date().toISOString(),
        };
        set((state) => ({ bookmarks: [...state.bookmarks, bookmark] }));
      },

      removeBookmark: (bookmarkId) => {
        set((state) => ({
          bookmarks: state.bookmarks.filter((b) => b.id !== bookmarkId),
        }));
      },

      isBookmarked: (itemLink) => {
        return get().bookmarks.some((b) => b.item.link === itemLink);
      },

      getBookmarkByLink: (itemLink) => {
        return get().bookmarks.find((b) => b.item.link === itemLink);
      },
    }),
    {
      name: "rss-studio-bookmarks",
    }
  )
);

export default useBookmarkStore;
