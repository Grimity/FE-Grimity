export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  content: string;
  images?: string[];
  replyToId?: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    nickname: string;
    profileImage?: string;
  };
  isLiked?: boolean;
  likeCount?: number;
}

export interface ChatRoomState {
  messages: ChatMessage[];
  hasNextPage?: boolean;
  nextCursor?: string | null;
  isLoadingMore?: boolean;
}
