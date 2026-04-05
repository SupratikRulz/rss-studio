import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FeedTitleView from "./feed-title-view";
import { sampleFeedItem } from "@/test/fixtures/feed-fixtures";
import type { FeedItem } from "@/lib/types";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("FeedTitleView", () => {
  it("renders article thumbnail icon when imageUrl is present", () => {
    const { container } = render(
      <FeedTitleView items={[sampleFeedItem]} isLoading={false} />
    );

    const image = container.querySelector(
      `img[src="${sampleFeedItem.imageUrl}"]`
    );

    expect(image).toBeInTheDocument();
    expect(image?.parentElement).toHaveClass("h-5", "w-5", "rounded");
  });

  it("does not render an image or placeholder when imageUrl is absent", () => {
    const itemWithoutImage: FeedItem = {
      ...sampleFeedItem,
      id: "no-img",
      imageUrl: undefined as unknown as string,
    };

    const { container } = render(
      <FeedTitleView items={[itemWithoutImage]} isLoading={false} />
    );

    const image = container.querySelector("img");
    expect(image).not.toBeInTheDocument();

    const placeholder = container.querySelector(".h-5.w-5.bg-gray-100");
    expect(placeholder).not.toBeInTheDocument();
  });

  it("shows the title and date but not source name or description", () => {
    render(
      <FeedTitleView items={[sampleFeedItem]} isLoading={false} />
    );

    expect(screen.getByText(sampleFeedItem.title)).toBeInTheDocument();

    expect(screen.queryByText(sampleFeedItem.sourceName!)).not.toBeInTheDocument();
    expect(screen.queryByText(/Mock article description/)).not.toBeInTheDocument();

    expect(screen.getByText(/ago/)).toBeInTheDocument();
  });

  it("renders share buttons for desktop and mobile", () => {
    const { container } = render(
      <FeedTitleView items={[sampleFeedItem]} isLoading={false} />
    );

    const shareLabels = container.querySelectorAll('[aria-label="Share article"]');
    expect(shareLabels.length).toBeGreaterThanOrEqual(1);

    const socialLinks = container.querySelectorAll('[aria-label="Share on Facebook"]');
    expect(socialLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("renders skeleton shimmer placeholders when loading", () => {
    const { container } = render(
      <FeedTitleView items={[]} isLoading={true} />
    );

    const rows = container.querySelectorAll(".flex.items-center.gap-3");
    expect(rows.length).toBe(12);

    const firstRow = rows[0];
    const shimmers = firstRow.children;
    expect(shimmers).toHaveLength(4);
  });
});
