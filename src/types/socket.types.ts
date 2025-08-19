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

export interface SocketUser {
  id: string;
  nickname: string;
  profileImage?: string;
}

export interface OnlineUser {
  userId: string;
  socketId: string;
  nickname: string;
  profileImage?: string;
}

export interface ServerToClientEvents {
  newMessage: (message: ChatMessage) => void;
  messageDeleted: (messageId: string) => void;
  messageUpdated: (message: ChatMessage) => void;
  userJoined: (user: SocketUser) => void;
  userLeft: (userId: string) => void;
  onlineUsers: (users: OnlineUser[]) => void;
  typing: (data: { userId: string; nickname: string; isTyping: boolean }) => void;
  error: (error: { message: string; code?: string }) => void;
}

export interface ClientToServerEvents {
  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (data: {
    chatId: string;
    content: string;
    images?: string[];
    replyToId?: string;
  }) => void;
  deleteMessage: (messageId: string) => void;
  updateMessage: (data: { messageId: string; content: string }) => void;
  typing: (data: { chatId: string; isTyping: boolean }) => void;
}

export interface TypingState {
  userId: string;
  nickname: string;
  isTyping: boolean;
}

export interface ChatRoomState {
  messages: ChatMessage[];
  onlineUsers: OnlineUser[];
  typingUsers: TypingState[];
}