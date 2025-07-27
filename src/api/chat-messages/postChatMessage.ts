import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

interface PostChatMessageParams {
  chatId: string;
  content: string;
  images: string[];
  replyToId?: string;
}

export const postChatMessage = async (params: PostChatMessageParams) => {
  try {
    const response = await axiosInstance.post("/chat-messages", params);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError)
      // TODO: 에러 메시지 추가
      switch (error.status) {
        case 400:
          throw new Error("BAD_REQUEST");
        case 401:
          throw new Error("UNAUTHORIZED");
        case 403:
          throw new Error("FORBIDDEN");
        case 404:
          throw new Error("NOT_FOUNDED");
      }
  }
};

export const usePostChatMessage = () => {
  return useMutation({
    mutationFn: postChatMessage,
  });
};
