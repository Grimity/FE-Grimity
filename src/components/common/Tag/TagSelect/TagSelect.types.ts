import type { HTMLAttributes } from "react";

export type TagSelectSize = "md" | "xs";

export interface TagSelectProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  tags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (index: number) => void;
  placeholder?: string;
  maxTags?: number;
  size?: TagSelectSize;
  className?: string;
}
