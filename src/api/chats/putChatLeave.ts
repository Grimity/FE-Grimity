import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import type { LeaveChatRequest } from "@grimity/dto";

interface PutChatLeaveRequest extends LeaveChatRequest {
  chatId: string;
}

export const putChatLeave = async ({ chatId, socketId }: PutChatLeaveRequest) => {
  return await axiosInstance.put<PutChatLeaveRequest>(`/chats/${chatId}/leave`, { socketId });
};

export const usePutChatLeave = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: putChatLeave,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
