import { Suspense } from "react";
import TodayPageContent from "@/components/pages/today/today-page-content";
import TodayPageFallback from "@/components/pages/today/today-page-fallback";

export default function TodayPage() {
  return (
    <Suspense fallback={<TodayPageFallback />}>
      <TodayPageContent />
    </Suspense>
  );
}
