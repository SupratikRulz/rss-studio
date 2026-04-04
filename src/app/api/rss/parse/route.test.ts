// @vitest-environment node

import { NextRequest } from "next/server";
import { POST } from "@/app/api/rss/parse/route";
import { sampleFeedUrl, sampleRssXml } from "@/test/fixtures/feed-fixtures";
import { describe, it, vi, expect } from "vitest";

function createRequest(body: unknown) {
  return new NextRequest("http://localhost/api/rss/parse", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  });
}

describe("POST /api/rss/parse", () => {
  it("returns a 400 when url is missing", async () => {
    const response = await POST(createRequest({}));

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ error: "URL is required" });
  });

  it("parses a feed and normalizes its items", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        text: async () => sampleRssXml,
      })
    );

    const response = await POST(createRequest({ url: sampleFeedUrl }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(json.title).toBe("Mock Feed");
    expect(json.items[0]).toMatchObject({
      title: "Mock article title",
      sourceName: "Mock Feed",
      sourceUrl: "https://example.com",
      imageUrl: "https://example.com/image.jpg",
    });
  });

  it("falls back to the codetabs proxy when the direct fetch is not xml", async () => {
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        text: async () => "<html>Not RSS</html>",
      })
      .mockResolvedValueOnce({
        ok: true,
        text: async () => sampleRssXml,
      });
    vi.stubGlobal("fetch", fetchMock);

    const response = await POST(createRequest({ url: sampleFeedUrl }));
    const json = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenNthCalledWith(
      2,
      `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(sampleFeedUrl)}`,
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      })
    );
    expect(json.items).toHaveLength(1);
  });
});
