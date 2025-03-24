import axiosInstance from "@/constants/baseurl";
import { useQuery } from "react-query";

export interface MySavePostRequest {
  size?: number;
  page?: number;
}

export interface MySavePost {
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

export interface MySavePostResponse {
  totalCount: number | null;
  posts: MySavePost[];
}

export async function getMySavePost({
  size,
  page,
}: MySavePostRequest): Promise<MySavePostResponse> {
  try {
    const response = await axiosInstance.get("/users/me/save-posts", { params: { size, page } });

    const updatedData: MySavePostResponse = {
      ...response.data,
      posts: response.data.posts.map((post: MySavePost) => ({
        ...post,
        thumbnail: post.thumbnail ? `https://image.grimity.com/${post.thumbnail}` : null,
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching MySavePost:", error);
    throw new Error("Failed to fetch MySavePost");
  }
}

export function useMySavePost({ size, page }: MySavePostRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MySavePostResponse>(
    ["MySavePost", size, page],
    () => getMySavePost({ size, page }),
    {
      enabled: Boolean(accessToken),
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
