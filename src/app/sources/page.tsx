"use client";

import { useState, useMemo } from "react";
import { Plus, Rss, Trash2, ExternalLink, Search, X } from "lucide-react";
import useFeedStore from "@/stores/feed-store";
import useToastStore from "@/stores/toast-store";
import AddFeedDialog from "@/components/sources/add-feed-dialog";
import { ConfirmDialog } from "@/components/ui/dialog";
import SourceIcon from "@/components/ui/source-icon";

export default function SourcesPage() {
  const { sources, folders, removeSource, moveSourceToFolder } = useFeedStore();
  const [showAddFeed, setShowAddFeed] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredSources = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return sources;
    return sources.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.url.toLowerCase().includes(q) ||
        s.siteUrl.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q)
    );
  }, [sources, searchQuery]);

  return (
    <div className="max-w-3xl mx-auto pb-12 lg:pb-0 animate-page">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-5 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
            My Sources
          </h1>
          <button
            onClick={() => setShowAddFeed(true)}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer press-scale"
          >
            <Plus size={16} />
            Add Feed
          </button>
        </div>

        {sources.length > 0 && (
          <div className="px-4 sm:px-6 pb-4">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search your sources..."
                className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 pl-10 pr-8 py-3 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 cursor-pointer"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {sources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
          <Rss size={36} strokeWidth={1.5} className="mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">No sources yet</p>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 text-center max-w-xs">
            Add RSS feeds using a website URL or direct RSS link to start
            following your favorite sources.
          </p>
        </div>
      ) : filteredSources.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
          <Search size={36} strokeWidth={1.5} className="mb-3" />
          <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
            No matching sources
          </p>
          <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
            Try a different search term.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-neutral-800 px-2 sm:px-4">
          {filteredSources.map((source, i) => (
            <div
              key={source.id}
              className="group flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors animate-feed-item"
              style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
            >
              <SourceIcon
                siteUrl={source.siteUrl}
                imageUrl={source.imageUrl}
                size={36}
                className="rounded-lg"
              />

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                  {source.title}
                </h3>
                <div className="flex items-center gap-2 mt-0.5 justify-between flex-wrap">
                  <span className="text-xs text-gray-400 dark:text-neutral-500 truncate w-auto">
                    {source.url}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <select
                  value={source.folderId}
                  onChange={(e) =>
                    moveSourceToFolder(source.id, e.target.value)
                  }
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 rounded px-1.5 py-0.5 border-none cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-400"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
                <a
                  href={source.siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg p-1.5 text-gray-300 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
                  title="Visit site"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink size={15} />
                </a>
                <button
                  onClick={() => setDeleteTarget(source.id)}
                  className="rounded-lg p-1.5 text-gray-300 dark:text-neutral-600 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition-colors lg:opacity-0 lg:group-hover:opacity-100 cursor-pointer"
                  title="Remove source"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AddFeedDialog open={showAddFeed} onClose={() => setShowAddFeed(false)} />

      <ConfirmDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            const source = sources.find((s) => s.id === deleteTarget);
            removeSource(deleteTarget);
            useToastStore.getState().addToast(`"${source?.title || "Source"}" removed.`, "success");
          }
          setDeleteTarget(null);
        }}
        title="Remove Source"
        message="Are you sure you want to unfollow this source? You will no longer see its articles in your feed."
        confirmLabel="Remove"
        variant="danger"
      />
    </div>
  );
}
