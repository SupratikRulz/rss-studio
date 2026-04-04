import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FeedSource, Folder, FeedItem } from "@/lib/types";
import { DEFAULT_FOLDER_ID, DEFAULT_FOLDER_NAME } from "@/lib/constants";
import { generateId } from "@/lib/utils";

interface FeedState {
  sources: FeedSource[];
  folders: Folder[];
  feedItems: FeedItem[];
  exploreFeedItems: FeedItem[];
  selectedArticle: FeedItem | null;
  selectedSourceId: string | null;
  sourceFeedItems: FeedItem[];
  isLoadingFeeds: boolean;
  isLoadingExplore: boolean;
  isLoadingSourceFeed: boolean;

  addSource: (source: Omit<FeedSource, "id" | "addedAt">) => FeedSource | null;
  removeSource: (sourceId: string) => void;
  moveSourceToFolder: (sourceId: string, folderId: string) => void;
  addFolder: (name: string) => Folder | null;
  removeFolder: (folderId: string) => void;
  renameFolder: (folderId: string, name: string) => void;
  setFeedItems: (items: FeedItem[]) => void;
  setExploreFeedItems: (items: FeedItem[]) => void;
  setSelectedArticle: (article: FeedItem | null) => void;
  setSelectedSourceId: (sourceId: string | null) => void;
  fetchSubscribedFeeds: () => Promise<void>;
  fetchExploreFeeds: () => Promise<void>;
  fetchSourceFeed: (sourceId: string) => Promise<void>;
}

const useFeedStore = create<FeedState>()(
  persist(
    (set, get) => ({
      sources: [],
      folders: [
        {
          id: DEFAULT_FOLDER_ID,
          name: DEFAULT_FOLDER_NAME,
          createdAt: new Date().toISOString(),
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

      addSource: (sourceData) => {
        const normalizedUrl = sourceData.url.trim().toLowerCase().replace(/\/+$/, "");
        const exists = get().sources.some(
          (s) => s.url.trim().toLowerCase().replace(/\/+$/, "") === normalizedUrl
        );
        if (exists) return null;

        const source: FeedSource = {
          ...sourceData,
          id: generateId(),
          addedAt: new Date().toISOString(),
        };
        set((state) => ({ sources: [...state.sources, source] }));
        return source;
      },

      removeSource: (sourceId) => {
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== sourceId),
        }));
      },

      moveSourceToFolder: (sourceId, folderId) => {
        set((state) => ({
          sources: state.sources.map((s) =>
            s.id === sourceId ? { ...s, folderId } : s
          ),
        }));
      },

      addFolder: (name) => {
        const normalized = name.trim().toLowerCase();
        const exists = get().folders.some(
          (f) => f.name.trim().toLowerCase() === normalized
        );
        if (exists) return null;

        const folder: Folder = {
          id: generateId(),
          name: name.trim(),
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ folders: [...state.folders, folder] }));
        return folder;
      },

      removeFolder: (folderId) => {
        if (folderId === DEFAULT_FOLDER_ID) return;
        set((state) => ({
          folders: state.folders.filter((f) => f.id !== folderId),
          sources: state.sources.map((s) =>
            s.folderId === folderId ? { ...s, folderId: DEFAULT_FOLDER_ID } : s
          ),
        }));
      },

      renameFolder: (folderId, name) => {
        set((state) => ({
          folders: state.folders.map((f) =>
            f.id === folderId ? { ...f, name } : f
          ),
        }));
      },

      setFeedItems: (items) => set({ feedItems: items }),
      setExploreFeedItems: (items) => set({ exploreFeedItems: items }),
      setSelectedArticle: (article) => set({ selectedArticle: article }),
      setSelectedSourceId: (sourceId) =>
        set({ selectedSourceId: sourceId, sourceFeedItems: [] }),

      fetchSubscribedFeeds: async () => {
        const { sources } = get();
        if (sources.length === 0) {
          set({ feedItems: [], isLoadingFeeds: false });
          return;
        }

        set({ isLoadingFeeds: true });
        try {
          const results = await Promise.allSettled(
            sources.map(async (source) => {
              const res = await fetch("/api/rss/parse", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: source.url }),
              });
              if (!res.ok) return [];
              const data = await res.json();
              return (data.items || []).map((item: FeedItem) => ({
                ...item,
                sourceId: source.id,
              }));
            })
          );

          const allItems = results
            .filter(
              (r): r is PromiseFulfilledResult<FeedItem[]> =>
                r.status === "fulfilled"
            )
            .flatMap((r) => r.value);

          allItems.sort(
            (a, b) =>
              new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
          );

          set({ feedItems: allItems, isLoadingFeeds: false });
        } catch {
          set({ isLoadingFeeds: false });
        }
      },

      fetchExploreFeeds: async () => {
        set({ isLoadingExplore: true });
        try {
          const res = await fetch("/api/rss/explore");
          if (!res.ok) throw new Error("Failed to fetch explore feeds");
          const data = await res.json();
          set({ exploreFeedItems: data.items || [], isLoadingExplore: false });
        } catch {
          set({ isLoadingExplore: false });
        }
      },

      fetchSourceFeed: async (sourceId) => {
        const source = get().sources.find((s) => s.id === sourceId);
        if (!source) return;

        set({ isLoadingSourceFeed: true, selectedSourceId: sourceId });
        try {
          const res = await fetch("/api/rss/parse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: source.url }),
          });
          if (!res.ok) {
            set({ isLoadingSourceFeed: false });
            return;
          }
          const data = await res.json();
          const items = (data.items || []).map((item: FeedItem) => ({
            ...item,
            sourceId: source.id,
          }));
          set({ sourceFeedItems: items, isLoadingSourceFeed: false });
        } catch {
          set({ isLoadingSourceFeed: false });
        }
      },
    }),
    {
      name: "rss-studio-feeds",
      partialize: (state) => ({
        sources: state.sources,
        folders: state.folders,
        selectedArticle: state.selectedArticle,
      }),
    }
  )
);

export default useFeedStore;
