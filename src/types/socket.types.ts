export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  userName: string;
  content: string;
  images?: string[];
  replyToId?: string;
  replyTo?: {
    id: string;
    content: string;
    image?: string | null;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
}

export interface ChatRoomState {
  messages: ChatMessage[];
  hasNextPage?: boolean;
  nextCursor?: string | null;
  isLoadingMore?: boolean;
}
