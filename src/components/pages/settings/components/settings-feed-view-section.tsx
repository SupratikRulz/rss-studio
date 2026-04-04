import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import type { FeedView } from "@/stores/settings-store";
import { VIEW_OPTIONS } from "../settings-constants";

interface SettingsFeedViewSectionProps {
  feedView: FeedView;
  onChange: (view: FeedView) => void;
}

export default function SettingsFeedViewSection({
  feedView,
  onChange,
}: SettingsFeedViewSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <LayoutGrid size={18} className="text-gray-500 dark:text-neutral-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide">
          Feed View
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {VIEW_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = feedView === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              aria-label={`Feed view ${option.label}`}
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
                {option.label}
              </span>
              <span className="text-[10px] text-gray-400 dark:text-neutral-500 text-center leading-tight">
                {option.description}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
