export default function FeedsPageFallback() {
  return (
    <div className="max-w-3xl mx-auto animate-page min-h-[40vh]">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 py-5">
          <div className="h-7 w-24 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse" />
        </div>
      </header>
    </div>
  );
}
