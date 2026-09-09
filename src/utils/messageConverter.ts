import type { ChatMessage } from "@/types/socket.types";

export interface ApiMessageImageFields {
  images?: string[] | null;
  image?: string | null;
}

export const resolveImages = ({ images, image }: ApiMessageImageFields): string[] =>
  images ?? (image ? [image] : []);

interface ApiMessage extends ApiMessageImageFields {
  id: string;
  user: {
    id: string;
    name: string;
    image: string | null;
    url: string;
  };
  content: string | null;
  createdAt: Date;
  isLike: boolean;
  replyTo?: ({
    id: string;
    content: string | null;
    createdAt: Date;
  } & ApiMessageImageFields) | null;
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
    images: resolveImages(apiMessage),
    replyToId: apiMessage.replyTo?.id,
    replyTo: apiMessage.replyTo
      ? {
          id: apiMessage.replyTo.id,
          content: apiMessage.replyTo.content || "",
          image: resolveImages(apiMessage.replyTo)[0] ?? null,
          createdAt: apiMessage.replyTo.createdAt.toString(),
        }
      : undefined,
    createdAt: apiMessage.createdAt.toString(),
    updatedAt: apiMessage.createdAt.toString(),
    isLiked: apiMessage.isLike,
  };
};
