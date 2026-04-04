import type { Metadata } from "next";
import SettingsPageClient from "@/components/pages/settings-page-client";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Settings",
  description:
    "Tailor RSS Studio to the way you read with theme controls, layout options, and reading preferences that feel right on every device.",
  path: "/settings",
  noIndex: true,
});

export default function SettingsPage() {
  return <SettingsPageClient />;
}
