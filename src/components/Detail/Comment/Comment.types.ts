import { FeedsCommentsResponse } from "@/api/feeds-comments/getFeedComments";

export interface CommentProps {
  feedId: string;
  feedWriterId: string;
  commentCount?: number;
  commentsData?: FeedsCommentsResponse;
}

export interface CommentWriter {
  id: string;
  url: string;
  name: string;
  image: string | null;
}

export interface Comment {
  id: string;
  content: string;
  writer?: CommentWriter;
  parentId: string | null;
  childComments?: Comment[];
}
