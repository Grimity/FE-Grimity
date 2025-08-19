import { useEffect, useCallback } from "react";
import { Socket } from "socket.io-client";

import { socketManager } from "@/utils/socket";

import { useAuthStore } from "@/states/authStore";

interface UseSocketProps {
  serverUrl?: string;
  autoConnect?: boolean;
}

export const useSocket = ({
  serverUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.grimity.com",
  autoConnect = true,
}: UseSocketProps = {}) => {
  const { access_token } = useAuthStore();

  const connect = useCallback(() => {
    return socketManager.connect(serverUrl, access_token);
  }, [serverUrl, access_token]);

  const disconnect = useCallback(() => {
    socketManager.disconnect();
  }, []);

  const getSocket = useCallback((): Socket | null => {
    return socketManager.getSocket();
  }, []);

  const isConnected = useCallback((): boolean => {
    return socketManager.isSocketConnected();
  }, []);

  const joinRoom = useCallback((roomId: string) => {
    socketManager.joinRoom(roomId);
  }, []);

  const leaveRoom = useCallback((roomId: string) => {
    socketManager.leaveRoom(roomId);
  }, []);

  useEffect(() => {
    if (autoConnect && access_token) {
      connect();
    }

    return () => {
      if (autoConnect) {
        disconnect();
      }
    };
  }, [autoConnect, access_token, connect, disconnect]);

  return {
    connect,
    disconnect,
    getSocket,
    isConnected,
    joinRoom,
    leaveRoom,
  };
};
