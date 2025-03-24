import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface TodayFeedPopularResponse {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  isLike?: boolean;
  author: {
    id: string;
    name: string;
    url: string;
  };
}

export async function getTodayFeedPopular(): Promise<TodayFeedPopularResponse[]> {
  try {
    const response = await axiosInstance.get("/feeds/today-popular");

    const updatedData: TodayFeedPopularResponse[] = response.data.map(
      (item: TodayFeedPopularResponse) => ({
        ...item,
        thumbnail: `https://image.grimity.com/${item.thumbnail}`,
      }),
    );

    return updatedData;
  } catch (error) {
    console.error("Error fetching TodayFeedPopular:", error);
    throw new Error("Failed to fetch TodayFeedPopular");
  }
}

export function useTodayFeedPopular() {
  return useQuery<TodayFeedPopularResponse[]>(["TodayFeedPopular"], getTodayFeedPopular, {
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
