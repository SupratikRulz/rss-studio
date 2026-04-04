import type { Metadata } from "next";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Architecture",
  description:
    "Explore how RSS Studio is built, from routing and state management to feed APIs, persistence, and the flows behind discovery and reading.",
  path: "/architecture",
});

const folderStructureSections = [
  {
    title: "App Router",
    description: "Routing is split by public docs, auth, protected app pages, and internal RSS endpoints.",
    tree: `src/app
├─ layout.tsx
├─ architecture/page.tsx
├─ (auth)/
│  ├─ layout.tsx
│  ├─ sign-in/[[...sign-in]]/page.tsx
│  └─ sign-up/[[...sign-up]]/page.tsx
├─ (app)/
│  ├─ layout.tsx
│  ├─ page.tsx
│  ├─ search/page.tsx
│  ├─ sources/page.tsx
│  ├─ feeds/page.tsx
│  ├─ bookmarks/page.tsx
│  ├─ settings/page.tsx
│  └─ article/[id]/page.tsx
└─ api/rss/
   ├─ search/route.ts
   ├─ parse/route.ts
   └─ explore/route.ts`,
  },
  {
    title: "UI Components",
    description: "The UI layer is grouped by feature area and shell primitives instead of a single generic components bucket.",
    tree: `src/components
├─ layout/
│  ├─ app-shell.tsx
│  ├─ sidebar.tsx
│  ├─ mobile-nav.tsx
│  ├─ theme-provider.tsx
│  └─ auth-sync.tsx
├─ feed/
│  ├─ feed-list.tsx
│  ├─ feed-card.tsx
│  ├─ feed-card-view.tsx
│  ├─ feed-article-view.tsx
│  ├─ feed-title-view.tsx
│  ├─ bookmark-button.tsx
│  └─ share-buttons.tsx
├─ sources/
│  └─ add-feed-dialog.tsx
└─ ui/
   ├─ tabs.tsx
   ├─ dialog.tsx
   ├─ toast.tsx
   ├─ optimized-image.tsx
   └─ skeleton.tsx`,
  },
  {
    title: "State And Domain",
    description: "State, helpers, and type definitions are isolated so business logic stays out of the page files.",
    tree: `src
├─ stores/
│  ├─ feed-store.ts
│  ├─ bookmark-store.ts
│  ├─ settings-store.ts
│  └─ toast-store.ts
├─ hooks/
│  └─ use-article-transition.ts
├─ lib/
│  ├─ types.ts
│  ├─ constants.ts
│  ├─ schemas.ts
│  ├─ utils.ts
│  ├─ user-storage.ts
│  └─ discover-sources.ts
└─ proxy.ts`,
  },
];

const stateStores = [
  {
    name: "feed-store",
    owns: "sources, folders, feedItems, exploreFeedItems, selectedArticle, source feed cache",
    behavior: "Persists user data and caches feed fetches for 5 minutes before refreshing",
  },
  {
    name: "bookmark-store",
    owns: "bookmarks keyed by generated ids",
    behavior: "Persists bookmarks per user and prevents duplicate saves by article link",
  },
  {
    name: "settings-store",
    owns: "theme, readingFontSize, feedView",
    behavior: "Persists reading preferences per user and clamps font size to safe bounds",
  },
  {
    name: "toast-store",
    owns: "temporary notifications",
    behavior: "Creates short-lived status and error messages for failed feed operations",
  },
];

const storageExamples = [
  {
    title: "Feed store",
    scope: "Persisted in localStorage per Clerk user",
    key: "rss-studio-feeds-user_2xA91",
    stores:
      "Subscribed sources, folder list, and the last selected article. Runtime feed caches and loading flags stay in memory.",
    sample: `{
  "state": {
    "sources": [
      {
        "id": "src_01",
        "title": "Hacker News",
        "url": "https://hnrss.org/frontpage",
        "siteUrl": "https://news.ycombinator.com",
        "description": "Front page stories",
        "folderId": "tech",
        "addedAt": "2026-04-04T12:10:00.000Z"
      }
    ],
    "folders": [
      {
        "id": "default",
        "name": "General",
        "createdAt": "2026-04-01T09:00:00.000Z"
      },
      {
        "id": "tech",
        "name": "Tech",
        "createdAt": "2026-04-04T12:00:00.000Z"
      }
    ],
    "selectedArticle": {
      "id": "src_01-42",
      "title": "Example article",
      "link": "https://example.com/post",
      "description": "Short summary",
      "content": "<p>Full content</p>",
      "author": "Editorial Team",
      "pubDate": "2026-04-04T11:00:00.000Z",
      "sourceName": "Hacker News",
      "sourceUrl": "https://news.ycombinator.com",
      "sourceId": "src_01"
    }
  },
  "version": 0
}`,
  },
  {
    title: "Bookmark store",
    scope: "Persisted in localStorage per Clerk user",
    key: "rss-studio-bookmarks-user_2xA91",
    stores:
      "Saved article snapshots so bookmarks remain available without re-fetching the source feed.",
    sample: `{
  "state": {
    "bookmarks": [
      {
        "id": "bookmark_01",
        "bookmarkedAt": "2026-04-04T13:20:00.000Z",
        "item": {
          "id": "src_01-42",
          "title": "Example article",
          "link": "https://example.com/post",
          "description": "Short summary",
          "content": "<p>Full content</p>",
          "author": "Editorial Team",
          "pubDate": "2026-04-04T11:00:00.000Z",
          "sourceName": "Hacker News",
          "sourceUrl": "https://news.ycombinator.com",
          "sourceId": "src_01"
        }
      }
    ]
  },
  "version": 0
}`,
  },
  {
    title: "Settings store",
    scope: "Persisted in localStorage per Clerk user",
    key: "rss-studio-settings-user_2xA91",
    stores:
      "User presentation preferences such as theme, reading font size, and preferred feed layout.",
    sample: `{
  "state": {
    "theme": "light",
    "readingFontSize": 16,
    "feedView": "magazine"
  },
  "version": 0
}`,
  },
  {
    title: "Non-persisted runtime state",
    scope: "In-memory only",
    key: "feedItems, exploreFeedItems, sourceFeedItems, loading flags, toast queue",
    stores:
      "Fetched feed payloads, 5-minute caches, and transient UI state are rebuilt after hydration instead of being written to storage.",
    sample: `{
  "feedItems": ["normalized at runtime"],
  "exploreFeedItems": ["normalized at runtime"],
  "sourceFeedItems": ["cache per source id"],
  "isLoadingFeeds": false,
  "isLoadingExplore": true,
  "toasts": [
    { "id": "toast-3", "message": "Some feeds couldn't be loaded", "type": "error" }
  ]
}`,
  },
];

const featureFlows = [
  {
    title: "1. App bootstrap and protection",
    steps: [
      "Clerk middleware protects every route except `/sign-in`, `/sign-up`, and `/architecture`.",
      "Root layout mounts `ClerkProvider` and `ThemeProvider` for all routes.",
      "Protected pages enter `src/app/(app)/layout.tsx`, which renders `AuthSync` and `AppShell`.",
      "Auth sync migrates old local storage keys, sets the current user id, then rehydrates Zustand stores.",
    ],
  },
  {
    title: "2. Today and Explore feeds",
    steps: [
      "Home page reads the selected tab from the URL so navigation state survives article back navigation.",
      "The `me` tab pulls subscribed source urls from `feed-store` and calls `POST /api/rss/parse` for each source.",
      "The `explore` tab calls `GET /api/rss/explore`, which aggregates curated public feeds from constants.",
      "Responses are normalized to `FeedItem[]`, sorted by publish date and cached in Zustand.",
    ],
  },
  {
    title: "3. Search and subscribe flow",
    steps: [
      "Search page sends a query to `POST /api/rss/search`.",
      "If the query looks like a URL, the API tries the url directly, then common feed paths, then parses recent items.",
      "If the query is keyword-based, the API searches the curated discovery catalog.",
      "Adding a source updates `feed-store`, invalidates the subscribed feed cache and shows the new source in the shell.",
    ],
  },
  {
    title: "4. Source and article reading flow",
    steps: [
      "Selecting a source in navigation triggers `fetchSourceFeed(sourceId)` in `feed-store`.",
      "That request reuses a per-source cache when still fresh, otherwise re-fetches through `/api/rss/parse`.",
      "Selecting an article stores it in `selectedArticle` and navigates to `/article/[id]`.",
      "Article page reads the stored item, renders the content, and allows sharing or bookmarking.",
    ],
  },
  {
    title: "5. Bookmark and preference flow",
    steps: [
      "Bookmark actions call `bookmark-store`, which saves or removes entries in user-scoped storage.",
      "Settings page updates theme, font size and feed view through `settings-store`.",
      "Feed list components branch on `feedView` to render magazine, card, article or title-only layouts.",
      "Toast messages surface partial feed failures without blocking the rest of the app.",
    ],
  },
];

const flowcharts = [
  {
    title: "Access and hydration flowchart",
    accent: "green",
    lead: ["User requests route", "Clerk middleware checks route"],
    decision: "Public route?",
    yes: ["Render route directly"],
    no: [
      "Protect route with auth",
      "Mount RootLayout + ClerkProvider",
      "Mount AuthSync in app layout",
      "Set current user id and rehydrate stores",
    ],
    merge: "Route resolves to a public page or a hydrated app shell",
  },
  {
    title: "Today and Explore feed flowchart",
    accent: "blue",
    lead: ["Open home page", "Read `tab` from URL"],
    decision: "Tab is `me` or `explore`?",
    yes: ["Load subscribed sources", "Call `/api/rss/parse` per source"],
    no: ["Call `/api/rss/explore`"],
    merge: "Normalize, sort, cache in `feed-store`, then render the feed list",
  },
  {
    title: "Search and subscription flowchart",
    accent: "purple",
    lead: ["User enters query", "POST `/api/rss/search`"],
    decision: "Looks like a URL?",
    yes: ["Try direct url + common feed paths", "Return feed match + preview items"],
    no: ["Search curated discovery catalog", "Return matching categories"],
    merge: "User adds source to `feed-store`, cache invalidates, shell and feeds refresh",
  },
  {
    title: "Reading and bookmarking flowchart",
    accent: "amber",
    lead: ["Select source or article"],
    decision: "Source selected?",
    yes: ["Use source cache if fresh", "Fetch source via `/api/rss/parse` when stale"],
    no: ["Store article in `selectedArticle`", "Navigate to `/article/[id]`"],
    merge: "Reading screen opens and bookmark actions persist through `bookmark-store`",
  },
];

const architectureLayers = [
  {
    label: "Presentation",
    detail: "Next.js app routes, AppShell, layout primitives, feed views, dialogs, settings screens",
  },
  {
    label: "Interaction",
    detail: "Tabs, sidebar routing, article transitions, bookmarking, source management, search UX",
  },
  {
    label: "State",
    detail: "Zustand stores with persistence, cache timestamps, selected entities and UI preferences",
  },
  {
    label: "Server",
    detail: "RSS search, parse and explore route handlers normalize remote feed data into app models",
  },
  {
    label: "External systems",
    detail: "Clerk auth, localStorage per user, public RSS feeds, proxy fallbacks for blocked feeds",
  },
];

export default function ArchitecturePage() {
  return (
    <main className="architecture-page">
      <style>{`
        :root {
          color-scheme: light dark;
          --arch-bg: #f8fafc;
          --arch-surface: rgba(255, 255, 255, 0.96);
          --arch-surface-muted: rgba(248, 250, 252, 0.92);
          --arch-border: rgba(226, 232, 240, 0.92);
          --arch-border-strong: rgba(203, 213, 225, 0.92);
          --arch-text: #111827;
          --arch-text-muted: #4b5563;
          --arch-text-soft: #6b7280;
          --arch-accent: #059669;
          --arch-accent-soft: rgba(5, 150, 105, 0.1);
          --arch-accent-strong: rgba(5, 150, 105, 0.18);
          --arch-shadow: 0 12px 36px rgba(15, 23, 42, 0.06);
          --arch-line: rgba(148, 163, 184, 0.48);
        }

        .architecture-page {
          min-height: 100vh;
          padding: 32px 20px 80px;
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 1) 100%);
          color: var(--arch-text);
        }

        @media (prefers-color-scheme: dark) {
          :root {
            --arch-bg: #0a0a0a;
            --arch-surface: rgba(23, 23, 23, 0.96);
            --arch-surface-muted: rgba(38, 38, 38, 0.92);
            --arch-border: rgba(38, 38, 38, 0.96);
            --arch-border-strong: rgba(64, 64, 64, 0.96);
            --arch-text: #f5f5f5;
            --arch-text-muted: #d4d4d8;
            --arch-text-soft: #a3a3a3;
            --arch-accent: #34d399;
            --arch-accent-soft: rgba(16, 185, 129, 0.16);
            --arch-accent-strong: rgba(16, 185, 129, 0.24);
            --arch-shadow: 0 16px 40px rgba(0, 0, 0, 0.28);
            --arch-line: rgba(82, 82, 91, 0.7);
          }

          .architecture-page {
            background:
              linear-gradient(180deg, rgba(10, 10, 10, 1) 0%, rgba(17, 17, 17, 1) 100%);
            color: var(--arch-text);
          }
        }

        .shell {
          width: min(1360px, 100%);
          margin: 0 auto;
        }

        .hero,
        .panel,
        .flow-card {
          border: 1px solid var(--arch-border);
          border-radius: 24px;
          background: var(--arch-surface);
          box-shadow: var(--arch-shadow);
        }

        @media (prefers-color-scheme: dark) {
          .hero,
          .panel,
          .flow-card {
            background: var(--arch-surface);
            box-shadow: var(--arch-shadow);
          }
        }

        .hero {
          padding: 28px;
          margin-bottom: 24px;
        }

        .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 6px 10px;
          border-radius: 999px;
          background: var(--arch-accent-soft);
          color: var(--arch-accent);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        @media (prefers-color-scheme: dark) {
          .eyebrow {
            color: var(--arch-accent);
            background: var(--arch-accent-strong);
          }
        }

        .hero h1 {
          margin: 16px 0 12px;
          font-size: clamp(2rem, 4vw, 3.6rem);
          line-height: 1.04;
        }

        .hero p {
          max-width: 70ch;
          margin: 0;
          color: var(--arch-text-muted);
          font-size: 1rem;
          line-height: 1.7;
        }

        @media (prefers-color-scheme: dark) {
          .hero p {
            color: var(--arch-text-soft);
          }
        }

        .meta-grid,
        .layer-grid,
        .panel-grid,
        .store-grid,
        .flow-grid,
        .folder-grid,
        .storage-grid {
          display: grid;
          gap: 18px;
        }

        .meta-grid {
          margin-top: 22px;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }

        .meta-chip,
        .layer-card,
        .structure-card,
        .store-card,
        .flow-card,
        .folder-card,
        .storage-card {
          border: 1px solid var(--arch-border);
          border-radius: 20px;
          background: var(--arch-surface-muted);
        }

        @media (prefers-color-scheme: dark) {
          .meta-chip,
          .layer-card,
          .structure-card,
          .store-card,
          .flow-card,
          .folder-card,
          .storage-card {
            background: var(--arch-surface-muted);
          }
        }

        .meta-chip {
          padding: 16px;
        }

        .meta-chip strong,
        .layer-card h3,
        .structure-card h3,
        .store-card h3,
        .flow-card h3,
        .panel h2 {
          display: block;
          margin: 0 0 8px;
          font-size: 1rem;
        }

        .meta-chip span,
        .layer-card p,
        .store-card p,
        .flow-card p,
        .panel > p {
          color: var(--arch-text-muted);
          line-height: 1.65;
          margin: 0;
        }

        @media (prefers-color-scheme: dark) {
          .meta-chip span,
          .layer-card p,
          .store-card p,
          .flow-card p,
          .panel > p {
            color: var(--arch-text-soft);
          }
        }

        .panel {
          padding: 24px;
          margin-bottom: 24px;
        }

        .layer-grid {
          margin-top: 18px;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
        }

        .layer-card,
        .structure-card,
        .store-card,
        .folder-card,
        .storage-card {
          padding: 18px;
        }

        .layer-index {
          display: inline-block;
          margin-bottom: 10px;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--arch-accent);
        }

        .panel-grid,
        .store-grid,
        .flow-grid,
        .folder-grid,
        .storage-grid {
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          margin-top: 18px;
        }

        .folder-grid,
        .storage-grid {
          grid-template-columns: 1fr;
        }

        .structure-card ul,
        .flow-card ol {
          margin: 0;
          padding-left: 18px;
        }

        .structure-card li,
        .flow-card li {
          margin: 0 0 10px;
          line-height: 1.65;
          color: var(--arch-text-muted);
        }

        @media (prefers-color-scheme: dark) {
          .structure-card li,
          .flow-card li {
            color: var(--arch-text-muted);
          }
        }

        .structure-card li:last-child,
        .flow-card li:last-child {
          margin-bottom: 0;
        }

        .store-card code,
        .structure-card code,
        .flow-card code,
        .legend code {
          padding: 2px 6px;
          border-radius: 999px;
          background: var(--arch-accent-soft);
          font-size: 0.92em;
        }

        .store-label {
          display: inline-block;
          margin-bottom: 10px;
          padding: 5px 10px;
          border-radius: 999px;
          background: var(--arch-accent-soft);
          color: var(--arch-accent);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        @media (prefers-color-scheme: dark) {
          .store-label {
            background: var(--arch-accent-strong);
            color: var(--arch-accent);
          }
        }

        .store-card p + p {
          margin-top: 10px;
        }

        .folder-card h3,
        .storage-card h3 {
          margin: 0 0 8px;
          font-size: 1rem;
        }

        .folder-card p,
        .storage-card p {
          margin: 0;
          color: var(--arch-text-muted);
          line-height: 1.65;
        }

        .folder-card p + p,
        .storage-card p + p {
          margin-top: 10px;
        }

        .tree-block,
        .sample-block {
          margin-top: 14px;
          padding: 16px 18px;
          border-radius: 18px;
          border: 1px solid var(--arch-border);
          background: var(--arch-surface);
          font-family: var(--font-geist-mono), monospace;
          font-size: 13px;
          line-height: 1.7;
          white-space: pre-wrap;
          overflow-x: auto;
          color: var(--arch-text);
        }

        .storage-meta {
          display: grid;
          gap: 10px;
          margin-top: 14px;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        }

        .storage-chip {
          padding: 12px 14px;
          border-radius: 16px;
          border: 1px solid var(--arch-border);
          background: var(--arch-surface);
        }

        .storage-chip strong {
          display: block;
          margin-bottom: 4px;
          font-size: 12px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: var(--arch-accent);
        }

        .storage-chip span {
          color: var(--arch-text-muted);
          line-height: 1.6;
          word-break: break-word;
        }

        .flow-card {
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .flow-card::after {
          content: "";
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(90deg, var(--arch-accent), rgba(5, 150, 105, 0.35));
        }

        .diagram-strip {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 14px;
          margin-top: 18px;
        }

        .diagram-node {
          padding: 16px;
          border-radius: 18px;
          border: 1px dashed var(--arch-border-strong);
          background: var(--arch-surface-muted);
        }

        @media (prefers-color-scheme: dark) {
          .diagram-node {
            background: var(--arch-surface-muted);
          }
        }

        .diagram-node strong {
          display: block;
          margin-bottom: 8px;
        }

        .legend {
          margin-top: 20px;
          padding: 16px 18px;
          border-radius: 18px;
          background: var(--arch-accent-soft);
          color: var(--arch-text-muted);
          line-height: 1.7;
        }

        @media (prefers-color-scheme: dark) {
          .legend {
            background: rgba(5, 150, 105, 0.12);
            color: var(--arch-text-muted);
          }
        }

        .flowchart-grid {
          display: grid;
          gap: 18px;
          grid-template-columns: 1fr;
          margin-top: 18px;
        }

        .flowchart-card {
          border: 1px solid var(--arch-border);
          border-radius: 22px;
          background: var(--arch-surface-muted);
          padding: 24px;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 28px rgba(15, 23, 42, 0.05);
        }

        @media (prefers-color-scheme: dark) {
          .flowchart-card {
            background: var(--arch-surface-muted);
          }
        }

        .flowchart-card::before {
          content: "";
          position: absolute;
          inset: 0 auto auto 0;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, var(--arch-accent), rgba(5, 150, 105, 0.16));
        }

        .flowchart-card h3 {
          margin: 0 0 18px;
          font-size: 1.05rem;
          letter-spacing: -0.01em;
        }

        .flowchart {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .flow-lead {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 16px;
          position: relative;
          padding-bottom: 14px;
        }

        .flow-lead::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -2px;
          width: 1px;
          height: 18px;
          background: var(--arch-line);
          transform: translateX(-50%);
        }

        .flow-lead .flow-node::after {
          display: none;
        }

        .flow-node {
          position: relative;
          padding: 14px 16px;
          border-radius: 18px;
          border: 1px solid var(--arch-border-strong);
          background: var(--arch-surface);
          color: var(--arch-text);
          line-height: 1.5;
          box-shadow: 0 1px 2px rgba(15, 23, 42, 0.03);
        }

        @media (prefers-color-scheme: dark) {
          .flow-node {
            background: var(--arch-surface);
            color: var(--arch-text);
          }
        }

        .flow-node:not(:last-child)::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -19px;
          transform: translateX(-50%);
          width: 1px;
          height: 18px;
          background: var(--arch-line);
        }

        .flow-node.start,
        .flow-node.end {
          font-weight: 700;
        }

        .flow-node.start {
          border-radius: 999px;
          background: color-mix(in srgb, var(--arch-accent) 8%, white);
          border-color: color-mix(in srgb, var(--arch-accent) 24%, var(--arch-border-strong));
        }

        .flow-node.end {
          border-radius: 999px;
          background: color-mix(in srgb, var(--arch-accent) 10%, white);
          border-color: color-mix(in srgb, var(--arch-accent) 26%, var(--arch-border-strong));
        }

        .flow-node.decision {
          clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
          min-height: 108px;
          max-width: 220px;
          margin: 0 auto;
          display: grid;
          place-items: center;
          text-align: center;
          padding: 18px 32px;
          font-weight: 700;
        }

        .flow-node.process {
          border-left-width: 3px;
          box-shadow:
            inset 3px 0 0 0 var(--arch-accent-soft),
            0 1px 2px rgba(15, 23, 42, 0.03);
        }

        .flow-node.merge {
          border-radius: 999px;
          font-weight: 700;
          text-align: center;
          max-width: 680px;
          margin: 0 auto;
        }

        .flow-node.accent-green {
          border-color: rgba(5, 150, 105, 0.28);
        }

        .flow-node.accent-blue {
          border-color: rgba(5, 150, 105, 0.24);
        }

        .flow-node.accent-purple {
          border-color: rgba(5, 150, 105, 0.22);
        }

        .flow-node.accent-amber {
          border-color: rgba(5, 150, 105, 0.2);
        }

        .flow-note {
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px dashed var(--arch-border-strong);
          color: var(--arch-text-muted);
          line-height: 1.7;
        }

        @media (prefers-color-scheme: dark) {
          .flow-note {
            color: var(--arch-text-soft);
          }
        }

        .flow-branch-block {
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .flow-decision-wrap {
          position: relative;
          padding-bottom: 14px;
        }

        .flow-decision-wrap::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: 0;
          width: 1px;
          height: 18px;
          background: var(--arch-line);
          transform: translateX(-50%);
        }

        .flow-branch-grid {
          display: grid;
          grid-template-columns: 1.2fr 1.2fr;
          gap: 18px;
          position: relative;
        }

        .flow-branch-grid::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 25%;
          right: 25%;
          height: 1px;
          background: var(--arch-line);
        }

        .flow-branch {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 16px;
          border-radius: 20px;
          border: 1px solid color-mix(in srgb, var(--arch-border-strong) 70%, white);
          background: color-mix(in srgb, var(--arch-surface) 88%, var(--arch-accent-soft));
          position: relative;
        }

        @media (prefers-color-scheme: dark) {
          .flow-branch {
            background: var(--arch-surface);
          }
        }

        .flow-branch::before {
          content: "";
          position: absolute;
          top: -10px;
          left: 50%;
          width: 1px;
          height: 10px;
          background: var(--arch-line);
          transform: translateX(-50%);
        }

        .flow-branch-label {
          align-self: flex-start;
          padding: 5px 10px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .flow-branch-label.yes {
          background: var(--arch-accent-soft);
          color: var(--arch-accent);
        }

        .flow-branch-label.no {
          background: rgba(115, 115, 115, 0.12);
          color: var(--arch-text-muted);
        }

        @media (prefers-color-scheme: dark) {
          .flow-branch-label.yes {
            color: var(--arch-accent);
          }

          .flow-branch-label.no {
            color: var(--arch-text-soft);
          }
        }

        @media (max-width: 900px) {
          .shell {
            width: min(100%, 100%);
          }

          .flow-lead {
            grid-template-columns: 1fr;
          }

          .flow-lead::after {
            display: none;
          }

          .flowchart-card {
            padding: 18px;
          }

          .flow-branch-grid {
            grid-template-columns: 1fr;
          }
        }

        .architecture-page {
          color-scheme: light;
          --arch-bg: #f8fafc;
          --arch-surface: rgba(255, 255, 255, 0.96);
          --arch-surface-muted: rgba(248, 250, 252, 0.92);
          --arch-border: rgba(226, 232, 240, 0.92);
          --arch-border-strong: rgba(203, 213, 225, 0.92);
          --arch-text: #111827;
          --arch-text-muted: #4b5563;
          --arch-text-soft: #6b7280;
          --arch-accent: #059669;
          --arch-accent-soft: rgba(5, 150, 105, 0.1);
          --arch-accent-strong: rgba(5, 150, 105, 0.18);
          --arch-shadow: 0 12px 36px rgba(15, 23, 42, 0.06);
          --arch-line: rgba(148, 163, 184, 0.48);
          background:
            linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 1) 100%);
          color: var(--arch-text);
        }
      `}</style>

      <div className="shell">
        <section className="hero">
          <div className="eyebrow">Public architecture route</div>
          <h1>RSS Studio architecture map</h1>
          <p>
            This page documents how RSS Studio is organized end to end: public
            and protected routes, application shell, Zustand state, server-side
            RSS parsing, persistence strategy, and the main feature flows that
            drive reading, discovery, subscriptions, and bookmarks.
          </p>

          <div className="meta-grid">
            <div className="meta-chip">
              <strong>Framework</strong>
              <span>Next.js App Router with route groups for auth and app pages.</span>
            </div>
            <div className="meta-chip">
              <strong>State</strong>
              <span>Zustand stores with persisted per-user browser storage.</span>
            </div>
            <div className="meta-chip">
              <strong>Auth</strong>
              <span>Clerk protects the app shell and syncs state hydration after login.</span>
            </div>
            <div className="meta-chip">
              <strong>Data</strong>
              <span>RSS APIs normalize external feeds into a consistent app model.</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>System layers</h2>
          <p>
            The architecture is intentionally thin: UI routes render the shell,
            interactions delegate to stores, stores call internal APIs, and APIs
            fetch and normalize external RSS feeds.
          </p>

          <div className="layer-grid">
            {architectureLayers.map((layer, index) => (
              <article key={layer.label} className="layer-card">
                <span className="layer-index">Layer 0{index + 1}</span>
                <h3>{layer.label}</h3>
                <p>{layer.detail}</p>
              </article>
            ))}
          </div>

          <div className="diagram-strip">
            <div className="diagram-node">
              <strong>Route request</strong>
              <span>`/`, `/search`, `/feeds`, `/bookmarks`, `/settings`, `/architecture`</span>
            </div>
            <div className="diagram-node">
              <strong>Shell and pages</strong>
              <span>Layouts choose public docs, auth screens, or protected app shell.</span>
            </div>
            <div className="diagram-node">
              <strong>State orchestration</strong>
              <span>Stores own cache, selection, folders, bookmarks and preferences.</span>
            </div>
            <div className="diagram-node">
              <strong>Internal APIs</strong>
              <span>`/api/rss/search`, `/api/rss/parse`, `/api/rss/explore`</span>
            </div>
            <div className="diagram-node">
              <strong>External feed network</strong>
              <span>RSS sources plus proxy fallbacks when direct fetches are blocked.</span>
            </div>
          </div>
        </section>

        <section className="panel">
          <h2>Folder structure</h2>
          <p>
            The repository is organized by routing, UI, state, and domain
            responsibilities. These are the main folders that shape the app.
          </p>

          <div className="folder-grid">
            {folderStructureSections.map((section) => (
              <article key={section.title} className="folder-card">
                <h3>{section.title}</h3>
                <p>{section.description}</p>
                <pre className="tree-block">{section.tree}</pre>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>States and storages</h2>
          <p>
            RSS Studio keeps core domain state in Zustand stores and persists
            selected slices into user-scoped localStorage keys. The examples
            below reflect the actual persisted shape produced by Zustand
            `persist`, including the `state` wrapper and `version` field.
          </p>

          <div className="store-grid">
            {stateStores.map((store) => (
              <article key={store.name} className="store-card">
                <span className="store-label">Zustand store</span>
                <h3>{store.name}</h3>
                <p>
                  <strong>Owns:</strong> {store.owns}
                </p>
                <p>
                  <strong>Behavior:</strong> {store.behavior}
                </p>
              </article>
            ))}
          </div>

          <div className="legend">
            Protected app pages mount <code>AuthSync</code>, which sets the
            active Clerk user id, migrates old generic local storage keys to
            user-scoped keys, then rehydrates the persisted stores. This keeps
            feed subscriptions, bookmarks and settings isolated between users on
            the same browser.
          </div>

          <div className="storage-grid">
            {storageExamples.map((example) => (
              <article key={example.title} className="storage-card">
                <h3>{example.title}</h3>
                <p>{example.stores}</p>

                <div className="storage-meta">
                  <div className="storage-chip">
                    <strong>Storage scope</strong>
                    <span>{example.scope}</span>
                  </div>
                  <div className="storage-chip">
                    <strong>Key / bucket</strong>
                    <span>
                      <code>{example.key}</code>
                    </span>
                  </div>
                </div>

                <pre className="sample-block">{example.sample}</pre>
              </article>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>Important logic flows</h2>
          <p>
            These flows summarize the highest-value product paths and the major
            handoffs between routes, stores, APIs and browser persistence.
          </p>

          <div className="flow-grid">
            {featureFlows.map((flow) => (
              <article key={flow.title} className="flow-card">
                <h3>{flow.title}</h3>
                <ol>
                  {flow.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </article>
            ))}
          </div>

          <div className="flow-note">
            The cards above explain each flow in prose. The flowcharts below
            mirror those same handoffs in a more diagrammatic form so routing,
            decision points, state updates and API calls are easier to scan.
          </div>
        </section>

        <section className="panel">
          <h2>Flowchart diagrams</h2>
          <p>
            Each chart shows the major transitions between route entry,
            middleware, state orchestration, internal APIs and persisted data.
          </p>

          <div className="flowchart-grid">
            {flowcharts.map((chart) => (
              <article key={chart.title} className="flowchart-card">
                <h3>{chart.title}</h3>
                <div className="flowchart" aria-label={chart.title}>
                  <div className="flow-lead">
                    {chart.lead.map((node, index) => (
                      <div
                        key={node}
                        className={`flow-node ${index === 0 ? "start" : "process"} accent-${chart.accent}`}
                      >
                        {node}
                      </div>
                    ))}
                  </div>

                  <div className="flow-branch-block">
                    <div className="flow-decision-wrap">
                      <div className={`flow-node decision accent-${chart.accent}`}>
                        {chart.decision}
                      </div>
                    </div>

                    <div className="flow-branch-grid">
                      <div className="flow-branch">
                        <span className="flow-branch-label yes">Yes</span>
                        {chart.yes.map((node, index) => (
                          <div
                            key={`${chart.title}-yes-${node}`}
                            className={`flow-node ${index === chart.yes.length - 1 ? "end" : "process"} accent-${chart.accent}`}
                          >
                            {node}
                          </div>
                        ))}
                      </div>

                      <div className="flow-branch">
                        <span className="flow-branch-label no">No</span>
                        {chart.no.map((node, index) => (
                          <div
                            key={`${chart.title}-no-${node}`}
                            className={`flow-node ${index === chart.no.length - 1 ? "end" : "process"} accent-${chart.accent}`}
                          >
                            {node}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className={`flow-node merge accent-${chart.accent}`}>
                    {chart.merge}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
