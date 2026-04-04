import type { FeedItem } from "@/lib/types";
import type { DiscoverCategory } from "@/lib/discover-sources";

export interface PendingFollow {
  title: string;
  url: string;
  siteUrl: string;
  description: string;
  imageUrl?: string;
}

export interface DiscoveredFeed {
  title: string;
  description: string;
  link: string;
  feedUrl: string;
  imageUrl?: string;
}

export interface DiscoveredFeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  imageUrl?: string;
  pubDate: string;
}

export type SearchResult =
  | { type: "keyword"; categories: DiscoverCategory[] }
  | {
      type: "feed";
      feed: DiscoveredFeed;
      items: DiscoveredFeedItem[];
    };

export interface SourcePreviewState {
  isOpen: boolean;
  isLoading: boolean;
  items: FeedItem[];
  error?: string;
}
