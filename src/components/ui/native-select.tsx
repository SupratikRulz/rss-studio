"use client";

import type { SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NativeSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  wrapperClassName?: string;
  chevronClassName?: string;
  iconSize?: number;
  ref?: React.Ref<HTMLSelectElement>;
}

export default function NativeSelect({
  className,
  wrapperClassName,
  chevronClassName,
  children,
  iconSize = 16,
  ref,
  ...props
}: NativeSelectProps) {
  return (
    <div className={cn("relative", wrapperClassName)}>
      <select
        ref={ref}
        className={cn("appearance-none", className)}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute h-full top-1/2 -translate-y-1/2 right-2.5 flex items-center">
        <ChevronDown
          size={iconSize}
          className={cn("text-gray-400 dark:text-neutral-500", chevronClassName)}
        />
      </span>
    </div>
  );
}
