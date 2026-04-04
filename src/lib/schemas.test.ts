import {
  addFeedInputSchema,
  addFolderInputSchema,
  bookmarkSchema,
  feedSourceSchema,
  folderSchema,
} from "@/lib/schemas";
import { sampleFeedItem, sampleFeedSource } from "@/test/fixtures/feed-fixtures";
import { describe, it, expect } from "vitest";

describe("schemas", () => {
  it("accepts valid feed and bookmark shapes", () => {
    expect(feedSourceSchema.parse(sampleFeedSource)).toEqual(sampleFeedSource);
    expect(
      bookmarkSchema.parse({
        id: "bookmark-1",
        item: sampleFeedItem,
        bookmarkedAt: "2026-04-01T11:00:00.000Z",
      })
    ).toMatchObject({
      id: "bookmark-1",
      item: sampleFeedItem,
    });
  });

  it("rejects invalid add feed input", () => {
    const result = addFeedInputSchema.safeParse({
      url: "not-a-url",
      folderId: "",
    });

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.map((issue) => issue.message)).toEqual([
        "Please enter a valid URL",
        "Please select a folder",
      ]);
    }
  });

  it("validates folder names consistently", () => {
    expect(addFolderInputSchema.safeParse({ name: "" }).success).toBe(false);
    expect(
      folderSchema.safeParse({
        id: "folder-1",
        name: "Engineering",
        createdAt: "2026-04-01T00:00:00.000Z",
      }).success
    ).toBe(true);
  });
});
