import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { FOOTER_ITEMS } from "@/constants/footer";

import SidebarFooterItem, {
  FooterIconName,
} from "@/components/Layout/Sidebar/SidebarFooterItem/SidebarFooterItem";

import { useToast } from "@/hooks/useToast";

import styles from "@/components/Layout/FooterSection/FooterSection.module.scss";

interface FooterSectionProps {
  onClose?: () => void;
}

function FooterSection({ onClose }: FooterSectionProps) {
  const [isAskDropdownOpen, setIsAskDropdownOpen] = useState(false);
  const [isGuideDropdownOpen, setIsGuideDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const guideDropdownRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();
  const router = useRouter();
  const email = "grimity.official@gmail.com";

  const handleFooterClick = (itemLabel: string, route?: string) => {
    if (itemLabel === "안내") {
      setIsGuideDropdownOpen(!isGuideDropdownOpen);
      setIsAskDropdownOpen(false);
    } else if (route) {
      onClose?.();
      window.location.href = route;
    } else if (itemLabel === "문의") {
      setIsAskDropdownOpen(!isAskDropdownOpen);
      setIsGuideDropdownOpen(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(email);
      showToast("이메일이 복사되었습니다!", "success");
    } catch (error) {
      console.error("클립보드 복사 실패:", error);
      showToast("복사에 실패했습니다.", "success");
    }
  };

  useEffect(() => {
    const closeDropdowns = () => {
      setIsAskDropdownOpen(false);
      setIsGuideDropdownOpen(false);
    };
    router.events.on("routeChangeComplete", closeDropdowns);
    return () => router.events.off("routeChangeComplete", closeDropdowns);
  }, [router.events]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsAskDropdownOpen(false);
      }
      if (
        guideDropdownRef.current &&
        !guideDropdownRef.current.contains(event.target as Node)
      ) {
        setIsGuideDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.footer}>
      <div className={styles.footerItems}>
        {FOOTER_ITEMS.map((item, index) => {
          const wrapperClass =
            item.label === "안내"
              ? styles.guideItem
              : item.label === "공지사항"
                ? styles.noticeItem
                : undefined;

          const footerItem = (
            <SidebarFooterItem
              key={index}
              icon={item.icon as FooterIconName}
              label={item.label}
              onClickItem={() => handleFooterClick(item.label, item.route)}
              isHaveDropdown={item.isHaveDropdown}
              isDropdownOpen={
                item.label === "문의"
                  ? isAskDropdownOpen
                  : item.label === "안내"
                    ? isGuideDropdownOpen
                    : false
              }
            />
          );

          return wrapperClass ? (
            <div key={index} className={wrapperClass}>
              {footerItem}
            </div>
          ) : (
            footerItem
          );
        })}
      </div>
      {isAskDropdownOpen && (
        <div className={styles.dropdown} ref={dropdownRef}>
          <Link
            href="https://open.kakao.com/o/sKYFewgh"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.dropdownItem}
            onClick={onClose}
          >
            카카오톡으로 문의하기
          </Link>
          <button
            onClick={() => {
              copyToClipboard();
              onClose?.();
            }}
            className={styles.dropdownItem}
          >
            메일로 보내기
          </button>
        </div>
      )}
      {isGuideDropdownOpen && (
        <div className={styles.guideDropdown} ref={guideDropdownRef}>
          <Link
            href="/posts/048ae290-4b1e-4292-9845-e4b2ca68ea6a"
            className={styles.dropdownItem}
            onClick={onClose}
          >
            공지
          </Link>
          <Link
            href="https://term.grimity.com/term"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.dropdownItem}
            onClick={onClose}
          >
            이용약관
          </Link>
          <Link
            href="https://term.grimity.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.dropdownItem}
            onClick={onClose}
          >
            개인정보취급방침
          </Link>
          <Link
            href="/business-info"
            className={styles.dropdownItem}
            onClick={onClose}
          >
            사업자 정보
          </Link>
        </div>
      )}
      <div className={styles.subLinkWrapper}>
        <div className={styles.subLink}>
          <Link
            className={styles.link}
            href="https://term.grimity.com/term"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            이용약관
          </Link>
          <Link
            className={styles.link}
            href="https://term.grimity.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
          >
            개인정보취급방침
          </Link>
        </div>
        <Link className={styles.link} href="/business-info" onClick={onClose}>
          사업자 정보
        </Link>
        <p>© Grimity. All rights reserved.</p>
      </div>
    </div>
  );
}

export default FooterSection;
