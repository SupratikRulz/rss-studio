import type { ElementType } from "react";
import {
  BookOpen,
  AlignJustify,
  LayoutGrid,
  Monitor,
  Moon,
  Newspaper,
  Sun,
} from "lucide-react";
import type {
  FeedView,
  Theme,
} from "@/stores/settings-store";

export const THEME_OPTIONS: { id: Theme; label: string; icon: ElementType }[] =
  [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

export const VIEW_OPTIONS: {
  id: FeedView;
  label: string;
  icon: ElementType;
  description: string;
}[] = [
  {
    id: "magazine",
    label: "Magazine",
    icon: Newspaper,
    description: "List with thumbnails",
  },
  {
    id: "cards",
    label: "Cards",
    icon: LayoutGrid,
    description: "Grid of image cards",
  },
  {
    id: "article",
    label: "Article",
    icon: BookOpen,
    description: "Full content preview",
  },
  {
    id: "titleOnly",
    label: "Title Only",
    icon: AlignJustify,
    description: "Compact text list",
  },
];
