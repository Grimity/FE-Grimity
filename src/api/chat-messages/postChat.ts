import { useMutation, useQueryClient } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

interface PostChatParams {
  targetUserId: string;
}

interface PostChatResponse {
  id: string;
}

export const postChat = async ({ targetUserId }: PostChatParams): Promise<PostChatResponse> => {
  const response = await axiosInstance.post<PostChatResponse>("/chats", { targetUserId });

  return response.data;
};

export const usePostChat = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postChat,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });
};
