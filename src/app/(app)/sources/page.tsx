"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useFeedStore from "@/stores/feed-store";
import useToastStore from "@/stores/toast-store";
import AddFeedDialog from "@/components/sources/add-feed-dialog";
import { ConfirmDialog } from "@/components/ui/dialog";
import SourceListItem from "@/components/pages/sources/components/source-list-item";
import SourcesEmptyState from "@/components/pages/sources/components/sources-empty-state";
import SourcesPageHeader from "@/components/pages/sources/components/sources-page-header";

export default function SourcesPage() {
  const router = useRouter();
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
      <SourcesPageHeader
        hasSources={sources.length > 0}
        searchQuery={searchQuery}
        onOpenAddFeed={() => setShowAddFeed(true)}
        onSearchChange={setSearchQuery}
        onClearSearch={() => setSearchQuery("")}
      />

      {sources.length === 0 ? (
        <SourcesEmptyState type="empty" />
      ) : filteredSources.length === 0 ? (
        <SourcesEmptyState type="search" />
      ) : (
        <div className="divide-y divide-gray-100 dark:divide-neutral-800 px-2 sm:px-4">
          {filteredSources.map((source, i) => (
            <SourceListItem
              key={source.id}
              source={source}
              folders={folders}
              animationDelayMs={Math.min(i * 30, 300)}
              onOpenSource={(sourceId) =>
                router.push(`/feeds?source=${encodeURIComponent(sourceId)}`)
              }
              onMoveToFolder={moveSourceToFolder}
              onDelete={setDeleteTarget}
            />
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
