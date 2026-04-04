import { Suspense } from "react";
import FeedsPageClient from "@/components/pages/feeds/feeds-page-client";
import FeedsPageFallback from "@/components/pages/feeds/feeds-page-fallback";

export default function FeedsPage() {
  return (
    <Suspense fallback={<FeedsPageFallback />}>
      <FeedsPageClient />
    </Suspense>
  );
}
