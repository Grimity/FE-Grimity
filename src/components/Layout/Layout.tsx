import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useMyData } from "@/api/users/getMe";

import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";

import { useSocket } from "@/hooks/useSocket";

import IconComponent from "@/components/Asset/Icon";
import Header from "@/components/Layout/Header/Header";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";

import { useDeviceStore } from "@/states/deviceStore";

import type { HeaderProps } from "@/components/Layout/Header/types/Header.types";
import type { LayoutProps } from "@/components/Layout/Layout.types";
import type { NewChatMessageEventResponse } from "@grimity/dto";

import styles from "@/components/Layout/Layout.module.scss";

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const [isScrollAbove, setIsScrollAbove] = useState(false);

  const { isMobile, isTablet } = useDeviceStore();

  const { isLoggedIn, setIsLoggedIn, setAccessToken, setUserId, setIsAuthReady, access_token } =
    useAuthStore();
  const { refetch: fetchMyData } = useMyData();
  const { currentChatId, setHasUnreadMessages } = useChatStore();

  const { connect, disconnect, getSocket } = useSocket({ autoConnect: false });

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  let headerVariant: HeaderProps["variant"];
  const defaultRoutes = ["/", "/ranking", "/board", "/following"];

  if (isMobile) {
    headerVariant = defaultRoutes.includes(router.pathname) ? "default" : "sub";
  } else {
    headerVariant = "default";
  }

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("access_token");
      if (token) {
        setAccessToken(token);
        try {
          const myData = await fetchMyData();
          if (myData.data) {
            setIsLoggedIn(true);
            setUserId(myData.data.id.toString());
          } else {
            localStorage.clear();
            setIsLoggedIn(false);
          }
        } catch (error) {
          localStorage.clear();
          setIsLoggedIn(false);
        }
      }
      setIsAuthReady(true);
    };

    initializeAuth();
  }, []);

  // 글로벌 소켓 연결 관리
  useEffect(() => {
    if (isLoggedIn && access_token) {
      connect();
    } else {
      disconnect();
    }
  }, [isLoggedIn, access_token, connect, disconnect]);

  // 전역 메시지 알림 처리
  useEffect(() => {
    if (!isLoggedIn || !access_token) return;

    const socketInstance = getSocket();
    if (!socketInstance) return;

    const handleNewChatMessage = (newMessage: NewChatMessageEventResponse) => {
      // 현재 보고 있는 채팅방의 메시지가 아닌 경우에만 알림 표시
      if (newMessage.chatId !== currentChatId) {
        setHasUnreadMessages(true);
      }
    };

    socketInstance.on("newChatMessage", handleNewChatMessage);

    return () => {
      socketInstance.off("newChatMessage", handleNewChatMessage);
    };
  }, [isLoggedIn, access_token, getSocket, currentChatId, setHasUnreadMessages]);

  // 스크롤 위치 감지
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsScrollAbove(true);
      } else {
        setIsScrollAbove(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className={styles.layout}>
      <Header variant={headerVariant} />

      <div className={styles.container}>
        <div className={styles.children}>
          <Sidebar />
          {children}
        </div>
      </div>
      {!isMobile && !isTablet && (
        <div
          className={`${styles.topButton} ${isScrollAbove && styles.show}`}
          onClick={scrollToTop}
          role="button"
          tabIndex={0}
        >
          <IconComponent name="up" size={28} isBtn />
        </div>
      )}
    </div>
  );
}
