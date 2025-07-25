import axiosInstance from "@/constants/baseurl";
import { useQuery } from "@tanstack/react-query";
import type { PopularUserResponse } from "@grimity/dto";
export type { PopularUserResponse };

export async function getPopular(): Promise<PopularUserResponse[]> {
  try {
    const response = await axiosInstance.get("/users/popular");

    return response.data;
  } catch (error) {
    console.error("Error fetching Popular:", error);
    throw new Error("Failed to fetch Popular");
  }
}

export function usePopular() {
  return useQuery<PopularUserResponse[]>({
    queryKey: ["popular"],
    queryFn: getPopular,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}
