import axiosInstance from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "react-query";

export interface PostsLatestRequest {
  size: number;
  page: number;
  type: "ALL" | "QUESTION" | "FEEDBACK";
}

export interface PostsLatest {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK";
  title: string;
  content: string;
  thumbnail: string | null;
  commentCount: number;
  viewCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    url: string;
  };
}

export interface PostsLatestResponse {
  posts: PostsLatest[];
  totalCount: number;
}

export async function getPostsLatest({
  size = 10,
  page = 1,
  type = "ALL",
}: PostsLatestRequest): Promise<PostsLatestResponse> {
  try {
    const response = await axiosInstance.get("/posts", {
      params: { size, page, type },
    });

    const updatedData: PostsLatestResponse = {
      ...response.data,
      posts: response.data.posts.map((post: PostsLatest) => ({
        ...post,
        thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
      })),
    };

    return updatedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_POST");
      }
    }
    console.error("Error fetching postsLatest:", error);
    throw new Error("Failed to fetch postsLatest");
  }
}

export const usePostsLatest = (params: PostsLatestRequest) => {
  return useQuery<PostsLatestResponse>(["postsLatest", params], () => getPostsLatest(params), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};

export async function getPostsNotices(): Promise<PostsLatest[]> {
  try {
    const response = await axiosInstance.get("/posts/notices");

    const updatedPosts: PostsLatest[] = response.data.map((post: PostsLatest) => ({
      ...post,
      thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
    }));

    return updatedPosts;
  } catch (error) {
    console.error("Error fetching postsNotices:", error);
    throw new Error("Failed to fetch postsNotices");
  }
}

export const usePostsNotices = () => {
  return useQuery<PostsLatest[]>(["postsNotices"], () => getPostsNotices(), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
