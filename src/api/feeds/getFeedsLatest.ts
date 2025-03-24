import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

export interface FeedsLatestRequest {
  size?: number;
  cursor?: string;
}

export interface FeedsLatest {
  id: string;
  title: string;
  thumbnail: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  isLike: boolean;
  author: {
    id: string;
    name: string;
    url: string;
  };
}

export interface FeedsLatestResponse {
  feeds: FeedsLatest[];
  nextCursor: string | null;
}

export async function getFeedsLatest({
  size,
  cursor,
}: FeedsLatestRequest): Promise<FeedsLatestResponse> {
  try {
    const response = await axiosInstance.get("/feeds/latest", {
      params: { size, cursor },
    });

    const updatedData: FeedsLatestResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: FeedsLatest) => ({
        ...feed,
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching FeedsLatest:", error);
    throw new Error("Failed to fetch FeedsLatest");
  }
}

export function useFeedsLatest({ size }: FeedsLatestRequest) {
  return useInfiniteQuery<FeedsLatestResponse>(
    "feedsLatest",
    ({ pageParam = undefined }) => getFeedsLatest({ size, cursor: pageParam }),
    {
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ? lastPage.nextCursor : undefined;
      },
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
