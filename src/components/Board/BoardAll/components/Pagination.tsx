import Link from "next/link";
import styles from "../BoardAll.module.scss";
import IconComponent from "@/components/Asset/Icon";
import Button from "@/components/Button/Button";
import Icon from "@/components/Asset/IconTemp";
import { PATH_ROUTES } from "@/constants/routes";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  postsLength: number;
  isDetail?: boolean;
  isMobile: boolean;
  isLoggedIn: boolean;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  postsLength,
  isDetail,
  isMobile,
  isLoggedIn,
  onPageChange,
}: PaginationProps) {
  const getPageRange = (currentPage: number, totalPages: number) => {
    let start = Math.max(1, currentPage - 4);
    let end = Math.min(start + 9, totalPages);

    if (end === totalPages) {
      start = Math.max(1, end - 9);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className={styles.paginationContainer}>
      <section className={`${styles.pagination} ${isDetail ? styles.paginationDetail : ""}`}>
        <button
          className={styles.paginationArrow}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <IconComponent name="paginationLeft" size={24} />
        </button>
        {getPageRange(currentPage, totalPages).map((pageNum) => (
          <button
            key={pageNum}
            className={currentPage === pageNum ? styles.active : ""}
            onClick={() => onPageChange(pageNum)}
          >
            {pageNum}
          </button>
        ))}
        <button
          className={styles.paginationArrow}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || postsLength === 0}
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
  );
}
