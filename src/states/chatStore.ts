import { create } from "zustand";

import { ChatMessage, OnlineUser, ChatRoomState } from "@/types/socket.types";

interface ChatStore {
  chatRooms: Record<string, ChatRoomState>;
  currentChatId: string | null;

  setCurrentChatId: (chatId: string | null) => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  updateMessage: (chatId: string, messageId: string, updatedMessage: Partial<ChatMessage>) => void;
  removeMessage: (chatId: string, messageId: string) => void;
  setMessages: (chatId: string, messages: ChatMessage[]) => void;
  addMessages: (chatId: string, messages: ChatMessage[]) => void;

  setOnlineUsers: (chatId: string, users: OnlineUser[]) => void;
  addOnlineUser: (chatId: string, user: OnlineUser) => void;
  removeOnlineUser: (chatId: string, userId: string) => void;

  setTyping: (chatId: string, userId: string, nickname: string, isTyping: boolean) => void;
  clearTyping: (chatId: string, userId: string) => void;

  initializeChatRoom: (chatId: string) => void;
  clearChatRoom: (chatId: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: {},
  currentChatId: null,

  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),

  addMessage: (chatId, message) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          messages: [...(state.chatRooms[chatId]?.messages || []), message],
        },
      },
    })),

  updateMessage: (chatId, messageId, updatedMessage) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          messages:
            state.chatRooms[chatId]?.messages.map((msg) =>
              msg.id === messageId ? { ...msg, ...updatedMessage } : msg,
            ) || [],
        },
      },
    })),

  removeMessage: (chatId, messageId) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          messages: state.chatRooms[chatId]?.messages.filter((msg) => msg.id !== messageId) || [],
        },
      },
    })),

  setMessages: (chatId, messages) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          messages,
        },
      },
    })),

  addMessages: (chatId, messages) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          messages: [...(state.chatRooms[chatId]?.messages || []), ...messages],
        },
      },
    })),

  setOnlineUsers: (chatId, users) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          onlineUsers: users,
        },
      },
    })),

  addOnlineUser: (chatId, user) =>
    set((state) => {
      const currentUsers = state.chatRooms[chatId]?.onlineUsers || [];
      const userExists = currentUsers.some((u) => u.userId === user.userId);

      if (userExists) return state;

      return {
        chatRooms: {
          ...state.chatRooms,
          [chatId]: {
            ...state.chatRooms[chatId],
            onlineUsers: [...currentUsers, user],
          },
        },
      };
    }),

  removeOnlineUser: (chatId, userId) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          onlineUsers:
            state.chatRooms[chatId]?.onlineUsers.filter((user) => user.userId !== userId) || [],
        },
      },
    })),

  setTyping: (chatId, userId, nickname, isTyping) =>
    set((state) => {
      const currentTyping = state.chatRooms[chatId]?.typingUsers || [];
      const existingIndex = currentTyping.findIndex((t) => t.userId === userId);

      let newTypingUsers;
      if (isTyping) {
        if (existingIndex >= 0) {
          newTypingUsers = currentTyping.map((t, i) =>
            i === existingIndex ? { ...t, isTyping: true } : t,
          );
        } else {
          newTypingUsers = [...currentTyping, { userId, nickname, isTyping: true }];
        }
      } else {
        newTypingUsers = currentTyping.filter((t) => t.userId !== userId);
      }

      return {
        chatRooms: {
          ...state.chatRooms,
          [chatId]: {
            ...state.chatRooms[chatId],
            typingUsers: newTypingUsers,
          },
        },
      };
    }),

  clearTyping: (chatId, userId) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          typingUsers:
            state.chatRooms[chatId]?.typingUsers.filter((t) => t.userId !== userId) || [],
        },
      },
    })),

  initializeChatRoom: (chatId) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: state.chatRooms[chatId] || {
          messages: [],
          onlineUsers: [],
          typingUsers: [],
        },
      },
    })),

  clearChatRoom: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...restChatRooms } = state.chatRooms;
      return { chatRooms: restChatRooms };
    }),
}));
