import type { ChatMessage } from "@/types/socket.types";

interface ApiMessage {
  id: string;
  user: {
    id: string;
    name: string;
    image: string | null;
    url: string;
  };
  image: string | null;
  content: string | null;
  createdAt: string;
  isLike: boolean;
  replyTo: {
    id: string;
    content: string | null;
    image: string | null;
    createdAt: string;
  };
}

export const convertApiMessageToChatMessage = (
  apiMessage: ApiMessage,
  chatId: string,
): ChatMessage => {
  return {
    id: apiMessage.id,
    chatId,
    userId: apiMessage.user.id,
    content: apiMessage.content || "",
    images: apiMessage.image ? [apiMessage.image] : undefined,
    replyToId: apiMessage.replyTo?.id,
    createdAt: apiMessage.createdAt,
    updatedAt: apiMessage.createdAt,
    user: {
      id: apiMessage.user.id,
      nickname: apiMessage.user.name,
      profileImage: apiMessage.user.image || undefined,
    },
    isLiked: apiMessage.isLike,
    likeCount: 0,
  };
};