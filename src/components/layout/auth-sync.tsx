"use client";

import { useEffect, useRef } from "react";
import { useUser } from "@/lib/auth";
import { setCurrentUserId, migrateToUserStorage } from "@/lib/user-storage";
import useFeedStore from "@/stores/feed-store";
import useBookmarkStore from "@/stores/bookmark-store";
import useSettingsStore from "@/stores/settings-store";

const PERSISTED_STORE_KEYS = [
  "rss-studio-feeds",
  "rss-studio-bookmarks",
  "rss-studio-settings",
] as const;

export default function AuthSync() {
  const { user, isLoaded } = useUser();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);

  useEffect(() => {
    if (!isLoaded) return;

    const userId = user?.id ?? null;
    if (prevUserIdRef.current === userId) return;
    prevUserIdRef.current = userId;

    if (userId) {
      for (const key of PERSISTED_STORE_KEYS) {
        migrateToUserStorage(key, userId);
      }
    }

    setCurrentUserId(userId);

    useFeedStore.persist.rehydrate();
    useBookmarkStore.persist.rehydrate();
    useSettingsStore.persist.rehydrate();
  }, [user?.id, isLoaded]);

  return null;
}
