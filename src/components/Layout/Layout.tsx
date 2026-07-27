import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import { useQueryClient } from "@tanstack/react-query";

import { useMyData } from "@/api/users/getMe";

import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";
import { useDeviceStore } from "@/states/deviceStore";

import { useSocket } from "@/hooks/useSocket";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import useGoBack from "@/hooks/useGoBack";
import { useMobileSearchHeader } from "@/hooks/useMobileSearchHeader";
import { useLogout } from "@/hooks/useLogout";

import IconButton from "@/components/common/Button/IconButton/IconButton";
import Icon from "@/components/common/Icon/Icon";
import Menu from "@/components/common/Navigation/Menu/Menu";
import GNB from "@/components/common/Navigation/GNB/GNB";
import type {
  GNBVariant,
  GNBProps,
} from "@/components/common/Navigation/GNB/GNB.types";
import Sidebar from "@/components/common/Navigation/Sidebar/Sidebar";
import Notifications from "@/components/Notifications/Notifications";
import { SETTINGS_NAV_ITEMS } from "@/components/Settings/SettingsNav/SettingsNav";

import type { LayoutProps } from "@/components/Layout/Layout.types";
import type { NewChatMessageEventResponse } from "@grimity/dto";

import { setDocumentViewportHeight } from "@/utils/viewport";
import { updateChatListWithNewMessage, type ChatQueryData } from "@/utils/chatListUpdater";

import styles from "@/components/Layout/Layout.module.scss";

const MAIN_ROUTES = [
  "/",
  "/ranking",
  "/board",
  "/following",
  "/login",
  "/signup/nickname",
  "/signup/profile-url",
  "/signup/complete",
];
const UPLOAD_HIDDEN_ROUTES = [
  "/write",
  "/feeds/[id]/edit",
  "/board/write",
  "/posts/[id]/edit",
];
const BOARD_WRITE_ROUTES = [
  "/board",
  "/board/write",
  "/posts/[id]",
  "/posts/[id]/edit",
];
const SUB_SEARCH_HIDDEN_ROUTES = [
  "/search",
  "/feeds/[id]",
  "/posts/[id]",
  "/direct",
];
const SETTINGS_GNB_TITLES: Record<string, string> = {
  "/settings": "설정",
  ...Object.fromEntries(SETTINGS_NAV_ITEMS.map((i) => [i.path, i.label])),
};
export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { goBack } = useGoBack();

  // ─── 전역 상태 ─────────────────────────────────────────────────────────
  const { isMobile, isTablet } = useDeviceStore();
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn);
  const isAuthReady = useAuthStore((s) => s.isAuthReady);
  const user_id = useAuthStore((s) => s.user_id);
  const { setIsLoggedIn, setAccessToken, setUserId, setIsAuthReady } = useAuthStore.getState();
  const { data: myData, refetch: fetchMyData } = useMyData();
  const { currentChatId, setHasUnreadMessages } = useChatStore();
  const { socket, isConnected } = useSocket();
  const logout = useLogout();

  // ─── 로컬 상태 ─────────────────────────────────────────────────────────
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  usePreventScroll(isMobile && (showNotifications || isMobileSidebarOpen));
  useOnClickOutside(notificationRef, () => setShowNotifications(false));
  useOnClickOutside(profileRef, () => setIsProfileDropdownOpen(false));

  // ─── 핸들러 ────────────────────────────────────────────────────────────
  const goToLogin = useCallback(() => {
    router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
  }, [router]);

  const goToSearch = useCallback(() => {
    setIsMobileSidebarOpen(false);
    router.push("/search");
  }, [router]);

  const goToUpload = useCallback(() => {
    const isBoardPage = BOARD_WRITE_ROUTES.includes(router.pathname);
    router.push(isBoardPage ? "/board/write" : "/write");
  }, [router]);

  const toggleMobileSidebar = useCallback(() => {
    if (!isMobile) return;
    setIsMobileSidebarOpen((prev) => !prev);
  }, [isMobile]);

  const closeMobileSidebar = useCallback(() => setIsMobileSidebarOpen(false), []);

  // 모바일은 프로필 클릭으로 사이드바 열기, 데스크톱은 드롭다운 토글
  const onProfileClick = useCallback(() => {
    if (isMobile) toggleMobileSidebar();
    else setIsProfileDropdownOpen((prev) => !prev);
  }, [isMobile, toggleMobileSidebar]);

  const isSubRoute = isMobile && !MAIN_ROUTES.includes(router.pathname);
  const showUploadBtn = !UPLOAD_HIDDEN_ROUTES.includes(router.pathname);
  const showSubSearch = !SUB_SEARCH_HIDDEN_ROUTES.includes(router.pathname);
  const shouldHideHeader =
    (router.pathname === "/direct/[chatId]" && isMobile) || router.pathname === "/login";
  const isMobileSearchPage = isMobile && router.pathname === "/search";

  const {
    value: mobileSearchValue,
    setValue: setMobileSearchValue,
    onKeyDown: handleMobileSearchKeyDown,
    onClear: handleMobileSearchClear,
  } = useMobileSearchHeader(isMobileSearchPage);

  const sidebarUser = useMemo(
    () =>
      myData
        ? {
            username: myData.name,
            avatarSrc: myData.image ?? undefined,
            profileUrl: myData.url,
          }
        : undefined,
    [myData],
  );

  const gnbVariant: GNBVariant = useMemo(() => {
    if (isMobileSearchPage) return "search";
    if (isSubRoute) {
      if (router.pathname === "/mypage") return "depth-2";
      return "three-button";
    }
    if (isMobile) {
      if (!isAuthReady || !isLoggedIn) {
        return isMobileSidebarOpen ? "guest-menu" : "guest";
      }
      return "main";
    }
    return isLoggedIn ? "pc-main" : "pc-guest";
  }, [isMobileSearchPage, isSubRoute, isMobile, isAuthReady, isLoggedIn, isMobileSidebarOpen, router.pathname]);

  const isMyProfilePage =
    router.pathname === "/[url]" && !!myData?.url && router.query.url === myData.url;

  const subRightActions = useMemo<GNBProps["rightActions"]>(() => {
    if (!isSubRoute) return undefined;

    if (router.pathname.startsWith("/settings")) return [];

    const searchButton = (
      <IconButton
        key="search"
        variant="sm"
        icon={<Icon name="magnifer" size={24} color="gray-bold" />}
        onClick={goToSearch}
        aria-label="검색"
      />
    );

    const menuButton = (
      <IconButton
        key="menu"
        variant="sm"
        icon={<Icon name="hamburger" size={24} color="gray-bold" />}
        onClick={toggleMobileSidebar}
        aria-label="메뉴"
      />
    );

    if (isMyProfilePage) {
      return [
        searchButton,
        <IconButton
          key="inbox"
          variant="sm"
          icon={<Icon name="inbox" size={24} color="gray-bold" />}
          onClick={() => router.push("/mypage")}
          aria-label="보관함"
        />,
        <IconButton
          key="settings"
          variant="sm"
          icon={<Icon name="settings" size={24} color="gray-bold" />}
          onClick={() => router.push("/settings")}
          aria-label="설정"
        />,
      ];
    }

    if (!showSubSearch) {
      return [menuButton];
    }

    return [searchButton, menuButton];
  }, [isSubRoute, isMyProfilePage, showSubSearch, goToSearch, toggleMobileSidebar, router]);

  const profileMenuItems = useMemo(() => {
    if (!myData) return [];
    const navigate = (path: string) => {
      setIsProfileDropdownOpen(false);
      router.push(path);
    };
    return [
      {
        label: "내 프로필",
        onClick: () => navigate(`/${myData.url}`),
        borderBottom: true,
      },
      { label: "좋아요한 그림", onClick: () => navigate("/mypage?tab=liked-feeds") },
      {
        label: "저장한 글",
        onClick: () => navigate("/mypage?tab=saved-posts"),
        borderBottom: true,
      },
      {
        label: "설정",
        onClick: () => navigate("/settings"),
        borderBottom: true,
      },
      { label: "로그아웃", onClick: logout },
    ];
  }, [myData, router, logout]);

  // ─── Effects ───────────────────────────────────────────────────────────
  // 뷰포트 높이 (모바일)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setDocumentViewportHeight();
    window.addEventListener("resize", setDocumentViewportHeight);
    return () => window.removeEventListener("resize", setDocumentViewportHeight);
  }, []);

  // 인증 초기화
  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setIsAuthReady(true);
        return;
      }
      setAccessToken(token);
      try {
        const fetched = await fetchMyData();
        if (fetched.data) {
          setIsLoggedIn(true);
          setUserId(fetched.data.id.toString());
          setHasUnreadMessages(fetched.data.hasUnreadChatMessage);
        } else {
          localStorage.clear();
          setIsLoggedIn(false);
        }
      } catch {
        localStorage.clear();
        setIsLoggedIn(false);
      }
      setIsAuthReady(true);
    };
    init();
  }, []);

  // 실시간 채팅 알림 + 채팅 목록 갱신
  useEffect(() => {
    if (!isConnected || !socket) return;
    const handleNewChatMessage = (newMessage: NewChatMessageEventResponse) => {
      if (newMessage.chatId !== currentChatId) {
        setHasUnreadMessages(true);
      }

      let shouldRefetch = false;
      queryClient
        .getQueryCache()
        .findAll({ queryKey: ["chats"] })
        .forEach((query) => {
          queryClient.setQueryData(query.queryKey, (oldData: ChatQueryData) => {
            const updated = updateChatListWithNewMessage(oldData, newMessage, user_id || "");
            if (updated === null) {
              shouldRefetch = true;
              return oldData;
            }
            return updated;
          });
        });

      if (shouldRefetch) {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }
    };

    socket.on("newChatMessage", handleNewChatMessage);
    return () => {
      socket.off("newChatMessage", handleNewChatMessage);
    };
  }, [isConnected, currentChatId, setHasUnreadMessages, queryClient, user_id]);

  // 로그인 상태 변경 시 프로필 드롭다운·모바일 사이드바 닫기
  useEffect(() => {
    setIsProfileDropdownOpen(false);
    if (isLoggedIn) {
      setIsMobileSidebarOpen(false);
    }
  }, [isLoggedIn]);

  // PC→모바일 전환 시 드로어는 닫힌 상태로
  useEffect(() => {
    if (isMobile) {
      setIsMobileSidebarOpen(false);
    }
  }, [isMobile]);

  // 알림 패널 열려있을 때 popstate로 닫기
  useEffect(() => {
    if (!showNotifications) return;
    window.history.pushState({ isNotificationOpen: true }, "", window.location.href);
    const onPop = () => setShowNotifications(false);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [showNotifications]);

  // ─── 렌더 ──────────────────────────────────────────────────────────────
  const showProfileDropdown =
    !isMobile && isLoggedIn && Boolean(myData) && isProfileDropdownOpen;
  const shouldHideSidebar =
    router.pathname === "/login" ||
    router.pathname.startsWith("/signup") ||
    (router.pathname.startsWith("/settings") && isTablet);

  return (
    <div className={styles.layout}>
      {!shouldHideHeader && (
        <>
          <GNB
            variant={gnbVariant}
            title={SETTINGS_GNB_TITLES[router.pathname]}
            hasNotification={Boolean(myData?.hasNotification)}
            profileImageUrl={myData?.image ?? undefined}
            onSearch={goToSearch}
            onBell={() => {
              setIsMobileSidebarOpen(false);
              setShowNotifications((prev) => !prev);
            }}
            onProfile={onProfileClick}
            onUpload={showUploadBtn ? goToUpload : undefined}
            onLogin={goToLogin}
            onMenu={toggleMobileSidebar}
            onClose={toggleMobileSidebar}
            onBack={isMobileSearchPage || isSubRoute ? goBack : undefined}
            rightActions={subRightActions}
            searchValue={isMobileSearchPage ? mobileSearchValue : undefined}
            searchPlaceholder="그림, 작가, 글을 검색해보세요."
            onSearchChange={isMobileSearchPage ? setMobileSearchValue : undefined}
            onSearchKeyDown={isMobileSearchPage ? handleMobileSearchKeyDown : undefined}
            onSearchClear={isMobileSearchPage ? handleMobileSearchClear : undefined}
          />

          {showNotifications && (
            <div className={styles.notificationAnchor} ref={notificationRef}>
              <Notifications onClose={() => setShowNotifications(false)} />
            </div>
          )}

          {showProfileDropdown && (
            <div className={styles.profileAnchor} ref={profileRef}>
              <Menu items={profileMenuItems} />
            </div>
          )}
        </>
      )}

      <div className={`${styles.container} ${shouldHideHeader ? styles.noHeader : ""}`}>
        <div className={styles.children}>
          {!shouldHideSidebar && (
            <Sidebar
              key={isMobile ? "sidebar-mobile" : "sidebar-desktop"}
              isLoggedIn={isLoggedIn}
              isOpen={isMobile && isMobileSidebarOpen}
              onClose={isMobile ? closeMobileSidebar : undefined}
              user={sidebarUser}
              onLoginClick={goToLogin}
              onLogoutClick={logout}
              onNavigate={isMobile ? closeMobileSidebar : undefined}
            />
          )}
          {children}
        </div>
      </div>
    </div>
  );
}
