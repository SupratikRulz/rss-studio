// @vitest-environment node

import { GET } from "@/app/api/rss/explore/route";
import { EXPLORE_SOURCES } from "@/lib/constants";
import { sampleRssXml } from "@/test/fixtures/feed-fixtures";
import { expect } from "vitest";
import { describe, it, vi } from "vitest";

describe("GET /api/rss/explore", () => {
  it("aggregates items from the explore source list", async () => {
    const fetchMock = vi
      .fn()
      .mockImplementation(async () => ({
        ok: true,
        text: async () => sampleRssXml,
      }));
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledTimes(EXPLORE_SOURCES.length);
    expect(json.items.length).toBe(EXPLORE_SOURCES.length);
    expect(json.items[0]).toMatchObject({
      title: "Mock article title",
    });
  });

  it("ignores individual source failures as long as some feeds resolve", async () => {
    const failedSourceUrl = EXPLORE_SOURCES[0]!.url;
    const fetchMock = vi.fn().mockImplementation(async (url: string) => {
      if (url.includes(failedSourceUrl) || url.includes(encodeURIComponent(failedSourceUrl))) {
        throw new Error("boom");
      }

      return {
        ok: true,
        text: async () => sampleRssXml,
      };
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET();
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.items.length).toBe(EXPLORE_SOURCES.length - 1);
  });
});
