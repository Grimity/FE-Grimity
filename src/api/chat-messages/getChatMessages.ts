import { useInfiniteQuery } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import type { ChatMessagesResponse, GetChatMessagesRequest } from "@grimity/dto";

export const getChatMessages = async (
  params: GetChatMessagesRequest,
): Promise<ChatMessagesResponse> => {
  const response = await axiosInstance.get<ChatMessagesResponse>(`/chat-messages`, { params });
  return response.data;
};

export const useGetChatMessages = (
  params: GetChatMessagesRequest,
  options?: { enabled?: boolean },
) => {
  return useInfiniteQuery({
    queryKey: ["chatMessages", params],
    queryFn: ({ pageParam }) =>
      getChatMessages({ ...params, ...(pageParam.length && { cursor: pageParam }) }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
    enabled: options?.enabled,
  });
};
