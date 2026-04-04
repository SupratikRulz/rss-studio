export const EXPLORE_SOURCES = [
  {
    id: "explore-bbc",
    title: "BBC News",
    url: "https://feeds.bbci.co.uk/news/rss.xml",
    siteUrl: "https://www.bbc.com/news",
    description: "BBC News - World",
  },
  {
    id: "explore-hackernews",
    title: "Hacker News",
    url: "https://hnrss.org/frontpage",
    siteUrl: "https://news.ycombinator.com",
    description: "Links for the intellectually curious",
  },
  {
    id: "explore-techcrunch",
    title: "TechCrunch",
    url: "https://techcrunch.com/feed/",
    siteUrl: "https://techcrunch.com",
    description: "Startup and technology news",
  },
  {
    id: "explore-theverge",
    title: "The Verge",
    url: "https://www.theverge.com/rss/index.xml",
    siteUrl: "https://www.theverge.com",
    description: "Technology, science, art, and culture",
  },
  {
    id: "explore-arstechnica",
    title: "Ars Technica",
    url: "https://feeds.arstechnica.com/arstechnica/index",
    siteUrl: "https://arstechnica.com",
    description: "Serving the technologist for over 25 years",
  },
  {
    id: "explore-npr",
    title: "NPR News",
    url: "https://feeds.npr.org/1001/rss.xml",
    siteUrl: "https://www.npr.org",
    description: "NPR News headlines",
  },
];

export const NAV_ITEMS = [
  { id: "today" as const, label: "Today", href: "/" },
  { id: "bookmarks" as const, label: "Bookmarks", href: "/bookmarks" },
  { id: "sources" as const, label: "Sources", href: "/sources" },
  { id: "feeds" as const, label: "Feeds", href: "/feeds" },
];

export const DEFAULT_FOLDER_ID = "default";
export const DEFAULT_FOLDER_NAME = "General";
