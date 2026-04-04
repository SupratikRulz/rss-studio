"use client";

import { useState, useEffect } from "react";
import {
  User,
  Sun,
  Moon,
  Monitor,
  Type,
  Minus,
  Plus,
  LayoutGrid,
  Newspaper,
  BookOpen,
  AlignJustify,
} from "lucide-react";
import useSettingsStore, { type Theme, type FeedView } from "@/stores/settings-store";
import { cn } from "@/lib/utils";

const THEME_OPTIONS: { id: Theme; label: string; icon: React.ElementType }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

const VIEW_OPTIONS: {
  id: FeedView;
  label: string;
  icon: React.ElementType;
  description: string;
}[] = [
  {
    id: "magazine",
    label: "Magazine",
    icon: Newspaper,
    description: "List with thumbnails",
  },
  {
    id: "cards",
    label: "Cards",
    icon: LayoutGrid,
    description: "Grid of image cards",
  },
  {
    id: "article",
    label: "Article",
    icon: BookOpen,
    description: "Full content preview",
  },
  {
    id: "titleOnly",
    label: "Title Only",
    icon: AlignJustify,
    description: "Compact text list",
  },
];

export default function SettingsPage() {
  const {
    theme,
    readingFontSize,
    feedView,
    setTheme,
    setReadingFontSize,
    setFeedView,
  } = useSettingsStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="max-w-2xl mx-auto">
        <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
          <div className="px-4 sm:px-6 py-5">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
              Settings
            </h1>
          </div>
        </header>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-5">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
            Settings
          </h1>
        </div>
      </header>

      <div className="px-4 sm:px-6 py-6 space-y-8">
        {/* Profile avatar */}
        <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 dark:border-neutral-800">
          <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-4">
            <User
              size={36}
              className="text-emerald-600 dark:text-emerald-400"
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
            Reader
          </h2>
          <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">
            Customize your reading experience
          </p>
        </div>

        {/* Feed View */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <LayoutGrid size={18} className="text-gray-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide">
              Feed View
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {VIEW_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = feedView === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setFeedView(opt.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-4 border-2 transition-all cursor-pointer",
                    isActive
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900"
                  )}
                >
                  <Icon
                    size={24}
                    className={
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 dark:text-neutral-500"
                    }
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-600 dark:text-neutral-400"
                    )}
                  >
                    {opt.label}
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-neutral-500 text-center leading-tight">
                    {opt.description}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Reading font size */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Type size={18} className="text-gray-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide">
              Reading
            </h3>
          </div>
          <div className="rounded-xl border border-gray-100 dark:border-neutral-800 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700 dark:text-neutral-300">
                Article Font Size
              </span>
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
                {readingFontSize}px
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setReadingFontSize(readingFontSize - 1)}
                disabled={readingFontSize <= 12}
                className="rounded-lg p-1.5 border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Minus size={14} />
              </button>
              <input
                type="range"
                min={12}
                max={48}
                step={1}
                value={readingFontSize}
                onChange={(e) => setReadingFontSize(Number(e.target.value))}
                className="flex-1 accent-emerald-600 h-1.5 cursor-pointer"
              />
              <button
                onClick={() => setReadingFontSize(readingFontSize + 1)}
                disabled={readingFontSize >= 48}
                className="rounded-lg p-1.5 border border-gray-200 dark:border-neutral-700 text-gray-500 dark:text-neutral-400 hover:bg-gray-50 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="mt-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800">
              <p
                className="text-gray-600 dark:text-neutral-300 leading-relaxed"
                style={{ fontSize: `${readingFontSize}px` }}
              >
                The quick brown fox jumps over the lazy dog. This is a preview of
                your reading font size for articles.
              </p>
            </div>
          </div>
        </section>

        {/* Theme toggle */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sun size={18} className="text-gray-500 dark:text-neutral-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide">
              Appearance
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setTheme(opt.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl p-4 border-2 transition-all cursor-pointer",
                    isActive
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-100 dark:border-neutral-800 hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-900"
                  )}
                >
                  <Icon
                    size={24}
                    className={
                      isActive
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-gray-400 dark:text-neutral-500"
                    }
                  />
                  <span
                    className={cn(
                      "text-sm font-medium",
                      isActive
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-gray-600 dark:text-neutral-400"
                    )}
                  >
                    {opt.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
