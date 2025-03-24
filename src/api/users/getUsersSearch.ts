import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

export interface UserSearchRequest {
  sort?: "popular" | "accuracy";
  size?: number;
  cursor?: string;
  keyword: string;
}

export interface UserSearch {
  url: string;
  id: string;
  name: string;
  image: string;
  description: string;
  backgroundImage: string;
  isFollowing: boolean;
  followerCount: number;
}

export interface UserSearchResponse {
  totalCount: number;
  nextCursor: string | null;
  users: UserSearch[];
}

export async function getUserSearch({
  sort,
  size,
  cursor,
  keyword,
}: UserSearchRequest): Promise<UserSearchResponse> {
  try {
    const response = await axiosInstance.get("/users/search", {
      params: {
        sort,
        size,
        cursor,
        keyword,
      },
    });

    const updatedData: UserSearchResponse = {
      ...response.data,
      users: response.data.users.map((user: UserSearch) => ({
        ...user,
        image: `https://image.grimity.com/${user.image}`,
        backgroundImage: `https://image.grimity.com/${user.backgroundImage}`,
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching UserSearch:", error);
    throw new Error("Failed to fetch UserSearch");
  }
}

export function useUserSearch(params: UserSearchRequest) {
  return useInfiniteQuery(
    ["UserSearch", params.keyword, params.sort],
    ({ pageParam = undefined }) => getUserSearch({ ...params, cursor: pageParam }),
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
