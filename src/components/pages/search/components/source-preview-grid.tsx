import { Inbox } from "lucide-react";
import { formatDate, stripHtml, truncate } from "@/lib/utils";
import type { FeedItem } from "@/lib/types";
import BookmarkButton from "@/components/feed/bookmark-button";
import ShareButtons from "@/components/feed/share-buttons";
import OptimizedImage from "@/components/ui/optimized-image";
import { Shimmer } from "@/components/ui/skeleton";
import useArticleTransition from "@/hooks/use-article-transition";

interface SourcePreviewGridProps {
  items: FeedItem[];
  isLoading: boolean;
  error?: string;
}

export default function SourcePreviewGrid({
  items,
  isLoading,
  error,
}: SourcePreviewGridProps) {
  if (isLoading) {
    return <SourcePreviewGridSkeleton />;
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 dark:border-red-900/30 bg-red-50/70 dark:bg-red-900/10 px-4 py-3 text-sm text-red-600 dark:text-red-300">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-gray-400 dark:text-neutral-500">
        <Inbox size={30} strokeWidth={1.5} className="mb-2" />
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
          No articles available
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-feed-item"
          style={{ animationDelay: `${Math.min(index * 40, 240)}ms` }}
        >
          <SourcePreviewCard item={item} />
        </div>
      ))}
    </div>
  );
}

function SourcePreviewCard({ item }: { item: FeedItem }) {
  const { navigate, titleRef, imageRef } = useArticleTransition();
  const description = stripHtml(item.description || item.content);

  return (
    <article className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-950">
      <button
        type="button"
        onClick={() => navigate(item)}
        className="block w-full cursor-pointer text-left"
      >
        {item.imageUrl && (
          <div
            ref={imageRef as React.Ref<HTMLDivElement>}
            className="relative aspect-16/10 w-full overflow-hidden bg-gray-100 dark:bg-neutral-800"
          >
            <OptimizedImage
              src={item.imageUrl}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
              hideContainerOnError
            />
          </div>
        )}
        <div className="p-4">
          <h4
            ref={titleRef as React.Ref<HTMLHeadingElement>}
            className="line-clamp-2 text-sm font-semibold leading-snug text-gray-900 dark:text-neutral-100"
          >
            {item.title}
          </h4>
          <div className="mt-2 flex items-center gap-1.5 text-xs">
            <span className="truncate font-medium text-emerald-600 dark:text-emerald-400">
              {item.sourceName}
            </span>
            <span className="text-gray-300 dark:text-neutral-600">·</span>
            <span className="whitespace-nowrap text-gray-400 dark:text-neutral-500">
              {formatDate(item.pubDate)}
            </span>
          </div>
          {description && (
            <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-gray-500 dark:text-neutral-400">
              {truncate(description, 160)}
            </p>
          )}
        </div>
      </button>
      <div className="flex items-center justify-between border-t border-gray-100 px-3 py-2 dark:border-neutral-800">
        <ShareButtons url={item.link} title={item.title} />
        <BookmarkButton item={item} size={16} />
      </div>
    </article>
  );
}

function SourcePreviewGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <div
          key={index}
          className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-neutral-800 dark:bg-neutral-950"
        >
          <Shimmer className="aspect-16/10 w-full" />
          <div className="space-y-3 p-4">
            <Shimmer className="h-4 w-5/6 rounded" />
            <Shimmer className="h-4 w-2/3 rounded" />
            <div className="flex items-center gap-2">
              <Shimmer className="h-3 w-20 rounded" />
              <Shimmer className="h-3 w-14 rounded" />
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
