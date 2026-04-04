"use client";

import { Mail, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useToastStore from "@/stores/toast-store";

function FacebookIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function XIcon({ size = 17 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
      <path d="M4 20l6.768 -6.768m2.46 -2.46L20 4" />
    </svg>
  );
}

interface ShareButtonsProps {
  url: string;
  title: string;
  variant?: "full" | "native";
  className?: string;
}

const SHARE_ACTIONS = [
  {
    id: "facebook",
    label: "Share on Facebook",
    icon: FacebookIcon,
    getUrl: (url: string) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    id: "twitter",
    label: "Post on X",
    icon: XIcon,
    getUrl: (url: string, title: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
  },
  {
    id: "email",
    label: "Email",
    icon: Mail,
    getUrl: (url: string, title: string) =>
      `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
  },
];

export default function ShareButtons({
  url,
  title,
  variant = "full",
  className,
}: ShareButtonsProps) {
  async function handleNativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        /* user cancelled */
      }
    }

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      try {
        await navigator.clipboard.writeText(url);
        useToastStore.getState().addToast("Link copied to clipboard.", "success");
        return;
      } catch {
        /* clipboard unavailable */
      }
    }

    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }

  const nativeShareButton = (
    <button
      type="button"
      onClick={handleNativeShare}
      className="rounded-lg p-2 text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
      title="Share"
      aria-label="Share article"
    >
      <Share2 size={17} strokeWidth={1.8} />
    </button>
  );

  if (variant === "native") {
    return <div className={cn("flex items-center", className)}>{nativeShareButton}</div>;
  }

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {SHARE_ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <a
            key={action.id}
            href={action.getUrl(url, title)}
            target={action.id !== "email" ? "_blank" : undefined}
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-400 dark:text-neutral-500 hover:bg-gray-100 dark:hover:bg-neutral-800 hover:text-gray-600 dark:hover:text-neutral-300 transition-colors cursor-pointer"
            title={action.label}
            aria-label={action.label}
          >
            <Icon size={17} />
          </a>
        );
      })}
      {nativeShareButton}
    </div>
  );
}
