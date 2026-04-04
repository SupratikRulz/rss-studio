import {
  proxyArticleImages,
  removeFirstDuplicateContentImage,
} from "@/lib/utils";
import type { FeedItem } from "@/lib/types";

export default function useArticleContent(article: FeedItem) {
  return proxyArticleImages(
    removeFirstDuplicateContentImage(
      article.content || article.description || "",
      article.imageUrl
    )
  );
}
