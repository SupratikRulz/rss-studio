import { describe, it, vi, expect } from "vitest";

describe("seo", () => {
  it("uses NEXT_PUBLIC_APP_URL when present", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://rssstudio.test");
    vi.stubEnv("VERCEL_URL", "");
    vi.resetModules();

    const { createPageMetadata } = await import("@/lib/seo");
    const metadata = createPageMetadata({
      title: "Search",
      description: "Search feeds",
      path: "/search",
    });

    expect(metadata.alternates?.canonical).toBe("https://rssstudio.test/search");
    expect(metadata.openGraph?.url).toBe("https://rssstudio.test/search");
  });

  it("falls back to VERCEL_URL and supports noindex pages", async () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "");
    vi.stubEnv("VERCEL_URL", "rssstudio-preview.vercel.app");
    vi.resetModules();

    const { createPageMetadata } = await import("@/lib/seo");
    const metadata = createPageMetadata({
      title: "Sign In",
      description: "Private auth page",
      path: "/sign-in",
      noIndex: true,
    });

    expect(metadata.alternates?.canonical).toBe(
      "https://rssstudio-preview.vercel.app/sign-in"
    );
    expect(metadata.robots).toEqual({ index: false, follow: false });
  });
});
