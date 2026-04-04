import { Plus, Search, X } from "lucide-react";

interface SourcesPageHeaderProps {
  hasSources: boolean;
  searchQuery: string;
  onOpenAddFeed: () => void;
  onSearchChange: (value: string) => void;
  onClearSearch: () => void;
}

export default function SourcesPageHeader({
  hasSources,
  searchQuery,
  onOpenAddFeed,
  onSearchChange,
  onClearSearch,
}: SourcesPageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
      <div className="px-4 sm:px-6 py-5 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
          My Sources
        </h1>
        <button
          onClick={onOpenAddFeed}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 px-3.5 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer press-scale"
        >
          <Plus size={16} />
          Add Feed
        </button>
      </div>

      {hasSources && (
        <div className="px-4 sm:px-6 pb-4">
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search your sources..."
              className="w-full rounded-xl border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-900 pl-10 pr-8 py-3 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={onClearSearch}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 hover:text-gray-600 dark:hover:text-neutral-300 cursor-pointer"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
