"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import useFeedStore from "@/stores/feed-store";
import { addFolderInputSchema } from "@/lib/schemas";
import FeedsDesktopView from "./components/feeds-desktop-view";
import FeedsFolderDialog from "./components/feeds-folder-dialog";
import FeedsMobileArticles from "./components/feeds-mobile-articles";
import FeedsMobileTree from "./components/feeds-mobile-tree";
import useFeedsSourceParam from "@/hooks/pages/feeds/use-feeds-source-param";

export default function FeedsPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const { mobileShowArticles, handleSourceSelect, handleMobileBack } =
    useFeedsSourceParam({
      router,
      searchParams,
      sources,
      selectedSourceId,
      sourceFeedItems,
      isLoadingSourceFeed,
      fetchSourceFeed,
      setSelectedSourceId,
    });

  const activeSourceId = searchParams.get("source") || selectedSourceId;
  const selectedSource = sources.find((source) => source.id === activeSourceId);
  const hasFeeds = sources.length > 0 || folders.length > 1;

  function handleAddFolder(event: React.FormEvent) {
    event.preventDefault();
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
    <div className="max-w-7xl mx-auto animate-page">
      {!mobileShowArticles ? (
        <FeedsMobileTree
          hasFeeds={hasFeeds}
          selectedSourceId={activeSourceId}
          onShowAddFolder={() => setShowAddFolder(true)}
          onSourceSelect={handleSourceSelect}
          onDeleteFolder={setDeleteTarget}
        />
      ) : (
        <FeedsMobileArticles
          selectedSourceId={activeSourceId}
          selectedSource={selectedSource}
          folders={folders}
          items={sourceFeedItems}
          isLoadingSourceFeed={isLoadingSourceFeed}
          onBack={handleMobileBack}
          onRefresh={() => activeSourceId && fetchSourceFeed(activeSourceId, true)}
          onMoveToFolder={(folderId) =>
            selectedSource && moveSourceToFolder(selectedSource.id, folderId)
          }
        />
      )}

      <FeedsDesktopView
        selectedSource={selectedSource}
        folders={folders}
        items={sourceFeedItems}
        isLoadingSourceFeed={isLoadingSourceFeed}
        onShowAddFolder={() => setShowAddFolder(true)}
        onRefresh={() => selectedSource && fetchSourceFeed(selectedSource.id, true)}
        onMoveToFolder={(folderId) =>
          selectedSource && moveSourceToFolder(selectedSource.id, folderId)
        }
      />

      <FeedsFolderDialog
        showAddFolder={showAddFolder}
        newFolderName={newFolderName}
        folderError={folderError}
        deleteTarget={deleteTarget}
        onCloseAddFolder={() => {
          setShowAddFolder(false);
          setNewFolderName("");
          setFolderError("");
        }}
        onFolderNameChange={setNewFolderName}
        onSubmit={handleAddFolder}
        onCloseDelete={() => setDeleteTarget(null)}
        onConfirmDelete={() => {
          if (deleteTarget) {
            removeFolder(deleteTarget);
          }
          setDeleteTarget(null);
        }}
      />
    </div>
  );
}
