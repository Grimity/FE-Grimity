import IconComponent from "@/components/Asset/Icon";

import styles from "@/components/Pagination/Pagination.module.scss";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  postsLength: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  postsLength,
  onPageChange,
}: PaginationProps) {
  const getPageRange = (currentPage: number, totalPages: number) => {
    let start = Math.max(1, currentPage - 4);
    const end = Math.min(start + 9, totalPages);

    if (end === totalPages) {
      start = Math.max(1, end - 9);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <section className={styles.pagination}>
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
  );
}
