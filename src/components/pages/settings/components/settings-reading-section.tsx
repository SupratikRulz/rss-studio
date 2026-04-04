import { Minus, Plus, Type } from "lucide-react";

interface SettingsReadingSectionProps {
  readingFontSize: number;
  onChange: (fontSize: number) => void;
}

export default function SettingsReadingSection({
  readingFontSize,
  onChange,
}: SettingsReadingSectionProps) {
  return (
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
            onClick={() => onChange(readingFontSize - 1)}
            aria-label="Decrease font size"
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
            onChange={(event) => onChange(Number(event.target.value))}
            className="flex-1 accent-emerald-600 h-1.5 cursor-pointer"
          />
          <button
            onClick={() => onChange(readingFontSize + 1)}
            aria-label="Increase font size"
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
  );
}
