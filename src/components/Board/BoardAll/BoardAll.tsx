import Link from "next/link";

import { useAuthStore } from "@/states/authStore";

import Title from "@/components/Layout/Title/Title";
import BoardPostItem from "@/components/Board/BoardAll/BoardPostItem/BoardPostItem";
import Loader from "@/components/Layout/Loader/Loader";
import SearchSection from "@/components/Board/BoardAll/SearchSection";
import TabNavigation from "@/components/Board/BoardAll/TabNavigation";
import OutlinedButton from "@/components/common/Button/OutlinedButton/OutlinedButton";
import Empty from "@/components/common/Empty/Empty";
import Navigation from "@/components/common/Pagination/Navigation/Navigation";

import { useDeviceStore } from "@/states/deviceStore";
import { useBoardAll } from "@/components/Board/BoardAll/hooks/useBoardAll";

import { PATH_ROUTES } from "@/constants/routes";

import type { BoardAllProps } from "@/components/Board/BoardAll/BoardAll.types";

import styles from "@/components/Board/BoardAll/BoardAll.module.scss";

export default function BoardAll({ isDetail }: BoardAllProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const { isMobile } = useDeviceStore();

  const {
    searchBy,
    posts,
    keyword,
    setKeyword,
    currentType,
    currentPage,
    totalPages,
    isLoading,
    handleTabChange,
    handlePageChange,
    handleSearchKeyDown,
    handleSortChange,
  } = useBoardAll({ isDetail });

  if (isLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {isDetail ? (
        <Title>자유게시판 최신글</Title>
      ) : (
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>자유게시판</h1>
          {isLoggedIn && (
            <Link href={PATH_ROUTES.BOARD_WRITE}>
              <OutlinedButton>글쓰기</OutlinedButton>
            </Link>
          )}
        </div>
      )}

      {isMobile && currentType === "all" && !isDetail && (
        <SearchSection
          searchBy={searchBy}
          keyword={keyword}
          onKeywordChange={setKeyword}
          onSearchKeyDown={handleSearchKeyDown}
          onSortChange={handleSortChange}
        />
      )}

      {!isDetail && (
        <div className={styles.header}>
          <TabNavigation currentType={currentType} onTabChange={handleTabChange} />
          {!isMobile && currentType === "all" && (
            <SearchSection
              searchBy={searchBy}
              keyword={keyword}
              onKeywordChange={setKeyword}
              onSearchKeyDown={handleSearchKeyDown}
              onSortChange={handleSortChange}
            />
          )}
        </div>
      )}

      {posts.length === 0 ? (
        <Empty iconName="illust-result-null" title="검색 결과가 없어요" />
      ) : (
        <section className={styles.cards}>
          {posts.map((post) => (
            <BoardPostItem key={post.id} post={post} />
          ))}
        </section>
      )}

      {posts.length > 0 && totalPages > 1 && (
        <div className={styles.paginationWrapper}>
          <Navigation
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            maxVisiblePages={isMobile ? 5 : 10}
          />
        </div>
      )}
    </div>
  );
}
