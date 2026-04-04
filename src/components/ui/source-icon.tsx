"use client";

import { useState } from "react";
import Image from "next/image";
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

function getFaviconUrls(domain: string, size: number): string[] {
  if (!domain) return [];
  const hiRes = Math.max(size * 3, 128);
  return [
    `https://icon.horse/icon/${domain}`,
    `https://www.google.com/s2/favicons?domain=${domain}&sz=${hiRes}`,
    `https://icons.duckduckgo.com/ip3/${domain}.ico`,
  ];
}

export default function SourceIcon({
  siteUrl,
  imageUrl,
  size = 16,
  className,
}: SourceIconProps) {
  const [srcIndex, setSrcIndex] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const [failed, setFailed] = useState(false);

  const domain = getDomain(siteUrl);
  const faviconUrls = getFaviconUrls(domain, size);

  const primarySrc = !imageUrl || useFallback ? null : imageUrl;
  const currentFaviconSrc = faviconUrls[srcIndex] || null;
  const src = primarySrc || currentFaviconSrc;

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
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("rounded object-contain shrink-0 border bg-white", className)}
      loading="lazy"
      fetchPriority="low"
      onError={() => {
        if (primarySrc) {
          setUseFallback(true);
        } else if (srcIndex < faviconUrls.length - 1) {
          setSrcIndex((i) => i + 1);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
