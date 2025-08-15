import { useQuery } from "@tanstack/react-query";
import { AxiosResponse } from "axios";

import axiosInstance from "@/constants/baseurl";

import type { ChatsResponse, GetChatsRequest } from "@grimity/dto";

export const getChats = async (request: GetChatsRequest) => {
  const response = await axiosInstance.get<GetChatsRequest, AxiosResponse<ChatsResponse>>(
    "/chats",
    {
      params: request,
    },
  );

  return response.data;
};

export const useGetChats = (request: GetChatsRequest) => {
  return useQuery({
    queryKey: ["chats", request],
    queryFn: () => getChats(request),
  });
};
