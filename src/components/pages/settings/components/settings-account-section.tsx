import Link from "next/link";
import { LogIn, User } from "lucide-react";
import { Show, SignInButton } from "@/lib/auth";
import UserAvatar from "./user-avatar";

export default function SettingsAccountSection() {
  return (
    <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100 dark:border-neutral-800">
      <Show when="signed-in">
        <UserAvatar size={80} />
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-4">
          Customize your reading experience
        </p>
      </Show>

      <Show when="signed-out">
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
        <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1 mb-4">
          Sign in to sync your preferences
        </p>
        <div className="flex items-center gap-3">
          <SignInButton mode="redirect">
            <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 transition-colors cursor-pointer">
              <LogIn size={16} />
              Sign In
            </button>
          </SignInButton>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 rounded-lg border border-gray-200 dark:border-neutral-700 px-4 py-2 text-sm font-medium text-gray-700 dark:text-neutral-300 hover:bg-gray-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Sign Up
          </Link>
        </div>
      </Show>
    </div>
  );
}
