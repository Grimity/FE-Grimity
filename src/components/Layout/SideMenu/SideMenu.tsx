import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";

import { useMyData } from "@/api/users/getMe";

import { useAuthStore } from "@/states/authStore";
import { useChatStore } from "@/states/chatStore";

import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import FooterSection from "@/components/Layout/FooterSection/FooterSection";
import Login from "@/components/Modal/Login/Login";
import Icon from "@/components/Asset/IconTemp";

import { useModal } from "@/hooks/useModal";

import axiosInstance from "@/constants/baseurl";

import styles from "./SideMenu.module.scss";

interface SideMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const SideMenu = ({ isOpen, onClose }: SideMenuProps) => {
  const router = useRouter();
  const { data: myData } = useMyData();
  const { openModal } = useModal();

  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState("홈");

  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setIsLoggedIn = useAuthStore((state) => state.setIsLoggedIn);
  const setUserId = useAuthStore((state) => state.setUserId);
  const { hasUnreadMessages } = useChatStore();

  const isNavPage = ["/", "/ranking", "/board", "/following"].includes(router.pathname);

  const navItems = [
    { name: "홈", path: "/" },
    { name: "랭킹", path: "/ranking" },
    { name: "자유게시판", path: "/board" },
  ];

  if (isLoggedIn) {
    navItems.push({ name: "팔로잉", path: "/following" });
  }

  const handleNavClick = (item: { name: string; path: string }) => {
    setActiveNav(item.name);
    if (router.pathname === item.path) {
      router.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(item.path);
    }
    onClose();
  };

  const handleLogout = async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (refreshToken) {
        await axiosInstance.post(
          "/auth/logout",
          {},
          { headers: { Authorization: `Bearer ${refreshToken}`, "exclude-access-token": true } },
        );
      }
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.clear();
      setIsLoggedIn(false);
      setAccessToken("");
      setUserId("");
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      onClose();
    }
  };

  const toggleSubmenu = () => {
    setIsSubMenuOpen((prev) => !prev);
  };

  const handleOpenLoginModal = () => {
    openModal((close) => <Login close={close} />);
  };

  useEffect(() => {
    const currentPath = router.pathname;
    const activeItem = navItems.find(
      (item) =>
        currentPath === item.path ||
        (item.path === "/board" && currentPath.startsWith("/posts/")) ||
        (item.path === "/direct" && currentPath.startsWith("/direct")),
    );
    if (activeItem) {
      setActiveNav(activeItem.name);
    }
  }, [router.pathname, navItems]);

  return (
    <div
      className={`${styles.overlay} ${isOpen ? styles.open : ""}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`${styles.sideMenu} ${isOpen ? styles.open : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.menuContentWrapper}>
          <div className={styles.navUpload}>
            <div
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={styles.closeBtn}
            >
              <IconComponent name="x" size={24} isBtn />
            </div>
          </div>
          {!isLoggedIn || !myData ? (
            <>
              <div className={styles.loginBtn} onClick={handleOpenLoginModal}>
                <Button size="m" type="filled-primary" width="200px">
                  로그인
                </Button>
              </div>
              <nav className={styles.nav}>
                {navItems.map((item, index) => (
                  <div key={index} className={styles.navItem} onClick={() => handleNavClick(item)}>
                    <p
                      className={`${styles.item} ${
                        isNavPage && (activeNav === item.name ? styles.active : "")
                      }`}
                    >
                      {item.name}
                    </p>
                  </div>
                ))}
              </nav>
            </>
          ) : (
            <div className={styles.mobileProfile}>
              <div
                className={`${styles.profileSubmenu} ${
                  isSubMenuOpen ? styles.profileSubmenuOpen : ""
                }`}
              >
                <Link href={`/${myData?.url}`} className={styles.mobileMyInfo} onClick={onClose}>
                  <Image
                    src={myData?.image || "/image/default.svg"}
                    width={32}
                    height={32}
                    alt="프로필 이미지"
                    className={styles.profileImage}
                    quality={50}
                    style={{ objectFit: "cover" }}
                    unoptimized
                  />
                  <span className={styles.name}>{myData?.name}</span>
                </Link>
                <div
                  className={styles.submenu}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSubmenu();
                  }}
                >
                  <IconComponent name={isSubMenuOpen ? "menuUp" : "menuDown"} size={20} />
                </div>
              </div>
              {isSubMenuOpen && (
                <div className={styles.btns}>
                  <Link href="/mypage?tab=liked-feeds" onClick={onClose}>
                    <button className={styles.itemBtn}>
                      <IconComponent name="menuSave" size={18} isBtn />
                      저장한 컨텐츠
                    </button>
                  </Link>
                  <button className={styles.itemBtn} onClick={handleLogout}>
                    <IconComponent name="menuLogout" size={18} isBtn />
                    로그아웃
                  </button>
                </div>
              )}
              <div className={styles.uploadFeedBtn}>
                <Link href="/direct" onClick={onClose}>
                  <Button
                    className={hasUnreadMessages ? styles.badge : ""}
                    type="outlined-assistive"
                    size="m"
                    width="40px"
                    leftIcon={<Icon icon="direct" size="lg" />}
                  />
                </Link>
                <Link href="/write" onClick={onClose}>
                  <Button
                    size="m"
                    width="154px"
                    type="filled-primary"
                    leftIcon={<IconComponent name="menuUpload" size={16} isBtn />}
                  >
                    그림 업로드
                  </Button>
                </Link>
              </div>

              <div className={styles.bar} />
              <nav className={styles.nav}>
                {navItems.map((item, index) => (
                  <div key={index} className={styles.navItem} onClick={() => handleNavClick(item)}>
                    <p
                      className={`${styles.item} ${
                        isNavPage && (activeNav === item.name ? styles.active : "")
                      }`}
                    >
                      {item.name}
                    </p>
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>

        <div className={styles.mobileFooterWrap}>
          <FooterSection onClose={onClose} />
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
