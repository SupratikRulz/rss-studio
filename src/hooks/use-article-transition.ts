"use client";

import { useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import useFeedStore from "@/stores/feed-store";
import type { FeedItem } from "@/lib/types";

export default function useArticleTransition() {
  const router = useRouter();
  const setSelectedArticle = useFeedStore((s) => s.setSelectedArticle);
  const titleRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLElement | null>(null);

  const navigate = useCallback(
    (item: FeedItem) => {
      const url = `/article/${encodeURIComponent(item.id)}`;
      setSelectedArticle(item);

      if (!document.startViewTransition) {
        router.push(url);
        return;
      }

      if (titleRef.current) {
        titleRef.current.style.viewTransitionName = "article-title";
      }
      if (imageRef.current) {
        imageRef.current.style.viewTransitionName = "article-image";
      }

      const transition = document.startViewTransition(() => {
        router.push(url);
      });

      transition.finished
        .catch(() => {})
        .finally(() => {
          if (titleRef.current) titleRef.current.style.viewTransitionName = "";
          if (imageRef.current) imageRef.current.style.viewTransitionName = "";
        });
    },
    [router, setSelectedArticle]
  );

  return { navigate, titleRef, imageRef };
}
