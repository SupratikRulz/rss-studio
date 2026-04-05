"use client";

import type { FeedItem } from "@/lib/types";
import { formatDate, truncate, stripHtml } from "@/lib/utils";
import BookmarkButton from "./bookmark-button";
import useArticleTransition from "@/hooks/use-article-transition";
import OptimizedImage from "@/components/ui/optimized-image";

interface FeedCardProps {
  item: FeedItem;
}

export default function FeedCard({ item }: FeedCardProps) {
  const { navigate, titleRef, imageRef } = useArticleTransition();

  const description = stripHtml(item.description || item.content);

  return (
    <article
      onClick={() => navigate(item)}
      className="group flex gap-4 p-4 rounded-xl cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors border border-transparent hover:border-gray-100 dark:hover:border-neutral-800"
    >
      {item.imageUrl && (
        <div
          ref={imageRef as React.Ref<HTMLDivElement>}
          className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100 dark:bg-neutral-800 sm:h-20 sm:w-28"
        >
          <OptimizedImage
            src={item.imageUrl}
            fill
            sizes="(max-width: 640px) 80px, 112px"
            className="object-cover"
            hideContainerOnError
          />
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h3 ref={titleRef as React.Ref<HTMLHeadingElement>} className="text-[15px] font-semibold text-gray-900 dark:text-neutral-100 leading-snug line-clamp-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
              {item.title}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="max-w-35 truncate text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {item.sourceName}
              </span>
              {item.author && (
                <>
                  <span className="text-gray-300 dark:text-neutral-600">·</span>
                  <span className="max-w-25 truncate text-xs text-gray-400 dark:text-neutral-500">
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
          <BookmarkButton item={item} className="-mt-0.5 shrink-0" />
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
