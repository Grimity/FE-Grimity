import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

import { useUserDataByUrl } from "@/api/users/getId";
import { useDeviceStore } from "@/states/deviceStore";

import ToastContainer from "@/components/common/PopUp/Toast/ToastContainer";
import Tab from "@/components/common/SegmentedControl/Tab/Tab";

import ProfileInfo from "./Profile/Profile";
import ProfileCover from "./Profile/ProfileCover/ProfileCover";
import { useProfileImages } from "./Profile/hooks/useProfileImages";
import FeedsSection from "./FeedsSection/FeedsSection";
import PostsSection from "./PostsSection/PostsSection";
import { useProfileTab } from "./hooks/useProfileTab";
import { useBlockedProfileToast } from "./hooks/useBlockedProfileToast";
import type { ProfilePageProps } from "./ProfilePage.types";

import styles from "./ProfilePage.module.scss";

// 앨범 편집 모드에서만 필요한 컴포넌트라 초기 번들에서 분리한다
const AlbumEditor = dynamic(() => import("./AlbumEditor/AlbumEditor"));

export default function ProfilePage({ isMyProfile, id, url }: ProfilePageProps) {
  const { isTablet } = useDeviceStore();
  const { pathname } = useRouter();

  const { data: userData, refetch: refetchUserData } = useUserDataByUrl(url);
  const { profileImage, coverImage, changeProfileImage, addCover, deleteCover } =
    useProfileImages(userData, refetchUserData);
  useBlockedProfileToast(userData?.id, userData?.isBlocked, userData?.isBlocking);

  useEffect(() => {
    refetchUserData();
  }, [pathname, refetchUserData]);

  const { activeTab, changeTab } = useProfileTab();

  // 두 편집 모드 모두 프로필 헤더를 가리고 화면 전체를 차지한다
  const [isEditingFeeds, setIsEditingFeeds] = useState(false);
  const [isEditingAlbums, setIsEditingAlbums] = useState(false);

  return (
    <div className={styles.container}>
      <ToastContainer target="local" />
      {isEditingAlbums ? (
        <AlbumEditor
          onExit={() => {
            setIsEditingAlbums(false);
            refetchUserData();
          }}
        />
      ) : (
        <>
          {!isEditingFeeds && userData && (
            <ProfileCover
              userData={userData}
              coverImage={coverImage}
              isMyProfile={isMyProfile}
              handleAddCover={addCover}
              handleDeleteImage={deleteCover}
            />
          )}
          <div className={isEditingFeeds ? styles.editorContent : styles.content}>
            {!isEditingFeeds && (
              <section className={styles.profileDetails}>
                {userData && (
                  <ProfileInfo
                    isMyProfile={isMyProfile}
                    id={id}
                    userData={userData}
                    profileImage={profileImage}
                    onChangeProfileImage={changeProfileImage}
                    refetchUserData={refetchUserData}
                  />
                )}
                <div className={styles.tabBar}>
                  <Tab
                    size={isTablet ? "md" : "lg"}
                    active={activeTab === "feeds"}
                    title="그림"
                    number={userData?.feedCount}
                    onClick={() => changeTab("feeds")}
                  />
                  <Tab
                    size={isTablet ? "md" : "lg"}
                    active={activeTab === "posts"}
                    title="글"
                    number={userData?.postCount}
                    onClick={() => changeTab("posts")}
                  />
                </div>
              </section>
            )}

            {activeTab === "feeds" ? (
              <FeedsSection
                userId={id}
                isMyProfile={isMyProfile}
                authorName={userData?.name ?? ""}
                feedCount={userData?.feedCount ?? 0}
                albums={userData?.albums ?? []}
                isEditMode={isEditingFeeds}
                onToggleEditMode={() => {
                  setIsEditingFeeds((prev) => !prev);
                  if (isEditingFeeds) refetchUserData();
                }}
                onEditAlbums={() => setIsEditingAlbums(true)}
              />
            ) : (
              <PostsSection
                userId={id}
                isMyProfile={isMyProfile}
                postCount={userData?.postCount ?? 0}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}
