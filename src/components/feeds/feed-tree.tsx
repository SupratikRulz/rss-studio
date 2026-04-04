"use client";

import { useState } from "react";
import {
  ChevronRight,
  FolderOpen,
  Folder,
  Plus,
  Minus,
} from "lucide-react";
import useFeedStore from "@/stores/feed-store";
import { DEFAULT_FOLDER_ID } from "@/lib/constants";
import { cn } from "@/lib/utils";
import SourceIcon from "@/components/ui/source-icon";

interface FeedTreeProps {
  onSourceSelect: (sourceId: string) => void;
  selectedSourceId?: string | null;
  onAddFolder?: () => void;
  onDeleteFolder?: (folderId: string) => void;
  compact?: boolean;
}

export default function FeedTree({
  onSourceSelect,
  selectedSourceId,
  onAddFolder,
  onDeleteFolder,
  compact = false,
}: FeedTreeProps) {
  const { folders, sources } = useFeedStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(
    () => new Set(folders.map((f) => f.id))
  );

  function toggleFolder(folderId: string) {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) next.delete(folderId);
      else next.add(folderId);
      return next;
    });
  }

  function getSourcesForFolder(folderId: string) {
    return sources.filter((s) => s.folderId === folderId);
  }

  return (
    <div className={cn("select-none", compact ? "text-[13px]" : "text-sm")}>
      {onAddFolder && (
        <button
          onClick={onAddFolder}
          className={cn(
            "w-full flex items-center gap-2 rounded-md transition-colors text-left text-gray-500 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-700 dark:hover:text-neutral-200 mb-1 cursor-pointer",
            compact ? "px-1.5 py-1" : "px-2 py-1.5"
          )}
        >
          <Plus size={compact ? 13 : 14} className="shrink-0" />
          <span className="font-medium">Add folder</span>
        </button>
      )}

      {folders.length === 0 && (
        <div className="py-4 px-3 text-xs text-gray-400 dark:text-neutral-500 text-center">
          No folders yet
        </div>
      )}

      <div>
        {folders.map((folder) => {
          const folderSources = getSourcesForFolder(folder.id);
          const isExpanded = expandedFolders.has(folder.id);
          const isDefault = folder.id === DEFAULT_FOLDER_ID;
          const FolderIcon = isExpanded ? FolderOpen : Folder;

          return (
            <div key={folder.id}>
              <div className="flex items-center group">
                <button
                  onClick={() => toggleFolder(folder.id)}
                  className={cn(
                    "flex-1 flex items-center gap-2 rounded-md transition-colors text-left min-w-0 cursor-pointer",
                    compact ? "px-1.5 py-1" : "px-2 py-1.5",
                    "hover:bg-gray-100 dark:hover:bg-neutral-800"
                  )}
                >
                  <ChevronRight
                    size={compact ? 12 : 14}
                    className={cn(
                      "text-gray-400 dark:text-neutral-500 transition-transform shrink-0 duration-150",
                      isExpanded && "rotate-90"
                    )}
                  />
                  <FolderIcon
                    size={compact ? 14 : 16}
                    className="text-emerald-500 dark:text-emerald-400 shrink-0"
                  />
                  <span className="font-medium text-gray-800 dark:text-neutral-200 truncate">
                    {folder.name}
                  </span>
                  {folderSources.length > 0 && (
                    <span className="text-[10px] text-gray-400 dark:text-neutral-500 ml-auto shrink-0 tabular-nums pr-1">
                      {folderSources.length}
                    </span>
                  )}
                </button>

                {!isDefault && onDeleteFolder && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteFolder(folder.id);
                    }}
                    className={cn(
                      "rounded p-1 text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors shrink-0 mr-0.5 cursor-pointer",
                      compact
                        ? "opacity-0 group-hover:opacity-100"
                        : "opacity-100"
                    )}
                    title="Delete folder"
                  >
                    <Minus size={compact ? 12 : 14} />
                  </button>
                )}
              </div>

              {isExpanded && (
                <div
                  className={cn(
                    "border-l border-gray-200 dark:border-neutral-700",
                    compact ? "ml-[14px] pl-2" : "ml-[16px] pl-2.5"
                  )}
                >
                  {folderSources.length === 0 ? (
                    <div className={cn("py-1", compact ? "pl-2" : "pl-2.5")}>
                      <span
                        className={cn(
                          "text-gray-400 dark:text-neutral-500 italic",
                          compact ? "text-[11px]" : "text-xs"
                        )}
                      >
                        No feeds
                      </span>
                    </div>
                  ) : (
                    folderSources.map((source) => {
                      const isSelected = selectedSourceId === source.id;

                      return (
                        <button
                          key={source.id}
                          onClick={() => onSourceSelect(source.id)}
                          className={cn(
                            "w-full flex items-center gap-2 rounded-md transition-colors text-left min-w-0 cursor-pointer",
                            compact ? "px-2 py-1" : "px-2.5 py-1.5",
                            isSelected
                              ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400"
                              : "text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-900 dark:hover:text-neutral-200"
                          )}
                        >
                          <SourceIcon
                            siteUrl={source.siteUrl}
                            imageUrl={source.imageUrl}
                            size={compact ? 14 : 16}
                          />
                          <span className="truncate">{source.title}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
