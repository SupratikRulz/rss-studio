"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import useFeedStore from "@/stores/feed-store";
import useSettingsStore from "@/stores/settings-store";
import BookmarkButton from "@/components/feed/bookmark-button";
import ShareButtons from "@/components/feed/share-buttons";
import { formatDate } from "@/lib/utils";

export default function ArticlePage() {
  const router = useRouter();
  const selectedArticle = useFeedStore((s) => s.selectedArticle);
  const readingFontSize = useSettingsStore((s) => s.readingFontSize);

  if (!selectedArticle) {
    return (
      <div className="max-w-3xl mx-auto flex flex-col items-center justify-center py-20">
        <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">Article not found</p>
        <button
          onClick={() => router.push("/")}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
        >
          Go back to feed
        </button>
      </div>
    );
  }

  const article = selectedArticle;

  return (
    <div className="max-w-3xl mx-auto">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 rounded-lg p-2 -ml-2 text-gray-600 dark:text-neutral-400 hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium hidden sm:inline">Back</span>
          </button>

          <div className="flex items-center gap-1">
            <BookmarkButton item={article} />
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-2 text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
              title="Open original article"
            >
              <ExternalLink size={18} />
            </a>
          </div>
        </div>
      </header>

      <article className="px-4 sm:px-6 py-6">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
              {article.sourceName}
            </span>
            {article.author && (
              <>
                <span className="text-gray-300 dark:text-neutral-600">·</span>
                <span className="text-sm text-gray-500 dark:text-neutral-400">{article.author}</span>
              </>
            )}
            <span className="text-gray-300 dark:text-neutral-600">·</span>
            <span className="text-sm text-gray-400 dark:text-neutral-500">
              {formatDate(article.pubDate)}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-neutral-100 leading-tight">
            {article.title}
          </h1>
        </div>

        {article.imageUrl && (
          <div className="mb-6 rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
            <img
              src={article.imageUrl}
              alt=""
              className="w-full h-auto max-h-96 object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}

        <div
          className="prose prose-gray prose-sm sm:prose-base max-w-none
            prose-headings:text-gray-900 prose-headings:font-semibold
            prose-p:text-gray-600 prose-p:leading-relaxed
            prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-xl prose-img:my-4
            prose-strong:text-gray-800
            prose-blockquote:border-emerald-200 prose-blockquote:text-gray-500"
          style={{ fontSize: `${readingFontSize}px` }}
          dangerouslySetInnerHTML={{
            __html: article.content || article.description || "",
          }}
        />

        <div className="mt-8 pt-6 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center justify-between">
            <ShareButtons url={article.link} title={article.title} />
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              Read original
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </article>
    </div>
  );
}
