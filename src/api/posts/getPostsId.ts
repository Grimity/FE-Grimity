import axiosInstance from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "react-query";

export interface PostsDetailsResponse {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
  title: string;
  content: string;
  thumbnail: string | null;
  commentCount: number;
  viewCount: number;
  likeCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    url: string;
  };
  isLike: boolean;
  isSave: boolean;
}

export interface MetaPostsDetailsResponse {
  id: string;
  title: string;
  content: string;
  thumbnail: string | null;
  createdAt: string;
}

export async function getPostsDetails(id: string): Promise<PostsDetailsResponse> {
  try {
    const response = await axiosInstance.get(`/posts/${id}`, {
      params: { id },
    });

    const post = response.data;

    const updatedData = {
      ...post,
      thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching Postsdetails:", error);
    throw new Error("Failed to fetch Postsdetails");
  }
}

export async function getSSRPostsDetails(id: string): Promise<MetaPostsDetailsResponse> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const response = await axios.get(`https://api.grimity.com/posts/${id}/meta`, {
      params: { id },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const post = response.data;

    const updatedData = {
      ...post,
      thumbnail: post.thumbnail ? `${post.thumbnail}` : null,
    };

    return updatedData;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      throw new Error("DELETED_POST");
    }
    console.error("Error fetching Postsdetails:", error);
    throw new Error("Failed to fetch Postsdetails");
  }
}

export function usePostsDetails(id: string) {
  return useQuery<PostsDetailsResponse>(["Postsdetails", id], () => getPostsDetails(id), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
