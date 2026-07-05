import axiosInstance from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { PostsResponse, PostResponse } from "@grimity/dto";
export type { PostResponse };

export interface PostsLatestRequest {
  size: number;
  page: number;
  type: "ALL" | "NORMAL" | "QUESTION" | "FEEDBACK";
}

export async function getPostsLatest({
  size = 10,
  page = 1,
  type = "ALL",
}: PostsLatestRequest): Promise<PostsResponse> {
  try {
    const response = await axiosInstance.get("/posts", {
      params: { size, page, type },
    });

    return response.data;
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
  return useQuery<PostsResponse>({
    queryKey: ["postsLatest", params],
    queryFn: () => getPostsLatest(params),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

export async function getPostsNotices(): Promise<PostResponse[]> {
  try {
    const response = await axiosInstance.get("/posts/notices");

    return response.data;
  } catch (error) {
    console.error("Error fetching postsNotices:", error);
    throw new Error("Failed to fetch postsNotices");
  }
}

export const usePostsNotices = () => {
  return useQuery<PostResponse[]>({
    queryKey: ["postsNotices"],
    queryFn: () => getPostsNotices(),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};
