import { FolderInput, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedSource, Folder } from "@/lib/types";
import NativeSelect from "@/components/ui/native-select";

interface FeedSourceToolbarProps {
  selectedSource: FeedSource;
  folders: Folder[];
  isLoadingSourceFeed: boolean;
  refreshIconSize: number;
  selectClassName: string;
  onRefresh: () => void;
  onMoveToFolder: (folderId: string) => void;
  showFolderInputIcon?: boolean;
}

export default function FeedSourceToolbar({
  selectedSource,
  folders,
  isLoadingSourceFeed,
  refreshIconSize,
  selectClassName,
  onRefresh,
  onMoveToFolder,
  showFolderInputIcon = false,
}: FeedSourceToolbarProps) {
  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        onClick={onRefresh}
        disabled={isLoadingSourceFeed}
        title="Refresh feed"
        className="rounded-lg p-2 text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
      >
        <RefreshCw
          size={refreshIconSize}
          strokeWidth={2}
          className={cn(isLoadingSourceFeed && "animate-spin")}
        />
      </button>
      {showFolderInputIcon && (
        <FolderInput size={15} className="text-gray-400 dark:text-neutral-500" />
      )}
      <NativeSelect
        value={selectedSource.folderId}
        onChange={(event) => onMoveToFolder(event.target.value)}
        className={selectClassName}
        iconSize={showFolderInputIcon ? 14 : 12}
      >
        {folders.map((folder) => (
          <option key={folder.id} value={folder.id}>
            {folder.name}
          </option>
        ))}
      </NativeSelect>
    </div>
  );
}
