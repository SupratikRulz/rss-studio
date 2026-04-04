import { SignIn } from "@clerk/nextjs";
import { Rss } from "lucide-react";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-neutral-950 px-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
          <Rss size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-neutral-100 tracking-tight">
          RSS Studio
        </h1>
        <p className="text-sm text-gray-500 dark:text-neutral-400">
          Sign in to your account
        </p>
      </div>
      <SignIn
        appearance={{
          elements: {
            card: "shadow-xl border border-gray-100 dark:border-neutral-800",
            headerTitle: "text-gray-900 dark:text-neutral-100",
            headerSubtitle: "text-gray-500 dark:text-neutral-400",
            socialButtonsBlockButton:
              "border-gray-200 dark:border-neutral-700 hover:bg-gray-50 dark:hover:bg-neutral-800 text-gray-700 dark:text-neutral-300",
            formFieldLabel: "text-gray-700 dark:text-neutral-300",
            formFieldInput:
              "border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-gray-900 dark:text-neutral-100",
            footerActionLink:
              "text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300",
          },
        }}
      />
    </div>
  );
}
