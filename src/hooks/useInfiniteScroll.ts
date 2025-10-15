import { useEffect, useRef } from "react";

interface UseInfiniteScrollOptions {
  hasNextPage: boolean;
  isFetching: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
}

export const useInfiniteScroll = ({
  hasNextPage,
  isFetching,
  onLoadMore,
  rootMargin = "100px",
}: UseInfiniteScrollOptions) => {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetching) {
          onLoadMore();
        }
      },
      { rootMargin },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetching, onLoadMore, rootMargin]);

  return { loadMoreRef };
};