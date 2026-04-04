import { Shimmer } from "@/components/ui/skeleton";

export default function SearchPageFallback() {
  return (
    <div className="max-w-7xl mx-auto pb-12 lg:pb-0 animate-page">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-4">
          <Shimmer className="h-12 w-full rounded-xl" />
        </div>
      </header>
    </div>
  );
}
