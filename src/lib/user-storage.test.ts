import {
  createUserStorage,
  getCurrentUserId,
  migrateToUserStorage,
  setCurrentUserId,
} from "@/lib/user-storage";

import { describe, it, expect } from "vitest";

describe("user storage", () => {
  it("tracks the active user id", () => {
    setCurrentUserId("user-123");
    expect(getCurrentUserId()).toBe("user-123");

    setCurrentUserId(null);
    expect(getCurrentUserId()).toBeNull();
  });

  it("reads and writes data with a user namespace", () => {
    const storage = createUserStorage();
    if (!storage) {
      throw new Error("Expected user storage to be available in tests");
    }

    setCurrentUserId("user-123");
    storage.setItem("rss-studio-settings", {
      state: { theme: "dark" },
      version: 0,
    });

    expect(localStorage.getItem("rss-studio-settings-user-123")).toBe(
      JSON.stringify({
        state: { theme: "dark" },
        version: 0,
      })
    );
    expect(storage.getItem("rss-studio-settings")).toEqual({
      state: { theme: "dark" },
      version: 0,
    });
  });

  it("migrates generic storage to a user key once", () => {
    localStorage.setItem(
      "rss-studio-feeds",
      JSON.stringify({ state: { sources: [] }, version: 0 })
    );

    migrateToUserStorage("rss-studio-feeds", "user-123");

    expect(localStorage.getItem("rss-studio-feeds")).toBeNull();
    expect(localStorage.getItem("rss-studio-feeds-user-123")).toBe(
      JSON.stringify({ state: { sources: [] }, version: 0 })
    );
  });
});
