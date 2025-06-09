export type SortOption = "combined" | "name";

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "combined", label: "제목+내용" },
  { value: "name", label: "글쓴이" },
];

export const POSTS_PER_PAGE = {
  DETAIL: 5,
  NORMAL: 10,
} as const;

export const TAB_TYPES = {
  ALL: "all",
  QUESTION: "question",
  FEEDBACK: "feedback",
} as const;

export type TabType = keyof typeof TAB_TYPES;
