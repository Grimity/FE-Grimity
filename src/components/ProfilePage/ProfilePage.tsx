import { useEffect, useRef, useState } from "react";
// import { useUserData } from "@/api/users/getId";
import { useUserDataByUrl } from "@/api/users/getId";
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
import Pagination from "../Pagination/Pagination";

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
  const { data: userData } = useUserDataByUrl(url);
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
    if (page < 1 || page > totalPages) return;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
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
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
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
