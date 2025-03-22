import { useEffect, useRef, useState } from "react";
import { useUserData } from "@/api/users/getId";
import { useUserFeeds } from "@/api/users/getIdFeeds";
import { useUserPosts } from "@/api/users/getIdPosts";
import Profile from "./Profile/Profile";
import styles from "./ProfilePage.module.scss";
import { ProfilePageProps } from "./ProfilePage.types";
import ProfileCard from "../Layout/ProfileCard/ProfileCard";
import Dropdown from "../Dropdown/Dropdown";
import Button from "../Button/Button";
import IconComponent from "../Asset/Icon";
import Link from "next/link";
import { useRouter } from "next/router";
import AllCard from "../Board/BoardAll/AllCard/AllCard";

type SortOption = "latest" | "like" | "oldest";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "latest", label: "최신순" },
  { value: "like", label: "좋아요순" },
  { value: "oldest", label: "오래된순" },
];

const PAGE_SIZE = 12;

export default function ProfilePage({ isMyProfile, id, url }: ProfilePageProps) {
  const [sortBy, setSortBy] = useState<SortOption>("latest");
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 });
  const feedsTabRef = useRef<HTMLDivElement>(null);
  const postsTabRef = useRef<HTMLDivElement>(null);
  const { data: userData } = useUserData(id);
  const loadMoreRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();
  const { query } = router;
  const currentPage = Number(query.page) || 1;
  const [activeTab, setActiveTab] = useState<"feeds" | "posts">(
    (query.tab as "feeds" | "posts") || "feeds",
  );
  const { pathname } = useRouter();

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
  });

  const totalPages = Math.ceil((userData?.postCount || 0) / 10);

  useEffect(() => {
    refetch();
  }, [pathname]);

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
    const activeTabRef = activeTab === "feeds" ? feedsTabRef : postsTabRef;
    if (!activeTabRef.current) return;

    const { offsetWidth, offsetLeft } = activeTabRef.current;
    setIndicatorStyle({ width: offsetWidth, left: offsetLeft });
  }, [activeTab, feedsTabRef.current, postsTabRef.current]);

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

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } }, undefined, { shallow: true });
    }
  };

  const getPageRange = (currentPage: number, totalPages: number) => {
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(start + 9, totalPages);

    if (end === totalPages) {
      start = Math.max(1, end - 9);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  const allFeeds = feedsData?.pages.flatMap((page) => page.feeds) || [];

  return (
    <div className={styles.container}>
      <div className={styles.center}>
        <Profile isMyProfile={isMyProfile} id={id} url={url} />
        <div className={styles.bar}>
          <div
            ref={feedsTabRef}
            className={`${styles.tab} ${activeTab === "feeds" ? styles.active : ""}`}
            onClick={() => handleTabChange("feeds")}
          >
            그림<p className={styles.feedCount}>{userData?.feedCount}</p>
          </div>
          {isMyProfile && (
            <div
              ref={postsTabRef}
              className={`${styles.tab} ${activeTab === "posts" ? styles.active : ""}`}
              onClick={() => handleTabChange("posts")}
            >
              글<p className={styles.feedCount}>{userData?.postCount}</p>
            </div>
          )}
          <div
            className={styles.indicator}
            style={{
              width: `${indicatorStyle.width}px`,
              left: `${indicatorStyle.left}px`,
            }}
          />
        </div>
        <div className={styles.feedContainer}>
          {allFeeds.length !== 0 && activeTab === "feeds" && (
            <section className={styles.header}>
              <div className={styles.sortWrapper}>
                <Dropdown
                  menuItems={sortOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                    onClick: () => handleSortChange(option.value),
                  }))}
                  onOpenChange={handleDropdownToggle}
                  trigger={
                    <Button
                      type="text-assistive"
                      size="l"
                      rightIcon={
                        isDropdownOpen ? (
                          <IconComponent name="arrowUp" size={20} isBtn />
                        ) : (
                          <IconComponent name="arrowDown" size={20} isBtn />
                        )
                      }
                    >
                      {sortOptions.find((option) => option.value === sortBy)?.label || "최신순"}
                    </Button>
                  }
                />
              </div>
            </section>
          )}
          {activeTab === "feeds" ? (
            allFeeds.length === 0 ? (
              isMyProfile ? (
                <div className={styles.empty}>
                  <p className={styles.message}>첫 그림을 업로드해보세요</p>
                  <Link href="/write">
                    <Button size="m" type="filled-primary">
                      그림 업로드
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className={styles.empty}>
                  <p className={styles.message}>아직 업로드한 그림이 없어요</p>
                </div>
              )
            ) : (
              <section className={styles.cardContainer}>
                {allFeeds.map((feed, index) => (
                  <div key={`${feed.id}-${index}`}>
                    <ProfileCard
                      title={feed.title}
                      cards={feed.cards}
                      thumbnail={feed.thumbnail}
                      likeCount={feed.likeCount}
                      commentCount={feed.commentCount}
                      viewCount={feed.viewCount}
                      createdAt={feed.createdAt}
                      id={feed.id}
                    />
                  </div>
                ))}
                {hasNextPage && <div ref={loadMoreRef} />}
              </section>
            )
          ) : (
            isMyProfile && (
              <section>
                {!postsData || postsData.length === 0 ? (
                  <div className={styles.empty}>
                    <p className={styles.message}>첫 글을 업로드해보세요</p>
                    <Link href="/board">
                      <Button size="m" type="filled-primary">
                        자유게시판 바로가기
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className={styles.postContainer}>
                      {postsData.map((post) => (
                        <AllCard key={post.id} post={post} case="my-posts" />
                      ))}
                    </div>
                    <section className={styles.pagination}>
                      <button
                        className={styles.paginationArrow}
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <IconComponent name="paginationLeft" size={24} />
                      </button>
                      {getPageRange(currentPage, totalPages).map((pageNum) => (
                        <button
                          key={pageNum}
                          className={currentPage === pageNum ? styles.active : ""}
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      ))}
                      <button
                        className={styles.paginationArrow}
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <IconComponent name="paginationRight" size={24} />
                      </button>
                    </section>
                  </>
                )}
              </section>
            )
          )}
        </div>
      </div>
    </div>
  );
}
