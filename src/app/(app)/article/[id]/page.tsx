"use client";

import { useRouter } from "next/navigation";
import useFeedStore from "@/stores/feed-store";
import ArticleNotFound from "@/components/pages/article/components/article-not-found";
import ArticleView from "@/components/pages/article/components/article-view";

export default function ArticlePage() {
  const router = useRouter();
  const selectedArticle = useFeedStore((s) => s.selectedArticle);

  if (!selectedArticle) {
    return <ArticleNotFound onGoBack={() => router.push("/")} />;
  }

  return <ArticleView article={selectedArticle} onBack={() => router.back()} />;
}
