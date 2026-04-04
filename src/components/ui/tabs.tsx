"use client";

import { cn } from "@/lib/utils";

interface Tab {
  id: string;
  label: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export default function Tabs({ tabs, activeTab, onChange }: TabsProps) {
  return (
    <div className="flex border-b border-gray-200 dark:border-neutral-800">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-5 py-3 text-sm font-medium transition-colors relative cursor-pointer",
            activeTab === tab.id
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}
