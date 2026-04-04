import { searchDiscoverSources } from "@/lib/discover-sources";
import { describe, it, expect } from "vitest";

describe("searchDiscoverSources", () => {
  it("returns matching sources when the query matches source metadata", () => {
    const results = searchDiscoverSources("verge");

    expect(results.length).toBeGreaterThan(0);
    expect(results[0]?.sources.some((source) => source.title === "The Verge")).toBe(true);
  });

  it("returns full categories when the category itself matches", () => {
    const results = searchDiscoverSources("programming");
    const programming = results.find((category) => category.id === "programming");

    expect(programming).toBeDefined();
    expect(programming?.sources.length).toBeGreaterThan(1);
  });

  it("returns an empty list for blank queries", () => {
    expect(searchDiscoverSources("   ")).toEqual([]);
  });
});
