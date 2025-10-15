import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
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

export const useGetChatsInfinite = (request: Omit<GetChatsRequest, "cursor">) => {
  return useInfiniteQuery<ChatsResponse>({
    queryKey: ["chats", request],
    queryFn: ({ pageParam }) => getChats({ ...request, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.nextCursor ? lastPage.nextCursor : undefined;
    },
  });
};
