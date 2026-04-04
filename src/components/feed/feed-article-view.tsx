"use client";

import { useRouter } from "next/navigation";
import type { FeedItem } from "@/lib/types";
import { formatDate, stripHtml, truncate } from "@/lib/utils";
import BookmarkButton from "./bookmark-button";
import ShareButtons from "./share-buttons";
import useFeedStore from "@/stores/feed-store";
import { Inbox } from "lucide-react";
import { Shimmer } from "@/components/ui/skeleton";
import OptimizedImage from "@/components/ui/optimized-image";

interface FeedArticleViewProps {
  items: FeedItem[];
  isLoading: boolean;
  emptyMessage?: string;
  emptyDescription?: string;
}

export default function FeedArticleView({
  items,
  isLoading,
  emptyMessage = "No articles yet",
  emptyDescription = "Articles will appear here once feeds are loaded.",
}: FeedArticleViewProps) {
  if (isLoading) return <ArticleViewSkeleton />;

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
          style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
        >
          <ArticleItem item={item} />
        </div>
      ))}
    </div>
  );
}

function ArticleItem({ item }: { item: FeedItem }) {
  const router = useRouter();
  const setSelectedArticle = useFeedStore((s) => s.setSelectedArticle);
  const description = stripHtml(item.description || item.content);

  function handleClick() {
    setSelectedArticle(item);
    router.push(`/article/${encodeURIComponent(item.id)}`);
  }

  return (
    <article className="py-6 px-2">
      <div onClick={handleClick} className="cursor-pointer group">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 leading-snug group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {item.title}
        </h2>
        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-neutral-500">
          <span className="font-medium text-emerald-600 dark:text-emerald-400">
            {item.sourceName}
          </span>
          {item.author && (
            <>
              <span>by {item.author}</span>
            </>
          )}
          <span>·</span>
          <span>{formatDate(item.pubDate)}</span>
        </div>
      </div>

      <div className="flex items-center gap-1 mt-3">
        <ShareButtons url={item.link} title={item.title} />
        <BookmarkButton item={item} size={17} />
      </div>

      <div onClick={handleClick} className="cursor-pointer mt-4">
        {item.imageUrl && (
          <div className="w-full max-w-md rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800 mb-4">
            <OptimizedImage
              src={item.imageUrl}
              width={448}
              height={252}
              sizes="(max-width: 448px) 100vw, 448px"
              className="w-full object-cover"
              hideContainerOnError
            />
          </div>
        )}
        {description && (
          <p className="text-gray-600 dark:text-neutral-300 leading-relaxed" style={{ fontSize: "1em" }}>
            {truncate(description, 600)}
          </p>
        )}
      </div>

      <div onClick={handleClick} className="cursor-pointer mt-4">
        <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
          Visit Website
        </span>
      </div>
    </article>
  );
}

function ArticleViewSkeleton() {
  return (
    <div className="divide-y divide-gray-100 dark:divide-neutral-800">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="py-6 px-2 space-y-4">
          <div className="space-y-2">
            <Shimmer className="h-6 w-4/5 rounded" />
            <Shimmer className="h-6 w-3/5 rounded" />
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-3 w-24 rounded" />
            <Shimmer className="h-3 w-20 rounded" />
          </div>
          <Shimmer className="h-48 w-full max-w-md rounded-xl" />
          <div className="space-y-2">
            <Shimmer className="h-4 w-full rounded" />
            <Shimmer className="h-4 w-full rounded" />
            <Shimmer className="h-4 w-3/4 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
