import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";

/* 댓글 api */
export interface FeedsCommentsRequest {
  feedId: string;
  enabled?: boolean;
}

export interface FeedsCommentsResponse {
  commentCount: number;
  comments: {
    id: string;
    content: string;
    createdAt: string;
    likeCount: number;
    isLike: boolean;
    childCommentCount: number;
    writer: {
      id: string;
      url: string;
      name: string;
      image: string;
    };
  }[];
}

export async function getFeedsComments({
  feedId,
}: FeedsCommentsRequest): Promise<FeedsCommentsResponse> {
  try {
    const response = await axiosInstance.get<FeedsCommentsResponse>("/feed-comments", {
      params: { feedId },
    });

    const data = response.data;
    return {
      ...data,
      comments: data.comments.map((comment) => ({
        ...comment,
        writer: {
          ...comment.writer,
          image: `https://image.grimity.com/${comment.writer.image}`,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw new Error("Failed to fetch comments");
  }
}

export function useGetFeedsComments({ feedId, enabled = true }: FeedsCommentsRequest) {
  return useQuery<FeedsCommentsResponse>(
    ["getFeedsComments", feedId],
    () => getFeedsComments({ feedId }),
    {
      enabled: enabled,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}

/* 답글 api */
export interface FeedsChildCommentsRequest {
  feedId: string;
  parentId: string;
}

export interface FeedsChildComment {
  id: string;
  content: string;
  createdAt: string;
  likeCount: number;
  isLike: boolean;
  writer: {
    url: any;
    id: string;
    name: string;
    image: string;
  };
  mentionedUser?: {
    id: string;
    name: string;
  };
}

export async function getFeedsChildComments({
  feedId,
  parentId,
}: FeedsChildCommentsRequest): Promise<FeedsChildComment[]> {
  try {
    const response = await axiosInstance.get<FeedsChildComment[]>("/feed-comments/child-comments", {
      params: { feedId, parentId },
    });

    const data = response.data;
    return data.map((comment) => ({
      ...comment,
      writer: {
        ...comment.writer,
        image: `https://image.grimity.com/${comment.writer.image}`,
      },
    }));
  } catch (error) {
    console.error("Error fetching child comments:", error);
    throw new Error("Failed to fetch child comments");
  }
}

export function useGetFeedsChildComments({ feedId, parentId }: FeedsChildCommentsRequest) {
  return useQuery<FeedsChildComment[]>(
    ["getFeedsChildComments", feedId, parentId],
    () => getFeedsChildComments({ feedId, parentId }),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
