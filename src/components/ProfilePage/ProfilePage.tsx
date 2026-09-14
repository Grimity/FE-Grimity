import { useState } from "react";
import dynamic from "next/dynamic";

import { useUserDataByUrl } from "@/api/users/getId";
import { useDeviceStore } from "@/states/deviceStore";
import useUserBlock from "@/hooks/useUserBlock";

import ToastContainer from "@/components/common/PopUp/Toast/ToastContainer";
import Tab from "@/components/common/SegmentedControl/Tab/Tab";

import Profile from "./Profile/Profile";
import FeedsSection from "./FeedsSection/FeedsSection";
import PostsSection from "./PostsSection/PostsSection";
import { useProfileTab } from "./hooks/useProfileTab";
import type { ProfilePageProps } from "./ProfilePage.types";

import styles from "./ProfilePage.module.scss";

// 앨범 편집 모드에서만 필요한 컴포넌트라 초기 번들에서 분리한다
const AlbumEditor = dynamic(() => import("./AlbumEditor/AlbumEditor"));

export default function ProfilePage({ isMyProfile, id, url }: ProfilePageProps) {
  const { isTablet } = useDeviceStore();

  const { data: userData } = useUserDataByUrl(url);
  useUserBlock({ identifier: userData?.id, isBlocked: userData?.isBlocked });

  const { activeTab, changeTab } = useProfileTab(isMyProfile);

  // 두 편집 모드 모두 프로필 헤더를 가리고 화면 전체를 차지한다
  const [isEditingFeeds, setIsEditingFeeds] = useState(false);
  const [isEditingAlbums, setIsEditingAlbums] = useState(false);

  return (
    <div className={styles.container}>
      <ToastContainer target="local" />
      {isEditingAlbums ? (
        <AlbumEditor onExit={() => setIsEditingAlbums(false)} />
      ) : (
        <>
          {!isEditingFeeds && (
            <>
              <Profile isMyProfile={isMyProfile} id={id} url={url} />

              <div className={styles.tabBar}>
                <Tab
                  size={isTablet ? "md" : "lg"}
                  active={activeTab === "feeds"}
                  title="그림"
                  number={userData?.feedCount}
                  onClick={() => changeTab("feeds")}
                />
                {isMyProfile && (
                  <Tab
                    size={isTablet ? "md" : "lg"}
                    active={activeTab === "posts"}
                    title="글"
                    number={userData?.postCount}
                    onClick={() => changeTab("posts")}
                  />
                )}
              </div>
            </>
          )}

          {activeTab === "feeds" ? (
            <FeedsSection
              userId={id}
              isMyProfile={isMyProfile}
              authorName={userData?.name ?? ""}
              feedCount={userData?.feedCount ?? 0}
              albums={userData?.albums ?? []}
              isEditMode={isEditingFeeds}
              onToggleEditMode={() => setIsEditingFeeds((prev) => !prev)}
              onEditAlbums={() => setIsEditingAlbums(true)}
            />
          ) : (
            isMyProfile && <PostsSection userId={id} postCount={userData?.postCount ?? 0} />
          )}
        </>
      )}
    </div>
  );
}
