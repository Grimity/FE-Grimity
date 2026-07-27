import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useMyData } from "@/api/users/getMe";

import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useChatStore } from "@/states/chatStore";

import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import Notifications from "@/components/Notifications/Notifications";
import SideMenu from "@/components/Layout/SideMenu/SideMenu";
import ResponsiveImage from "@/components/ResponsiveImage/ResponsiveImage";

import { usePreventScroll } from "@/hooks/usePreventScroll";
import { useOnClickOutside } from "@/hooks/useOnClickOutside";

import axiosInstance from "@/constants/baseurl";

import styles from "./DefaultHeader.module.scss";

export default function DefaultHeader() {
  const router = useRouter();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { isLoggedIn, setAccessToken, setIsLoggedIn, setUserId, isAuthReady } = useAuthStore();
  const { reset: resetChat } = useChatStore();
  const { isMobile } = useDeviceStore();
  usePreventScroll(isMenuOpen || (isMobile && showNotifications));
  useOnClickOutside(notificationRef, () => setShowNotifications(false));
  useOnClickOutside(dropdownRef, () => setIsDropdownOpen(false));

  const { data: myData } = useMyData();

  const isPostPage = ["/board", "/board/write", "/posts/[id]", "/posts/[id]/edit"].includes(
    router.pathname,
  );
  const hideBtn = ["/write", "/feeds/[id]/edit", "/board/write", "/posts/[id]/edit"].includes(
    router.pathname,
  );

  let name: "bellActive" | "bell";

  if (myData?.hasNotification) {
    name = "bellActive";
  } else {
    name = "bell";
  }

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosInstance.post(
          "/auth/logout",
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
              "exclude-access-token": true,
            },
          },
        );
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      setAccessToken("");
      setUserId("");
      resetChat();
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (isMobile) {
        setIsMenuOpen(false);
      }
    }
  };

  const handleClickLogo = () => {
    if (router.pathname === "/") {
      router.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleLoginNavigation = () => {
    router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
  };

  const handleCloseNotifications = () => {
    setShowNotifications(false);
  };

  const handleToggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  useEffect(() => {
    if (showNotifications) {
      window.history.pushState({ isNotificationOpen: true }, "", window.location.href);

      function handlePopState(event: PopStateEvent) {
        setShowNotifications(false);
      }

      window.addEventListener("popstate", handlePopState);

      return () => {
        window.removeEventListener("popstate", handlePopState);
      };
    }
  }, [isMobile, showNotifications]);

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isLoggedIn]);

  return (
    <>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.cursor} onClick={handleClickLogo}>
            <img src={"/image/logo.svg"} width={100} height={29} alt="logo" loading="lazy" />
          </div>
        </div>
        <div className={styles.wrapper}>
          {isMobile ? (
            <>
              {isAuthReady && !isLoggedIn && (
                <div className={styles.loginBtn} onClick={handleLoginNavigation}>
                  <Button size="s" type="filled-primary">
                    로그인
                  </Button>
                </div>
              )}
              <div className={styles.icons}>
                {isLoggedIn && myData && (
                  <div className={styles.notificationWrapper} ref={notificationRef}>
                    <div className={styles.notification} onClick={handleToggleNotifications}>
                      <IconComponent name={name} size={40} isBtn />
                    </div>
                    {showNotifications && <Notifications onClose={handleCloseNotifications} />}
                  </div>
                )}
                <Link href="/search">
                  <IconComponent name="search" size={24} padding={8} isBtn />
                </Link>
              </div>
              <div onClick={toggleMenu}>
                <IconComponent name="hamburger" size={24} padding={8} isBtn />
              </div>
            </>
          ) : (
            <>
              {!hideBtn &&
                isLoggedIn &&
                (isPostPage ? (
                  <Link href="/board/write">
                    <Button size="m" type="filled-primary">
                      글 쓰기
                    </Button>
                  </Link>
                ) : (
                  <Link href="/write">
                    <Button size="m" type="filled-primary">
                      그림 업로드
                    </Button>
                  </Link>
                ))}
              <div className={styles.icons}>
                <Link href="/search">
                  <IconComponent name="search" size={24} padding={8} isBtn />
                </Link>
                {isLoggedIn && myData && (
                  <div className={styles.notificationWrapper} ref={notificationRef}>
                    <div className={styles.notification} onClick={handleToggleNotifications}>
                      <IconComponent name={name} size={40} isBtn />
                    </div>
                    {showNotifications && <Notifications onClose={handleCloseNotifications} />}
                  </div>
                )}
              </div>

              {isAuthReady &&
                (isLoggedIn && myData ? (
                  <div className={styles.profileContact} ref={dropdownRef}>
                    <div className={styles.profileSection}>
                      <div className={styles.profileContainer} onClick={handleToggleDropdown}>
                        <ResponsiveImage
                          src={myData.image || "/image/default.svg"}
                          width={28}
                          height={28}
                          alt="프로필 이미지"
                          className={styles.profileImage}
                          style={{ objectFit: "cover" }}
                          desktopSize={300}
                          mobileSize={300}
                        />
                      </div>
                      {isDropdownOpen && (
                        <div className={styles.dropdown}>
                          <Link href={`/${myData.url}`}>
                            <div className={styles.dropdownItem}>
                              <ResponsiveImage
                                src={myData.image ?? "/image/default.svg"}
                                width={32}
                                height={32}
                                alt="프로필 이미지"
                                className={styles.profileImage}
                                style={{ objectFit: "cover" }}
                                desktopSize={300}
                                mobileSize={300}
                              />
                              <span>내 프로필</span>
                            </div>
                          </Link>
                          <div className={styles.divider} />
                          <Link href="/mypage?tab=liked-feeds">
                            <div className={styles.dropdownItem}>좋아요한 그림</div>
                          </Link>
                          <Link href="/mypage?tab=saved-feeds">
                            <div className={styles.dropdownItem}>저장한 그림</div>
                          </Link>
                          <div className={styles.divider} />
                          <Link href="/mypage?tab=saved-posts">
                            <div className={styles.dropdownItem}>저장한 글</div>
                          </Link>
                          <div className={styles.divider} />
                          <div
                            className={`${styles.dropdownItem} ${styles.logout}`}
                            onClick={handleLogout}
                          >
                            로그아웃
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className={styles.loginBtn} onClick={handleLoginNavigation}>
                    <Button size="m" type="filled-primary">
                      로그인
                    </Button>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
      {isMobile && <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />}
    </>
  );
}
