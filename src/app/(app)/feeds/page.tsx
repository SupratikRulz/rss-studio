import type { Metadata } from "next";
import { Suspense } from "react";
import FeedsPageClient from "@/components/pages/feeds/feeds-page-client";
import FeedsPageFallback from "@/components/pages/feeds/feeds-page-fallback";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Feeds",
  description:
    "Read the latest posts from the sources you trust, refresh feed streams on demand, and move through your folders without losing context.",
  path: "/feeds",
  noIndex: true,
});

export default function FeedsPage() {
  return (
    <Suspense fallback={<FeedsPageFallback />}>
      <FeedsPageClient />
    </Suspense>
  );
}
