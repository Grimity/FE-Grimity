import { create } from "zustand";

import { ChatMessage, ChatRoomState } from "@/types/socket.types";

interface ChatStore {
  chatRooms: Record<string, ChatRoomState>;
  currentChatId: string | null;
  hasUnreadMessages: boolean;

  setCurrentChatId: (chatId: string | null) => void;
  setHasUnreadMessages: (hasUnread: boolean) => void;
  markAsRead: () => void;
  addMessage: (chatId: string, message: ChatMessage) => void;
  updateMessage: (chatId: string, messageId: string, updatedMessage: Partial<ChatMessage>) => void;
  removeMessage: (chatId: string, messageId: string) => void;
  addOlderMessages: (chatId: string, messages: ChatMessage[]) => void;
  initializeWithMessages: (
    chatId: string,
    messages: ChatMessage[],
    nextCursor?: string | null,
  ) => void;

  initializeChatRoom: (chatId: string) => void;
  clearChatRoom: (chatId: string) => void;

  // Pagination state
  setHasNextPage: (chatId: string, hasNext: boolean) => void;
  setNextCursor: (chatId: string, cursor: string | null) => void;
  setIsLoadingMore: (chatId: string, isLoading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  chatRooms: {},
  currentChatId: null,
  hasUnreadMessages: false,

  setCurrentChatId: (chatId) => set({ currentChatId: chatId }),
  setHasUnreadMessages: (hasUnread) => set({ hasUnreadMessages: hasUnread }),
  markAsRead: () => set({ hasUnreadMessages: false }),

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

  addOlderMessages: (chatId, messages) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          messages: [...messages, ...(state.chatRooms[chatId]?.messages || [])],
        },
      },
    })),

  initializeWithMessages: (chatId, messages, nextCursor = null) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          messages,
          nextCursor,
          hasNextPage: !!nextCursor,
          isLoadingMore: false,
        },
      },
    })),

  initializeChatRoom: (chatId) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: state.chatRooms[chatId] || {
          messages: [],
          hasNextPage: true,
          nextCursor: null,
          isLoadingMore: false,
        },
      },
    })),

  clearChatRoom: (chatId) =>
    set((state) => {
      const { [chatId]: _, ...restChatRooms } = state.chatRooms;
      return { chatRooms: restChatRooms };
    }),

  setHasNextPage: (chatId, hasNext) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          hasNextPage: hasNext,
        },
      },
    })),

  setNextCursor: (chatId, cursor) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          nextCursor: cursor,
        },
      },
    })),

  setIsLoadingMore: (chatId, isLoading) =>
    set((state) => ({
      chatRooms: {
        ...state.chatRooms,
        [chatId]: {
          ...state.chatRooms[chatId],
          isLoadingMore: isLoading,
        },
      },
    })),
}));
