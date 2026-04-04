import type { DiscoverCategory } from "@/lib/discover-sources";
import SourceIcon from "@/components/ui/source-icon";

interface CategoryCardProps {
  category: DiscoverCategory;
  onClick: () => void;
}

export default function CategoryCard({
  category,
  onClick,
}: CategoryCardProps) {
  const featured = category.sources[0];

  return (
    <button
      onClick={onClick}
      className="text-left rounded-xl border border-gray-100 dark:border-neutral-800 p-4 hover:border-gray-200 dark:hover:border-neutral-700 hover:bg-gray-50/50 dark:hover:bg-neutral-900/50 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer group w-full"
    >
      <h3 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
        {category.name}
      </h3>
      {featured && (
        <div className="flex items-center gap-2">
          <SourceIcon
            siteUrl={featured.siteUrl}
            size={22}
            className="rounded shrink-0"
          />
          <div className="min-w-0">
            <p className="text-[10px] text-gray-400 dark:text-neutral-500">
              Featuring
            </p>
            <p className="text-xs text-gray-600 dark:text-neutral-300 font-medium truncate">
              {category.featured}
            </p>
          </div>
        </div>
      )}
    </button>
  );
}
