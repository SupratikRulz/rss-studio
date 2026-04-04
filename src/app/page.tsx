"use client";

import { useEffect, useState, useMemo } from "react";
import Tabs from "@/components/ui/tabs";
import FeedList from "@/components/feed/feed-list";
import useFeedStore from "@/stores/feed-store";
import { Rss } from "lucide-react";
import AddFeedDialog from "@/components/sources/add-feed-dialog";
import { isToday } from "@/lib/utils";

const TABS = [
  { id: "me", label: "Me" },
  { id: "explore", label: "Explore" },
];

export default function TodayPage() {
  const [activeTab, setActiveTab] = useState("me");
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
    if (activeTab === "explore" && exploreFeedItems.length === 0) {
      fetchExploreFeeds();
    }
  }, [activeTab, exploreFeedItems.length, fetchExploreFeeds]);

  const todayFeedItems = useMemo(
    () => feedItems.filter((item) => isToday(item.pubDate)),
    [feedItems]
  );

  const todayExploreItems = useMemo(
    () => exploreFeedItems.filter((item) => isToday(item.pubDate)),
    [exploreFeedItems]
  );

  return (
    <div className="max-w-3xl mx-auto">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 pt-5 pb-0">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-4">Today</h1>
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
