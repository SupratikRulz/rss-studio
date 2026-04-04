import { useCallback, useMemo } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { ReadonlyURLSearchParams } from "next/navigation";
import {
  DISCOVER_SECTIONS,
  type DiscoverCategory,
} from "@/lib/discover-sources";

export default function useSearchTopic(
  searchParams: ReadonlyURLSearchParams,
  router: AppRouterInstance
) {
  const selectedTopicId = searchParams.get("topic");

  const allCategories = useMemo(
    () => DISCOVER_SECTIONS.flatMap((section) => section.categories),
    []
  );

  const selectedCategory = useMemo(
    () =>
      allCategories.find((category) => category.id === selectedTopicId) || null,
    [allCategories, selectedTopicId]
  );

  const openCategory = useCallback(
    (category: DiscoverCategory) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("topic", category.id);
      router.push(`/search?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  const closeCategory = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("topic");
    const nextQuery = params.toString();
    router.push(nextQuery ? `/search?${nextQuery}` : "/search", {
      scroll: false,
    });
  }, [router, searchParams]);

  return {
    selectedCategory,
    openCategory,
    closeCategory,
  };
}
