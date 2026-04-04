import { Suspense } from "react";
import SearchPageClient from "@/components/pages/search/search-page-client";
import SearchPageFallback from "@/components/pages/search/search-page-fallback";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchPageFallback />}>
      <SearchPageClient />
    </Suspense>
  );
}
