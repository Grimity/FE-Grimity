import { PostsCommentsResponse } from "@/api/posts-comments/getPostsComments";

export interface PostCommentProps {
  postId: string;
  postWriterId: string;
  commentCount?: number;
  commentsData?: PostsCommentsResponse;
}

export interface PostCommentWriter {
  id: string;
  name: string;
  url: string;
}

export interface PostComment {
  id: string;
  content: string;
  writer?: PostCommentWriter;
  parentId: string | null;
  childComments?: PostComment[];
}
