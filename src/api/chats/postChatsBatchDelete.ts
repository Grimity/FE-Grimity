import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

import type { BatchDeleteChatsRequest } from "@grimity/dto";

export const postChatsBatchDelete = async (request: BatchDeleteChatsRequest) => {
  return await axiosInstance.post<BatchDeleteChatsRequest>("/chats/batch-delete", request);
};

export const usePostChatsBatchDelete = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postChatsBatchDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
