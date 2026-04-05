import type { Metadata } from "next";
import { Rss } from "lucide-react";
import { SignIn } from "@/lib/auth";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Sign In",
  description:
    "Sign in to RSS Studio to pick up where you left off with your feeds, folders, bookmarks, and personalized reading setup.",
  path: "/sign-in",
  noIndex: true,
});

export default function SignInPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-0 mx-auto lg:px-4">
      <div className="mb-8 flex flex-col items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 shadow-lg shadow-emerald-600/20">
          <Rss size={24} className="text-white" />
        </div>
        <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
          RSS Studio
        </h1>
      </div>
      <div className="w-full max-w-100">
        <SignIn />
      </div>
    </div>
  );
}
