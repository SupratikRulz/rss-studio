"use client";

import type { FeedItem } from "@/lib/types";
import FeedCard from "./feed-card";
import FeedCardView from "./feed-card-view";
import FeedArticleView from "./feed-article-view";
import FeedTitleView from "./feed-title-view";
import useSettingsStore from "@/stores/settings-store";
import { Inbox } from "lucide-react";
import { FeedListSkeleton } from "@/components/ui/skeleton";

interface FeedListProps {
  items: FeedItem[];
  isLoading: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
  animateItems?: boolean;
}

export default function FeedList({
  items,
  isLoading,
  emptyMessage = "No articles yet",
  emptyDescription = "Articles will appear here once feeds are loaded.",
  animateItems = true,
}: FeedListProps) {
  const feedView = useSettingsStore((s) => s.feedView);

  if (feedView === "cards") {
    return (
      <FeedCardView
        items={items}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        animateItems={animateItems}
      />
    );
  }

  if (feedView === "article") {
    return (
      <FeedArticleView
        items={items}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        animateItems={animateItems}
      />
    );
  }

  if (feedView === "titleOnly") {
    return (
      <FeedTitleView
        items={items}
        isLoading={isLoading}
        emptyMessage={emptyMessage}
        emptyDescription={emptyDescription}
        animateItems={animateItems}
      />
    );
  }

  // Default: magazine view (original)
  if (isLoading) {
    return <FeedListSkeleton />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
        <Inbox size={36} strokeWidth={1.5} className="mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">{emptyMessage}</p>
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">{emptyDescription}</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-100 dark:divide-neutral-800">
      {items.map((item, i) => (
        <div
          key={item.id}
          className={animateItems ? "animate-feed-item" : undefined}
          style={
            animateItems
              ? { animationDelay: `${Math.min(i * 30, 300)}ms` }
              : undefined
          }
        >
          <FeedCard item={item} />
        </div>
      ))}
    </div>
  );
}
