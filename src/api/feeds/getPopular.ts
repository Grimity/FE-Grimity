import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

export interface PopularFeed {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  likeCount: number;
  viewCount: number;
  isLike?: boolean;
  author: {
    id: string;
    name: string;
    image: string;
    url: string;
  };
}

export interface PopularFeedResponse {
  feeds: PopularFeed[];
  nextCursor: string | null;
}

export async function getPopularFeed({ pageParam = null }): Promise<PopularFeedResponse> {
  try {
    const response = await axiosInstance.get("/feeds/popular", {
      params: {
        cursor: pageParam,
        size: 30,
      },
    });

    return {
      ...response.data,
      feeds: response.data.feeds.map((feed: PopularFeed) => ({
        ...feed,
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
          image: `https://image.grimity.com/${feed.author.image}`,
        },
      })),
    };
  } catch (error) {
    console.error("Error fetching Popular:", error);
    throw new Error("Failed to fetch Popular");
  }
}

export function usePopularFeed() {
  return useInfiniteQuery<PopularFeedResponse>("PopularFeed", getPopularFeed, {
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ? lastPage.nextCursor : undefined;
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
}
