import { expect, test } from "@playwright/test";
import { sampleFeedSource } from "../../src/test/fixtures/feed-fixtures";
import { mockFeedApis, seedAppState } from "./helpers";

test.beforeEach(async ({ page }) => {
  await mockFeedApis(page);
});

test("shows personalized and explore feeds on the Today page", async ({ page }) => {
  await seedAppState(page);

  await page.goto("/");

  await expect(page.getByRole("heading", { name: "Today" })).toBeVisible();
  await expect(page.getByText("Mock article title")).toBeVisible();

  await page.getByRole("button", { name: "Explore" }).click();

  await expect(page.getByText("Explore Feed")).toBeVisible();
  await expect(page.getByText("Mock article title")).toBeVisible();
});

test("discovers a feed from search, follows it, opens an article, and bookmarks it", async ({
  page,
}) => {
  await page.goto("/search");

  await page
    .getByPlaceholder("Search by topic, website, or RSS link")
    .fill(sampleFeedSource.url);
  await page.keyboard.press("Enter");

  await expect(page.getByText("Discovered Feed")).toBeVisible();
  await page.getByRole("button", { name: /Follow/i }).click();

  const folderDialog = page.getByRole("dialog", { name: "Choose Folder" });
  await expect(folderDialog).toBeVisible();
  await folderDialog.getByRole("button", { name: "New" }).click();
  await page.getByPlaceholder("New folder name").fill("Favorites");
  await folderDialog.getByRole("button", { name: /^Follow$/ }).click();
  await expect(folderDialog).toBeHidden();

  await page.goto("/feeds");
  await expect(page.getByRole("button", { name: /Favorites/ })).toBeVisible();
  await page.getByRole("button", { name: /Favorites/ }).click();
  await page.getByRole("button", { name: "Mock Feed" }).click();

  await expect(page.getByRole("heading", { name: "Mock Feed" })).toBeVisible();
  await page.getByRole("heading", { name: "Mock article title", level: 3 }).click();

  await expect(page.getByRole("heading", { name: "Mock article title" })).toBeVisible();
  await page.getByLabel("Bookmark this article").first().click();

  await page.goto("/bookmarks");
  await expect(page.getByText("Mock article title")).toBeVisible();
});

test("supports keyword discovery and folder creation from curated categories", async ({
  page,
}) => {
  await page.goto("/search");

  await page.getByPlaceholder("Search by topic, website, or RSS link").fill("programming");
  await expect(page.getByRole("button", { name: /Programming/ })).toBeVisible();
  await page.getByRole("button", { name: /Programming/ }).click();

  await expect(page.getByRole("heading", { name: "Programming" })).toBeVisible();
  await page.getByRole("button", { name: /^Follow$/ }).first().click();
  const folderDialog = page.getByRole("dialog", { name: "Choose Folder" });
  await expect(folderDialog).toBeVisible();
  await folderDialog.getByRole("button", { name: "New" }).click();
  await page.getByPlaceholder("New folder name").fill("Engineering");
  await folderDialog.getByRole("button", { name: /^Follow$/ }).click();
  await expect(folderDialog).toBeHidden();

  await page.goto("/feeds");
  await expect(page.getByRole("button", { name: /Engineering/ })).toBeVisible();
  await page.getByRole("button", { name: /Engineering/ }).click();
  await expect(page.getByRole("button", { name: "Mock Feed" })).toBeVisible();
});

test("persists settings changes and uses the mocked sign-out path", async ({ page }) => {
  await page.goto("/settings");

  await expect(page.getByRole("heading", { name: "Settings" })).toBeVisible();
  await expect(page.getByText("Appearance")).toBeVisible();
  await page.getByRole("button", { name: "Theme Dark" }).click();
  await page.getByRole("button", { name: "Feed view Cards" }).click();
  await page.getByLabel("Increase font size").click();
  await page.getByLabel("Increase font size").click();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect
    .poll(() =>
      page.evaluate(() => {
        const raw = window.localStorage.getItem("rss-studio-settings-e2e-user");
        return raw ? JSON.parse(raw).state : null;
      })
    )
    .toMatchObject({
      theme: "dark",
      readingFontSize: 18,
      feedView: "cards",
    });

  await page.reload();

  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(page.getByText("18px")).toBeVisible();

  await page.getByRole("button", { name: /Log Out/i }).click();
  await expect(page).toHaveURL(/\/sign-in$/);
  await expect(page.getByText("Mock Sign In")).toBeVisible();
});
