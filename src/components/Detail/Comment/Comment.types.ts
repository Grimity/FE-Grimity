import { FeedsCommentsResponse } from "@/api/feeds-comments/getFeedComments";

export interface CommentProps {
  feedId: string;
  feedWriterId: string;
  commentsData?: FeedsCommentsResponse;
  isFollowingPage?: boolean;
  isExpanded?: boolean;
}

export interface CommentWriter {
  id: string;
  url: string;
  name: string;
  image: string;
}

export interface Comment {
  id: string;
  content: string;
  writer: CommentWriter;
  parentId: string | null;
  childComments?: Comment[];
}
