import { useCallback, useState } from "react";
import type { FeedItem } from "@/lib/types";
import type { DiscoverSource } from "@/lib/discover-sources";
import type { SourcePreviewState } from "@/components/pages/search/types";

export default function useSourcePreview() {
  const [sourcePreviews, setSourcePreviews] = useState<
    Record<string, SourcePreviewState>
  >({});

  const handlePreviewSource = useCallback(
    async (source: DiscoverSource) => {
      const existing = sourcePreviews[source.url];

      if (existing?.isOpen) {
        setSourcePreviews((prev) => ({
          ...prev,
          [source.url]: {
            ...prev[source.url],
            isOpen: false,
          },
        }));
        return;
      }

      if (existing && existing.items.length > 0) {
        setSourcePreviews((prev) => ({
          ...prev,
          [source.url]: {
            ...prev[source.url],
            isOpen: true,
            error: undefined,
          },
        }));
        return;
      }

      setSourcePreviews((prev) => ({
        ...prev,
        [source.url]: {
          isOpen: true,
          isLoading: true,
          items: existing?.items || [],
          error: undefined,
        },
      }));

      try {
        const res = await fetch("/api/rss/parse", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: source.url }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setSourcePreviews((prev) => ({
            ...prev,
            [source.url]: {
              isOpen: true,
              isLoading: false,
              items: [],
              error:
                data.error || "Could not load article preview for this source.",
            },
          }));
          return;
        }

        const data = await res.json();
        const items = ((data.items || []) as FeedItem[]).map((item, index) => ({
          ...item,
          id: item.id || `${encodeURIComponent(source.url)}-preview-${index}`,
          sourceId: item.sourceId || `preview:${encodeURIComponent(source.url)}`,
          sourceName: item.sourceName || data.title || source.title,
          sourceUrl: item.sourceUrl || data.link || source.siteUrl || source.url,
        }));

        setSourcePreviews((prev) => ({
          ...prev,
          [source.url]: {
            isOpen: true,
            isLoading: false,
            items,
            error: undefined,
          },
        }));
      } catch {
        setSourcePreviews((prev) => ({
          ...prev,
          [source.url]: {
            isOpen: true,
            isLoading: false,
            items: [],
            error:
              "Could not load article preview. Check your connection and try again.",
          },
        }));
      }
    },
    [sourcePreviews]
  );

  return {
    sourcePreviews,
    handlePreviewSource,
  };
}
