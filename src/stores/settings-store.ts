import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createUserStorage } from "@/lib/user-storage";

export type Theme = "light" | "dark" | "system";
export type FeedView = "magazine" | "cards" | "article" | "titleOnly";

interface SettingsState {
  theme: Theme;
  readingFontSize: number;
  feedView: FeedView;
  setTheme: (theme: Theme) => void;
  setReadingFontSize: (size: number) => void;
  setFeedView: (view: FeedView) => void;
}

const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      theme: "light",
      readingFontSize: 16,
      feedView: "magazine",
      setTheme: (theme) => set({ theme }),
      setReadingFontSize: (readingFontSize) =>
        set({ readingFontSize: Math.min(48, Math.max(12, readingFontSize)) }),
      setFeedView: (feedView) => set({ feedView }),
    }),
    {
      name: "rss-studio-settings",
      storage: createUserStorage(),
      skipHydration: true,
    }
  )
);

export default useSettingsStore;
