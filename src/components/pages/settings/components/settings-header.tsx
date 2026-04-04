import { Show, useClerk } from "@clerk/nextjs";
import { LogOut } from "lucide-react";

export default function SettingsHeader() {
  const { signOut } = useClerk();

  return (
    <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
      <div className="flex items-center justify-between px-4 sm:px-6 py-5">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
          Settings
        </h1>
        <Show when="signed-in">
          <button
            onClick={() => signOut({ redirectUrl: "/sign-in" })}
            className="inline-flex items-center gap-2 rounded-lg border border-red-200 dark:border-red-900/40 px-3 py-1.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors cursor-pointer"
          >
            <LogOut size={15} />
            Log Out
          </button>
        </Show>
      </div>
    </header>
  );
}

export function SettingsLoadingHeader() {
  return (
    <header className="sticky top-0 z-10 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-sm border-b border-gray-100 dark:border-neutral-800 mb-2">
      <div className="px-4 sm:px-6 py-5">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-neutral-100">
          Settings
        </h1>
      </div>
    </header>
  );
}
