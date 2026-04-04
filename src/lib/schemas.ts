import { z } from "zod";

export const feedSourceSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string().url(),
  siteUrl: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  folderId: z.string(),
  addedAt: z.string(),
});

export const folderSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Folder name is required").max(50, "Folder name is too long"),
  createdAt: z.string(),
});

export const feedItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  link: z.string(),
  description: z.string(),
  content: z.string(),
  imageUrl: z.string().optional(),
  author: z.string(),
  pubDate: z.string(),
  sourceName: z.string(),
  sourceUrl: z.string(),
  sourceId: z.string(),
});

export const bookmarkSchema = z.object({
  id: z.string(),
  item: feedItemSchema,
  bookmarkedAt: z.string(),
});

export const addFeedInputSchema = z.object({
  url: z.string().url("Please enter a valid URL"),
  folderId: z.string().min(1, "Please select a folder"),
});

export const addFolderInputSchema = z.object({
  name: z
    .string()
    .min(1, "Folder name is required")
    .max(50, "Folder name is too long"),
});
