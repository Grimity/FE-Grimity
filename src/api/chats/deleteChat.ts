import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

interface DeleteChatRequest {
  chatId: string;
}

export const deleteChat = async ({ chatId }: DeleteChatRequest) => {
  return await axiosInstance.delete(`/chats/${chatId}`);
};

export const useDeleteChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
