import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { stripHtml, extractImageFromHtml } from "@/lib/utils";
import { searchDiscoverSources } from "@/lib/discover-sources";

type CustomItem = {
  "media:content"?: { $: { url: string } };
  "media:thumbnail"?: { $: { url: string } };
  "content:encoded"?: string;
};

const parser = new Parser<Record<string, never>, CustomItem>({
  customFields: {
    item: [
      ["media:content", "media:content"],
      ["media:thumbnail", "media:thumbnail"],
      ["content:encoded", "content:encoded"],
    ],
  },
});

const FETCH_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  Accept:
    "application/rss+xml, application/xml, application/atom+xml, text/xml, */*",
};

function looksLikeXml(text: string): boolean {
  const t = text.trimStart();
  return (
    t.startsWith("<?xml") ||
    t.startsWith("<rss") ||
    t.startsWith("<feed") ||
    t.startsWith("<RDF")
  );
}

async function fetchWithTimeout(
  url: string,
  opts: RequestInit = {},
  ms = 15000
): Promise<Response> {
  return fetch(url, { ...opts, signal: AbortSignal.timeout(ms) });
}

async function fetchFeedXml(url: string): Promise<string | null> {
  try {
    const res = await fetchWithTimeout(url, {
      headers: FETCH_HEADERS,
      redirect: "follow",
    });
    if (res.ok) {
      const text = await res.text();
      if (looksLikeXml(text)) return text;
    }
  } catch {
    /* fall through */
  }

  try {
    const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
    const res = await fetchWithTimeout(proxyUrl, {}, 20000);
    if (res.ok) {
      const text = await res.text();
      if (looksLikeXml(text)) return text;
    }
  } catch {
    /* fall through */
  }

  return null;
}

function extractImage(item: Parser.Item & CustomItem): string | undefined {
  const enclosure = item.enclosure as { url?: string } | undefined;
  if (enclosure?.url) return enclosure.url;

  const mediaThumbnail = item["media:thumbnail"] as
    | { $?: { url?: string } }
    | undefined;
  if (mediaThumbnail?.$?.url) return mediaThumbnail.$.url;

  const mediaContent = item["media:content"] as
    | { $?: { url?: string } }
    | undefined;
  if (mediaContent?.$?.url) return mediaContent.$.url;

  const fullContent =
    item["content:encoded"] || item.content || item.contentSnippet || "";
  return extractImageFromHtml(fullContent);
}

function looksLikeUrl(input: string): boolean {
  return (
    input.startsWith("http://") ||
    input.startsWith("https://") ||
    input.includes(".") && !input.includes(" ")
  );
}

const COMMON_FEED_PATHS = [
  "/feed",
  "/feed/",
  "/rss",
  "/rss.xml",
  "/feed.xml",
  "/atom.xml",
  "/feeds/posts/default?alt=rss",
  "/index.xml",
];

async function discoverFeedFromUrl(input: string): Promise<{
  title: string;
  description: string;
  link: string;
  feedUrl: string;
  imageUrl?: string;
} | null> {
  let url = input.trim();
  if (!url.startsWith("http")) url = `https://${url}`;

  // First try the URL directly as RSS
  const directXml = await fetchFeedXml(url);
  if (directXml) {
    try {
      const feed = await parser.parseString(directXml);
      return {
        title: feed.title || "",
        description: feed.description || "",
        link: feed.link || url,
        feedUrl: url,
        imageUrl: feed.image?.url,
      };
    } catch {
      /* not valid RSS */
    }
  }

  // Try common feed paths
  const baseUrl = new URL(url).origin;
  for (const path of COMMON_FEED_PATHS) {
    const feedUrl = baseUrl + path;
    const xml = await fetchFeedXml(feedUrl);
    if (xml) {
      try {
        const feed = await parser.parseString(xml);
        return {
          title: feed.title || "",
          description: feed.description || "",
          link: feed.link || baseUrl,
          feedUrl,
          imageUrl: feed.image?.url,
        };
      } catch {
        continue;
      }
    }
  }

  return null;
}

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    if (!query || typeof query !== "string" || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const trimmed = query.trim();

    // If it looks like a URL, try to discover RSS feed
    if (looksLikeUrl(trimmed)) {
      const discovered = await discoverFeedFromUrl(trimmed);
      if (discovered) {
        // Parse the feed to get items
        const xml = await fetchFeedXml(discovered.feedUrl);
        let items: Record<string, unknown>[] = [];

        if (xml) {
          try {
            const feed = await parser.parseString(xml);
            items = (feed.items || []).slice(0, 5).map((item, index) => {
              const fullContent = item["content:encoded"] || item.content || "";
              const snippet =
                item.contentSnippet || stripHtml(fullContent).slice(0, 300);
              return {
                id: `search-${index}-${item.guid || item.link || index}`,
                title: item.title || "Untitled",
                link: item.link || "",
                description: snippet,
                imageUrl: extractImage(item),
                pubDate: item.pubDate || item.isoDate || "",
              };
            });
          } catch {
            /* ignore parse errors */
          }
        }

        return NextResponse.json({
          type: "feed" as const,
          feed: discovered,
          items,
          categories: [],
        });
      }
    }

    // Keyword search: search through curated discover sources
    const categories = searchDiscoverSources(trimmed);

    return NextResponse.json({
      type: "keyword" as const,
      feed: null,
      items: [],
      categories,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("RSS search error:", message);
    return NextResponse.json(
      { error: `Search failed. ${message}` },
      { status: 500 }
    );
  }
}
