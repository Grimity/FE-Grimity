import axiosInstance from "@/constants/baseurl";
import { useInfiniteQuery } from "react-query";

/* 팔로워 목록 */
export interface MyFollowerRequest {
  size?: number;
  cursor?: string;
}

export interface Follows {
  id: string;
  url: string;
  name: string;
  image: string;
  description: string;
}

export interface MyFollowerResponse {
  nextCursor: string | null;
  followers: Follows[];
}

export async function getMyFollower({
  size,
  cursor,
}: MyFollowerRequest): Promise<MyFollowerResponse> {
  try {
    const response = await axiosInstance.get("/users/me/followers", {
      params: { size, cursor },
    });

    const updatedData = {
      ...response.data,
      followers: response.data.followers.map((follower: Follows) => ({
        ...follower,
        image: `https://image.grimity.com/${follower.image}`,
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching MyFollowers:", error);
    throw new Error("Failed to fetch MyFollowers");
  }
}

export function useMyFollower({ size }: MyFollowerRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyFollowerResponse>(
    "myFollowers",
    ({ pageParam = undefined }) => getMyFollower({ size, cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
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

/* 팔로잉 목록 */
export interface MyFollowingResponse {
  nextCursor: string | null;
  followings: Follows[];
}

export async function getMyFollowing({
  size,
  cursor,
}: MyFollowerRequest): Promise<MyFollowingResponse> {
  try {
    const response = await axiosInstance.get("/users/me/followings", {
      params: { size, cursor },
    });

    const updatedData = {
      ...response.data,
      followings: response.data.followings.map((following: Follows) => ({
        ...following,
        image: `https://image.grimity.com/${following.image}`,
      })),
    };

    return updatedData;
  } catch (error) {
    console.error("Error fetching MyFollowings:", error);
    throw new Error("Failed to fetch MyFollowings");
  }
}

export function useMyFollowing({ size }: MyFollowerRequest) {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useInfiniteQuery<MyFollowingResponse>(
    "myFollowings",
    ({ pageParam = undefined }) => getMyFollowing({ size, cursor: pageParam }),
    {
      enabled: Boolean(accessToken),
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
