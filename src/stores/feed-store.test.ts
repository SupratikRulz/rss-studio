import { DEFAULT_FOLDER_ID, DEFAULT_FOLDER_NAME } from "@/lib/constants";
import { setCurrentUserId } from "@/lib/user-storage";
import useFeedStore from "@/stores/feed-store";
import useToastStore from "@/stores/toast-store";
import {
  sampleFeedItem,
  sampleFeedSource,
  sampleParsedFeedResponse,
} from "@/test/fixtures/feed-fixtures";
import { describe, it, vi, expect, beforeEach } from "vitest";

function resetFeedStore() {
  useFeedStore.setState({
    sources: [],
    folders: [
      {
        id: DEFAULT_FOLDER_ID,
        name: DEFAULT_FOLDER_NAME,
        createdAt: "2026-04-01T00:00:00.000Z",
      },
    ],
    feedItems: [],
    exploreFeedItems: [],
    selectedArticle: null,
    selectedSourceId: null,
    sourceFeedItems: [],
    isLoadingFeeds: false,
    isLoadingExplore: false,
    isLoadingSourceFeed: false,
    _feedsFetchedAt: 0,
    _exploreFetchedAt: 0,
    _sourceFeedFetchedAt: {},
    _sourceFeedCache: {},
  });
}

describe("feed store", () => {
  beforeEach(() => {
    setCurrentUserId("user-1");
    resetFeedStore();
    useToastStore.setState({
      toasts: [],
      addToast: vi.fn(),
      removeToast: vi.fn(),
    });
  });

  it("deduplicates sources by normalized url", () => {
    vi.spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValueOnce("source-1")
      .mockReturnValueOnce("source-2");

    const first = useFeedStore.getState().addSource({
      title: "Example",
      url: "https://example.com/feed.xml/",
      siteUrl: "https://example.com",
      description: "Example feed",
      folderId: DEFAULT_FOLDER_ID,
    });
    const second = useFeedStore.getState().addSource({
      title: "Duplicate",
      url: " https://example.com/feed.xml ",
      siteUrl: "https://example.com",
      description: "Duplicate feed",
      folderId: DEFAULT_FOLDER_ID,
    });

    expect(first).toMatchObject({ id: "source-1" });
    expect(second).toBeNull();
    expect(useFeedStore.getState().sources).toHaveLength(1);
  });

  it("adds folders once and moves sources back to General when deleting a folder", () => {
    vi.spyOn(globalThis.crypto, "randomUUID")
      .mockReturnValueOnce("folder-1")
      .mockReturnValueOnce("source-1");

    const folder = useFeedStore.getState().addFolder("Engineering");
    const duplicate = useFeedStore.getState().addFolder(" engineering ");
    useFeedStore.getState().addSource({
      title: "Example",
      url: "https://example.com/feed.xml",
      siteUrl: "https://example.com",
      description: "Example feed",
      folderId: folder!.id,
    });

    useFeedStore.getState().removeFolder(folder!.id);

    expect(duplicate).toBeNull();
    expect(useFeedStore.getState().folders).toHaveLength(1);
    expect(useFeedStore.getState().sources[0]?.folderId).toBe(DEFAULT_FOLDER_ID);
  });

  it("reuses a fresh cached source feed", async () => {
    useFeedStore.setState({
      sources: [sampleFeedSource],
    });

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => sampleParsedFeedResponse,
    });
    vi.stubGlobal("fetch", fetchMock);

    await useFeedStore.getState().fetchSourceFeed(sampleFeedSource.id);
    await useFeedStore.getState().fetchSourceFeed(sampleFeedSource.id);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(useFeedStore.getState().sourceFeedItems).toEqual([
      {
        ...sampleFeedItem,
        sourceId: sampleFeedSource.id,
      },
    ]);
  });
});
