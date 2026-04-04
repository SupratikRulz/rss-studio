import { useCallback, useState } from "react";
import useFeedStore from "@/stores/feed-store";
import useToastStore from "@/stores/toast-store";
import { addFolderInputSchema } from "@/lib/schemas";
import type { DiscoverSource } from "@/lib/discover-sources";
import type {
  DiscoveredFeed,
  PendingFollow,
} from "@/components/pages/search/types";

export default function useFollowSource() {
  const { sources, folders, addSource, addFolder } = useFeedStore();
  const [pendingFollow, setPendingFollow] = useState<PendingFollow | null>(null);
  const [folderId, setFolderId] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderError, setFolderError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [subscribingUrl, setSubscribingUrl] = useState<string | null>(null);

  const isSubscribed = useCallback(
    (url: string) => {
      const normalized = url.trim().toLowerCase().replace(/\/+$/, "");
      return sources.some(
        (source) =>
          source.url.trim().toLowerCase().replace(/\/+$/, "") === normalized
      );
    },
    [sources]
  );

  const getSubscribedSource = useCallback(
    (url: string) => {
      const normalized = url.trim().toLowerCase().replace(/\/+$/, "");
      return sources.find(
        (source) =>
          source.url.trim().toLowerCase().replace(/\/+$/, "") === normalized
      );
    },
    [sources]
  );

  const resetFolderDialog = useCallback(() => {
    setPendingFollow(null);
    setFolderId(folders[0]?.id || "");
    setShowNewFolder(false);
    setNewFolderName("");
    setFolderError("");
    setIsSaving(false);
  }, [folders]);

  const openFolderPicker = useCallback(
    (source: PendingFollow) => {
      setPendingFollow(source);
      setFolderId(folders[0]?.id || "");
      setShowNewFolder(false);
      setNewFolderName("");
      setFolderError("");
      setIsSaving(false);
    },
    [folders]
  );

  const handleFollowConfirm = useCallback(async () => {
    if (!pendingFollow) {
      return;
    }

    setFolderError("");
    let targetFolderId = folderId;

    if (showNewFolder) {
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

      targetFolderId = folder.id;
    }

    setIsSaving(true);
    setSubscribingUrl(pendingFollow.url);

    const addPendingSource = (overrides?: {
      title?: string;
      siteUrl?: string;
      description?: string;
      imageUrl?: string;
    }) =>
      addSource({
        title: overrides?.title || pendingFollow.title,
        url: pendingFollow.url,
        siteUrl: overrides?.siteUrl || pendingFollow.siteUrl,
        description: overrides?.description || pendingFollow.description,
        imageUrl: overrides?.imageUrl || pendingFollow.imageUrl,
        folderId: targetFolderId,
      });

    try {
      const res = await fetch("/api/rss/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pendingFollow.url }),
      });

      if (res.ok) {
        const feed = await res.json();
        const added = addPendingSource({
          title: feed.title,
          siteUrl: feed.link,
          description: feed.description,
          imageUrl: feed.imageUrl,
        });

        if (!added) {
          setFolderError("This feed source is already added.");
          setIsSaving(false);
          setSubscribingUrl(null);
          return;
        }

        useToastStore
          .getState()
          .addToast(`"${added.title}" added to My Sources.`, "success");
      } else {
        const added = addPendingSource();
        if (!added) {
          setFolderError("This feed source is already added.");
          setIsSaving(false);
          setSubscribingUrl(null);
          return;
        }

        useToastStore
          .getState()
          .addToast(
            "Subscribed, but we couldn't verify the feed right now.",
            "info"
          );
      }
    } catch {
      const added = addPendingSource();
      if (!added) {
        setFolderError("This feed source is already added.");
        setIsSaving(false);
        setSubscribingUrl(null);
        return;
      }

      useToastStore
        .getState()
        .addToast(
          "Subscribed, but we couldn't verify the feed right now.",
          "info"
        );
    }

    setSubscribingUrl(null);
    resetFolderDialog();
  }, [
    addFolder,
    addSource,
    folderId,
    newFolderName,
    pendingFollow,
    resetFolderDialog,
    showNewFolder,
  ]);

  const handleFollowSource = useCallback(
    (source: DiscoverSource) => {
      if (isSubscribed(source.url) || subscribingUrl) {
        return;
      }

      openFolderPicker({
        title: source.title,
        url: source.url,
        siteUrl: source.siteUrl,
        description: source.description,
      });
    },
    [isSubscribed, openFolderPicker, subscribingUrl]
  );

  const handleFollowFeed = useCallback(
    (feed: DiscoveredFeed) => {
      if (isSubscribed(feed.feedUrl)) {
        return;
      }

      openFolderPicker({
        title: feed.title || feed.feedUrl,
        url: feed.feedUrl,
        siteUrl: feed.link || feed.feedUrl,
        description: feed.description || "",
        imageUrl: feed.imageUrl,
      });
    },
    [isSubscribed, openFolderPicker]
  );

  return {
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
  };
}
