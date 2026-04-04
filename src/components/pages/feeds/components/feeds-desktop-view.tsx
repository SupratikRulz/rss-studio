import { FolderOpen, Plus } from "lucide-react";
import FeedList from "@/components/feed/feed-list";
import SourceIcon from "@/components/ui/source-icon";
import type { FeedItem, FeedSource, Folder } from "@/lib/types";
import FeedSourceToolbar from "./feed-source-toolbar";

interface FeedsDesktopViewProps {
  selectedSource?: FeedSource;
  folders: Folder[];
  items: FeedItem[];
  isLoadingSourceFeed: boolean;
  onShowAddFolder: () => void;
  onRefresh: () => void;
  onMoveToFolder: (folderId: string) => void;
}

export default function FeedsDesktopView({
  selectedSource,
  folders,
  items,
  isLoadingSourceFeed,
  onShowAddFolder,
  onRefresh,
  onMoveToFolder,
}: FeedsDesktopViewProps) {
  return (
    <div className="hidden lg:block">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-6 py-5 flex items-center justify-between">
          {selectedSource ? (
            <div className="flex items-center gap-3 min-w-0">
              <SourceIcon
                siteUrl={selectedSource.siteUrl}
                imageUrl={selectedSource.imageUrl}
                size={48}
                className="p-1"
              />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 truncate">
                {selectedSource.title}
              </h1>
            </div>
          ) : (
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
              Feeds
            </h1>
          )}
          {selectedSource ? (
            <FeedSourceToolbar
              selectedSource={selectedSource}
              folders={folders}
              isLoadingSourceFeed={isLoadingSourceFeed}
              refreshIconSize={16}
              selectClassName="appearance-none rounded-lg border border-gray-200 dark:border-neutral-700 pl-3 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              onRefresh={onRefresh}
              onMoveToFolder={onMoveToFolder}
              showFolderInputIcon
            />
          ) : (
            <button
              onClick={onShowAddFolder}
              className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              Folder
            </button>
          )}
        </div>
      </header>

      {selectedSource ? (
        <div className="px-4">
          <FeedList
            items={items}
            isLoading={isLoadingSourceFeed}
            emptyMessage="No articles"
            emptyDescription="This source has no articles to display."
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
          <FolderOpen size={36} strokeWidth={1.5} className="mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
            Select a feed source
          </p>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
            Choose a source from the sidebar to view its articles.
          </p>
        </div>
      )}
    </div>
  );
}
