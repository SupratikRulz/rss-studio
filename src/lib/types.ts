export interface FeedSource {
  id: string;
  title: string;
  url: string;
  siteUrl: string;
  description: string;
  imageUrl?: string;
  folderId: string;
  addedAt: string;
}

export interface Folder {
  id: string;
  name: string;
  createdAt: string;
}

export interface FeedItem {
  id: string;
  title: string;
  link: string;
  description: string;
  content: string;
  imageUrl?: string;
  author: string;
  pubDate: string;
  sourceName: string;
  sourceUrl: string;
  sourceId: string;
}

export interface Bookmark {
  id: string;
  item: FeedItem;
  bookmarkedAt: string;
}

export type NavItem = "today" | "bookmarks" | "sources" | "feeds";

export interface ParsedFeed {
  title: string;
  description: string;
  link: string;
  imageUrl?: string;
  items: FeedItem[];
}
