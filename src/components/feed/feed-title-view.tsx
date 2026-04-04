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
  animateItems?: boolean;
}

export default function FeedTitleView({
  items,
  isLoading,
  emptyMessage = "No articles yet",
  emptyDescription = "Articles will appear here once feeds are loaded.",
  animateItems = true,
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
          className={animateItems ? "animate-feed-item" : undefined}
          style={
            animateItems
              ? { animationDelay: `${Math.min(i * 20, 200)}ms` }
              : undefined
          }
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
    <div className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-gray-50 dark:hover:bg-neutral-900">
      <BookmarkButton item={item} size={15} className="shrink-0" />

      <div className="relative flex min-w-0 flex-1 items-center">
        <div
          onClick={() => navigate(item)}
          className="flex min-w-0 flex-1 items-center gap-2 cursor-pointer"
        >
          <span className="w-20 shrink-0 truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
            {item.sourceName}
          </span>
          <span
            ref={titleRef as React.Ref<HTMLSpanElement>}
            className="max-w-full shrink truncate text-sm font-medium text-gray-900 transition-colors group-hover:text-emerald-700 dark:text-neutral-100 dark:group-hover:text-emerald-400 lg:max-w-[40%]"
          >
            {item.title}
          </span>
          {description && (
            <span className="hidden min-w-0 flex-1 truncate text-xs text-gray-400 dark:text-neutral-500 lg:inline">
              {truncate(description, 120)}
            </span>
          )}
        </div>

        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden items-center opacity-0 transition-opacity md:flex group-hover:opacity-100">
          <div className="absolute inset-y-0 -left-16 right-0 bg-linear-to-l from-gray-50 via-gray-50/95 to-transparent dark:from-neutral-900 dark:via-neutral-900/95" />
          <ShareButtons
            url={item.link}
            title={item.title}
            className="relative pointer-events-auto rounded-lg bg-gray-50/95 dark:bg-neutral-900/95"
          />
        </div>
      </div>

      <ShareButtons
        url={item.link}
        title={item.title}
        variant="native"
        className="shrink-0 md:hidden"
      />

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
