"use client";

import { useState, useEffect } from "react";
import {
  FolderOpen,
  Plus,
  ArrowLeft,
  Rss,
  FolderInput,
  ChevronDown,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useFeedStore from "@/stores/feed-store";
import Dialog, { ConfirmDialog } from "@/components/ui/dialog";
import FeedTree from "@/components/feeds/feed-tree";
import FeedList from "@/components/feed/feed-list";
import { addFolderInputSchema } from "@/lib/schemas";
import SourceIcon from "@/components/ui/source-icon";

export default function FeedsPage() {
  const {
    folders,
    sources,
    addFolder,
    removeFolder,
    selectedSourceId,
    sourceFeedItems,
    isLoadingSourceFeed,
    fetchSourceFeed,
    setSelectedSourceId,
    moveSourceToFolder,
  } = useFeedStore();

  const [showAddFolder, setShowAddFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderError, setFolderError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [mobileShowArticles, setMobileShowArticles] = useState(false);

  const selectedSource = sources.find((s) => s.id === selectedSourceId);

  useEffect(() => {
    if (selectedSourceId && sourceFeedItems.length === 0 && !isLoadingSourceFeed) {
      fetchSourceFeed(selectedSourceId);
    }
  }, [selectedSourceId, sourceFeedItems.length, isLoadingSourceFeed, fetchSourceFeed]);

  function handleSourceSelect(sourceId: string) {
    fetchSourceFeed(sourceId);
    setMobileShowArticles(true);
  }

  function handleMobileBack() {
    setMobileShowArticles(false);
    setSelectedSourceId(null);
  }

  function handleAddFolder(e: React.FormEvent) {
    e.preventDefault();
    setFolderError("");

    const result = addFolderInputSchema.safeParse({ name: newFolderName });
    if (!result.success) {
      setFolderError(result.error.issues[0].message);
      return;
    }

    const folder = addFolder(newFolderName);
    if (!folder) {
      setFolderError("A folder with this name already exists.");
      return;
    }
    setNewFolderName("");
    setShowAddFolder(false);
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* ── Mobile: tree view ────────────────────────────────── */}
      <div className={mobileShowArticles ? "hidden" : "lg:hidden"}>
        <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
          <div className="px-4 py-5 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Feeds</h1>
            <button
              onClick={() => setShowAddFolder(true)}
              className="flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2 text-sm font-medium text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <Plus size={15} />
              Folder
            </button>
          </div>
        </header>

        {sources.length === 0 && folders.length <= 1 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
            <FolderOpen size={36} strokeWidth={1.5} className="mb-3" />
            <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">No feeds yet</p>
            <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 text-center max-w-xs">
              Add RSS sources from the Sources page, then organize them into
              folders here.
            </p>
          </div>
        ) : (
          <div className="px-3 py-3">
            <FeedTree
              onSourceSelect={handleSourceSelect}
              selectedSourceId={selectedSourceId}
              onAddFolder={() => setShowAddFolder(true)}
              onDeleteFolder={(id) => setDeleteTarget(id)}
            />
          </div>
        )}
      </div>

      {/* ── Mobile: article list (slides in) ─────────────────── */}
      <div className={mobileShowArticles ? "lg:hidden" : "hidden"}>
        <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              onClick={handleMobileBack}
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
            <div className="flex items-center gap-1 shrink-0">
              {selectedSourceId && (
                <button
                  onClick={() => fetchSourceFeed(selectedSourceId, true)}
                  disabled={isLoadingSourceFeed}
                  title="Refresh feed"
                  className="rounded-lg p-2 text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <RefreshCw size={15} strokeWidth={2} className={cn(isLoadingSourceFeed && "animate-spin")} />
                </button>
              )}
              {selectedSource && (
                <div className="relative">
                  <select
                    value={selectedSource.folderId}
                    onChange={(e) =>
                      moveSourceToFolder(selectedSource.id, e.target.value)
                    }
                    className="min-w-20 appearance-none rounded-lg border border-gray-200 dark:border-neutral-700 pl-2 pr-7 py-1.5 text-xs font-medium text-gray-600 dark:text-neutral-300 bg-white dark:bg-neutral-800 cursor-pointer focus:outline-none focus:ring-1 focus:ring-emerald-400"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={12} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="px-2">
          <FeedList
            items={sourceFeedItems}
            isLoading={isLoadingSourceFeed}
            emptyMessage="No articles"
            emptyDescription="This source has no articles to display."
          />
        </div>
      </div>

      {/* ── Desktop: article list (tree is in sidebar) ───────── */}
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
              <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">Feeds</h1>
            )}
            {selectedSource ? (
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => fetchSourceFeed(selectedSource.id, true)}
                  disabled={isLoadingSourceFeed}
                  title="Refresh feed"
                  className="rounded-lg p-2 text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                >
                  <RefreshCw size={16} strokeWidth={2} className={cn(isLoadingSourceFeed && "animate-spin")} />
                </button>
                <FolderInput size={15} className="text-gray-400 dark:text-neutral-500" />
                <div className="relative">
                  <select
                    value={selectedSource.folderId}
                    onChange={(e) =>
                      moveSourceToFolder(selectedSource.id, e.target.value)
                    }
                    className="appearance-none rounded-lg border border-gray-200 dark:border-neutral-700 pl-3 pr-8 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  >
                    {folders.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500" />
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddFolder(true)}
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
              items={sourceFeedItems}
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

      {/* ── Dialogs ──────────────────────────────────────────── */}
      <Dialog
        open={showAddFolder}
        onClose={() => {
          setShowAddFolder(false);
          setNewFolderName("");
          setFolderError("");
        }}
        title="New Folder"
      >
        <form onSubmit={handleAddFolder} className="space-y-4">
          <div>
            <label
              htmlFor="folder-name"
              className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
            >
              Folder Name
            </label>
            <input
              id="folder-name"
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="e.g. Technology, News, Science"
              className="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              autoFocus
            />
            {folderError && (
              <p className="text-xs text-red-500 mt-1.5">{folderError}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
          >
            Create Folder
          </button>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) removeFolder(deleteTarget);
          setDeleteTarget(null);
        }}
        title="Delete Folder"
        message="Are you sure you want to delete this folder? Feeds in this folder will be moved to General."
        confirmLabel="Delete"
        variant="danger"
      />
    </div>
  );
}
