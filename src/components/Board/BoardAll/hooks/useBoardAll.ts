import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { PostResponse, usePostsLatest, usePostsNotices } from "@/api/posts/getPosts";
import { usePostSearch } from "@/api/posts/getPostsSearch";
import { useToast } from "@/hooks/useToast";
import { SortOption, POSTS_PER_PAGE } from "@/components/Board/BoardAll/constants";

interface UseBoardAllProps {
  isDetail?: boolean;
}

export const useBoardAll = ({ isDetail }: UseBoardAllProps) => {
  const [searchBy, setSearchBy] = useState<SortOption>("combined");
  const [keyword, setKeyword] = useState("");

  const router = useRouter();
  const { query, pathname } = router;
  const { showToast } = useToast();

  const currentType = (query.type as string) || "all";
  const currentPage = Number(query.page) || 1;
  const postsPerPage = isDetail ? POSTS_PER_PAGE.DETAIL : POSTS_PER_PAGE.NORMAL;
  const isSearching = !!query.keyword;

  const { data: noticesData } = usePostsNotices(!isSearching);
  const {
    data: latestData,
    isLoading,
    refetch,
  } = usePostsLatest(
    {
      type: currentType.toUpperCase() as "ALL" | "NORMAL" | "QUESTION" | "FEEDBACK",
      page: currentPage,
      size: postsPerPage,
    },
    !isSearching,
  );

  const { data: searchData, isLoading: isSearchLoading } = usePostSearch(
    isSearching
      ? {
          searchBy: (query.searchBy as "combined" | "name") || "combined",
          size: postsPerPage,
          page: currentPage,
          keyword: query.keyword as string,
          type: currentType.toUpperCase() as "ALL" | "NORMAL" | "QUESTION" | "FEEDBACK",
        }
      : null,
  );

  useEffect(() => {
    refetch();
  }, [pathname, refetch]);

  const posts: PostResponse[] = !router.isReady
    ? []
    : isSearching
      ? (searchData?.posts ?? [])
      : noticesData && latestData
        ? currentPage === 1 && !isDetail
          ? [...noticesData, ...latestData.posts]
          : latestData.posts
        : [];

  const totalCount = !router.isReady
    ? 0
    : isSearching
      ? (searchData?.totalCount ?? 0)
      : (latestData?.totalCount ?? 0);

  const totalPages = Math.ceil(totalCount / postsPerPage);

  const handleTabChange = (type: "all" | "normal" | "question" | "feedback") => {
    const newQuery: { type: string; page: number; searchBy?: string; keyword?: string } = {
      ...query,
      type: type,
      page: 1,
    };

    delete newQuery.searchBy;
    delete newQuery.keyword;

    setKeyword("");
    router.push({ query: newQuery });
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } });
    }
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

  const handleSortChange = (option: SortOption) => {
    setSearchBy(option);
    router.push({
      pathname: "/board",
      query: { ...query, searchBy: option, page: 1 },
    });
  };

  return {
    searchBy,
    posts,
    keyword,
    setKeyword,

    currentType,
    currentPage,
    totalPages,

    isLoading: isLoading || isSearchLoading,

    handleTabChange,
    handlePageChange,
    handleSearch,
    handleSearchKeyDown,
    handleSortChange,
  };
};
