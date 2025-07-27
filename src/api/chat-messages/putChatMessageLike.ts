import { AxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";

import axiosInstance from "@/constants/baseurl";

interface PutChatMessageLikeParams {
  id: string;
}

export const putChatMessageLike = async (params: PutChatMessageLikeParams) => {
  try {
    const response = await axiosInstance.put(`/chat-messages/${params.id}/like`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      // TODO: 에러 메시지 추가
      switch (error.status) {
        case 400:
          throw new Error("BAD_REQUEST");
        case 401:
          throw new Error("UNAUTHORIZED");
        case 404:
          throw new Error("NOT_FOUNDED");
      }
    }
  }
};

export const usePutChatMessageLike = () => {
  return useMutation({
    mutationFn: putChatMessageLike,
  });
};
