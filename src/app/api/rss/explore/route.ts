import { NextResponse } from "next/server";
import Parser from "rss-parser";
import { EXPLORE_SOURCES } from "@/lib/constants";
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

  throw new Error("Could not retrieve feed");
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

export async function GET() {
  try {
    const results = await Promise.allSettled(
      EXPLORE_SOURCES.map(async (source) => {
        const xml = await fetchFeedXml(source.url);
        const feed = await parser.parseString(xml);
        return (feed.items || []).slice(0, 10).map((item, index) => {
          const fullContent = item["content:encoded"] || item.content || "";
          const snippet =
            item.contentSnippet || stripHtml(fullContent).slice(0, 300);

          return {
            id: `${source.id}-${index}-${item.guid || item.link || index}`,
            title: item.title || "Untitled",
            link: item.link || "",
            description: snippet,
            content: fullContent || item.contentSnippet || "",
            imageUrl: extractImage(item),
            author:
              item.creator || (item as Record<string, string>).author || "",
            pubDate: item.pubDate || item.isoDate || "",
            sourceName: feed.title || source.title,
            sourceUrl: feed.link || source.siteUrl,
            sourceId: source.id,
          };
        });
      })
    );

    const fulfilled = results.filter(
      (r) => r.status === "fulfilled"
    ) as PromiseFulfilledResult<typeof results extends PromiseSettledResult<infer T>[] ? T : never>[];

    const allItems = fulfilled.flatMap((r) => r.value);

    allItems.sort(
      (a, b) =>
        new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime()
    );

    return NextResponse.json({ items: allItems.slice(0, 60) });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch explore feeds" },
      { status: 500 }
    );
  }
}
