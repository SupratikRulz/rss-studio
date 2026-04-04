import type { Metadata } from "next";
import ArticlePageClient from "@/components/pages/article-page-client";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Article",
  description:
    "Read each article in a clean, distraction-light view designed for focus, with quick actions for bookmarking and sharing.",
  path: "/article",
  noIndex: true,
});

export default function ArticlePage() {
  return <ArticlePageClient />;
}
