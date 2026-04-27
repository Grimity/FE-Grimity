import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import TextField from "@/components/common/Input/TextField/TextField";
import Avatar from "@/components/common/Avatar/Avatar";
import styles from "./GNB.module.scss";
import type { GNBProps } from "./GNB.types";
import { useRouter } from "next/router";

function LogoArea({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={styles.logoBtn} onClick={onClick} aria-label="홈">
      <img src="/image/logo.svg" width={100} height={29} alt="Grimity" />
    </button>
  );
}

function ProfileArea({ imageUrl, onClick }: { imageUrl?: string; onClick?: () => void }) {
  return (
    <button type="button" className={styles.profileBtn} onClick={onClick} aria-label="프로필">
      <Avatar src={imageUrl} size="xs" />
    </button>
  );
}

function BellButton({ hasNotification, onClick }: { hasNotification?: boolean; onClick?: () => void }) {
  return (
    <IconButton
      variant="sm"
      icon={<Icon name="bell" size={24} color="gray-bold" />}
      badge={hasNotification}
      onClick={onClick}
      aria-label="알림"
    />
  );
}

function SearchButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      variant="sm"
      icon={<Icon name="magnifer" size={24} color="gray-bold" />}
      onClick={onClick}
      aria-label="검색"
    />
  );
}

function BackButton({ onClick }: { onClick?: () => void }) {
  return (
    <IconButton
      variant="sm"
      icon={<Icon name="chevron-left" size={24} color="gray-bold" />}
      onClick={onClick}
      aria-label="뒤로가기"
    />
  );
}

export default function GNB({
  variant,
  title,
  onBack,
  onSearch,
  onBell,
  onProfile,
  onClose,
  onDownload,
  onUpload,
  onLogin,
  onMenu,
  onTitleMenuClick,
  hasNotification = false,
  profileImageUrl,
  searchValue = "",
  searchPlaceholder = "검색어를 입력하세요",
  onSearchChange,
  rightActions = [],
  rightLabel,
  onRightLabelClick,
  dmName,
  dmUsername,
  dmProfileImageUrl,
  onDMReport,
  onDMExit,
  className,
}: GNBProps) {
  const router = useRouter();
  const handleLogoClick = () => router.push("/");

  switch (variant) {
    case "pc-main":
      return (
        <nav className={clsx(styles.gnb, styles.gnbPc, className)}>
          <LogoArea onClick={handleLogoClick} />
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap24)}>
            <SolidButton onClick={onUpload} size="regular">
              그림 올리기
            </SolidButton>
            <div className={clsx(styles.flexRow, styles.gap8)}>
              <SearchButton onClick={onSearch} />
              <BellButton hasNotification={hasNotification} onClick={onBell} />
              <ProfileArea imageUrl={profileImageUrl} onClick={onProfile} />
            </div>
          </div>
        </nav>
      );

    case "pc-guest":
      return (
        <nav className={clsx(styles.gnb, styles.gnbPc, className)}>
          <LogoArea onClick={handleLogoClick} />
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap24)}>
            <SearchButton onClick={onSearch} />
            <SolidButton onClick={onLogin} size="regular">
              회원가입/로그인
            </SolidButton>
          </div>
        </nav>
      );

    case "guest":
      return (
        <nav
          className={clsx(
            styles.gnb,
            styles.gnbTopNav,
            styles.topNavBorderBottom,
            styles.navGap8,
            className,
          )}
        >
          <LogoArea onClick={handleLogoClick} />
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap12)}>
            <OutlinedButton size="small" onClick={onLogin}>
              회원가입
            </OutlinedButton>
            <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
              <SearchButton onClick={onSearch} />
              <IconButton
                variant="sm"
                icon={<Icon name="hamburger" size={24} color="gray-bold" />}
                onClick={onMenu}
                aria-label="메뉴"
              />
            </div>
          </div>
        </nav>
      );

    case "guest-menu":
      return (
        <nav
          className={clsx(
            styles.gnb,
            styles.gnbTopNav,
            styles.topNavBorderBottom,
            styles.navGap8,
            className,
          )}
        >
          <LogoArea onClick={handleLogoClick} />
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap12)}>
            <OutlinedButton size="small" onClick={onLogin}>
              회원가입
            </OutlinedButton>
            <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
              <SearchButton onClick={onSearch} />
              <IconButton
                variant="sm"
                icon={<Icon name="x" size={24} color="gray-bold" />}
                onClick={onClose}
                aria-label="닫기"
              />
            </div>
          </div>
        </nav>
      );

    case "main":
      return (
        <nav
          className={clsx(
            styles.gnb,
            styles.gnbTopNav,
            styles.topNavBorderBottom,
            styles.navGap8,
            className,
          )}
        >
          <LogoArea onClick={handleLogoClick} />
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap16)}>
            <SearchButton onClick={onSearch} />
            <BellButton hasNotification={hasNotification} onClick={onBell} />
            <ProfileArea imageUrl={profileImageUrl} onClick={onProfile} />
          </div>
        </nav>
      );

    case "depth-2":
      return (
        <nav
          className={clsx(
            styles.gnb,
            styles.gnbTopNav,
            styles.topNavBorderBottom,
            styles.navGap8,
            className,
          )}
        >
          <div className={clsx(styles.flexRow, styles.gap8)}>
            <BackButton onClick={onBack} />
            <span className={styles.title}>{title}</span>
          </div>
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
            <SearchButton onClick={onSearch} />
            <BellButton hasNotification={hasNotification} onClick={onBell} />
            <ProfileArea imageUrl={profileImageUrl} onClick={onProfile} />
          </div>
        </nav>
      );

    case "three-button":
      return (
        <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.navGap8, className)}>
          <div className={clsx(styles.flexRow, styles.gap8)}>
            <BackButton onClick={onBack} />
            <span className={styles.title}>{title}</span>
          </div>
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
            {rightActions}
          </div>
        </nav>
      );

    case "search":
      return (
        <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.navGap8, className)}>
          <BackButton onClick={onBack} />
          <TextField
            variant="search"
            className={styles.searchInput}
            value={searchValue}
            onChange={(e) => onSearchChange?.(e.target.value)}
            placeholder={searchPlaceholder}
          />
        </nav>
      );

    case "text-button":
      return (
        <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.topNavRowBetween, className)}>
          <div className={styles.leftCluster}>
            <BackButton onClick={onBack} />
            <span className={styles.title}>{title}</span>
          </div>
          <TextButton
            variant="primary"
            size="regular"
            onClick={onRightLabelClick}
            className={styles.trailingText}
          >
            {rightLabel}
          </TextButton>
        </nav>
      );

    case "editor":
      return (
        <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.topNavRowBetween, className)}>
          <div className={styles.leftCluster}>
            <BackButton onClick={onBack} />
            <div className={styles.editorTitleRow}>
              <span className={styles.title}>{title}</span>
              <IconButton
                variant="sm"
                icon={<Icon name="chevron-down" size={24} color="gray-bold" />}
                onClick={onTitleMenuClick}
                aria-label="메뉴 열기"
              />
            </div>
          </div>
          <TextButton
            variant="primary"
            size="regular"
            onClick={onRightLabelClick}
            className={styles.trailingText}
          >
            {rightLabel}
          </TextButton>
        </nav>
      );

    case "dm":
      return (
        <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.navGap8, className)}>
          <BackButton onClick={onBack} />
          <div className={styles.dmInfo}>
            <Avatar src={dmProfileImageUrl} size="md" />
            <div className={styles.dmText}>
              <span className={styles.dmName}>{dmName}</span>
              <span className={styles.dmUsername}>{dmUsername}</span>
            </div>
          </div>
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
            <IconButton
              variant="sm"
              icon={<Icon name="siren-rounded" size={24} color="gray-bold" />}
              onClick={onDMReport}
              aria-label="신고하기"
            />
            <IconButton
              variant="sm"
              icon={<Icon name="out" size={24} color="gray-bold" />}
              onClick={onDMExit}
              aria-label="나가기"
            />
          </div>
        </nav>
      );

    case "image-viewer":
      return (
        <nav className={clsx(styles.gnb, styles.gnbTopNav, className)}>
          <IconButton
            variant="sm"
            icon={<Icon name="x" size={24} color="gray-bold" />}
            onClick={onClose}
            aria-label="닫기"
          />
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
            <IconButton
              variant="sm"
              icon={<Icon name="down" size={24} color="gray-bold" />}
              onClick={onDownload}
              aria-label="다운로드"
            />
          </div>
        </nav>
      );

    default:
      return null;
  }
}
