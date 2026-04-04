import { Globe } from "lucide-react";
import {
  DISCOVER_SECTIONS,
  type DiscoverCategory,
} from "@/lib/discover-sources";
import CategoryCard from "./category-card";
import DiscoveredFeedCard from "./discovered-feed-card";
import type { DiscoveredFeed, SearchResult } from "../types";

interface SearchContentProps {
  query: string;
  searchResult: SearchResult | null;
  isSubscribed: (url: string) => boolean;
  onFollowFeed: (feed: DiscoveredFeed) => void;
  onOpenCategory: (category: DiscoverCategory) => void;
}

export default function SearchContent({
  query,
  searchResult,
  isSubscribed,
  onFollowFeed,
  onOpenCategory,
}: SearchContentProps) {
  return (
    <div className="px-4 sm:px-6 pb-8">
      {searchResult?.type === "feed" && searchResult.feed && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide mb-4">
            Discovered Feed
          </h2>
          <DiscoveredFeedCard
            feed={searchResult.feed}
            items={searchResult.items}
            isSubscribed={isSubscribed(searchResult.feed.feedUrl)}
            onFollow={() => onFollowFeed(searchResult.feed)}
          />
        </div>
      )}

      {searchResult?.type === "keyword" &&
        searchResult.categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide mb-4">
              Search Results
            </h2>
            <CategoryGrid
              categories={searchResult.categories}
              onOpenCategory={onOpenCategory}
            />
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

      {!searchResult &&
        DISCOVER_SECTIONS.map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide mb-4">
              {section.title}
            </h2>
            <CategoryGrid
              categories={section.categories}
              onOpenCategory={onOpenCategory}
            />
          </div>
        ))}
    </div>
  );
}

function CategoryGrid({
  categories,
  onOpenCategory,
}: {
  categories: DiscoverCategory[];
  onOpenCategory: (category: DiscoverCategory) => void;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {categories.map((category, index) => (
        <div
          key={category.id}
          className="animate-feed-item"
          style={{ animationDelay: `${Math.min(index * 40, 300)}ms` }}
        >
          <CategoryCard
            category={category}
            onClick={() => onOpenCategory(category)}
          />
        </div>
      ))}
    </div>
  );
}
