"use client";

import type { FeedItem } from "@/lib/types";
import { formatDate, stripHtml, truncate } from "@/lib/utils";
import BookmarkButton from "./bookmark-button";
import ShareButtons from "./share-buttons";
import useArticleTransition from "@/hooks/use-article-transition";
import { Inbox } from "lucide-react";
import { Shimmer } from "@/components/ui/skeleton";

interface FeedTitleViewProps {
  items: FeedItem[];
  isLoading: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export default function FeedTitleView({
  items,
  isLoading,
  emptyMessage = "No articles yet",
  emptyDescription = "Articles will appear here once feeds are loaded.",
}: FeedTitleViewProps) {
  if (isLoading) return <TitleViewSkeleton />;

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
          className="animate-feed-item"
          style={{ animationDelay: `${Math.min(i * 20, 200)}ms` }}
        >
          <TitleItem item={item} />
        </div>
      ))}
    </div>
  );
}

function TitleItem({ item }: { item: FeedItem }) {
  const { navigate, titleRef } = useArticleTransition();
  const description = stripHtml(item.description || item.content);

  return (
    <div className="flex items-center gap-3 py-2.5 px-2 group hover:bg-gray-50 dark:hover:bg-neutral-900 rounded-lg transition-colors">
      <BookmarkButton item={item} size={15} className="shrink-0" />

      <div
        onClick={() => navigate(item)}
        className="flex-1 min-w-0 flex items-center gap-2 cursor-pointer"
      >
        <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 shrink-0 w-20 truncate">
          {item.sourceName}
        </span>
        <span ref={titleRef as React.Ref<HTMLSpanElement>} className="text-sm font-medium text-gray-900 dark:text-neutral-100 truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {item.title}
        </span>
        {description && (
          <span className="hidden lg:inline text-xs text-gray-400 dark:text-neutral-500 truncate">
            {truncate(description, 80)}
          </span>
        )}
      </div>

      <div className="flex items-center gap-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
        <ShareButtons url={item.link} title={item.title} />
      </div>

      <span className="text-xs text-gray-400 dark:text-neutral-500 whitespace-nowrap shrink-0">
        {formatDate(item.pubDate)}
      </span>
    </div>
  );
}

function TitleViewSkeleton() {
  return (
    <div className="divide-y divide-gray-100 dark:divide-neutral-800">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 py-2.5 px-2">
          <Shimmer className="w-5 h-5 rounded shrink-0" />
          <Shimmer className="h-3 w-20 rounded shrink-0" />
          <Shimmer className="h-3 flex-1 rounded" />
          <Shimmer className="h-3 w-12 rounded shrink-0" />
        </div>
      ))}
    </div>
  );
}
