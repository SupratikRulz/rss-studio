"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import Dialog from "@/components/ui/dialog";
import useFeedStore from "@/stores/feed-store";
import useToastStore from "@/stores/toast-store";
import { addFeedInputSchema, addFolderInputSchema } from "@/lib/schemas";

interface AddFeedDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function AddFeedDialog({ open, onClose }: AddFeedDialogProps) {
  const { folders, addSource, addFolder } = useFeedStore();
  const [url, setUrl] = useState("");
  const [folderId, setFolderId] = useState(folders[0]?.id || "");
  const [newFolderName, setNewFolderName] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  function resetForm() {
    setUrl("");
    setFolderId(folders[0]?.id || "");
    setNewFolderName("");
    setShowNewFolder(false);
    setError("");
    setIsLoading(false);
  }

  function handleClose() {
    resetForm();
    onClose();
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    let targetFolderId = folderId;

    if (showNewFolder) {
      const folderResult = addFolderInputSchema.safeParse({
        name: newFolderName,
      });
      if (!folderResult.success) {
        setError(folderResult.error.issues[0].message);
        return;
      }
      const folder = addFolder(newFolderName);
      if (!folder) {
        setError("A folder with this name already exists.");
        return;
      }
      targetFolderId = folder.id;
    }

    const inputResult = addFeedInputSchema.safeParse({
      url,
      folderId: targetFolderId,
    });
    if (!inputResult.success) {
      setError(inputResult.error.issues[0].message);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/rss/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error || "Failed to parse feed. Check the URL and try again.";
        setError(msg);
        useToastStore.getState().addToast(msg);
        setIsLoading(false);
        return;
      }

      const feed = await res.json();

      const source = addSource({
        title: feed.title || url,
        url,
        siteUrl: feed.link || url,
        description: feed.description || "",
        imageUrl: feed.imageUrl,
        folderId: targetFolderId,
      });

      if (!source) {
        setError("This feed source is already added.");
        setIsLoading(false);
        return;
      }

      useToastStore.getState().addToast(`"${source.title}" added to My Sources.`, "success");
      handleClose();
    } catch {
      setError("Failed to add feed. Please check the URL and try again.");
      useToastStore.getState().addToast("Failed to add RSS feed. Check the URL and try again.");
      setIsLoading(false);
    }
  }

  return (
    <Dialog open={open} onClose={handleClose} title="Add RSS Feed">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="feed-url"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
          >
            Website or RSS Feed URL
          </label>
          <input
            id="feed-url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/feed.xml"
            className="w-full rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            required
          />
        </div>

        <div>
          <label
            htmlFor="folder-select"
            className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
          >
            Add to Folder
          </label>
          {!showNewFolder ? (
            <div className="flex gap-2">
              <select
                id="folder-select"
                value={folderId}
                onChange={(e) => setFolderId(e.target.value)}
                className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-700 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 bg-white dark:bg-neutral-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              >
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewFolder(true)}
                className="flex items-center gap-1.5 rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2.5 text-sm text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                <Plus size={15} />
                New
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="New folder name"
                className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3.5 py-2.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => {
                  setShowNewFolder(false);
                  setNewFolderName("");
                }}
                className="rounded-lg border border-gray-200 dark:border-neutral-700 px-3 py-2.5 text-sm text-gray-600 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Checking feed…
            </>
          ) : (
            "Add Feed"
          )}
        </button>
      </form>
    </Dialog>
  );
}
