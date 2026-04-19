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

  const LogoArea = () => (
    <button
      type="button"
      className={styles.logoBtn}
      onClick={() => router.push("/")}
      aria-label="홈"
    >
      <img src="/image/logo.svg" width={100} height={29} alt="Grimity" />
    </button>
  );

  const ProfileArea = ({ imageUrl }: { imageUrl?: string }) => (
    <button type="button" className={styles.profileBtn} onClick={onProfile} aria-label="프로필">
      <Avatar src={imageUrl} size="xs" />
    </button>
  );

  const BellButton = () => (
    <IconButton
      variant="sm"
      icon={<Icon name="bell" size={24} color="gray-bold" />}
      badge={hasNotification}
      onClick={onBell}
      aria-label="알림"
    />
  );

  const SearchButton = () => (
    <IconButton
      variant="sm"
      icon={<Icon name="magnifer" size={24} color="gray-bold" />}
      onClick={onSearch}
      aria-label="검색"
    />
  );

  const BackButton = () => (
    <IconButton
      variant="sm"
      icon={<Icon name="chevron-left" size={24} color="gray-bold" />}
      onClick={onBack}
      aria-label="뒤로가기"
    />
  );

  if (variant === "pc-main") {
    return (
      <nav className={clsx(styles.gnb, styles.gnbPc, className)}>
        <LogoArea />
        <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap24)}>
          <SolidButton onClick={onUpload} size="regular">
            그림 올리기
          </SolidButton>
          <div className={clsx(styles.flexRow, styles.gap8)}>
            <SearchButton />
            <BellButton />
            <ProfileArea imageUrl={profileImageUrl} />
          </div>
        </div>
      </nav>
    );
  }

  if (variant === "pc-guest") {
    return (
      <nav className={clsx(styles.gnb, styles.gnbPc, className)}>
        <LogoArea />
        <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap24)}>
          <SearchButton />
          <SolidButton onClick={onLogin} size="regular">
            회원가입/로그인
          </SolidButton>
        </div>
      </nav>
    );
  }

  if (variant === "guest") {
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
        <LogoArea />
        <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap12)}>
          <OutlinedButton size="small" onClick={onLogin}>
            회원가입
          </OutlinedButton>
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
            <SearchButton />
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
  }

  if (variant === "guest-menu") {
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
        <LogoArea />
        <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap12)}>
          <OutlinedButton size="small" onClick={onLogin}>
            회원가입
          </OutlinedButton>
          <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
            <SearchButton />
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
  }

  if (variant === "main") {
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
        <LogoArea />
        <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap16)}>
          <SearchButton />
          <BellButton />
          <ProfileArea imageUrl={profileImageUrl} />
        </div>
      </nav>
    );
  }

  if (variant === "2dep") {
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
          <BackButton />
          <span className={styles.title}>{title}</span>
        </div>
        <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
          <SearchButton />
          <BellButton />
          <ProfileArea imageUrl={profileImageUrl} />
        </div>
      </nav>
    );
  }

  if (variant === "3button") {
    return (
      <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.navGap8, className)}>
        <div className={clsx(styles.flexRow, styles.gap8)}>
          <BackButton />
          <span className={styles.title}>{title}</span>
        </div>
        <div className={clsx(styles.flexRow, styles.flexPushEnd, styles.gap8)}>
          {rightActions.slice(0, 3)}
        </div>
      </nav>
    );
  }

  if (variant === "search") {
    return (
      <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.navGap8, className)}>
        <BackButton />
        <TextField
          variant="search"
          className={styles.searchInput}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
        />
      </nav>
    );
  }

  if (variant === "text-button") {
    return (
      <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.topNavRowBetween, className)}>
        <div className={styles.leftCluster}>
          <BackButton />
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
  }

  if (variant === "editor") {
    return (
      <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.topNavRowBetween, className)}>
        <div className={styles.leftCluster}>
          <BackButton />
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
  }

  if (variant === "dm") {
    return (
      <nav className={clsx(styles.gnb, styles.gnbTopNav, styles.navGap8, className)}>
        <BackButton />
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
  }

  if (variant === "image-viewer") {
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
  }

  return null;
}
