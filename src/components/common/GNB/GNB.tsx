import clsx from "clsx";
import Icon from "@/components/common/Icon/Icon";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import TextField from "@/components/common/Input/TextField/TextField";
import Avatar from "@/components/common/Avatar/Avatar";
import styles from "./GNB.module.scss";
import { GNBProps } from "./GNB.types";

export default function GNB({
  variant,
  title,
  onLogoClick,
  onBack,
  onSearch,
  onBell,
  onProfile,
  onClose,
  onDownload,
  onUpload,
  onLogin,
  onMenu,
  hasNotification = false,
  profileImageUrl,
  searchValue = "",
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
  const LogoArea = () => (
    <button
      type="button"
      className={styles.logoBtn}
      onClick={onLogoClick}
      aria-label="홈"
    >
      <img src="/image/logo.svg" width={100} height={29} alt="Grimity" />
    </button>
  );

  const ProfileArea = ({ imageUrl }: { imageUrl?: string }) => (
    <button
      type="button"
      className={styles.profileBtn}
      onClick={onProfile}
      aria-label="프로필"
    >
      <Avatar src={imageUrl} size="xs" />
    </button>
  );

  const BellButton = () => (
    <IconButton
      icon={<Icon name="bell" size={24} color="gray-bold" />}
      badge={hasNotification}
      onClick={onBell}
      aria-label="알림"
    />
  );

  const SearchButton = () => (
    <IconButton
      icon={<Icon name="magnifer" size={24} color="gray-bold" />}
      onClick={onSearch}
      aria-label="검색"
    />
  );

  const BackButton = () => (
    <IconButton
      icon={<Icon name="chevron-left" size={24} color="gray-bold" />}
      onClick={onBack}
      aria-label="뒤로가기"
    />
  );

  if (variant === "main-desktop") {
    return (
      <nav className={clsx(styles.gnb, styles.desktop, className)}>
        <LogoArea />
        <div className={styles.actions}>
          <SolidButton onClick={onUpload}>그림 올리기</SolidButton>
          <SearchButton />
          <BellButton />
          <ProfileArea imageUrl={profileImageUrl} />
        </div>
      </nav>
    );
  }

  if (variant === "guest-desktop") {
    return (
      <nav className={clsx(styles.gnb, styles.desktop, className)}>
        <LogoArea />
        <div className={styles.actions}>
          <SearchButton />
          <SolidButton onClick={onLogin}>회원가입/로그인</SolidButton>
        </div>
      </nav>
    );
  }

  if (variant === "guest") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <LogoArea />
        <div className={styles.actions}>
          <OutlinedButton size="small" onClick={onLogin}>
            회원가입
          </OutlinedButton>
          <SearchButton />
          <IconButton
            icon={<Icon name="hamburger" size={24} color="gray-bold" />}
            onClick={onMenu}
            aria-label="메뉴"
          />
        </div>
      </nav>
    );
  }

  if (variant === "guest-menu") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <LogoArea />
        <div className={styles.actions}>
          <OutlinedButton size="small" onClick={onLogin}>
            회원가입
          </OutlinedButton>
          <SearchButton />
          <IconButton
            icon={<Icon name="x" size={24} />}
            onClick={onClose}
            aria-label="닫기"
          />
        </div>
      </nav>
    );
  }

  if (variant === "main") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <LogoArea />
        <div className={styles.actions}>
          <SearchButton />
          <BellButton />
          <ProfileArea imageUrl={profileImageUrl} />
        </div>
      </nav>
    );
  }

  if (variant === "2dep") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <div className={styles.backTitleContainer}>
          <BackButton />
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.actions}>
          <SearchButton />
          <BellButton />
          <ProfileArea imageUrl={profileImageUrl} />
        </div>
      </nav>
    );
  }

  if (variant === "3button") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <div className={styles.backTitleContainer}>
          <BackButton />
          <span className={styles.title}>{title}</span>
        </div>
        <div className={styles.actions}>
          {rightActions.slice(0, 3)}
        </div>
      </nav>
    );
  }

  if (variant === "search") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <BackButton />
        <TextField
          variant="search"
          className={styles.searchInput}
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          placeholder="검색어를 입력하세요"
        />
      </nav>
    );
  }

  if (variant === "text-button") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <BackButton />
        <span className={styles.title}>{title}</span>
        <TextButton onClick={onRightLabelClick}>{rightLabel}</TextButton>
      </nav>
    );
  }

  if (variant === "dm") {
    return (
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <BackButton />
        <div className={styles.dmInfo}>
          <Avatar src={dmProfileImageUrl} size="md" />
          <div className={styles.dmText}>
            <span className={styles.dmName}>{dmName}</span>
            <span className={styles.dmUsername}>{dmUsername}</span>
          </div>
        </div>
        <div className={styles.actions}>
          <IconButton
            icon={<Icon name="siren-rounded" size={24} color="gray-bold" />}
            onClick={onDMReport}
            aria-label="신고하기"
          />
          <IconButton
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
      <nav className={clsx(styles.gnb, styles.mobile, className)}>
        <IconButton
          icon={<Icon name="x" size={24} color="gray-bold" />}
          onClick={onClose}
          aria-label="닫기"
        />
        <div className={styles.actions}>
          <IconButton
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
