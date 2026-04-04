import { useCallback, useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import useToastStore from "@/stores/toast-store";
import { searchDiscoverSources } from "@/lib/discover-sources";
import type { SearchResult } from "@/components/pages/search/types";

function looksLikeUrl(input: string): boolean {
  return (
    input.startsWith("http://") ||
    input.startsWith("https://") ||
    (input.includes(".") && !input.includes(" "))
  );
}

export default function useSearchQuery() {
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeout = useRef<ReturnType<typeof setTimeout>>(null);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (!value.trim()) {
      setSearchResult(null);
    }
  }, []);

  useEffect(() => {
    if (!query.trim() || looksLikeUrl(query.trim())) {
      return;
    }

    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      const categories = searchDiscoverSources(query.trim());
      setSearchResult({ type: "keyword", categories });
    }, 200);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [query]);

  const handleSearch = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      if (!query.trim() || !looksLikeUrl(query.trim())) {
        return;
      }

      setIsSearching(true);
      try {
        const res = await fetch("/api/rss/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: query.trim() }),
        });

        if (res.ok) {
          const data = await res.json();
          setSearchResult(data);
        } else {
          useToastStore.getState().addToast(
            "No RSS feed found at this URL. Check the link and try again."
          );
        }
      } catch {
        useToastStore.getState().addToast(
          "Search failed. Check your connection and try again."
        );
      } finally {
        setIsSearching(false);
      }
    },
    [query]
  );

  return {
    query,
    searchResult,
    isSearching,
    handleQueryChange,
    handleSearch,
  };
}
