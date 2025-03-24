import { useQuery } from "react-query";
import { NotificationResponse } from "@grimity/dto";
import axiosInstance from "@/constants/baseurl";

export async function getNotifications(): Promise<NotificationResponse[]> {
  const response = await axiosInstance.get("/notifications");
  return response.data as NotificationResponse[];
}

export function useGetNotifications() {
  const accessToken = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  return useQuery<NotificationResponse[]>("getNotifications", getNotifications, {
    enabled: Boolean(accessToken),
  });
}
