import type { MetadataRoute } from "next";
import { seoConfig } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  const publicPaths = ["/architecture", "/favicon.ico", "/llms.txt", "/robots.txt"];
  const privatePaths = [
    "/",
    "/api/",
    "/article/",
    "/bookmarks",
    "/feeds",
    "/search",
    "/settings",
    "/sign-in",
    "/sign-up",
    "/sources",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: publicPaths,
        disallow: privatePaths,
      },
      {
        userAgent: ["GPTBot", "ChatGPT-User", "ClaudeBot", "PerplexityBot", "Google-Extended"],
        allow: publicPaths,
        disallow: privatePaths,
      },
    ],
    host: seoConfig.siteUrl,
  };
}
