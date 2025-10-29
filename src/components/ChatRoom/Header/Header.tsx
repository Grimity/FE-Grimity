import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

import Icon from "@/components/Asset/IconTemp";
import IconComponent from "@/components/Asset/Icon";
import ChatLeave from "@/components/Modal/ChatLeave/ChatLeave";
import SideMenu from "@/components/Layout/SideMenu/SideMenu";

import { useModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";

import { useModal } from "@/hooks/useModal";
import useGoBack from "@/hooks/useGoBack";

import type { UserBaseResponse } from "@grimity/dto";

import styles from "./Header.module.scss";

interface ChatRoomHeaderProps {
  chatId: string;
  data: UserBaseResponse | undefined;
}

const ChatRoomHeader = ({ chatId, data }: ChatRoomHeaderProps) => {
  const router = useRouter();
  const { openModal } = useModal();
  const { openModal: openModalStore } = useModalStore();
  const { isMobile } = useDeviceStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { goBack } = useGoBack();

  const handleShowLeaveModal = () => {
    openModal(
      (close) => (
        <ChatLeave selectedChatIds={[chatId]} close={close} onSuccess={() => router.back()} />
      ),
      {
        props: { className: styles.leaveModal },
      },
    );
  };

  const handleOpenReportModal = () => {
    openModalStore({
      type: "REPORT",
      data: { refType: "CHAT", refId: data?.id },
      isFill: isMobile,
    });
    setIsDropdownOpen(false);
  };

  const handleBack = () => {
    goBack();
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  const handleShowLeaveModalFromDropdown = () => {
    handleShowLeaveModal();
    setIsDropdownOpen(false);
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isDropdownOpen]);

  return (
    <>
      <header className={styles.header}>
        <div className={styles.desktopLayout}>
          <Link href={`/${data?.url}`}>
            <div className={styles.userInfo}>
              <div className={styles.avatar}>
                <img
                  src={data?.image || "/image/default.svg"}
                  alt="프로필 이미지"
                  width={40}
                  height={40}
                />
              </div>
              <div>
                <p className={styles.username}>{data?.name}</p>
                <p className={styles.hashtag}>@{data?.url}</p>
              </div>
            </div>
          </Link>

          <div className={styles.headerButtons}>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="유저 신고"
              onClick={handleOpenReportModal}
            >
              <Icon icon="complaint" size="xl" />
            </button>
            <button
              type="button"
              className={styles.iconButton}
              aria-label="채팅방 나가기"
              onClick={handleShowLeaveModal}
            >
              <Icon icon="exit" size="xl" />
            </button>
          </div>
        </div>

        <div className={styles.mobileLayout}>
          <div className={styles.mobileLeft}>
            <button onClick={handleBack} className={styles.backButton}>
              <Icon icon="chevronLeft" size="2xl" />
            </button>

            <Link href={`/${data?.url}`}>
              <div className={styles.userInfo}>
                <div className={styles.avatar}>
                  <img
                    src={data?.image || "/image/default.svg"}
                    alt="프로필 이미지"
                    width={30}
                    height={30}
                  />
                </div>
                <div>
                  <p className={styles.username}>{data?.name}</p>
                </div>
              </div>
            </Link>
          </div>

          <div className={styles.headerButtons}>
            <div className={styles.dropdownContainer} ref={dropdownRef}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="메뉴"
                onClick={toggleDropdown}
              >
                <Icon icon="more" size="xl" />
              </button>
              {isDropdownOpen && (
                <div className={styles.dropdownMenu}>
                  <button onClick={handleOpenReportModal} className={styles.dropdownItem}>
                    신고하기
                  </button>
                  <button
                    onClick={handleShowLeaveModalFromDropdown}
                    className={`${styles.dropdownItem} ${styles.leave}`}
                  >
                    채팅방 나가기
                  </button>
                </div>
              )}
            </div>
            {isMobile && (
              <div onClick={toggleMenu}>
                <IconComponent name="hamburger" size={24} padding={8} isBtn />
              </div>
            )}
          </div>
        </div>
      </header>
      {isMobile && <SideMenu isOpen={isMenuOpen} onClose={toggleMenu} />}
    </>
  );
};

export default ChatRoomHeader;
