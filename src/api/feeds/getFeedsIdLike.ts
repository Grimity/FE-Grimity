import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";
import { FeedLikedUserResponse } from "@grimity/dto";

export interface FeedsLikeRequest {
  id: string;
}

export async function getFeedsLike({ id }: FeedsLikeRequest): Promise<FeedLikedUserResponse[]> {
  try {
    const response = await axiosInstance.get(`/feeds/${id}/like`);

    return response.data;
  } catch (error) {
    console.error("Error fetching FeedsLike:", error);
    throw new Error("Failed to fetch FeedsLike");
  }
}

export function useFeedsLike({ id }: FeedsLikeRequest) {
  return useQuery<FeedLikedUserResponse[]>(["FeedsLike", id], () => getFeedsLike({ id }), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
