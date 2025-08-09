import { useQuery } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import type { ChatsResponse, GetChatsRequest } from "@grimity/dto";

export const getChats = async (request: GetChatsRequest) => {
  return await axiosInstance.get<GetChatsRequest, ChatsResponse>("/chats", {
    params: request,
  });
};

export const useGetChats = (request: GetChatsRequest) => {
  return useQuery({
    queryKey: ["chats", request],
    queryFn: () => getChats(request),
  });
};
