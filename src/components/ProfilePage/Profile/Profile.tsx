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

  return (
    <div className={styles.infoWrapper}>
      <ProfileImage
        profileImage={profileImage}
        isMyProfile={isMyProfile}
        handleFileChange={onChangeProfileImage}
      />
      <div className={styles.detailsContainer}>
        <ProfileDetails
          userData={userData}
          isMyProfile={isMyProfile}
          isMobile={isMobile}
          handleOpenFollowerModal={() => openFollowModal("FOLLOWER")}
          handleOpenFollowingModal={() => openFollowModal("FOLLOWING")}
        >
          {isLoggedIn && (
            <ProfileActions
              userId={id}
              userData={userData}
              isMyProfile={isMyProfile}
              refetchUserData={refetchUserData}
            />
          )}
        </ProfileDetails>
      </div>
    </div>
  );
}
