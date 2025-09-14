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
  createdAt: Date;
  isLike: boolean;
  replyTo?: {
    id: string;
    content: string | null;
    image: string | null;
    createdAt: Date;
  } | null;
}

export const convertApiMessageToChatMessage = (
  apiMessage: ApiMessage,
  chatId: string,
): ChatMessage => {
  return {
    id: apiMessage.id,
    chatId,
    userId: apiMessage.user.id,
    userName: apiMessage.user.name,
    content: apiMessage.content || "",
    images: apiMessage.image ? [apiMessage.image] : undefined,
    replyToId: apiMessage.replyTo?.id,
    replyTo: apiMessage.replyTo
      ? {
          id: apiMessage.replyTo.id,
          content: apiMessage.replyTo.content || "",
          image: apiMessage.replyTo.image,
          createdAt: apiMessage.replyTo.createdAt.toString(),
        }
      : undefined,
    createdAt: apiMessage.createdAt.toString(),
    updatedAt: apiMessage.createdAt.toString(),
    isLiked: apiMessage.isLike,
  };
};
