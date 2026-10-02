import { useAuthStore } from "@/states/authStore";
import { useModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";

import ProfileActions from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions";
import ProfileImage from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage";
import ProfileDetails from "@/components/ProfilePage/Profile/ProfileDetails/ProfileDetails";

import type { ProfileProps } from "@/components/ProfilePage/Profile/Profile.types";

import styles from "./Profile.module.scss";

export default function ProfileInfo({
  isMyProfile,
  id,
  userData,
  profileImage,
  onChangeProfileImage,
  refetchUserData,
}: ProfileProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openModal = useModalStore((state) => state.openModal);
  const { isMobile } = useDeviceStore();

  const openFollowModal = (type: "FOLLOWER" | "FOLLOWING") => {
    openModal({
      type,
      data: { title: userData?.name, hideCloseButton: true },
      isFill: isMobile,
    });
  };

  const image = (
    <ProfileImage
      profileImage={profileImage}
      isMyProfile={isMyProfile}
      isMobile={isMobile}
      handleFileChange={onChangeProfileImage}
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
          handleOpenFollowerModal={() => openFollowModal("FOLLOWER")}
          handleOpenFollowingModal={() => openFollowModal("FOLLOWING")}
        >
          {!isMobile && actions}
        </ProfileDetails>
      </div>
    </div>
  );
}
