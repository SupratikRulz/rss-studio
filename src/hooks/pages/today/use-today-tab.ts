import { useCallback, useMemo } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { isToday } from "@/lib/utils";
import type { FeedItem } from "@/lib/types";

export default function useTodayTab(
  router: AppRouterInstance,
  searchParams: ReadonlyURLSearchParams,
  feedItems: FeedItem[],
  exploreFeedItems: FeedItem[]
) {
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "explore" ? "explore" : "me";

  const setActiveTab = useCallback(
    (tabId: string) => {
      if (tabId === "explore") {
        router.replace("/?tab=explore", { scroll: false });
      } else {
        router.replace("/", { scroll: false });
      }
    },
    [router]
  );

  const todayFeedItems = useMemo(
    () => feedItems.filter((item) => isToday(item.pubDate)),
    [feedItems]
  );

  const todayExploreItems = useMemo(
    () => exploreFeedItems.filter((item) => isToday(item.pubDate)),
    [exploreFeedItems]
  );

  return {
    activeTab,
    setActiveTab,
    todayFeedItems,
    todayExploreItems,
  };
}
