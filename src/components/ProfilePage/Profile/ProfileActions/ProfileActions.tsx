import type { UserProfileResponse } from "@grimity/dto";

import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import SolidButton from "@/components/common/Button/SolidButton/SolidButton";
import Icon from "@/components/common/Icon/Icon";
import ResponsiveMenu from "@/components/ProfilePage/shared/ResponsiveMenu/ResponsiveMenu";

import { useDeviceStore } from "@/states/deviceStore";

import { useProfileActions } from "./hooks/useProfileActions";

import styles from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions.module.scss";

interface ProfileActionsProps {
  /** 팔로우 API에 사용하는 유저 id */
  userId: string;
  userData: UserProfileResponse;
  isMyProfile: boolean;
  refetchUserData: () => void;
}

export default function ProfileActions({
  userId,
  userData,
  isMyProfile,
  refetchUserData,
}: ProfileActionsProps) {
  const { isFollowing, isBlocked, isBlocking } = userData;
  const { isMobile } = useDeviceStore();
  const buttonSize = isMobile ? "small" : "regular";

  const {
    follow,
    unfollow,
    openEditModal,
    openAccountSettings,
    shareProfileLink,
    openReport,
    block,
    unblock,
    openBlocklist,
    sendMessage,
  } = useProfileActions({ userId, userData, refetchUserData });

  const moreTrigger = (
    <OutlinedButton
      size={buttonSize}
      iconOnly={<Icon name="dotmenu" size={isMobile ? 16 : 20} />}
      aria-label="더보기"
    />
  );

  const shareMenuItem = { label: "프로필 링크 공유", onClick: shareProfileLink };
  const messageMenuItem = { label: "메시지 보내기", onClick: sendMessage };
  const reportMenuItem = { label: "신고하기", onClick: openReport };
  const blockMenuItem = {
    label: isBlocking ? "차단해제" : "차단하기",
    onClick: isBlocking ? unblock : block,
  };

  if (isMyProfile) {
    return (
      <div className={styles.actions}>
        <OutlinedButton size={buttonSize} onClick={openEditModal}>
          프로필 편집
        </OutlinedButton>
        <ResponsiveMenu
          trigger={moreTrigger}
          mobileTitle="더보기"
          items={[
            { label: "내 계정 설정", onClick: openAccountSettings },
            { label: "차단 목록", onClick: openBlocklist },
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
        <OutlinedButton size={buttonSize} onClick={unfollow}>
          팔로잉 중
        </OutlinedButton>
      ) : (
        <SolidButton size={buttonSize} onClick={follow}>
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
