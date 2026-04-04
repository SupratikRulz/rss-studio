import type { Page } from "@playwright/test";
import {
  sampleFeedItem,
  sampleFeedSource,
  sampleParsedFeedResponse,
  sampleSearchFeedResponse,
  sampleSearchKeywordResponse,
} from "../../src/test/fixtures/feed-fixtures";

const todayPubDate = new Date().toISOString();

export async function mockFeedApis(page: Page) {
  await page.route("**/api/rss/search", async (route) => {
    const request = route.request();
    const body = request.postDataJSON() as { query?: string } | null;

    if (body?.query?.includes(".")) {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify(sampleSearchFeedResponse),
      });
      return;
    }

    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify(sampleSearchKeywordResponse),
    });
  });

  await page.route("**/api/rss/parse", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        ...sampleParsedFeedResponse,
        items: sampleParsedFeedResponse.items.map((item) => ({
          ...item,
          pubDate: todayPubDate,
        })),
      }),
    });
  });

  await page.route("**/api/rss/explore", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        items: [
          {
            ...sampleFeedItem,
            id: "explore-item-1",
            sourceId: "explore-bbc",
            sourceName: "Explore Feed",
            pubDate: todayPubDate,
          },
        ],
      }),
    });
  });
}

export async function seedAppState(
  page: Page,
  {
    sources = [sampleFeedSource],
    folders = [{ id: "default", name: "General", createdAt: "2026-04-01T00:00:00.000Z" }],
    bookmarks = [],
    settings = { theme: "light", readingFontSize: 16, feedView: "magazine" },
  }: {
    sources?: unknown[];
    folders?: unknown[];
    bookmarks?: unknown[];
    settings?: {
      theme: "light" | "dark" | "system";
      readingFontSize: number;
      feedView: "magazine" | "cards" | "article" | "titleOnly";
    };
  } = {}
) {
  await page.addInitScript(
    ({ sources, folders, bookmarks, settings }) => {
      window.localStorage.setItem(
        "rss-studio-feeds-e2e-user",
        JSON.stringify({
          state: {
            sources,
            folders,
            selectedArticle: null,
          },
          version: 0,
        })
      );

      window.localStorage.setItem(
        "rss-studio-bookmarks-e2e-user",
        JSON.stringify({
          state: {
            bookmarks,
          },
          version: 0,
        })
      );

      window.localStorage.setItem(
        "rss-studio-settings-e2e-user",
        JSON.stringify({
          state: settings,
          version: 0,
        })
      );
    },
    { sources, folders, bookmarks, settings }
  );
}
