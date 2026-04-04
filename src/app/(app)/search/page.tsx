"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import {
  Search,
  Plus,
  Check,
  ChevronLeft,
  Loader2,
  ExternalLink,
  Rss,
  Globe,
} from "lucide-react";
import { cn } from "@/lib/utils";
import useFeedStore from "@/stores/feed-store";
import useToastStore from "@/stores/toast-store";
import {
  DISCOVER_SECTIONS,
  searchDiscoverSources,
  type DiscoverCategory,
  type DiscoverSource,
} from "@/lib/discover-sources";
import SourceIcon from "@/components/ui/source-icon";
import Dialog from "@/components/ui/dialog";
import { addFolderInputSchema } from "@/lib/schemas";

interface PendingFollow {
  title: string;
  url: string;
  siteUrl: string;
  description: string;
  imageUrl?: string;
}

type SearchResult =
  | { type: "keyword"; categories: DiscoverCategory[] }
  | {
      type: "feed";
      feed: {
        title: string;
        description: string;
        link: string;
        feedUrl: string;
        imageUrl?: string;
      };
      items: {
        id: string;
        title: string;
        link: string;
        description: string;
        imageUrl?: string;
        pubDate: string;
      }[];
    };

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] =
    useState<DiscoverCategory | null>(null);
  const [subscribingUrl, setSubscribingUrl] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Folder picker dialog state
  const [pendingFollow, setPendingFollow] = useState<PendingFollow | null>(null);
  const [folderId, setFolderId] = useState("");
  const [showNewFolder, setShowNewFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");
  const [folderError, setFolderError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { sources, folders, addSource, addFolder } = useFeedStore();

  const isSubscribed = useCallback(
    (url: string) => {
      const normalized = url.trim().toLowerCase().replace(/\/+$/, "");
      return sources.some(
        (s) => s.url.trim().toLowerCase().replace(/\/+$/, "") === normalized
      );
    },
    [sources]
  );

  function resetFolderDialog() {
    setPendingFollow(null);
    setFolderId(folders[0]?.id || "");
    setShowNewFolder(false);
    setNewFolderName("");
    setFolderError("");
    setIsSaving(false);
  }

  function openFolderPicker(source: PendingFollow) {
    setPendingFollow(source);
    setFolderId(folders[0]?.id || "");
    setShowNewFolder(false);
    setNewFolderName("");
    setFolderError("");
    setIsSaving(false);
  }

  async function handleFollowConfirm() {
    if (!pendingFollow) return;
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

    try {
      const res = await fetch("/api/rss/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: pendingFollow.url }),
      });

      if (res.ok) {
        const feed = await res.json();
        const added = addSource({
          title: feed.title || pendingFollow.title,
          url: pendingFollow.url,
          siteUrl: feed.link || pendingFollow.siteUrl,
          description: feed.description || pendingFollow.description,
          imageUrl: feed.imageUrl || pendingFollow.imageUrl,
          folderId: targetFolderId,
        });
        if (!added) {
          setFolderError("This feed source is already added.");
          setIsSaving(false);
          setSubscribingUrl(null);
          return;
        }
        useToastStore.getState().addToast(`"${added.title}" added to My Sources.`, "success");
      } else {
        const added = addSource({
          title: pendingFollow.title,
          url: pendingFollow.url,
          siteUrl: pendingFollow.siteUrl,
          description: pendingFollow.description,
          imageUrl: pendingFollow.imageUrl,
          folderId: targetFolderId,
        });
        if (!added) {
          setFolderError("This feed source is already added.");
          setIsSaving(false);
          setSubscribingUrl(null);
          return;
        }
        useToastStore.getState().addToast("Subscribed, but we couldn't verify the feed right now.", "info");
      }
    } catch {
      const added = addSource({
        title: pendingFollow.title,
        url: pendingFollow.url,
        siteUrl: pendingFollow.siteUrl,
        description: pendingFollow.description,
        imageUrl: pendingFollow.imageUrl,
        folderId: targetFolderId,
      });
      if (!added) {
        setFolderError("This feed source is already added.");
        setIsSaving(false);
        setSubscribingUrl(null);
        return;
      }
      useToastStore.getState().addToast("Subscribed, but we couldn't verify the feed right now.", "info");
    }

    setSubscribingUrl(null);
    resetFolderDialog();
  }

  function handleFollowSource(source: DiscoverSource) {
    if (isSubscribed(source.url) || subscribingUrl) return;
    openFolderPicker({
      title: source.title,
      url: source.url,
      siteUrl: source.siteUrl,
      description: source.description,
    });
  }

  function handleFollowFeed(feed: {
    title: string;
    description: string;
    link: string;
    feedUrl: string;
    imageUrl?: string;
  }) {
    if (isSubscribed(feed.feedUrl)) return;
    openFolderPicker({
      title: feed.title || feed.feedUrl,
      url: feed.feedUrl,
      siteUrl: feed.link || feed.feedUrl,
      description: feed.description || "",
      imageUrl: feed.imageUrl,
    });
  }

  function looksLikeUrl(input: string): boolean {
    return (
      input.startsWith("http://") ||
      input.startsWith("https://") ||
      (input.includes(".") && !input.includes(" "))
    );
  }

  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (!query.trim()) {
      setSearchResult(null);
      return;
    }

    if (looksLikeUrl(query.trim())) return;

    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      const categories = searchDiscoverSources(query.trim());
      setSearchResult({ type: "keyword", categories });
    }, 200);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [query]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;

    if (looksLikeUrl(query.trim())) {
      setIsSearching(true);
      try {
        const res = await fetch("/api/rss/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim() }),
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResult(data);
        } else {
          useToastStore.getState().addToast("No RSS feed found at this URL. Check the link and try again.");
        }
      } catch {
        useToastStore.getState().addToast("Search failed. Check your connection and try again.");
      }
      setIsSearching(false);
    }
  }

  // Category detail view
  if (selectedCategory) {
    return (
      <div className="max-w-3xl mx-auto pb-12 lg:pb-0 animate-page">
        <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
          <div className="px-4 sm:px-6 py-4 flex items-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className="rounded-lg p-2 -ml-2 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <ChevronLeft size={18} />
            </button>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
              {selectedCategory.name}
            </h1>
          </div>
        </header>

        <div className="px-4 sm:px-6 space-y-3">
          {selectedCategory.sources.map((source, i) => {
            const subscribed = isSubscribed(source.url);
            const loading = subscribingUrl === source.url;

            return (
              <div
                key={source.url}
                className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 transition-all duration-200 hover:-translate-y-0.5 animate-feed-item"
                style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}
              >
                <SourceIcon
                  siteUrl={source.siteUrl}
                  size={40}
                  className="rounded-lg shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 truncate">
                    {source.title}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                    {source.description}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={source.siteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg p-2 text-gray-300 dark:text-neutral-600 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-500 dark:hover:text-neutral-400 transition-colors cursor-pointer"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <button
                    onClick={() => handleFollowSource(source)}
                    disabled={subscribed || loading}
                    className={cn(
                      "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer press-scale",
                      subscribed
                        ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                    )}
                  >
                    {loading ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : subscribed ? (
                      <span className="flex items-center gap-1">
                        <Check size={12} />
                        Added
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <Plus size={12} />
                        Follow
                      </span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

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

  return (
    <div className="max-w-3xl mx-auto pb-12 lg:pb-0 animate-page">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-4">
          <form onSubmit={handleSearch} className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none"
            />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by topic, website, or RSS link"
              className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            {isSearching && (
              <Loader2
                size={16}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 animate-spin text-gray-400 dark:text-neutral-500"
              />
            )}
          </form>
        </div>
      </header>

      <div className="px-4 sm:px-6 pb-8">
        {/* URL search result: discovered feed */}
        {searchResult?.type === "feed" && searchResult.feed && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide mb-4">
              Discovered Feed
            </h2>
            <div className="rounded-xl border border-gray-100 dark:border-neutral-800 p-5 animate-feed-item">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                  <Rss
                    size={20}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-neutral-100 truncate">
                    {searchResult.feed.title || searchResult.feed.feedUrl}
                  </h3>
                  {searchResult.feed.description && (
                    <p className="text-xs text-gray-500 dark:text-neutral-400 mt-0.5 line-clamp-1">
                      {searchResult.feed.description}
                    </p>
                  )}
                  <p className="text-xs text-gray-400 dark:text-neutral-500 mt-0.5 truncate">
                    {searchResult.feed.feedUrl}
                  </p>
                </div>
                <button
                  onClick={() => handleFollowFeed(searchResult.feed!)}
                  disabled={isSubscribed(searchResult.feed!.feedUrl)}
                  className={cn(
                    "rounded-lg px-4 py-2 text-sm font-medium transition-colors cursor-pointer shrink-0 press-scale",
                    isSubscribed(searchResult.feed!.feedUrl)
                      ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400"
                      : "bg-emerald-600 text-white hover:bg-emerald-700"
                  )}
                >
                  {isSubscribed(searchResult.feed!.feedUrl) ? (
                    <span className="flex items-center gap-1.5">
                      <Check size={14} />
                      Following
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <Plus size={14} />
                      Follow
                    </span>
                  )}
                </button>
              </div>

              {searchResult.items.length > 0 && (
                <div className="border-t border-gray-100 dark:border-neutral-800 pt-3 space-y-2">
                  <p className="text-xs text-gray-400 dark:text-neutral-500 font-medium mb-2">
                    Latest articles
                  </p>
                  {searchResult.items.map((item) => (
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-sm text-gray-700 dark:text-neutral-300 hover:text-emerald-600 dark:hover:text-emerald-400 truncate transition-colors cursor-pointer"
                    >
                      {item.title}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Keyword search results */}
        {searchResult?.type === "keyword" &&
          searchResult.categories.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide mb-4">
                Search Results
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {searchResult.categories.map((cat, i) => (
                  <div key={cat.id} className="animate-feed-item" style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
                    <CategoryCard
                      category={cat}
                      onClick={() => setSelectedCategory(cat)}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

        {searchResult?.type === "keyword" &&
          searchResult.categories.length === 0 &&
          query.trim() && (
            <div className="flex flex-col items-center py-12 text-gray-400 dark:text-neutral-500">
              <Globe size={36} strokeWidth={1.5} className="mb-3" />
              <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
                No sources found
              </p>
              <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 text-center">
                Try a different keyword or paste an RSS feed URL directly.
              </p>
            </div>
          )}

        {/* Browse all categories when no search */}
        {!searchResult &&
          DISCOVER_SECTIONS.map((section) => (
            <div key={section.title} className="mb-8">
              <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide mb-4">
                {section.title}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {section.categories.map((cat, i) => (
                  <div key={cat.id} className="animate-feed-item" style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
                    <CategoryCard
                      category={cat}
                      onClick={() => setSelectedCategory(cat)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

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

function FolderPickerDialog({
  open,
  onClose,
  onConfirm,
  folders,
  folderId,
  setFolderId,
  showNewFolder,
  setShowNewFolder,
  newFolderName,
  setNewFolderName,
  error,
  isSaving,
  sourceName,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  folders: { id: string; name: string }[];
  folderId: string;
  setFolderId: (v: string) => void;
  showNewFolder: boolean;
  setShowNewFolder: (v: boolean) => void;
  newFolderName: string;
  setNewFolderName: (v: string) => void;
  error: string;
  isSaving: boolean;
  sourceName: string;
}) {
  return (
    <Dialog open={open} onClose={onClose} title="Choose Folder">
      <div className="space-y-4">
        <p className="text-sm text-gray-600 dark:text-neutral-400">
          Add <span className="font-medium text-gray-900 dark:text-neutral-100">{sourceName}</span> to a folder:
        </p>

        <div>
          {!showNewFolder ? (
            <div className="flex gap-2">
              <select
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
                autoFocus
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

        <div className="flex justify-end gap-3 pt-1">
          <button
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isSaving}
            className="rounded-lg px-4 py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-colors flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Adding…
              </>
            ) : (
              "Follow"
            )}
          </button>
        </div>
      </div>
    </Dialog>
  );
}

function CategoryCard({
  category,
  onClick,
}: {
  category: DiscoverCategory;
  onClick: () => void;
}) {
  const featured = category.sources[0];

  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border border-gray-100 dark:border-neutral-800 p-4 hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50/50 dark:hover:bg-neutral-900/50 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group w-full"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {category.name}
      </h3>
      {featured && (
        <div className="flex items-center gap-2">
          <SourceIcon
            siteUrl={featured.siteUrl}
            size={22}
            className="rounded shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-neutral-500">
              Featuring
            </p>
            <p className="text-xs text-gray-600 dark:text-neutral-300 font-medium truncate">
              {category.featured}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
