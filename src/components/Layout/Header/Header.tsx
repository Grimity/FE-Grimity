import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import styles from "./Header.module.scss";
import Button from "@/components/Button/Button";
import Link from "next/link";
import IconComponent from "@/components/Asset/Icon";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalState } from "@/states/modalState";
import { authState } from "@/states/authState";
import { useMyData } from "@/api/users/getMe";
import { useRouter } from "next/router";
import { useToast } from "@/hooks/useToast";
import Notifications from "@/components/Notifications/Notifications";
import { isMobileState, isTabletState } from "@/states/isMobileState";
import { useIsMobile } from "@/hooks/useIsMobile";
import { usePreventScroll } from "@/hooks/usePreventScroll";
import Dropdown from "@/components/Dropdown/Dropdown";
import Contact from "./Contact/Contact";
import axiosInstance from "@/constants/baseurl";

export default function Header() {
  const [, setModal] = useRecoilState(modalState);
  const [, setAuth] = useRecoilState(authState);
  const { isLoggedIn } = useRecoilValue(authState);
  const { data: myData } = useMyData();
  const [activeNav, setActiveNav] = useState("홈");
  const activeItemRef = useRef<HTMLDivElement>(null);
  const indicatorRef = useRef<HTMLDivElement>(null);
  const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();
  const isMobile = useRecoilValue(isMobileState);
  const isTablet = useRecoilValue(isTabletState);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const isUserPage = router.pathname.startsWith("/users/[url]");
  const isPostPage = ["/board", "/board/write", "/posts/[id]", "/posts/[id]/edit"].includes(
    router.pathname,
  );
  const isNavPage = ["/", "/popular", "/board", "/following", "/board/write"].includes(
    router.pathname,
  );
  const hideBtn = ["/write", "/feeds/[id]/edit", "/board/write", "/posts/[id]/edit"].includes(
    router.pathname,
  );
  useIsMobile();
  const email = "grimity.official@gmail.com";
  const navItems = [
    { name: "홈", path: "/" },
    { name: "인기그림", path: "/popular" },
    { name: "자유게시판", path: "/board" },
  ];

  if (isLoggedIn) {
    navItems.push({ name: "팔로잉", path: "/following" });
  }

  let name: "bellWhiteActive" | "bellActive" | "bellWhite" | "bell";

  if (myData?.hasNotification && isUserPage) {
    name = "bellWhiteActive";
  } else if (myData?.hasNotification && !isUserPage) {
    name = "bellActive";
  } else if (!myData?.hasNotification && isUserPage) {
    name = "bellWhite";
  } else {
    name = "bell";
  }

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

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast("이메일이 복사되었습니다!", "success");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      showToast("복사에 실패했습니다.", "success");
    }
  };

  const handleNavClick = (item: { name: string; path: string }) => {
    setActiveNav(item.name);
    if (isMobile || isTablet) {
      setIsMenuOpen(false);
    }

    if (router.pathname === item.path) {
      router.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push(item.path);
    }
  };

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
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user_id");
      setAuth({
        access_token: "",
        isLoggedIn: false,
        user_id: "",
      });
      router.push("/");
      window.scrollTo({ top: 0, behavior: "smooth" });
      if (isMobile || isTablet) {
        setIsMenuOpen(false);
      }
    }
  };

  useEffect(() => {
    setIsDropdownOpen(false);
  }, [isLoggedIn]);

  useEffect(() => {
    const currentPath = router.pathname;
    const activeItem = navItems.find(
      (item) =>
        currentPath === item.path || (item.path === "/board" && currentPath.startsWith("/board/")),
    );
    if (activeItem) {
      setActiveNav(activeItem.name);
    }
  }, [router.pathname]);

  useEffect(() => {
    if (isNavPage && activeItemRef.current && indicatorRef.current) {
      const { offsetLeft, offsetWidth } = activeItemRef.current;
      indicatorRef.current.style.transform = `translateX(${offsetLeft}px)`;
      indicatorRef.current.style.width = `${offsetWidth}px`;
    } else if (!isNavPage && indicatorRef.current) {
      indicatorRef.current.style.transform = "none";
      indicatorRef.current.style.width = "0px";
    }
  }, [activeNav]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const targetElement = event.target as HTMLElement;
      const isSettingButton = targetElement.closest('[data-setting-button="true"]');
      if (isSettingButton) {
        return;
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node) &&
        showNotifications
      ) {
        setShowNotifications(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications, showContact]);

  const handleClickLogo = () => {
    if (router.pathname === "/") {
      router.reload();
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      router.push("/");
    }
  };

  const handleSearchBarOpen = () => {
    setIsSearchBarOpen((prev) => !prev);
  };

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  const toggleContact = () => {
    setShowContact((prev) => !prev);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleSubmenu = () => {
    setIsSubMenuOpen((prev) => !prev);
  };

  usePreventScroll(isMenuOpen || (isMobile && showNotifications));

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      const trimmedKeyword = keyword.trim();
      if (trimmedKeyword.length < 2) {
        showToast("두 글자 이상 입력해주세요.", "warning");
        return;
      }
      let tab = "feed";
      if (router.pathname.includes("board")) {
        tab = "board";
      } else if (router.pathname.includes("posts")) {
        tab = "board";
      }
      router.push(`/search?tab=${tab}&keyword=${encodeURIComponent(trimmedKeyword)}`);
      setIsSearchBarOpen(false);
      setKeyword("");
    }
  };

  return (
    <header className={isUserPage ? styles.userPageHeader : styles.header}>
      <div className={styles.container}>
        <div className={styles.leftSection}>
          <div className={styles.cursor} onClick={handleClickLogo}>
            <img
              src={isUserPage ? "/image/logo-white.svg" : "/image/logo.svg"}
              width={100}
              height={29}
              alt="logo"
              loading="lazy"
            />
          </div>
          {!isMobile && !isTablet && (
            <nav className={styles.nav}>
              {navItems.map((item, index) => (
                <div key={index} className={styles.navItem} onClick={() => handleNavClick(item)}>
                  <p
                    className={`${isUserPage ? styles.userPageitem : styles.item} ${
                      isNavPage && (activeNav === item.name ? styles.active : "")
                    }`}
                    ref={item.name === activeNav ? activeItemRef : null}
                  >
                    {item.name}
                  </p>
                </div>
              ))}
              {isNavPage && <div ref={indicatorRef} className={styles.indicator} />}
            </nav>
          )}
        </div>
        <div className={styles.wrapper}>
          {(isMobile || isTablet) && !isLoggedIn && (
            <div
              className={styles.uploadBtn}
              onClick={() => setModal({ isOpen: true, type: "LOGIN" })}
            >
              <Button size="s" type="filled-primary">
                로그인
              </Button>
            </div>
          )}
          <div className={styles.icons}>
            {!isMobile && !isTablet ? (
              isSearchBarOpen ? (
                <div className={styles.searchbarContainer}>
                  <input
                    placeholder="그림, 작가, 관련 작품을 검색해보세요"
                    className={styles.input}
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleSearchKeyDown}
                  />
                  <div onClick={handleSearchBarOpen}>
                    <IconComponent name="searchGray" size={24} padding={8} isBtn />
                  </div>
                </div>
              ) : (
                <div onClick={handleSearchBarOpen}>
                  <IconComponent
                    name={isUserPage ? "searchWhite" : "search"}
                    size={24}
                    padding={8}
                    isBtn
                  />
                </div>
              )
            ) : (
              <Link href="/search">
                <IconComponent
                  name={isUserPage ? "searchWhite" : "search"}
                  size={24}
                  padding={8}
                  isBtn
                />
              </Link>
            )}
            {isLoggedIn && myData && (
              <div className={styles.notificationWrapper} ref={notificationRef}>
                <div className={styles.notification} onClick={toggleNotifications}>
                  <IconComponent name={name} size={40} isBtn />
                </div>
                {showNotifications && <Notifications onClose={() => setShowNotifications(false)} />}
              </div>
            )}
          </div>
          {!isMobile && !isTablet ? (
            isLoggedIn && myData ? (
              <div className={styles.profileContact}>
                <div className={styles.profileSection}>
                  <div
                    className={styles.profileContainer}
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    {myData.image !== "https://image.grimity.com/null" ? (
                      <Image
                        src={myData.image}
                        width={28}
                        height={28}
                        alt="프로필 이미지"
                        className={styles.profileImage}
                        quality={50}
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    ) : (
                      <Image
                        src="/image/default.svg"
                        width={28}
                        height={28}
                        alt="프로필 이미지"
                        className={styles.profileImage}
                        quality={50}
                        style={{ objectFit: "cover" }}
                        unoptimized
                      />
                    )}
                  </div>
                  {isDropdownOpen && (
                    <div className={styles.dropdown} ref={dropdownRef}>
                      <Link href={`/${myData.url}`}>
                        <div
                          className={styles.dropdownItem}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          {myData.image !== "https://image.grimity.com/null" ? (
                            <Image
                              src={myData.image}
                              width={28}
                              height={28}
                              alt="프로필 이미지"
                              className={styles.dropdownProfileImage}
                              quality={50}
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                          ) : (
                            <Image
                              src="/image/default.svg"
                              width={28}
                              height={28}
                              alt="프로필 이미지"
                              className={styles.dropdownProfileImage}
                              quality={50}
                              style={{ objectFit: "cover" }}
                              unoptimized
                            />
                          )}
                          <span>내 프로필</span>
                        </div>
                      </Link>
                      <div className={styles.divider} />
                      <Link href="/mypage?tab=liked-feeds">
                        <div
                          className={styles.dropdownItem}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          좋아요한 그림
                        </div>
                      </Link>
                      <Link href="/mypage?tab=saved-feeds">
                        <div
                          className={styles.dropdownItem}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          저장한 그림
                        </div>
                      </Link>
                      <Link href="/mypage?tab=saved-posts">
                        <div
                          className={styles.dropdownItem}
                          onClick={() => {
                            setIsDropdownOpen(false);
                            window.scrollTo(0, 0);
                          }}
                        >
                          저장한 글
                        </div>
                      </Link>
                      <div className={styles.divider} />
                      <div
                        className={`${styles.dropdownItem} ${styles.logout}`}
                        onClick={() => {
                          handleLogout();
                          setIsDropdownOpen(false);
                        }}
                      >
                        로그아웃
                      </div>
                    </div>
                  )}
                  {!hideBtn &&
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
                </div>
                {!isMobile && !isTablet && (
                  <div className={styles.contactBtn}>
                    <Dropdown
                      isSide
                      trigger={
                        <IconComponent
                          name={isUserPage ? "contactKebabWhite" : "contactKebab"}
                          padding={8}
                          size={24}
                          isBtn
                        />
                      }
                      menuItems={[
                        {
                          label: "문의하기",
                          onClick: () => toggleContact(),
                        },
                      ]}
                    />
                  </div>
                )}
                {showContact && <Contact onClose={() => setShowContact(false)} />}
              </div>
            ) : (
              <div
                className={styles.uploadBtn}
                onClick={() => setModal({ isOpen: true, type: "LOGIN" })}
              >
                <Button size="m" type="filled-primary">
                  로그인
                </Button>
              </div>
            )
          ) : (
            <>
              <div onClick={toggleMenu}>
                <IconComponent
                  name={isUserPage ? "hamburgerWhite" : "hamburger"}
                  size={24}
                  padding={8}
                  isBtn
                />
              </div>
              <div
                className={`${styles.overlay} ${isMenuOpen ? styles.open : ""}`}
                onClick={toggleMenu}
              >
                <div className={`${styles.sideMenu} ${isMenuOpen ? styles.open : ""}`}>
                  <div>
                    <div className={styles.navUpload}>
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleMenu();
                        }}
                        className={styles.closeBtn}
                      >
                        <IconComponent name="x" size={24} padding={8} isBtn />
                      </div>
                      <nav className={styles.nav}>
                        {navItems.map((item, index) => (
                          <div
                            key={index}
                            className={styles.navItem}
                            onClick={() => {
                              handleNavClick(item);
                              toggleMenu();
                            }}
                          >
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
                    {!isLoggedIn || !myData ? (
                      <div
                        className={isMobile ? styles.uploadBtnContainer : styles.uploadBtn}
                        onClick={() => setModal({ isOpen: true, type: "LOGIN" })}
                      >
                        <Button size="l" type="filled-primary">
                          로그인
                        </Button>
                      </div>
                    ) : (
                      <div className={styles.mobileProfile}>
                        <div className={styles.bar} />
                        <div className={styles.profileSubmenu}>
                          <Link href={`/${myData.url}`} className={styles.mobileMyInfo}>
                            {myData.image !== "https://image.grimity.com/null" ? (
                              <Image
                                src={myData.image}
                                width={32}
                                height={32}
                                alt="프로필 이미지"
                                className={styles.profileImage}
                                quality={50}
                                style={{ objectFit: "cover" }}
                                unoptimized
                              />
                            ) : (
                              <Image
                                src="/image/default.svg"
                                width={32}
                                height={32}
                                alt="프로필 이미지"
                                className={styles.profileImage}
                                quality={50}
                                style={{ objectFit: "cover" }}
                                unoptimized
                              />
                            )}
                            <span className={styles.name}>{myData.name}</span>
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
                            <Link href="/mypage?tab=liked-feeds">
                              <button className={styles.itemBtn}>
                                <IconComponent name="menuSave" size={24} isBtn />
                                저장한 컨텐츠
                              </button>
                            </Link>
                            <button className={styles.itemBtn} onClick={handleLogout}>
                              <IconComponent name="menuLogout" size={24} isBtn />
                              로그아웃
                            </button>
                          </div>
                        )}
                        {isLoggedIn &&
                          (isPostPage ? (
                            <Link href="/board/write" className={styles.uploadBtnContainer}>
                              <Button
                                size="l"
                                type="filled-primary"
                                leftIcon={<IconComponent name="menuUpload" size={20} />}
                              >
                                글 쓰기
                              </Button>
                            </Link>
                          ) : (
                            <Link href="/write" className={styles.uploadBtnContainer}>
                              <Button
                                size="l"
                                type="filled-primary"
                                leftIcon={<IconComponent name="menuUpload" size={20} />}
                              >
                                그림 업로드
                              </Button>
                            </Link>
                          ))}
                      </div>
                    )}
                  </div>
                  <section className={styles.footer}>
                    <div className={styles.contact}>
                      <div className={styles.content}>
                        <label className={styles.label}>제휴/광고 문의</label>
                        <button onClick={copyToClipboard} className={styles.link}>
                          메일쓰기
                        </button>
                      </div>
                      <div className={styles.content}>
                        <label className={styles.label}>불편신고/건의</label>
                        <a
                          href="https://open.kakao.com/o/sKYFewgh"
                          target="_blank"
                          rel="noopener noreferrer"
                          className={styles.link}
                        >
                          카카오톡 오픈채팅
                        </a>
                      </div>
                    </div>
                    <div className={styles.bar} />
                    <div className={styles.links}>
                      <a
                        href="https://nostalgic-patch-498.notion.site/1930ac6bf29881b9aa19ff623c69b8e6?pvs=74"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.subLink}
                      >
                        개인정보취급방침
                      </a>
                      <a
                        href="https://nostalgic-patch-498.notion.site/1930ac6bf29881e9a3e4c405e7f49f2b?pvs=73"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.subLink}
                      >
                        이용약관
                      </a>
                    </div>
                  </section>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
