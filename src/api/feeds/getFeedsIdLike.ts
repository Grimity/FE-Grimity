import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface FeedsLikeRequest {
  id: string;
}

export interface FeedsLikeResponse {
  id: string;
  url: string;
  name: string;
  image: string;
  description: string;
}

export async function getFeedsLike({ id }: FeedsLikeRequest): Promise<FeedsLikeResponse[]> {
  try {
    const response = await axiosInstance.get(`/feeds/${id}/like`);
    const data = response.data;

    const updatedData = data.map((item: FeedsLikeResponse) => ({
      ...item,
      image: `https://image.grimity.com/${item.image}`,
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching FeedsLike:", error);
    throw new Error("Failed to fetch FeedsLike");
  }
}

export function useFeedsLike({ id }: FeedsLikeRequest) {
  return useQuery<FeedsLikeResponse[]>(["FeedsLike", id], () => getFeedsLike({ id }), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
