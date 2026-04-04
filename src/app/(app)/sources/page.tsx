import type { Metadata } from "next";
import SourcesPageClient from "@/components/pages/sources-page-client";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sources",
  description:
    "Organize every RSS source in one place, sort feeds into folders, and keep your reading system clean, curated, and easy to manage.",
  path: "/sources",
  noIndex: true,
});

export default function SourcesPage() {
  return <SourcesPageClient />;
}
