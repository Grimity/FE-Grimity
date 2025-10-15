import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

import { useAuthStore } from "@/states/authStore";

import { socketManager } from "@/utils/socket";

interface UseSocketProps {
  autoConnect?: boolean;
}

export const useSocket = ({ autoConnect = false }: UseSocketProps = {}) => {
  const serverUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://api.grimity.com";
  const { access_token, isLoggedIn } = useAuthStore();

  const [isConnected, setIsConnected] = useState(socketManager.getConnectionStatus());
  const [socket, setSocket] = useState<Socket | null>(socketManager.getSocket());

  // 소켓 초기화 및 구독
  useEffect(() => {
    const socketInstance = socketManager.initialize(serverUrl, access_token);
    setSocket(socketInstance);

    const unsubscribe = socketManager.subscribe(() => {
      setIsConnected(socketManager.getConnectionStatus());
    });

    return unsubscribe;
  }, [serverUrl]);

  // 소켓 연결/해제 관리
  useEffect(() => {
    if (isLoggedIn && access_token) {
      socketManager.connect(access_token);
    } else {
      socketManager.disconnect();
    }
  }, [isLoggedIn, access_token]);

  // autoConnect 옵션 처리 (하위 호환성)
  useEffect(() => {
    if (autoConnect && access_token) {
      socketManager.connect(access_token);
    }
  }, [autoConnect, access_token]);

  return {
    socket,
    isConnected,
  };
};
