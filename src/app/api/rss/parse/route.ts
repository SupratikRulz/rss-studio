import { NextRequest, NextResponse } from "next/server";
import Parser from "rss-parser";
import { stripHtml, extractImageFromHtml } from "@/lib/utils";

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

async function fetchFeedXml(url: string): Promise<string> {
  // Strategy 1: direct fetch
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

  // Strategy 2: proxy via codetabs (handles Cloudflare-protected feeds)
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

  // Strategy 3: allorigins as last resort
  try {
    const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
    const res = await fetchWithTimeout(proxyUrl, {}, 20000);
    if (res.ok) {
      const text = await res.text();
      if (looksLikeXml(text)) return text;
    }
  } catch {
    /* fall through */
  }

  throw new Error(
    "Could not retrieve a valid RSS feed. The site may block automated access."
  );
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

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    const xml = await fetchFeedXml(url);
    const feed = await parser.parseString(xml);

    const items = (feed.items || []).map((item, index) => {
      const fullContent = item["content:encoded"] || item.content || "";
      const snippet =
        item.contentSnippet || stripHtml(fullContent).slice(0, 300);

      return {
        id: `${encodeURIComponent(url)}-${index}-${item.guid || item.link || index}`,
        title: item.title || "Untitled",
        link: item.link || "",
        description: snippet,
        content: fullContent || item.contentSnippet || "",
        imageUrl: extractImage(item),
        author: item.creator || (item as Record<string, string>).author || "",
        pubDate: item.pubDate || item.isoDate || "",
        sourceName: feed.title || "",
        sourceUrl: feed.link || url,
        sourceId: "",
      };
    });

    return NextResponse.json({
      title: feed.title || "",
      description: feed.description || "",
      link: feed.link || "",
      imageUrl: feed.image?.url,
      items,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("RSS parse error:", message);
    return NextResponse.json(
      { error: `Failed to parse RSS feed. ${message}` },
      { status: 400 }
    );
  }
}
