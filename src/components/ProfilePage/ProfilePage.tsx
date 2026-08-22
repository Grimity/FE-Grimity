import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { useUserDataByUrl } from "@/api/users/getId";
import { useUserFeeds } from "@/api/users/getIdFeeds";
import { useUserPosts } from "@/api/users/getIdPosts";
import { useModalStore } from "@/states/modalStore";
import { useDeviceStore } from "@/states/deviceStore";
import { useDragScroll } from "@/hooks/useDragScroll";
import useUserBlock from "@/hooks/useUserBlock";

import Profile from "./Profile/Profile";
import { ProfilePageProps } from "./ProfilePage.types";
import FeedAlbumEditor from "./FeedAlbumEditor/FeedAlbumEditor";
import ResponsiveMenu from "./shared/ResponsiveMenu/ResponsiveMenu";

import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import ToastContainer from "@/components/common/PopUp/Toast/ToastContainer";
import Icon from "@/components/common/Icon/Icon";
import Category from "@/components/common/SegmentedControl/Category/Category";
import Tab from "@/components/common/SegmentedControl/Tab/Tab";
import Album from "@/components/common/Card/Album/Album";
import Empty from "@/components/common/Empty/Empty";
import TextButton from "@/components/common/Button/TextButton/TextButton";
import IconButton from "@/components/common/Button/IconButton/IconButton";
import Navigation from "@/components/common/Pagination/Navigation/Navigation";

import styles from "./ProfilePage.module.scss";

type SortOption = "latest" | "like" | "oldest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "like", label: "좋아요순" },
  { value: "oldest", label: "오래된순" },
];

const PAGE_SIZE = 12;

export default function ProfilePage({ isMyProfile, id, url }: ProfilePageProps) {
  const router = useRouter();

  const openModal = useModalStore((state) => state.openModal);
  const { isMobile } = useDeviceStore();

  const { query, pathname } = router;
  const currentPage = Number(query.page) || 1;

  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [activeTab, setActiveTab] = useState<"feeds" | "posts">(
    (query.tab as "feeds" | "posts") || "feeds",
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const loadMoreRef = useRef(null);
  const categoryBarRef = useRef<HTMLDivElement>(null);

  const { data: userData } = useUserDataByUrl(url);

  useDragScroll(categoryBarRef as React.RefObject<HTMLElement>, { scrollSpeed: 2 });
  useUserBlock({
    identifier: userData?.id,
    isBlocked: userData?.isBlocked,
  });

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    refetch();
  };

  const handleCategoryClick = (categoryId: string | null) => {
    setActiveCategory(categoryId);
  };

  const handleAddCategoryClick = () => {
    isMobile
      ? openModal({
          type: "ALBUM-EDIT",
          data: {
            title: "앨범 편집",
          },
          isFill: true,
        })
      : openModal({ type: "ALBUM-EDIT" });
  };

  const { data: postsData } = useUserPosts({
    id,
    size: 10,
    page: currentPage,
    enabled: isMyProfile && activeTab === "posts",
  });

  const {
    data: feedsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useUserFeeds({
    id,
    sort: sortBy,
    size: PAGE_SIZE,
    albumId: activeCategory,
  });

  const totalPages = Math.ceil((userData?.postCount || 0) / 10);

  useEffect(() => {
    refetch();
  }, [pathname, activeCategory]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        rootMargin: "100px",
      },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, feedsData?.pages.length]);

  useEffect(() => {
    if (query.tab && (query.tab === "feeds" || query.tab === "posts")) {
      if (query.tab === "posts" && !isMyProfile) {
        setActiveTab("feeds");
        router.push(
          {
            query: { ...query, tab: "feeds" },
          },
          undefined,
          { shallow: true },
        );
      } else {
        setActiveTab(query.tab);
      }
    }
  }, [query.tab, isMyProfile]);

  const handleTabChange = (tab: "feeds" | "posts") => {
    if (tab === "posts" && !isMyProfile) return;

    setActiveTab(tab);
    const { page, ...restQuery } = query;
    router.push(
      {
        query: { ...restQuery, tab },
      },
      undefined,
      { shallow: true },
    );
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } }, undefined, { shallow: true });
    }
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  const allFeeds =
    feedsData?.pages.flatMap((page) =>
      page.feeds.map((feed) => ({
        ...feed,
        albumId: activeCategory || undefined,
      })),
    ) || [];

  return (
    <div className={styles.container}>
      <ToastContainer target="local" />
      {/* 그림 정리 모드 */}
      {isEditMode ? (
        <FeedAlbumEditor
          feeds={allFeeds}
          albums={userData?.albums || []}
          activeAlbum={activeCategory}
          onExitEditMode={toggleEditMode}
        />
      ) : (
        <>
          {/* 기본 모드 */}
          <Profile isMyProfile={isMyProfile} id={id} url={url} />

          <div className={styles.tabBar}>
            <Tab
              size="lg"
              active={activeTab === "feeds"}
              title="그림"
              number={userData?.feedCount}
              onClick={() => handleTabChange("feeds")}
            />
            {isMyProfile && (
              <Tab
                size="lg"
                active={activeTab === "posts"}
                title="글"
                number={userData?.postCount}
                onClick={() => handleTabChange("posts")}
              />
            )}
          </div>

          <div className={styles.feed}>
            <div className={styles.feedContainer}>
              {activeTab === "feeds" && (
                <section className={styles.header}>
                  <div className={styles.categoryContainer}>
                    <div className={styles.categoryBar} ref={categoryBarRef}>
                      <Category
                        active={activeCategory === null}
                        title="전체"
                        onClick={() => handleCategoryClick(null)}
                      />
                      {userData?.albums?.map((album) => (
                        <Category
                          key={album.id}
                          active={activeCategory === album.id}
                          title={album.name}
                          showNumber
                          number={album.feedCount}
                          onClick={() => handleCategoryClick(album.id)}
                        />
                      ))}
                    </div>
                    {isMyProfile && (
                      <IconButton
                        variant="outlined"
                        icon={<Icon name="folder-edit" size={16} />}
                        onClick={handleAddCategoryClick}
                        aria-label="앨범 편집"
                        className={styles.addCategoryBtn}
                      />
                    )}
                  </div>
                </section>
              )}
              {activeTab === "feeds" && (
                <div className={styles.resultsBar}>
                  <div className={styles.resultsLabel}>
                    <span>게시물</span>
                    <span className={styles.resultsCount}>{userData?.feedCount ?? 0}건</span>
                  </div>
                  <div className={styles.rightBar}>
                    {isMyProfile && (
                      <TextButton
                        variant="assistive"
                        size="regular"
                        iconLeft={<Icon name="sort-horizontal" size={16} />}
                        onClick={toggleEditMode}
                        disabled={allFeeds.length === 0}
                      >
                        그림 정리
                      </TextButton>
                    )}
                    <ResponsiveMenu
                      mobileTitle="정렬"
                      trigger={
                        <button type="button" className={styles.sortTrigger}>
                          <span>
                            {sortOptions.find((option) => option.value === sortBy)?.label ??
                              "최신순"}
                          </span>
                          <Icon name="chevron-down" size={16} />
                        </button>
                      }
                      items={sortOptions.map((option) => ({
                        label: option.label,
                        selected: sortBy === option.value,
                        onClick: () => handleSortChange(option.value),
                      }))}
                    />
                  </div>
                </div>
              )}
              {activeTab === "feeds" ? (
                allFeeds.length === 0 ? (
                  <Empty
                    size="xl"
                    iconName={isMyProfile ? "illust-upload-success" : "illust-result-null"}
                    title={isMyProfile ? "첫 그림을 업로드해보세요" : "업로드한 그림이 없어요"}
                    buttonLabel={isMyProfile ? "그림 업로드" : undefined}
                    onButtonClick={isMyProfile ? () => router.push("/write") : undefined}
                  />
                ) : (
                  <section className={styles.cardContainer}>
                    {allFeeds.map((feed, index) => (
                      <Album
                        key={`${feed.id}-${index}`}
                        variant="mainTitle"
                        imageUrl={feed.thumbnail}
                        title={feed.title}
                        nickname={userData?.name ?? ""}
                        likeCount={feed.likeCount}
                        viewCount={feed.viewCount}
                        feedHref={`/feeds/${feed.id}`}
                      />
                    ))}
                    {hasNextPage && <div ref={loadMoreRef} />}
                  </section>
                )
              ) : (
                isMyProfile && (
                  <section>
                    {!postsData || postsData.length === 0 ? (
                      <Empty
                        size="xl"
                        title="첫 글을 업로드해보세요"
                        buttonLabel="글 업로드"
                        onButtonClick={() => router.push("/board")}
                      />
                    ) : (
                      <>
                        <div className={styles.postContainer}>
                          {postsData.map((post) => (
                            <AllCard key={post.id} post={post} case="my-posts" />
                          ))}
                        </div>
                        {totalPages > 1 && (
                          <section className={styles.pagination}>
                            <Navigation
                              currentPage={currentPage}
                              totalPages={totalPages}
                              onPageChange={handlePageChange}
                            />
                          </section>
                        )}
                      </>
                    )}
                  </section>
                )
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
