import type { Metadata } from "next";
import { Suspense } from "react";
import SearchPageClient from "@/components/pages/search/search-page-client";
import SearchPageFallback from "@/components/pages/search/search-page-fallback";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Search",
  description:
    "Discover great RSS feeds in seconds, preview sources before you subscribe, and build a smarter reading list around your interests.",
  path: "/search",
  noIndex: true,
});

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageClient />
    </Suspense>
  );
}
