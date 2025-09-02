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
    set((state) => {
      const existingMessages = state.chatRooms[chatId]?.messages || [];
      
      // 중복 메시지 체크 - 같은 ID의 메시지가 이미 존재하는지 확인
      const isDuplicate = existingMessages.some(existingMsg => existingMsg.id === message.id);
      
      if (isDuplicate) {
        return state; // 중복이면 상태 변경하지 않음
      }
      
      return {
        chatRooms: {
          ...state.chatRooms,
          [chatId]: {
            ...state.chatRooms[chatId],
            messages: [...existingMessages, message],
          },
        },
      };
    }),

  addOlderMessages: (chatId, messages) =>
    set((state) => {
      const existingMessages = state.chatRooms[chatId]?.messages || [];
      
      // 중복 메시지 제거 - 기존 메시지에 없는 것만 추가
      const uniqueOlderMessages = messages.filter(
        newMsg => !existingMessages.some(existingMsg => existingMsg.id === newMsg.id)
      );
      
      return {
        chatRooms: {
          ...state.chatRooms,
          [chatId]: {
            ...state.chatRooms[chatId],
            messages: [...uniqueOlderMessages, ...existingMessages],
          },
        },
      };
    }),

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
