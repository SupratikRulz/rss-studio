import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { DiscoverCategory, DiscoverSource } from "@/lib/discover-sources";
import type { FeedSource } from "@/lib/types";
import DiscoverSourceRow from "./discover-source-row";
import type { SourcePreviewState } from "../types";

interface CategoryDetailViewProps {
  category: DiscoverCategory;
  subscribingUrl: string | null;
  sourcePreviews: Record<string, SourcePreviewState>;
  getSubscribedSource: (url: string) => FeedSource | undefined;
  onClose: () => void;
  onPreviewSource: (source: DiscoverSource) => void;
  onFollowSource: (source: DiscoverSource) => void;
}

export default function CategoryDetailView({
  category,
  subscribingUrl,
  sourcePreviews,
  getSubscribedSource,
  onClose,
  onPreviewSource,
  onFollowSource,
}: CategoryDetailViewProps) {
  const router = useRouter();

  return (
    <div className="max-w-7xl mx-auto pb-12 lg:pb-0 animate-page">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-4 flex items-center gap-3">
          <button
            onClick={onClose}
            className="rounded-lg p-2 -ml-2 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ChevronLeft size={18} />
          </button>
          <h1 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
            {category.name}
          </h1>
        </div>
      </header>

      <div className="px-4 sm:px-6 space-y-3">
        {category.sources.map((source, index) => (
          <div
            key={source.url}
            className="animate-feed-item"
            style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
          >
            <DiscoverSourceRow
              source={source}
              subscribedSource={getSubscribedSource(source.url)}
              isSubscribing={subscribingUrl === source.url}
              preview={sourcePreviews[source.url]}
              onGoToFeed={(sourceId) =>
                router.push(`/feeds?source=${encodeURIComponent(sourceId)}`)
              }
              onPreview={onPreviewSource}
              onFollow={onFollowSource}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
