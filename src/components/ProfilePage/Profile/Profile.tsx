import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useModal } from "@/hooks/useModal";

import ProfileActions from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions";
import ProfileImage from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage";
import ProfileDetails from "@/components/ProfilePage/Profile/ProfileDetails/ProfileDetails";
import Follow from "@/components/Modal/Follow/Follow";

import type { ProfileProps } from "@/components/ProfilePage/Profile/Profile.types";

import styles from "./Profile.module.scss";
import modalStyles from "@/components/Modal/Modal.module.scss";

export default function ProfileInfo({
  isMyProfile,
  id,
  userData,
  profileImage,
  onEditProfileImage,
  refetchUserData,
}: ProfileProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { openModal } = useModal();
  const { isMobile } = useDeviceStore();

  const openFollowModal = (initialTab: "follower" | "following") => {
    openModal(
      (close) => <Follow initialTab={initialTab} title={userData?.name} onClose={close} />,
      { className: modalStyles.followListModal },
      { isFill: isMobile, title: userData?.name, mobileHeader: "back" },
    );
  };

  const image = (
    <ProfileImage
      profileImage={profileImage}
      isMyProfile={isMyProfile}
      isMobile={isMobile}
      onEdit={onEditProfileImage}
    />
  );

  const actions = isLoggedIn && (
    <ProfileActions
      userId={id}
      userData={userData}
      isMyProfile={isMyProfile}
      refetchUserData={refetchUserData}
    />
  );

  // 모바일은 아바타와 액션 버튼이 첫 줄에 나란히 있고, 이름·소개·링크가 그 아래로 내려간다
  return (
    <div className={styles.infoWrapper}>
      {isMobile ? (
        <div className={styles.mobileTopRow}>
          {image}
          {actions}
        </div>
      ) : (
        image
      )}
      <div className={styles.detailsContainer}>
        <ProfileDetails
          userData={userData}
          isMyProfile={isMyProfile}
          handleOpenFollowerModal={() => openFollowModal("follower")}
          handleOpenFollowingModal={() => openFollowModal("following")}
        >
          {!isMobile && actions}
        </ProfileDetails>
      </div>
    </div>
  );
}
