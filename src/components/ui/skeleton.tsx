import { cn } from "@/lib/utils";

interface ShimmerProps {
  className?: string;
}

export function Shimmer({ className }: ShimmerProps) {
  return <div className={cn("shimmer", className)} />;
}

export function FeedCardSkeleton() {
  return (
    <div className="flex gap-4 p-4">
      <div className="hidden sm:block shrink-0">
        <Shimmer className="w-28 h-20 rounded-lg" />
      </div>
      <div className="flex-1 min-w-0 space-y-3">
        <Shimmer className="h-4 w-3/4 rounded" />
        <div className="flex items-center gap-2">
          <Shimmer className="h-3 w-20 rounded" />
          <Shimmer className="h-3 w-16 rounded" />
        </div>
        <div className="space-y-1.5">
          <Shimmer className="h-3 w-full rounded" />
          <Shimmer className="h-3 w-5/6 rounded" />
        </div>
      </div>
    </div>
  );
}

export function FeedListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="divide-y divide-gray-100 dark:divide-neutral-800">
      {Array.from({ length: count }).map((_, i) => (
        <FeedCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function ArticleSkeleton() {
  return (
    <div className="px-4 sm:px-6 py-6 space-y-6">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Shimmer className="h-3 w-24 rounded" />
          <Shimmer className="h-3 w-20 rounded" />
        </div>
        <Shimmer className="h-7 w-full rounded" />
        <Shimmer className="h-7 w-4/5 rounded" />
      </div>
      <Shimmer className="h-56 w-full rounded-xl" />
      <div className="space-y-3">
        <Shimmer className="h-4 w-full rounded" />
        <Shimmer className="h-4 w-full rounded" />
        <Shimmer className="h-4 w-3/4 rounded" />
      </div>
      <div className="space-y-3 pt-2">
        <Shimmer className="h-4 w-full rounded" />
        <Shimmer className="h-4 w-5/6 rounded" />
        <Shimmer className="h-4 w-full rounded" />
        <Shimmer className="h-4 w-2/3 rounded" />
      </div>
    </div>
  );
}

export function SourceCardSkeleton() {
  return (
    <div className="flex items-center gap-4 p-4">
      <Shimmer className="w-9 h-9 rounded-lg shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Shimmer className="h-4 w-40 rounded" />
        <div className="flex items-center gap-2">
          <Shimmer className="h-3 w-48 rounded" />
          <Shimmer className="h-3 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SourceListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="divide-y divide-gray-100 dark:divide-neutral-800 px-2 sm:px-4">
      {Array.from({ length: count }).map((_, i) => (
        <SourceCardSkeleton key={i} />
      ))}
    </div>
  );
}
