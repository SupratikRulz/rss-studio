import { Check, ExternalLink, Loader2, Newspaper, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { DiscoverSource } from "@/lib/discover-sources";
import type { FeedSource } from "@/lib/types";
import SourceIcon from "@/components/ui/source-icon";
import SourcePreviewGrid from "./source-preview-grid";
import type { SourcePreviewState } from "../types";

interface DiscoverSourceRowProps {
  source: DiscoverSource;
  subscribedSource?: FeedSource;
  isSubscribing: boolean;
  preview?: SourcePreviewState;
  onGoToFeed: (sourceId: string) => void;
  onPreview: (source: DiscoverSource) => void;
  onFollow: (source: DiscoverSource) => void;
}

export default function DiscoverSourceRow({
  source,
  subscribedSource,
  isSubscribing,
  preview,
  onGoToFeed,
  onPreview,
  onFollow,
}: DiscoverSourceRowProps) {
  const previewLoading = preview?.isLoading ?? false;
  const isSubscribed = Boolean(subscribedSource);

  return (
    <div className="rounded-xl border border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 transition-all duration-200 hover:-translate-y-0.5 animate-feed-item overflow-hidden">
      <div className="flex items-center gap-4 p-4">
        <SourceIcon
          siteUrl={source.siteUrl}
          size={40}
          className="rounded-lg shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
            {source.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
            {source.description}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href={source.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-300 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-500 dark:hover:text-neutral-400 transition-colors cursor-pointer"
          >
            <ExternalLink size={15} />
          </a>
          {subscribedSource ? (
            <button
              onClick={() => onGoToFeed(subscribedSource.id)}
              className="rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Newspaper size={13} />
                Go to feed
              </span>
            </button>
          ) : (
            <button
              onClick={() => onPreview(source)}
              disabled={previewLoading}
              className="rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-1.5 text-xs font-medium text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              {previewLoading ? (
                <span className="flex items-center gap-1.5">
                  <Loader2 size={13} className="animate-spin" />
                  Previewing
                </span>
              ) : (
                <span className="flex items-center gap-1.5">
                  <Newspaper size={13} />
                  {preview?.isOpen ? "Hide Preview" : "Preview"}
                </span>
              )}
            </button>
          )}
          <button
            onClick={() => onFollow(source)}
            disabled={isSubscribed || isSubscribing}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer press-scale",
              isSubscribed
                ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
            )}
          >
            {isSubscribing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : isSubscribed ? (
              <span className="flex items-center gap-1">
                <Check size={12} />
                <span className="hidden sm:inline">Added</span>
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Plus size={12} />
                <span className="hidden sm:inline">Follow</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {preview?.isOpen && !subscribedSource && (
        <div className="border-t border-gray-100 dark:border-neutral-800 bg-gray-50/60 dark:bg-neutral-900/40 px-4 py-4">
          <SourcePreviewGrid
            items={preview.items}
            isLoading={preview.isLoading}
            error={preview.error}
          />
        </div>
      )}
    </div>
  );
}
