// @vitest-environment node

import { NextRequest } from "next/server";
import { POST } from "@/app/api/rss/search/route";
import {
  sampleFeedUrl,
  sampleRssXml,
  sampleSearchKeywordResponse,
} from "@/test/fixtures/feed-fixtures";

import { describe, it, vi, expect } from "vitest";

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/rss/search", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("POST /api/rss/search", () => {
  it("returns a 400 when query is missing", async () => {
    const response = await POST(createRequest({ query: "" }));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "Query is required" });
  });

  it("returns curated keyword matches", async () => {
    const response = await POST(createRequest({ query: "verge" }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.type).toBe("keyword");
    expect(json.feed).toBeNull();
    expect(json.categories[0]).toMatchObject(sampleSearchKeywordResponse.categories[0]);
  });

  it("discovers a feed from a url-like query and includes preview items", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        text: async () => sampleRssXml,
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => sampleRssXml,
      });
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createRequest({ query: sampleFeedUrl }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.type).toBe("feed");
    expect(json.feed).toMatchObject({
      title: "Mock Feed",
      feedUrl: sampleFeedUrl,
    });
    expect(json.items[0]).toMatchObject({
      title: "Mock article title",
      imageUrl: "https://example.com/image.jpg",
    });
  });
});
