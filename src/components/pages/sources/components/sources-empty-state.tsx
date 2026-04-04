import { Rss, Search } from "lucide-react";

interface SourcesEmptyStateProps {
  type: "empty" | "search";
}

export default function SourcesEmptyState({ type }: SourcesEmptyStateProps) {
  if (type === "search") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
        <Search size={36} strokeWidth={1.5} className="mb-3" />
        <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
          No matching sources
        </p>
        <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1">
          Try a different search term.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 dark:text-neutral-500">
      <Rss size={36} strokeWidth={1.5} className="mb-3" />
      <p className="text-sm font-medium text-gray-500 dark:text-neutral-400">
        No sources yet
      </p>
      <p className="text-xs text-gray-400 dark:text-neutral-500 mt-1 text-center max-w-xs">
        Add RSS feeds using a website URL or direct RSS link to start following
        your favorite sources.
      </p>
    </div>
  );
}
