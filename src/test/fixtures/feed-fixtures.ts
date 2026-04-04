import type { FeedItem, FeedSource } from "@/lib/types";

export const sampleFeedUrl = "https://example.com/feed.xml";

export const sampleFeedItem: FeedItem = {
  id: "item-1",
  title: "Mock article title",
  link: "https://example.com/articles/mock-article",
  description: "Mock article description",
  content:
    "<p>Mock article body.</p><img src=\"https://example.com/image.jpg\" />",
  imageUrl: "https://example.com/image.jpg",
  author: "RSS Studio",
  pubDate: "2026-04-01T10:00:00.000Z",
  sourceName: "Mock Feed",
  sourceUrl: "https://example.com",
  sourceId: "source-1",
};

export const sampleFeedSource: FeedSource = {
  id: "source-1",
  title: "Mock Feed",
  url: sampleFeedUrl,
  siteUrl: "https://example.com",
  description: "Example feed for tests",
  imageUrl: "https://avatars.githubusercontent.com/u/7460567?s=96&v=4",
  folderId: "default",
  addedAt: "2026-04-01T09:00:00.000Z",
};

export const sampleParsedFeedResponse = {
  title: "Mock Feed",
  description: "Example feed for tests",
  link: "https://example.com",
  imageUrl: "https://avatars.githubusercontent.com/u/7460567?s=96&v=4",
  items: [sampleFeedItem],
};

export const sampleRssXml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>Mock Feed</title>
    <link>https://example.com</link>
    <description>Example feed for tests</description>
    <image>
      <url>https://example.com/logo.png</url>
    </image>
    <item>
      <title>Mock article title</title>
      <link>https://example.com/articles/mock-article</link>
      <guid>mock-guid</guid>
      <description>Mock article description</description>
      <content:encoded><![CDATA[<p>Mock article body.</p><img src="https://example.com/image.jpg" />]]></content:encoded>
      <media:thumbnail url="https://example.com/image.jpg" />
      <author>RSS Studio</author>
      <pubDate>Wed, 01 Apr 2026 10:00:00 GMT</pubDate>
    </item>
  </channel>
</rss>`;

export const sampleSearchKeywordResponse = {
  type: "keyword" as const,
  feed: null,
  items: [],
  categories: [
    {
      id: "tech",
      name: "Tech",
      featured: "The Verge",
      sources: [
        {
          title: "The Verge",
          url: "https://www.theverge.com/rss/index.xml",
          siteUrl: "https://www.theverge.com",
          description: "Technology, science, art, and culture",
        },
      ],
    },
  ],
};

export const sampleSearchFeedResponse = {
  type: "feed" as const,
  feed: {
    title: "Mock Feed",
    description: "Example feed for tests",
    link: "https://example.com",
    feedUrl: sampleFeedUrl,
    imageUrl: "https://avatars.githubusercontent.com/u/7460567?s=96&v=4",
  },
  items: [
    {
      id: "search-0-mock-guid",
      title: "Mock article title",
      link: "https://example.com/articles/mock-article",
      description: "Mock article description",
      imageUrl: "https://avatars.githubusercontent.com/u/7460567?s=96&v=4",
      pubDate: "Wed, 01 Apr 2026 10:00:00 GMT",
    },
  ],
  categories: [],
};
