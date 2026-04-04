import { setCurrentUserId } from "@/lib/user-storage";
import useSettingsStore from "@/stores/settings-store";
import { describe, it, expect, beforeEach } from "vitest";

function resetSettingsStore() {
  useSettingsStore.setState({
    theme: "light",
    readingFontSize: 16,
    feedView: "magazine",
  });
}

describe("settings store", () => {
  beforeEach(() => {
    setCurrentUserId("user-1");
    resetSettingsStore();
  });

  it("updates theme and feed view", () => {
    useSettingsStore.getState().setTheme("dark");
    useSettingsStore.getState().setFeedView("cards");

    expect(useSettingsStore.getState().theme).toBe("dark");
    expect(useSettingsStore.getState().feedView).toBe("cards");
  });

  it("clamps reading font size to the supported range", () => {
    useSettingsStore.getState().setReadingFontSize(8);
    expect(useSettingsStore.getState().readingFontSize).toBe(12);

    useSettingsStore.getState().setReadingFontSize(60);
    expect(useSettingsStore.getState().readingFontSize).toBe(48);
  });
});
