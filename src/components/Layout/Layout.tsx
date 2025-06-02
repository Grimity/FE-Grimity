import { useEffect, useState } from "react";

import { useDeviceStore } from "@/states/deviceStore";

import IconComponent from "@/components/Asset/Icon";
import Header from "@/components/Layout/Header/Header";
import Sidebar from "@/components/Layout/Sidebar/Sidebar";

import { useIsMobile } from "@/hooks/useIsMobile";

import { LayoutProps } from "@/components/Layout/Layout.types";

import styles from "@/components/Layout/Layout.module.scss";

export default function Layout({ children }: LayoutProps) {
  const [isScrollAbove, setIsScrollAbove] = useState(false);
  const isMobile = useDeviceStore((state) => state.isMobile);
  const isTablet = useDeviceStore((state) => state.isTablet);
  useIsMobile();

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

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className={styles.layout}>
      <Header />
      <Sidebar />
      <div className={styles.children}>
        {children}
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
    </div>
  );
}
