import { useQuery } from "react-query";
import { useRecoilValue } from "recoil";
import { authState } from "@/states/authState";
import axiosInstance from "@/constants/baseurl";

export interface MyInfoResponse {
  id: string;
  provider: "GOOGLE" | "KAKAO";
  email: string;
  name: string;
  image: string;
  backgroundImage: string;
  description: string;
  links: { linkName: string; link: string }[];
  createdAt: string;
  hasNotification: boolean;
  url: string;
}

export async function getMyInfo(): Promise<MyInfoResponse> {
  try {
    const response = await axiosInstance.get("/users/me");

    const updatedData = response.data;
    updatedData.image = `https://image.grimity.com/${updatedData.image}`;
    updatedData.backgroundImage = `https://image.grimity.com/${updatedData.backgroundImage}`;

    return updatedData;
  } catch (error) {
    console.error("Error fetching Profile:", error);
    throw new Error("Failed to fetch Profile");
  }
}

export function useMyData() {
  const { isLoggedIn } = useRecoilValue(authState);
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<MyInfoResponse>("myInfo", getMyInfo, {
    enabled: isLoggedIn && Boolean(accessToken),
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });
}
