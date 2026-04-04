import type { Metadata } from "next";

const siteName = "RSS Studio";
const defaultTitle = "RSS Studio";
const defaultDescription =
  "Discover the best RSS feeds, organize your sources with ease, bookmark standout stories, and enjoy a calmer way to read the web.";
const defaultKeywords = [
  "RSS Studio",
  "RSS reader",
  "feed reader",
  "RSS feeds",
  "feed organizer",
  "bookmark articles",
  "read later app",
  "news aggregator",
  "content discovery",
];
const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000");

export const seoConfig = {
  siteName,
  defaultTitle,
  defaultDescription,
  defaultKeywords,
  siteUrl,
};

interface PageMetadataOptions {
  title: string;
  description: string;
  path?: string;
  noIndex?: boolean;
  keywords?: string[];
}

export function createPageMetadata({
  title,
  description,
  path = "/",
  noIndex = false,
  keywords = defaultKeywords,
}: PageMetadataOptions): Metadata {
  const url = new URL(path, siteUrl).toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: noIndex ? { index: false, follow: false } : undefined,
  };
}
