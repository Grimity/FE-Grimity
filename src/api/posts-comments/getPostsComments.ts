import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface PostsCommentsRequest {
  postId: string;
}

export interface PostsCommentWriter {
  url: string;
  id: string;
  name: string;
}

export interface PostsChildComment {
  isDeleted: any;
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  writer?: PostsCommentWriter;
  mentionedUser?: {
    id: string;
    name: string;
    url: string;
  };
  isLike: boolean;
}

export interface PostsComment {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isDeleted: boolean;
  isLike: boolean;
  writer?: PostsCommentWriter;
  childComments: PostsChildComment[];
}

export interface PostsCommentsResponse {
  commentCount: number;
  comments: PostsComment[];
}

export async function getPostsComments({
  postId,
}: PostsCommentsRequest): Promise<PostsCommentsResponse> {
  try {
    const response = await axiosInstance.get<PostsComment[]>("/post-comments", {
      params: { postId },
    });

    return {
      commentCount: response.data.length,
      comments: response.data,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export function useGetPostsComments({ postId }: PostsCommentsRequest) {
  return useQuery<PostsCommentsResponse>(
    ["getPostsComments", postId],
    () => getPostsComments({ postId }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
