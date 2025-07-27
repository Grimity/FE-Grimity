import { useInfiniteQuery } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

interface GetChatMessagesParams {
  chatId: string;
  size?: number;
  cursor?: string;
}

interface User {
  id: string;
  name: string;
  image: string | null;
  url: string;
}

interface ReplyTo {
  id: string;
  content: string | null;
  image: string | null;
  createdAt: string;
}

interface Message {
  id: string;
  user: User;
  image: string | null;
  content: string | null;
  createdAt: string;
  isLike: boolean;
  replyTo: ReplyTo;
}

interface ChatMessageDto {
  nextCursor: string | null;
  messages: Message[];
}

export const getChatMessages = async (params: GetChatMessagesParams): Promise<ChatMessageDto> => {
  const response = await axiosInstance.get<ChatMessageDto>(`/chat-messages`, { params });
  return response.data;
};

export const useGetChatMessages = (params: GetChatMessagesParams) => {
  return useInfiniteQuery({
    queryKey: ["chatMessages", params],
    queryFn: ({ pageParam }) => getChatMessages({ ...params, cursor: pageParam }),
    initialPageParam: "",
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    getPreviousPageParam: (firstPage) => firstPage.nextCursor,
  });
};
