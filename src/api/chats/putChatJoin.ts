import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import type { JoinChatRequest } from "@grimity/dto";

interface PutChatJoinRequest extends JoinChatRequest {
  chatId: string;
}

export const putChatJoin = async ({ chatId, socketId }: PutChatJoinRequest) => {
  return await axiosInstance.put<PutChatJoinRequest>(`/chats/${chatId}/join`, {
    socketId,
  });
};

export const usePutChatJoin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putChatJoin,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
