interface ArticleNotFoundProps {
  onGoBack: () => void;
}

export default function ArticleNotFound({
  onGoBack,
}: ArticleNotFoundProps) {
  return (
    <div className="max-w-7xl mx-auto flex flex-col items-center justify-center py-20">
      <p className="text-sm text-gray-500 dark:text-neutral-400 mb-4">
        Article not found
      </p>
      <button
        onClick={onGoBack}
        className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer"
      >
        Go back to feed
      </button>
    </div>
  );
}
