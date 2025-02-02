import BASE_URL from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface PopularResponse {
  id: string;
  name: string;
  image: string;
  followerCount: number;
  isFollowing: boolean;
  thumbnails: string[];
}

export async function getPopular(): Promise<PopularResponse[]> {
  try {
    const response = await BASE_URL.get("/users/popular");

    const updatedData = response.data.map((data: PopularResponse) => ({
      ...data,
      image: `https://image.grimity.com/${data.image}`,
      thumbnails: data.thumbnails.map(
        (thumbnail: string) => `https://image.grimity.com/${thumbnail}`
      ),
    }));

    return updatedData;
  } catch (error) {
    console.error("Error fetching Popular:", error);
    throw new Error("Failed to fetch Popular");
  }
}

export function usePopular() {
  return useQuery<PopularResponse[]>("popular", getPopular);
}
