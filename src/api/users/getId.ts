import axiosInstance from "@/constants/baseurl";
import axios from "axios";
import { useQuery } from "react-query";

export interface UserInfoRequest {
  id: string;
}

export interface UserInfoRequestByURL {
  url: string;
}

export interface UserInfoResponse {
  id: string;
  url: string;
  name: string;
  image: string;
  backgroundImage: string;
  description: string;
  links: { linkName: string; link: string }[];
  followerCount: number;
  followingCount: number;
  feedCount: number;
  postCount: number;
  isFollowing: boolean;
}

export interface MetaUserInfoResponse {
  id: string;
  name: string;
  image: string;
  url: string;
  description: string;
}

export async function getUserInfo({ id }: UserInfoRequest): Promise<UserInfoResponse> {
  try {
    const response = await axiosInstance.get(`/users/${id}`);

    const updatedData = response.data;
    updatedData.image = `https://image.grimity.com/${updatedData.image}`;
    updatedData.backgroundImage = `https://image.grimity.com/${updatedData.backgroundImage}`;

    return updatedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_USER");
      }
    }
    console.error("Error fetching User Profile:", error);
    throw new Error("Failed to fetch User Profile");
  }
}

export async function getUserInfoByUrl({ url }: UserInfoRequestByURL): Promise<UserInfoResponse> {
  try {
    const response = await axiosInstance.get(`/users/profile/${url}`);

    const updatedData = response.data;
    updatedData.image = `https://image.grimity.com/${updatedData.image}`;
    updatedData.backgroundImage = `https://image.grimity.com/${updatedData.backgroundImage}`;

    return updatedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_USER");
      }
    }
    console.error("Error fetching User Profile:", error);
    throw new Error("Failed to fetch User Profile");
  }
}

export async function getSSRUserInfoByUrl(url: string): Promise<MetaUserInfoResponse> {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

    const response = await axios.get(`https://api.grimity.com/users/profile/${url}/meta`, {
      params: { url },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    const updatedData = response.data;
    updatedData.image = `https://image.grimity.com/${updatedData.image}`;

    return updatedData;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error("DELETED_USER");
      }
    }
    console.error("Error fetching User Profile:", error);
    throw new Error("Failed to fetch User Profile");
  }
}

export const useUserData = (userId: string | null) => {
  return useQuery(["userData", userId], () => getUserInfo({ id: userId! }), {
    enabled: Boolean(userId),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
export const useUserDataByUrl = (url: string | null) => {
  return useQuery(["userData", url], () => getUserInfoByUrl({ url: url! }), {
    enabled: Boolean(url),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });
};
