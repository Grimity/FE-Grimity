import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

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

import { setDocumentViewportHeight } from "@/utils/viewport";
import { updateChatListWithNewMessage, type ChatQueryData } from "@/utils/chatListUpdater";

import styles from "@/components/Layout/Layout.module.scss";

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const [isScrollAbove, setIsScrollAbove] = useState(false);

  const { isMobile, isTablet } = useDeviceStore();

  const { setIsLoggedIn, setAccessToken, setUserId, setIsAuthReady, user_id } = useAuthStore();
  const { refetch: fetchMyData } = useMyData();
  const { currentChatId, setHasUnreadMessages } = useChatStore();

  const { socket, isConnected } = useSocket();
  const queryClient = useQueryClient();

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

  // 모바일 높이 설정
  useEffect(() => {
    if (typeof window !== "undefined") {
      setDocumentViewportHeight();
      window.addEventListener("resize", setDocumentViewportHeight);
    }
  }, []);

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

  // 전역 메시지 알림 및 채팅 목록 업데이트 처리
  useEffect(() => {
    if (!isConnected || !socket) return;

    const handleNewChatMessage = (newMessage: NewChatMessageEventResponse) => {
      // 현재 보고 있는 채팅방의 메시지가 아닌 경우에만 알림 표시
      if (newMessage.chatId !== currentChatId) {
        setHasUnreadMessages(true);
      }

      // 채팅 목록 업데이트
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["chats"] })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: ChatQueryData) => {
            return updateChatListWithNewMessage(oldData, newMessage, user_id || "");
          });
        });
    };

    socket.on("newChatMessage", handleNewChatMessage);

    return () => {
      socket.off("newChatMessage", handleNewChatMessage);
    };
  }, [isConnected, currentChatId, setHasUnreadMessages, queryClient]);

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

  const shouldHideHeader = router.pathname === "/direct/[chatId]" && isMobile;

  return (
    <div className={styles.layout}>
      {!shouldHideHeader && <Header variant={headerVariant} />}

      <div className={`${styles.container} ${shouldHideHeader ? styles.noHeader : ""}`}>
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
