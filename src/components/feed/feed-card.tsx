"use client";

import { useRouter } from "next/navigation";
import type { FeedItem } from "@/lib/types";
import { formatDate, truncate, stripHtml } from "@/lib/utils";
import BookmarkButton from "./bookmark-button";
import useFeedStore from "@/stores/feed-store";
import OptimizedImage from "@/components/ui/optimized-image";

interface FeedCardProps {
  item: FeedItem;
}

export default function FeedCard({ item }: FeedCardProps) {
  const router = useRouter();
  const setSelectedArticle = useFeedStore((s) => s.setSelectedArticle);

  function handleClick() {
    setSelectedArticle(item);
    router.push(`/article/${encodeURIComponent(item.id)}`);
  }

  const description = stripHtml(item.description || item.content);

  return (
    <article
      onClick={handleClick}
      className="group flex gap-4 p-4 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-neutral-800"
    >
      {item.imageUrl && (
        <div className="hidden sm:block flex-shrink-0 w-28 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-neutral-800 relative">
          <OptimizedImage
            src={item.imageUrl}
            fill
            sizes="112px"
            className="object-cover"
            hideContainerOnError
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 truncate max-w-[140px]">
                {item.sourceName}
              </span>
              {item.author && (
                <>
                  <span className="text-gray-300 dark:text-neutral-600">·</span>
                  <span className="text-xs text-gray-400 dark:text-neutral-500 truncate max-w-[100px]">
                    {item.author}
                  </span>
                </>
              )}
              <span className="text-gray-300 dark:text-neutral-600">·</span>
              <span className="text-xs text-gray-400 dark:text-neutral-500 whitespace-nowrap">
                {formatDate(item.pubDate)}
              </span>
            </div>
          </div>
          <BookmarkButton item={item} className="flex-shrink-0 -mt-0.5" />
        </div>

        {description && (
          <p className="mt-2 text-sm text-gray-500 dark:text-neutral-400 leading-relaxed line-clamp-2">
            {truncate(description, 180)}
          </p>
        )}
      </div>
    </article>
  );
}
