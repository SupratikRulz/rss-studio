import { useCallback, useEffect, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/navigation";
import useFeedStore from "@/stores/feed-store";
import type { FeedItem, FeedSource } from "@/lib/types";

interface UseFeedsSourceParamArgs {
  router: AppRouterInstance;
  searchParams: ReadonlyURLSearchParams;
  sources: FeedSource[];
  selectedSourceId: string | null;
  sourceFeedItems: FeedItem[];
  isLoadingSourceFeed: boolean;
  fetchSourceFeed: (sourceId: string, force?: boolean) => Promise<void>;
  setSelectedSourceId: (sourceId: string | null) => void;
}

export default function useFeedsSourceParam({
  router,
  searchParams,
  sources,
  selectedSourceId,
  sourceFeedItems,
  isLoadingSourceFeed,
  fetchSourceFeed,
  setSelectedSourceId,
}: UseFeedsSourceParamArgs) {
  const [isStoreHydrated, setIsStoreHydrated] = useState(() =>
    useFeedStore.persist.hasHydrated()
  );
  const sourceParam = searchParams.get("source");

  const replaceSourceParam = useCallback(
    (sourceId: string | null) => {
      const params = new URLSearchParams(searchParams.toString());

      if (sourceId) {
        params.set("source", sourceId);
      } else {
        params.delete("source");
      }

      const nextQuery = params.toString();
      router.replace(nextQuery ? `/feeds?${nextQuery}` : "/feeds", {
        scroll: false,
      });
    },
    [router, searchParams]
  );

  useEffect(() => {
    const unsubscribe = useFeedStore.persist.onFinishHydration(() => {
      setIsStoreHydrated(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (
      selectedSourceId &&
      sourceFeedItems.length === 0 &&
      !isLoadingSourceFeed
    ) {
      fetchSourceFeed(selectedSourceId);
    }
  }, [
    selectedSourceId,
    sourceFeedItems.length,
    isLoadingSourceFeed,
    fetchSourceFeed,
  ]);

  useEffect(() => {
    if (!sourceParam || !isStoreHydrated) {
      return;
    }

    const sourceExists = sources.some((source) => source.id === sourceParam);
    if (!sourceExists) {
      if (selectedSourceId === sourceParam) {
        setSelectedSourceId(null);
      }
      replaceSourceParam(null);
      return;
    }

    if (selectedSourceId !== sourceParam) {
      fetchSourceFeed(sourceParam);
    }
  }, [
    sourceParam,
    isStoreHydrated,
    sources,
    selectedSourceId,
    fetchSourceFeed,
    replaceSourceParam,
    setSelectedSourceId,
  ]);

  useEffect(() => {
    if (isStoreHydrated && !sourceParam && selectedSourceId) {
      setSelectedSourceId(null);
    }
  }, [sourceParam, selectedSourceId, isStoreHydrated, setSelectedSourceId]);

  const handleSourceSelect = useCallback(
    (sourceId: string) => {
      replaceSourceParam(sourceId);
      fetchSourceFeed(sourceId);
    },
    [fetchSourceFeed, replaceSourceParam]
  );

  const handleMobileBack = useCallback(() => {
    setSelectedSourceId(null);
    replaceSourceParam(null);
  }, [replaceSourceParam, setSelectedSourceId]);

  return {
    mobileShowArticles: Boolean(sourceParam),
    handleSourceSelect,
    handleMobileBack,
  };
}
