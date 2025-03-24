import { useRouter } from "next/router";
import styles from "./SearchPost.module.scss";
import Loader from "@/components/Layout/Loader/Loader";
import { usePostSearch } from "@/api/posts/getPostsSearch";
import AllCard from "@/components/Board/BoardAll/AllCard/AllCard";
import Dropdown from "@/components/Dropdown/Dropdown";
import Button from "@/components/Button/Button";
import IconComponent from "@/components/Asset/Icon";
import { useState } from "react";
import Pagination from "@/components/Pagination/Pagination";

type SortOption = "accuracy";

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "accuracy", label: "정확도순" },
];

export default function SearchPost() {
  const router = useRouter();
  const { query } = router;
  const keyword = query.keyword as string;
  const currentPage = Number(query.page) || 1;
  const [sortBy, setSortBy] = useState<SortOption>("accuracy");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const { data, isLoading } = usePostSearch({
    searchBy: "combined",
    page: currentPage,
    size: 10,
    keyword: keyword,
  });

  const posts = data?.posts || [];
  const totalPages = Math.ceil((data?.totalCount ? Number(data.totalCount) : 0) / 10);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      router.push({ query: { ...query, page } });
    }
  };

  const handleDropdownToggle = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);
  };

  const handleSortChange = (option: SortOption) => {
    setSortBy(option);
  };

  if (isLoading) return <Loader />;

  return (
    <>
      <section className={styles.results}>
        {data && data.totalCount === 0 ? (
          <div className={styles.noResult}>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div>
            <div className={styles.sortWrapper}>
              <h2 className={styles.title}>글 {data ? data.totalCount : 0}개</h2>
              <div className={styles.sort}>
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
                      {sortOptions.find((option) => option.value === sortBy)?.label || "정확도순"}
                    </Button>
                  }
                />
              </div>
            </div>
            <div className={styles.cards}>
              {posts.map((post) => (
                <AllCard key={post.id} post={post} case="board" />
              ))}
            </div>
          </div>
        )}
      </section>
      {totalPages > 1 && posts.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
}
