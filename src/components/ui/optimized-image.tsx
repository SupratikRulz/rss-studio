"use client";

import { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface OptimizedImageProps {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  onError?: () => void;
  hideOnError?: boolean;
  hideContainerOnError?: boolean;
}

export default function OptimizedImage({
  src,
  alt = "",
  width,
  height,
  fill,
  className,
  containerClassName,
  priority = false,
  sizes,
  quality = 75,
  onError,
  hideOnError = false,
  hideContainerOnError = false,
}: OptimizedImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    if (hideOnError || hideContainerOnError) return null;
    return <div className={cn("bg-gray-100 dark:bg-neutral-800", containerClassName)} />;
  }

  const isAbsolute = src.startsWith("http://") || src.startsWith("https://");

  const commonProps = {
    src,
    alt,
    className: cn("object-cover", className),
    quality,
    loading: (priority ? undefined : "lazy") as "lazy" | undefined,
    fetchPriority: (priority ? "high" : "low") as "high" | "low",
    onError: () => {
      setFailed(true);
      onError?.();
    },
    unoptimized: !isAbsolute ? false : undefined,
  };

  if (fill) {
    return (
      <Image
        {...commonProps}
        fill
        sizes={sizes || "100vw"}
      />
    );
  }

  return (
    <Image
      {...commonProps}
      width={width || 800}
      height={height || 450}
      sizes={sizes}
    />
  );
}
