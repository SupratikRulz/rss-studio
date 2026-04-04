"use client";

import useSettingsStore from "@/stores/settings-store";
import SettingsAccountSection from "@/components/pages/settings/components/settings-account-section";
import SettingsAppearanceSection from "@/components/pages/settings/components/settings-appearance-section";
import SettingsFeedViewSection from "@/components/pages/settings/components/settings-feed-view-section";
import SettingsHeader, {
  SettingsLoadingHeader,
} from "@/components/pages/settings/components/settings-header";
import SettingsReadingSection from "@/components/pages/settings/components/settings-reading-section";
import useStoreHydrated from "@/hooks/use-store-hydrated";

export default function SettingsPageClient() {
  const {
    theme,
    readingFontSize,
    feedView,
    setTheme,
    setReadingFontSize,
    setFeedView,
  } = useSettingsStore();
  const isStoreHydrated = useStoreHydrated(useSettingsStore.persist);

  if (!isStoreHydrated) {
    return (
      <div className="max-w-2xl mx-auto">
        <SettingsLoadingHeader />
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto animate-page">
      <SettingsHeader />

      <div className="px-4 sm:px-6 py-6 space-y-8">
        <SettingsAccountSection />
        <SettingsFeedViewSection feedView={feedView} onChange={setFeedView} />
        <SettingsReadingSection
          readingFontSize={readingFontSize}
          onChange={setReadingFontSize}
        />
        <SettingsAppearanceSection theme={theme} onChange={setTheme} />
      </div>
    </div>
  );
}
