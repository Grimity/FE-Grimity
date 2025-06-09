import { useRouter } from "next/router";
import styles from "./BoardAll.module.scss";
import Title from "@/components/Layout/Title/Title";
import Link from "next/link";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import AllCard from "./AllCard/AllCard";
import { useEffect, useState } from "react";
import { PostResponse, usePostsLatest, usePostsNotices } from "@/api/posts/getPosts";
import { useAuthStore } from "@/states/authStore";
import { useDeviceStore } from "@/states/deviceStore";
import { BoardAllProps } from "./BoardAll.types";
import { useToast } from "@/hooks/useToast";
import Dropdown from "@/components/Dropdown/Dropdown";
import { useIsMobile } from "@/hooks/useIsMobile";
import Loader from "@/components/Layout/Loader/Loader";
import { usePostSearch } from "@/api/posts/getPostsSearch";
import Icon from "@/components/Asset/IconTemp";
import { PATH_ROUTES } from "@/constants/routes";

type SortOption = "combined" | "name";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "combined", label: "제목+내용" },
  { value: "name", label: "글쓴이" },
];

export default function BoardAll({ isDetail, hasChip }: BoardAllProps) {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const [searchBy, setSearchBy] = useState<SortOption>("combined");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [posts, setPosts] = useState<PostResponse[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const router = useRouter();
  const { query } = router;
  const currentType = (query.type as string) || "all";
  const currentPage = Number(query.page) || 1;
  const totalPages = Math.ceil(totalCount / (isDetail ? 5 : 10));
  const { showToast } = useToast();
  const isMobile = useDeviceStore((state) => state.isMobile);
  useIsMobile();
  const { pathname } = useRouter();
  const postsPerPage = isDetail ? 5 : 10;

  const { data: noticesData } = usePostsNotices();
  const {
    data: latestData,
    isLoading,
    refetch,
  } = usePostsLatest({
    type: currentType.toUpperCase() as "ALL" | "QUESTION" | "FEEDBACK",
    page: currentPage,
    size: postsPerPage,
  });

  const { data: searchData, isLoading: isSearchLoading } = usePostSearch(
    query.keyword
      ? {
          searchBy: (query.searchBy as "combined" | "name") || "combined",
          size: postsPerPage,
          page: currentPage,
          keyword: query.keyword as string,
        }
      : null,
  );

  useEffect(() => {
    refetch();
  }, [pathname]);

  useEffect(() => {
    if (!router.isReady) return;

    if (query.keyword) {
      if (searchData) {
        setPosts(searchData.posts);
        setTotalCount(searchData.totalCount);
      }
    } else if (noticesData && latestData) {
      const mergedPosts =
        currentPage === 1 && !isDetail ? [...noticesData, ...latestData.posts] : latestData.posts;

      setPosts(mergedPosts);
      setTotalCount(latestData.totalCount + (currentPage === 1 ? noticesData.length : 0));
    }
  }, [
    currentType,
    currentPage,
    query.keyword,
    router.isReady,
    noticesData,
    latestData,
    searchData,
  ]);

  const handleTabChange = (type: "all" | "question" | "feedback") => {
    const newQuery: { type: string; page: number; searchBy?: string; keyword?: string } = {
      ...query,
      type: type,
      page: 1,
    };

    delete newQuery.searchBy;
    delete newQuery.keyword;

    router.push({ query: newQuery });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } });
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

  const handleSearch = () => {
    const trimmedKeyword = keyword.trim();
    if (trimmedKeyword.length < 2) {
      if (!trimmedKeyword) {
        router.push(
          {
            pathname: "/board",
            query: {
              ...query,
              type: currentType,
              page: 1,
            },
          },
          undefined,
          { shallow: true },
        );
      } else {
        showToast("두 글자 이상 입력해주세요.", "warning");
      }
      return;
    }

    router.push(
      {
        pathname: "/board",
        query: {
          ...query,
          type: currentType,
          searchBy,
          keyword: trimmedKeyword,
          page: 1,
        },
      },
      undefined,
      { shallow: true },
    );
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent) => {
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handleSortChange = (option: SortOption) => {
    setSearchBy(option);
    router.push({
      pathname: "/board",
      query: { ...query, searchBy: option, page: 1 },
    });
  };

  if (isLoading || isSearchLoading) return <Loader />;

  return (
    <div className={styles.container}>
      {isMobile && currentType === "all" && !isDetail && (
        <div className={styles.search}>
          <div className={styles.dropdown}>
            <Dropdown
              menuItems={sortOptions.map((option) => ({
                label: option.label,
                value: option.value,
                onClick: () => handleSortChange(option.value),
              }))}
              onOpenChange={handleDropdownToggle}
              trigger={
                <button className={styles.dropdownBtn}>
                  {sortOptions.find((option) => option.value === searchBy)?.label || "제목+내용"}
                  <Icon
                    icon="chevronDown"
                    size="sm"
                    className={`${styles.chevron} ${isDropdownOpen ? styles.rotate : ""}`}
                  />
                </button>
              }
            />
          </div>
          <div className={styles.searchbarContainer}>
            <input
              placeholder="검색어를 입력해주세요"
              className={styles.input}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearchKeyDown}
            />
            <button onClick={handleSearch} className={styles.searchBtn}>
              <Icon icon="search" size="2xl" className={styles.searchIcon} />
            </button>
          </div>
        </div>
      )}
      {isDetail ? <Title>자유게시판 최신글</Title> : <Title>전체 글</Title>}
      {!isDetail && (
        <div className={styles.header}>
          <section className={styles.types}>
            <button
              className={`${styles.type} ${currentType === "all" ? styles.active : ""}`}
              onClick={() => handleTabChange("all")}
            >
              전체
            </button>
            <IconComponent name="dot" size={3} />
            <button
              className={`${styles.type} ${currentType === "question" ? styles.active : ""}`}
              onClick={() => handleTabChange("question")}
            >
              질문
            </button>
            <IconComponent name="dot" size={3} />
            <button
              className={`${styles.type} ${currentType === "feedback" ? styles.active : ""}`}
              onClick={() => handleTabChange("feedback")}
            >
              피드백
            </button>
          </section>
          {!isMobile && currentType === "all" && (
            <div className={styles.search}>
              <div className={styles.dropdown}>
                <Dropdown
                  menuItems={sortOptions.map((option) => ({
                    label: option.label,
                    value: option.value,
                    onClick: () => handleSortChange(option.value),
                  }))}
                  onOpenChange={handleDropdownToggle}
                  trigger={
                    <button className={styles.dropdownBtn}>
                      {sortOptions.find((option) => option.value === searchBy)?.label ||
                        "제목+내용"}
                      <Icon
                        icon="chevronDown"
                        size="sm"
                        className={`${styles.chevron} ${isDropdownOpen ? styles.rotate : ""}`}
                      />
                    </button>
                  }
                />
              </div>
              <div className={styles.searchbarContainer}>
                <input
                  placeholder="검색어를 입력해주세요"
                  className={styles.input}
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                />
                <button onClick={handleSearch} className={styles.searchBtn}>
                  <Icon icon="search" size="2xl" className={styles.searchIcon} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <section className={styles.cards}>
        {posts.map((post) => (
          <AllCard key={post.id} post={post} case="board" hasChip={hasChip} />
        ))}
      </section>
      {posts.length === 0 && <div className={styles.noResults}>검색 결과가 없어요</div>}

      <div className={styles.paginationContainer}>
        <section className={`${styles.pagination} ${isDetail ? styles.paginationDetail : ""}`}>
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
            disabled={currentPage === totalPages || posts.length === 0}
          >
            <IconComponent name="paginationRight" size={24} />
          </button>
        </section>

        {!isMobile && isLoggedIn && !isDetail && (
          <Link href={PATH_ROUTES.BOARD_WRITE} className={styles.uploadBtn}>
            <Button type="outlined-assistive" leftIcon={<Icon icon="detailWrite" size="2xl" />}>
              글쓰기
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
