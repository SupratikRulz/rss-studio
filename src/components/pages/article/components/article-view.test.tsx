import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import ArticleView from "./article-view";
import useSettingsStore from "@/stores/settings-store";
import { sampleFeedItem } from "@/test/fixtures/feed-fixtures";

describe("ArticleView", () => {
  beforeEach(() => {
    useSettingsStore.setState({
      theme: "light",
      readingFontSize: 22,
      feedView: "magazine",
    });
  });

  it("applies the saved reading font size to article content", () => {
    render(<ArticleView article={sampleFeedItem} onBack={() => {}} />);

    expect(screen.getByText("Mock article body.").parentElement).toHaveStyle({
      fontSize: "22px",
    });
  });
});
