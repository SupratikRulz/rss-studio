import type { Metadata } from "next";
import BookmarksPageClient from "@/components/pages/bookmarks-page-client";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Bookmarks",
  description:
    "Save the stories that matter, build a personal read-later library, and return to important articles whenever you need them.",
  path: "/bookmarks",
  noIndex: true,
});

export default function BookmarksPage() {
  return <BookmarksPageClient />;
}
