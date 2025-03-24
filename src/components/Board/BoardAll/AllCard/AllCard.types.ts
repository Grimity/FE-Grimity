export interface AllCardProps {
  post: {
    id: string;
    type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
    title: string;
    content: string;
    thumbnail: string | null;
    commentCount: number;
    viewCount: number;
    createdAt: string;
    author?: { name: string; id: string; url: string };
  };
  case: "saved-posts" | "my-posts" | "board";
  hasChip?: boolean;
}
