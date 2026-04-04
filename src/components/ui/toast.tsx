"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import useToastStore, { type ToastType } from "@/stores/toast-store";

const iconMap: Record<ToastType, typeof AlertCircle> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
};

const colorMap: Record<ToastType, string> = {
  error:
    "bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
  success:
    "bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200",
  info: "bg-blue-50 dark:bg-blue-950/80 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
};

const iconColorMap: Record<ToastType, string> = {
  error: "text-red-500 dark:text-red-400",
  success: "text-emerald-500 dark:text-emerald-400",
  info: "text-blue-500 dark:text-blue-400",
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || toasts.length === 0) return null;

  return createPortal(
    <div
      className="fixed top-4 z-200 flex flex-col gap-2 pointer-events-none
        left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm
        lg:left-auto lg:translate-x-0 lg:right-4 lg:w-auto lg:max-w-md"
    >
      {toasts.map((toast) => {
        const Icon = iconMap[toast.type];
        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-2.5 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm animate-slide-in-toast",
              colorMap[toast.type]
            )}
          >
            <Icon
              size={18}
              className={cn("shrink-0 mt-0.5", iconColorMap[toast.type])}
            />
            <p className="flex-1 text-sm font-medium leading-snug">
              {toast.message}
            </p>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 rounded-md p-0.5 opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>,
    document.body
  );
}
