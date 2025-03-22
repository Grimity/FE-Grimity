import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

export interface FeedSearchRequest {
  sort?: "latest" | "popular" | "accuracy";
  size?: number;
  cursor?: string;
  keyword: string;
}

export interface FeedSearch {
  id: string;
  title: string;
  thumbnail: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLike: boolean;
  tags: string[];
  author: {
    id: string;
    name: string;
    url: string;
  };
}

export interface FeedSearchResponse {
  totalCount: number;
  nextCursor: string | null;
  feeds: FeedSearch[];
}

export async function getFeedSearch({
  sort,
  size,
  cursor,
  keyword,
}: FeedSearchRequest): Promise<FeedSearchResponse> {
  try {
    const response = await axiosInstance.get("/feeds/search", {
      params: {
        sort,
        size,
        cursor,
        keyword,
      },
    });

    const updatedData: FeedSearchResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: FeedSearch) => ({
        ...feed,
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching FeedSearch:", error);
    throw new Error("Failed to fetch FeedSearch");
  }
}

export function useFeedSearch(params: FeedSearchRequest) {
  return useInfiniteQuery(
    ["FeedSearch", params.keyword, params.sort],
    ({ pageParam = undefined }) => getFeedSearch({ ...params, cursor: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ? lastPage.nextCursor : undefined;
      },
      enabled: !!params.keyword,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
