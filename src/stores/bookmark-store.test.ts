import { setCurrentUserId } from "@/lib/user-storage";
import useBookmarkStore from "@/stores/bookmark-store";
import { sampleFeedItem } from "@/test/fixtures/feed-fixtures";
import { describe, it, vi, expect, beforeEach } from "vitest";

function resetBookmarkStore() {
  useBookmarkStore.setState({
    bookmarks: [],
  });
}

describe("bookmark store", () => {
  beforeEach(() => {
    setCurrentUserId("user-1");
    resetBookmarkStore();
  });

  it("adds bookmarks once and can look them up by link", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("bookmark-1");

    useBookmarkStore.getState().addBookmark(sampleFeedItem);
    useBookmarkStore.getState().addBookmark(sampleFeedItem);

    expect(useBookmarkStore.getState().bookmarks).toHaveLength(1);
    expect(useBookmarkStore.getState().isBookmarked(sampleFeedItem.link)).toBe(true);
    expect(useBookmarkStore.getState().getBookmarkByLink(sampleFeedItem.link)).toMatchObject({
      id: "bookmark-1",
      item: sampleFeedItem,
    });
  });

  it("removes bookmarks by id", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("bookmark-1");
    useBookmarkStore.getState().addBookmark(sampleFeedItem);

    useBookmarkStore.getState().removeBookmark("bookmark-1");

    expect(useBookmarkStore.getState().bookmarks).toEqual([]);
  });
});
