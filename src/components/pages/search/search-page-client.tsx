"use client";

import { useRouter, useSearchParams } from "next/navigation";
import SearchHeader from "./components/search-header";
import SearchContent from "./components/search-content";
import CategoryDetailView from "./components/category-detail-view";
import FolderPickerDialog from "./components/folder-picker-dialog";
import useFollowSource from "@/hooks/pages/search/use-follow-source";
import useSearchQuery from "@/hooks/pages/search/use-search-query";
import useSearchTopic from "@/hooks/pages/search/use-search-topic";
import useSourcePreview from "@/hooks/pages/search/use-source-preview";

export default function SearchPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { query, searchResult, isSearching, handleQueryChange, handleSearch } =
    useSearchQuery();
  const { selectedCategory, openCategory, closeCategory } = useSearchTopic(
    searchParams,
    router
  );
  const {
    folders,
    pendingFollow,
    folderId,
    showNewFolder,
    newFolderName,
    folderError,
    isSaving,
    subscribingUrl,
    setFolderId,
    setShowNewFolder,
    setNewFolderName,
    resetFolderDialog,
    handleFollowConfirm,
    handleFollowSource,
    handleFollowFeed,
    isSubscribed,
    getSubscribedSource,
  } = useFollowSource();
  const { sourcePreviews, handlePreviewSource } = useSourcePreview();

  if (selectedCategory) {
    return (
      <>
        <CategoryDetailView
          category={selectedCategory}
          subscribingUrl={subscribingUrl}
          sourcePreviews={sourcePreviews}
          getSubscribedSource={getSubscribedSource}
          onClose={closeCategory}
          onPreviewSource={handlePreviewSource}
          onFollowSource={handleFollowSource}
        />
        <FolderPickerDialog
          open={pendingFollow !== null}
          onClose={resetFolderDialog}
          onConfirm={handleFollowConfirm}
          folders={folders}
          folderId={folderId}
          setFolderId={setFolderId}
          showNewFolder={showNewFolder}
          setShowNewFolder={setShowNewFolder}
          newFolderName={newFolderName}
          setNewFolderName={setNewFolderName}
          error={folderError}
          isSaving={isSaving}
          sourceName={pendingFollow?.title || ""}
        />
      </>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-12 lg:pb-0 animate-page">
      <SearchHeader
        query={query}
        isSearching={isSearching}
        onQueryChange={handleQueryChange}
        onSubmit={handleSearch}
      />
      <SearchContent
        query={query}
        searchResult={searchResult}
        isSubscribed={isSubscribed}
        onFollowFeed={handleFollowFeed}
        onOpenCategory={openCategory}
      />
      <FolderPickerDialog
        open={pendingFollow !== null}
        onClose={resetFolderDialog}
        onConfirm={handleFollowConfirm}
        folders={folders}
        folderId={folderId}
        setFolderId={setFolderId}
        showNewFolder={showNewFolder}
        setShowNewFolder={setShowNewFolder}
        newFolderName={newFolderName}
        setNewFolderName={setNewFolderName}
        error={folderError}
        isSaving={isSaving}
        sourceName={pendingFollow?.title || ""}
      />
    </div>
  );
}
