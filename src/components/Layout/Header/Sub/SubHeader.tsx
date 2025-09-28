import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import { useDeviceStore } from "@/states/deviceStore";

import IconComponent from "@/components/Asset/Icon";
import SideMenu from "@/components/Layout/SideMenu/SideMenu";
import Icon from "@/components/Asset/IconTemp";

import styles from "./SubHeader.module.scss";

const SubHeader = () => {
  const router = useRouter();
  const { isMobile } = useDeviceStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const showSearchIcon = !["/search", "/feeds/[id]", "/posts/[id]", "/direct"].includes(
    router.pathname,
  );

  return (
    <>
      <div className={styles.container}>
        <button onClick={handleBack} className={styles.backButton}>
          <Icon icon="chevronLeft" size="2xl" />
        </button>
        <div className={styles.icons}>
          {showSearchIcon && (
            <Link href="/search">
              <IconComponent name="search" size={24} padding={8} isBtn />
            </Link>
          )}
          {isMobile && (
            <div onClick={toggleMenu}>
              <IconComponent name="hamburger" size={24} padding={8} isBtn />
            </div>
          )}
        </div>
      </div>
      {isMobile && <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />}
    </>
  );
};

export default SubHeader;
