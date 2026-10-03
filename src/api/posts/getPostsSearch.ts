import axiosInstance from "@/constants/baseurl";
import { useQuery } from "@tanstack/react-query";
import { PostsResponse } from "@grimity/dto";
import { useShallow } from "zustand/react/shallow";

import { useAuthStore } from "@/states/authStore";

export interface PostSearchRequest {
  searchBy: "combined" | "name";
  size?: number;
  page?: number;
  keyword: string;
  type?: "ALL" | "NORMAL" | "QUESTION" | "FEEDBACK";
}

export async function getPostSearch({
  searchBy,
  size,
  page,
  keyword,
  type,
}: PostSearchRequest): Promise<PostsResponse> {
  try {
    const response = await axiosInstance.get("/posts/search", {
      params: {
        searchBy,
        size,
        page,
        keyword,
        type,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching PostSearch:", error);
    throw new Error("Failed to fetch PostSearch");
  }
}

export function usePostSearch(params: PostSearchRequest | null) {
  const { isAuthReady, isLoggedIn } = useAuthStore(
    useShallow((state) => ({
      isAuthReady: state.isAuthReady,
      isLoggedIn: state.isLoggedIn,
    })),
  );

  return useQuery<PostsResponse>({
    queryKey: params
      ? [
          "PostSearch",
          params.searchBy,
          params.size,
          params.page,
          params.keyword,
          params.type,
          isLoggedIn,
        ]
      : [],
    queryFn: () => (params ? getPostSearch(params) : Promise.reject(undefined)),

    enabled: !!params && isAuthReady,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
