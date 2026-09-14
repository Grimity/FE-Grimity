import { useEffect } from "react";
import { useRouter } from "next/router";

import { useAuthStore } from "@/states/authStore";
import { useModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";

import { useUserDataByUrl } from "@/api/users/getId";

import ProfileActions from "@/components/ProfilePage/Profile/ProfileActions/ProfileActions";
import ProfileCover from "@/components/ProfilePage/Profile/ProfileCover/ProfileCover";
import ProfileImage from "@/components/ProfilePage/Profile/ProfileImage/ProfileImage";
import ProfileDetails from "@/components/ProfilePage/Profile/ProfileDetails/ProfileDetails";

import { useProfileImages } from "./hooks/useProfileImages";
import { ProfileProps } from "@/components/ProfilePage/Profile/Profile.types";

import styles from "./Profile.module.scss";

export default function Profile({ isMyProfile, id, url }: ProfileProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openModal = useModalStore((state) => state.openModal);
  const { isMobile } = useDeviceStore();
  const { pathname } = useRouter();

  const { data: userData, refetch: refetchUserData } = useUserDataByUrl(url);

  const { profileImage, coverImage, changeProfileImage, addCover, deleteCover } =
    useProfileImages(userData, refetchUserData);

  useEffect(() => {
    refetchUserData();
  }, [pathname]);

  const openFollowModal = (type: "FOLLOWER" | "FOLLOWING") => {
    openModal({
      type,
      data: { title: userData?.name, hideCloseButton: true },
      isFill: isMobile,
    });
  };

  if (!userData) return <div className={styles.container} />;

  return (
    <div className={styles.container}>
      <ProfileCover
        userData={userData}
        coverImage={coverImage}
        isMyProfile={isMyProfile}
        handleAddCover={addCover}
        handleDeleteImage={deleteCover}
      />
      <section className={styles.infoContainer}>
        <div className={styles.infoWrapper}>
          <ProfileImage
            profileImage={profileImage}
            isMyProfile={isMyProfile}
            handleFileChange={changeProfileImage}
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
      </section>
    </div>
  );
}
