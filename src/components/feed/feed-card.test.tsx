import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import FeedCard from "./feed-card";
import { sampleFeedItem } from "@/test/fixtures/feed-fixtures";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("FeedCard", () => {
  it("renders the magazine thumbnail on mobile layouts", () => {
    const { container } = render(<FeedCard item={sampleFeedItem} />);

    const image = container.querySelector(`img[src="${sampleFeedItem.imageUrl}"]`);

    expect(image).toBeInTheDocument();
    expect(image?.parentElement).toHaveClass("w-20", "h-20", "sm:w-28", "sm:h-20");
    expect(image?.parentElement).not.toHaveClass("hidden");
  });
});
