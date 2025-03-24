import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

export interface MySaveListRequest {
  size?: number;
  cursor?: string;
}

export interface MySaveListFeed {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  likeCount: number;
  viewCount: number;
  commentCount: number;
  createdAt: string;
  author: {
    id: string;
    name: string;
    url: string;
  };
}

export interface MySaveListResponse {
  nextCursor: string | null;
  feeds: MySaveListFeed[];
}

export async function getMySaveList({
  size,
  cursor,
}: MySaveListRequest): Promise<MySaveListResponse> {
  try {
    const response = await axiosInstance.get("/users/me/save-feeds", { params: { size, cursor } });

    const updatedData: MySaveListResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: MySaveListFeed) => ({
        ...feed,
        cards: feed.cards.map((card) => `https://image.grimity.com/${card}`),
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching MySaveList:", error);
    throw new Error("Failed to fetch MySaveList");
  }
}

export function useMySaveList({ size }: MySaveListRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MySaveListResponse>(
    "MySaveList",
    ({ pageParam = null }) => getMySaveList({ cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor || null,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
