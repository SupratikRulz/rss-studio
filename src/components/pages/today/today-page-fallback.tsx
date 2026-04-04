export default function TodayPageFallback() {
  return (
    <div className="max-w-3xl mx-auto animate-page min-h-[40vh]">
      <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
        <div className="px-4 sm:px-6 pt-5 pb-0">
          <div className="h-7 w-28 bg-gray-200 dark:bg-neutral-800 rounded-md animate-pulse mb-4" />
          <div className="h-11 bg-gray-100 dark:bg-neutral-900 rounded-lg animate-pulse mb-2" />
        </div>
      </header>
    </div>
  );
}
