import IconComponent from "../Asset/Icon";
import styles from "./Pagination.module.scss";
import { PaginationProps } from "./Pagination.types";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isDetail,
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
    <section className={`${styles.pagination} ${isDetail && styles.paginationDetail}`}>
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
        disabled={currentPage === totalPages}
      >
        <IconComponent name="paginationRight" size={24} />
      </button>
    </section>
  );
}
