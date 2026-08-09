import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import Icon from "@/components/common/Icon/Icon";
import ResponsiveMenu from "@/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu";

import styles from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions.module.scss";

interface ProfileActionsProps {
  isMyProfile: boolean;
  isFollowing: boolean;
  isBlocked: boolean;
  isBlocking: boolean;
  handleOpenEditModal: () => void;
  handleOpenAccountSettings: () => void;
  handleUnfollowClick: () => void;
  handleFollowClick: () => void;
  handleShareProfile: () => void;
  handleOpenReportModal: () => void;
  handleBlockClick: () => void;
  handleUnblockClick: () => void;
  handleOpenBlocklistModal: () => void;
  handleSendMessage: () => void;
}

export default function ProfileActions({
  isMyProfile,
  isFollowing,
  isBlocked,
  isBlocking,
  handleOpenEditModal,
  handleOpenAccountSettings,
  handleUnfollowClick,
  handleFollowClick,
  handleShareProfile,
  handleOpenReportModal,
  handleBlockClick,
  handleUnblockClick,
  handleOpenBlocklistModal,
  handleSendMessage,
}: ProfileActionsProps) {
  const moreTrigger = (
    <OutlinedButton size="regular" iconOnly={<Icon name="dotmenu" size={20} />} aria-label="더보기" />
  );

  const shareMenuItem = { label: "프로필 링크 공유", onClick: handleShareProfile };
  const messageMenuItem = { label: "메시지 보내기", onClick: handleSendMessage };
  const reportMenuItem = { label: "신고하기", onClick: handleOpenReportModal };
  const blockMenuItem = {
    label: isBlocking ? "차단해제" : "차단하기",
    onClick: isBlocking ? handleUnblockClick : handleBlockClick,
  };

  if (isMyProfile) {
    return (
      <div className={styles.actions}>
        <OutlinedButton size="regular" onClick={handleOpenEditModal}>
          프로필 편집
        </OutlinedButton>
        <ResponsiveMenu
          trigger={moreTrigger}
          mobileTitle="더보기"
          items={[
            { label: "내 계정 설정", onClick: handleOpenAccountSettings },
            { label: "차단 목록", onClick: handleOpenBlocklistModal },
          ]}
        />
      </div>
    );
  }

  if (isBlocked) {
    return (
      <div className={styles.actions}>
        <ResponsiveMenu
          trigger={moreTrigger}
          mobileTitle="더보기"
          items={[shareMenuItem, reportMenuItem]}
        />
      </div>
    );
  }

  if (isBlocking) {
    return (
      <div className={styles.actions}>
        <ResponsiveMenu
          trigger={moreTrigger}
          mobileTitle="더보기"
          items={[shareMenuItem, blockMenuItem, reportMenuItem]}
        />
      </div>
    );
  }

  return (
    <div className={styles.actions}>
      {isFollowing ? (
        <OutlinedButton size="regular" onClick={handleUnfollowClick}>
          팔로잉 중
        </OutlinedButton>
      ) : (
        <SolidButton size="regular" onClick={handleFollowClick}>
          팔로우
        </SolidButton>
      )}
      <ResponsiveMenu
        trigger={moreTrigger}
        mobileTitle="더보기"
        items={[shareMenuItem, messageMenuItem, blockMenuItem, reportMenuItem]}
      />
    </div>
  );
}
