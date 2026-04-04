import { FolderOpen, Plus } from "lucide-react";
import FeedTree from "@/components/feeds/feed-tree";

interface FeedsMobileTreeProps {
  hasFeeds: boolean;
  selectedSourceId: string | null;
  onShowAddFolder: () => void;
  onSourceSelect: (sourceId: string) => void;
  onDeleteFolder: (folderId: string) => void;
}

export default function FeedsMobileTree({
  hasFeeds,
  selectedSourceId,
  onShowAddFolder,
  onSourceSelect,
  onDeleteFolder,
}: FeedsMobileTreeProps) {
  return (
    <div className="lg:hidden">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
            Feeds
          </h1>
          <button
            onClick={onShowAddFolder}
            className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <Plus size={15} />
            Folder
          </button>
        </div>
      </header>

      {!hasFeeds ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
          <FolderOpen size={36} strokeWidth={1.5} className="mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
            No feeds yet
          </p>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 text-center max-w-xs">
            Add RSS sources from the Sources page, then organize them into
            folders here.
          </p>
        </div>
      ) : (
        <div className="px-3 py-3">
          <FeedTree
            onSourceSelect={onSourceSelect}
            selectedSourceId={selectedSourceId}
            onAddFolder={onShowAddFolder}
            onDeleteFolder={onDeleteFolder}
          />
        </div>
      )}
    </div>
  );
}
