import {
  extractImageFromHtml,
  formatDate,
  isToday,
  proxyArticleImages,
  removeFirstDuplicateContentImage,
  stripHtml,
  truncate,
} from "@/lib/utils";
import { describe, it, vi, expect } from "vitest";

describe("utils", () => {
  it("formats recent and older dates relative to now", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-05T12:00:00.000Z"));

    expect(formatDate("2026-04-05T11:59:30.000Z")).toBe("Just now");
    expect(formatDate("2026-04-05T11:45:00.000Z")).toBe("15m ago");
    expect(formatDate("2026-04-05T09:00:00.000Z")).toBe("3h ago");
    expect(formatDate("2026-04-03T12:00:00.000Z")).toBe("2d ago");
    expect(formatDate("2025-02-15T12:00:00.000Z")).toBe("Feb 15, 2025");
  });

  it("handles text helpers", () => {
    expect(truncate("Short text", 20)).toBe("Short text");
    expect(truncate("This string is too long", 7)).toBe("This st…");
    expect(stripHtml("<p>Hello&nbsp;<strong>RSS</strong> &amp; friends</p>")).toBe(
      "Hello RSS & friends"
    );
    expect(extractImageFromHtml('<p><img src="https://example.com/cover.jpg" /></p>')).toBe(
      "https://example.com/cover.jpg"
    );
  });

  it("proxies article images but keeps existing optimized or data urls", () => {
    const html =
      '<img src="https://example.com/cover.jpg" /><img src="data:image/png;base64,abc" /><img src="/_next/image?url=https%3A%2F%2Fexample.com%2Falready.jpg&w=828&q=75" />';

    expect(proxyArticleImages(html)).toContain(
      '/_next/image?url=https%3A%2F%2Fexample.com%2Fcover.jpg&w=828&q=75'
    );
    expect(proxyArticleImages(html)).toContain('src="data:image/png;base64,abc"');
    expect(proxyArticleImages(html)).toContain(
      'src="/_next/image?url=https%3A%2F%2Fexample.com%2Falready.jpg&w=828&q=75"'
    );
  });

  it("detects whether a date is today", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-04-05T12:00:00.000Z"));

    expect(isToday("2026-04-05T01:00:00.000Z")).toBe(true);
    expect(isToday("2026-04-03T12:00:00.000Z")).toBe(false);
    expect(isToday("")).toBe(false);
  });

  it("removes only the first duplicated lead image", () => {
    const html = `
      <div>
        <img src="https://example.com/cover.jpg?size=large" />
        <p>Paragraph</p>
        <img src="https://example.com/other.jpg" />
      </div>
    `;

    const result = removeFirstDuplicateContentImage(
      html,
      "https://example.com/cover.jpg?size=large"
    );

    expect(result).not.toContain("cover.jpg");
    expect(result).toContain("other.jpg");
    expect(result).toContain("<p>Paragraph</p>");
  });
});
