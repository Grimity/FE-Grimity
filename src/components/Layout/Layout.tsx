import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import { useMyData } from "@/api/users/getMe";

import { useDeviceStore } from "@/states/deviceStore";
import { useAuthStore } from "@/states/authStore";

import IconComponent from "@/components/Asset/Icon";
import Header from "@/components/Layout/Header/Header";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";

import { useIsMobile } from "@/hooks/useIsMobile";

import type { HeaderProps } from "@/components/Layout/Header/types/Header.types";
import type { LayoutProps } from "@/components/Layout/Layout.types";

import styles from "@/components/Layout/Layout.module.scss";

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();

  const [isScrollAbove, setIsScrollAbove] = useState(false);

  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  useIsMobile();

  const { setIsLoggedIn, setAccessToken, setUserId, setIsAuthReady } = useAuthStore();
  const { refetch: fetchMyData } = useMyData();

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
