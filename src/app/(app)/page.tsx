"use client";

import { useEffect, useMemo, Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Tabs from "@/components/ui/tabs";
import FeedList from "@/components/feed/feed-list";
import useFeedStore from "@/stores/feed-store";
import { Rss, RefreshCw } from "lucide-react";
import AddFeedDialog from "@/components/sources/add-feed-dialog";
import { isToday, cn } from "@/lib/utils";

const TABS = [
  { id: "me", label: "Me" },
  { id: "explore", label: "Explore" },
];

function TodayPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const activeTab = tabParam === "explore" ? "explore" : "me";

  const [showAddFeed, setShowAddFeed] = useState(false);

  const {
    feedItems,
    exploreFeedItems,
    isLoadingFeeds,
    isLoadingExplore,
    sources,
    fetchSubscribedFeeds,
    fetchExploreFeeds,
  } = useFeedStore();

  useEffect(() => {
    fetchSubscribedFeeds();
  }, [fetchSubscribedFeeds, sources.length]);

  useEffect(() => {
    if (activeTab === "explore") {
      fetchExploreFeeds();
    }
  }, [activeTab, fetchExploreFeeds]);

  function setActiveTab(tabId: string) {
    if (tabId === "explore") {
      router.replace("/?tab=explore", { scroll: false });
    } else {
      router.replace("/", { scroll: false });
    }
  }

  const todayFeedItems = useMemo(
    () => feedItems.filter((item) => isToday(item.pubDate)),
    [feedItems]
  );

  const todayExploreItems = useMemo(
    () => exploreFeedItems.filter((item) => isToday(item.pubDate)),
    [exploreFeedItems]
  );

  function handleReload() {
    if (activeTab === "me") {
      fetchSubscribedFeeds(true);
    } else {
      fetchExploreFeeds(true);
    }
  }

  const isLoading = activeTab === "me" ? isLoadingFeeds : isLoadingExplore;

  return (
    <div className="max-w-3xl mx-auto animate-page">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 pt-5 pb-0">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Today</h1>
            <button
              onClick={handleReload}
              disabled={isLoading}
              title="Refresh feeds"
              className="rounded-lg p-2 text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <RefreshCw
                size={17}
                strokeWidth={2}
                className={cn(isLoading && "animate-spin")}
              />
            </button>
          </div>
          <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
        </div>
      </header>

      <div className="px-2 sm:px-4">
        {activeTab === "me" ? (
          sources.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
              <Rss size={36} strokeWidth={1.5} className="mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                No subscriptions yet
              </p>
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 mb-4">
                Follow RSS sources to see your personalized feed here.
              </p>
              <button
                onClick={() => setShowAddFeed(true)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                Add your first feed
              </button>
            </div>
          ) : (
            <FeedList
              items={todayFeedItems}
              isLoading={isLoadingFeeds}
              emptyMessage="Nothing new today"
              emptyDescription="No articles published today from your subscriptions."
            />
          )
        ) : (
          <FeedList
            items={todayExploreItems}
            isLoading={isLoadingExplore}
            emptyMessage="Nothing new today"
            emptyDescription="No articles published today from explore sources."
          />
        )}
      </div>

      <AddFeedDialog open={showAddFeed} onClose={() => setShowAddFeed(false)} />
    </div>
  );
}

function TodayPageFallback() {
  return (
    <div className="max-w-3xl mx-auto animate-page min-h-[40vh]">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 pt-5 pb-0">
          <div className="h-7 w-28 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse mb-4" />
          <div className="h-11 bg-gray-100 dark:bg-neutral-900 rounded-lg animate-pulse mb-2" />
        </div>
      </header>
    </div>
  );
}

export default function TodayPage() {
  return (
    <Suspense fallback={<TodayPageFallback />}>
      <TodayPageContent />
    </Suspense>
  );
}
