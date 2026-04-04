import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { FeedSource, Folder, FeedItem } from "@/lib/types";
import { DEFAULT_FOLDER_ID, DEFAULT_FOLDER_NAME } from "@/lib/constants";
import { generateId } from "@/lib/utils";
import { createUserStorage } from "@/lib/user-storage";
import useToastStore from "./toast-store";

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

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

  _feedsFetchedAt: number;
  _exploreFetchedAt: number;
  _sourceFeedFetchedAt: Record<string, number>;
  _sourceFeedCache: Record<string, FeedItem[]>;

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
  fetchSubscribedFeeds: (force?: boolean) => Promise<void>;
  fetchExploreFeeds: (force?: boolean) => Promise<void>;
  fetchSourceFeed: (sourceId: string, force?: boolean) => Promise<void>;
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

      _feedsFetchedAt: 0,
      _exploreFetchedAt: 0,
      _sourceFeedFetchedAt: {},
      _sourceFeedCache: {},

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
        set((state) => ({ sources: [...state.sources, source], _feedsFetchedAt: 0 }));
        return source;
      },

      removeSource: (sourceId) => {
        set((state) => ({
          sources: state.sources.filter((s) => s.id !== sourceId),
          _feedsFetchedAt: 0,
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
      setSelectedSourceId: (sourceId) => {
        const cached = sourceId ? get()._sourceFeedCache[sourceId] : undefined;
        set({
          selectedSourceId: sourceId,
          sourceFeedItems: cached || [],
        });
      },

      fetchSubscribedFeeds: async (force = false) => {
        const state = get();
        if (state.isLoadingFeeds) return;

        if (state.sources.length === 0) {
          set({ feedItems: [], isLoadingFeeds: false });
          return;
        }

        if (
          !force &&
          state.feedItems.length > 0 &&
          Date.now() - state._feedsFetchedAt < CACHE_TTL
        ) {
          return;
        }

        set({ isLoadingFeeds: true });
        try {
          const results = await Promise.allSettled(
            state.sources.map(async (source) => {
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

          set({
            feedItems: allItems,
            isLoadingFeeds: false,
            _feedsFetchedAt: Date.now(),
          });

          const failedCount = results.filter((r) => r.status === "rejected").length;
          if (failedCount > 0 && failedCount === state.sources.length) {
            useToastStore.getState().addToast("Failed to load your feeds. Check your connection and try again.");
          } else if (failedCount > 0) {
            useToastStore.getState().addToast(`Some feeds couldn't be loaded (${failedCount} of ${state.sources.length}).`);
          }
        } catch {
          set({ isLoadingFeeds: false });
          useToastStore.getState().addToast("Failed to load your feeds. Check your connection and try again.");
        }
      },

      fetchExploreFeeds: async (force = false) => {
        const state = get();
        if (state.isLoadingExplore) return;

        if (
          !force &&
          state.exploreFeedItems.length > 0 &&
          Date.now() - state._exploreFetchedAt < CACHE_TTL
        ) {
          return;
        }

        set({ isLoadingExplore: true });
        try {
          const res = await fetch("/api/rss/explore");
          if (!res.ok) throw new Error("Failed to fetch explore feeds");
          const data = await res.json();
          set({
            exploreFeedItems: data.items || [],
            isLoadingExplore: false,
            _exploreFetchedAt: Date.now(),
          });
        } catch {
          set({ isLoadingExplore: false });
          useToastStore.getState().addToast("Explore feeds couldn't be loaded. Check your connection and try again.");
        }
      },

      fetchSourceFeed: async (sourceId, force = false) => {
        const state = get();
        const source = state.sources.find((s) => s.id === sourceId);
        if (!source) return;
        if (state.isLoadingSourceFeed && state.selectedSourceId === sourceId) return;

        const lastFetched = state._sourceFeedFetchedAt[sourceId] || 0;
        const cached = state._sourceFeedCache[sourceId];
        const isFresh = cached && cached.length > 0 && Date.now() - lastFetched < CACHE_TTL;

        if (!force && isFresh) {
          set({ selectedSourceId: sourceId, sourceFeedItems: cached });
          return;
        }

        set({ isLoadingSourceFeed: true, selectedSourceId: sourceId });
        try {
          const res = await fetch("/api/rss/parse", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url: source.url }),
          });
          if (!res.ok) {
            set({ isLoadingSourceFeed: false });
            useToastStore.getState().addToast(`Failed to load "${source.title}". The feed may be temporarily unavailable.`);
            return;
          }
          const data = await res.json();
          const items = (data.items || []).map((item: FeedItem) => ({
            ...item,
            sourceId: source.id,
          }));
          set((prev) => ({
            sourceFeedItems: items,
            isLoadingSourceFeed: false,
            _sourceFeedFetchedAt: {
              ...prev._sourceFeedFetchedAt,
              [sourceId]: Date.now(),
            },
            _sourceFeedCache: {
              ...prev._sourceFeedCache,
              [sourceId]: items,
            },
          }));
        } catch {
          set({ isLoadingSourceFeed: false });
          useToastStore.getState().addToast(`Failed to load "${source.title}". Check your connection and try again.`);
        }
      },
    }),
    {
      name: "rss-studio-feeds",
      storage: createUserStorage(),
      skipHydration: true,
      partialize: (state) => ({
        sources: state.sources,
        folders: state.folders,
        selectedArticle: state.selectedArticle,
      }),
    }
  )
);

export default useFeedStore;
