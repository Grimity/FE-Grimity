export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  images?: string[];
  replyToId?: string;
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
