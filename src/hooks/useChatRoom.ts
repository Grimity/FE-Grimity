import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

import { usePutChatJoin } from "@/api/chats/putChatJoin";
import { usePutChatLeave } from "@/api/chats/putChatLeave";
import { useSocket } from "@/hooks/useSocket";
import { useToast } from "@/hooks/useToast";
import { useChatStore } from "@/states/chatStore";

interface UseChatRoomOptions {
  chatId: string;
  onSetupListeners: (socket: Socket) => (() => void) | void;
}

export const useChatRoom = ({ chatId, onSetupListeners }: UseChatRoomOptions) => {
  const joinedSocketIdRef = useRef<string | null>(null);
  const { socket, isConnected } = useSocket();
  const { mutate: joinChat } = usePutChatJoin();
  const { mutate: leaveChat } = usePutChatLeave();
  const { showToast } = useToast();
  const { setCurrentChatId, initializeChatRoom } = useChatStore();

  useEffect(() => {
    if (!isConnected || !socket) {
      return;
    }

    setCurrentChatId(chatId);
    initializeChatRoom(chatId);

    const cleanup = onSetupListeners(socket);

    const socketId = socket.id;
    if (socketId) {
      joinedSocketIdRef.current = socketId;
      joinChat(
        { chatId, socketId },
        {
          onError: (error) => {
            joinedSocketIdRef.current = null;
            console.error("Failed to join chat:", error);
            showToast("채팅방 입장에 실패했습니다.", "error");
          },
        },
      );
    }

    return () => {
      if (cleanup) cleanup();

      if (joinedSocketIdRef.current) {
        leaveChat(
          { chatId, socketId: joinedSocketIdRef.current },
          {
            onError: (error) => {
              console.error("Failed to leave chat:", error);
            },
          },
        );
        joinedSocketIdRef.current = null;
      }

      setCurrentChatId(null);
    };
  }, [
    chatId,
    isConnected,
    joinChat,
    leaveChat,
    showToast,
    setCurrentChatId,
    initializeChatRoom,
    onSetupListeners,
  ]);
};
