import { Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Theme } from "@/stores/settings-store";
import { THEME_OPTIONS } from "../settings-constants";

interface SettingsAppearanceSectionProps {
  theme: Theme;
  onChange: (theme: Theme) => void;
}

export default function SettingsAppearanceSection({
  theme,
  onChange,
}: SettingsAppearanceSectionProps) {
  return (
    <section>
      <div className="flex items-center gap-2 mb-4">
        <Sun size={18} className="text-gray-500 dark:text-neutral-400" />
        <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 uppercase tracking-wide">
          Appearance
        </h3>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {THEME_OPTIONS.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.id;

          return (
            <button
              key={option.id}
              onClick={() => onChange(option.id)}
              aria-label={`Theme ${option.label}`}
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
            </button>
          );
        })}
      </div>
    </section>
  );
}
