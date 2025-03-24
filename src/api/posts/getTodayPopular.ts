import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface TodayPopularPostsResponse {
  id: string;
  type: "NORMAL" | "QUESTION" | "FEEDBACK" | "NOTICE";
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

export async function getTodayPopularPosts(): Promise<TodayPopularPostsResponse[]> {
  try {
    const response = await axiosInstance.get("/posts/today-popular");

    const updatedPosts: TodayPopularPostsResponse[] = response.data.map(
      (post: TodayPopularPostsResponse) => ({
        ...post,
        thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
      }),
    );

    return updatedPosts;
  } catch (error) {
    console.error("Error fetching TodayPopularPosts:", error);
    throw new Error("Failed to fetch TodayPopularPosts");
  }
}

export function useTodayPopularPosts() {
  return useQuery<TodayPopularPostsResponse[]>(
    ["TodayPopularPosts"],
    () => getTodayPopularPosts(),
    { refetchOnWindowFocus: false, staleTime: 5 * 60 * 1000, cacheTime: 10 * 60 * 1000 },
  );
}
