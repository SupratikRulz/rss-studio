"use client";

import { useRouter } from "next/navigation";
import type { FeedItem } from "@/lib/types";
import { formatDate, stripHtml, truncate } from "@/lib/utils";
import BookmarkButton from "./bookmark-button";
import useFeedStore from "@/stores/feed-store";
import { Inbox } from "lucide-react";
import { Shimmer } from "@/components/ui/skeleton";
import OptimizedImage from "@/components/ui/optimized-image";

interface FeedCardViewProps {
  items: FeedItem[];
  isLoading: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export default function FeedCardView({
  items,
  isLoading,
  emptyMessage = "No articles yet",
  emptyDescription = "Articles will appear here once feeds are loaded.",
}: FeedCardViewProps) {
  if (isLoading) return <CardViewSkeleton />;

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
      {items.map((item, i) => (
        <div
          key={item.id}
          className="animate-feed-item"
          style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
        >
          <CardItem item={item} />
        </div>
      ))}
    </div>
  );
}

function CardItem({ item }: { item: FeedItem }) {
  const router = useRouter();
  const setSelectedArticle = useFeedStore((s) => s.setSelectedArticle);
  const description = stripHtml(item.description || item.content);

  function handleClick() {
    setSelectedArticle(item);
    router.push(`/article/${encodeURIComponent(item.id)}`);
  }

  return (
    <article
      onClick={handleClick}
      className="group flex flex-col rounded-xl overflow-hidden cursor-pointer border border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
    >
      {item.imageUrl && (
        <div className="w-full aspect-16/10 bg-gray-100 dark:bg-neutral-800 overflow-hidden relative">
          <OptimizedImage
            src={item.imageUrl}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            hideContainerOnError
          />
        </div>
      )}
      <div className="flex flex-col flex-1 p-4">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {item.title}
        </h3>
        <div className="flex items-center gap-1.5 mt-2">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate">
            {item.sourceName}
          </span>
          <span className="text-gray-300 dark:text-neutral-600">·</span>
          <span className="text-xs text-gray-400 dark:text-neutral-500 whitespace-nowrap">
            {formatDate(item.pubDate)}
          </span>
        </div>
        {description && (
          <p className="mt-2 text-xs text-gray-500 dark:text-neutral-400 leading-relaxed line-clamp-3">
            {truncate(description, 160)}
          </p>
        )}
        <div className="flex items-center justify-end mt-auto pt-2 -mr-1">
          <BookmarkButton item={item} size={16} />
        </div>
      </div>
    </article>
  );
}

function CardViewSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800">
          <Shimmer className="w-full aspect-16/10" />
          <div className="p-4 space-y-3">
            <Shimmer className="h-4 w-5/6 rounded" />
            <Shimmer className="h-4 w-2/3 rounded" />
            <div className="flex items-center gap-2">
              <Shimmer className="h-3 w-20 rounded" />
              <Shimmer className="h-3 w-12 rounded" />
            </div>
            <div className="space-y-1.5">
              <Shimmer className="h-3 w-full rounded" />
              <Shimmer className="h-3 w-4/5 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
