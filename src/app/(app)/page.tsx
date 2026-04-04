import type { Metadata } from "next";
import { Suspense } from "react";
import TodayPageContent from "@/components/pages/today/today-page-content";
import TodayPageFallback from "@/components/pages/today/today-page-fallback";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Today",
  description:
    "Start your day with a focused stream of fresh stories from the feeds you follow and curated discoveries worth your attention.",
  path: "/",
  noIndex: true,
});

export default function TodayPage() {
  return (
    <Suspense fallback={<TodayPageFallback />}>
      <TodayPageContent />
    </Suspense>
  );
}
