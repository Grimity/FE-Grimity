import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface PostSearchRequest {
  searchBy: "combined" | "name";
  size?: number;
  page?: number;
  keyword: string;
}

export interface PostSearch {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK";
  title: string;
  createdAt: string;
  content: string;
  thumbnail: string | null;
  viewCount: number;
  commentCount: number;
  author: {
    id: string;
    name: string;
    url: string;
  };
}

export interface PostSearchResponse {
  totalCount: number;
  posts: PostSearch[];
}

export async function getPostSearch({
  searchBy,
  size,
  page,
  keyword,
}: PostSearchRequest): Promise<PostSearchResponse> {
  try {
    const response = await axiosInstance.get("/posts/search", {
      params: {
        searchBy,
        size,
        page,
        keyword,
      },
    });

    const updatedData: PostSearchResponse = {
      ...response.data,
      posts: response.data.posts.map((post: PostSearch) => ({
        ...post,
        thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching PostSearch:", error);
    throw new Error("Failed to fetch PostSearch");
  }
}

export function usePostSearch(params: PostSearchRequest | null) {
  return useQuery<PostSearchResponse>(
    params ? ["PostSearch", params.searchBy, params.size, params.page, params.keyword] : [],
    () => (params ? getPostSearch(params) : Promise.reject(undefined)),
    {
      enabled: !!params,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
