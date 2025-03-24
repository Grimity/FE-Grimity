import axiosInstance from "@/constants/baseurl";
import { authState } from "@/states/authState";
import { useInfiniteQuery, useQuery } from "react-query";
import { useRecoilValue } from "recoil";

export interface FollowingFeedsRequest {
  size?: number;
  cursor?: string;
}

export interface FollowingFeeds {
  id: string;
  title: string;
  cards: string[];
  thumbnail: string;
  content: string;
  createdAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isAI: boolean;
  author: {
    id: string;
    name: string;
    image: string;
    url: string;
  };
  isLike: boolean;
  isSave: boolean;
  tags: string[];
}

export interface FollowingFeedsResponse {
  nextCursor: string | null;
  feeds: FollowingFeeds[];
}

export async function getFollowingFeeds({
  size,
  cursor,
}: FollowingFeedsRequest): Promise<FollowingFeedsResponse> {
  try {
    const response = await axiosInstance.get("/feeds/following", { params: { size, cursor } });

    const updatedData: FollowingFeedsResponse = {
      ...response.data,
      feeds: response.data.feeds.map((feed: FollowingFeeds) => ({
        ...feed,
        cards: feed.cards.map((card) => `https://image.grimity.com/${card}`),
        thumbnail: `https://image.grimity.com/${feed.thumbnail}`,
        author: {
          ...feed.author,
          image: `https://image.grimity.com/${feed.author.image}`,
        },
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching FollowingFeeds:", error);
    throw new Error("Failed to fetch FollowingFeeds");
  }
}

export function useFollowingNew(params: FollowingFeedsRequest) {
  return useQuery<FollowingFeedsResponse>(
    ["FollowingFeedsNew", params.cursor, params.size],
    () => getFollowingFeeds(params),
    {
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}

export function useFollowingFeeds(params: FollowingFeedsRequest | null) {
  const { isLoggedIn } = useRecoilValue(authState);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<FollowingFeedsResponse>(
    ["FollowingFeeds", params?.size],
    ({ pageParam = undefined }) => getFollowingFeeds({ ...params, cursor: pageParam }),
    {
      enabled: !!params && isLoggedIn && Boolean(accessToken),
      getNextPageParam: (lastPage) => lastPage.nextCursor || undefined,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      cacheTime: 10 * 60 * 1000,
    },
  );
}
