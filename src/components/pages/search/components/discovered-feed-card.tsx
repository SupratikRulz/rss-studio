import { Check, Plus, Rss } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiscoveredFeed, DiscoveredFeedItem } from "../types";

interface DiscoveredFeedCardProps {
  feed: DiscoveredFeed;
  items: DiscoveredFeedItem[];
  isSubscribed: boolean;
  onFollow: () => void;
}

export default function DiscoveredFeedCard({
  feed,
  items,
  isSubscribed,
  onFollow,
}: DiscoveredFeedCardProps) {
  return (
    <div className="rounded-xl border border-gray-100 dark:border-neutral-800 p-5 animate-feed-item">
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
          <Rss
            size={20}
            className="text-emerald-600 dark:text-emerald-400"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 dark:text-neutral-100 truncate">
            {feed.title || feed.feedUrl}
          </h3>
          {feed.description && (
            <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
              {feed.description}
            </p>
          )}
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5 truncate">
            {feed.feedUrl}
          </p>
        </div>
        <button
          onClick={onFollow}
          disabled={isSubscribed}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer shrink-0 press-scale",
            isSubscribed
              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
              : "bg-emerald-600 text-white hover:bg-emerald-700"
          )}
        >
          {isSubscribed ? (
            <span className="flex items-center gap-1.5">
              <Check size={14} />
              Following
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              <Plus size={14} />
              Follow
            </span>
          )}
        </button>
      </div>

      {items.length > 0 && (
        <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 space-y-2">
          <p className="text-xs text-gray-400 dark:text-neutral-500 font-medium mb-2">
            Latest articles
          </p>
          {items.map((item) => (
            <a
              key={item.id}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-gray-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 truncate transition-colors cursor-pointer"
            >
              {item.title}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
