import { ArrowLeft } from "lucide-react";
import FeedList from "@/components/feed/feed-list";
import SourceIcon from "@/components/ui/source-icon";
import type { FeedItem, FeedSource, Folder } from "@/lib/types";
import FeedSourceToolbar from "./feed-source-toolbar";

interface FeedsMobileArticlesProps {
  selectedSourceId: string | null;
  selectedSource?: FeedSource;
  folders: Folder[];
  items: FeedItem[];
  isLoadingSourceFeed: boolean;
  onBack: () => void;
  onRefresh: () => void;
  onMoveToFolder: (folderId: string) => void;
}

export default function FeedsMobileArticles({
  selectedSourceId,
  selectedSource,
  folders,
  items,
  isLoadingSourceFeed,
  onBack,
  onRefresh,
  onMoveToFolder,
}: FeedsMobileArticlesProps) {
  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="rounded-lg p-2 -ml-2 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <SourceIcon
              siteUrl={selectedSource?.siteUrl || ""}
              imageUrl={selectedSource?.imageUrl || ""}
              size={24}
              className="p-1"
            />
            <h1 className="text-base font-semibold text-gray-900 dark:text-neutral-100 truncate">
              {selectedSource?.title || "Feed"}
            </h1>
          </div>
          {selectedSourceId && selectedSource && (
            <FeedSourceToolbar
              selectedSource={selectedSource}
              folders={folders}
              isLoadingSourceFeed={isLoadingSourceFeed}
              refreshIconSize={15}
              selectClassName="min-w-20 appearance-none rounded-lg border border-gray-200 dark:border-neutral-700 pl-2 pr-7 py-1.5 text-xs font-medium text-gray-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400"
              onRefresh={onRefresh}
              onMoveToFolder={onMoveToFolder}
            />
          )}
        </div>
      </header>

      <div className="px-2">
        <FeedList
          items={items}
          isLoading={isLoadingSourceFeed}
          emptyMessage="No articles"
          emptyDescription="This source has no articles to display."
        />
      </div>
    </div>
  );
}
