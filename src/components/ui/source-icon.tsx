"use client";

import { useState } from "react";
import { Rss } from "lucide-react";
import { cn } from "@/lib/utils";

interface SourceIconProps {
  siteUrl: string;
  imageUrl?: string;
  size?: number;
  className?: string;
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return "";
  }
}

export default function SourceIcon({
  siteUrl,
  imageUrl,
  size = 16,
  className,
}: SourceIconProps) {
  const [failed, setFailed] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  const domain = getDomain(siteUrl);
  const faviconUrl = domain
    ? `https://www.google.com/s2/favicons?domain=${domain}&sz=${Math.max(size * 2, 32)}`
    : "";

  const src = !imageUrl || useFallback ? faviconUrl : imageUrl;

  if (failed || !src) {
    return (
      <div
        className={cn(
          "rounded bg-gray-100 dark:bg-neutral-800 flex items-center justify-center shrink-0 text-gray-400 dark:text-neutral-500",
          className
        )}
        style={{ width: size, height: size }}
      >
        <Rss size={size * 0.6} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt=""
      className={cn("rounded object-contain shrink-0 border bg-white", className)}
      style={{ width: size, height: size }}
      loading="lazy"
      onError={() => {
        if (!useFallback && imageUrl) {
          setUseFallback(true);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
