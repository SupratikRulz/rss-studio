import { Loader2, Search } from "lucide-react";

interface SearchHeaderProps {
  query: string;
  isSearching: boolean;
  onQueryChange: (value: string) => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function SearchHeader({
  query,
  isSearching,
  onQueryChange,
  onSubmit,
}: SearchHeaderProps) {
  return (
    <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
      <div className="px-4 sm:px-6 py-4">
        <form onSubmit={onSubmit} className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-neutral-500 pointer-events-none"
          />
          <input
            type="text"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
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
  );
}
