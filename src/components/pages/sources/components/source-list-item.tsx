import { ExternalLink, Trash2 } from "lucide-react";
import type { FeedSource, Folder } from "@/lib/types";
import SourceIcon from "@/components/ui/source-icon";

interface SourceListItemProps {
  source: FeedSource;
  folders: Folder[];
  animationDelayMs: number;
  onOpenSource: (sourceId: string) => void;
  onMoveToFolder: (sourceId: string, folderId: string) => void;
  onDelete: (sourceId: string) => void;
}

export default function SourceListItem({
  source,
  folders,
  animationDelayMs,
  onOpenSource,
  onMoveToFolder,
  onDelete,
}: SourceListItemProps) {
  return (
    <div
      className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors animate-feed-item"
      style={{ animationDelay: `${animationDelayMs}ms` }}
    >
      <button
        type="button"
        onClick={() => onOpenSource(source.id)}
        className="flex flex-1 min-w-0 items-center gap-4 text-left cursor-pointer"
      >
        <SourceIcon
          siteUrl={source.siteUrl}
          imageUrl={source.imageUrl}
          size={36}
          className="rounded-lg"
        />

        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
            {source.title}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 justify-between flex-wrap">
            <span className="text-xs text-gray-400 dark:text-neutral-500 truncate w-auto">
              {source.url}
            </span>
          </div>
        </div>
      </button>

      <div className="flex items-center gap-1 shrink-0">
        <select
          value={source.folderId}
          onChange={(event) => onMoveToFolder(source.id, event.target.value)}
          onClick={(event) => event.stopPropagation()}
          className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded px-1.5 py-0.5 border-none cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          {folders.map((folder) => (
            <option key={folder.id} value={folder.id}>
              {folder.name}
            </option>
          ))}
        </select>
        <a
          href={source.siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg p-1.5 text-gray-300 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
          title="Visit site"
          onClick={(event) => event.stopPropagation()}
        >
          <ExternalLink size={15} />
        </a>
        <button
          onClick={() => onDelete(source.id)}
          className="rounded-lg p-1.5 text-gray-300 dark:text-neutral-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
          title="Remove source"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
